const Product = require("../models/productModel");
const userModel = require("../models/userModel");
const validateMongoDbId = require("../utils/validateMongodbId");
const fs = require("fs");

const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudniary");

const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(200).send({
      msg: "product added Successfully",
      newProduct,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
//get a Product
const getaProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById({ _id: id });
    res.status(200).send({
      msg: "Product data Fetched successfully",
      product,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
//get All Products

const getAllProducts = async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    // Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // limiting the fields

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This Page does not exists");
    }
    const product = await query;
    res.status(200).send({
      message: "Product Details",
      product,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//update Product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);

  try {
    const product = await Product.findById(id);
    console.log(product);
    if (!product) {
      res.status(400).send({
        msg: "Product id Not Found",
      });
    } else {
      const updateProduct = await Product.findByIdAndUpdate(
        { _id: id },
        {
          title: req.body?.title,
          slug: req.body?.slug,
          description: req.body?.description,
          price: req.body?.price,
          quantity: req.body?.quantity,
        },
        { new: true }
      );
      console.log(updateProduct);
      res.status(200).send({
        msg: "Product data Updated successfully",
        updateProduct,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById({ _id: id });
    if (!product) {
      res.status(400).send({
        msg: "Product id Not Found",
      });
    } else {
      const delProduct = await Product.findByIdAndDelete({ _id: id });

      res.status(200).send({
        msg: "Product data Deleted successfully",
        delProduct,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//Add t wishlist
const addToWishList = async (req, res) => {
  const { _id } = req.user;
  const { proId } = req.body;
  try {
    const user = await userModel.findById(_id);
    const alreadyAdded = user.wishlist.find((id) => id.toString() === proId);
    let updatedUserDetail;

    if (!alreadyAdded) {
      updatedUserDetail = await userModel.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: proId },
        },
        {
          new: true,
        }
      );
    } else {
      const alreadyAdded = user.wishlist.find((id) => id.toString() != proId);
    
      updatedUserDetail = await userModel.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: proId },
        },
        {
          new: true,
        }
      );
    }

    console.log("alreadyAdded: ", updatedUserDetail);
    res.status(200).send({
      msg: "Product Added to wishList successfully",
      user: updatedUserDetail && updatedUserDetail,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//rating\
const rating = async (req, res) => {
  const { _id } = req.user;
  const { star, proId, comment } = req.body;
  try {
    const product = await Product.findById(proId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        { ratings: { $eleMatch: alreadyRated } },
        { $set: { "ratings.$.star": star, "ratings.$.comment": comment } },
        { new: true }
      );
      res.status(200).send({
        msg: "Product rating updated successfully",
        updateRating,
      });
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        proId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        { new: true }
      );
    }
    const getallratings = await Product.findById(proId);
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalProduct = await Product.findByIdAndUpdate(
      proId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res.status(200).send({
      msg: "Product rating updated successfully",
      finalProduct,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
//uploadPhoto
const uploadImages = async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  console.log(req.files);
  try {
    const uploader = (path) => cloudinaryUploadImg(path);
    const urls = [];
    const files = req.files;
    for (let i = 0; i < req.files.length; i++) {
      console.log(req.files[i].path)
      let locaFilePath = req.files[i].path;
      const newpath = await uploader(locaFilePath);

      urls.push({
        url: newpath?.secure_url,
        asset_id: newpath?.asset_id,
        public_id: newpath?.public_id,
      });
      fs.unlinkSync(locaFilePath);
    }

    const findProduct = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      { new: true }
    );

    res.status(200).send({
      msg: "images uploaded Succssfully",
      findProduct,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//deleteimage
const deleteImages = async (req, res) => {
  console.log(req.files);
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImg(id, "images");
    res.status(200).send({
      message: "Deleted Successfully",
      deleted,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
module.exports = {
  createProduct,
  getaProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating,
  uploadImages,
  deleteImages,
};
