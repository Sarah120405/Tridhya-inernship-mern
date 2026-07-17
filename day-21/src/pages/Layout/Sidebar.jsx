import { NavLink } from "react-router-dom";
import { FiHome, FiFileText, FiGrid, FiBookmark, FiInfo } from "react-icons/fi";

function Sidebar({ openSidebar, setOpenSidebar }) {
  const getNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? "bg-indigo-100 text-indigo-700 font-medium"
        : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <>
      {openSidebar && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpenSidebar(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-50 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
          openSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-2">
          <FiFileText />
          <span className="text-xl font-bold text-slate-800">BlogHub</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink end to="/" className={getNavLinkClass}>
            <FiHome /> Home
          </NavLink>
          <NavLink to="/articles" className={getNavLinkClass}>
            <FiFileText /> Articles
          </NavLink>
          <NavLink to="/bookmarks" className={getNavLinkClass}>
            <FiBookmark /> Bookmarks
          </NavLink>
        </nav>
      </aside>
    </>
  );
}

export { Sidebar };
