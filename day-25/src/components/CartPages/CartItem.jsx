import { useDispatch } from "react-redux";
import { removeItem, updateQuantity } from "../../store/slice/cartSlice";

export default function CartItem({ item }) {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-row justify-between items-center rounded-lg bg-white border border-slate-200 px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col items-start gap-1">
        <span className="text-sm font-semibold text-slate-900">
          {item.name}
        </span>
        <span className="text-sm font-medium text-slate-600">
          ₹{item.price}
        </span>
      </div>
      <div className="flex flex-col items-center justify-between gap-2">
        <div className="flex items-center gap-2 bg-slate-100 rounded-md px-2 py-1">
          <button
            disabled={item.quantity <= 1}
            onClick={() =>
              dispatch(
                updateQuantity({ id: item.id, quantity: item.quantity - 1 }),
              )
            }
            className="w-7 h-7 flex items-center justify-center rounded bg-slate-200 text-slate-700 font-bold text-lg hover:bg-slate-300 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            −
          </button>
          <span className="text-base font-semibold text-slate-900 w-6 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() =>
              dispatch(
                updateQuantity({ id: item.id, quantity: item.quantity + 1 }),
              )
            }
            className="w-7 h-7 flex items-center justify-center rounded bg-purple-500 text-white font-bold text-lg hover:bg-purple-600 transition-colors duration-150"
          >
            +
          </button>
        </div>
        <button
          onClick={() => dispatch(removeItem({ id: item.id }))}
          className="text-xs font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-3 py-1 rounded transition-colors duration-150"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
