"use client";

import { useRef, useCallback } from "react";
import type { BookPreviewPage, PreviewViewMode } from "@/types";

interface BookPreviewViewerProps {
  pages: BookPreviewPage[];
  currentPage: number;
  zoomLevel: number;
  viewMode: PreviewViewMode;
  onPageChange: (page: number) => void;
}

/** Mock page placeholder */
function MockPage({
  page,
  size = "full",
  onClick,
}: {
  page: BookPreviewPage;
  size?: "full" | "thumb";
  onClick?: () => void;
}) {
  const isThumb = size === "thumb";

  return (
    <div
      className={`relative flex flex-col items-center justify-center border border-gray-200 bg-gradient-to-b from-amber-50 via-white to-orange-50 shadow-sm ${
        isThumb
          ? "aspect-[3/4] w-full cursor-pointer rounded transition-shadow hover:shadow-lg"
          : "aspect-[3/4] w-full rounded-sm"
      }`}
      onClick={onClick}
    >
      {/* Mock text lines */}
      <div
        className={`absolute space-y-2 ${
          isThumb ? "inset-x-3 top-4" : "inset-x-6 top-8 space-y-3 md:inset-x-10 md:top-12"
        }`}
      >
        {Array.from({ length: isThumb ? 6 : 14 }, (_, i) => (
          <div
            key={i}
            className={`rounded bg-gray-200/60 ${isThumb ? "h-1" : "h-1.5 md:h-2"}`}
            style={{ width: `${55 + Math.sin(i * 1.7) * 30}%` }}
          />
        ))}
      </div>

      {/* Page info */}
      <div className="z-10 text-center">
        {page.label && (
          <p
            className={`font-medium text-gray-400 ${
              isThumb ? "text-[8px]" : "mb-0.5 text-[10px] md:text-xs"
            }`}
          >
            {page.label}
          </p>
        )}
        <p
          className={`font-light tabular-nums text-gray-300 ${
            isThumb ? "text-xs" : "text-lg md:text-2xl"
          }`}
        >
          {page.pageNumber}
        </p>
      </div>

      {/* Bottom mock lines */}
      <div
        className={`absolute space-y-2 ${
          isThumb ? "inset-x-3 bottom-4" : "inset-x-6 bottom-8 space-y-3 md:inset-x-10 md:bottom-12"
        }`}
      >
        {Array.from({ length: isThumb ? 4 : 8 }, (_, i) => (
          <div
            key={i}
            className={`rounded bg-gray-200/60 ${isThumb ? "h-1" : "h-1.5 md:h-2"}`}
            style={{ width: `${65 + Math.cos(i * 2) * 25}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function BookPreviewViewer({
  pages,
  currentPage,
  zoomLevel,
  viewMode,
  onPageChange,
}: BookPreviewViewerProps) {
  const touchStartX = useRef<number | null>(null);
  const totalPages = pages.length;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null || viewMode === "grid") return;
      const diff = e.changedTouches[0].clientX - touchStartX.current;
      if (diff > 50 && currentPage > 1) onPageChange(currentPage - 1);
      else if (diff < -50 && currentPage < totalPages) onPageChange(currentPage + 1);
      touchStartX.current = null;
    },
    [currentPage, totalPages, viewMode, onPageChange]
  );

  const scalePercent = zoomLevel; // 100 = base size, 200 = 2x

  // ── Grid View ──
  if (viewMode === "grid") {
    return (
      <div className="h-full w-full overflow-auto p-4 md:p-6">
        <div className="mx-auto grid max-w-[900px] grid-cols-3 gap-3 md:grid-cols-4 md:gap-4">
          {pages.map((page) => (
            <MockPage
              key={page.pageNumber}
              page={page}
              size="thumb"
              onClick={() => onPageChange(page.pageNumber)}
            />
          ))}
        </div>
      </div>
    );
  }

  // Responsive page height: scoped via inline <style> + media query
  const zoomPageStyles = `
    .bpv-page { height: ${50 * scalePercent / 100}vh; }
    .bpv-spread-page { height: ${50 * scalePercent / 100}vh; }
    @media (min-width: 768px) {
      .bpv-page { height: ${75 * scalePercent / 100}vh; }
      .bpv-spread-page { height: ${70 * scalePercent / 100}vh; }
    }
  `;

  // ── Spread View (two pages) ──
  if (viewMode === "spread") {
    const leftPageIdx = currentPage - 1;
    const rightPageIdx = currentPage < totalPages ? currentPage : null;
    const leftPage = pages[leftPageIdx];
    const rightPage = rightPageIdx !== null ? pages[rightPageIdx] : null;

    return (
      <div
        className="h-full w-full overflow-auto"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <style>{zoomPageStyles}</style>
        <div
          className="flex min-h-full items-center justify-center p-4 md:p-8"
          style={{ width: "fit-content", minWidth: "100%" }}
        >
          <div className="flex gap-[2px] shadow-xl">
            {/* Left page */}
            <div className="bpv-spread-page w-auto" style={{ aspectRatio: "3/4" }}>
              <MockPage page={leftPage} />
            </div>
            {/* Right page */}
            <div className="bpv-spread-page hidden w-auto md:block" style={{ aspectRatio: "3/4" }}>
              {rightPage ? (
                <MockPage page={rightPage} />
              ) : (
                <div className="flex h-full w-full items-center justify-center border border-gray-200 bg-white">
                  <p className="text-sm text-gray-300">미리보기 끝</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Single View ──
  const page = pages[currentPage - 1];

  return (
    <div
      className="h-full w-full overflow-auto"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <style>{zoomPageStyles}</style>
      <div
        className="flex min-h-full items-center justify-center p-4 md:p-8"
        style={{ width: "fit-content", minWidth: "100%" }}
      >
        <div className="bpv-page w-auto shadow-xl" style={{ aspectRatio: "3/4" }}>
          <MockPage page={page} />
        </div>
      </div>
    </div>
  );
}
