"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
  MoreVertical,
  BookOpen,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type {
  BookOrder,
  BookOrderDetail as BookOrderDetailType,
  OrderStatus,
  OrderStatusFilter,
  PeriodPreset,
  BookOrderFilter,
} from "@/types";
import { mockBookOrders, mockBookOrderDetails, mockShippingTracking, mockClaimItems, ORDERS_PER_PAGE } from "@/data/mypage";
import DatePicker from "./DatePicker";
import BookOrderDetail from "./BookOrderDetail";
import BookOrderShippingTracker from "./BookOrderShippingTracker";
import ExchangeReturnWizard from "./ExchangeReturnWizard";
import type { WizardFormState } from "./ExchangeReturnWizard";
import CancelWizard from "./CancelWizard";
import ClaimDetail from "./ClaimDetail";

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
  "상품준비",
  "배송준비",
  "배송중",
  "배송완료",
  "취소",
  "반품접수",
  "반품완료",
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
    case "상품준비":
    case "배송준비":
    case "반품접수":
      return "text-[var(--color-muted)]";
    case "반품완료":
      return "text-[var(--color-dark)]";
    case "취소":
      return "text-red-500";
  }
}

// ── Sub-components ──

const statusItems = [
  { label: "주문건수", icon: ClipboardList, key: "total" as const },
  { label: "상품준비", icon: Package, key: "상품준비" as const },
  { label: "배송준비", icon: Package, key: "배송준비" as const },
  { label: "배송중", icon: Truck, key: "배송중" as const },
  { label: "배송완료", icon: CheckCircle, key: "배송완료" as const },
  { label: "취소", icon: X, key: "취소" as const },
  { label: "반품접수", icon: ArrowLeftRight, key: "반품접수" as const },
  { label: "반품완료", icon: CheckCircle, key: "반품완료" as const },
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

// ── Order More Menu (⋮) ──

function OrderMoreMenu({ orderId, orders }: { orderId: string; orders: BookOrder[] }) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const canDelete = orders.every((o) => {
    const deletableStatuses: OrderStatus[] = ["배송완료", "취소", "반품완료"];
    if (!deletableStatuses.includes(o.orderStatus)) return false;
    if (o.orderStatus === "배송완료" && o.exchangeInfo?.status === "교환진행") return false;
    return true;
  });

  const handleDeleteClick = () => {
    if (!canDelete) {
      setAlertOpen(true);
      setOpen(false);
      return;
    }
    setConfirmOpen(true);
  };

  const handleDelete = () => {
    // In production this would call an API
    console.info("[OrderDelete]", orderId);
    setConfirmOpen(false);
    setOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)]"
        aria-label="더보기"
      >
        <MoreVertical size={18} />
      </button>

      {/* Popover */}
      {open && !confirmOpen && (
        <div className="absolute right-0 z-20 mt-1 w-44 rounded-xl border border-[var(--color-border)] bg-white py-1 shadow-lg">
          <button
            onClick={handleDeleteClick}
            className="w-full cursor-pointer px-4 py-2.5 text-left text-sm text-red-500 transition-colors hover:bg-[var(--color-light-bg)]"
          >
            주문 내역 삭제
          </button>
          <button
            onClick={() => setOpen(false)}
            className="w-full cursor-pointer px-4 py-2.5 text-left text-sm text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
          >
            닫기
          </button>
        </div>
      )}

      {/* Delete Blocked Alert */}
      {alertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAlertOpen(false)} />
          <div className="relative mx-4 w-full max-w-sm rounded-2xl bg-white px-6 py-8 text-center shadow-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
              <AlertCircle size={28} className="text-amber-500" />
            </div>
            <p className="mt-4 text-sm font-medium leading-relaxed text-[var(--color-dark)]">
              상품이 아직 배송되지 않았거나<br />반품 · 교환 · 환불 중입니다.
            </p>
            <button
              onClick={() => setAlertOpen(false)}
              className="mt-6 w-full cursor-pointer rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmOpen(false)} />
          <div className="relative mx-4 w-full max-w-sm rounded-2xl bg-white px-6 py-8 text-center shadow-xl">
            <img
              src={orders[0].bookCover}
              alt={orders[0].bookTitle}
              className="mx-auto mb-4 h-28 w-20 rounded object-cover shadow-sm"
            />
            <p className="text-sm font-medium text-[var(--color-dark)]">
              {orders.length === 1
                ? `"${orders[0].bookTitle}"`
                : `"${orders[0].bookTitle}" 외 ${orders.length - 1}건`}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-dark)]">
              주문이 삭제되면 복구할 수 없습니다.<br />삭제하시겠습니까?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => { setConfirmOpen(false); setOpen(false); }}
                className="flex-1 cursor-pointer rounded-lg border border-[var(--color-border)] py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
              >
                닫기
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 cursor-pointer rounded-lg border border-red-300 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
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
            placeholder="도서명 또는 저자명을 입력해 주세요."
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

