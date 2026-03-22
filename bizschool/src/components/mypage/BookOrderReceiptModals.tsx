"use client";

import { useState } from "react";
import { X, Printer } from "lucide-react";
import type { BookOrderDetail, BookOrderReceiptInfo } from "@/types";

/** 영수증 모달에 필요한 공통 데이터 */
export interface ReceiptOrderData {
  id: string;
  orderedAt: string;
  productName: string;
  quantity: number;
  paymentMethod: string;
  totalAmount: number;
  productTotal: number;
  shippingFee: number;
  discountAmount: number;
  receipt?: BookOrderReceiptInfo;
}

/** BookOrderDetail → ReceiptOrderData 변환 헬퍼 */
export function bookOrderToReceiptData(order: BookOrderDetail): ReceiptOrderData {
  return {
    id: order.id,
    orderedAt: order.orderedAt,
    productName: `${order.bookTitle}, ${order.quantity}권`,
    quantity: order.quantity,
    paymentMethod: order.payment.paymentMethod,
    totalAmount: order.payment.totalAmount,
    productTotal: order.payment.productTotal,
    shippingFee: order.payment.shippingFee,
    discountAmount: order.payment.discountAmount,
    receipt: order.receipt,
  };
}

/* ── 판매자(BIZSCHOOL) 고정 정보 ── */
const SELLER = {
  name: "(주)더존테크윌",
  representative: "김더존",
  businessNumber: "107-86-38835",
  address: "경기도 하남시 조정대로 45, 에프 725~730호 (풍산동, 미사센텀비즈)",
  businessType: "소매, 서비스",
  businessCategory: "교육서비스업, 도서판매업",
};

/* ── 공통 모달 래퍼 ── */
function ModalBackdrop({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </div>
  );
}

/* ================================================================
   카드영수증 모달
   ================================================================ */
interface CardReceiptModalProps {
  order: ReceiptOrderData;
  onClose: () => void;
}

export function CardReceiptModal({ order, onClose }: CardReceiptModalProps) {
  const receipt = order.receipt;
  const totalAmount = order.totalAmount;
  const taxableAmount = Math.round(totalAmount / 1.1);
  const vat = totalAmount - taxableAmount;

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* 닫기 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* 스크롤 영역 */}
        <div className="overflow-y-auto p-6">
          <h2 className="text-center text-xl font-bold text-[var(--color-dark)]">
            카드영수증
          </h2>

          {/* 결제정보 */}
          <section className="mt-6">
            <h3 className="border-b border-[var(--color-dark)] pb-2 font-bold text-[var(--color-dark)]">
              결제정보
            </h3>
            <dl className="mt-3 space-y-2.5">
              <Row label="카드종류" value={receipt?.cardType ?? order.paymentMethod} />
              <Row label="거래종류" value={receipt?.transactionType ?? "신용거래"} />
              <Row label="할부개월" value={receipt?.installment ?? "일시불"} />
              <Row label="카드번호" value={receipt?.cardNumber ?? "-"} />
              <Row label="거래일시" value={receipt?.transactionDatetime ?? order.orderedAt} />
              <Row label="승인번호" value={receipt?.approvalNumber ?? "-"} />
            </dl>
          </section>

          {/* 구매정보 */}
          <section className="mt-6">
            <h3 className="border-b border-[var(--color-dark)] pb-2 font-bold text-[var(--color-dark)]">
              구매정보
            </h3>
            <dl className="mt-3 space-y-2.5">
              <Row label="주문번호" value={order.id} />
              <Row label="상품명" value={order.productName} />
              <Row label="과세금액" value={`${taxableAmount.toLocaleString()}원`} bold />
              <Row label="비과세금액" value="0원" bold />
              <Row label="부가세" value={`${vat.toLocaleString()}원`} bold />
              <Row
                label="합계금액"
                value={`${totalAmount.toLocaleString()}원`}
                highlight
              />
            </dl>
          </section>

          {/* 이용상점정보 */}
          <section className="mt-6">
            <h3 className="border-b border-[var(--color-dark)] pb-2 font-bold text-[var(--color-dark)]">
              이용상점정보
            </h3>
            <dl className="mt-3 space-y-2.5">
              <Row label="판매자상호" value={SELLER.name} />
              <Row label="사업자등록번호" value={SELLER.businessNumber} />
              <div className="flex gap-[60px]">
                <dt className="shrink-0 text-sm text-[var(--color-muted)]">판매자주소</dt>
                <dd className="text-sm text-[var(--color-body)] break-keep">{SELLER.address}</dd>
              </div>
            </dl>
          </section>

          {/* 안내문구 */}
          <div className="mt-6 text-xs leading-relaxed text-[var(--color-muted)]">
            <p>
              위 신용카드 매출전표는 부가가치세법 제32조의 2 제3항에 의거하여
              발행되었으며, 동법시행령 제57조 제2항에 의거하여 세금계산서를
              교부하지 않습니다.
            </p>
          </div>
        </div>

        {/* 프린트 버튼 */}
        <div className="border-t border-[var(--color-border)] p-4">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] py-3 text-sm font-bold text-white transition-colors hover:opacity-90"
          >
            <Printer size={16} />
            출력
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

