"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { ClaimSubTab, ClaimType, ClaimItem } from "@/types";
import { mockClaimItems } from "@/data/mypage";
import ClaimDetail from "./ClaimDetail";

const subTabs: { key: ClaimSubTab; label: string }[] = [
  { key: "claims", label: "취소/반품/교환" },
  { key: "bankRefund", label: "무통장환불" },
];

function ClaimStatusBadge({ item }: { item: ClaimItem }) {
  return (
    <div className="text-right text-sm">
      <p className="font-bold text-[var(--color-dark)]">{item.claimStatus}</p>
      {item.refundExpectedDescription && (
        <p className="mt-0.5 text-[var(--color-muted)]">
          {item.refundExpectedDescription}
        </p>
      )}
      {item.refundMethod && (
        <p className="text-[var(--color-muted)]">{item.refundMethod}</p>
      )}
    </div>
  );
}

function claimTypeLabel(type: ClaimType): string {
  switch (type) {
    case "cancel": return "취소";
    case "return": return "반품";
    case "exchange": return "교환";
  }
}

function claimDateLabel(type: ClaimType): string {
  switch (type) {
    case "cancel": return "취소접수일";
    case "return": return "반품접수일";
    case "exchange": return "교환접수일";
  }
}

function detailButtonLabel(type: ClaimType): string {
  switch (type) {
    case "cancel": return "취소상세";
    case "return": return "반품상세";
    case "exchange": return "교환상세";
  }
}

export default function ClaimsSection() {
  const router = useRouter();
  const [activeSubTab, setActiveSubTab] = useState<ClaimSubTab>("claims");
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);

  const selectedClaim = selectedClaimId
    ? mockClaimItems.find((c) => c.id === selectedClaimId) ?? null
    : null;

  if (selectedClaim) {
    return (
      <ClaimDetail
        claimItem={selectedClaim}
        onBack={() => setSelectedClaimId(null)}
      />
    );
  }

  const filteredItems =
    activeSubTab === "claims"
      ? mockClaimItems
      : [];

  return (
    <div>
      {/* Title */}
      <h2 className="mb-6 text-xl font-bold text-[var(--color-dark)]">
        취소/반품/교환/환불내역
      </h2>

      {/* Sub Tabs */}
      <div className="mb-4 flex border-b border-[var(--color-border)]">
        {subTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeSubTab === tab.key}
            onClick={() => setActiveSubTab(tab.key)}
            className={`flex-1 py-3 text-center text-[15px] transition-colors ${
              activeSubTab === tab.key
                ? "border-b-2 border-[var(--color-dark)] font-bold text-[var(--color-dark)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-body)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notice */}
      <div className="mb-6 flex items-start justify-between text-sm text-[var(--color-muted)]">
        <div>
          <p>- 취소/반품/교환 신청한 내역을 확인할 수 있습니다.</p>
          <p>
            - 하단 상품목록에 없는 상품은{" "}
            <span className="cursor-pointer text-[var(--color-primary)] underline">
              1:1문의
            </span>{" "}
            또는 고객센터(1577-7011)로 문의주세요.
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 text-sm text-[var(--color-muted)] hover:text-[var(--color-body)]"
        >
          취소/반품 안내 &gt;
        </button>
      </div>

      {/* List */}
      {activeSubTab === "bankRefund" ? (
        <div className="rounded-lg border border-[var(--color-border)] bg-white p-12 text-center text-[var(--color-muted)]">
          무통장환불 내역이 없습니다.
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-lg border border-[var(--color-border)] bg-white p-12 text-center text-[var(--color-muted)]">
          취소/반품/교환 내역이 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-[var(--color-border)] bg-white p-5"
            >
              {/* Header */}
              <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-muted)]">
                <span className="font-medium text-[var(--color-dark)]">
                  {claimDateLabel(item.claimType)} : {item.claimDate}
                </span>
                <span>주문일 : {item.orderDate}</span>
                <span>주문번호 : {item.orderNumber}</span>
              </div>

              {/* Product + Status */}
              <div className="flex items-center justify-between gap-4">
                {/* Product Info */}
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-light-bg)]">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[var(--color-dark)]">
                      {item.product.name}
                    </p>
                    <p className="truncate text-sm text-[var(--color-muted)]">
                      {item.product.description}
                    </p>
                  </div>
                </div>

                {/* Quantity + Price */}
                <div className="shrink-0 text-right text-sm">
                  <p>{item.product.quantity}개</p>
                  <p className="font-medium">
                    {item.product.price.toLocaleString()} 원
                  </p>
                </div>

                {/* Status + Detail Button */}
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <ClaimStatusBadge item={item} />
                  <button
                    type="button"
                    onClick={() => setSelectedClaimId(item.id)}
                    className="rounded-md border border-[var(--color-border)] px-4 py-1.5 text-sm text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
                  >
                    {detailButtonLabel(item.claimType)}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 주문/배송 목록 이동 버튼 */}
      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={() => router.push("/mypage?tab=purchases")}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-6 py-3 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
        >
          <ArrowLeft size={16} />
          주문/배송 목록
        </button>
      </div>
    </div>
  );
}
