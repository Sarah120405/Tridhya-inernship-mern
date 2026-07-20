import { useEffect } from "react";

// Custom hook to edit the document title
export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
