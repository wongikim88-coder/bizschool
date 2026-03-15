"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ClipboardList,
  Package,
  Truck,
  ChevronLeft,
  ChevronRight,
  Calendar,
  X,
  RotateCcw,
  ArrowLeftRight,
  Trash2,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import type {
  BookOrder,
  BookOrderDetail as BookOrderDetailType,
  OrderStatus,
  OrderStatusFilter,
  PeriodPreset,
  BookOrderFilter,
} from "@/types";
import { mockBookOrders, mockBookOrderDetails, mockShippingTracking, ORDERS_PER_PAGE } from "@/data/mypage";
import DatePicker from "./DatePicker";
import BookOrderDetail from "./BookOrderDetail";
import BookOrderShippingTracker from "./BookOrderShippingTracker";
import ExchangeReturnWizard from "./ExchangeReturnWizard";
import type { WizardFormState } from "./ExchangeReturnWizard";

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
  "배송준비",
  "배송중",
  "배송완료",
  "취소",
  "반품",
];

function formatDotDate(date: string): string {
  return date.replace(/-/g, ".");
}

function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case "배송완료":
      return "text-[var(--color-primary)]";
    case "배송중":
      return "text-[var(--color-dark)]";
    case "배송준비":
      return "text-[var(--color-muted)]";
    case "취소":
      return "text-red-500";
    case "반품":
      return "text-red-500";
  }
}

// ── Sub-components ──

