import { useState, useMemo } from "react";

export function useSearch(items, searchFields) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;

    const lowerSearch = searchTerm.toLowerCase();

    return items.filter((item) =>
      searchFields.some((field) =>
        item[field]?.toString().toLowerCase().includes(lowerSearch),
      ),
    );
  }, [items, searchTerm, searchFields]);

  return { searchTerm, setSearchTerm, filteredItems };
}
