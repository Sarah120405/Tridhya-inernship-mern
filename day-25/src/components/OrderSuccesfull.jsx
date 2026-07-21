import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function OrderSuccesfull() {
  const orders = useSelector((state) => state.ordersSlice.list);
  const latestOrder = orders[orders.length - 1];

  if (!latestOrder) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-lg font-semibold text-slate-700">
          No recent order found
        </h2>
        <Link
          to="/"
          className="text-indigo-600 text-sm font-medium hover:underline mt-2"
        >
          Back to shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 justify-center flex items-center z-50 p-4">
      <div className="bg-white flex flex-col items-center rounded-2xl max-w-md w-full p-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✓</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Order placed!
        </h1>
        <p className="text-slate-500 mb-8">
          Thanks{latestOrder.address ? `, your order is on its way` : ""}.
        </p>

        <div className="bg-white border border-slate-200 rounded-xl p-5 text-left">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
            <span className="text-sm text-slate-500">
              Order #{latestOrder.id}
            </span>
            <span className="text-xs text-slate-400">
              {new Date(latestOrder.placedAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            {latestOrder.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm text-slate-600"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 flex justify-between font-semibold text-slate-800 mb-3">
            <span>Total</span>
            <span>₹{latestOrder.total.toLocaleString()}</span>
          </div>

          <p className="text-xs text-slate-400">
            Shipped to: {latestOrder.address}
          </p>
        </div>

        <div className="flex gap-3 justify-center mt-8">
          <Link
            to="/"
            className="rounded-xl border-2 border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Continue shopping
          </Link>
          <Link
            to="/orders"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition"
          >
            View order history
          </Link>
        </div>
      </div>
    </div>
  );
}
