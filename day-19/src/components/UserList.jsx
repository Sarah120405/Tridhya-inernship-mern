import { useState, useEffect } from "react";
import { MetricCard } from "./MetricCard";
import { FiUsers, FiFilter, FiRefreshCw } from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

const API_BASE = "https://jsonplaceholder.typicode.com";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  // const [refresh, setRefresh] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/users`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setLastUpdated(new Date());
        setUsers(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  /* If add a refresh state in dependency array it will fetch whenever refresh state changes 
    useEffect(() => {
      fetchUsers();
    }, [refresh]); */

  const filteredUsers = users.filter((user) => {
    const term = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">User Directory</h1>

          <p className="text-slate-500">
            Manage and explore all registered users
          </p>
        </div>
        <div>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-3">
        <MetricCard
          title="Total users"
          value={users.length}
          icon={<FiUsers />}
          icon_2={<FiUsers />}
        />
        <MetricCard
          title="Showing"
          value={filteredUsers.length}
          icon={<FiFilter />}
          icon_2={<FiFilter />}
        />
        <MetricCard
          title="Companies"
          value={new Set(users.map((u) => u.company.name)).size}
          icon={<HiOutlineBuildingOffice2 />}
          icon_2={<HiOutlineBuildingOffice2 />}
        />
      </div>
      <div className="flex justify-between items-center">
        <div className="relative mb-8 max-w-md">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />

          <svg
            className="absolute left-4 top-3.5 h-5 w-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M21 21l-5-5M11 18a7 7 0 100-14 7 7 0 000 14z" />
          </svg>
        </div>
        <div>
          <p>Updated: {lastUpdated?.toLocaleTimeString() || "Never"}</p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
        </div>
      )}
      {error && (
        <div className="flex item-center justify-center rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600 uppercase tracking-wide text-xs">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Website</th>
                <th className="px-4 py-3">Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-slate-200 transition hover:bg-indigo-50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 font-semibold text-white shadow">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-slate-400">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{user.email}</div>
                    <div className="text-gray-500 text-xs">{user.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                      {user.company.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`https://${user.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-indigo-600 hover:underline"
                    >
                      {user.website}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs leading-5 text-slate-500">
                      <div>{user.address.street}</div>
                      <div>{user.address.city}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="py-14 text-center">
              <h3 className="text-lg font-semibold text-slate-600">
                No users found
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Try searching with another keyword.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserList;
