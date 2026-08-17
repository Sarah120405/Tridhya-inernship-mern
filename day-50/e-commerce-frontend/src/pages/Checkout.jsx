import { useState } from "react";
import OrderSuccesfull from "../components/OrderSuccesfull";
import { useDispatch, useSelector } from "react-redux";
import CartSummary from "../components/CartPages/CartSummary";
import { checkOut } from "../store/slice/orderSlice";
/* import { placeOrder } from "../store/slice/orderSlice"; */
import { useNavigate } from "react-router-dom";
/* import { clearCart } from "../store/slice/cartSlice"; */
export default function Checkout() {
  const items = useSelector((state) => state.cartSlice.items);
  const { loading, error } = useSelector((state) => state.ordersSlice);
  const [shippingAddress, setShippingAddress] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmedOrder, setConfirmedOrder] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (items.length < 1) {
      alert("Your cart is empty");
      return;
    }
    if (!shippingAddress.trim()) {
      alert("Please add your shipping address");
      return;
    }

    const resultAction = await dispatch(checkOut(shippingAddress));
    if (checkOut.fulfilled.match(resultAction)) {
      setConfirmedOrder(resultAction.payload);
    }
  }
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-xl font-bold text-slate-800 mb-2">
        Shipping details
      </h2>
      <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-600">
              Address
            </label>
            <input
              placeholder="Enter address..."
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-600">
              Payment method
            </label>
            <select className="rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition bg-white">
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
                key={item._id}
                className="flex justify-between text-sm text-slate-600"
              >
                <div className="w-16 h-16 shrink-0 flex items-center justify-center bg-slate-50 rounded-lg p-2">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </li>
            ))}
          </ul>
          <CartSummary />
        </div>
        {error && <p className="text-rose-600 text-sm">{error}</p>}
        {confirmedOrder && (
          <OrderSuccesfull
            order={confirmedOrder}
            onClose={() => setConfirmedOrder(false)}
          />
        )}
      </div>
    </div>
  );
}
