"use client";

import { useRef, useCallback, useState, useEffect, useLayoutEffect } from "react";
import type { BookPreviewPage, PreviewViewMode } from "@/types";

interface BookPreviewViewerProps {
  pages: BookPreviewPage[];
  currentPage: number;
  zoomLevel: number;
  viewMode: PreviewViewMode;
  onPageChange: (page: number) => void;
  onPageTopChange?: (top: number) => void;
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
          : "h-full w-full rounded-sm"
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

/** Minimap overlay – shows current viewport position when zoomed */
function Minimap({
  viewportPos,
  onClick,
}: {
  viewportPos: { x: number; y: number; w: number; h: number };
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      className="absolute left-3 top-3 z-20 h-[90px] w-[120px] cursor-pointer rounded-lg border border-white/40 bg-gray-900/30 shadow-lg backdrop-blur-sm"
      onClick={onClick}
    >
      <div
        className="absolute rounded-sm border-2 border-blue-400/80 bg-blue-400/20"
        style={{
          left: `${viewportPos.x * 100}%`,
          top: `${viewportPos.y * 100}%`,
          width: `${Math.min(viewportPos.w * 100, 100 - viewportPos.x * 100)}%`,
          height: `${Math.min(viewportPos.h * 100, 100 - viewportPos.y * 100)}%`,
        }}
      />
    </div>
  );
}

const MIN_PAD = 36;

export default function BookPreviewViewer({
  pages,
  currentPage,
  zoomLevel,
  viewMode,
  onPageChange,
  onPageTopChange,
}: BookPreviewViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const scrollStart = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [viewportPos, setViewportPos] = useState({ x: 0, y: 0, w: 1, h: 1 });
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const [isMd, setIsMd] = useState(false);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchScrollStartRef = useRef({ x: 0, y: 0 });
  const touchStartXSwipe = useRef<number | null>(null);

  const totalPages = pages.length;
  const isZoomed = zoomLevel > 100;
  const scalePercent = zoomLevel;

  // ── Track md breakpoint ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    setIsMd(mq.matches);
    const handler = () => setIsMd(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Track container dimensions via ResizeObserver ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerSize({
        w: entry.contentRect.width,
        h: entry.contentRect.height,
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [viewMode]);

  // Sync container size immediately on mount (avoid first-frame flash)
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || containerSize.w > 0) return;
    setContainerSize({ w: el.clientWidth, h: el.clientHeight });
  }, [viewMode, containerSize.w]);

