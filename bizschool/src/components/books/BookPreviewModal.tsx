"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  BookOpen,
  FileText,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  ZoomIn,
  Minus,
  Plus,
} from "lucide-react";
import type { Book, PreviewViewMode } from "@/types";
import BookPreviewViewer from "./BookPreviewViewer";

export default function BookPreviewModal({
  book,
  onClose,
  pageRange,
}: {
  book: Book;
  onClose: () => void;
  pageRange?: { from: number; to: number };
}) {
  const fullPreview = book.preview!;

  // If pageRange is provided, generate pages for the cited range
  const preview = pageRange
    ? {
        ...fullPreview,
        pages: Array.from(
          { length: pageRange.to - pageRange.from + 1 },
          (_, i) => ({ pageNumber: pageRange.from + i })
        ),
        totalPages: pageRange.to - pageRange.from + 1,
      }
    : fullPreview;

  const [viewMode, setViewMode] = useState<PreviewViewMode>(pageRange ? "single" : "spread");
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [pageInput, setPageInput] = useState("1");
  const [sidebarPadTop, setSidebarPadTop] = useState(36);
  const [quantity, setQuantity] = useState(1);

  const hasDiscount = book.originalPrice && book.discountRate;

  // Body scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Sync page input
  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  // Keyboard events
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (viewMode !== "grid") {
        if (e.key === "ArrowLeft" && currentPage > 1) {
          setCurrentPage((p) => p - 1);
        } else if (e.key === "ArrowRight" && currentPage < preview.totalPages) {
          setCurrentPage((p) => p + 1);
        }
      }
    },
    [onClose, viewMode, currentPage, preview.totalPages]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleNext = () => {
    if (currentPage < preview.totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePageInputSubmit = () => {
    const num = parseInt(pageInput, 10);
    if (!isNaN(num) && num >= 1 && num <= preview.totalPages) {
      setCurrentPage(num);
    } else {
      setPageInput(String(currentPage));
    }
  };

  const handleGridPageClick = (page: number) => {
    setCurrentPage(page);
    setViewMode("single");
  };

  const viewModeButtons: { mode: PreviewViewMode; icon: React.ReactNode; label: string }[] = [
    { mode: "spread", icon: <BookOpen size={18} />, label: "두 페이지" },
    { mode: "single", icon: <FileText size={18} />, label: "한 페이지" },
    { mode: "grid", icon: <LayoutGrid size={18} />, label: "전체보기" },
  ];

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${book.title} 미리보기`}
    >
      <div className="flex h-full w-full flex-col bg-white md:mx-auto md:my-[2vh] md:h-[96vh] md:max-w-[clamp(1280px,calc(144vh_+_174px),96vw)] md:rounded-2xl md:shadow-2xl">
        {/* ── Header ── */}
        <div className="flex h-12 flex-shrink-0 items-center gap-2 border-b bg-white px-4 md:rounded-t-2xl">
          <span className="rounded-full border border-gray-300 px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-muted)]">
            {pageRange ? "발췌" : "도서"}
          </span>
          <h2 className="min-w-0 flex-1 truncate text-base font-bold text-[var(--color-dark)]">
            {book.title}
            {pageRange && (
              <span className="ml-2 text-sm font-normal text-[var(--color-muted)]">
                p.{pageRange.from}~{pageRange.to}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-gray-100"
            aria-label="미리보기 닫기"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Body: Viewer + Sidebar ── */}
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          {/* Viewer Area */}
          <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden bg-gray-50">
            {/* Navigation Arrows (spread/single only) */}
            {viewMode !== "grid" && (
              <>
                <button
                  onClick={handlePrev}
                  disabled={currentPage <= 1}
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-gray-400/60 p-2 text-white transition-colors hover:bg-gray-500/70 disabled:opacity-30 md:left-4 md:p-2.5"
                  aria-label="이전 페이지"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentPage >= preview.totalPages}
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-gray-400/60 p-2 text-white transition-colors hover:bg-gray-500/70 disabled:opacity-30 md:right-4 md:p-2.5"
                  aria-label="다음 페이지"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* Viewer Content */}
            <BookPreviewViewer
              pages={preview.pages}
              currentPage={currentPage}
              zoomLevel={zoomLevel}
              viewMode={viewMode}
              onPageChange={handleGridPageClick}
              onPageTopChange={setSidebarPadTop}
            />
          </div>

          {/* ── Sidebar ── */}
          <div className="flex flex-shrink-0 flex-col gap-3 bg-gray-50 p-3 md:w-[280px] md:p-4 md:pl-0" style={{ paddingTop: sidebarPadTop }}>
            {/* View Mode Buttons — Box */}
            <div className="flex items-center justify-center gap-1 rounded-xl bg-white p-3 shadow-sm">
              {viewModeButtons.map(({ mode, icon, label }) => (
                <button
                  key={mode}
                  onClick={() => {
                    setViewMode(mode);
                    if (mode === "grid") setZoomLevel(100);
                  }}
                  className={`rounded-lg border px-4 py-2.5 transition-colors ${
                    viewMode === mode
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]"
                      : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                  }`}
                  aria-label={label}
                  title={label}
                >
                  {icon}
                </button>
              ))}
            </div>

            {/* Zoom Slider — Box (hidden in grid mode) */}
            <div className={`items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm ${viewMode === "grid" ? "hidden" : "flex"}`}>
              <input
                type="range"
                min={100}
                max={200}
                value={zoomLevel}
                onChange={(e) => setZoomLevel(Number(e.target.value))}
                className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200 accent-[var(--color-primary)]"
                aria-label="줌 레벨"
              />
              <button
                onClick={() => setZoomLevel((z) => Math.min(200, z + 25))}
                disabled={zoomLevel >= 200}
                className="flex-shrink-0 rounded p-0.5 text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)] disabled:opacity-30"
                aria-label="확대"
              >
                <ZoomIn size={16} />
              </button>
            </div>

            {/* Book Info — Box */}
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="text-sm font-bold text-[var(--color-dark)]">{book.title}</h3>
              <p className="mt-1 text-xs text-[var(--color-primary)]">
                {book.author}
                {book.publisher && <span> · {book.publisher}</span>}
              </p>

              {/* Price */}
              <div className="mt-3 flex items-center gap-2">
                {hasDiscount && (
                  <span className="text-xs text-[var(--color-muted)] line-through">
                    {book.originalPrice!.toLocaleString()}
                  </span>
                )}
                <span className="text-lg font-bold text-[var(--color-primary)]">
                  {book.price.toLocaleString()}
                </span>
                <span className="text-sm text-[var(--color-dark)]">원</span>
              </div>

              {/* Quantity */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center rounded-lg border border-gray-200">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-8 w-8 items-center justify-center text-[var(--color-muted)] transition-colors hover:bg-gray-50 disabled:opacity-30"
                    disabled={quantity <= 1}
                    aria-label="수량 감소"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="flex h-8 w-9 items-center justify-center border-x border-gray-200 text-sm font-medium tabular-nums text-[var(--color-dark)]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                    className="flex h-8 w-8 items-center justify-center text-[var(--color-muted)] transition-colors hover:bg-gray-50 disabled:opacity-30"
                    disabled={quantity >= 99}
                    aria-label="수량 증가"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[var(--color-muted)]">총 상품금액</p>
                  <p className="text-base font-bold text-[var(--color-dark)]">
                    {(book.price * quantity).toLocaleString()}
                    <span className="text-xs font-normal">원</span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 flex items-center gap-2">
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-colors hover:border-gray-300 hover:text-red-400"
                  aria-label="찜하기"
                >
                  <Heart size={18} />
                </button>
                <button className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--color-primary)] text-sm font-medium text-white transition-colors hover:opacity-90">
                  <ShoppingCart size={16} />
                  장바구니
                </button>
              </div>
            </div>

            {/* Page Navigation — Box */}
            <div className="flex items-center justify-center gap-2 rounded-xl bg-white p-3 shadow-sm">
              <button
                onClick={handlePrev}
                disabled={currentPage <= 1}
                className="rounded p-1 text-[var(--color-muted)] transition-colors hover:bg-gray-100 disabled:opacity-30"
                aria-label="이전 페이지"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-1 text-sm">
                <input
                  type="text"
                  inputMode="numeric"
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onBlur={handlePageInputSubmit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handlePageInputSubmit();
                  }}
                  className="h-8 w-10 rounded border border-gray-300 text-center text-sm tabular-nums text-[var(--color-dark)] focus:border-[var(--color-primary)] focus:outline-none"
                  aria-label="페이지 입력"
                />
                <span className="text-[var(--color-muted)]">/ {preview.totalPages}</span>
              </div>
              <button
                onClick={handleNext}
                disabled={currentPage >= preview.totalPages}
                className="rounded p-1 text-[var(--color-muted)] transition-colors hover:bg-gray-100 disabled:opacity-30"
                aria-label="다음 페이지"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
