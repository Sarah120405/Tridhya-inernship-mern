"use client";

import {
  FiEdit3,
  FiSearch,
  FiUsers,
  FiUserCheck,
  FiCode,
  FiShield,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getAllUsers, updateUserRole } from "../../store/slice/userSlice";
import useDebounce from "../../hook/useDebounce";
import { User } from "../../store/slice/authSlice";

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<
    "Customer" | "SupportAgent" | "Developer" | "Admin"
  >("Customer");
  const dispatch = useDispatch<AppDispatch>();

  const {
    allUsers,
    isLoadingAllUsers,
    allUsersError,
    totalUsers,
    currentPage,
    totalPages,
    isUpdatingRole,
    updateRoleError,
  } = useSelector((state: RootState) => state.user);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const limit = 10;

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    dispatch(
      getAllUsers({
        page,
        limit,
        filter,
        search: debouncedSearch,
      }),
    );
  }, [dispatch, page, filter, debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [filter, debouncedSearch]);

  const customerCount = allUsers.filter(
    (user) => user.role === "Customer",
  ).length;

  const supportAgentCount = allUsers.filter(
    (user) => user.role === "SupportAgent",
  ).length;

  const developerCount = allUsers.filter(
    (user) => user.role === "Developer",
  ).length;

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    const result = await dispatch(
      updateUserRole({
        userId: selectedUser.id,
        role: selectedRole as "Customer" | "SupportAgent" | "Developer",
      }),
    );

    if (updateUserRole.fulfilled.match(result)) {
      setSelectedUser(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1500px] space-y-6">
        {/* Header */}
        <section>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FiUsers size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                User Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage users and assign support roles
              </p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Users</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {totalUsers}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiUsers size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Customers</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {customerCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                <FiUserCheck size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Support Agents</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {supportAgentCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FiShield size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Developers</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {developerCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <FiCode size={20} />
              </div>
            </div>
          </div>
        </section>

        {/* User Table */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Toolbar */}
          <div className="border-b border-slate-100 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative w-full lg:max-w-md">
                <FiSearch
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users by name or email..."
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Role Filter */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">All Roles</option>
                <option value="Customer">Customer</option>
                <option value="SupportAgent">Support Agent</option>
                <option value="Developer">Developer</option>
              </select>
            </div>
          </div>

          {/* Error */}
          {allUsersError && (
            <div className="m-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {allUsersError}
            </div>
          )}

          {/* Loading */}
          {isLoadingAllUsers ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-sm text-slate-500">Loading users...</div>
            </div>
          ) : allUsers.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FiUsers size={24} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-800">
                No users found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or role filter.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto md:block h-[500px] [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
                <table className="w-full">
                  <thead className="sticky top-0 z-10 border-b border-slate-100 bg-slate-50">
                    <tr className="">
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        User
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Email
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Role
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Joined
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 overflow-y-auto">
                    {allUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="transition hover:bg-slate-50/60"
                      >
                        {/* User */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                              {user.name.charAt(0).toUpperCase()}
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                {user.name}
                              </p>

                              <p className="text-xs text-slate-400">
                                User ID: {user.id.slice(0, 8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-600">{user.email}</p>
                        </td>

                        {/* Role */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                              user.role === "Customer"
                                ? "bg-slate-100 text-slate-600"
                                : user.role === "SupportAgent"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-violet-50 text-violet-700"
                            }`}
                          >
                            {user.role === "SupportAgent"
                              ? "Support Agent"
                              : user.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${
                                user.isActive
                                  ? "bg-emerald-500"
                                  : "bg-slate-300"
                              }`}
                            />

                            <span className="text-sm text-slate-600">
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </td>

                        {/* Joined */}
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-600">
                            {new Date(user.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4 text-right">
                          {user.role !== "Admin" && (
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setSelectedRole(user.role);
                              }}
                              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                              Change Role
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="space-y-3 p-4 md:hidden">
                {allUsers.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                          {user.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {user.name}
                          </p>

                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.role === "Customer"
                            ? "bg-slate-100 text-slate-600"
                            : user.role === "SupportAgent"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-violet-50 text-violet-700"
                        }`}
                      >
                        {user.role === "SupportAgent"
                          ? "Support Agent"
                          : user.role}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            user.isActive ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                        />

                        <span className="text-xs text-slate-500">
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <FiEdit3 size={14} />
                        Change Role
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Showing page {currentPage} of {totalPages || 1} • {totalUsers}{" "}
                  users
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FiChevronLeft size={16} />
                  </button>

                  <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-blue-600 px-3 text-xs font-medium text-white">
                    {currentPage}
                  </span>

                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FiChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Change User Role
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update the role assigned to {selectedUser.name}.
              </p>
            </div>

            {updateRoleError && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                {updateRoleError}
              </div>
            )}

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Role
              </label>

              <select
                value={selectedRole}
                onChange={(e) =>
                  setSelectedRole(
                    e.target.value as "Customer" | "SupportAgent" | "Developer",
                  )
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              >
                <option value="Customer">Customer</option>
                <option value="SupportAgent">Support Agent</option>
                <option value="Developer">Developer</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                disabled={isUpdatingRole}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateRole}
                disabled={isUpdatingRole || selectedRole === selectedUser.role}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUpdatingRole ? "Updating..." : "Update Role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
