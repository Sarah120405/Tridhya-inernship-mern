import { useState } from "react";
import BooksList from "./pages/Books";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./pages/Layout/Layout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<BooksList />} />

          <Route path="/books" element={<BooksList />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
