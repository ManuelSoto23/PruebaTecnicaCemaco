import { useMemo } from "react";
import { PAGINATION } from "../constants/config";

export const usePagination = (
  page,
  totalPages,
  maxVisible = PAGINATION.MAX_VISIBLE_PAGES
) => {
  const getPageNumbers = useMemo(() => {
    const pages = [];

    if (totalPages <= 0) return pages;

    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [page, totalPages, maxVisible]);

  const hasPreviousPage = page > 1;

  const hasNextPage = page < totalPages;

  return {
    getPageNumbers,
    hasPreviousPage,
    hasNextPage,
    isFirstPage: page === 1,
    isLastPage: page === totalPages,
  };
};
