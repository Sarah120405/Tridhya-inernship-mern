import { useDispatch } from "react-redux";
import { removeItem, updateQuantity } from "../../store/slice/cartSlice";

export default function CartItem({ item }) {
  const dispatch = useDispatch();
  const subtotal = item.price * item.quantity;

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-white border border-slate-200 px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-16 h-16 shrink-0 flex items-center justify-center bg-slate-50 rounded-lg p-2">
          <img
            src={item.image}
            alt={item.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-semibold text-slate-900 line-clamp-1">
            {item.name}
          </span>
          <span className="text-xs text-slate-500">
            ₹{item.price.toLocaleString()} each
          </span>
          <span className="text-sm font-semibold text-purple-600">
            ₹{subtotal.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <div className="flex items-center gap-2 bg-slate-100 rounded-md px-2 py-1">
          <button
            disabled={item.quantity <= 1}
            onClick={() =>
              dispatch(
                updateQuantity({ id: item.id, quantity: item.quantity - 1 }),
              )
            }
            className="w-7 h-7 flex items-center justify-center rounded bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            −
          </button>
          <span className="text-sm font-semibold text-slate-900 w-6 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() =>
              dispatch(
                updateQuantity({ id: item.id, quantity: item.quantity + 1 }),
              )
            }
            className="w-7 h-7 flex items-center justify-center rounded bg-purple-500 text-white font-bold hover:bg-purple-600 transition"
          >
            +
          </button>
        </div>
        <button
          onClick={() => dispatch(removeItem({ id: item.id }))}
          className="text-xs font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-3 py-1 rounded transition"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
