"use client";

import { useState } from "react";
import { ArrowLeft, FileText, GraduationCap, CreditCard, AlertCircle } from "lucide-react";
import type {
  CourseOrderDetailType,
  CourseClaimStatus,
} from "@/types";
import { CardReceiptModal, TransactionStatementModal } from "./BookOrderReceiptModals";
import type { ReceiptOrderData } from "./BookOrderReceiptModals";
import CourseRefundWizard from "./CourseRefundWizard";

// ── Status Badges ──

function ClaimBadge({ status }: { status: CourseClaimStatus }) {
  const map: Record<CourseClaimStatus, string> = {
    환불신청: "bg-orange-50 text-orange-600",
    환불완료: "bg-gray-100 text-gray-500",
    취소: "bg-red-50 text-red-500",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${map[status]}`}>
      {status}
    </span>
  );
}

// ── Info Row ──

function InfoRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: React.ReactNode;
  bold?: boolean;
}) {
  return (
    <div className="flex items-start justify-between py-2">
      <span className="text-sm text-[var(--color-muted)]">{label}</span>
      <span
        className={`text-sm ${bold ? "font-bold text-[var(--color-dark)]" : "text-[var(--color-body)]"}`}
      >
        {value}
      </span>
    </div>
  );
}

// ── Section Card ──

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
      <h3 className="mb-3 flex items-center gap-2 font-bold text-[var(--color-dark)]">
        {Icon && <Icon size={18} className="text-[var(--color-muted)]" />}
        {title}
      </h3>
      {children}
    </div>
  );
}

// ── Main Component ──

export default function CourseOrderDetail({
  order,
  onBack,
}: {
  order: CourseOrderDetailType;
  onBack: () => void;
}) {
  const [receiptModal, setReceiptModal] = useState<"card" | "transaction" | null>(null);
  const [showRefundWizard, setShowRefundWizard] = useState(false);

  const canRequestRefund =
    order.paymentStatus === "결제완료" &&
    !order.claimStatus &&
    (order.enrollStatus === "수강전" || order.enrollStatus === "수강중");

  if (showRefundWizard) {
    return (
      <CourseRefundWizard
        order={order}
        onBack={() => setShowRefundWizard(false)}
        onComplete={onBack}
      />
    );
  }

  const receiptData: ReceiptOrderData = {
    id: order.id,
    orderedAt: order.orderedAt,
    productName: order.courseTitle,
    quantity: 1,
    paymentMethod: order.paymentMethod,
    totalAmount: order.payment.totalAmount,
    productTotal: order.payment.courseFee,
    shippingFee: 0,
    discountAmount: order.payment.discountAmount,
    receipt: order.receipt,
  };

  return (
    <>
    <div className="space-y-4">
      {/* Order Header */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <h2 className="text-lg font-bold text-[var(--color-dark)]">
          주문 상세
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-body)]">
          <span>주문일: {order.orderedAt}</span>
          <span className="text-[var(--color-muted)]">|</span>
          <span>주문번호: {order.id}</span>
        </div>
      </div>

      {/* Course Info */}
      <SectionCard title="강의 정보" icon={GraduationCap}>
        <InfoRow label="강좌명" value={order.courseTitle} bold />
        <InfoRow
          label="강의유형"
          value={order.courseType === "온라인" ? "온라인" : "현장교육"}
        />
        {order.coursePeriodStart && order.coursePeriodEnd && (
          <InfoRow
            label="수강기간"
            value={`${order.coursePeriodStart} ~ ${order.coursePeriodEnd}`}
          />
        )}
      </SectionCard>

      {/* Payment Detail */}
      <SectionCard title="결제 정보" icon={CreditCard}>
        <InfoRow
          label="수강료"
          value={`${order.payment.courseFee.toLocaleString()}원`}
        />
        {order.payment.discountAmount > 0 && (
          <InfoRow
            label="할인금액"
            value={`-${order.payment.discountAmount.toLocaleString()}원`}
          />
        )}
        <div className="my-2 border-t border-dashed border-[var(--color-border)]" />
        <InfoRow
          label="결제금액"
          value={`${order.payment.totalAmount.toLocaleString()}원`}
          bold
        />
        <InfoRow label="결제수단" value={order.paymentMethodDetail || order.paymentMethod} />
        {order.payment.paidAt && (
          <InfoRow label="결제일" value={order.payment.paidAt} />
        )}
      </SectionCard>

      {/* Refund Info (conditional) */}
      {order.refund && order.claimStatus && (
        <SectionCard title="환불 정보">
          <InfoRow
            label="환불 상태"
            value={<ClaimBadge status={order.claimStatus} />}
          />
          <InfoRow label="신청일" value={order.refund.requestedAt} />
          <InfoRow label="환불사유" value={order.refund.reason} />
          <InfoRow
            label="환불금액"
            value={`${order.refund.refundAmount.toLocaleString()}원`}
            bold
          />
          {order.refund.completedAt && (
            <InfoRow label="완료일" value={order.refund.completedAt} />
          )}
        </SectionCard>
      )}

      {/* Cancel Info (conditional) */}
      {order.claimStatus === "취소" && order.cancelledAt && (
        <SectionCard title="취소 정보">
          <InfoRow
            label="취소 상태"
            value={<ClaimBadge status="취소" />}
          />
          <InfoRow label="취소일" value={order.cancelledAt} />
          {order.cancelReason && (
            <InfoRow label="취소사유" value={order.cancelReason} />
          )}
        </SectionCard>
      )}

      {/* Action Buttons (결제대기) */}
      {order.paymentStatus === "결제대기" && !order.claimStatus && (
        <div className="flex flex-wrap gap-3">
          <button className="flex cursor-pointer items-center gap-2 rounded-lg bg-[var(--color-primary)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90">
            결제하기
          </button>
          <button className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] px-6 py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]">
            주문취소
          </button>
        </div>
      )}

      {/* 결제영수증 정보 */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <h3 className="flex items-center gap-2 font-bold text-[var(--color-dark)]">
          <FileText size={18} className="text-[var(--color-muted)]" />
          결제영수증 정보
        </h3>
        <div className="mt-4 space-y-0 divide-y divide-[var(--color-border)]">
          <div className="flex items-center justify-between py-4 first:pt-0">
            <span className="text-sm text-[var(--color-body)]">
              해당 주문건에 대해 구매 카드영수증 확인이 가능합니다.
            </span>
            <button
              type="button"
              onClick={() => setReceiptModal("card")}
              className="shrink-0 ml-4 rounded-md border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-dark)] transition-colors hover:bg-gray-50"
            >
              카드영수증
            </button>
          </div>
          <div className="flex items-center justify-between py-4">
            <span className="text-sm text-[var(--color-body)]">
              해당 주문건에 대해 거래명세서 확인이 가능합니다.
            </span>
            <button
              type="button"
              onClick={() => setReceiptModal("transaction")}
              className="shrink-0 ml-4 rounded-md border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-dark)] transition-colors hover:bg-gray-50"
            >
              거래명세서
            </button>
          </div>
        </div>
      </div>

      {/* 환불 신청 카드 */}
      {canRequestRefund && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <h3 className="flex items-center gap-2 font-bold text-[var(--color-dark)]">
            <AlertCircle size={18} className="text-[var(--color-muted)]" />
            환불 신청
          </h3>
          <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-[var(--color-body)]">
            <li>온라인 강의 : 수강 시작 후 7일 이내, 수강률 25% 미만인 경우 환불을 신청하실 수 있습니다.</li>
            <li>현장 강의 : 교육 시작 3일 전까지 환불 신청을 하셔야 전액 환불 받으실 수 있습니다.</li>
            <li>환불 완료까지 영업일 기준 3~5일이 소요됩니다.</li>
            <li>환불 신청 후에는 수강이 즉시 중단됩니다.</li>
          </ul>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setShowRefundWizard(true)}
              className="shrink-0 rounded-md border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-dark)] transition-colors hover:bg-gray-50"
            >
              환불 신청
            </button>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="flex justify-center py-4">
        <button
          onClick={onBack}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
        >
          <ArrowLeft size={16} />
          주문 목록
        </button>
      </div>
    </div>

    {/* 모달 — space-y-4 밖에서 렌더링 */}
    {receiptModal === "card" && (
      <CardReceiptModal order={receiptData} onClose={() => setReceiptModal(null)} />
    )}
    {receiptModal === "transaction" && (
      <TransactionStatementModal order={receiptData} onClose={() => setReceiptModal(null)} />
    )}
    </>
  );
}
