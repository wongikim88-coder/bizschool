"use client";

import { useState } from "react";
import { ArrowLeft, Package, Truck, Clock, CreditCard, FileText } from "lucide-react";
import type { BookOrderDetail as BookOrderDetailType } from "@/types";
import { CardReceiptModal, TransactionStatementModal, bookOrderToReceiptData } from "./BookOrderReceiptModals";

interface BookOrderDetailProps {
  order: BookOrderDetailType;
  onBack: () => void;
}

export default function BookOrderDetail({ order, onBack }: BookOrderDetailProps) {
  const [receiptModal, setReceiptModal] = useState<"card" | "transaction" | null>(null);
  return (
    <>
    <div className="space-y-4">
      {/* Header */}
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

      {/* 상품 정보 */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <h3 className="flex items-center gap-2 font-bold text-[var(--color-dark)]">
          <Package size={18} className="text-[var(--color-muted)]" />
          상품 정보
        </h3>
        <div className="mt-4 flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[var(--color-light-bg)]">
            <Package size={24} className="text-[var(--color-muted)]" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-[var(--color-dark)]">
              {order.bookTitle}
            </p>
            <p className="mt-0.5 text-sm text-[var(--color-muted)]">
              {order.bookAuthor}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="text-[var(--color-body)]">
                수량: {order.quantity}권
              </span>
              <span className="font-medium text-[var(--color-dark)]">
                {order.price.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 배송 정보 */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <h3 className="flex items-center gap-2 font-bold text-[var(--color-dark)]">
          <Truck size={18} className="text-[var(--color-muted)]" />
          배송 정보
        </h3>
        <dl className="mt-4 space-y-3">
          <div className="flex">
            <dt className="w-20 shrink-0 text-sm text-[var(--color-muted)]">수령인</dt>
            <dd className="text-sm text-[var(--color-body)]">{order.shipping.recipientName}</dd>
          </div>
          <div className="flex">
            <dt className="w-20 shrink-0 text-sm text-[var(--color-muted)]">연락처</dt>
            <dd className="text-sm text-[var(--color-body)]">{order.shipping.phone}</dd>
          </div>
          <div className="flex">
            <dt className="w-20 shrink-0 text-sm text-[var(--color-muted)]">주소</dt>
            <dd className="text-sm text-[var(--color-body)]">{order.shipping.address}</dd>
          </div>
          {order.shipping.memo && (
            <div className="flex">
              <dt className="w-20 shrink-0 text-sm text-[var(--color-muted)]">배송메모</dt>
              <dd className="text-sm text-[var(--color-body)]">{order.shipping.memo}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* 결제 정보 */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <h3 className="flex items-center gap-2 font-bold text-[var(--color-dark)]">
          <CreditCard size={18} className="text-[var(--color-muted)]" />
          결제 정보
        </h3>

        {/* Desktop: 4-column layout */}
        <div className="mt-4 hidden gap-0 md:grid md:grid-cols-4">
          {/* 주문금액 */}
          <div className="border-r border-[var(--color-border)] px-4 text-center">
            <p className="text-sm text-[var(--color-muted)]">주문금액</p>
            <p className="mt-2 text-xl font-bold text-[var(--color-dark)]">
              {order.payment.productTotal.toLocaleString()}원
            </p>
            {order.payment.shippingFee > 0 && (
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                배송비 +{order.payment.shippingFee.toLocaleString()}원
              </p>
            )}
            {order.payment.shippingFee === 0 && (
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                배송비 무료
              </p>
            )}
          </div>

          {/* 할인/포인트 */}
          <div className="border-r border-[var(--color-border)] px-4 text-center">
            <p className="text-sm text-[var(--color-muted)]">할인/포인트</p>
            <p className="mt-2 text-xl font-bold text-red-500">
              {order.payment.discountAmount > 0
                ? `-${order.payment.discountAmount.toLocaleString()}원`
                : "0원"}
            </p>
            {order.points.usedPoints > 0 && (
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                포인트 -{order.points.usedPoints.toLocaleString()}P
              </p>
            )}
          </div>

          {/* 결제금액 */}
          <div className="border-r border-[var(--color-border)] px-4 text-center">
            <p className="text-sm text-[var(--color-muted)]">결제금액</p>
            <p className="mt-2 text-xl font-bold text-[var(--color-primary)]">
              {order.payment.totalAmount.toLocaleString()}원
            </p>
          </div>

          {/* 결제수단 */}
          <div className="px-4 text-center">
            <p className="text-sm text-[var(--color-muted)]">결제수단</p>
            <p className="mt-2 text-sm font-medium text-[var(--color-body)]">
              {order.payment.paymentMethodDetail || order.payment.paymentMethod}
            </p>
          </div>
        </div>

        {/* Mobile: stacked layout */}
        <div className="mt-4 space-y-3 md:hidden">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-muted)]">상품금액</span>
            <span className="text-sm text-[var(--color-body)]">
              {order.payment.productTotal.toLocaleString()}원
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-muted)]">배송비</span>
            <span className="text-sm text-[var(--color-body)]">
              {order.payment.shippingFee > 0
                ? `+${order.payment.shippingFee.toLocaleString()}원`
                : "무료"}
            </span>
          </div>
          {order.payment.discountAmount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-muted)]">할인</span>
              <span className="text-sm text-red-500">
                -{order.payment.discountAmount.toLocaleString()}원
              </span>
            </div>
          )}
          {order.points.usedPoints > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-muted)]">포인트 사용</span>
              <span className="text-sm text-red-500">
                -{order.points.usedPoints.toLocaleString()}P
              </span>
            </div>
          )}
          <hr className="border-[var(--color-border)]" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[var(--color-dark)]">결제금액</span>
            <span className="text-base font-bold text-[var(--color-primary)]">
              {order.payment.totalAmount.toLocaleString()}원
            </span>
          </div>
          {order.payment.paymentMethodDetail && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-muted)]">결제수단</span>
              <span className="text-sm text-[var(--color-body)]">
                {order.payment.paymentMethodDetail}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 적립 정보 */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <h3 className="flex items-center gap-2 font-bold text-[var(--color-dark)]">
          <Clock size={18} className="text-[var(--color-muted)]" />
          적립 정보
        </h3>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-[var(--color-muted)]">적립 포인트</span>
          <span className="text-sm font-medium text-[var(--color-primary)]">
            +{order.points.earnedPoints.toLocaleString()}P
          </span>
        </div>
      </div>

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

      {/* Back Button */}
      <div className="flex justify-center py-4">
        <button
          onClick={onBack}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
        >
          <ArrowLeft size={16} />
          주문/배송 목록
        </button>
      </div>
    </div>

    {/* 모달 — space-y-4 밖에서 렌더링 */}
    {receiptModal === "card" && (
      <CardReceiptModal order={bookOrderToReceiptData(order)} onClose={() => setReceiptModal(null)} />
    )}
    {receiptModal === "transaction" && (
      <TransactionStatementModal order={bookOrderToReceiptData(order)} onClose={() => setReceiptModal(null)} />
    )}
  </>
  );
}
