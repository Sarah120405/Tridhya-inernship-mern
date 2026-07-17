import { createContext, useState } from "react";

export const BookmarksContext = createContext(null);

const STORAGE_KEY = "bookmarkedArticles";

function normalizeTagList(article) {
  return {
    ...article,
    tag_list: Array.isArray(article.tag_list)
      ? article.tag_list
      : typeof article.tag_list === "string"
        ? article.tag_list.split(",").map((t) => t.trim())
        : [],
  };
}

function readBookmarks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return parsed.map(normalizeTagList);
  } catch {
    return [];
  }
}

export function BookmarksProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(readBookmarks);

  function toggleBookmark(article) {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === article.id);
      const updated = exists
        ? prev.filter((b) => b.id !== article.id)
        : [...prev, normalizeTagList(article)];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  function isBookmarked(id) {
    return bookmarks.some((b) => b.id === id);
  }

  return (
    <BookmarksContext.Provider
      value={{ bookmarks, toggleBookmark, isBookmarked }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}
