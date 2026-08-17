import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyOrders } from "../store/slice/orderSlice";

export default function Orders() {
  const {
    items: orders,
    loading,
    error,
  } = useSelector((state) => state.ordersSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  console.log(orders);

  if (loading)
    return (
      <p className="text-center py-24 text-slate-500">Loading orders...</p>
    );
  if (error)
    return <p className="text-center py-24 text-rose-600">Error: {error}</p>;

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-lg font-semibold text-slate-700">No orders yet</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Your placed orders will show up here.
        </p>
        <Link
          to="/"
          className="text-indigo-600 text-sm font-medium hover:underline"
        >
          Start shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Order History</h1>
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-slate-200 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500">Order #{order._id}</span>
              <span className="text-xs text-slate-400">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex flex-col gap-2 mb-3 max-h-30 overflow-y-auto pr-1">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-3 bg-slate-50 rounded-lg px-3 py-2"
                >
                  <span className="text-sm text-slate-600 line-clamp-1 flex-1 min-w-0">
                    {item.productName}
                    <span className="text-slate-400">× {item.quantity}</span>
                  </span>
                  <span className="text-sm font-medium text-slate-800 shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-2 flex justify-between font-semibold text-slate-800">
              <span>Total</span>
              <span>₹{order.totalAmount.toLocaleString()}</span>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Shipped to: {order.shippingAddress}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
