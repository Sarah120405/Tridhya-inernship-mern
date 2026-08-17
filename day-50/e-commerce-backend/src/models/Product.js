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

productSchema.index({ stock: 1 });
productSchema.index({ category: 1, price: 1 });

export default mongoose.model("Product", productSchema);
