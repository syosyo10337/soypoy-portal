"use client";

import { useCallback, useMemo, useRef, useState } from "react";

interface UsePaginationResult<T> {
  paginatedItems: T[];
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  goNext: () => void;
  goPrev: () => void;
}

/**
 * クライアントサイドのページネーションフック
 *
 * items が変わったらページ1にリセット
 */
export function usePagination<T>(
  items: T[],
  pageSize: number,
): UsePaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  // items.length が変わったらページ1にリセット
  const prevLengthRef = useRef(items.length);
  if (prevLengthRef.current !== items.length) {
    prevLengthRef.current = items.length;
    setCurrentPage(1);
  }

  // 現在のページが totalPages を超えていたら補正
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages],
  );

  const goNext = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const goPrev = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  return {
    paginatedItems,
    currentPage: safePage,
    totalPages,
    goToPage,
    goNext,
    goPrev,
  };
}