/* ================================================================
   거래명세서 모달
   ================================================================ */
interface TransactionStatementModalProps {
  order: ReceiptOrderData;
  onClose: () => void;
}

export function TransactionStatementModal({
  order,
  onClose,
}: TransactionStatementModalProps) {
  const dateParts = order.orderedAt.split("-");
  const totalAmount = order.totalAmount;
  const [buyerFields, setBuyerFields] = useState({
    businessNumber: "",
    companyName: "",
    representative: "",
    address: "",
    businessType: "",
    businessCategory: "",
  });

  const handleBuyerChange = (field: keyof typeof buyerFields, value: string) => {
    setBuyerFields((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* 닫기 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* 스크롤 영역 */}
        <div className="overflow-y-auto p-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between pr-8">
            <span className="text-lg font-bold text-[var(--color-primary)]">
              BIZSCHOOL
            </span>
            <span className="text-xs text-[var(--color-muted)]">
              (공급받는자 보관용)
            </span>
          </div>

          {/* 제목 */}
          <h2 className="mt-4 text-center text-xl font-bold tracking-[0.3em] text-[var(--color-dark)]">
            거 래 명 세 표
          </h2>

          {/* 발행인 / 공급받는자 — 10칼럼 대칭 구조 */}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse border border-gray-400 text-xs table-fixed">
              <colgroup>
                {/* 발행인 절반 */}
                <col style={{ width: "3%" }} />
                <col style={{ width: "9%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "6%" }} />
                <col style={{ width: "15%" }} />
                {/* 공급받는자 절반 */}
                <col style={{ width: "4%" }} />
                <col style={{ width: "9%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "6%" }} />
                <col style={{ width: "15%" }} />
              </colgroup>
              <tbody>
                {/* Row 1: 사업자등록번호 */}
                <tr>
                  <td rowSpan={4} className="border border-gray-400 bg-gray-50 p-1 text-center align-middle font-bold">
                    발<br />행<br />인
                  </td>
                  <td className="border border-gray-400 bg-gray-50 p-2 text-center font-medium">
                    사업자<br />등록번호
                  </td>
                  <td colSpan={3} className="border border-gray-400 p-2 text-center">
                    {SELLER.businessNumber}
                  </td>
                  <td rowSpan={4} className="border border-gray-400 bg-gray-50 p-1 text-center align-middle font-bold">
                    공<br />급<br />받<br />는<br />자
                  </td>
                  <td className="border border-gray-400 bg-gray-50 p-2 text-center font-medium">
                    사업자<br />등록번호
                  </td>
                  <td colSpan={3} className="border border-gray-400 p-0">
                    <input
                      type="text"
                      value={buyerFields.businessNumber}
                      onChange={(e) => handleBuyerChange("businessNumber", e.target.value)}
                      placeholder="입력 가능"
                      className="w-full bg-transparent p-2 text-center text-xs text-[var(--color-body)] placeholder:text-[var(--color-muted)] focus:bg-blue-50 focus:outline-none"
                    />
                  </td>
                </tr>
                {/* Row 2: 상호 + 성명 */}
                <tr>
                  <td className="border border-gray-400 bg-gray-50 p-2 text-center font-medium">
                    상호<br />(법인명)
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {SELLER.name}
                  </td>
                  <td className="border border-gray-400 bg-gray-50 p-2 text-center font-medium">성명</td>
                  <td className="border border-gray-400 p-2 text-center">
                    {SELLER.representative}
                  </td>
                  <td className="border border-gray-400 bg-gray-50 p-2 text-center font-medium">
                    상호<br />(법인명)
                  </td>
                  <td className="border border-gray-400 p-0">
                    <input
                      type="text"
                      value={buyerFields.companyName}
                      onChange={(e) => handleBuyerChange("companyName", e.target.value)}
                      placeholder="입력 가능"
                      className="w-full bg-transparent p-2 text-center text-xs text-[var(--color-body)] placeholder:text-[var(--color-muted)] focus:bg-blue-50 focus:outline-none"
                    />
                  </td>
                  <td className="border border-gray-400 bg-gray-50 p-2 text-center font-medium">성명</td>
                  <td className="border border-gray-400 p-0">
                    <input
                      type="text"
                      value={buyerFields.representative}
                      onChange={(e) => handleBuyerChange("representative", e.target.value)}
                      placeholder="입력 가능"
                      className="w-full bg-transparent p-2 text-center text-xs text-[var(--color-body)] placeholder:text-[var(--color-muted)] focus:bg-blue-50 focus:outline-none"
                    />
                  </td>
                </tr>
                {/* Row 3: 사업장주소 */}
                <tr>
                  <td className="border border-gray-400 bg-gray-50 p-2 text-center font-medium">
                    사업장<br />주소
                  </td>
                  <td colSpan={3} className="border border-gray-400 p-2 text-center">
                    {SELLER.address}
                  </td>
                  <td className="border border-gray-400 bg-gray-50 p-2 text-center font-medium">
                    사업장<br />주소
                  </td>
                  <td colSpan={3} className="border border-gray-400 p-0">
                    <input
                      type="text"
                      value={buyerFields.address}
                      onChange={(e) => handleBuyerChange("address", e.target.value)}
                      placeholder="입력 가능"
                      className="w-full bg-transparent p-2 text-center text-xs text-[var(--color-body)] placeholder:text-[var(--color-muted)] focus:bg-blue-50 focus:outline-none"
                    />
                  </td>
                </tr>
                {/* Row 4: 업태 + 종목 */}
                <tr>
                  <td className="border border-gray-400 bg-gray-50 p-2 text-center font-medium">업태</td>
                  <td className="border border-gray-400 p-2 text-center">
                    {SELLER.businessType}
                  </td>
                  <td className="border border-gray-400 bg-gray-50 p-2 text-center font-medium">종목</td>
                  <td className="border border-gray-400 p-2 text-center">
                    {SELLER.businessCategory}
                  </td>
                  <td className="border border-gray-400 bg-gray-50 p-2 text-center font-medium">업태</td>
                  <td className="border border-gray-400 p-0">
                    <input
                      type="text"
                      value={buyerFields.businessType}
                      onChange={(e) => handleBuyerChange("businessType", e.target.value)}
                      placeholder="입력 가능"
                      className="w-full bg-transparent p-2 text-center text-xs text-[var(--color-body)] placeholder:text-[var(--color-muted)] focus:bg-blue-50 focus:outline-none"
                    />
                  </td>
                  <td className="border border-gray-400 bg-gray-50 p-2 text-center font-medium">종목</td>
                  <td className="border border-gray-400 p-0">
                    <input
                      type="text"
                      value={buyerFields.businessCategory}
                      onChange={(e) => handleBuyerChange("businessCategory", e.target.value)}
                      placeholder="입력 가능"
                      className="w-full bg-transparent p-2 text-center text-xs text-[var(--color-body)] placeholder:text-[var(--color-muted)] focus:bg-blue-50 focus:outline-none"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 거래 내역 테이블 */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse border border-gray-400 text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-400 p-2" colSpan={3}>
                    거래일시
                  </th>
                  <th className="border border-gray-400 p-2">상품명</th>
                  <th className="border border-gray-400 p-2">수량</th>
                  <th className="border border-gray-400 p-2">
                    거래액<br />
                    <span className="font-normal">(VAT포함 원화)</span>
                  </th>
                  <th className="border border-gray-400 p-2">비고</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-400 p-2 text-center">
                    {dateParts[0]}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {dateParts[1]}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {dateParts[2]}
                  </td>
                  <td className="border border-gray-400 p-2">
                    {order.productName}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {order.quantity}
                  </td>
                  <td className="border border-gray-400 p-2 text-right">
                    {order.productTotal.toLocaleString()}
                  </td>
                  <td className="border border-gray-400 p-2" />
                </tr>
              </tbody>
            </table>
          </div>

          {/* 합계 테이블 */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse border border-gray-400 text-xs">
              <tbody>
                <tr>
                  <td className="border border-gray-400 bg-gray-50 p-2 text-center font-medium">
                    총 거래액 합계
                  </td>
                  <td className="border border-gray-400 p-2 text-right">
                    {order.productTotal.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 bg-gray-50 p-2 text-center font-medium">
                    배송비 합계
                  </td>
                  <td className="border border-gray-400 p-2 text-right">
                    {order.shippingFee.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 bg-gray-50 p-2 text-center font-medium">
                    할인금액
                  </td>
                  <td className="border border-gray-400 p-2 text-right">
                    {order.discountAmount.toLocaleString()}
                  </td>
                </tr>
                <tr className="font-bold">
                  <td className="border border-gray-400 bg-gray-50 p-2 text-center">
                    실제 총 결제 금액
                  </td>
                  <td className="border border-gray-400 p-2 text-right">
                    {totalAmount.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 안내문구 */}
          <div className="mt-4 space-y-1 text-xs text-[var(--color-muted)]">
            <p>
              * 거래명세표는 거래내역을 보여주며 세금계산서와 같은 법적 효력은
              없습니다.
            </p>
            <p>
              * 부가세 신고용 증빙은 현금영수증이나 신용카드전표를 활용하시기
              바랍니다.
            </p>
          </div>
        </div>

        {/* 출력 버튼 */}
        <div className="border-t border-[var(--color-border)] p-4">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] py-3 text-sm font-bold text-white transition-colors hover:opacity-90"
          >
            <Printer size={16} />
            출력
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

/* ── 공용 Row 컴포넌트 ── */
function Row({
  label,
  value,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <dt className="shrink-0 text-sm text-[var(--color-muted)]">{label}</dt>
      <dd
        className={`text-right text-sm ${
          highlight
            ? "font-bold text-red-500"
            : bold
              ? "font-bold text-[var(--color-dark)]"
              : "text-[var(--color-body)]"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
