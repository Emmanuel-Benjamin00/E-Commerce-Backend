const error = require("mongoose/lib/error");
const userModel = require("../models/userModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refershToken");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const uniqid = require("uniqid");
// const {
//   transporter,
//   mailOptions,
//   randomStringGenerate,
// } = require("../common/nodeMail");
const dotenv = require("dotenv");
const orderModel = require("../models/orderModel");
dotenv.config();

const createUser = async (req, res) => {
  const { email } = req.body; 
  try {
    const findUser = await userModel.findOne({ email });
    if (!findUser) {
      const newUser = await userModel.create(req.body);
      console.log("New user registered:", newUser);  // Log the created user for debugging
      return res.status(201).send({
        message: "User Registered Successfully",
        newUser,
      });
    } else {
      return res.status(409).send({
        message: `User Already Exists: ${email}`,
      });
    }
  } catch (error) {
    console.error("Error during registration:", error); // Log detailed error message
    return res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



// Login a user
const loginUserCtrl = async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findUser = await userModel.findOne({ email });
  if (findUser && (await findUser.isPasswordMatch(password))) {
    const refreshToken = await generateRefreshToken(findUser?.id);
    const updateUser = await userModel.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.status(200).send({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    res.status(500).send({
      msg: "Invalid User Data",
      error: error.msg,
    });
  }
};
//AdminLogin
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findAdmin = await userModel.findOne({ email });
  if (findAdmin.role !== "admin") {
    res.status(500).send({
      msg: "Not Authorized person",
    });
  }
  if (findAdmin && (await findAdmin.isPasswordMatch(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.status(200).send({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    res.status(500).send({
      msg: "Invalid credentials",
      error: error.msg,
    });
  }
};

//add to wishlist
// const getWishlist = async (req, res) => {
//   const { _id } = req.user;
//   try {
//     const findUser = await userModel.findById(_id).populate("wishlist");
//     res.status(200).send({
//       msg: "",
//       findUser,
//     });
//   } catch (error) {
//     res.status(500).send({
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

//save userAddress
const saveAddress = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updateUser = await findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.status(200).send({
      msg: "address updated Successfully",
      updateUser,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
//handle refresh Token
const handleRefreshToken = async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in cookies");
  const refreshToken = cookie.refreshToken;
  console.log(refreshToken);
  const user = await userModel.findOne({ refreshToken });
  // res.json(user);
  if (!user) throw new Error(" No refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    console.log(decoded);
    if (err || user.id !== decoded.id) {
      throw new Error(" There is something wrong in refersh token");
    }
    const accessToken = generateToken(user?._id);
    res.status(200).send({ accessToken });
  });
};
//get all users
const getAllUsers = async (req, res) => {
  try {
    let users = await userModel.find().populate("wishlist");
    res.status(200).send({
      message: "User Data Fetched Succesffully",
      users,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
//Get a Singleuser
const getaUser = async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const findUser = await userModel.findById(id);
    res.status(200).send({
      message: "User Data Fetched Succesffully",
      findUser,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// delete a user
const deleteaUser = async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const findUser = await userModel.findByIdAndDelete(id);
    res.status(200).send({
      message: "User Data Deleted Succesffully",
      findUser,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
//updata a user

const updateUser = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updateuser = await userModel.findByIdAndUpdate(
      { _id },
      {
        firstname: req.body?.firstname,
        lastname: req.body?.lastname,
        email: req.body?.email,
        mobile: req.body?.mobile,
      },
      {
        new: true,
      }
    );
    console.log("updated user", updateuser);
    res.status(200).send(updateuser);
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
//logout user
const logout = async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in cookies");
  const refreshToken = cookie.refreshToken;
  const user = await userModel.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.status(204).send({ msg: "Logged out successfully" });
  }
  await userModel.findByIdAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.status(200).send({ msg: "Logged out successfully" });
};

//forgot password
// const forgotPassword = async (req, res) => {
//   try {
//     let user = await userModel.findOne({ email: req.body.email });
//     console.log(user);
//     if (user) {
//       const path = process.env.FRONT_END_URL + "/reset-password/" + user._id;
//       mailOptions.to = user.email;
//       mailOptions.html = `Hi ${user.firstname} Please find the OTP  in the following link to reset your password
//       <a href=${path}> Reset password link`;
//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.error("Error sending email: " + error);
//           res.status(500).send({
//             message: "Failed to send email.",
//             errorMsg: error.message,
//           });
//         } else {
//           console.log("Email sent: " + info.response);
//           res.status(201).send({
//             message: "Email Sent Successfully.",
//           });
//         }
//       });
//     } else {
//       res.status(400).send({
//         message: `Account with ${req.body.email} does not exist`,
//       });
//     }
//   } catch (error) {
//     res.status(500).send({
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

// const resetPassword = async (req, res) => {
//   try {
//     let user = await userModel.findOne({ _id: req.body.id });
//     if (user) {
//       user.password = req.body.password;
//       await user.save();
//       res.status(200).send({
//         message: "Password updated Succesfully",
//       });
//     } else {
//       res.status(400).send({
//         message: `Account with ${req.body.email} does not exist`,
//       });
//     }
//   } catch (error) {
//     res.status(500).send({
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };
//add to cart
const userCart = async (req, res) => {
  const { productId, quantity, price } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  console.log("usecart:", req.body, req.user);
  try {
    let newCart = await new Cart({
      userId: _id,
      productId,
      price,
      quantity,
    }).save();
    res.status(200).send({
      message: "",
      newCart,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getUserCart = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.find({ userId: _id }).populate("productId");
    res.status(200).send({
      msg: "",
      cart,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const emptyCart = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await userModel.findOne({ _id });

    const cart = await Cart.deleteMany({});
    res.status(200).send({
      msg: "",
      cart,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const removeProductFromCart = async (req, res) => {
  const { _id } = req.user;
  const { cartItemId } = req.params;
  validateMongoDbId(_id);
  try {
    const deleteProduct = await Cart.deleteOne({
      userId: _id,
      _id: cartItemId,
    });
    res.status(200).send({
      msg: "item delted successfully",
      deleteProduct,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const createOrder = async (req, res) => {
  const { shippingInfo, orderItems, totalPrice, paymentInfo } = req.body;
  const { _id } = req.user;
  console.log("orderitems",req.body.orderItems)
  validateMongoDbId(_id);
  try {
    const order = await Order.create({
      shippingInfo,
      orderItems,
      totalPrice,
      paymentInfo,
      user: _id,
    });
console.log("order.....>",order)
    res.status(200).send({
      order
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const Orders = await Order.find({ user: _id })
      // .populate("user")
      .populate("orderItems")
    .exec();
    res.status(200).send({
      Orders,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    res.status(200).send({
      updateOrderStatus,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  loginUserCtrl,
  getAllUsers,
  getaUser,
  deleteaUser,
  updateUser,
  handleRefreshToken,
  logout,
  // forgotPassword,
  // resetPassword,
  loginAdmin,
  // getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  createOrder,
  updateOrderStatus,
  getMyOrders,
  removeProductFromCart,
};
