"use client";

import { PenSquare, Search } from "lucide-react";
import type { QnaCategoryFilter, QnaAnswerStatusFilter, CourseCategory } from "@/types";

interface QnaFilterBarProps {
  categoryFilter: QnaCategoryFilter;
  onCategoryFilterChange: (filter: QnaCategoryFilter) => void;
  answerStatusFilter: QnaAnswerStatusFilter;
  onAnswerStatusFilterChange: (filter: QnaAnswerStatusFilter) => void;
  searchKeyword: string;
  onSearchKeywordChange: (value: string) => void;
  onWriteClick: () => void;
  totalCount: number;
  pendingCount: number;
  answeredCount: number;
}

const statusFilters: { key: QnaAnswerStatusFilter; label: string }[] = [
  { key: "전체", label: "전체" },
  { key: "답변대기", label: "답변대기" },
  { key: "답변완료", label: "답변완료" },
];

const categoryOptions: QnaCategoryFilter[] = [
  "전체",
  "온라인 강의",
  "현장 강의",
  "인재키움 프리미엄 훈련",
];

export default function QnaFilterBar({
  categoryFilter,
  onCategoryFilterChange,
  answerStatusFilter,
  onAnswerStatusFilterChange,
  searchKeyword,
  onSearchKeywordChange,
  onWriteClick,
  totalCount,
  pendingCount,
  answeredCount,
}: QnaFilterBarProps) {
  const getCounts = (key: QnaAnswerStatusFilter) => {
    if (key === "전체") return totalCount;
    if (key === "답변대기") return pendingCount;
    return answeredCount;
  };

  return (
    <div className="space-y-3">
      {/* Row 1: 답변 상태 필터 + 질문하기 버튼 */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          {statusFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => onAnswerStatusFilterChange(f.key)}
              className={`cursor-pointer rounded-full px-3 py-1 text-sm transition-colors ${
                answerStatusFilter === f.key
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
          질문하기
        </button>
      </div>

      {/* Row 2: 카테고리 드롭다운 + 검색 */}
      <div className="flex items-center gap-3">
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value as QnaCategoryFilter)}
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-body)] focus:border-[var(--color-primary)] focus:outline-none"
        >
          {categoryOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "전체" ? "전체 강의유형" : opt}
            </option>
          ))}
        </select>

        <div className="relative w-56">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
          />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => onSearchKeywordChange(e.target.value)}
            placeholder="제목 또는 강의명 검색"
            className="w-full rounded-lg border border-[var(--color-border)] py-2 pl-9 pr-3 text-sm text-[var(--color-dark)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
