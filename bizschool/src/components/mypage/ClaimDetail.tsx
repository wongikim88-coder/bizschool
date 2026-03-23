"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { ClaimItem, PickupScheduleInfo, PickupRequestLocation } from "@/types";
import { mockCancelDetail, mockReturnDetail, mockExchangeDetail } from "@/data/mypage";

interface ClaimDetailProps {
  claimItem: ClaimItem;
  onBack: () => void;
}

/* ── Cancel Receipt Modal ── */
function CancelReceiptModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-lg rounded-lg bg-white p-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[var(--color-dark)]">
            취소영수증 조회/발급
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-[var(--color-muted)] hover:text-[var(--color-dark)]"
          >
            &times;
          </button>
        </div>

        <table className="mb-4 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-t border-[var(--color-border)]">
              <th scope="col" className="px-3 py-2 text-center font-medium">상품 취소 금액</th>
              <th scope="col" className="px-3 py-2 text-center font-medium">할인금액 차감</th>
              <th scope="col" className="px-3 py-2 text-center font-medium">배송비</th>
              <th scope="col" className="px-3 py-2 text-center font-medium text-red-600">총 환불 금액</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--color-border)]">
              <td className="px-3 py-3 text-center">3,200 원</td>
              <td className="px-3 py-3 text-center">0 원</td>
              <td className="px-3 py-3 text-center">0 원</td>
              <td className="px-3 py-3 text-center font-bold text-red-600">3,200 원</td>
            </tr>
          </tbody>
        </table>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>취소영수증 출력</span>
            <span>신용카드 <span className="font-bold">3,200 원</span></span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-primary)] underline cursor-pointer">
              쿠팡(주) 카드 취소영수증
            </span>
            <span>쿠팡(주) <span className="font-bold">3,200 원</span></span>
          </div>
        </div>

        <p className="mt-4 text-xs text-red-500">
          <span className="mr-1">!</span>
          부분취소 후, 상품별 할인쿠폰 적용 금액이 변경되어 신용카드 사용액 중 일부가 취소되었습니다.
        </p>
      </div>
    </div>
  );
}

