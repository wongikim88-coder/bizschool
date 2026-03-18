"use client";

import { ArrowLeft, Truck, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { ShippingTrackingInfo } from "@/types";

interface BookOrderShippingTrackerProps {
  tracking: ShippingTrackingInfo;
  onBack: () => void;
}

function formatStatusDate(dateStr: string): string {
  const d = new Date(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekdays[d.getDay()];
  return `${month}/${day}(${weekday})`;
}

const faqItems = [
  "[상품누락] 상품을 구매했는데 일부만 배송되었어요.",
  "[환불] 반품 신청을 했는데, 언제 환불되나요?",
  "[배송완료미수령] 상품을 받지 못했는데 배송완료로 확인됩니다.",
  "[교환/반품] 상품을 교환/반품하고 싶어요.",
];

export default function BookOrderShippingTracker({
  tracking,
  onBack,
}: BookOrderShippingTrackerProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const statusLabel =
    tracking.currentStatus === "배송완료"
      ? `${tracking.completedDate ? formatStatusDate(tracking.completedDate) : ""} 도착 완료`
      : "배송중";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[var(--color-dark)]">배송 조회</h2>
      </div>

      {/* Status Banner */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-light-bg)] py-8 text-center">
        <p className="text-2xl font-bold text-[var(--color-dark)]">{statusLabel}</p>
        <p className="mt-2 text-sm text-[var(--color-body)]">{tracking.statusMessage}</p>
      </div>

      {/* Delivery Info */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Carrier Info */}
          <div className="flex items-start gap-4 md:flex-1">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-light-bg)]">
              <Truck size={24} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="font-bold text-[var(--color-dark)]">{tracking.carrier}</p>
              <p className="mt-1 text-sm text-[var(--color-body)]">
                송장번호 &nbsp;<span className="font-medium">{tracking.trackingNumber}</span>
              </p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                배송업무 중 연락을 받을 수 없습니다.
              </p>
            </div>
          </div>

          {/* Separator */}
          <div className="hidden border-l border-[var(--color-border)] md:block" />
          <hr className="border-[var(--color-border)] md:hidden" />

          {/* Recipient Info */}
          <div className="md:flex-1">
            <dl className="space-y-2 text-sm">
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 text-[var(--color-muted)]">받는사람</dt>
                <dd className="font-medium text-[var(--color-dark)]">{tracking.recipientName}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 text-[var(--color-muted)]">받는주소</dt>
                <dd className="text-[var(--color-dark)]">{tracking.recipientAddress}</dd>
              </div>
              {tracking.deliveryRequest && (
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 text-[var(--color-muted)]">배송요청사항</dt>
                  <dd className="text-[var(--color-dark)]">{tracking.deliveryRequest}</dd>
                </div>
              )}
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 text-[var(--color-muted)]">상품수령방법</dt>
                <dd className="font-medium text-[var(--color-primary)]">{tracking.deliveryMethod}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Tracking History */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-[var(--color-border)] bg-[var(--color-light-bg)] px-5 py-3 text-sm font-medium text-[var(--color-muted)] md:grid-cols-3">
          <span>시간</span>
          <span>현재위치</span>
          <span className="text-right md:text-left">배송상태</span>
        </div>

        {/* Table Body */}
        <div>
          {tracking.steps.map((step, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-4 text-sm md:grid-cols-3 ${
                idx > 0 ? "border-t border-[var(--color-border)]" : ""
              }`}
            >
              <span className="text-[var(--color-body)]">{step.datetime}</span>
              <span className="text-[var(--color-body)]">{step.location}</span>
              <span
                className={`text-right md:text-left ${
                  idx === 0 ? "font-medium text-[var(--color-primary)]" : "text-[var(--color-body)]"
                }`}
              >
                {step.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <h3 className="text-lg font-bold text-[var(--color-dark)]">
          배송에 대해 궁금한 점이 있으십니까?
        </h3>
        <div className="mt-4 divide-y divide-[var(--color-border)]">
          {faqItems.map((question, idx) => (
            <div key={idx}>
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="flex w-full cursor-pointer items-center justify-between py-4 text-left"
              >
                <span className="flex items-center gap-2 text-sm text-[var(--color-body)]">
                  <span className="font-bold text-[var(--color-primary)]">Q</span>
                  {question}
                </span>
                {openFaq === idx ? (
                  <ChevronUp size={18} className="shrink-0 text-[var(--color-primary)]" />
                ) : (
                  <ChevronDown size={18} className="shrink-0 text-[var(--color-primary)]" />
                )}
              </button>
              {openFaq === idx && (
                <div className="pb-4 pl-7 text-sm text-[var(--color-muted)]">
                  해당 문의는 1:1 문의를 통해 접수해 주시면 빠르게 처리해 드리겠습니다.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center py-4">
        <button
          onClick={onBack}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] px-6 py-3 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
        >
          <ArrowLeft size={16} />
          주문/배송 목록
        </button>
      </div>
    </div>
  );
}
