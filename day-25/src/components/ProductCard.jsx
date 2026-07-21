import { useDispatch } from "react-redux";
import { addItem } from "../store/slice/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
      <img src={product.image} />
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-slate-800">{product.name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm mb-3">
            ₹{product.price.toLocaleString()}
          </p>
          <p className="text-slate-500 text-sm mb-3">
            <span className="text-amber-500 text-sm">★</span>
            {product.rating}
          </p>
        </div>
        <button
          onClick={() => dispatch(addItem(product))}
          className="w-full rounded-lg bg-purple-600 text-white text-sm font-medium py-2 hover:bg-purple-700 transition"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
