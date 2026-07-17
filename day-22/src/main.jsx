import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { BookmarksProvider } from "./context/BookmarkContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <BookmarksProvider>
        <App />
      </BookmarksProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
