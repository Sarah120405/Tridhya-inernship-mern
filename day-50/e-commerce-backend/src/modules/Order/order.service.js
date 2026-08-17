import mongoose from "mongoose";
import Cart from "../../models/Cart.js";
import Order from "../../models/Order.js";
import Product from "../../models/Product.js";

export async function createOrderFromCart(userId, shippingAddress) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await Cart.findOne({ user: userId })
      .populate("items.product")
      .session(session);

    if (!cart || cart.items.length === 0) {
      const error = new Error("Add items to cart first");
      error.status = 400;
      throw error;
    }

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        const error = new Error(`Insufficient stock for ${item.product.name}`);
        error.status = 409;
        throw error;
      }
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const [newOrder] = await Order.create(
      [
        {
          user: userId,
          items: orderItems,
          totalAmount,
          shippingAddress,
          status: "pending",
        },
      ],
      { session },
    );

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } },
        { session },
      );
    }

    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    return newOrder;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

export async function getMyOrders(userId) {
  const orders = await Order.find({ user: userId });
  if (!orders) {
    const error = new Error("Nothing ordered yet");
    error.status = 400;
    throw error;
  }
  return orders;
}

export async function getAllOrders() {
  const orders = await Order.find().populate("user");
  return orders;
}
