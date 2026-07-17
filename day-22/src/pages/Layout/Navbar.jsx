import { useLocation, useSearchParams } from "react-router-dom";
import { FiMenu, FiSearch, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../hooks/themeHook";

function Navbar({ openSidebar, setOpenSidebar }) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isHomePage = location.pathname === "/";
  const isArticlePage = location.pathname === `/articles`;
  const isBookmarkPage = location.pathname.startsWith("/bookmarks");
  const { theme, toggleTheme } = useTheme();

  const search = searchParams.get("search") || "";

  function handleSearchChange(e) {
    const params = new URLSearchParams(searchParams);
    if (e.target.value) {
      params.set("search", e.target.value);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    setSearchParams(params);
  }
  return (
    <header className="flex items-center justify-between px-6 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <button
        className="lg:hidden text-slate-600"
        onClick={() => setOpenSidebar(!openSidebar)}
      >
        <FiMenu size={22} />
      </button>
      {isHomePage && (
        <div className="flex flex-col items-start ">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Welcome Sarah
          </h1>
          <p className="text-xs text-slate-500 dark:text-white-500">
            Explore your favourite articles, tutorials and stories.
          </p>
        </div>
      )}
      {isArticlePage && (
        <div className="flex w-full items-center justify-between gap-4 ">
          <div className="flex flex-col min-w-0">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              All Articles
            </h1>
            <p className="text-xs text-slate-500">
              Discover our latest insights, tutorials, and stories.
            </p>
          </div>
          <div className="relative w-72 max-w-full">
            <FiSearch className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 pl-9 pr-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
      )}
      {isBookmarkPage && (
        <div className="flex flex-col items-start ">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            My Bookmarks
          </h1>
          <p className="text-xs text-slate-500">
            All the articles you have saved for later
          </p>
        </div>
      )}
      <button
        onClick={toggleTheme}
        className="ml-3 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
        aria-label="Toggle theme"
      >
        {theme === "light" ? <FiMoon /> : <FiSun />}
      </button>
    </header>
  );
}

export { Navbar };
