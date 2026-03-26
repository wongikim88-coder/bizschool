"use client";

import { PenSquare, Search } from "lucide-react";
import type { ExpertConsultationCategory } from "@/types";

export type ExpertStatusFilter = "all" | "pending" | "answered";
export type ExpertCategoryFilter = "all" | ExpertConsultationCategory;

interface ExpertFilterBarProps {
  statusFilter: ExpertStatusFilter;
  onStatusFilterChange: (filter: ExpertStatusFilter) => void;
  categoryFilter: ExpertCategoryFilter;
  onCategoryFilterChange: (filter: ExpertCategoryFilter) => void;
  searchKeyword: string;
  onSearchKeywordChange: (value: string) => void;
  onWriteClick: () => void;
  totalCount: number;
  pendingCount: number;
  answeredCount: number;
}

const statusFilters: { key: ExpertStatusFilter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "pending", label: "대기중" },
  { key: "answered", label: "답변완료" },
];

const categoryOptions: { key: ExpertCategoryFilter; label: string }[] = [
  { key: "all", label: "전체 분야" },
  { key: "회계", label: "회계" },
  { key: "세무", label: "세무" },
  { key: "4대보험", label: "4대보험" },
  { key: "인사·총무", label: "인사·총무" },
];

export default function ExpertFilterBar({
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  searchKeyword,
  onSearchKeywordChange,
  onWriteClick,
  totalCount,
  pendingCount,
  answeredCount,
}: ExpertFilterBarProps) {
  const getCounts = (key: ExpertStatusFilter) => {
    if (key === "all") return totalCount;
    if (key === "pending") return pendingCount;
    return answeredCount;
  };

  return (
    <div className="space-y-3">
      {/* Row 1: Status filter + Write button */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          {statusFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => onStatusFilterChange(f.key)}
              className={`cursor-pointer rounded-full px-3 py-1 text-sm transition-colors ${
                statusFilter === f.key
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-light-bg)] text-[var(--color-muted)] hover:bg-gray-200"
              }`}
            >
              {f.label}({getCounts(f.key)})
            </button>
          ))}
        </div>
        <button
          onClick={onWriteClick}
          className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 md:w-auto"
        >
          <PenSquare size={16} />
          상담 신청
        </button>
      </div>

      {/* Row 2: Category dropdown + Search */}
      <div className="flex items-center gap-3">
        <select
          value={categoryFilter}
          onChange={(e) =>
            onCategoryFilterChange(e.target.value as ExpertCategoryFilter)
          }
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-body)] focus:border-[var(--color-primary)] focus:outline-none"
        >
          {categoryOptions.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="relative w-56">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => onSearchKeywordChange(e.target.value)}
            placeholder="제목 검색"
            className="w-full rounded-lg border border-[var(--color-border)] py-2 pl-3 pr-10 text-sm text-[var(--color-dark)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-primary)] text-white transition-opacity hover:opacity-80"
          >
            <Search size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
