import { useDispatch } from "react-redux";
import { addItem } from "../store/slice/cartSlice";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  return (
    <div className="bg-white relative rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition flex flex-col">
      <span className="absolute top-1 right-1 border border-purple-500 text-purple-500 shadow-sm text-xs font-medium px-2 py-1 rounded-lg capitalize shadow-sm">
        {product.category}
      </span>
      <div className="w-full h-40  flex items-center justify-center bg-slate-50 rounded-lg mb-3 p-2">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <h3 className="font-semibold text-slate-800 line-clamp-1 mb-1">
        {product.name}
      </h3>

      <p className="text-xs text-slate-400 line-clamp-2 mb-3 flex-1">
        {product.description}
      </p>

      <div className="flex items-center justify-between mb-3">
        <p className="text-slate-800 font-semibold text-sm">
          ₹{product.price.toLocaleString()}
        </p>
        <p className="text-slate-500 text-xs flex items-center gap-1">
          <span className="text-amber-500">★</span>
          {product.rating}
        </p>
      </div>

      <button
        onClick={() => {
          dispatch(addItem(product));
          toast.success(`${product.name} added to cart`);
        }}
        className="w-full rounded-lg bg-purple-600 text-white text-sm font-medium py-2 hover:bg-purple-700 transition"
      >
        Add to cart
      </button>
    </div>
  );
}
