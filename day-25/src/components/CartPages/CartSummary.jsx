import { useSelector } from "react-redux";

export default function CartSummary() {
  const items = useSelector((state) => state.cartSlice.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  return (
    <div className="flex justify-between w-full md:w-80 bg-white rounded-xl border border-slate-200 p-4 shadow-sm h-fit">
      <p className="text-sm font-medium text-slate-600">
        Total Items: {itemCount}
      </p>
      <p>Total: ₹{totalPrice}</p>
    </div>
  );
}
