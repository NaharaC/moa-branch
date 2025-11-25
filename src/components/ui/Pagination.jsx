import React from "react";
import { cx } from "../../utils/ui-helpers.js";

const Pages = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [1];
  const leftSibling = Math.max(currentPage - 1, 2);
  const rightSibling = Math.min(currentPage + 1, totalPages - 1);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (showLeftEllipsis) {
    pages.push("left-ellipsis");
  } else {
    for (let i = 2; i < leftSibling; i += 1) {
      pages.push(i);
    }
  }

  for (let i = leftSibling; i <= rightSibling; i += 1) {
    pages.push(i);
  }

  if (showRightEllipsis) {
    pages.push("right-ellipsis");
  } else {
    for (let i = rightSibling + 1; i < totalPages; i += 1) {
      pages.push(i);
    }
  }

  pages.push(totalPages);
  return pages;
};

export function Pagination({ page, totalPages, totalItems, onPageChange }) {
  if (!totalItems) return null;

  const safePage = Math.max(1, Math.min(page, totalPages));
  const canGoPrev = safePage > 1;
  const canGoNext = safePage < totalPages;
  const pageItems = Pages(safePage, totalPages);

  const handlePrev = () => {
    if (!canGoPrev) return;
    onPageChange?.(safePage - 1);
  };

  const handleNext = () => {
    if (!canGoNext) return;
    onPageChange?.(safePage + 1);
  };

  return (
    <nav 
      aria-label="Paginación" 
      className="flex items-center justify-center text-[color:var(--color-text-secondary)]"
    >
      <button
        type="button"
        onClick={handlePrev}
        disabled={!canGoPrev}
        className={cx(
          "group p-2 rounded-full text-inherit",
          "transition-colors duration-200",
          "disabled:opacity-40",
          canGoPrev
            ? "cursor-pointer hover:text-[color:var(--color-primary1)]"
            : "cursor-not-allowed"
        )}
        aria-label="Página anterior"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="m15 19-7-7 7-7" />
        </svg>
      </button>

      <div className="mx-2 flex items-center gap-1 rounded-full bg-transparent px-1 py-0.5 text-sm font-normal text-[color:var(--color-text-secondary)]">
        {pageItems.map((item) => {
          if (typeof item === "string") {
            return (
              <span 
                key={item} 
                className="px-3 py-1 text-base text-[color:var(--color-text-muted)]"
              >
                …
              </span>
            );
          }

          const isActive = item === safePage;
          return (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange?.(item)}
              className={cx(
                "px-3 py-1 rounded-full",
                "transition-colors duration-200",
                "font-normal",
                "hover:text-[color:var(--color-primary1)]",
                "hover:underline underline-offset-8",
                isActive
                  ? "text-[color:var(--color-primary1)] font-medium"
                  : "text-[color:var(--color-secondary1)]"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {item}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={!canGoNext}
        className={cx(
          "group p-2 rounded-full text-inherit",
          "transition-colors duration-200",
          "disabled:opacity-40",
          canGoNext
            ? "cursor-pointer hover:text-[color:var(--color-primary1)]"
            : "cursor-not-allowed"
        )}
        aria-label="Página siguiente"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="m9 5 7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}
