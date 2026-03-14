"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ClipboardList,
  Clock,
  CreditCard,
  Package,
  Truck,
  ChevronLeft,
  ChevronRight,
  Calendar,
  X,
  RotateCcw,
} from "lucide-react";
import type {
  BookOrder,
  OrderStatus,
  OrderStatusFilter,
  PeriodPreset,
  BookOrderFilter,
} from "@/types";
import { mockBookOrders, ORDERS_PER_PAGE } from "@/data/mypage";
import DatePicker from "./DatePicker";

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

const MAX_RANGE_DAYS = 365 * 5; // 5년

function getDaysDiff(from: string, to: string): number {
  const a = new Date(from);
  const b = new Date(to);
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function getDefaultFilter(): BookOrderFilter {
  return {
    periodPreset: "1m",
    dateFrom: getDateBefore(30),
    dateTo: getToday(),
    orderStatus: "전체",
    searchKeyword: "",
  };
}

const periodPresetOptions: { key: PeriodPreset; label: string }[] = [
  { key: "1m", label: "최근 1개월" },
  { key: "3m", label: "최근 3개월" },
  { key: "6m", label: "최근 6개월" },
  { key: "custom", label: "직접입력" },
];

const orderStatusOptions: OrderStatusFilter[] = [
  "전체",
  "결제대기",
  "결제완료",
  "발송준비",
  "발송완료",
];

// ── Sub-components ──

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const variantMap: Record<OrderStatus, string> = {
    결제대기: "bg-amber-50 text-amber-600",
    결제완료: "bg-blue-50 text-blue-600",
    발송준비: "bg-purple-50 text-purple-600",
    발송완료: "bg-emerald-50 text-emerald-600",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantMap[status]}`}
    >
      {status}
    </span>
  );
}

function PaymentStatusBadge({
  status,
}: {
  status: "결제완료" | "결제대기";
}) {
  if (status === "결제완료") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
        결제완료
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600">
      결제대기
    </span>
  );
}

const statusItems = [
  { label: "주문건수", icon: ClipboardList, key: "total" as const },
  { label: "결제대기", icon: Clock, key: "결제대기" as const },
  { label: "결제완료", icon: CreditCard, key: "결제완료" as const },
  { label: "발송준비", icon: Package, key: "발송준비" as const },
  { label: "발송완료", icon: Truck, key: "발송완료" as const },
];

function OrderStatusBar({ orders }: { orders: BookOrder[] }) {
  const counts = useMemo(() => {
    const map: Record<string, number> = { total: orders.length };
    for (const order of orders) {
      map[order.orderStatus] = (map[order.orderStatus] || 0) + 1;
    }
    return map;
  }, [orders]);

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
      <div className="grid grid-cols-3 gap-4 md:grid-cols-5">
        {statusItems.map((item) => {
          const Icon = item.icon;
          const count = counts[item.key] || 0;
          return (
            <div key={item.key} className="flex flex-col items-center gap-1.5">
              <Icon size={24} className="text-[var(--color-muted)]" />
              <span className="text-xs text-[var(--color-muted)]">
                {item.label}
              </span>
              <span className="text-lg font-bold text-[var(--color-dark)]">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
  onApply,
  onClose,
}: {
  currentFilter: BookOrderFilter;
  onApply: (filter: BookOrderFilter) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<BookOrderFilter>(currentFilter);
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
    onApply(local);
    onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
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

        {/* Info box */}
        <div className="rounded-lg bg-[var(--color-light-bg)] p-4 text-sm text-[var(--color-muted)]">
          <ul className="list-disc space-y-1 pl-4">
            <li>
              조회기간 설정은 6개월 단위이며, 주문정보 조회는 최대 5년까지
              가능합니다.
            </li>
            <li>필터 이용 시 선택한 주문정보만 조회 가능합니다.</li>
          </ul>
        </div>

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

        {/* 주문배송 상태 */}
        <div className="mt-6">
          <h3 className="font-bold text-[var(--color-dark)]">주문배송 상태</h3>
          <select
            value={local.orderStatus}
            onChange={(e) =>
              setLocal((prev) => ({
                ...prev,
                orderStatus: e.target.value as OrderStatusFilter,
              }))
            }
            className="mt-3 w-full rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm text-[var(--color-body)] outline-none focus:border-[var(--color-primary)]"
          >
            {orderStatusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* 검색 */}
        <div className="mt-6">
          <h3 className="font-bold text-[var(--color-dark)]">검색</h3>
          <div className="mt-3 flex gap-2">
            <select className="shrink-0 rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm text-[var(--color-body)] outline-none focus:border-[var(--color-primary)]">
              <option>상품명</option>
            </select>
            <input
              type="text"
              value={local.searchKeyword}
              onChange={(e) =>
                setLocal((prev) => ({
                  ...prev,
                  searchKeyword: e.target.value,
                }))
              }
              placeholder="상품명을 입력해 주세요."
              className="flex-1 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-body)] outline-none placeholder:text-gray-400 focus:border-[var(--color-primary)]"
            />
          </div>
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

export default function BookOrderSection() {
  const [filter, setFilter] = useState<BookOrderFilter>(getDefaultFilter);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleApplyFilter = (newFilter: BookOrderFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const filteredOrders = useMemo(() => {
    let orders = mockBookOrders.filter(
      (order) =>
        order.orderedAt >= filter.dateFrom && order.orderedAt <= filter.dateTo
    );

    if (filter.orderStatus !== "전체") {
      orders = orders.filter(
        (order) => order.orderStatus === filter.orderStatus
      );
    }

    if (filter.searchKeyword.trim()) {
      const keyword = filter.searchKeyword.trim().toLowerCase();
      orders = orders.filter((order) =>
        order.bookTitle.toLowerCase().includes(keyword)
      );
    }

    return orders;
  }, [filter]);

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ORDERS_PER_PAGE
  );

  const activeFilters: string[] = [];
  if (filter.orderStatus !== "전체") activeFilters.push(filter.orderStatus);
  if (filter.searchKeyword.trim())
    activeFilters.push(`"${filter.searchKeyword}"`);

  return (
    <div className="space-y-4">
      {/* Status Summary Bar */}
      <OrderStatusBar orders={mockBookOrders} />

      {/* Filter Bar */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            {filter.periodPreset !== "custom" && (
              <p className="text-sm font-medium text-[var(--color-dark)]">
                {periodPresetOptions.find((o) => o.key === filter.periodPreset)?.label} 주문내역 입니다.
              </p>
            )}
            <p className={`text-sm text-[var(--color-body)]${filter.periodPreset !== "custom" ? " mt-1" : ""}`}>
              {filter.dateFrom} ~ {filter.dateTo} 주문내역 (총{" "}
              <span className="font-bold text-[var(--color-primary)]">
                {filteredOrders.length}
              </span>
              건)
            </p>
            {activeFilters.length > 0 && (
              <p className="mt-1 text-xs text-[var(--color-primary)]">
                필터: {activeFilters.join(", ")}
              </p>
            )}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
          >
            <Calendar size={16} />
            상세조회
          </button>
        </div>
      </div>

      {/* Detail Search Modal */}
      {isModalOpen && (
        <DetailSearchModal
          currentFilter={filter}
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
          {/* Desktop: Table */}
          <div className="hidden min-h-[572px] overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-white md:block">
            <table className="w-full table-fixed text-sm">
              <colgroup>
                <col className="w-[12%]" />
                <col className="w-[32%]" />
                <col className="w-[10%]" />
                <col className="w-[15%]" />
                <col className="w-[15%]" />
                <col className="w-[16%]" />
              </colgroup>
              <thead>
                <tr className="bg-[var(--color-light-bg)]">
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                    날짜
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-muted)]">
                    상품정보
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                    수량
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                    결제방식
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                    결제여부
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                    주문상태
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
                      <p className="font-medium text-[var(--color-dark)]">
                        {order.bookTitle}
                      </p>
                      <p className="text-xs text-[var(--color-muted)]">
                        {order.bookAuthor}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-center text-[var(--color-body)]">
                      {order.quantity}
                    </td>
                    <td className="px-4 py-4 text-center text-[var(--color-body)]">
                      {order.paymentMethod}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <OrderStatusBadge status={order.orderStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: Cards */}
          <div className="min-h-[480px] space-y-3 md:hidden">
            {paginatedOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-[var(--color-border)] bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <OrderStatusBadge status={order.orderStatus} />
                  <span className="text-xs text-[var(--color-muted)]">
                    {order.orderedAt}
                  </span>
                </div>
                <h4 className="mt-2 font-medium text-[var(--color-dark)]">
                  {order.bookTitle}
                </h4>
                <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                  {order.bookAuthor} | {order.quantity}권
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm text-[var(--color-body)]">
                  <span>{order.paymentMethod}</span>
                  <span>·</span>
                  <PaymentStatusBadge status={order.paymentStatus} />
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
