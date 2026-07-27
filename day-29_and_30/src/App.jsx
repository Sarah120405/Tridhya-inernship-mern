import { Routes, Route } from "react-router-dom";
import { Layout } from "./pages/Layout/Layout";
import Transaction from "./pages/Transaction";
import Dashboard from "./pages/Dashboard";
import Budgets from "./pages/Budget";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/transactions" element={<Transaction />} />
        <Route path="/budgets" element={<Budgets />} />
      </Route>
    </Routes>
  );
}
