// routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import { Layout } from "../pages/Layout/Layout.jsx";
import Home from "../pages/Home.jsx";
import Articles from "../pages/Articles.jsx";
import ArticleDetail from "../pages/ArticleDetail.jsx";
import BookMark from "../pages/BookMark.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="articles" element={<Articles />} />
        <Route path="articles/:id" element={<ArticleDetail />} />
        <Route path="bookmarks" element={<BookMark />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Route>
    </Routes>
  );
}

export default AppRoutes;
