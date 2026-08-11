"use client";
import { useEffect, useMemo, useState } from "react";
import { Search, Download, Mail } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const ROLE_FILTERS = [
  { label: "All roles", value: "All roles" },
  { label: "User", value: "user" },
  { label: "Organizer", value: "organizer" },
  { label: "Admin", value: "admin" },
];
const ROLE_STYLES = {
  admin: "bg-purple-100 text-purple-700",
  organizer: "bg-blue-100 text-blue-700",
  user: "bg-slate-100 text-slate-600",
};
export default function ManageUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/user/", { credentials: "include" })
      .then((res) => res.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  async function handleRoleChange(user, newRole) {
    setUpdatingId(user);
    try {
      const res = await fetch(`http://localhost:5000/api/user/${user}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u._id === user ? updated : u)));
    } catch (err) {
      console.log(err);
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = user.name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchesRole =
        roleFilter === "All roles" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  if (loading) return <p className="text-center py-20">Loading...</p>;

  return (
    <div className="bg-zinc-50">
      <h1 className="text-3xl font-semibold text-slate-500 mb-3">
        Manage Users
      </h1>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white shadow rounded-2xl p-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-violet-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="text-sm border border-violet-100 rounded-lg px-3 py-2 text-zinc-600"
        >
          {ROLE_FILTERS.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>

        <button className="ml-auto flex items-center gap-2 text-sm font-medium text-purple-600 border border-purple-200 rounded-full px-4 py-2 hover:bg-purple-50">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {loading && <p className="text-slate-400">Loading users...</p>}

      {!loading && (
        <div className="bg-white border border-violet-100 shadow rounded-lg rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-400 uppercase border-b border-violet-100 rounded-lg bg-white">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Joined At</th>
                <th className="px-4 py-3 font-medium">Events Created</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const isSelf = user._id === currentUser?._id;
                return (
                  <tr
                    key={user._id}
                    className="border-b last:border-0 border-violet-100 hover:bg-violet-50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{user.name}</p>
                    </td>

                    <td className="px-4 py-3 text-zinc-600">
                      <p className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-zinc-400" />
                        {user.email}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-zinc-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 text-center">
                      {user.eventCount}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={user.role}
                          disabled={updatingId === user._id || isSelf}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                          className={`inline-block px-2.5 py-1 border rounded-lg text-xs font-medium ${ROLE_STYLES[user.role]}`}
                          title={
                            isSelf
                              ? "You cannot change your own role"
                              : undefined
                          }
                        >
                          {user.role}
                          <option value="user">User</option>
                          <option value="organizer">Organizer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-zinc-400 text-sm"
                  >
                    No users match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
