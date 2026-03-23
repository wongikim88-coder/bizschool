"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import type { Book } from "@/types";
import BookPreviewModal from "./BookPreviewModal";

export default function BookPreviewButton({
  book,
  variant = "overlay",
}: {
  book: Book;
  variant?: "overlay" | "inline" | "icon";
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!book.preview) return null;

  return (
    <>
      {variant === "overlay" ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center justify-center gap-1 bg-black/60 py-1.5 text-xs font-medium text-white transition-colors hover:bg-black/75"
          aria-label={`${book.title} 미리보기`}
        >
          <Eye size={14} />
          미리보기
        </button>
      ) : variant === "icon" ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)] md:h-11 md:w-11"
          aria-label={`${book.title} 미리보기`}
        >
          <Eye size={20} />
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
          aria-label={`${book.title} 미리보기`}
        >
          <Eye size={14} />
          미리보기
        </button>
      )}

      {isOpen && <BookPreviewModal book={book} onClose={() => setIsOpen(false)} />}
    </>
  );
}
