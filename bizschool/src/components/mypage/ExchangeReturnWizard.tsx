"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  BookOpen,
  CheckCircle2,
  Circle,
  MapPin,
  Calendar,
  AlertCircle,
  X,
} from "lucide-react";
import type { BookOrder } from "@/types";

// ─────────────────────────────────────────────
// Domain types
// ─────────────────────────────────────────────

export type ReturnResolution = "교환" | "반품후환불";
export type PickupLocation = "문앞" | "경비실" | "기타";
export type EntranceType = "code" | "nocode";
export type PickupDateOption = "tomorrow" | "custom";

export interface ReturnReasonOption {
  id: string;
  label: string;
  /** null = no detail textarea, string = placeholder text */
  detailPlaceholder: string | null;
}

export interface WizardFormState {
  // Step 1
  selectedOrderIds: string[];
  // Step 2
  reasonId: string | null;
  reasonDetailText: string;
  // Step 3
  resolution: ReturnResolution | null;
  pickupAddress: string;
  pickupAddressDetail: string;
  pickupLocation: PickupLocation | null;
  pickupEtcText: string;
  entranceType: EntranceType | null;
  entranceCode: string;
  pickupDateOption: PickupDateOption;
  pickupDate: string;
}

interface ExchangeReturnWizardProps {
  /** Pre-selected order to start from (e.g., clicked "교환, 반품 신청" on a specific row). */
  initialOrderId?: string;
  /** All orders available for selection (typically those with 배송완료 status). */
  eligibleOrders: BookOrder[];
  onBack: () => void;
  onSubmit: (state: WizardFormState) => void;
}

// ─────────────────────────────────────────────
// Static data
// ─────────────────────────────────────────────

const REASON_OPTIONS: ReturnReasonOption[] = [
  { id: "r01", label: "상품이 마음에 들지 않음", detailPlaceholder: null },
  { id: "r02", label: "상품이 더이상 필요 없어짐", detailPlaceholder: null },
  { id: "r03", label: "다른 상품이 배송됨", detailPlaceholder: "대신 배송 온 상품을 입력해주세요." },
  { id: "r04", label: "상품에 문제가 있음", detailPlaceholder: "어떤 문제가 있는지 입력해주세요." },
  { id: "r05", label: "상품이 설명과 다름", detailPlaceholder: "어떤 부분이 다른지 입력해주세요." },
  { id: "r06", label: "상품이 파손되어 배송됨", detailPlaceholder: "파손 상태를 입력해주세요." },
  { id: "r07", label: "기타 사유", detailPlaceholder: "상세 사유를 입력해주세요." },
];

const REASON_DETAIL_MAX = 250;

const STEPS = [
  { number: 1, label: "상품 선택" },
  { number: 2, label: "사유 선택" },
  { number: 3, label: "해결방법 선택" },
];

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

