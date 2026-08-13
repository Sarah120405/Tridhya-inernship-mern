import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      enum: ["Electronics", "Clothing", "Books", "Jewellery", "Stationery"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
