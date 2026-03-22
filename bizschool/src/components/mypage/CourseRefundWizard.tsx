"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import type { CourseOrderDetailType } from "@/types";

// ── Types ──

type RefundReasonCategory = "단순변심" | "강의불만" | "결제문제";

interface RefundReasonOption {
  id: string;
  category: RefundReasonCategory;
  label: string;
}

const REASON_CATEGORIES: RefundReasonCategory[] = ["단순변심", "강의불만", "결제문제"];

const REFUND_REASONS: RefundReasonOption[] = [
  { id: "rf01", category: "단순변심", label: "단순 변심 (마음이 바뀜)" },
  { id: "rf02", category: "단순변심", label: "타 사이트/플랫폼에서 수강 예정" },
  { id: "rf03", category: "단순변심", label: "시간 여건이 되지 않음" },
  { id: "rf04", category: "강의불만", label: "강의 내용이 기대와 다름" },
  { id: "rf05", category: "강의불만", label: "강의 수준이 맞지 않음" },
  { id: "rf06", category: "강의불만", label: "강사 변경 또는 강의 품질 불만" },
  { id: "rf07", category: "결제문제", label: "중복 결제" },
  { id: "rf08", category: "결제문제", label: "잘못된 강좌 구매" },
  { id: "rf09", category: "결제문제", label: "할인 미적용" },
];

// ── Props ──

interface CourseRefundWizardProps {
  order: CourseOrderDetailType;
  onBack: () => void;
  onComplete: () => void;
}

// ── Step Indicator ──

function StepIndicator({ currentStep }: { currentStep: 1 | 2 }) {
  return (
    <div className="mb-6 flex items-center gap-0">
      {/* Step 1 */}
      <div className="flex items-center gap-2">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${
            currentStep >= 1 ? "bg-[var(--color-primary)]" : "bg-gray-300"
          }`}
        >
          {currentStep > 1 ? "✓" : "1"}
        </div>
        <span
          className={`text-sm font-medium ${
            currentStep >= 1 ? "text-[var(--color-dark)]" : "text-[var(--color-muted)]"
          }`}
        >
          사유 선택
        </span>
      </div>

      <div className="mx-3 h-px flex-1 bg-[var(--color-border)]" />

      {/* Step 2 */}
      <div className="flex items-center gap-2">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${
            currentStep >= 2 ? "bg-[var(--color-primary)]" : "bg-gray-300"
          }`}
        >
          2
        </div>
        <span
          className={`text-sm font-medium ${
            currentStep >= 2 ? "text-[var(--color-dark)]" : "text-[var(--color-muted)]"
          }`}
        >
          환불 확인
        </span>
      </div>
    </div>
  );
}

// ── Course Summary Card ──

function CourseSummaryCard({ order }: { order: CourseOrderDetailType }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-light-bg)] p-4">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-[var(--color-dark)]">{order.courseTitle}</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            결제금액: {order.payment.totalAmount.toLocaleString()}원
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--color-body)] border border-[var(--color-border)]">
          {order.courseType === "온라인" ? "온라인" : "현장교육"}
        </span>
      </div>
      {order.payment.paidAt && (
        <p className="mt-2 text-xs text-[var(--color-muted)]">
          {order.payment.paidAt} 결제
        </p>
      )}
    </div>
  );
}

// ── Main Component ──