// StepIndicator

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
      <div className="mx-auto flex max-w-lg items-center">
        {STEPS.map((step, idx) => {
          const isDone = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <div key={step.number} className="contents">
              {/* Circle + Label */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    isDone
                      ? "bg-[var(--color-primary)] text-white"
                      : isCurrent
                        ? "bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary)]/20"
                        : "bg-gray-100 text-gray-400"
                  }`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {step.number}
                </div>
                <span
                  className={`text-xs font-medium ${
                    isCurrent
                      ? "text-[var(--color-primary)]"
                      : isDone
                        ? "text-[var(--color-body)]"
                        : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {/* Connector line (not after last step) */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`mx-2 mb-5 h-0.5 flex-1 transition-colors ${
                    step.number < currentStep
                      ? "bg-[var(--color-primary)]"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// RadioOption — reusable styled radio row

interface RadioOptionProps {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

function RadioOption({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: RadioOptionProps) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-3 rounded-xl p-4 transition-colors bg-white ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        disabled={disabled}
        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[var(--color-primary)]"
      />
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-[var(--color-dark)]">
          {label}
        </span>
        {description && (
          <span className="text-xs text-[var(--color-muted)]">{description}</span>
        )}
      </span>
    </label>
  );
}

// ── Step 1: 상품 선택 ──

interface Step1Props {
  eligibleOrders: BookOrder[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onNext: () => void;
  onBackToList: () => void;
}

function Step1ProductSelect({
  eligibleOrders,
  selectedIds,
  onToggle,
  onNext,
  onBackToList,
}: Step1Props) {
  const hasSelection = selectedIds.length > 0;

  return (
    <div className="space-y-4">
      {/* Info notice */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <AlertCircle
          size={18}
          className="mt-0.5 shrink-0 text-amber-500"
          aria-hidden="true"
        />
        <p className="text-sm text-amber-700">
          교환/반품 신청은 <strong>배송완료</strong> 상품에 한해 가능합니다.
          신청 후 영업일 기준 1~3일 내 수거가 진행됩니다.
        </p>
      </div>

      {/* Product list */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white">
        <div className="border-b border-[var(--color-border)] px-5 py-4">
          <h3 className="font-bold text-[var(--color-dark)]">
            신청할 상품을 선택해 주세요
          </h3>
        </div>

        {eligibleOrders.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-[var(--color-muted)]">
              교환/반품 신청 가능한 상품이 없습니다.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--color-border)]">
            {eligibleOrders.map((order) => {
              const isChecked = selectedIds.includes(order.id);
              return (
                <li key={order.id}>
                  <label
                    htmlFor={`order-${order.id}`}
                    className={`flex cursor-pointer items-start gap-4 p-5 transition-colors ${
                      isChecked
                        ? "bg-[var(--color-primary-light)]"
                        : "hover:bg-[var(--color-light-bg)]"
                    }`}
                  >
                    {/* Custom checkbox */}
                    <input
                      type="checkbox"
                      id={`order-${order.id}`}
                      checked={isChecked}
                      onChange={() => onToggle(order.id)}
                      className="sr-only"
                    />
                    <span
                      className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                        isChecked
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                          : "border-gray-300 bg-white"
                      }`}
                      aria-hidden="true"
                    >
                      {isChecked && (
                        <svg
                          viewBox="0 0 12 10"
                          className="h-3 w-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="1 5 4 9 11 1" />
                        </svg>
                      )}
                    </span>

                    {/* Book thumbnail placeholder */}
                    <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded border border-[var(--color-border)] bg-[var(--color-light-bg)]">
                      <BookOpen size={20} className="text-[var(--color-muted)]" />
                    </div>

                    {/* Book info */}
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium text-[var(--color-dark)]">
                        {order.bookTitle}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                        {order.bookAuthor}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-body)]">
                        <span>수량 {order.quantity}권</span>
                        <span className="text-[var(--color-border)]">|</span>
                        <span className="font-medium text-[var(--color-dark)]">
                          {order.price.toLocaleString()}원
                        </span>
                        <span className="text-[var(--color-border)]">|</span>
                        <span className="text-[var(--color-muted)]">
                          {order.orderedAt} 주문
                        </span>
                      </div>
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* CTA */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onBackToList}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] px-6 py-3 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
        >
          <ArrowLeft size={16} />
          주문/배송 목록
        </button>
        <button
          onClick={onNext}
          disabled={!hasSelection}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          aria-disabled={!hasSelection}
        >
          다음 단계
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ── Step 2: 사유 선택 ──

