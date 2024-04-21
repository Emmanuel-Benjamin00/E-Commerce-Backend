const Brand = require('../models/brandModel')
const validateMongoDbId = require('../utils/validateMongodbId')

const createBrand = async(req,res)=>{
    try {
        const newBrand = await Brand.create(req.body)
        res.status(200).send({
            msg:"Brand added Successfully",
            newBrand
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          }); 
    }
}
//Update Brand
const updateBrand = async(req,res)=>{
    const id = req.params
    try {
        const updatedBrand = await Brand.findByIdAndUpdate({_id:id},req.body,{new:true})
        res.status(200).send({
            msg:"Brand updated Successfully",
            updatedBrand
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          }); 
    }
}

//deleteBrand
const deleteBrand = async(req,res)=>{
    const id = req.params
    // validateMongoDbId(id)
    try {
        const deletedBrand = await Brand.findByIdAndDelete({_id:id})
        res.status(200).send({
            msg:"Brand deleted Successfully",
            deletedBrand
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          }); 
    }
}
//get a Brand
const getBrand = async(req,res)=>{
    const {id} = req.params
    // validateMongoDbId(id)
    try {
        const getBrand = await Brand.findById({_id:id})
        res.status(200).send({
            msg:"Brand added Successfully",
            getBrand
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          }); 
    }
}

//get all Brand
const getAllBrand = async(req,res)=>{
 
    try {
        const getAllBrand = await Brand.find()
        res.status(200).send({
            msg:"Brands are",
            getAllBrand
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          }); 
    }
}
module.exports = {createBrand,updateBrand,deleteBrand,getBrand,getAllBrand}