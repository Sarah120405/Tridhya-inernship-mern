import { FiMenu, FiBell, FiSearch, FiChevronDown } from "react-icons/fi";

function Navbar({ openSidebar, setOpenSidebar }) {
  return (
    <header className="topbar">
      <button
        className="text-text-secondary lg:hidden"
        onClick={() => setOpenSidebar(!openSidebar)}
      >
        <FiMenu size={22} />
      </button>

      <div className="search-input">
        <FiSearch size={16} />
        <input
          className="bg-[#FAF9FC]"
          type="text"
          placeholder="Search books by title, author or ISBN..."
        />
      </div>

      <button className="icon-btn">
        <FiBell size={18} />
        <span className="dot" />
      </button>

      <button className="flex items-center gap-2.5">
        <img
          src="/images/avatar-placeholder.webp"
          alt="User avatar"
          className="avatar"
        />
        <div className="hidden sm:flex flex-col items-start leading-tight">
          <span className="text-[13px] font-semibold text-text-primary">
            Aria Morgan
          </span>
          <span className="text-[11px] text-text-muted">Librarian</span>
        </div>
        <FiChevronDown size={14} className="text-text-muted hidden sm:block" />
      </button>
    </header>
  );
}

export { Navbar };
