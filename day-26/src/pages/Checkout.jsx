import { useState } from "react";
import OrderSuccesfull from "../components/OrderSuccesfull";
import { useDispatch, useSelector } from "react-redux";
import CartSummary from "../components/CartPages/CartSummary";
import { updateField, resetCheckout } from "../store/slice/checkoutSlice";
import { placeOrder } from "../store/slice/orderSlice";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../store/slice/cartSlice";
export default function Checkout() {
  const items = useSelector((state) => state.cartSlice.items);
  const { name, address, paymentMethod } = useSelector(
    (state) => state.checkoutSlice,
  );
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmedOrder, setConfirmedOrder] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (items.length < 1) {
      alert("Purchase Item");
      return;
    }
    if (!name.trim() || !address.trim() || !paymentMethod) {
      alert("Please fill in all fields before placing your order");
      return;
    }
    setShowConfirm(true);
  }

  function confirmOrder() {
    setShowConfirm(false);
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    dispatch(
      placeOrder({
        items,
        total,
        address: `${name}, ${address} (Payment: ${paymentMethod})`,
      }),
    );

    dispatch(clearCart());
    dispatch(resetCheckout());
    setConfirmedOrder(true);
  }
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-xl font-bold text-slate-800 mb-2">
        Shipping details
      </h2>

      <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-600">Name</label>
            <input
              placeholder="Enter your name..."
              value={name}
              onChange={(e) =>
                dispatch(updateField({ field: "name", value: e.target.value }))
              }
              className="rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-600">
              Address
            </label>
            <input
              placeholder="Enter address..."
              value={address}
              onChange={(e) =>
                dispatch(
                  updateField({ field: "address", value: e.target.value }),
                )
              }
              className="rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-600">
              Payment method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) =>
                dispatch(
                  updateField({
                    field: "paymentMethod",
                    value: e.target.value,
                  }),
                )
              }
              className="rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition bg-white"
            >
              <option value="">Select payment method</option>
              <option value="UPI">UPI</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-2 rounded-xl bg-purple-600 text-white font-semibold py-3 hover:bg-purple-700 transition"
          >
            Place Order
          </button>
        </form>

        <div className="bg-white rounded-xl border border-slate-200 p-5 h-fit">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Order summary
          </h2>
          <span>Total Items: {items.length}</span>
          <ul className="flex flex-row gap-3 mb-4 overflow-x-auto scrollbar-none">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between text-sm text-slate-600"
              >
                <div className="w-16 h-16 shrink-0 flex items-center justify-center bg-slate-50 rounded-lg p-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-slate-100 pt-3">
            <CartSummary />
          </div>
        </div>
        {confirmedOrder && (
          <OrderSuccesfull
            order={confirmedOrder}
            onClose={() => setConfirmedOrder(false)}
          />
        )}
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Confirm your order?
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Total: ₹{total.toLocaleString()} · {items.length} item
              {items.length !== 1 ? "s" : ""}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-xl border-2 border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmOrder}
                className="flex-1 rounded-xl bg-purple-600 py-2.5 text-sm font-medium text-white hover:bg-purple-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
