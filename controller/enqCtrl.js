const Enquiry = require('../models/enqModel')
const validateMongoDbId = require('../utils/validateMongodbId')

const createEnquiry = async(req,res)=>{
    try {
        const newEnquiry = await Enquiry.create(req.body)
        res.status(200).send({
            message: "Enquiry created Successfully",
            newEnquiry,
          });
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          }); 
    }
}
const updateEnquiry = async(req,res)=>{
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
            new: true,
          });
          res.status(200).send({
            message: "Enquiry updated Successfully",
            updateEnquiry,
          });
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          });   
    }
}

const deleteEnquiry = async(req,res)=>{
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedEnquiry = await Enquiry.findByIdAndDelete(id); 
        res.status(200).send({
            message: "Enquiry deleted Successfully",
            deletedEnquiry,
          }); 
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          });  
    }
}
const getEnquiry = async(req,res)=>{
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getaEnquiry = await Enquiry.findById(id);
        res.status(200).send({
            message: "Enquiry deatils fetched Successfully",
            getaEnquiry,
          });
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          });   
    }
}
const getallEnquiry = async(req,res)=>{
    try {
      const getallEnquiry = await Enquiry.find();
      res.status(200).send({
        message: "Enquiry deatils fetched Successfully",
        getallEnquiry,
      });
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
          }); 
    }
}
module.exports ={createEnquiry,updateEnquiry,deleteEnquiry,getEnquiry,getallEnquiry}