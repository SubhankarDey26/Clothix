import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
  },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  price: {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "JPY", "INR"],
      default: "INR",
    },
  },

  image: [
    {
      url: {
        type: String,
        required: true,
      }
    },
  ],
},{timestamps:true});

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
