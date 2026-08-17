import { Link } from "react-router-dom";
import { FiCheck } from "react-icons/fi";

export default function OrderSuccesfull({ order, onClose }) {
  console.log("Successfull", order);

  return (
    <div className="fixed inset-0 bg-black/40 justify-center flex items-center z-50 p-2">
      <div className="bg-white flex flex-col items-center rounded-2xl max-w-lg w-full p-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">
            <FiCheck />
          </span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Order placed!
        </h1>
        <p className="text-slate-500 mb-8">Thanks, your order is on its way.</p>

        <div className="bg-white border border-slate-200 rounded-xl p-5 text-left">
          <div className="flex items-center justify-between mb-2 pb-4 border-b border-slate-100">
            <span className="text-sm text-slate-500">Order #{order._id}</span>
            <span className="text-xs text-slate-400">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex flex-col gap-2 mb-2 max-h-34 overflow-y-auto pr-1">
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

          <div className="border-t border-slate-100 pt-3 flex justify-between font-semibold text-slate-800 mb-3">
            <span>Total</span>
            <span>₹{order.totalAmount.toLocaleString()}</span>
          </div>

          <p className="text-xs text-slate-400">
            Shipped to: {order.shippingAddress}
          </p>
        </div>

        <div className="flex gap-3 justify-center mt-8">
          <Link
            to="/"
            onClick={onClose}
            className="rounded-xl border-2 border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Continue shopping
          </Link>
          <Link
            to="/orders"
            onClick={onClose}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition"
          >
            View order history
          </Link>
        </div>
      </div>
    </div>
  );
}
