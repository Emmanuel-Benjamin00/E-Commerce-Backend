const express= require('express')
const { createProduct, getaProduct, getAllProducts, updateProduct, deleteProduct, addToWishList, rating, uploadImages, deleteImages } = require('../controller/productCtrl')
const router = express.Router()
const {isAdmin,authMiddleware} = require('../middleware/authMiddleware')
const { uploadPhoto, productImgResize } = require('../middleware/uploadImages')

router.post('/create',createProduct)
router.put('/upload/:id',uploadPhoto.array('images',10),uploadImages)
router.delete('/delete-img/:id',authMiddleware,isAdmin,deleteImages)
router.get('/:id',getaProduct)
router.get('/',getAllProducts)
router.put('/:id',authMiddleware,isAdmin,updateProduct)
router.delete('/:id',authMiddleware,isAdmin,deleteProduct)
router.post('/wishlist',authMiddleware,addToWishList)
router.put('/rating',rating)

module.exports =router