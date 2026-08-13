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

export async function getAllProducts() {
  const products = await Product.find();
  return products;
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
  return { message: "Event deleted successfully" };
}
