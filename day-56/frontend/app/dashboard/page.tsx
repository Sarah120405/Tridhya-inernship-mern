"use client";

import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import DashboardComponent from "../components/dashboard/DashboardComponent";

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Authenticating User...</p>
      </div>
    );
  }

  return <DashboardComponent user={user} />;
}
