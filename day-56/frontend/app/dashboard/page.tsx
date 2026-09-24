"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../store/slice/authSlice";
import DashboardComponent from "../components/dashboard/DashboardComponent";

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    dispatch(fetchCurrentUser()).finally(() => setCheckingAuth(false));
  }, [dispatch]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }
  if (!user) {
    return null;
  }

  return <DashboardComponent user={user} />;
}
