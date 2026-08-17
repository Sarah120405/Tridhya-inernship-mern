import {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from "./product.service.js";
export async function createProductController(req, res) {
  const { name, description, stock, price, category } = req.body;
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product Image is required",
      });
    }
    const image = `/uploads/${req.file.filename}`;
    const product = await createProduct(
      {
        name,
        description,
        stock,
        price,
        category,
        image,
      },
      req.user.id,
    );
    res.status(201).json(product);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getAllProductsController(req, res) {
  try {
    const products = await getAllProducts({
      category: req.query.category,
      minPrice: req.query.min_price,
      maxPrice: req.query.max_price,
      search: req.query.search,
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getProductByIdController(req, res) {
  try {
    const product = await getProductById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function updateProductController(req, res) {
  try {
    const newImagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const product = await updateProduct(req.params.id, req.body, newImagePath);
    res.status(200).json(product);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function deleteProductController(req, res) {
  try {
    const product = await deleteProduct(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}
