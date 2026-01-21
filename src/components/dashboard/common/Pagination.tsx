"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | string)[] => {
    const delta = 2;
    const pages: (number | string)[] = [];

    // Always include first and last
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1); // first page

    // Left ellipsis
    if (left > 2) pages.push("...");

    // Middle range
    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    // Right ellipsis
    if (right < totalPages - 1) pages.push("...");

    // Last page
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
      {/* Info text */}
      <div className="text-sm text-muted-foreground text-center sm:text-left">
        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
      </div>

      {/* Pagination Buttons */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="shrink-0"
        >
          Previous
        </Button>

        
        <div className="flex items-center gap-1 overflow-x-auto max-w-[240px] sm:max-w-none px-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {pageNumbers.map((page, index) =>
            page === "..." ? (
              <span key={`dots-${index}`} className="px-2 text-gray-500 select-none">
                ...
              </span>
            ) : (
              <Button
                key={`page-${page}`}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(Number(page))}
                className={`shrink-0 ${
                  page === currentPage
                    ? "bg-black text-white hover:bg-black/90"
                    : ""
                }`}
              >
                {page}
              </Button>
            )
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="shrink-0"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