export default function CourseRefundWizard({
  order,
  onBack,
  onComplete,
}: CourseRefundWizardProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCategory, setSelectedCategory] = useState<RefundReasonCategory>("단순변심");
  const [selectedReasonId, setSelectedReasonId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [completed, setCompleted] = useState(false);

  const filteredReasons = REFUND_REASONS.filter((r) => r.category === selectedCategory);
  const selectedReason = REFUND_REASONS.find((r) => r.id === selectedReasonId);

  const penaltyAmount = 0;
  const refundAmount = order.payment.totalAmount - penaltyAmount;

  const handleConfirm = () => {
    setShowConfirmModal(false);
    setCompleted(true);
  };

  /* ── Completion Screen ── */
  if (completed) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-dark)]">환불 신청</h2>

        <div className="mx-auto max-w-lg space-y-5">
          {/* Success Banner */}
          <div className="flex flex-col items-center rounded-2xl bg-green-50 px-6 py-8">
            <CheckCircle2 size={48} className="text-green-500" />
            <p className="mt-3 text-lg font-bold text-green-800">
              환불 신청이 완료되었습니다.
            </p>
            <p className="mt-1 text-sm text-green-700">
              영업일 기준 3~7일 이내 처리될 예정입니다.
            </p>
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">강좌명</span>
                <span className="font-medium text-[var(--color-dark)]">{order.courseTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">환불 예상금액</span>
                <span className="font-bold text-[var(--color-primary)]">
                  {refundAmount.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">환불 수단</span>
                <span className="text-[var(--color-body)]">
                  {order.paymentMethodDetail || order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">환불 예정일</span>
                <span className="text-[var(--color-body)]">영업일 기준 3~7일 이내</span>
              </div>
            </div>
          </div>

          {/* Green notice */}
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
            카드사로 결제취소요청이 전달되었습니다. 취소 기간은 카드 종류와 카드사의 정책에 따라 달라질 수 있습니다.
          </div>

          {/* Action buttons */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={onComplete}
              className="rounded-lg bg-[var(--color-primary)] px-8 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
            >
              주문 목록으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[var(--color-dark)]">환불 신청</h2>

      <div className="mx-auto max-w-lg space-y-5">
        <StepIndicator currentStep={step} />

        {/* Step 1: Reason Selection */}
        {step === 1 && (
          <div className="space-y-5">
            {/* Course Summary */}
            <CourseSummaryCard order={order} />

            {/* Policy Notice */}
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <p className="font-medium">환불 정책 안내</p>
              <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-xs">
                <li>수강 시작 후 7일 이내, 진도율 25% 미만인 경우 환불이 가능합니다.</li>
                <li>현장 강의는 교육 시작 3일 전까지 취소 시 전액 환불됩니다.</li>
              </ul>
            </div>

            {/* Category Pills */}
            <div>
              <p className="mb-3 text-sm font-bold text-[var(--color-dark)]">
                환불 사유를 선택해 주세요
              </p>
              <div className="flex gap-2">
                {REASON_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSelectedReasonId(null);
                    }}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-[var(--color-primary)] text-white"
                        : "border border-[var(--color-border)] bg-white text-[var(--color-body)] hover:bg-[var(--color-light-bg)]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason Radio List */}
            <div className="rounded-xl border border-[var(--color-border)] bg-white p-5">
              <div className="space-y-3">
                {filteredReasons.map((reason) => (
                  <label
                    key={reason.id}
                    className="flex cursor-pointer items-center gap-3 text-sm"
                  >
                    <input
                      type="radio"
                      name="refundReason"
                      checked={selectedReasonId === reason.id}
                      onChange={() => setSelectedReasonId(reason.id)}
                      className="h-4 w-4 accent-[var(--color-primary)]"
                    />
                    <span className="text-[var(--color-body)]">{reason.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onBack}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] py-3 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
              >
                <ArrowLeft size={16} />
                주문 상세
              </button>
              <button
                type="button"
                disabled={!selectedReasonId}
                onClick={() => setStep(2)}
                className={`flex-1 rounded-lg py-3 text-sm font-medium text-white transition-colors ${
                  selectedReasonId
                    ? "bg-[var(--color-primary)]"
                    : "cursor-not-allowed bg-gray-300"
                }`}
              >
                다음 단계 &gt;
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Refund Confirmation */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Course Summary */}
            <CourseSummaryCard order={order} />

            {/* Refund Amount Breakdown */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
              <h3 className="mb-4 text-sm font-bold text-[var(--color-dark)]">환불 내역</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">수강료</span>
                  <span className="text-[var(--color-body)]">
                    {order.payment.courseFee.toLocaleString()}원
                  </span>
                </div>
                {order.payment.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[var(--color-muted)]">할인금액</span>
                    <span className="text-red-500">
                      -{order.payment.discountAmount.toLocaleString()}원
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">위약금</span>
                  <span className="text-[var(--color-body)]">0원</span>
                </div>
                <p className="text-xs text-[var(--color-muted)]">
                  (수강 진도율에 따라 변동될 수 있습니다)
                </p>
                <div className="border-t border-dashed border-[var(--color-border)] pt-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-[var(--color-dark)]">환불 예상금액</span>
                    <span className="font-bold text-[var(--color-primary)]">
                      {refundAmount.toLocaleString()}원
                    </span>
                  </div>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-[var(--color-muted)]">환불 수단</span>
                  <span className="text-[var(--color-body)]">
                    {order.paymentMethodDetail || order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">환불 예정일</span>
                  <span className="text-[var(--color-body)]">영업일 기준 3~7일 이내</span>
                </div>
              </div>
            </div>

            {/* Selected Reason */}
            <div className="rounded-xl border border-[var(--color-border)] bg-white p-5">
              <h3 className="mb-2 text-sm font-bold text-[var(--color-dark)]">신청 사유</h3>
              <p className="text-sm text-[var(--color-body)]">
                {selectedReason?.label}
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-lg border border-[var(--color-border)] py-3 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
              >
                &lt; 이전 단계
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="flex-1 rounded-lg bg-[var(--color-primary)] py-3 text-sm font-medium text-white transition-colors hover:opacity-90"
              >
                환불 신청
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="mx-4 w-full max-w-xs rounded-2xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <p className="mb-2 text-center text-lg font-bold text-[var(--color-dark)]">
              환불 신청하시겠습니까?
            </p>
            <p className="mb-6 text-center text-sm text-[var(--color-muted)]">
              신청 후에는 취소가 불가능합니다.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 rounded-lg border border-[var(--color-border)] py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
              >
                환불 신청
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
