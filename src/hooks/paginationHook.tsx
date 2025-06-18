// hooks/usePagination.ts
import { useState, useMemo } from "react";

export const usePagination = (items: any[]) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const totalPages = useMemo(
    () => Math.ceil(items.length / perPage),
    [items, perPage]
  );

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return items.slice(startIndex, endIndex);
  }, [currentPage, perPage, items]);

  const paginate = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    currentPage,
    setCurrentPage,
    perPage,
    setPerPage,
    totalPages,
    currentItems,
    paginate,
  };
};
