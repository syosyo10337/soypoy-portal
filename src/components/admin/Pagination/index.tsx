"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/shadcn/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  goNext: () => void;
  goPrev: () => void;
}

/**
 * ページネーションUI
 *
 * totalPages <= 1 の場合は非表示
 */
export function Pagination({
  currentPage,
  totalPages,
  goNext,
  goPrev,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={goPrev}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span>前へ</span>
      </Button>
      <span className="text-sm text-muted-foreground">
        {currentPage} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={goNext}
        disabled={currentPage >= totalPages}
      >
        <span>次へ</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
