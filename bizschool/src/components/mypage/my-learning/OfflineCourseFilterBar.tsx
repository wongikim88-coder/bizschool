"use client";

import { Search } from "lucide-react";
import type { OfflineCourseStatusFilter } from "@/types";

interface OfflineCourseFilterBarProps {
  statusFilter: OfflineCourseStatusFilter;
  onStatusFilterChange: (filter: OfflineCourseStatusFilter) => void;
  searchKeyword: string;
  onSearchKeywordChange: (value: string) => void;
}

const statusOptions: OfflineCourseStatusFilter[] = [
  "전체",
  "수강 전",
  "수강 중",
  "수강완료",
];

export default function OfflineCourseFilterBar({
  statusFilter,
  onStatusFilterChange,
  searchKeyword,
  onSearchKeywordChange,
}: OfflineCourseFilterBarProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      {/* Status filter pills */}
      <div className="flex flex-wrap gap-1">
        {statusOptions.map((option) => (
          <button
            key={option}
            onClick={() => onStatusFilterChange(option)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm ${
              statusFilter === option
                ? "bg-[var(--color-dark)] font-medium text-white"
                : "border border-[var(--color-border)] bg-white text-[var(--color-body)]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Search input */}
      <div className="relative w-56 shrink-0">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
        />
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => onSearchKeywordChange(e.target.value)}
          placeholder="강의명 검색"
          className="w-full rounded-lg border border-[var(--color-border)] py-2 pl-9 pr-3 text-sm text-[var(--color-dark)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none"
        />
      </div>
    </div>
  );
}
