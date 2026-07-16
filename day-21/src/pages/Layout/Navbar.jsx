import { FiMenu, FiSearch } from "react-icons/fi";

function Navbar({ openSidebar, setOpenSidebar }) {
  return (
    <header className="flex items-center justify-between px-6 py-2 bg-white border-b border-slate-200">
      <button
        className="lg:hidden text-slate-600"
        onClick={() => setOpenSidebar(!openSidebar)}
      >
        <FiMenu size={22} />
      </button>

      <div className="relative w-72 max-w-full ml-auto">
        <FiSearch className="absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>
    </header>
  );
}

export { Navbar };