const statusItems = [
  { label: "주문건수", icon: ClipboardList, key: "total" as const },
  { label: "배송준비", icon: Package, key: "배송준비" as const },
  { label: "배송중", icon: Truck, key: "배송중" as const },
  { label: "배송완료", icon: CheckCircle, key: "배송완료" as const },
  { label: "취소", icon: X, key: "취소" as const },
  { label: "반품", icon: ArrowLeftRight, key: "반품" as const },
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
      <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
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

interface BookOrderSectionProps {
  onDetailViewChange?: (isDetail: boolean) => void;
}

export default function BookOrderSection({ onDetailViewChange }: BookOrderSectionProps) {
  const [filter, setFilter] = useState<BookOrderFilter>(getDefaultFilter);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);

  const handleSelectOrder = (id: string) => {
    setSelectedOrderId(id);
    onDetailViewChange?.(true);
  };

  const handleBackToList = () => {
    setSelectedOrderId(null);
    onDetailViewChange?.(false);
  };

  const handleShowTracking = (id: string) => {
    setTrackingOrderId(id);
    onDetailViewChange?.(true);
  };

  const handleBackFromTracking = () => {
    setTrackingOrderId(null);
    onDetailViewChange?.(false);
  };

  const handleShowReturnWizard = (id: string) => {
    setReturnOrderId(id);
    onDetailViewChange?.(true);
  };

  const handleBackFromReturnWizard = () => {
    setReturnOrderId(null);
    onDetailViewChange?.(false);
  };

  const handleReturnSubmit = (state: WizardFormState) => {
    // In production this would call an API.
    // The wizard itself shows the confirmation screen after this callback.
    console.info("[ExchangeReturn] submitted", state);
  };

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

  const groupedOrders = useMemo(() => {
    const groups: { date: string; orders: BookOrder[] }[] = [];
    for (const order of paginatedOrders) {
      const last = groups[groups.length - 1];
      if (last && last.date === order.orderedAt) {
        last.orders.push(order);
      } else {
        groups.push({ date: order.orderedAt, orders: [order] });
      }
    }
    return groups;
  }, [paginatedOrders]);

  // Tracking view
  if (trackingOrderId) {
    const trackingData = mockShippingTracking[trackingOrderId];
    if (trackingData) {
      return (
        <BookOrderShippingTracker
          tracking={trackingData}
          onBack={handleBackFromTracking}
        />
      );
    }
    // No tracking data — go back
    handleBackFromTracking();
  }

  // Exchange / Return wizard view
  if (returnOrderId !== null) {
    const clickedOrder = mockBookOrders.find((o) => o.id === returnOrderId);
    const eligibleOrders = clickedOrder
      ? mockBookOrders.filter(
          (o) => o.orderedAt === clickedOrder.orderedAt
        )
      : [];
    return (
      <ExchangeReturnWizard
        initialOrderId={returnOrderId}
        eligibleOrders={eligibleOrders}
        onBack={handleBackFromReturnWizard}
        onSubmit={handleReturnSubmit}
      />
    );
  }

  // Detail view
  if (selectedOrderId) {
    const detailData = mockBookOrderDetails[selectedOrderId];
    if (detailData) {
      return (
        <BookOrderDetail
          order={detailData}
          onBack={handleBackToList}
        />
      );
    }
    // Fallback: build a basic detail from list data
    const listOrder = mockBookOrders.find((o) => o.id === selectedOrderId);
    if (listOrder) {
      const fallbackDetail: BookOrderDetailType = {
        ...listOrder,
        shipping: {
          recipientName: "김비즈",
          phone: "010-1234-5678",
          address: "서울특별시 강남구 테헤란로 123 비즈타워 4층",
        },
        payment: {
          productTotal: listOrder.price,
          discountAmount: 0,
          shippingFee: 0,
          totalAmount: listOrder.price,
          paymentMethod: listOrder.paymentMethod,
          paidAmount: listOrder.paymentStatus === "결제완료" ? listOrder.price : 0,
        },
        points: {
          earnedPoints: listOrder.paymentStatus === "결제완료" ? Math.floor(listOrder.price * 0.01) : 0,
          usedPoints: 0,
        },
      };
      return (
        <BookOrderDetail
          order={fallbackDetail}
          onBack={handleBackToList}
        />
      );
    }
    handleBackToList();
  }

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
          <div className="space-y-8">
            {groupedOrders.map((group) => (
              <div key={group.date}>
                {/* Group Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-dark)] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[var(--color-dark)]">
                      {formatDotDate(group.date)} ({group.orders[0].id})
                    </span>
                    <button
                      onClick={() => handleSelectOrder(group.orders[0].id)}
                      className="cursor-pointer text-sm text-[var(--color-body)] transition-colors hover:text-[var(--color-primary)]"
                    >
                      상세보기 &gt;
                    </button>
                  </div>
                  <button className="flex cursor-pointer items-center gap-1 text-sm text-[var(--color-muted)] transition-colors hover:text-red-500">
                    <Trash2 size={14} />
                    주문내역에서 삭제
                  </button>
                </div>

                {/* Group Body */}
                <div className="border-b border-[var(--color-dark)] bg-white">
                  {group.orders.map((order, idx) => (
                    <div
                      key={order.id}
                      className={idx > 0 ? "border-t border-[var(--color-border)]" : ""}
                    >
                      <div className="p-5">
                        {/* Desktop */}
                        <div className="hidden items-center gap-6 md:flex">
                          <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded border border-[var(--color-border)] bg-[var(--color-light-bg)]">
                            <BookOpen size={28} className="text-[var(--color-muted)]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-[var(--color-dark)]">
                              {order.bookTitle}
                            </p>
                            <p className="mt-1 text-sm text-[var(--color-muted)]">
                              수량 : {order.quantity}
                            </p>
                          </div>
                          <div className="shrink-0 text-center">
                            <p className="text-lg font-bold text-[var(--color-dark)]">
                              {order.price.toLocaleString()}
                              <span className="text-base font-normal">원</span>
                            </p>
                          </div>
                          <div className="w-28 shrink-0 text-center">
                            <p className={`font-bold ${getStatusColor(order.orderStatus)}`}>
                              {order.orderStatus}
                            </p>
                            {order.orderStatus === "배송완료" && (
                              <p className="mt-1 text-xs text-[var(--color-muted)]">
                                {formatDotDate(order.orderedAt)} 배송완료
                              </p>
                            )}
                          </div>
                          <div className="flex shrink-0 flex-col gap-2">
                            <button
                              onClick={() => handleShowTracking(order.id)}
                              className="cursor-pointer rounded-lg border border-[var(--color-border)] px-5 py-1.5 text-sm text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
                            >
                              배송 조회
                            </button>
                            <button
                              onClick={() => handleShowReturnWizard(order.id)}
                              className="cursor-pointer rounded-lg border border-[var(--color-border)] px-5 py-1.5 text-sm text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
                            >
                              교환, 반품 신청
                            </button>
                            <button className="cursor-pointer rounded-lg border border-[var(--color-border)] px-5 py-1.5 text-sm text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]">
                              리뷰 작성
                            </button>
                          </div>
                        </div>

                        {/* Mobile */}
                        <div className="md:hidden">
                          <div className="flex gap-4">
                            <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded border border-[var(--color-border)] bg-[var(--color-light-bg)]">
                              <BookOpen size={22} className="text-[var(--color-muted)]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-[var(--color-dark)]">
                                {order.bookTitle}
                              </p>
                              <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                                수량 : {order.quantity}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <p className="text-base font-bold text-[var(--color-dark)]">
                              {order.price.toLocaleString()}원
                            </p>
                            <div className="text-right">
                              <p className={`text-sm font-bold ${getStatusColor(order.orderStatus)}`}>
                                {order.orderStatus}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => handleShowTracking(order.id)}
                              className="flex-1 cursor-pointer rounded-lg border border-[var(--color-border)] py-2 text-sm text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
                            >
                              배송 조회
                            </button>
                            <button
                              onClick={() => handleShowReturnWizard(order.id)}
                              className="flex-1 cursor-pointer rounded-lg border border-[var(--color-border)] py-2 text-sm text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
                            >
                              교환, 반품 신청
                            </button>
                            <button className="flex-1 cursor-pointer rounded-lg border border-[var(--color-border)] py-2 text-sm text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]">
                              리뷰 작성
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
