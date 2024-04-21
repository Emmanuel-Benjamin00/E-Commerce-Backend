const Category = require('../models/category')
const validateMongoDbId = require('../utils/validateMongodbId')

const createCategory = async(req,res)=>{
    try {
        const newCategory = await Category.create(req.body)
        res.status(200).send({
            msg:"Category added Successfully",
            newCategory
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          }); 
    }
}
//Update Category
const updateCategory = async(req,res)=>{
    const id = req.params
    try {
        const updatedCategory = await Category.findByIdAndUpdate({_id:id},req.body,{new:true})
        res.status(200).send({
            msg:"Category updated Successfully",
            updatedCategory
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          }); 
    }
}

//deleteCategory
const deleteCategory = async(req,res)=>{
    const id = req.params
    validateMongoDbId(id)
    try {
        const deletedCategory = await Category.findByIdAndDelete({_id:id})
        res.status(200).send({
            msg:"Category deleted Successfully",
            deletedCategory
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          }); 
    }
}
//get a category
const getCategory = async(req,res)=>{
    const id = req.params
    validateMongoDbId(id)
    try {
        const getCategory = await Category.findById({_id:id})
        res.status(200).send({
            msg:"Category added Successfully",
            getCategory
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          }); 
    }
}

//get all category
const getAllCategory = async(req,res)=>{
 
    try {
        const getAllCategory = await Category.find()
        res.status(200).send({
            msg:"Categories are",
            getAllCategory
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          }); 
    }
}
module.exports = {createCategory,updateCategory,deleteCategory,getCategory,getAllCategory}