"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, X, BookOpenCheck, MessageSquareText, Users, PenLine } from "lucide-react";

const menuItems = [
  {
    label: "컬럼작성",
    icon: PenLine,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    label: "소통하기",
    icon: Users,
    iconColor: "text-sky-500",
    bgColor: "bg-sky-50",
  },
  {
    label: "상담하기",
    icon: MessageSquareText,
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-50",
  },
  {
    label: "강의질문",
    icon: BookOpenCheck,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
  },
];

export default function WritePostFAB() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 z-50 flex flex-col items-end gap-3"
      style={{ right: "max(1.5rem, calc((100vw - 1440px) / 2 + 1rem))" }}
    >
      {/* Expanded menu items */}
      <div
        className={`flex flex-col gap-2 transition-all duration-200 ${
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => setOpen(false)}
              className="flex cursor-pointer items-center gap-2.5 rounded-full border border-gray-200 bg-white py-2.5 pr-5 pl-3 shadow-lg transition-colors hover:bg-gray-50"
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${item.bgColor}`}>
                <Icon size={16} className={item.iconColor} />
              </div>
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main button */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex cursor-pointer items-center gap-2 rounded-full px-5 py-3 shadow-lg transition-all duration-200 hover:shadow-xl ${
          open
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]"
        }`}
      >
        {open ? (
          <X size={20} className="text-white" strokeWidth={2.5} />
        ) : (
          <Pencil size={18} className="text-white" strokeWidth={2.5} />
        )}
        <span className="text-sm font-semibold text-white whitespace-nowrap">
          {open ? "닫기" : "글 작성하기"}
        </span>
      </button>
    </div>
  );
}
