const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    tags: { type: String },
    category: { title: String, _id: String },
    brand: { title: String, _id: String },
    quantity: { type: Number, required: true },
    images: [],
    sold: { type: Number, default: 0 },
    color: { type: String, required: true },
    ratings: [
      {
        star: Number,
        comment: String,
        postedBy: { type: mongoose.Types.ObjectId, ref: "user" },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
