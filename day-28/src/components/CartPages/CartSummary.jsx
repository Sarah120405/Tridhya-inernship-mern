import { useSelector } from "react-redux";

export default function CartSummary() {
  const items = useSelector((state) => state.cartSlice.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 p-4 shadow-sm h-fit">
      <div className="flex justify-between text-sm text-slate-500 mb-2">
        <span>Items ({itemCount})</span>
        <span>₹{totalPrice.toLocaleString()}</span>
      </div>
      <div className="border-t border-slate-100 pt-2 flex justify-between">
        <span className="font-semibold text-slate-800">Total</span>
        <span className="font-bold text-purple-600 text-lg">
          ₹{totalPrice.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
