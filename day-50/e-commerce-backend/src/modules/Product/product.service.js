import Product from "../../models/Product.js";

export async function createProduct(productData, adminId) {
  const product = await Product.findOne({ name: productData.name });
  if (product) {
    const error = new Error("This Product already exists");
    error.status = 409;
    throw error;
  }
  const newProduct = await Product.create({
    name: productData.name,
    description: productData.description,
    category: productData.category,
    price: productData.price,
    stock: productData.stock,
    image: productData.image,
  });
  return newProduct;
}

export async function getAllProducts({
  category,
  minPrice,
  maxPrice,
  search,
} = {}) {
  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};

    if (minPrice) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter.price.$lte = Number(maxPrice);
    }
  }
  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  // Temporary verification of compound index
  const stats = await Product.find({
    category: "Electronics",
    price: { $gte: 500 },
  }).explain("executionStats");
  console.log(stats.executionStages);

  return await Product.find(filter);
}

export async function getProductById(productId) {
  const product = await Product.find({ _id: productId });
  if (!product) {
    const error = new Error("This Product does not exist");
    error.status = 404;
    throw error;
  }
  return product;
}

export async function updateProduct(productId, productData, newImagePath) {
  const product = await Product.find({ _id: productId });
  if (!product) {
    const error = new Error("This Product does not exist");
    error.status = 404;
    throw error;
  }
  const updates = { ...productData };
  if (newImagePath) {
    updates.image = newImagePath;
  }
  const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
    new: true,
  });
  return updatedProduct;
}

export async function deleteProduct(productId) {
  const product = await Product.find({ _id: productId });
  if (!product) {
    const error = new Error("This Product does not exist");
    error.status = 404;
    throw error;
  }
  const deletedProduct = await Product.findByIdAndDelete(productId);
  return { message: "Product deleted successfully" };
}
