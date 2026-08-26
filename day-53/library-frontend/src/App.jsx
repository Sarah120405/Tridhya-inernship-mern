import { useState } from "react";
import BooksList from "./pages/Books";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./pages/Layout/Layout";
import AuthorList from "./pages/Authors";
import AuthorDetail from "./pages/AuthorDetail";
import BorrowRecords from "./pages/BorrowRecords";
import MemberList from "./pages/Member";
import MemberDetail from "./pages/MemberDetail";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/author" element={<AuthorList />} />
          <Route path="/author/:id" element={<AuthorDetail />} />
          <Route path="/borrow_record/" element={<BorrowRecords />} />
          <Route path="/books" element={<BooksList />} />
          <Route path="/members" element={<MemberList />} />
          <Route path="/members/:id" element={<MemberDetail />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