  // ── Minimap viewport position update ──
  const updateViewport = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const sw = el.scrollWidth;
    const sh = el.scrollHeight;
    if (sw === 0 || sh === 0) return;
    setViewportPos({
      x: el.scrollLeft / sw,
      y: el.scrollTop / sh,
      w: el.clientWidth / sw,
      h: el.clientHeight / sh,
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isZoomed) return;
    el.addEventListener("scroll", updateViewport);
    updateViewport();
    return () => el.removeEventListener("scroll", updateViewport);
  }, [isZoomed, updateViewport]);

  // Recalculate minimap after layout changes
  useEffect(() => {
    if (!isZoomed) return;
    const timer = setTimeout(updateViewport, 50);
    return () => clearTimeout(timer);
  }, [zoomLevel, currentPage, viewMode, isZoomed, updateViewport]);

  // Center scroll position when zoom/page/viewMode changes
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const center = () => {
      if (el.scrollWidth > el.clientWidth) {
        el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
      }
      if (el.scrollHeight > el.clientHeight) {
        el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
      }
    };
    requestAnimationFrame(center);
    const timer = setTimeout(center, 100);
    return () => clearTimeout(timer);
  }, [currentPage, viewMode, zoomLevel]);

  // ── Mouse drag handlers ──
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isZoomed || !containerRef.current) return;
      if ((e.target as HTMLElement).closest("button")) return;

      isDraggingRef.current = true;
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      scrollStart.current = {
        x: containerRef.current.scrollLeft,
        y: containerRef.current.scrollTop,
      };
      e.preventDefault();
    },
    [isZoomed]
  );

  // Global mouse listeners while dragging
  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      containerRef.current.scrollLeft =
        scrollStart.current.x - (e.clientX - dragStart.current.x);
      containerRef.current.scrollTop =
        scrollStart.current.y - (e.clientY - dragStart.current.y);
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  // ── Touch handlers (pan when zoomed, swipe page when not) ──
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (isZoomed && containerRef.current) {
        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        touchScrollStartRef.current = {
          x: containerRef.current.scrollLeft,
          y: containerRef.current.scrollTop,
        };
      } else {
        touchStartXSwipe.current = e.touches[0].clientX;
      }
    },
    [isZoomed]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isZoomed || !touchStartRef.current || !containerRef.current) return;
      containerRef.current.scrollLeft =
        touchScrollStartRef.current.x -
        (e.touches[0].clientX - touchStartRef.current.x);
      containerRef.current.scrollTop =
        touchScrollStartRef.current.y -
        (e.touches[0].clientY - touchStartRef.current.y);
    },
    [isZoomed]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (isZoomed) {
        touchStartRef.current = null;
        return;
      }
      if (touchStartXSwipe.current === null || viewMode === "grid") return;
      const diff = e.changedTouches[0].clientX - touchStartXSwipe.current;
      if (diff > 50 && currentPage > 1) onPageChange(currentPage - 1);
      else if (diff < -50 && currentPage < totalPages)
        onPageChange(currentPage + 1);
      touchStartXSwipe.current = null;
    },
    [isZoomed, currentPage, totalPages, viewMode, onPageChange]
  );

  // ── Minimap click → jump to position ──
  const handleMinimapClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const ratioX = (e.clientX - rect.left) / rect.width;
      const ratioY = (e.clientY - rect.top) / rect.height;
      el.scrollLeft = ratioX * el.scrollWidth - el.clientWidth / 2;
      el.scrollTop = ratioY * el.scrollHeight - el.clientHeight / 2;
    },
    []
  );

  // ── Page sizing: fit within container at 100%, scale with zoom ──
  // containerRef is now the inner viewport (after MIN_PAD structural margin),
  // so containerSize already excludes the fixed gray margin.
  const availH = containerSize.h;
  const availW = containerSize.w;

  // Determine how many pages are visible side-by-side
  const showTwoPages = viewMode === "spread" && isMd;
  const maxByWidth = showTwoPages
    ? (availW - 2) / 1.5 // 2 pages (each w = h*0.75) + 2px gap
    : availW / 0.75; // 1 page
  const basePageH = Math.min(availH, maxByWidth);
  const pageH = Math.max(0, basePageH * scalePercent / 100);
  const pageW = Math.max(0, pageH * 0.75);

  const pagesW = showTwoPages ? 2 * pageW + 2 : pageW;
  const wrapperStyle: React.CSSProperties = {
    minWidth: containerSize.w,
    minHeight: containerSize.h,
    width: pagesW,
    height: pageH,
  };

  // ── Notify parent of actual page-top offset (for sidebar alignment) ──
  const pageTopPx =
    containerSize.h > 0 && pageH < containerSize.h
      ? Math.round(MIN_PAD + (containerSize.h - pageH) / 2)
      : MIN_PAD;

  useEffect(() => {
    onPageTopChange?.(pageTopPx);
  }, [pageTopPx, onPageTopChange]);

  const containerCursor = isZoomed
    ? isDragging
      ? "cursor-grabbing"
      : "cursor-grab"
    : "";

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

  // ── Spread View ──
  if (viewMode === "spread") {
    const leftPageIdx = currentPage - 1;
    const rightPageIdx = currentPage < totalPages ? currentPage : null;
    const leftPage = pages[leftPageIdx];
    const rightPage = rightPageIdx !== null ? pages[rightPageIdx] : null;

    return (
      <div className="relative h-full w-full">
        {isZoomed && (
          <Minimap viewportPos={viewportPos} onClick={handleMinimapClick} />
        )}
        <div className="h-full w-full" style={{ padding: MIN_PAD }}>
          <div
            ref={containerRef}
            className={`h-full w-full select-none overflow-hidden ${containerCursor}`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex items-center justify-center" style={wrapperStyle}>
              <div className="flex gap-[2px] shadow-xl">
                <div style={{ height: pageH, width: pageW }}>
                  <MockPage page={leftPage} />
                </div>
                <div
                  className="hidden md:block"
                  style={{ height: pageH, width: pageW }}
                >
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
        </div>
      </div>
    );
  }

  // ── Single View ──
  const page = pages[currentPage - 1];

  return (
    <div className="relative h-full w-full">
      {isZoomed && (
        <Minimap viewportPos={viewportPos} onClick={handleMinimapClick} />
      )}
      <div className="h-full w-full" style={{ padding: MIN_PAD }}>
        <div
          ref={containerRef}
          className={`h-full w-full select-none overflow-hidden ${containerCursor}`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex items-center justify-center" style={wrapperStyle}>
            <div className="shadow-xl" style={{ height: pageH, width: pageW }}>
              <MockPage page={page} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
