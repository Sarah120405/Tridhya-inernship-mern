import { useState, useMemo } from "react";

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}
export function useSearch(items, searchFields) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;

    const lowerSearch = searchTerm.toLowerCase();

    return items.filter((item) =>
      searchFields.some((field) =>
        getNestedValue(item, field)
          ?.toString()
          .toLowerCase()
          .includes(lowerSearch),
      ),
    );
  }, [items, searchTerm, searchFields]);

  return { searchTerm, setSearchTerm, filteredItems };
}
