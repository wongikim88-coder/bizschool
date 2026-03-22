"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, CheckCircle } from "lucide-react";
import type { Inquiry } from "@/types";

interface InquiryDetailProps {
  inquiry: Inquiry | undefined;
}

export default function InquiryDetail({ inquiry }: InquiryDetailProps) {
  const router = useRouter();

  if (!inquiry) {
    router.push("/mypage?tab=inquiry");
    return null;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-end">
        {inquiry.status === "pending" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
            <Clock size={12} />
            대기중
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-primary-light)] px-3 py-1 text-xs font-medium text-[var(--color-primary)]">
            <CheckCircle size={12} />
            답변완료
          </span>
        )}
      </div>

      {/* Title */}
      <h2 className="mt-4 text-xl font-bold text-[var(--color-dark)]">
        {inquiry.title}
      </h2>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        카테고리: {inquiry.category} &nbsp;|&nbsp; 작성일: {inquiry.createdAt}
      </p>

      {/* Question */}
      <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-6">
        <p className="text-lg font-bold text-[var(--color-dark)]">Q</p>
        <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-[var(--color-dark)]">
          {inquiry.content}
        </p>
      </div>

      {/* Answer */}
      {inquiry.status === "answered" && inquiry.answer ? (
        <div className="mt-4 rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-primary-light)] p-6">
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-[var(--color-primary)]">A</p>
            <p className="text-sm text-[var(--color-muted)]">
              {inquiry.answer.answeredBy} &nbsp;|&nbsp;{" "}
              {inquiry.answer.answeredAt}
            </p>
          </div>
          <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-[var(--color-dark)]">
            {inquiry.answer.content}
          </p>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl bg-[var(--color-light-bg)] p-6 text-center">
          <Clock size={24} className="mx-auto text-[var(--color-muted)]" />
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            답변 대기 중입니다. 빠른 시일 내에 답변 드리겠습니다.
          </p>
        </div>
      )}

      {/* Back to list */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => router.push("/mypage?tab=inquiry")}
          className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-6 py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
        >
          <ArrowLeft size={16} />
          목록으로
        </button>
      </div>
    </div>
  );
}
