"use client";

import { useRef, useState } from "react";

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

  // items.length が変わったらページ1にリセット（レンダー中のstate調整パターン）
  // cf. https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const prevLengthRef = useRef(items.length);
  if (prevLengthRef.current !== items.length) {
    prevLengthRef.current = items.length;
    setCurrentPage(1);
  }

  // 現在のページが totalPages を超えていたら補正
  const safePage = Math.min(currentPage, totalPages);

  const start = (safePage - 1) * pageSize;
  const paginatedItems = items.slice(start, start + pageSize);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goPrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return {
    paginatedItems,
    currentPage: safePage,
    totalPages,
    goToPage,
    goNext,
    goPrev,
  };
}
