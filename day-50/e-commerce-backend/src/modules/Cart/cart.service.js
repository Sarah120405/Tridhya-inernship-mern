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
