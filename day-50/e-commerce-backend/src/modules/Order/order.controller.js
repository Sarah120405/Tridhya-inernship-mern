import {
  createOrderFromCart,
  getAllOrders,
  getMyOrders,
} from "./order.service.js";

export async function createOrderFromCartController(req, res) {
  try {
    const order = await createOrderFromCart(
      req.user.id,
      req.body.shippingAddress,
    );
    res.status(201).json(order);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getMyOrdersController(req, res) {
  try {
    const order = await getMyOrders(req.user.id);
    res.status(201).json(order);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getAllOrdersController(req, res) {
  try {
    const order = await getAllOrders();
    res.status(201).json(order);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}
