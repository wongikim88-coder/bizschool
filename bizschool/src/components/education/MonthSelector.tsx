"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { YEAR_RANGE } from "@/data/education";

interface MonthSelectorProps {
  currentYear: number;
  currentMonth: number;
}

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function MonthSelector({ currentYear, currentMonth }: MonthSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateUrl = (year: number, month: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", String(year));
    params.set("month", String(month));
    params.delete("search");
    router.push(`/education?${params.toString()}`);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateUrl(Number(e.target.value), currentMonth);
  };

  const handleMonthClick = (month: number) => {
    updateUrl(currentYear, month);
  };

  // 연도 목록 (max → min)
  const years: number[] = [];
  for (let y = YEAR_RANGE.max; y >= YEAR_RANGE.min; y--) {
    years.push(y);
  }

  return (
    <div className="mt-8">
      {/* 연도 선택 + 안내 문구 */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={currentYear}
          onChange={handleYearChange}
          className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm font-medium text-[var(--color-dark)] focus:border-[var(--color-primary)] focus:outline-none"
          aria-label="연도 선택"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <span className="text-sm text-[var(--color-muted)]">
          해당 교육과정을 클릭하시면 교육내용 및 수강신청을 하실 수 있습니다.
        </span>
      </div>

      {/* 월 탭 바 */}
      <div className="mt-4 overflow-x-auto" role="tablist" aria-label="월 선택">
        <div className="flex border-b border-[var(--color-border)]">
          {months.map((m) => {
            const isActive = m === currentMonth;
            return (
              <button
                key={m}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleMonthClick(m)}
                className={`shrink-0 px-5 py-3 text-sm transition-colors ${
                  isActive
                    ? "mb-[-1px] border-b-2 border-[var(--color-primary)] font-semibold text-[var(--color-dark)]"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-light-bg)] hover:text-[var(--color-dark)]"
                }`}
              >
                {m}월
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
