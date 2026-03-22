"use client";

import { useState } from "react";
import type { BookOrder, CancelReason, CancelResolution } from "@/types";

interface CancelWizardProps {
  orders: BookOrder[];
  initialOrderId?: string;
  onBack: () => void;
  onComplete: () => void;
}

const cancelReasons: { id: CancelReason; label: string }[] = [
  { id: "wrong-address", label: "배송지를 잘못 입력함" },
  { id: "not-satisfied", label: "상품이 마음에 들지 않음 (단순변심)" },
  { id: "reorder", label: "다른 상품 추가 후 재주문 예정" },
];

function reasonLabel(reason: CancelReason): string {
  return cancelReasons.find((r) => r.id === reason)?.label ?? "";
}

export default function CancelWizard({
  orders,
  initialOrderId,
  onBack,
  onComplete,
}: CancelWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialOrderId ? [initialOrderId] : []
  );
  const [cancelReason, setCancelReason] = useState<CancelReason | null>(null);
  const [resolution, setResolution] = useState<CancelResolution | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [addToCart, setAddToCart] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [rating, setRating] = useState(0);

  // Eligible orders: 상품준비중 or 결제완료 status (not yet shipped)
  const eligibleOrders = orders.filter(
    (o) => o.orderStatus === "상품준비" || o.orderStatus === "배송준비" || o.orderStatus === "배송중"
  );

  // Use all orders if no eligible filter (for demo)
  const selectableOrders = eligibleOrders.length > 0 ? eligibleOrders : orders;

  const selectedOrders = selectableOrders.filter((o) => selectedIds.includes(o.id));
  const totalAmount = selectedOrders.reduce((sum, o) => sum + o.price, 0);

  const toggleOrder = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const canGoNext = () => {
    if (step === 1) return selectedIds.length > 0;
    if (step === 2) return cancelReason !== null;
    if (step === 3) {
      if (cancelReason === "wrong-address") return resolution !== null;
      return true; // "cancel" is auto-selected
    }
    return false;
  };

  const handleNext = () => {
    if (step === 3) {
      if (cancelReason === "wrong-address" && resolution === "change-address") {
        // Just show alert for address change (demo)
        alert("배송지 변경 페이지로 이동합니다.");
        return;
      }
      setShowConfirmModal(true);
      return;
    }
    setStep((s) => s + 1);
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    setCompleted(true);
  };

  /* ── Completed View ── */
  if (completed) {
    return (
      <div>
        <h2 className="mb-6 text-xl font-bold text-[var(--color-dark)]">취소 신청</h2>

        <div className="mx-auto max-w-lg">
          <p className="mb-6 text-center text-lg font-medium text-[var(--color-dark)]">
            취소 신청이 완료되었습니다.
          </p>

          <div className="mb-4 rounded-lg border border-[var(--color-border)] bg-white p-5">
            <p className="mb-3 font-medium">취소 상품 {selectedOrders.length}건</p>
            {selectedOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-light-bg)]">
                  <img
                    src={order.bookCover}
                    alt={order.bookTitle}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{order.bookTitle}</p>
                  <p className="text-sm text-[var(--color-muted)]">
                    {order.quantity}개 {order.price.toLocaleString()} 원
                  </p>
                </div>
              </div>
            ))}

            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">환불 예정일</span>
                <span className="font-bold text-[var(--color-primary)]">
                  평일 3~7일 이내
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">환불 수단</span>
                <span>신용카드/체크카드</span>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-lg bg-green-50 p-3 text-sm text-green-800">
            카드사로 결제취소요청이 전달되었습니다. 취소 기간은 카드 종류와 카드사의 정책에 따라 달라질 수 있습니다.
          </div>

          <div className="mb-6 text-center">
            <p className="mb-2 font-medium">주문 취소 신청 과정이 만족스러웠나요?</p>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  &#9733;
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onComplete}
              className="flex-1 rounded-lg border border-[var(--color-border)] py-3 text-sm font-medium"
            >
              신청내역 확인하기
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex-1 rounded-lg bg-[var(--color-primary)] py-3 text-sm font-medium text-white"
            >
              쇼핑 계속하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-[var(--color-dark)]">취소 신청</h2>

      <div className="mx-auto max-w-lg">
        {/* Step 1: Product Selection */}
        {step === 1 && (
          <div>
            <h3 className="mb-4 text-base font-bold text-[var(--color-dark)]">
              상품을 선택해 주세요
            </h3>

            <div className="mb-6 space-y-3 rounded-lg border border-[var(--color-border)] bg-white p-5">
              {selectableOrders.map((order) => (
                <label
                  key={order.id}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(order.id)}
                    onChange={() => toggleOrder(order.id)}
                    className="h-5 w-5 rounded accent-[var(--color-primary)]"
                  />
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-light-bg)]">
                    <img
                      src={order.bookCover}
                      alt={order.bookTitle}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{order.bookTitle}</p>
                  </div>
                  <span className="shrink-0 text-sm text-[var(--color-muted)]">
                    {order.quantity}개
                  </span>
                </label>
              ))}
            </div>

            <button
              type="button"
              disabled={!canGoNext()}
              onClick={handleNext}
              className={`w-full rounded-lg py-3 text-sm font-medium text-white transition-colors ${
                canGoNext()
                  ? "bg-[var(--color-primary)]"
                  : "cursor-not-allowed bg-gray-300"
              }`}
            >
              다음 단계 &gt;
            </button>
          </div>
        )}

        {/* Step 2: Reason Selection */}
        {step === 2 && (
          <div>
            <h3 className="mb-4 text-base font-bold text-[var(--color-dark)]">
              취소 사유를 선택해주세요
            </h3>

            <div className="mb-6 space-y-3 rounded-lg border border-[var(--color-border)] bg-white p-5">
              {cancelReasons.map((reason) => (
                <label
                  key={reason.id}
                  className="flex cursor-pointer items-center gap-3 text-sm"
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    checked={cancelReason === reason.id}
                    onChange={() => {
                      setCancelReason(reason.id);
                      setResolution(null);
                    }}
                    className="h-4 w-4 accent-[var(--color-primary)]"
                  />
                  {reason.label}
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-lg border border-[var(--color-border)] py-3 text-sm font-medium"
              >
                &lt; 이전 단계
              </button>
              <button
                type="button"
                disabled={!canGoNext()}
                onClick={handleNext}
                className={`flex-1 rounded-lg py-3 text-sm font-medium text-white transition-colors ${
                  canGoNext()
                    ? "bg-[var(--color-primary)]"
                    : "cursor-not-allowed bg-gray-300"
                }`}
              >
                다음 단계 &gt;
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Resolution Selection / Refund Info */}
        {step === 3 && (
          <div>
            {/* Selected Summary */}
            <div className="mb-6 rounded-lg border border-[var(--color-border)] bg-white p-5">
              <p className="mb-3 font-medium">선택한 상품 {selectedOrders.length}건</p>
              {selectedOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-light-bg)]">
                    <img
                      src={order.bookCover}
                      alt={order.bookTitle}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{order.bookTitle}</p>
                    <p className="text-sm text-[var(--color-muted)]">
                      {order.quantity}개 {order.price.toLocaleString()} 원
                    </p>
                  </div>
                </div>
              ))}
              <p className="mt-3 text-sm text-[var(--color-muted)]">
                선택한 사유: {cancelReason ? reasonLabel(cancelReason) : ""}
              </p>
            </div>

            {/* Resolution or Refund Info */}
            {cancelReason === "wrong-address" ? (
              <div>
                <h3 className="mb-4 text-base font-bold text-[var(--color-dark)]">
                  어떤 해결방법을 원하세요?
                </h3>
                <div className="mb-6 space-y-4 rounded-lg border border-[var(--color-border)] bg-white p-5">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="radio"
                      name="resolution"
                      checked={resolution === "change-address"}
                      onChange={() => setResolution("change-address")}
                      className="mt-0.5 h-4 w-4 accent-[var(--color-primary)]"
                    />
                    <div>
                      <p className="text-sm font-medium">배송지 변경하고 주문 유지</p>
                      <button
                        type="button"
                        className="mt-2 w-full rounded-lg border border-[var(--color-primary)] py-2 text-sm text-[var(--color-primary)]"
                      >
                        배송지 변경하기
                      </button>
                    </div>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="resolution"
                      checked={resolution === "cancel"}
                      onChange={() => setResolution("cancel")}
                      className="h-4 w-4 accent-[var(--color-primary)]"
                    />
                    <span className="text-sm font-medium">취소</span>
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="mb-4 text-base font-bold text-[var(--color-dark)]">
                  환불 정보를 확인해주세요
                </h3>
                <div className="mb-6 rounded-lg border border-[var(--color-border)] bg-white p-5">
                  <p className="mb-3 font-bold text-sm">환불안내</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--color-muted)]">상품금액</span>
                      <span>{totalAmount.toLocaleString()} 원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-muted)]">배송비</span>
                      <span>0 원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-muted)]">반품비</span>
                      <span>0 원</span>
                    </div>
                    <div className="flex justify-between border-t border-[var(--color-border)] pt-2">
                      <span className="font-bold">환불 예상금액</span>
                      <span className="font-bold text-red-500">
                        {totalAmount.toLocaleString()} 원
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-muted)]">환불 수단</span>
                      <span>
                        {selectedOrders[0]?.paymentMethod ?? "신용카드"} / 일시불
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <span>{totalAmount.toLocaleString()} 원</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 rounded-lg border border-[var(--color-border)] py-3 text-sm font-medium"
              >
                &lt; 이전 단계
              </button>
              <button
                type="button"
                disabled={cancelReason === "wrong-address" && !resolution}
                onClick={handleNext}
                className={`flex-1 rounded-lg py-3 text-sm font-medium text-white transition-colors ${
                  cancelReason === "wrong-address" && !resolution
                    ? "cursor-not-allowed bg-gray-300"
                    : "bg-[var(--color-primary)]"
                }`}
              >
                신청하기
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
            className="mx-4 w-full max-w-xs rounded-lg bg-white p-6"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <p className="mb-4 text-center font-medium text-[var(--color-dark)]">
              취소 신청하시겠습니까?
            </p>
            <label className="mb-6 flex cursor-pointer items-center justify-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={addToCart}
                onChange={(e) => setAddToCart(e.target.checked)}
                className="h-4 w-4 accent-[var(--color-primary)]"
              />
              장바구니 다시 담기
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 rounded-lg border border-[var(--color-border)] py-2.5 text-sm font-medium"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