interface BookOrderSectionProps {
  onDetailViewChange?: (isDetail: boolean) => void;
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

export default function BookOrderSection({ onDetailViewChange }: BookOrderSectionProps) {
  const [filter, setFilter] = useState<BookOrderFilter>(() => ({
    ...getDefaultFilter(),
    periodPreset: "custom" as PeriodPreset,
    dateFrom: getDateBefore(180),
    dateTo: getToday(),
  }));
  const [quickPeriod, setQuickPeriod] = useState<string | null>("6m");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
  const [returnBlockedAlert, setReturnBlockedAlert] = useState<string | null>(null);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [exchangeClaimId, setExchangeClaimId] = useState<string | null>(null);

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
    const order = mockBookOrders.find((o) => o.id === id);
    if (order?.exchangeInfo?.status === "교환진행") {
      setReturnBlockedAlert("이미 교환이 진행 중인 건입니다.");
      return;
    }
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

  const handleShowCancelWizard = (id: string, orderStatus: OrderStatus) => {
    if (orderStatus === "취소") {
      setReturnBlockedAlert("이미 취소된 건입니다.");
      return;
    }
    if (orderStatus === "배송완료" || orderStatus === "배송중") {
      setReturnBlockedAlert("배송이 시작된 건은 취소할 수 없습니다.\n교환/반품을 이용해 주세요.");
      return;
    }
    setCancelOrderId(id);
    onDetailViewChange?.(true);
  };

  const handleBackFromCancelWizard = () => {
    setCancelOrderId(null);
    onDetailViewChange?.(false);
  };

  const handleApplyFilter = (newFilter: BookOrderFilter) => {
    setFilter(newFilter);
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
        order.bookTitle.toLowerCase().includes(keyword) ||
        order.bookAuthor.toLowerCase().includes(keyword)
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

  // Exchange detail view
  if (exchangeClaimId !== null) {
    const claimItem = mockClaimItems.find((c) => c.id === exchangeClaimId);
    if (claimItem) {
      return (
        <ClaimDetail
          claimItem={claimItem}
          onBack={() => {
            setExchangeClaimId(null);
            onDetailViewChange?.(false);
          }}
        />
      );
    }
  }

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
          (o) => o.orderedAt === clickedOrder.orderedAt && o.orderStatus === "배송완료"
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

  // Cancel wizard view
  if (cancelOrderId !== null) {
    return (
      <CancelWizard
        orders={mockBookOrders.filter((o) => o.orderStatus === "상품준비")}
        initialOrderId={cancelOrderId}
        onBack={handleBackFromCancelWizard}
        onComplete={handleBackFromCancelWizard}
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

      {/* Quick Period Buttons + 상세조회 + Summary */}
      <div className="my-5 flex flex-wrap items-center justify-between gap-y-2">
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
          {activeFilters.length > 0 && (
            <p className="text-xs text-[var(--color-primary)]">
              필터: {activeFilters.join(", ")}
            </p>
          )}
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

      {/* Exchange/Return Blocked Alert Modal */}
      {returnBlockedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setReturnBlockedAlert(null)} />
          <div className="relative mx-4 w-full max-w-sm rounded-2xl bg-white px-6 py-8 text-center shadow-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
              <AlertCircle size={28} className="text-amber-500" />
            </div>
            <p className="mt-4 text-sm font-medium leading-relaxed text-[var(--color-dark)] whitespace-pre-line">
              {returnBlockedAlert}
            </p>
            <button
              onClick={() => setReturnBlockedAlert(null)}
              className="mt-6 w-full cursor-pointer rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
            >
              확인
            </button>
          </div>
        </div>
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
                  <OrderMoreMenu orderId={group.orders[0].id} orders={group.orders} />
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
                          <div className="flex shrink-0 flex-col gap-2 min-w-[9rem]">
                            {order.orderStatus !== "취소" && order.orderStatus !== "반품접수" && order.orderStatus !== "반품완료" && (
                              <button
                                onClick={() => handleShowTracking(order.id)}
                                className="w-full cursor-pointer rounded-lg border border-[var(--color-border)] px-5 py-1.5 text-sm text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
                              >
                                배송 조회
                              </button>
                            )}
                            {order.orderStatus === "취소" && (
                              <button
                                onClick={() => handleSelectOrder(order.id)}
                                className="w-full cursor-pointer rounded-lg border border-[var(--color-border)] px-5 py-1.5 text-sm text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
                              >
                                취소 상세 보기
                              </button>
                            )}
                            {(order.orderStatus === "반품접수" || order.orderStatus === "반품완료") && (
                              <button
                                onClick={() => handleSelectOrder(order.id)}
                                className="w-full cursor-pointer rounded-lg border border-[var(--color-border)] px-5 py-1.5 text-sm text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
                              >
                                반품 상세 보기
                              </button>
                            )}
                            {order.orderStatus === "상품준비" && (
                              <button
                                onClick={() => handleShowCancelWizard(order.id, order.orderStatus)}
                                className="w-full cursor-pointer rounded-lg border border-[var(--color-border)] px-5 py-1.5 text-sm text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
                              >
                                주문취소
                              </button>
                            )}
                            {order.orderStatus === "배송완료" && (
                              <button
                                onClick={() => handleShowReturnWizard(order.id)}
                                className="w-full cursor-pointer rounded-lg border border-[var(--color-border)] px-5 py-1.5 text-sm text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
                              >
                                교환, 반품 신청
                              </button>
                            )}
                            {order.orderStatus === "배송완료" && (
                              <button className="w-full cursor-pointer rounded-lg border border-[var(--color-border)] px-5 py-1.5 text-sm text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]">
                                리뷰 작성
                              </button>
                            )}
                          </div>
                        </div>
                        {/* Exchange detail link */}
                        {order.exchangeInfo && (
                          <div className="hidden md:block mt-2 pl-26">
                            <button
                              onClick={() => { setExchangeClaimId(order.exchangeInfo!.claimId); onDetailViewChange?.(true); }}
                              className="cursor-pointer rounded-full border border-[var(--color-primary)] px-4 py-1.5 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-white"
                            >
                              교환 내역 조회 &gt;
                            </button>
                          </div>
                        )}

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
                          <div className="mt-3 flex flex-wrap gap-2">
                            {order.orderStatus !== "취소" && order.orderStatus !== "반품접수" && order.orderStatus !== "반품완료" && (
                              <button
                                onClick={() => handleShowTracking(order.id)}
                                className="flex-1 cursor-pointer rounded-lg border border-[var(--color-border)] py-2 text-sm text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
                              >
                                배송 조회
                              </button>
                            )}
                            {order.orderStatus === "취소" && (
                              <button
                                onClick={() => handleSelectOrder(order.id)}
                                className="flex-1 cursor-pointer rounded-lg border border-[var(--color-border)] py-2 text-sm text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
                              >
                                취소 상세 보기
                              </button>
                            )}
                            {(order.orderStatus === "반품접수" || order.orderStatus === "반품완료") && (
                              <button
                                onClick={() => handleSelectOrder(order.id)}
                                className="flex-1 cursor-pointer rounded-lg border border-[var(--color-border)] py-2 text-sm text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
                              >
                                반품 상세 보기
                              </button>
                            )}
                            {order.orderStatus === "상품준비" && (
                              <button
                                onClick={() => handleShowCancelWizard(order.id, order.orderStatus)}
                                className="flex-1 cursor-pointer rounded-lg border border-[var(--color-border)] py-2 text-sm text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
                              >
                                주문취소
                              </button>
                            )}
                            {order.orderStatus === "배송완료" && (
                              <button
                                onClick={() => handleShowReturnWizard(order.id)}
                                className="flex-1 cursor-pointer rounded-lg border border-[var(--color-border)] py-2 text-sm text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
                              >
                                교환, 반품 신청
                              </button>
                            )}
                            {order.orderStatus === "배송완료" && (
                              <button className="flex-1 cursor-pointer rounded-lg border border-[var(--color-border)] py-2 text-sm text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]">
                                리뷰 작성
                              </button>
                            )}
                          </div>
                          {/* Exchange detail link */}
                          {order.exchangeInfo && (
                            <div className="mt-2">
                              <button
                                onClick={() => { setExchangeClaimId(order.exchangeInfo!.claimId); onDetailViewChange?.(true); }}
                                className="cursor-pointer rounded-full border border-[var(--color-primary)] px-4 py-1.5 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-white"
                              >
                                교환 내역 조회 &gt;
                              </button>
                            </div>
                          )}
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
