import Cart from "../../models/Cart.js";

export async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
}

export async function addItemToCart(userId, productId, quantity = 1) {
  const cart = await getOrCreateCart(userId);

  const existingItem = cart.items.find((item) =>
    item.product.equals(productId),
  );
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  return cart;
}

export async function removeItemFromCart(userId, productId) {
  const cart = await getOrCreateCart(userId);
  cart.items = cart.items.filter((item) => !item.product.equals(productId));
  await cart.save();
  return cart;
}

export async function updateItemQuantity(userId, productId, quantity) {
  if (quantity <= 0) {
    return removeItemFromCart(userId, productId);
  }

  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((i) => i.product.equals(productId));

  if (!item) {
    const error = new Error("Item not found in cart");
    error.status = 404;
    throw error;
  }

  item.quantity = quantity;
  await cart.save();
  return cart;
}