/* ── Pickup Change Modal ── */
function PickupChangeModal({
  schedule,
  onClose,
}: {
  schedule: PickupScheduleInfo;
  onClose: () => void;
}) {
  const [request, setRequest] = useState<PickupRequestLocation>(schedule.pickupRequest);

  const locationLabels: Record<PickupRequestLocation, string> = {
    door: "문 앞",
    security: "경비실",
    other: "그 외 장소 (예: 계단 밑 옥상 등)",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-sm rounded-lg bg-white p-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h3 className="mb-4 text-base font-bold text-[var(--color-dark)]">
          회수 예정일 / 요청사항
        </h3>

        <div className="mb-4">
          <p className="mb-1 text-sm text-[var(--color-muted)]">회수 예정일</p>
          <p className="font-medium text-[var(--color-primary)]">{schedule.pickupDate}</p>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-sm text-[var(--color-muted)]">회수 요청사항</p>
          <div className="space-y-2">
            {(Object.entries(locationLabels) as [PickupRequestLocation, string][]).map(
              ([key, label]) => (
                <label key={key} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="pickupRequest"
                    checked={request === key}
                    onChange={() => setRequest(key)}
                    className="h-4 w-4 accent-[var(--color-primary)]"
                  />
                  {label}
                </label>
              )
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-[var(--color-border)] py-2.5 text-sm font-medium text-[var(--color-body)]"
          >
            이전 돌아가기
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Confirm Withdraw Modal ── */
function ConfirmWithdrawModal({
  type,
  onConfirm,
  onClose,
}: {
  type: "반품" | "교환";
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-xs rounded-lg bg-white p-6 text-center"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <p className="mb-6 text-[var(--color-dark)]">
          {type}신청을 철회 하시겠습니까?
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-[var(--color-border)] py-2.5 text-sm font-medium"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Section Components ── */
function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h4 className="mb-3 border-b border-[var(--color-dark)] pb-2 text-base font-bold text-[var(--color-dark)]">
        {title}
      </h4>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | React.ReactNode }) {
  return (
    <div className="flex border-b border-[var(--color-border)] py-2.5 text-sm">
      <span className="w-32 shrink-0 text-[var(--color-muted)]">{label}</span>
      <span className="text-[var(--color-dark)]">{value}</span>
    </div>
  );
}

/* ── Main Component ── */
export default function ClaimDetail({ claimItem, onBack }: ClaimDetailProps) {
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [pickupModalOpen, setPickupModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  const renderProductTable = (
    item: ClaimItem,
    actions?: React.ReactNode
  ) => (
    <table className="mb-6 w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-t-2 border-[var(--color-dark)]">
          <th scope="col" className="px-4 py-3 text-center font-medium">상품</th>
          <th scope="col" className="px-4 py-3 text-center font-medium">금액</th>
          <th scope="col" className="px-4 py-3 text-center font-medium">진행 상태</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-[var(--color-border)]">
          <td className="px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-light-bg)]">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div>
                <p className="font-medium text-[var(--color-dark)]">{item.product.name}</p>
                <p className="text-[var(--color-muted)]">{item.product.description}</p>
              </div>
            </div>
          </td>
          <td className="px-4 py-4 text-center align-top">
            <p>{item.product.quantity}개</p>
            <p className="font-medium">{item.product.price.toLocaleString()} 원</p>
          </td>
          <td className="px-4 py-4 text-center align-top">
            <p className="font-bold">{item.claimStatus}</p>
            {item.refundExpectedDescription && (
              <p className="text-xs text-[var(--color-muted)]">{item.refundExpectedDescription}</p>
            )}
            {item.refundMethod && (
              <p className="text-xs text-[var(--color-muted)]">{item.refundMethod}</p>
            )}
            {actions && <div className="mt-2 space-y-1">{actions}</div>}
          </td>
        </tr>
      </tbody>
    </table>
  );

  /* ── Cancel Detail ── */
  if (claimItem.claimType === "cancel") {
    const detail = mockCancelDetail;
    return (
      <div>
        <h2 className="mb-1 text-xl font-bold text-[var(--color-dark)]">
          취소/반품/교환/환불 상세
        </h2>
        <p className="mb-6 text-sm text-[var(--color-muted)]">
          주문일 : {claimItem.orderDate} | 주문번호 : {claimItem.orderNumber}
        </p>

        {renderProductTable(claimItem)}

        <InfoSection title="상세정보">
          <InfoRow label="취소접수일자" value={detail.cancelReceiptDate} />
          <InfoRow label="취소접수번호" value={detail.cancelReceiptNumber} />
          {detail.cancelCompleteDate && (
            <InfoRow label="취소완료일" value={detail.cancelCompleteDate} />
          )}
        </InfoSection>

        <InfoSection title="취소 사유">
          <InfoRow label="취소 사유" value={detail.cancelReason} />
        </InfoSection>

        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between border-b border-[var(--color-dark)] pb-2">
            <h4 className="text-base font-bold text-[var(--color-dark)]">환불안내</h4>
            <button
              type="button"
              onClick={() => setReceiptModalOpen(true)}
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-body)]"
            >
              취소영수증 확인
            </button>
          </div>
          <div className="flex gap-8 text-sm">
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">상품금액</span>
                <span>{detail.refund.productAmount.toLocaleString()} 원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">배송비</span>
                <span>{detail.refund.shippingFee.toLocaleString()} 원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">반품비</span>
                <span>{detail.refund.returnFee.toLocaleString()} 원</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">환불 수단</span>
                <span>{detail.refund.refundMethod}</span>
              </div>
              <div className="flex justify-between">
                <span></span>
                <span>{detail.refund.refundAmount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between border-t border-[var(--color-border)] pt-2">
                <span className="font-bold">
                  {detail.refund.isCompleted ? "환불 완료" : "환불 예상금액"}
                </span>
                <span className="font-bold text-red-500">
                  {detail.refund.refundAmount.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-[var(--color-muted)]">
            <span className="mr-1">&#9432;</span>
            카드사로 결제 취소 요청이 전달된 후 환불까지 평일 기준 3~7일이 소요됩니다.
          </p>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-6 py-3 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
          >
            <ArrowLeft size={16} />
            주문/배송 목록
          </button>
        </div>

        {receiptModalOpen && (
          <CancelReceiptModal onClose={() => setReceiptModalOpen(false)} />
        )}
      </div>
    );
  }

  /* ── Return Detail ── */
  if (claimItem.claimType === "return") {
    const detail = mockReturnDetail;
    return (
      <div>
        <h2 className="mb-1 text-xl font-bold text-[var(--color-dark)]">
          취소/반품/교환/환불 상세
        </h2>
        <p className="mb-6 text-sm text-[var(--color-muted)]">
          주문일 : {claimItem.orderDate} | 주문번호 : {claimItem.orderNumber}
        </p>

        {renderProductTable(claimItem, (
          <>
            <button
              type="button"
              className="w-full rounded border border-[var(--color-border)] px-3 py-1 text-xs hover:bg-[var(--color-light-bg)]"
            >
              회수조회
            </button>
            <button
              type="button"
              onClick={() => setWithdrawModalOpen(true)}
              className="w-full rounded border border-[var(--color-border)] px-3 py-1 text-xs hover:bg-[var(--color-light-bg)]"
            >
              반품철회
            </button>
          </>
        ))}

        <InfoSection title="상세정보">
          <InfoRow label="반품접수일자" value={detail.returnReceiptDate} />
          <InfoRow label="반품접수번호" value={detail.returnReceiptNumber} />
        </InfoSection>

        <InfoSection title="상품 회수정보">
          <div className="grid grid-cols-2 gap-0 text-sm">
            <div>
              <div className="mb-2 border-b border-[var(--color-border)] pb-2 font-medium">
                상품회수요청
              </div>
              <div className="space-y-2">
                <div className="flex">
                  <span className="w-20 text-[var(--color-muted)]">상품회수 진행여부</span>
                  <span>상품회수요청</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-[var(--color-muted)]">회수인</span>
                  <span>{detail.pickupInfo.pickupPerson}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-[var(--color-muted)]">휴대폰</span>
                  <span>{detail.pickupInfo.phone}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-[var(--color-muted)]">연락처</span>
                  <span>{detail.pickupInfo.contact}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-[var(--color-muted)]">주소</span>
                  <span>{detail.pickupInfo.address}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="mb-2 border-b border-[var(--color-border)] pb-2 font-bold">
                반송장정보
              </div>
              <div className="space-y-2">
                <div className="flex">
                  <span className="w-20 text-[var(--color-muted)]">택배기사</span>
                  <span>{detail.shippingInfo.carrier}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-[var(--color-muted)]">송장번호</span>
                  <span>{detail.shippingInfo.trackingNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </InfoSection>

        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between border-b border-[var(--color-dark)] pb-2">
            <h4 className="text-base font-bold text-[var(--color-dark)]">
              회수 예정일 / 요청사항
            </h4>
            <button
              type="button"
              onClick={() => setPickupModalOpen(true)}
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-body)]"
            >
              변경하기 &gt;
            </button>
          </div>
          <InfoRow label="회수 예정일" value={
            <span className="text-[var(--color-primary)]">{detail.pickupSchedule.pickupDate}</span>
          } />
          <InfoRow
            label="회수 요청사항"
            value={
              detail.pickupSchedule.pickupRequest === "door"
                ? "문 앞"
                : detail.pickupSchedule.pickupRequest === "security"
                ? "경비실"
                : detail.pickupSchedule.pickupRequestText || "기타"
            }
          />
        </div>

        <InfoSection title="반품 사유">
          <InfoRow label="반품 사유" value={detail.returnReason} />
        </InfoSection>

        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between border-b border-[var(--color-dark)] pb-2">
            <h4 className="text-base font-bold text-[var(--color-dark)]">환불안내</h4>
            <button
              type="button"
              onClick={() => setReceiptModalOpen(true)}
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-body)]"
            >
              취소영수증 확인
            </button>
          </div>
          <div className="flex gap-8 text-sm">
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">상품금액</span>
                <span>{detail.refund.productAmount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">배송비</span>
                <span>{detail.refund.shippingFee.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">반품비</span>
                <span>{detail.refund.returnFee.toLocaleString()}원</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">환불 수단</span>
                <span>{detail.refund.refundMethod}</span>
              </div>
              <div className="flex justify-between">
                <span></span>
                <span>{detail.refund.refundAmount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between border-t border-[var(--color-border)] pt-2">
                <span className="font-bold">
                  {detail.refund.isCompleted ? "환불 완료" : "환불 예상금액"}
                </span>
                <span className="font-bold text-red-500">
                  {detail.refund.refundAmount.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-[var(--color-muted)]">
            <span className="mr-1">&#9432;</span>
            카드사로 결제 취소 요청이 전달된 후 환불까지 평일 기준 3~7일이 소요됩니다.
          </p>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-6 py-3 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
          >
            <ArrowLeft size={16} />
            주문/배송 목록
          </button>
        </div>

        {receiptModalOpen && (
          <CancelReceiptModal onClose={() => setReceiptModalOpen(false)} />
        )}
        {pickupModalOpen && (
          <PickupChangeModal
            schedule={detail.pickupSchedule}
            onClose={() => setPickupModalOpen(false)}
          />
        )}
        {withdrawModalOpen && (
          <ConfirmWithdrawModal
            type="반품"
            onConfirm={() => setWithdrawModalOpen(false)}
            onClose={() => setWithdrawModalOpen(false)}
          />
        )}
      </div>
    );
  }

  /* ── Exchange Detail ── */
  const detail = mockExchangeDetail;
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-[var(--color-dark)]">
        취소/반품/교환/환불 상세
      </h2>
      <p className="mb-6 text-sm text-[var(--color-muted)]">
        주문일 : {claimItem.orderDate} | 주문번호 : {claimItem.orderNumber}
      </p>

      {renderProductTable(
        { ...claimItem, claimStatus: detail.claimItem.claimStatus },
        (
          <button
            type="button"
            onClick={() => setWithdrawModalOpen(true)}
            className="w-full rounded border border-[var(--color-border)] px-3 py-1 text-xs hover:bg-[var(--color-light-bg)]"
          >
            교환철회
          </button>
        )
      )}

      <InfoSection title="상세정보">
        <InfoRow label="교환접수일자" value={detail.exchangeReceiptDate} />
        <InfoRow label="교환접수번호" value={detail.exchangeReceiptNumber} />
      </InfoSection>

      <InfoSection title="교환 상품 배송정보">
        <div className="grid grid-cols-2 gap-0 text-sm">
          <div>
            <div className="mb-2 border-b border-[var(--color-border)] pb-2 font-medium">
              배송 진행 상태
            </div>
            <div className="space-y-2">
              <div className="flex">
                <span className="w-28 text-[var(--color-muted)]">{detail.exchangeDeliveryInfo.deliveryStatus}</span>
              </div>
              <div className="flex">
                <span className="w-20 text-[var(--color-muted)]">회수인</span>
                <span>{detail.pickupInfo.pickupPerson}</span>
              </div>
              <div className="flex">
                <span className="w-20 text-[var(--color-muted)]">휴대폰</span>
                <span>{detail.pickupInfo.phone}</span>
              </div>
              <div className="flex">
                <span className="w-20 text-[var(--color-muted)]">연락처</span>
                <span>{detail.pickupInfo.contact}</span>
              </div>
              <div className="flex">
                <span className="w-20 text-[var(--color-muted)]">주소</span>
                <span>{detail.pickupInfo.address}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-2 border-b border-[var(--color-border)] pb-2 font-bold">
              배송운송장 정보
            </div>
            <div className="space-y-2">
              <div className="flex">
                <span className="w-20 text-[var(--color-muted)]">택배기사</span>
                <span>{detail.exchangeDeliveryInfo.deliveryCarrier}</span>
              </div>
              <div className="flex">
                <span className="w-20 text-[var(--color-muted)]">송장번호</span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </InfoSection>

      <InfoSection title="상품 회수정보">
        <div className="grid grid-cols-2 gap-0 text-sm">
          <div>
            <div className="mb-2 border-b border-[var(--color-border)] pb-2 font-medium">
              상품회수요청
            </div>
            <div className="space-y-2">
              <div className="flex">
                <span className="w-20 text-[var(--color-muted)]">회수인</span>
                <span>{detail.pickupInfo.pickupPerson}</span>
              </div>
              <div className="flex">
                <span className="w-20 text-[var(--color-muted)]">휴대폰</span>
                <span>{detail.pickupInfo.phone}</span>
              </div>
              <div className="flex">
                <span className="w-20 text-[var(--color-muted)]">연락처</span>
                <span>{detail.pickupInfo.contact}</span>
              </div>
              <div className="flex">
                <span className="w-20 text-[var(--color-muted)]">주소</span>
                <span>{detail.pickupInfo.address}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-2 border-b border-[var(--color-border)] pb-2 font-bold">
              반송장정보
            </div>
            <div className="space-y-2">
              <div className="flex">
                <span className="w-20 text-[var(--color-muted)]">택배기사</span>
                <span>{detail.shippingInfo.carrier}</span>
              </div>
              <div className="flex">
                <span className="w-20 text-[var(--color-muted)]">송장번호</span>
                <span>{detail.shippingInfo.trackingNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </InfoSection>

      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between border-b border-[var(--color-dark)] pb-2">
          <h4 className="text-base font-bold text-[var(--color-dark)]">
            회수 예정일 / 요청사항
          </h4>
          <button
            type="button"
            onClick={() => setPickupModalOpen(true)}
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-body)]"
          >
            변경하기 &gt;
          </button>
        </div>
        <InfoRow label="회수 예정일" value={
          <span className="text-[var(--color-primary)]">{detail.pickupSchedule.pickupDate}</span>
        } />
        <InfoRow
          label="회수 요청사항"
          value={
            detail.pickupSchedule.pickupRequest === "door"
              ? "문 앞"
              : detail.pickupSchedule.pickupRequest === "security"
              ? "경비실"
              : detail.pickupSchedule.pickupRequestText || "기타"
          }
        />
      </div>

      <InfoSection title="교환 사유">
        <InfoRow label="교환 사유" value={detail.exchangeReason} />
      </InfoSection>

      <div className="text-center">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-6 py-3 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)] mx-auto"
        >
          <ArrowLeft size={16} />
          주문/배송 목록
        </button>
      </div>

      {pickupModalOpen && (
        <PickupChangeModal
          schedule={detail.pickupSchedule}
          onClose={() => setPickupModalOpen(false)}
        />
      )}
      {withdrawModalOpen && (
        <ConfirmWithdrawModal
          type="교환"
          onConfirm={() => setWithdrawModalOpen(false)}
          onClose={() => setWithdrawModalOpen(false)}
        />
      )}
    </div>
  );
}
