import { useState } from "react";
import BooksList from "./pages/Books";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./pages/Layout/Layout";
import AuthorList from "./pages/Authors";
import AuthorDetail from "./pages/AuthorDetail";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<BooksList />} />
          <Route path="/author" element={<AuthorList />} />
          <Route path="/author/:id" element={<AuthorDetail />} />

          <Route path="/books" element={<BooksList />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
