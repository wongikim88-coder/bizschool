"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, MinusCircle, FolderPlus } from "lucide-react";

interface CourseCardMenuProps {
  courseId: string;
}

export default function CourseCardMenu({ courseId }: CourseCardMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="rounded p-1 hover:bg-gray-100"
        aria-label="더보기"
      >
        <MoreHorizontal size={16} className="text-[var(--color-muted)]" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 z-20 mb-1 w-40 rounded-lg border border-[var(--color-border)] bg-white py-1 shadow-lg">
          <button
            onClick={() => {
              console.log("수강 취소:", courseId);
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--color-body)] hover:bg-gray-50"
          >
            <MinusCircle size={16} />
            수강 취소
          </button>
          <button
            onClick={() => {
              console.log("폴더에 추가:", courseId);
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--color-body)] hover:bg-gray-50"
          >
            <FolderPlus size={16} />
            폴더에 추가
          </button>
        </div>
      )}
    </div>
  );
}
