import { Routes, Route } from "react-router-dom";
import { Layout } from "./pages/Layout/Layout";
import Transaction from "./pages/Transaction";

export default function App(){
  return (
  <Routes>
  <Route path="/" element={<Layout />}>
    <Route path="/transactions" element={<Transaction />}/>
    </Route>
  </Routes>)
}