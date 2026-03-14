"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Calendar } from "lucide-react";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

function formatDate(date: string): string {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  return `${y}.${m}.${d}`;
}

function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseDate(dateStr: string): { year: number; month: number; day: number } {
  const [y, m, d] = dateStr.split("-").map(Number);
  return { year: y, month: m, day: d };
}

interface DatePickerProps {
  value: string; // "YYYY-MM-DD"
  onChange: (date: string) => void;
  disabled?: boolean;
}

export default function DatePicker({ value, onChange, disabled }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showMonthMenu, setShowMonthMenu] = useState(false);
  const [showYearMenu, setShowYearMenu] = useState(false);

  const parsed = value ? parseDate(value) : { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  const [viewYear, setViewYear] = useState(parsed.year);
  const [viewMonth, setViewMonth] = useState(parsed.month);

  const containerRef = useRef<HTMLDivElement>(null);
  const monthMenuRef = useRef<HTMLDivElement>(null);
  const yearMenuRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const todayStr = toDateString(today.getFullYear(), today.getMonth() + 1, today.getDate());

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowMonthMenu(false);
        setShowYearMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // Sync view when value changes externally
  useEffect(() => {
    if (value) {
      const p = parseDate(value);
      setViewYear(p.year);
      setViewMonth(p.month);
    }
  }, [value]);

  // Scroll selected year into view
  useEffect(() => {
    if (showYearMenu && yearMenuRef.current) {
      const selected = yearMenuRef.current.querySelector("[data-selected=true]");
      if (selected) selected.scrollIntoView({ block: "center" });
    }
  }, [showYearMenu]);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    setShowMonthMenu(false);
    setShowYearMenu(false);
  };

  const handlePrevMonth = () => {
    setShowMonthMenu(false);
    setShowYearMenu(false);
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    setShowMonthMenu(false);
    setShowYearMenu(false);
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day: number, monthOffset: number) => {
    let m = viewMonth + monthOffset;
    let y = viewYear;
    if (m < 1) { m = 12; y--; }
    if (m > 12) { m = 1; y++; }
    onChange(toDateString(y, m, day));
    setIsOpen(false);
    setShowMonthMenu(false);
    setShowYearMenu(false);
  };

  const handleSelectMonth = (month: number) => {
    setViewMonth(month);
    setShowMonthMenu(false);
  };

  const handleSelectYear = (year: number) => {
    setViewYear(year);
    setShowYearMenu(false);
  };

  // Build calendar grid
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);
  const prevMonthDays = getDaysInMonth(
    viewMonth === 1 ? viewYear - 1 : viewYear,
    viewMonth === 1 ? 12 : viewMonth - 1
  );

  const cells: { day: number; offset: number }[] = [];
  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, offset: -1 });
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, offset: 0 });
  }
  // Next month leading days
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, offset: 1 });
  }

  // Year range for dropdown
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear - 10; y <= currentYear + 5; y++) {
    years.push(y);
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm transition-colors ${
          disabled
            ? "cursor-default bg-gray-50 text-[var(--color-muted)]"
            : "cursor-pointer bg-white text-[var(--color-body)] hover:border-[var(--color-primary)]"
        }`}
      >
        <Calendar size={16} className="shrink-0 text-[var(--color-muted)]" />
        <span>{value ? formatDate(value) : "날짜 선택"}</span>
      </button>

      {/* Calendar popup */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-[280px] rounded-xl border border-[var(--color-border)] bg-white p-3 shadow-lg">
          {/* Header: < [월 ▼] [년도 ▼] > */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)]"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1">
              {/* Month selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowMonthMenu((v) => !v);
                    setShowYearMenu(false);
                  }}
                  className="flex cursor-pointer items-center gap-0.5 rounded-lg px-2 py-1 text-sm font-bold text-[var(--color-dark)] transition-colors hover:bg-[var(--color-light-bg)]"
                >
                  {viewMonth}월
                  <ChevronDown size={14} />
                </button>
                {showMonthMenu && (
                  <div
                    ref={monthMenuRef}
                    className="absolute left-1/2 top-full z-10 mt-1 max-h-[200px] w-[80px] -translate-x-1/2 overflow-y-auto rounded-lg border border-[var(--color-border)] bg-white py-1 shadow-lg"
                  >
                    {MONTHS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleSelectMonth(m)}
                        className={`flex w-full cursor-pointer items-center justify-center gap-1 px-3 py-1.5 text-sm transition-colors hover:bg-[var(--color-light-bg)] ${
                          m === viewMonth
                            ? "font-bold text-[var(--color-primary)]"
                            : "text-[var(--color-body)]"
                        }`}
                      >
                        {m === viewMonth && (
                          <span className="text-xs">✓</span>
                        )}
                        {m}월
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Year selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowYearMenu((v) => !v);
                    setShowMonthMenu(false);
                  }}
                  className="flex cursor-pointer items-center gap-0.5 rounded-lg px-2 py-1 text-sm font-bold text-[var(--color-dark)] transition-colors hover:bg-[var(--color-light-bg)]"
                >
                  {viewYear}
                  <ChevronDown size={14} />
                </button>
                {showYearMenu && (
                  <div
                    ref={yearMenuRef}
                    className="absolute left-1/2 top-full z-10 mt-1 max-h-[200px] w-[80px] -translate-x-1/2 overflow-y-auto rounded-lg border border-[var(--color-border)] bg-white py-1 shadow-lg"
                  >
                    {years.map((y) => (
                      <button
                        key={y}
                        type="button"
                        data-selected={y === viewYear}
                        onClick={() => handleSelectYear(y)}
                        className={`flex w-full cursor-pointer items-center justify-center gap-1 px-3 py-1.5 text-sm transition-colors hover:bg-[var(--color-light-bg)] ${
                          y === viewYear
                            ? "font-bold text-[var(--color-primary)]"
                            : "text-[var(--color-body)]"
                        }`}
                      >
                        {y === viewYear && (
                          <span className="text-xs">✓</span>
                        )}
                        {y}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)]"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="mt-2 grid grid-cols-7 text-center text-xs font-medium text-[var(--color-muted)]">
            {WEEKDAYS.map((wd) => (
              <div key={wd} className="py-1.5">
                {wd}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 text-center text-sm">
            {cells.map((cell, i) => {
              const isCurrentMonth = cell.offset === 0;
              let cellYear = viewYear;
              let cellMonth = viewMonth + cell.offset;
              if (cellMonth < 1) { cellMonth = 12; cellYear--; }
              if (cellMonth > 12) { cellMonth = 1; cellYear++; }
              const cellDateStr = toDateString(cellYear, cellMonth, cell.day);
              const isSelected = cellDateStr === value;
              const isToday = cellDateStr === todayStr;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectDay(cell.day, cell.offset)}
                  className={`flex h-9 w-full cursor-pointer items-center justify-center rounded-lg text-sm transition-colors ${
                    isSelected
                      ? "bg-[var(--color-primary)] font-bold text-white"
                      : isToday
                        ? "bg-gray-800 font-bold text-white"
                        : isCurrentMonth
                          ? "text-[var(--color-dark)] hover:bg-[var(--color-light-bg)]"
                          : "text-gray-300 hover:bg-[var(--color-light-bg)]"
                  }`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