interface Step2Props {
  reasonId: string | null;
  reasonDetailText: string;
  onSelectReason: (id: string) => void;
  onDetailChange: (text: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

function Step2ReasonSelect({
  reasonId,
  reasonDetailText,
  onSelectReason,
  onDetailChange,
  onPrev,
  onNext,
}: Step2Props) {
  const selectedOption = REASON_OPTIONS.find((r) => r.id === reasonId);
  const needsDetail = selectedOption?.detailPlaceholder != null;
  const canProceed =
    reasonId !== null && (!needsDetail || reasonDetailText.trim().length > 0);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <h3 className="font-bold text-[var(--color-dark)]">어떤 문제가 있나요?</h3>
        <fieldset className="mt-4 space-y-2" aria-label="사유 선택">
          <legend className="sr-only">사유를 선택해 주세요</legend>
          {REASON_OPTIONS.map((reason) => {
            const isChecked = reasonId === reason.id;
            const showDetail = isChecked && reason.detailPlaceholder != null;
            return (
              <div key={reason.id}>
                <RadioOption
                  id={`reason-${reason.id}`}
                  name="return-reason"
                  value={reason.id}
                  checked={isChecked}
                  onChange={onSelectReason}
                  label={reason.label}
                />
                {showDetail && (
                  <div className="ml-8 mt-2">
                    <div className="relative">
                      <textarea
                        id={`reason-detail-${reason.id}`}
                        value={reasonDetailText}
                        onChange={(e) => onDetailChange(e.target.value.slice(0, REASON_DETAIL_MAX))}
                        placeholder={`${reason.detailPlaceholder} * (필수)`}
                        maxLength={REASON_DETAIL_MAX}
                        rows={4}
                        className="w-full resize-y rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm text-[var(--color-body)] outline-none placeholder:text-gray-400 focus:border-[var(--color-primary)]"
                      />
                      <span className="absolute right-3 bottom-2.5 text-xs text-[var(--color-muted)]">
                        {reasonDetailText.length} / {REASON_DETAIL_MAX}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </fieldset>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onPrev}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] px-6 py-3 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
        >
          <ArrowLeft size={16} />
          이전 단계
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          aria-disabled={!canProceed}
        >
          다음 단계
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ── Step 3: 해결방법 선택 ──

interface Step3Props {
  selectedOrders: BookOrder[];
  reasonId: string | null;
  resolution: ReturnResolution | null;
  pickupAddress: string;
  pickupAddressDetail: string;
  showDetailAddress: boolean;
  pickupLocation: PickupLocation | null;
  pickupEtcText: string;
  entranceType: EntranceType | null;
  entranceCode: string;
  pickupDateOption: PickupDateOption;
  pickupDate: string;
  deliveryCompletedDate: string;
  onSelectResolution: (v: ReturnResolution) => void;
  onChangeAddress: (address: string) => void;
  onAddressDetailChange: (v: string) => void;
  onSelectPickup: (v: PickupLocation) => void;
  onPickupEtcChange: (v: string) => void;
  onSelectEntrance: (v: EntranceType) => void;
  onEntranceCodeChange: (v: string) => void;
  onSelectDateOption: (v: PickupDateOption) => void;
  onSelectDate: (date: string) => void;
  onPrev: () => void;
  onSubmit: () => void;
}

const RESOLUTION_OPTIONS: { value: ReturnResolution; label: string; description: string }[] = [
  {
    value: "교환",
    label: "교환",
    description: "동일 상품으로 새 제품을 받습니다.",
  },
  {
    value: "반품후환불",
    label: "반품 후 환불",
    description: "상품을 반송하고 결제 금액을 환불받습니다.",
  },
];

// ── Kakao Postcode helper ──

function openKakaoPostcode(onComplete: (address: string) => void) {
  const scriptId = "kakao-postcode-script";
  const run = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (window as any).daum.Postcode({
      oncomplete(data: { address: string; zonecode: string }) {
        onComplete(`(${data.zonecode}) ${data.address}`);
        setTimeout(() => document.getElementById("pickup-address-detail")?.focus(), 100);
      },
    }).open();
  };
  if (document.getElementById(scriptId)) {
    run();
    return;
  }
  const script = document.createElement("script");
  script.id = scriptId;
  script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  script.onload = run;
  document.head.appendChild(script);
}

// ── Calendar Modal ──

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function toDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function formatKorDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const wds = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일(${wds[d.getDay()]})`;
}

interface CalendarModalProps {
  isOpen: boolean;
  value: string;
  minDate: string;
  maxDate: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}

function CalendarModal({ isOpen, value, minDate, maxDate, onSelect, onClose }: CalendarModalProps) {
  const parsed = value ? value.split("-").map(Number) : [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()];
  const [viewYear, setViewYear] = useState(parsed[0]);
  const [viewMonth, setViewMonth] = useState(parsed[1]);
  const [tempDate, setTempDate] = useState<string | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setTempDate(null);
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth - 1, 1).getDay();
  const prevMonthDays = new Date(viewYear, viewMonth - 1, 0).getDate();

  const cells: { day: number; offset: number }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevMonthDays - i, offset: -1 });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, offset: 0 });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, offset: 1 });

  const handlePrev = () => {
    if (viewMonth === 1) { setViewMonth(12); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const handleNext = () => {
    if (viewMonth === 12) { setViewMonth(1); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const handleConfirm = () => {
    if (tempDate) { onSelect(tempDate); }
    onClose();
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div className="w-[320px] rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[var(--color-dark)]">회수 예정일 선택</h3>
          <button onClick={onClose} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-light-bg)]">
            <X size={18} />
          </button>
        </div>
        {/* Month nav */}
        <div className="mt-3 flex items-center justify-between">
          <button type="button" onClick={handlePrev} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-light-bg)]">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-bold text-[var(--color-dark)]">{viewYear}년 {viewMonth}월</span>
          <button type="button" onClick={handleNext} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-light-bg)]">
            <ChevronRight size={18} />
          </button>
        </div>
        {/* Weekday headers */}
        <div className="mt-2 grid grid-cols-7 text-center text-xs font-medium text-[var(--color-muted)]">
          {WEEKDAYS.map((wd) => <div key={wd} className="py-1.5">{wd}</div>)}
        </div>
        {/* Day grid */}
        <div className="grid grid-cols-7 text-center text-sm">
          {cells.map((cell, i) => {
            const isCurrentMonth = cell.offset === 0;
            let cy = viewYear, cm = viewMonth + cell.offset;
            if (cm < 1) { cm = 12; cy--; } if (cm > 12) { cm = 1; cy++; }
            const dateStr = toDateStr(cy, cm, cell.day);
            const inRange = dateStr >= minDate && dateStr <= maxDate;
            const isSelected = dateStr === tempDate;
            const selectable = isCurrentMonth && inRange;

            return (
              <button
                key={i}
                type="button"
                disabled={!selectable}
                onClick={() => { if (selectable) setTempDate(dateStr); }}
                className={`flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors ${
                  isSelected
                    ? "bg-[var(--color-primary)] font-bold text-white"
                    : selectable
                      ? "cursor-pointer text-[var(--color-dark)] hover:bg-[var(--color-primary-light)]"
                      : isCurrentMonth
                        ? "text-gray-300"
                        : "text-gray-200"
                }`}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
        {/* Legend */}
        <p className="mt-3 text-center text-xs text-[var(--color-muted)]">
          배송완료일로부터 30일 이내 선택 가능
        </p>
        {/* Action buttons */}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-lg border border-[var(--color-border)] py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!tempDate}
            className="flex-1 cursor-pointer rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            선택완료
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Step3 Component ──

function Step3Resolution({
  selectedOrders,
  reasonId,
  resolution,
  pickupAddress,
  pickupAddressDetail,
  showDetailAddress,
  pickupLocation,
  pickupEtcText,
  entranceType,
  entranceCode,
  pickupDateOption,
  pickupDate,
  deliveryCompletedDate,
  onSelectResolution,
  onChangeAddress,
  onAddressDetailChange,
  onSelectPickup,
  onPickupEtcChange,
  onSelectEntrance,
  onEntranceCodeChange,
  onSelectDateOption,
  onSelectDate,
  onPrev,
  onSubmit,
}: Step3Props) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const reasonLabel = REASON_OPTIONS.find((r) => r.id === reasonId)?.label ?? "";

  // Derive missing required fields for the pre-submit summary.
  // entranceType is required: user must explicitly choose "code" or "nocode".
  const missingFields: string[] = [];
  if (resolution === null) missingFields.push("해결방법");
  if (showDetailAddress && pickupAddressDetail.trim().length === 0) missingFields.push("상세주소");
  if (pickupLocation === null || (pickupLocation === "기타" && pickupEtcText.trim().length === 0))
    missingFields.push("회수 요청 장소");
  if (entranceType === null || (entranceType === "code" && entranceCode.trim().length === 0))
    missingFields.push("공동현관 출입번호");

  const canSubmit = missingFields.length === 0 && pickupDate !== "";

  // Compute date range for calendar (delivery date + 30 days)
  const minDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return toDateStr(d.getFullYear(), d.getMonth() + 1, d.getDate());
  })();
  const maxDate = (() => {
    const d = new Date(deliveryCompletedDate + "T00:00:00");
    d.setDate(d.getDate() + 30);
    return toDateStr(d.getFullYear(), d.getMonth() + 1, d.getDate());
  })();

  const handleOpenPostcode = () => {
    openKakaoPostcode((address) => onChangeAddress(address));
  };

  return (
    <div className="space-y-4">
      {/* Summary card */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <h3 className="font-bold text-[var(--color-dark)]">신청 내역 요약</h3>
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
              선택 상품 ({selectedOrders.length}개)
            </p>
            <ul className="mt-2 space-y-2">
              {selectedOrders.map((order) => (
                <li key={order.id} className="flex items-center gap-3">
                  <div className="flex h-10 w-8 shrink-0 items-center justify-center rounded border border-[var(--color-border)] bg-[var(--color-light-bg)]">
                    <BookOpen size={14} className="text-[var(--color-muted)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-[var(--color-dark)]">{order.bookTitle}</p>
                    <p className="text-xs text-[var(--color-muted)]">수량 {order.quantity}권 · {order.price.toLocaleString()}원</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <hr className="border-[var(--color-border)]" />
          <div className="text-sm">
            <span className="text-[var(--color-muted)]">신청 사유</span>
            <span className="text-[var(--color-muted)]">:&nbsp;{reasonLabel}</span>
          </div>
        </div>
      </div>

      {/* Resolution selection */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <h3 className="font-bold text-[var(--color-dark)]">
          해결방법 선택
          <span className="ml-1.5 text-xs font-normal text-[var(--color-muted)]">(필수)</span>
        </h3>
        <fieldset className="mt-4 space-y-2" aria-label="해결방법">
          <legend className="sr-only">원하시는 해결방법을 선택해 주세요</legend>
          {RESOLUTION_OPTIONS.map((opt) => (
            <RadioOption
              key={opt.value}
              id={`resolution-${opt.value}`}
              name="resolution"
              value={opt.value}
              checked={resolution === opt.value}
              onChange={(v) => onSelectResolution(v as ReturnResolution)}
              label={opt.label}
              description={opt.description}
            />
          ))}
        </fieldset>
        {resolution === "반품후환불" && (
          <div className="mt-3 text-xs leading-relaxed text-[var(--color-muted)]">
            <p>반품 상품은 <strong>미사용</strong> 상태여야 합니다. 회수한 상품을 검수한 후 문제가 발견되면 고객님께 연락을 드립니다.</p>
            <p className="mt-1">단순 변심에 의한 반품인 경우 왕복 배송비 5,000원은 고객 부담입니다.</p>
          </div>
        )}
      </div>

      {/* Pickup address info */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-[var(--color-dark)]">상품 회수지 정보</h3>
          <button
            type="button"
            onClick={handleOpenPostcode}
            className="cursor-pointer text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            변경하기
          </button>
        </div>
        <dl className="mt-4 space-y-3">
          <div className="flex items-start gap-3">
            <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--color-muted)]" />
            <div className="flex-1">
              <dt className="text-xs text-[var(--color-muted)]">회수지 주소</dt>
              <dd className="mt-0.5 text-sm text-[var(--color-dark)]">{pickupAddress}</dd>
              {showDetailAddress && (
                <dd className="mt-2">
                  <div className="relative">
                    <input
                      id="pickup-address-detail"
                      type="text"
                      value={pickupAddressDetail}
                      onChange={(e) => onAddressDetailChange(e.target.value)}
                      placeholder="상세주소를 입력해 주세요 (동/호수 등)"
                      maxLength={100}
                      className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm text-[var(--color-body)] outline-none placeholder:text-gray-400 focus:border-[var(--color-primary)]"
                    />
                    {pickupAddressDetail.length > 0 && (
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-muted)]">
                        {pickupAddressDetail.length}/100
                      </span>
                    )}
                  </div>
                </dd>
              )}
            </div>
          </div>
        </dl>
      </div>

      {/* Pickup date */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <h3 className="font-bold text-[var(--color-dark)]">회수 예정일</h3>
        <fieldset className="mt-4 space-y-2" aria-label="회수 예정일">
          <legend className="sr-only">회수 예정일을 선택해 주세요</legend>
          <RadioOption
            id="date-tomorrow"
            name="pickup-date-option"
            value="tomorrow"
            checked={pickupDateOption === "tomorrow"}
            onChange={() => onSelectDateOption("tomorrow")}
            label="내일"
          />
          {pickupDateOption === "tomorrow" && (
            <p className="text-xs leading-relaxed text-[var(--color-muted)]">
              신청 후 상품을 내일 오전 9시 이전에 회수지에 놓아주세요.
            </p>
          )}
          <div className="flex items-center gap-2">
            <div onClick={() => setCalendarOpen(true)}>
              <RadioOption
                id="date-custom"
                name="pickup-date-option"
                value="custom"
                checked={pickupDateOption === "custom"}
                onChange={() => setCalendarOpen(true)}
                label={pickupDateOption === "custom" ? formatKorDate(pickupDate) : "다른 날짜 선택"}
              />
            </div>
            {pickupDateOption === "custom" && (
              <button
                type="button"
                onClick={() => setCalendarOpen(true)}
                className="shrink-0 cursor-pointer text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                날짜 변경하기 &gt;
              </button>
            )}
          </div>
        </fieldset>
      </div>

      {/* Calendar modal */}
      <CalendarModal
        isOpen={calendarOpen}
        value={pickupDate}
        minDate={minDate}
        maxDate={maxDate}
        onSelect={onSelectDate}
        onClose={() => setCalendarOpen(false)}
      />

      {/* Pickup location */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <h3 className="font-bold text-[var(--color-dark)]">
          회수 요청 장소
          <span className="ml-1.5 text-xs font-normal text-[var(--color-muted)]">(필수)</span>
        </h3>
        <fieldset className="mt-4 space-y-2" aria-label="회수 요청 장소">
          <legend className="sr-only">회수 요청 장소를 선택해 주세요</legend>
          <RadioOption id="pickup-door" name="pickup-location" value="문앞" checked={pickupLocation === "문앞"} onChange={() => onSelectPickup("문앞")} label="문 앞" />
          <RadioOption id="pickup-guard" name="pickup-location" value="경비실" checked={pickupLocation === "경비실"} onChange={() => onSelectPickup("경비실")} label="경비실" />
          <RadioOption id="pickup-etc" name="pickup-location" value="기타" checked={pickupLocation === "기타"} onChange={() => onSelectPickup("기타")} label="기타" />
        </fieldset>

        {pickupLocation === "기타" && (
          <div className="ml-8 mt-2">
            <input
              id="pickup-etc-text"
              type="text"
              value={pickupEtcText}
              onChange={(e) => onPickupEtcChange(e.target.value)}
              placeholder="회수 장소를 직접 입력해 주세요"
              maxLength={100}
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm text-[var(--color-body)] outline-none placeholder:text-gray-400 focus:border-[var(--color-primary)]"
            />
          </div>
        )}

        {/* 공동현관 출입번호 */}
        <div className="mt-5 border-t border-[var(--color-border)] pt-5">
          <h4 className="font-bold text-[var(--color-dark)]">
            공동현관 출입번호
            <span className="ml-1.5 text-xs font-normal text-[var(--color-muted)]">(필수)</span>
          </h4>
          <fieldset className="mt-3 space-y-2" aria-label="공동현관 출입번호">
            <legend className="sr-only">공동현관 출입번호를 선택해 주세요</legend>
            <div>
              <RadioOption
                id="entrance-code"
                name="entrance-type"
                value="code"
                checked={entranceType === "code"}
                onChange={() => onSelectEntrance("code")}
                label="출입번호 입력"
              />
              {entranceType === "code" && (
                <div className="ml-8 mt-2">
                  <input
                    id="entrance-code-input"
                    type="text"
                    value={entranceCode}
                    onChange={(e) => onEntranceCodeChange(e.target.value)}
                    placeholder="예 : #1234"
                    maxLength={20}
                    className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm text-[var(--color-body)] outline-none placeholder:text-gray-400 focus:border-[var(--color-primary)]"
                  />
                </div>
              )}
            </div>
            <RadioOption
              id="entrance-nocode"
              name="entrance-type"
              value="nocode"
              checked={entranceType === "nocode"}
              onChange={() => onSelectEntrance("nocode")}
              label="비밀번호없이 출입 가능해요"
            />
          </fieldset>
        </div>
      </div>

      {/* Pre-submit missing-fields summary — visible only while canSubmit is false */}
      {!canSubmit && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertCircle
            size={16}
            className="mt-0.5 shrink-0 text-amber-500"
            aria-hidden="true"
          />
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <span className="text-sm text-amber-700">신청 전 확인해 주세요</span>
            {missingFields.map((field) => (
              <span
                key={field}
                className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800"
              >
                {field}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onPrev}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] px-6 py-3 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
        >
          <ArrowLeft size={16} />
          이전 단계
        </button>
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          aria-disabled={!canSubmit}
        >
          신청하기
          <CheckCircle2 size={16} />
        </button>
      </div>
    </div>
  );
}

// ── Confirmation view ──

interface ConfirmationViewProps {
  state: WizardFormState;
  selectedOrders: BookOrder[];
  onBackToList: () => void;
}

function ConfirmationView({
  state,
  selectedOrders,
  onBackToList,
}: ConfirmationViewProps) {
  const reasonLabel = REASON_OPTIONS.find((r) => r.id === state.reasonId)?.label ?? "";
  const pickupText =
    state.pickupLocation === "기타"
      ? state.pickupEtcText
      : state.pickupLocation === "문앞" ? "문 앞" : state.pickupLocation ?? "";

  return (
    <div className="space-y-4">
      {/* Success banner */}
      <div className="rounded-2xl border border-green-200 bg-green-50 px-6 py-10 text-center">
        <CheckCircle2
          size={48}
          className="mx-auto text-green-500"
          aria-hidden="true"
        />
        <h2 className="mt-4 text-xl font-bold text-[var(--color-dark)]">
          교환/반품 신청이 완료되었습니다
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          영업일 기준 1~3일 내에 수거가 진행됩니다.
        </p>
      </div>

      {/* Request summary */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <h3 className="font-bold text-[var(--color-dark)]">신청 내용</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-[var(--color-muted)]">신청 상품</dt>
            <dd className="text-right font-medium text-[var(--color-dark)]">
              {selectedOrders.length}개 상품
            </dd>
          </div>
          <div>
            <dt className="inline text-[var(--color-muted)]">신청 사유</dt>
            <dd className="inline text-[var(--color-dark)]">:&nbsp;{reasonLabel}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--color-muted)]">해결 방법</dt>
            <dd className="text-right font-medium text-[var(--color-primary)]">
              {state.resolution === "반품후환불" ? "반품 후 환불" : state.resolution}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--color-muted)]">회수 장소</dt>
            <dd className="text-right text-[var(--color-dark)]">{pickupText}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--color-muted)]">회수 예정일</dt>
            <dd className="text-right text-[var(--color-dark)]">{formatKorDate(state.pickupDate)}</dd>
          </div>
        </dl>
      </div>

      <div className="flex justify-center py-4">
        <button
          onClick={onBackToList}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
        >
          <ArrowLeft size={16} />
          주문/배송 목록
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Root wizard component
// ─────────────────────────────────────────────

export default function ExchangeReturnWizard({
  initialOrderId,
  eligibleOrders,
  onBack,
  onSubmit,
}: ExchangeReturnWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitted, setSubmitted] = useState(false);
  const [showDetailAddress, setShowDetailAddress] = useState(false);

  const DEFAULT_ADDRESS = "서울특별시 강남구 테헤란로 123 비즈타워 4층";
  const tomorrowStr = (() => {
    const d = new Date(); d.setDate(d.getDate() + 1);
    return toDateStr(d.getFullYear(), d.getMonth() + 1, d.getDate());
  })();

  // Find the earliest orderedAt among selected orders for 30-day window
  const deliveryCompletedDate = eligibleOrders.find((o) => o.id === initialOrderId)?.orderedAt ?? tomorrowStr;

  const [formState, setFormState] = useState<WizardFormState>(() => ({
    selectedOrderIds: initialOrderId ? [initialOrderId] : [],
    reasonId: null,
    reasonDetailText: "",
    resolution: null,
    pickupAddress: DEFAULT_ADDRESS,
    pickupAddressDetail: "",
    pickupLocation: null,
    pickupEtcText: "",
    entranceType: null,
    entranceCode: "",
    pickupDateOption: "tomorrow" as PickupDateOption,
    pickupDate: tomorrowStr,
  }));

  // ── Step 1 handlers ──
  const handleToggleOrder = useCallback((id: string) => {
    setFormState((prev) => ({
      ...prev,
      selectedOrderIds: prev.selectedOrderIds.includes(id)
        ? prev.selectedOrderIds.filter((x) => x !== id)
        : [...prev.selectedOrderIds, id],
    }));
  }, []);

  const handleStep1Next = useCallback(() => {
    if (formState.selectedOrderIds.length > 0) setStep(2);
  }, [formState.selectedOrderIds]);

  // ── Step 2 handlers ──
  const handleSelectReason = useCallback((id: string) => {
    setFormState((prev) => ({
      ...prev,
      reasonId: id,
      reasonDetailText: prev.reasonId === id ? prev.reasonDetailText : "",
    }));
  }, []);

  const handleReasonDetailChange = useCallback((text: string) => {
    setFormState((prev) => ({ ...prev, reasonDetailText: text }));
  }, []);

  const handleStep2Next = useCallback(() => {
    if (!formState.reasonId) return;
    const option = REASON_OPTIONS.find((r) => r.id === formState.reasonId);
    const needsDetail = option?.detailPlaceholder != null;
    if (needsDetail && !formState.reasonDetailText.trim()) return;
    // Default resolution for 단순 변심 reasons
    const simpleReasons = ["r01", "r02"];
    if (simpleReasons.includes(formState.reasonId) && formState.resolution === null) {
      setFormState((prev) => ({ ...prev, resolution: "반품후환불" }));
    }
    setStep(3);
  }, [formState.reasonId, formState.reasonDetailText, formState.resolution]);

  // ── Step 3 handlers ──
  const handleSelectResolution = useCallback((v: ReturnResolution) => {
    setFormState((prev) => ({ ...prev, resolution: v }));
  }, []);

  const handleChangeAddress = useCallback((address: string) => {
    setFormState((prev) => ({ ...prev, pickupAddress: address, pickupAddressDetail: "" }));
    setShowDetailAddress(true);
  }, []);

  const handleAddressDetailChange = useCallback((v: string) => {
    setFormState((prev) => ({ ...prev, pickupAddressDetail: v }));
  }, []);

  const handleSelectPickup = useCallback((v: PickupLocation) => {
    setFormState((prev) => ({
      ...prev,
      pickupLocation: v,
      pickupEtcText: v !== "기타" ? "" : prev.pickupEtcText,
    }));
  }, []);

  const handlePickupEtcChange = useCallback((v: string) => {
    setFormState((prev) => ({ ...prev, pickupEtcText: v }));
  }, []);

  const handleSelectEntrance = useCallback((v: EntranceType) => {
    setFormState((prev) => ({ ...prev, entranceType: v, entranceCode: v === "nocode" ? "" : prev.entranceCode }));
  }, []);

  const handleEntranceCodeChange = useCallback((v: string) => {
    setFormState((prev) => ({ ...prev, entranceCode: v }));
  }, []);

  const handleSelectDateOption = useCallback((v: PickupDateOption) => {
    setFormState((prev) => ({
      ...prev,
      pickupDateOption: v,
      pickupDate: v === "tomorrow" ? tomorrowStr : prev.pickupDate,
    }));
  }, [tomorrowStr]);

  const handleSelectDate = useCallback((date: string) => {
    setFormState((prev) => ({ ...prev, pickupDate: date, pickupDateOption: "custom" as PickupDateOption }));
  }, []);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    onSubmit(formState);
  }, [formState, onSubmit]);

  // Derived data
  const selectedOrders = eligibleOrders.filter((o) =>
    formState.selectedOrderIds.includes(o.id)
  );

  // ── Confirmation view ──
  if (submitted) {
    return (
      <ConfirmationView
        state={formState}
        selectedOrders={selectedOrders}
        onBackToList={onBack}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div>
        <h2 className="text-xl font-bold text-[var(--color-dark)]">
          교환/반품 신청
        </h2>
      </div>

      {/* Step indicator */}
      <StepIndicator currentStep={step} />

      {/* Step content */}
      {step === 1 && (
        <Step1ProductSelect
          eligibleOrders={eligibleOrders}
          selectedIds={formState.selectedOrderIds}
          onToggle={handleToggleOrder}
          onNext={handleStep1Next}
          onBackToList={onBack}
        />
      )}
      {step === 2 && (
        <Step2ReasonSelect
          reasonId={formState.reasonId}
          reasonDetailText={formState.reasonDetailText}
          onSelectReason={handleSelectReason}
          onDetailChange={handleReasonDetailChange}
          onPrev={() => setStep(1)}
          onNext={handleStep2Next}
        />
      )}
      {step === 3 && (
        <Step3Resolution
          selectedOrders={selectedOrders}
          reasonId={formState.reasonId}
          resolution={formState.resolution}
          pickupAddress={formState.pickupAddress}
          pickupAddressDetail={formState.pickupAddressDetail}
          showDetailAddress={showDetailAddress}
          pickupLocation={formState.pickupLocation}
          pickupEtcText={formState.pickupEtcText}
          entranceType={formState.entranceType}
          entranceCode={formState.entranceCode}
          pickupDateOption={formState.pickupDateOption}
          pickupDate={formState.pickupDate}
          deliveryCompletedDate={deliveryCompletedDate}
          onSelectResolution={handleSelectResolution}
          onChangeAddress={handleChangeAddress}
          onAddressDetailChange={handleAddressDetailChange}
          onSelectPickup={handleSelectPickup}
          onPickupEtcChange={handlePickupEtcChange}
          onSelectEntrance={handleSelectEntrance}
          onEntranceCodeChange={handleEntranceCodeChange}
          onSelectDateOption={handleSelectDateOption}
          onSelectDate={handleSelectDate}
          onPrev={() => setStep(2)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
