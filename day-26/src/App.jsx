import { Routes, Route } from "react-router-dom";
import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
import { Layout } from "./pages/Layout/Layout";
import Orders from "./pages/Order";
import Checkout from "./pages/Checkout";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ProductList />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/checkout" element={<Checkout />} />
      </Route>
    </Routes>
  );
}
