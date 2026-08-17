import {
  getOrCreateCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
} from "./cart.service.js";

export async function getOrCreateCartController(req, res) {
  try {
    const cart = await getOrCreateCart(req.user.id);
    res.status(200).json(cart);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function addItemToCartController(req, res) {
  try {
    const newItem = await addItemToCart(
      req.user.id,
      req.params.productId,
      req.body.quantity,
    );
    res.status(201).json(newItem);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function updateItemQuantityController(req, res) {
  try {
    const updatedCart = await updateItemQuantity(
      req.user.id,
      req.params.productId,
      req.body.quantity,
    );
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function removeItemFromCartController(req, res) {
  try {
    const removedItem = await removeItemFromCart(
      req.user.id,
      req.params.productId,
    );
    res.status(200).json(removedItem);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}
