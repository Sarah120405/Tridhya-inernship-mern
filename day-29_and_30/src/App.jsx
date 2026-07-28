import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./pages/Layout/Layout";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Transaction = lazy(() => import("./pages/Transaction"));
const Budgets = lazy(() => import("./pages/Budget"));

export default function App() {
  return (
    <Suspense
      fallback={<p className="text-center py-12 text-slate-500">Loading...</p>}
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/transactions" element={<Transaction />} />
          <Route path="/budgets" element={<Budgets />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
