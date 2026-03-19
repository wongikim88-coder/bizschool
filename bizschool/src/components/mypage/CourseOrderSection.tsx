"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  X,
  RotateCcw,
  Download,
} from "lucide-react";
import type {
  CourseOrder,
  CourseOrderStatus,
  PeriodPreset,
  CourseOrderFilter,
} from "@/types";
import {
  mockCourseOrders,
  mockCourseOrderDetails,
  COURSE_ORDERS_PER_PAGE,
} from "@/data/mypage";
import DatePicker from "./DatePicker";
import CourseOrderDetail from "./CourseOrderDetail";

// ── Types ──

type CourseTypeFilterKey = "전체" | "온라인" | "현장";

// ── Helpers ──

function getDateBefore(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function getPresetDays(preset: Exclude<PeriodPreset, "custom">): number {
  switch (preset) {
    case "1m":
      return 30;
    case "3m":
      return 90;
    case "6m":
      return 180;
  }
}

const MAX_RANGE_DAYS = 365 * 5;

function getDaysDiff(from: string, to: string): number {
  const a = new Date(from);
  const b = new Date(to);
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function getDefaultFilter(): CourseOrderFilter {
  return {
    periodPreset: "1m",
    dateFrom: getDateBefore(30),
    dateTo: getToday(),
    orderStatus: "전체",
    searchKeyword: "",
  };
}

const QUICK_PERIODS: { key: string; label: string }[] = [
  { key: "6m", label: "6개월" },
  { key: "2026", label: "2026" },
  { key: "2025", label: "2025" },
  { key: "2024", label: "2024" },
  { key: "2023", label: "2023" },
  { key: "2022", label: "2022" },
];

function getQuickPeriodFilter(key: string): { dateFrom: string; dateTo: string } {
  if (key === "6m") {
    return { dateFrom: getDateBefore(180), dateTo: getToday() };
  }
  // Year filter
  const year = parseInt(key, 10);
  const today = getToday();
  const yearEnd = `${year}-12-31`;
  return {
    dateFrom: `${year}-01-01`,
    dateTo: yearEnd <= today ? yearEnd : today,
  };
}

const periodPresetOptions: { key: PeriodPreset; label: string }[] = [
  { key: "1m", label: "최근 1개월" },
  { key: "3m", label: "최근 3개월" },
  { key: "6m", label: "최근 6개월" },
  { key: "custom", label: "직접입력" },
];

const COURSE_TYPE_OPTIONS: { key: CourseTypeFilterKey; label: string }[] = [
  { key: "전체", label: "전체" },
  { key: "온라인", label: "온라인" },
  { key: "현장", label: "현장교육" },
];

function canDownloadReceipt(order: CourseOrder): boolean {
  return (
    order.paymentStatus === "결제완료" &&
    order.orderStatus !== "취소" &&
    order.orderStatus !== "결제대기"
  );
}

// ── Sub-components ──

function CourseOrderStatusBadge({ status }: { status: CourseOrderStatus }) {
  const variantMap: Record<CourseOrderStatus, string> = {
    결제대기: "bg-amber-50 text-amber-600",
    결제완료: "bg-blue-50 text-blue-600",
    수강중: "bg-purple-50 text-purple-600",
    수강완료: "bg-emerald-50 text-emerald-600",
    환불신청: "bg-orange-50 text-orange-600",
    환불완료: "bg-gray-100 text-gray-500",
    취소: "bg-red-50 text-red-500",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantMap[status]}`}
    >
      {status}
    </span>
  );
}

// ── Pagination ──

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      aria-label="페이지 이동"
      className="flex items-center justify-center gap-1 py-8"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)] disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
        aria-label="이전 페이지"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-sm font-medium transition-colors ${
            page === currentPage
              ? "bg-[var(--color-primary)] font-bold text-white"
              : "text-[var(--color-body)] hover:bg-[var(--color-light-bg)]"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)] disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
        aria-label="다음 페이지"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}

// ── Detail Search Modal ──

function DetailSearchModal({
  currentFilter,
  currentCourseType,
  onApply,
  onClose,
}: {
  currentFilter: CourseOrderFilter;
  currentCourseType: CourseTypeFilterKey;
  onApply: (filter: CourseOrderFilter, courseType: CourseTypeFilterKey) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<CourseOrderFilter>(currentFilter);
  const [localCourseType, setLocalCourseType] = useState<CourseTypeFilterKey>(currentCourseType);
  const [rangeError, setRangeError] = useState("");

  const handlePresetChange = (preset: PeriodPreset) => {
    setRangeError("");
    if (preset === "custom") {
      setLocal((prev) => ({ ...prev, periodPreset: "custom" }));
    } else {
      const days = getPresetDays(preset);
      setLocal((prev) => ({
        ...prev,
        periodPreset: preset,
        dateFrom: getDateBefore(days),
        dateTo: getToday(),
      }));
    }
  };

  const handleDateChange = (field: "dateFrom" | "dateTo", value: string) => {
    setRangeError("");
    setLocal((prev) => ({ ...prev, [field]: value, periodPreset: "custom" }));
  };

  const handleReset = () => {
    setRangeError("");
    setLocal(getDefaultFilter());
    setLocalCourseType("전체");
  };

  const handleApply = () => {
    const diff = getDaysDiff(local.dateFrom, local.dateTo);
    if (diff < 0) {
      setRangeError("시작일이 종료일보다 늦습니다.");
      return;
    }
    if (diff > MAX_RANGE_DAYS) {
      setRangeError("조회기간은 최대 5년까지 가능합니다.");
      return;
    }
    onApply(local, localCourseType);
    onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--color-dark)]">
            상세조회
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer p-1 text-[var(--color-muted)] transition-colors hover:text-[var(--color-dark)]"
          >
            <X size={24} />
          </button>
        </div>

        <hr className="my-4 border-[var(--color-border)]" />

        {/* 기간조회 */}
        <div className="mt-6">
          <h3 className="font-bold text-[var(--color-dark)]">기간조회</h3>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <select
              value={local.periodPreset}
              onChange={(e) =>
                handlePresetChange(e.target.value as PeriodPreset)
              }
              className="rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm text-[var(--color-body)] outline-none focus:border-[var(--color-primary)]"
            >
              {periodPresetOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
            <DatePicker
              value={local.dateFrom}
              onChange={(v) => handleDateChange("dateFrom", v)}
              disabled={local.periodPreset !== "custom"}
            />
            <span className="text-sm text-[var(--color-muted)]">~</span>
            <DatePicker
              value={local.dateTo}
              onChange={(v) => handleDateChange("dateTo", v)}
              disabled={local.periodPreset !== "custom"}
            />
          </div>
          {rangeError && (
            <p className="mt-2 text-xs text-red-500">{rangeError}</p>
          )}
        </div>

        {/* 강의유형 */}
        <div className="mt-6">
          <h3 className="font-bold text-[var(--color-dark)]">강의유형</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {COURSE_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setLocalCourseType(opt.key)}
                className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  localCourseType === opt.key
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                    : "border-[var(--color-border)] bg-white text-[var(--color-body)] hover:bg-[var(--color-light-bg)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 검색 */}
        <div className="mt-6">
          <h3 className="font-bold text-[var(--color-dark)]">검색</h3>
          <input
            type="text"
            value={local.searchKeyword}
            onChange={(e) =>
              setLocal((prev) => ({
                ...prev,
                searchKeyword: e.target.value,
              }))
            }
            placeholder="강좌명을 입력해 주세요."
            className="mt-3 w-full rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm text-[var(--color-body)] outline-none placeholder:text-gray-400 focus:border-[var(--color-primary)]"
          />
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={handleReset}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-8 py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
          >
            <RotateCcw size={14} />
            초기화
          </button>
          <button
            onClick={handleApply}
            className="cursor-pointer rounded-lg bg-[var(--color-primary)] px-10 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──

export default function CourseOrderSection({
  onDetailViewChange,
}: {
  onDetailViewChange?: (isDetail: boolean) => void;
}) {
  const [filter, setFilter] = useState<CourseOrderFilter>(() => ({
    ...getDefaultFilter(),
    periodPreset: "custom" as PeriodPreset,
    dateFrom: getDateBefore(180),
    dateTo: getToday(),
  }));
  const [quickPeriod, setQuickPeriod] = useState<string | null>("6m");
  const [courseTypeFilter, setCourseTypeFilter] =
    useState<CourseTypeFilterKey>("전체");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleApplyFilter = (newFilter: CourseOrderFilter, courseType: CourseTypeFilterKey) => {
    setFilter(newFilter);
    setCourseTypeFilter(courseType);
    setQuickPeriod(null);
    setCurrentPage(1);
  };

  const handleQuickPeriod = (key: string) => {
    const { dateFrom, dateTo } = getQuickPeriodFilter(key);
    setQuickPeriod(key);
    setFilter((prev) => ({
      ...prev,
      periodPreset: "custom" as PeriodPreset,
      dateFrom,
      dateTo,
    }));
    setCurrentPage(1);
  };

  const handleSelectOrder = useCallback(
    (id: string) => {
      setSelectedOrderId(id);
      onDetailViewChange?.(true);
    },
    [onDetailViewChange],
  );

  const handleBackToList = useCallback(() => {
    setSelectedOrderId(null);
    onDetailViewChange?.(false);
  }, [onDetailViewChange]);

  const handleDownloadReceipt = useCallback((orderId: string) => {
    console.info("[Receipt] download requested:", orderId);
  }, []);

  const filteredOrders = useMemo(() => {
    let orders = mockCourseOrders.filter(
      (o) => o.orderedAt >= filter.dateFrom && o.orderedAt <= filter.dateTo,
    );

    if (filter.orderStatus !== "전체") {
      orders = orders.filter((o) => o.orderStatus === filter.orderStatus);
    }

    if (courseTypeFilter !== "전체") {
      const typeMap = { 온라인: "온라인", 현장: "공개교육" } as const;
      orders = orders.filter(
        (o) => o.courseType === typeMap[courseTypeFilter],
      );
    }

    if (filter.searchKeyword.trim()) {
      const keyword = filter.searchKeyword.trim().toLowerCase();
      orders = orders.filter((o) =>
        o.courseTitle.toLowerCase().includes(keyword),
      );
    }

    return orders;
  }, [filter.dateFrom, filter.dateTo, filter.orderStatus, filter.searchKeyword, courseTypeFilter]);

  const totalPages = Math.ceil(filteredOrders.length / COURSE_ORDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * COURSE_ORDERS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + COURSE_ORDERS_PER_PAGE,
  );

  const hasActiveFilters =
    filter.orderStatus !== "전체" ||
    courseTypeFilter !== "전체" ||
    filter.searchKeyword.trim() !== "";

  const handleResetAllFilters = () => {
    const defaultFilter = getDefaultFilter();
    setFilter({
      ...defaultFilter,
      periodPreset: "custom" as PeriodPreset,
      dateFrom: getDateBefore(180),
      dateTo: getToday(),
    });
    setQuickPeriod("6m");
    setCourseTypeFilter("전체");
    setCurrentPage(1);
  };

  const handleRemoveStatusFilter = () => {
    setFilter((prev) => ({ ...prev, orderStatus: "전체" }));
    setCurrentPage(1);
  };

  const handleRemoveCourseTypeFilter = () => {
    setCourseTypeFilter("전체");
    setCurrentPage(1);
  };

  const handleRemoveKeywordFilter = () => {
    setFilter((prev) => ({ ...prev, searchKeyword: "" }));
    setCurrentPage(1);
  };

  // ── Detail View ──
  if (selectedOrderId !== null) {
    const detail = mockCourseOrderDetails[selectedOrderId];
    if (detail) {
      return <CourseOrderDetail order={detail} onBack={handleBackToList} />;
    }
    // Fallback: no detail data, create from basic order
    const basicOrder = mockCourseOrders.find((o) => o.id === selectedOrderId);
    if (basicOrder) {
      const fallbackDetail = {
        ...basicOrder,
        orderedTime: "00:00",
        payment: {
          courseFee: basicOrder.price,
          discountAmount: 0,
          totalAmount: basicOrder.price,
          paidAt:
            basicOrder.paymentStatus === "결제완료"
              ? basicOrder.orderedAt
              : undefined,
        },
      };
      return (
        <CourseOrderDetail order={fallbackDetail} onBack={handleBackToList} />
      );
    }
  }

  // ── List View ──
  return (
    <div className="space-y-4">
      {/* Quick Period Buttons + 상세조회 + Summary */}
      <div className="flex flex-wrap items-center justify-between gap-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {QUICK_PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => handleQuickPeriod(p.key)}
              className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                quickPeriod === p.key
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : "border-[var(--color-border)] bg-white text-[var(--color-body)] hover:bg-[var(--color-light-bg)]"
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
          >
            <Calendar size={16} />
            상세조회
          </button>
        </div>
        <div className="w-full text-left sm:w-auto sm:text-right">
          <p className="text-sm text-[var(--color-body)]">
            {filter.dateFrom} ~ {filter.dateTo} (총{" "}
            <span className="font-bold text-[var(--color-primary)]">
              {filteredOrders.length}
            </span>
            건)
          </p>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {filter.orderStatus !== "전체" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-primary-light)] px-3 py-1 text-xs font-medium text-[var(--color-primary)]">
              {filter.orderStatus}
              <button
                onClick={handleRemoveStatusFilter}
                className="cursor-pointer rounded-full p-0.5 transition-colors hover:bg-[var(--color-primary)] hover:text-white"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {courseTypeFilter !== "전체" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-primary-light)] px-3 py-1 text-xs font-medium text-[var(--color-primary)]">
              {courseTypeFilter === "온라인" ? "온라인" : "현장교육"}
              <button
                onClick={handleRemoveCourseTypeFilter}
                className="cursor-pointer rounded-full p-0.5 transition-colors hover:bg-[var(--color-primary)] hover:text-white"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {filter.searchKeyword.trim() && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-primary-light)] px-3 py-1 text-xs font-medium text-[var(--color-primary)]">
              검색: {filter.searchKeyword}
              <button
                onClick={handleRemoveKeywordFilter}
                className="cursor-pointer rounded-full p-0.5 transition-colors hover:bg-[var(--color-primary)] hover:text-white"
              >
                <X size={12} />
              </button>
            </span>
          )}
          <button
            onClick={handleResetAllFilters}
            className="flex cursor-pointer items-center gap-1 rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)] hover:text-[var(--color-body)]"
          >
            <RotateCcw size={11} />
            검색 초기화
          </button>
        </div>
      )}

      {/* Detail Search Modal */}
      {isModalOpen && (
        <DetailSearchModal
          currentFilter={filter}
          currentCourseType={courseTypeFilter}
          onApply={handleApplyFilter}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Order List */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-white py-20 text-center">
          <p className="text-lg font-medium text-[var(--color-muted)]">
            주문내역이 없습니다.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop: Table (6 columns) */}
          <div className="hidden min-h-[572px] overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-white md:block">
            <table className="w-full table-fixed text-sm">
              <colgroup>
                <col className="w-[10%]" />
                <col className="w-[30%]" />
                <col className="w-[10%]" />
                <col className="w-[15%]" />
                <col className="w-[13%]" />
                <col className="w-[22%]" />
              </colgroup>
              <thead>
                <tr className="bg-[var(--color-light-bg)]">
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                    주문일
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-muted)]">
                    강좌명
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                    유형
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                    결제금액
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                    결제수단
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[var(--color-border)] last:border-0"
                  >
                    <td className="px-4 py-4 text-center text-[var(--color-body)]">
                      {order.orderedAt}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleSelectOrder(order.id)}
                        className="cursor-pointer text-left font-medium text-[var(--color-dark)] transition-colors hover:text-[var(--color-primary)]"
                      >
                        {order.courseTitle}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-center text-[var(--color-body)]">
                      {order.courseType === "온라인" ? "온라인" : "현장"}
                    </td>
                    <td className="px-4 py-4 text-center font-medium text-[var(--color-dark)]">
                      {order.price.toLocaleString()}원
                    </td>
                    <td className="px-4 py-4 text-center text-[var(--color-body)]">
                      {order.paymentMethod}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <CourseOrderStatusBadge status={order.orderStatus} />
                        {canDownloadReceipt(order) && (
                          <button
                            onClick={() => handleDownloadReceipt(order.id)}
                            className="flex cursor-pointer items-center gap-1 text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)]"
                          >
                            <Download size={12} />
                            영수증
                          </button>
                        )}
                        <button
                          onClick={() => handleSelectOrder(order.id)}
                          className="cursor-pointer text-xs text-[var(--color-body)] transition-colors hover:text-[var(--color-primary)]"
                        >
                          상세보기 &gt;
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: Cards (optimized) */}
          <div className="min-h-[480px] space-y-3 md:hidden">
            {paginatedOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-[var(--color-border)] bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <CourseOrderStatusBadge status={order.orderStatus} />
                  <span className="text-xs text-[var(--color-muted)]">
                    {order.orderedAt}
                  </span>
                </div>
                <h4 className="mt-2 font-medium text-[var(--color-dark)]">
                  {order.courseTitle}
                </h4>
                <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                  {order.courseType === "온라인" ? "온라인" : "현장교육"} ·{" "}
                  {order.price.toLocaleString()}원
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-[var(--color-border)] pt-3">
                  <div className="flex gap-2">
                    {canDownloadReceipt(order) && (
                      <button
                        onClick={() => handleDownloadReceipt(order.id)}
                        className="flex cursor-pointer items-center gap-1 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
                      >
                        <Download size={12} />
                        영수증
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleSelectOrder(order.id)}
                    className="cursor-pointer text-xs font-medium text-[var(--color-primary)] transition-colors hover:opacity-80"
                  >
                    상세보기 &gt;
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
