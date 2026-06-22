import mongoose from "mongoose";
import priceSchema from "./price.schema.js";
const productSchema = new mongoose.Schema(
  {
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
      type:priceSchema,
      required:true
    },

    image: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],

    variants: [
      {
        images: [
          {
            url: {
              type: String,
              required: true,
            },
          },
        ],

        stock: {
          type: Number,
          default: 0,
        },

        attributes: {
          type: Map,
          of: String,
        },

        price: {
          type:priceSchema
        },
      },
    ],
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;