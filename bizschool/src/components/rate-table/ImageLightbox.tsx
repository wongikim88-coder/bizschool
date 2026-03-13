"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;
const INITIAL_ZOOM = 1;

export default function ImageLightbox({
  src,
  alt,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showHint, setShowHint] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Touch state
  const [lastTouchDist, setLastTouchDist] = useState(0);
  const lastTapRef = useRef(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      resetView();
      setShowHint(true);
      setIsLoaded(false);
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => setShowHint(false), 2500);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "";
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  // Keyboard
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "+":
        case "=":
          e.preventDefault();
          handleZoom(ZOOM_STEP);
          break;
        case "-":
          e.preventDefault();
          handleZoom(-ZOOM_STEP);
          break;
        case "0":
          e.preventDefault();
          resetView();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, zoom]);

  const resetView = useCallback(() => {
    setZoom(INITIAL_ZOOM);
    setPanX(0);
    setPanY(0);
  }, []);

  const handleZoom = useCallback(
    (delta: number, pivotX?: number, pivotY?: number) => {
      setZoom((prev) => {
        const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev + delta));
        if (pivotX !== undefined && pivotY !== undefined && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const cx = pivotX - rect.left - rect.width / 2;
          const cy = pivotY - rect.top - rect.height / 2;
          const scale = next / prev;
          setPanX((px) => cx - scale * (cx - px));
          setPanY((py) => cy - scale * (cy - py));
        }
        return next;
      });
    },
    [],
  );

  // Mouse wheel zoom (Ctrl + scroll)
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
        handleZoom(delta, e.clientX, e.clientY);
      }
    },
    [handleZoom],
  );

  // Mouse drag pan
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom <= 1) return;
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setPanStart({ x: panX, y: panY });
    },
    [zoom, panX, panY],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPanX(panStart.x + (e.clientX - dragStart.x) / zoom);
      setPanY(panStart.y + (e.clientY - dragStart.y) / zoom);
    },
    [isDragging, dragStart, panStart, zoom],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handlers
  const getTouchDist = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touches: React.TouchList) => {
    if (touches.length < 2)
      return { x: touches[0].clientX, y: touches[0].clientY };
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  };

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        setLastTouchDist(getTouchDist(e.touches));
      } else if (e.touches.length === 1) {
        // Double-tap detection
        const now = Date.now();
        if (now - lastTapRef.current < 300) {
          e.preventDefault();
          if (zoom > 1.1) {
            resetView();
          } else {
            handleZoom(1, e.touches[0].clientX, e.touches[0].clientY);
          }
        }
        lastTapRef.current = now;

        if (zoom > 1) {
          setIsDragging(true);
          setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
          setPanStart({ x: panX, y: panY });
        }
      }
    },
    [zoom, panX, panY, handleZoom, resetView],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dist = getTouchDist(e.touches);
        const center = getTouchCenter(e.touches);
        if (lastTouchDist > 0) {
          const scale = dist / lastTouchDist;
          const delta = (scale - 1) * zoom * 0.5;
          handleZoom(delta, center.x, center.y);
        }
        setLastTouchDist(dist);
      } else if (e.touches.length === 1 && isDragging) {
        setPanX(panStart.x + (e.touches[0].clientX - dragStart.x) / zoom);
        setPanY(panStart.y + (e.touches[0].clientY - dragStart.y) / zoom);
      }
    },
    [lastTouchDist, zoom, isDragging, dragStart, panStart, handleZoom],
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setLastTouchDist(0);
  }, []);

  // Backdrop click (only at default zoom)
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && zoom <= 1) {
        onClose();
      }
    },
    [zoom, onClose],
  );

  if (!isOpen) return null;

  const zoomPercent = Math.round(zoom * 100);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="이미지 뷰어"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 motion-safe:animate-[fadeIn_200ms_ease-out]" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3">
        <p className="min-w-0 flex-1 truncate text-sm font-medium text-white">
          {alt}
        </p>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="닫기"
        >
          <X size={20} />
        </button>
      </div>

      {/* Image area */}
      <div
        ref={containerRef}
        className="relative z-10 flex flex-1 items-center justify-center overflow-hidden"
        onClick={handleBackdropClick}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
          touchAction: "none",
        }}
      >
        {/* Loading spinner */}
        {!isLoaded && (
          <div className="absolute flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        )}

        {/* Image */}
        <img
          src={src}
          alt={alt}
          className={`max-h-full max-w-full select-none transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${zoom <= 1 ? "motion-safe:transition-transform motion-safe:duration-150" : ""}`}
          style={{
            transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`,
            transformOrigin: "center center",
          }}
          draggable={false}
          onLoad={() => setIsLoaded(true)}
        />

        {/* Mobile hint */}
        {showHint && (
          <div className="absolute bottom-20 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-xs text-white/80 md:hidden">
            두 손가락으로 확대 · 드래그로 이동
          </div>
        )}
      </div>

      {/* Bottom zoom controls */}
      <div className="relative z-10 flex items-center justify-center px-4 py-3">
        <div className="flex items-center gap-1 rounded-full bg-white/10 px-1 py-1">
          <button
            onClick={() => handleZoom(-ZOOM_STEP)}
            disabled={zoom <= MIN_ZOOM}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 disabled:text-white/30"
            aria-label="축소"
          >
            <ZoomOut size={16} />
          </button>
          <span className="w-12 text-center text-xs font-medium text-white/80">
            {zoomPercent}%
          </span>
          <button
            onClick={() => handleZoom(ZOOM_STEP)}
            disabled={zoom >= MAX_ZOOM}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 disabled:text-white/30"
            aria-label="확대"
          >
            <ZoomIn size={16} />
          </button>
          <div className="mx-0.5 h-4 w-px bg-white/20" />
          <button
            onClick={resetView}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
            aria-label="초기화"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Zoom level live region for screen readers */}
      <span className="sr-only" aria-live="polite">
        확대 {zoomPercent}%
      </span>
    </div>
  );
}
