import ProductCard from "../components/ProductCard";
import PosterImage from "../assets/poster.png";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchProducts } from "../store/slice/productSlice";

const categories = [
  "Electronics",
  "Clothing",
  "Books",
  "Jewellery",
  "Stationery",
];
export default function ProductList() {
  const {
    items: products,
    loading,
    error,
  } = useSelector((state) => state.productSlice);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  return (
    <div className="flex-1">
      <section className="bg-purple-100 rounded-2xl p-6 mb-6 text-left relative overflow-hidden flex items-center justify-between ">
        <div>
          <span className="relative text-black text-sm font-medium">
            Big Savings
          </span>
          <h1 className="text-4xl tracking-tight relative font-bold text-slate-900">
            Summer Sale
          </h1>
          <p className="text-slate-600 relative max-w-md">
            Up to 50% off on selected items.
          </p>
          <button className="inline-block bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
            Keep Shopping →
          </button>
        </div>
        <div className="hidden md:block shrink-0">
          <img
            src={PosterImage}
            alt="Illustration of a laptop, coffee, and books"
            className="w-full max-w-xs h-auto"
          />
        </div>
      </section>
      <header className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Products</h2>
        <div className="flex gap-2">
          <input
            placeholder="Search ...."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-purple-400"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-purple-400 bg-white capitalize"
          >
            <option value="">All Category</option>
            {categories.map((cat) => {
              return (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              );
            })}
          </select>
        </div>
      </header>

      {loading && (
        <p className="text-center py-12 text-slate-500">Loading products...</p>
      )}
      {error && (
        <p className="text-center py-12 text-rose-600">Error: {error}</p>
      )}
      {!loading && !error && (
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
