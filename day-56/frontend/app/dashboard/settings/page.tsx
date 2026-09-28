"use client";

import {
  FiCalendar,
  FiCamera,
  FiClock,
  FiEdit3,
  FiLock,
  FiLogOut,
  FiTag,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect, useState } from "react";
import { fetchCurrentUser, logOut } from "../../store/slice/authSlice";
import { formatMessageDate } from "../../utils/date";
import { useRouter } from "next/navigation";
import {
  updateUserDetails,
  updateUserPassword,
} from "../../store/slice/userSlice";

export default function SettingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const {
    isUpdatingUser,
    updateUserError,
    isUpdatingPassword,
    updatePasswordError,
  } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setName(user?.name);
      setEmail(user?.email);
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    const result = await dispatch(
      updateUserDetails({
        name,
        email,
      }),
    );

    if (updateUserDetails.fulfilled.match(result)) {
      dispatch(fetchCurrentUser());
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      console.log("Password didn't match");

      return "Password didn't match";
    }

    const result = await dispatch(
      updateUserPassword({
        currentPassword,
        newPassword,
      }),
    );

    if (updateUserPassword.fulfilled.match(result)) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1500px] space-y-6">
        {/* Header */}
        <section>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FiEdit3 size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Settings
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </section>

        {/* Main Layout */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
          {/* Main Settings Content */}
          <div className="flex flex-col gap-5 lg:col-span-3">
            {/* Profile */}
            <section className="flex flex-1 flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Profile
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Update your personal information and account details
                  </p>
                </div>
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>

                  <button
                    type="button"
                    className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-white text-blue-600 shadow"
                  >
                    <FiCamera size={13} />
                  </button>
                </div>
              </div>
              {/* Profile Fields */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Role
                  </label>

                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <span className="text-sm text-slate-500">{user?.role}</span>

                    <FiLock className="text-slate-400" size={15} />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Account Status
                  </label>

                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <span className="text-sm text-slate-600">
                        {user?.isActive === true ? "Active" : "In Active"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Role Info */}
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                <p className="text-xs text-blue-700">
                  Your role is managed by the system and cannot be changed here.
                </p>
              </div>
              {/* Quick Info */}
              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-sm font-semibold text-slate-800">
                  Quick Info
                </h3>

                <div className="mt-4 grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                  <div className="flex items-center gap-3 py-3 sm:px-4 sm:py-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <FiCalendar size={16} />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Member Since</p>
                      <p className="text-sm font-medium text-slate-700">
                        {formatMessageDate(user?.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 py-3 sm:px-4 sm:py-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <FiTag size={16} />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Total Tickets</p>
                      <p className="text-sm font-medium text-slate-700">
                        {user?.totalTickets}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Save */}
              {updateUserError && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                  {updateUserError}
                </div>
              )}
              <div className="mt-auto flex justify-end">
                <button
                  type="button"
                  onClick={handleUpdateProfile}
                  disabled={isUpdatingUser}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUpdatingUser ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            {/* Change Password */}
            <section className="flex flex-1 flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <FiLock size={19} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Change Password
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Secure your account with a strong password.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-center">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Current Password
                  </label>

                  <div className="relative">
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full rounded-lg border border-slate-200 px-4 py-3 pr-10 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    New Password
                  </label>

                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Confirm New Password
                  </label>

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
              {updatePasswordError && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                  {updatePasswordError}
                </div>
              )}
              <div className="mt-auto flex justify-end">
                <button
                  type="button"
                  onClick={handleUpdatePassword}
                  disabled={isUpdatingPassword}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUpdatingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </section>
            {/* Account */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                  <FiLogOut size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">Account</h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Manage your account actions
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  dispatch(logOut());
                  router.push("/");
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-100"
              >
                <FiLogOut />
                Log Out
              </button>
            </section>

            {/* Notifications */}

            {/* Appearance */}
            {/* <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <FiSun size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">Appearance</h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Customize the look and feel
                  </p>
                </div>
              </div>

              <p className="mb-3 text-sm font-medium text-slate-700">Theme</p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition ${
                    theme === "light"
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <FiSun />
                  Light
                </button>

                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition ${
                    theme === "dark"
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <FiMoon />
                  Dark
                </button>
              </div>
            </section> */}

            {/* Security Reminder */}
            {/*  <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                <FiShield size={27} />
              </div>

              <h3 className="font-semibold text-blue-900">
                Your security matters
              </h3>

              <p className="mt-1 text-xs leading-5 text-blue-700">
                Keep your account safe and up to date with the latest security
                settings.
              </p>
            </section> */}
          </div>
        </div>
      </div>
    </main>
  );
}
