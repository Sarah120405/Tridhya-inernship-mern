import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../store/slice/cartSlice";
import CartItem from "../components/CartPages/CartItem";
import CartSummary from "../components/CartPages/CartSummary";

export default function Cart() {
  const items = useSelector((state) => state.cartSlice.items);
  const dispatch = useDispatch();

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
      <div className="w-full max-h-[500px] bg-white rounded-xl border border-slate-200 p-4 shadow-sm h-fit">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Shopping Cart</h2>
          {items.length > 0 && (
            <button
              onClick={() => dispatch(clearCart())}
              className="text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 px-2 py-1 rounded transition-colors duration-150"
            >
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">
            Cart is empty
          </p>
        ) : (
          <div className="flex flex-col gap-2 mb-4 overflow-y-auto">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
      <CartSummary />
    </div>
  );
}
