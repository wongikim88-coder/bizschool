"use client";

import { useState } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";

type Plan = "monthly" | "annual";

export default function PricingCard() {
  const [selected, setSelected] = useState<Plan | null>(null);

  return (
    <div className="mx-auto mt-8 max-w-[560px] rounded-2xl border border-[var(--color-border)] bg-white p-8">
      {/* 가격 선택 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* 월간 */}
        <button
          type="button"
          onClick={() => setSelected("monthly")}
          className={`rounded-xl border-2 p-5 text-center transition-all ${
            selected === "monthly"
              ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]"
              : "border-[var(--color-border)] hover:border-[var(--color-primary)]/30"
          }`}
        >
          <p className="text-sm font-semibold text-[var(--color-muted)]">월간 구독</p>
          <p className="mt-3">
            <span className={`text-3xl font-black ${selected === "monthly" ? "text-[var(--color-primary)]" : "text-[var(--color-dark)]"}`}>
              11,000
            </span>
            <span className="ml-0.5 text-sm text-[var(--color-body)]">원/월</span>
          </p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">부가세 포함</p>
        </button>

        {/* 연간 */}
        <button
          type="button"
          onClick={() => setSelected("annual")}
          className={`relative rounded-xl border-2 p-5 text-center transition-all ${
            selected === "annual"
              ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]"
              : "border-[var(--color-border)] hover:border-[var(--color-primary)]/30"
          }`}
        >
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-primary)] px-3 py-0.5 text-xs font-bold text-white">
            10% 절약
          </span>
          <p className="text-sm font-semibold text-[var(--color-muted)]">연간 구독</p>
          <p className="mt-3">
            <span className={`text-3xl font-black ${selected === "annual" ? "text-[var(--color-primary)]" : "text-[var(--color-dark)]"}`}>
              9,900
            </span>
            <span className="ml-0.5 text-sm text-[var(--color-body)]">원/월</span>
          </p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">연 118,800원 일시납 · 부가세 포함</p>
        </button>
      </div>

      {/* 서비스 내용 */}
      <div className="mx-auto my-6 h-px w-full bg-[var(--color-border)]" />

      <ul className="space-y-2.5 text-sm text-[var(--color-body)]">
        <li className="flex items-center gap-2">
          <CheckCircle size={15} className="shrink-0 text-[var(--color-primary)]" />
          회계, 세무, 4대보험, 인사·총무 전 분야 이용
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle size={15} className="shrink-0 text-[var(--color-primary)]" />
          월 10회 전문가 1:1 상담
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle size={15} className="shrink-0 text-[var(--color-primary)]" />
          영업일 1~2일 이내 답변
        </li>
      </ul>

      {selected ? (
        <button
          type="button"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
        >
          {selected === "monthly" ? "월간 구독하고 상담 시작하기" : "연간 구독하고 상담 시작하기"}
          <ArrowRight size={18} />
        </button>
      ) : (
        <div className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-border)] px-6 py-3.5 text-base font-semibold text-[var(--color-muted)] cursor-not-allowed">
          결제 방식을 선택해주세요
        </div>
      )}
    </div>
  );
}
