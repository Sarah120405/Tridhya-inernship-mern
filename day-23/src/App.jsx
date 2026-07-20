import { useState, useEffect, useRef } from "react";
import {
  FiPlus,
  FiMinus,
  FiRefreshCw,
  FiToggleLeft,
  FiDatabase,
  FiClock,
  FiCloud,
  FiMaximize2,
  FiMoreVertical,
} from "react-icons/fi";

import { useCounter } from "./hooks/useCounter";
import useToggle from "./hooks/useToggle";
import useLocalStorage from "./hooks/useLocalStorage";
import useDebounce from "./hooks/useDebounce";
import useFetch from "./hooks/useFetch";
import usePrevious from "./hooks/usePrevious";
import useOnClickOutside from "./hooks/useOnClickOutside.";
import useWindowSize from "./hooks/useWindowSize";
import useDocumentTitle from "./hooks/useDocumentTitle";

const breakpointStyles = {
  Mobile: "bg-orange-100 text-orange-700",
  Tablet: "bg-blue-100 text-blue-700",
  Desktop: "bg-emerald-100 text-emerald-700",
};

export default function App() {
  const [userId, setUserId] = useState(1);

  // useDocumentTitle
  const [title, setTitle] = useState("Custom Hooks Playground");
  useDocumentTitle(title);

  // useCounter and usePrevious
  const { count, increment, decrement, reset } = useCounter(10);
  const previousCount = usePrevious(count);

  // useToggle
  const { toggle, toggleClick } = useToggle(false);

  // useLocalStorage
  const [name, setName] = useLocalStorage("demo-name", "");
  const [visits, setVisits] = useLocalStorage("visit-count", 0);

  useEffect(() => {
    setVisits((prev) => prev + 1);
  }, []); // runs once per mount — increments every time you load/refresh the page

  // useDebounce + useFetch combined — searching a real API
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data: allUsers, loading: usersLoading } = useFetch(
    "https://jsonplaceholder.typicode.com/users",
  );

  const searchResults = debouncedSearch
    ? allUsers?.filter((u) =>
        u.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
      )
    : [];

  // useFetch
  const fetchUrl = userId
    ? `https://jsonplaceholder.typicode.com/users/${userId}`
    : null;

  const { data, loading, error } = useFetch(fetchUrl);

  // useWindowSize
  const { width, height } = useWindowSize();
  const breakpoint =
    width < 640 ? "Mobile" : width < 1024 ? "Tablet" : "Desktop";

  // useOnClickOutside
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setDropdownOpen(false));

  // Reset all the hooks to initial state
  function resetAll() {
    reset();
    setName("");
    setSearch("");
    setUserId(1);
    setDropdownOpen(false);
  }
  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              Custom Hooks Playground
            </h1>
            <p className="text-slate-500 mt-2">
              Interactive dashboard to test reusable React hooks
            </p>
          </div>
          <div className="flex items-center gap-3 justify-between">
            {/* useDocumentTitle */}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Type to change the browser tab title"
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm w-50"
            />
            <button
              onClick={resetAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition"
            >
              <FiRefreshCw /> Reset All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* useCounter */}
          <div className="bg-white rounded-3xl shadow-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <FiPlus size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">useCounter</h2>
              </div>
            </div>

            <div className="text-center mb-4">
              <p className="text-slate-500 text-sm">Current Count</p>
              <h3 className="text-5xl font-bold text-indigo-600 mt-2">
                {count}
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Previous: {previousCount ?? "—"}
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={decrement}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
              >
                <FiMinus size={20} />
              </button>

              <button
                onClick={reset}
                className="px-5 py-3 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-200 transition font-semibold"
              >
                <FiRefreshCw size={20} />
              </button>

              <button
                onClick={increment}
                className="px-4 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                <FiPlus size={20} />
              </button>
            </div>
          </div>

          {/* useToggle */}
          <div className="bg-white rounded-3xl shadow-lg p-4 border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                <FiToggleLeft size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">useToggle</h2>
            </div>

            <div className="text-center mb-6">
              <div
                className={`inline-flex h-16 w-32 items-center rounded-full p-2 transition ${
                  toggle ? "bg-green-500" : "bg-slate-300"
                }`}
              >
                <div
                  className={`h-12 w-12 rounded-full bg-white shadow-md transition ${
                    toggle ? "translate-x-16" : "translate-x-0"
                  }`}
                />
              </div>

              <p className="text-2xl font-bold mt-4">{toggle ? "ON" : "OFF"}</p>
            </div>

            <button
              onClick={toggleClick}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              Flip Toggle
            </button>
          </div>

          {/* useLocalStorage */}
          <div className="bg-white rounded-3xl shadow-lg p-4 border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                <FiDatabase size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                useLocalStorage
              </h2>
            </div>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type and refresh the page"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Stored Value</p>
              <p className="text-lg font-bold text-slate-800 mt-1">
                {name || "Nothing stored yet"}
              </p>
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Page loads (persisted)</p>
              <p className="text-3xl font-bold text-indigo-600 mt-1">
                {visits}
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Refresh the page — this number keeps counting
              </p>
            </div>
          </div>

          {/* useDebounce */}
          <div className="bg-white rounded-3xl shadow-lg p-4 border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                <FiClock size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                useDebounce + useFetch
              </h2>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <p className="text-xs text-slate-400 mt-2">
              Typing "{search}" — API only called 500ms after you stop
            </p>

            <div className="mt-4">
              {usersLoading && (
                <p className="text-sm text-slate-500">Loading users...</p>
              )}
              {!usersLoading &&
                debouncedSearch &&
                searchResults?.length === 0 && (
                  <p className="text-sm text-slate-500">No users found</p>
                )}
              {searchResults?.map((user) => (
                <div key={user.id} className="rounded-xl bg-slate-50 p-3 mt-2">
                  <p className="font-semibold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              ))}
            </div>
          </div>

          {/* useFetch */}
          <div className="md:col-span-2 bg-white rounded-3xl shadow-lg p-4 border border-slate-200">
            <div className="flex items-center gap-3 mb-6 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <FiCloud size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">useFetch</h2>
              </div>
              <input
                type="number"
                min="1"
                max="10"
                placeholder="Enter id from 1 to 10...."
                onChange={(e) => setUserId(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm w-50"
              />
            </div>

            {loading && (
              <div className="flex items-center gap-3 text-slate-600">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                Loading user data...
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-600">
                Error: {error}
              </div>
            )}

            {data && !loading && (
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white">
                    {data.name.charAt(0)}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      {data.name}
                    </h3>
                    <p className="text-slate-500">@{data.username}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs text-slate-500 mb-1">EMAIL</p>
                    <p className="font-semibold text-slate-800">{data.email}</p>
                  </div>

                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs text-slate-500 mb-1">PHONE</p>
                    <p className="font-semibold text-slate-800">{data.phone}</p>
                  </div>

                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs text-slate-500 mb-1">WEBSITE</p>
                    <p className="font-semibold text-slate-800">
                      {data.website}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs text-slate-500 mb-1">COMPANY</p>
                    <p className="font-semibold text-slate-800">
                      {data.company.name}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* useWindowSize(); */}

          <div className="bg-white rounded-3xl shadow-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <FiMaximize2 size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  useWindowSize
                </h2>
              </div>
              <div className="flex justify-center mb-4">
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold ${breakpointStyles[breakpoint]}`}
                >
                  {breakpoint}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <p className="text-xs text-slate-500">Width</p>
                <p className="text-3xl font-bold text-indigo-600">{width}px</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <p className="text-xs text-slate-500">Height</p>
                <p className="text-3xl font-bold text-indigo-600">{height}px</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center">
              Resize your browser window to see this update live
            </p>
          </div>

          {/* useOnClickOutside */}
          <div className="bg-white rounded-3xl shadow-lg p-4 border border-slate-200 relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                <FiMoreVertical size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                useOnClickOutside
              </h2>
            </div>

            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              {dropdownOpen ? "Close Menu" : "Open Menu"}
            </button>

            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute left-6 right-6 mt-2 rounded-xl border border-slate-200 bg-white shadow-lg p-3 z-10"
              >
                <p className="text-sm text-slate-600 p-2">Profile</p>
                <p className="text-sm text-slate-600 p-2">Settings</p>
                <p className="text-sm text-slate-600 p-2">Log out</p>
                <p className="text-xs text-slate-400 p-2 border-t border-slate-100 mt-1">
                  Click anywhere outside to close
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
