const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shippingInfo: {
      firstname: {
        type: String,
        
      },
      lastname: {
        type: String,
        
      },
      email: {
        type: String,
        
      },
      address: {
        type: String,
      
      },
      pincode: {
        type: String,
      
      },
      phone: {
        type: String,
        
      },
    },
    paymentInfo:{
      razorpayOrderId:{
        type:String,
      },
      razorpaymentId:{
        type:String
      },
    },
    paidAt:{
      type:Date,
      default:Date.now()
    },
    orderStatus:{
      type:String,
      default:"Ordered"
    },

    orderItems: [
      {
        productId: String,
        name: String,
        images: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
  },

  { versionKey: false, timestamps: true }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);
