import ProductCard from "../components/ProductCard";
import { Products } from "../data/product";
import PosterImage from "../assets/poster.png";
export default function ProductList() {
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
      </header>

      <div className="grid grid-cols-4 sm:grid-cols-4 gap-4">
        {Products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
