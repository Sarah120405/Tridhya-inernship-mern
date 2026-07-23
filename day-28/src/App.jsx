import { Routes, Route } from "react-router-dom";
import ProductList from "./pages/ProductList";
import { lazy, Suspense } from "react";
import Cart from "./pages/Cart";
import { Layout } from "./pages/Layout/Layout";
const Checkout = lazy(() => import("./pages/Checkout"));
const Orders = lazy(() => import("./pages/Order"));

export default function App() {
  return (
    <Suspense
      fallback={
        <p className="text-center py-12 text-slate-500">Loading page...</p>
      }
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
