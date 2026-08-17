import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiGrid,
  FiShoppingCart,
  FiSmartphone,
  FiShoppingBag,
  FiList,
} from "react-icons/fi";
import { FaWallet } from "react-icons/fa";
import LogoutButton from "../../components/LogoutButton";
import { useAuth } from "../../context/AuthContext";

function Sidebar({ openSidebar, setOpenSidebar }) {
  const { user, loading } = useAuth();
  console.log(user);

  const getNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? "bg-purple-100 text-purple-700 font-medium"
        : "text-slate-600 hover:bg-pink-100"
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
          <FiShoppingBag />
          <span className="text-xl font-bold text-slate-800">ShopEase</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink end to="/" className={getNavLinkClass}>
            <FiHome /> Home
          </NavLink>
          <NavLink to="/cart" className={getNavLinkClass}>
            <FiShoppingCart /> Cart
          </NavLink>
          <NavLink to="/orders" className={getNavLinkClass}>
            <FiSmartphone /> Order
          </NavLink>
          <NavLink to="/checkout" className={getNavLinkClass}>
            <FaWallet /> Checkout
          </NavLink>
          {user?.role === "admin" && (
            <NavLink to="/reports" className={getNavLinkClass}>
              <FiList />
              Reports
            </NavLink>
          )}
        </nav>
        <LogoutButton />
      </aside>
    </>
  );
}

export { Sidebar };
