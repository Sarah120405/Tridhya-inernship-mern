import { FiMenu, FiShoppingCart } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Navbar({ openSidebar, setOpenSidebar }) {
  const items = useSelector((state) => state.cartSlice.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="flex items-center justify-between px-6 py-1 bg-white border-b border-slate-200">
      <button
        className="lg:hidden text-slate-600"
        onClick={() => setOpenSidebar(!openSidebar)}
      >
        <FiMenu size={22} />
      </button>
      <div className="flex flex-col items-start">
        <h1 className="text-xl font-bold text-slate-900">Welcome Sarah</h1>
        <p className="text-xs text-slate-500">
          Explore your favourite articles, tutorials and stories.
        </p>
      </div>

      <Link
        to="/cart"
        className="relative text-slate-600 hover:text-indigo-600 transition"
      >
        <FiShoppingCart size={22} />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-rose-500 text-white text-[10px] font-bold px-1">
            {itemCount}
          </span>
        )}
      </Link>
    </header>
  );
}

export { Navbar };
