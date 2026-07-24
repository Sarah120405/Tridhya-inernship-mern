import { FiMenu, FiShoppingCart } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Navbar({ openSidebar, setOpenSidebar }) {

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
          Here's what's happening with your finances today
        </p>
      </div>
    </header>
  );
}

export { Navbar };
