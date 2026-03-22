"use client";

import { useState } from "react";
import type { PurchaseSubTab } from "@/types";

import BookOrderSection from "./BookOrderSection";
import CourseOrderSection from "./CourseOrderSection";

const subTabs: { key: PurchaseSubTab; label: string }[] = [
  { key: "books", label: "도서 구매내역" },
  { key: "courses", label: "강의 구매내역" },
];

export default function PurchasesSection() {
  const [activeSubTab, setActiveSubTab] =
    useState<PurchaseSubTab>("books");
  const [isDetailView, setIsDetailView] = useState(false);

  return (
    <div>
      {/* 서브탭 — 상세보기일 때 숨김 */}
      {!isDetailView && (
        <div
          role="tablist"
          className="flex overflow-x-auto border-b border-[var(--color-border)]"
          style={{ scrollbarWidth: "none" }}
        >
          {subTabs.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeSubTab === tab.key}
              onClick={() => setActiveSubTab(tab.key)}
              className={`shrink-0 whitespace-nowrap px-6 py-3 text-[15px] transition-colors ${
                activeSubTab === tab.key
                  ? "border-b-2 border-[var(--color-primary)] font-bold text-[var(--color-primary)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-body)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* 콘텐츠 */}
      <div className={isDetailView ? "" : "mt-4"}>
        {activeSubTab === "courses" && (
          <CourseOrderSection onDetailViewChange={setIsDetailView} />
        )}
        {activeSubTab === "books" && (
          <BookOrderSection onDetailViewChange={setIsDetailView} />
        )}
      </div>
    </div>
  );
}
