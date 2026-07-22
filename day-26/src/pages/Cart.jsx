import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../store/slice/cartSlice";
import CartItem from "../components/CartPages/CartItem";
import CartSummary from "../components/CartPages/CartSummary";
import { FaTruck, FaBolt, FaLock } from "react-icons/fa";

export default function Cart() {
  const items = useSelector((state) => state.cartSlice.items);
  const dispatch = useDispatch();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
      <div className="w-full bg-white rounded-xl border border-slate-200 p-4 shadow-sm h-fit">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Shopping Cart ({itemCount})
          </h2>
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
          <div className="flex flex-col gap-2 mb-4 max-h-[400px] overflow-y-auto scrollbar-none">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-6">
        <CartSummary />

        <div className="w-full md:w-80 bg-white rounded-xl border border-slate-200 p-4 shadow-sm h-fit">
          <div className="flex flex-col divide-y divide-slate-100">
            <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className="w-9 h-9 shrink-0 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                <FaTruck size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700">
                  Free shipping
                </span>
                <span className="text-xs text-slate-400">
                  On orders over ₹500
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className="w-9 h-9 shrink-0 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                <FaBolt size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700">
                  Easy returns
                </span>
                <span className="text-xs text-slate-400">30 day returns</span>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className="w-9 h-9 shrink-0 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                <FaLock size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700">
                  Secure payment
                </span>
                <span className="text-xs text-slate-400">100% protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
