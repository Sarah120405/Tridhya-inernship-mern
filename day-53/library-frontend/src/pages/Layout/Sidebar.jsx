import { NavLink } from "react-router-dom";
import { FiHome, FiBookOpen, FiEdit3, FiUsers, FiRepeat } from "react-icons/fi";

function Sidebar({ openSidebar, setOpenSidebar }) {
  const getNavLinkClass = ({ isActive }) =>
    `sidebar-link ${isActive ? "sidebar-link-active" : ""}`;

  return (
    <>
      {openSidebar && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setOpenSidebar(false)}
        />
      )}

      <aside
        className={`sidebar ${
          openSidebar ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="sidebar-logo">
          <FiBookOpen className="icon" />
          <div className="flex flex-col">
            <span className="title">Library</span>
            <span className="subtitle">Management System</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink end to="/" className={getNavLinkClass}>
            <FiHome className="w-4.5 h-4.5" /> Dashboard
          </NavLink>
          <NavLink to="/books" className={getNavLinkClass}>
            <FiBookOpen className="w-4.5 h-4.5" /> Books
          </NavLink>
          <NavLink to="/author" className={getNavLinkClass}>
            <FiEdit3 className="w-4.5 h-4.5" /> Authors
          </NavLink>
          <NavLink to="/members" className={getNavLinkClass}>
            <FiUsers className="w-4.5 h-4.5" /> Members
          </NavLink>
          <NavLink to="/borrow_record" className={getNavLinkClass}>
            <FiRepeat className="w-4.5 h-4.5" /> Borrow Records
          </NavLink>
        </nav>
      </aside>
    </>
  );
}

export { Sidebar };
