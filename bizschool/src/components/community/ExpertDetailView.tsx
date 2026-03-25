"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Clock, MessageSquare } from "lucide-react";
import type { ExpertConsultation } from "@/types";

interface ExpertDetailViewProps {
  consultation: ExpertConsultation;
}

export default function ExpertDetailView({ consultation }: ExpertDetailViewProps) {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-[800px] px-4 py-6">
      {/* 목록으로 */}
      <button
        onClick={() => router.push("/expert-consultation")}
        className="mb-6 flex items-center gap-1 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-body)]"
      >
        <ArrowLeft size={16} />
        목록으로
      </button>

      {/* 헤더: 카테고리 + 상태 */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-[var(--color-muted)]">
          {consultation.category}
        </span>
        {consultation.status === "answered" ? (
          <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600">
            <CheckCircle size={12} />
            답변완료
          </span>
        ) : (
          <span className="inline-flex items-center gap-0.5 text-xs font-medium text-amber-500">
            <Clock size={12} />
            대기중
          </span>
        )}
      </div>

      {/* 제목 */}
      <h1 className="mt-2 text-xl font-bold text-[var(--color-dark)]">
        {consultation.title}
      </h1>

      {/* 메타 정보 */}
      <div className="mt-2 flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
        <span>{consultation.author}</span>
        <span>·</span>
        <span>{consultation.createdAt}</span>
        <span>·</span>
        <span>조회 {consultation.viewCount}</span>
      </div>

      {/* 구분선 */}
      <hr className="my-5 border-[var(--color-border)]" />

      {/* 질문 본문 */}
      <div className="text-[15px] leading-relaxed text-[var(--color-body)] whitespace-pre-wrap">
        {consultation.content}
      </div>

      {/* 답변 영역 */}
      <div className="mt-8 rounded-lg bg-[var(--color-light-bg)] p-6">
        <div className="flex items-center gap-2 text-base font-bold text-[var(--color-dark)]">
          <MessageSquare size={18} />
          전문가 답변
        </div>

        <hr className="my-4 border-[var(--color-border)]" />

        {consultation.status === "answered" && consultation.answer ? (
          <>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--color-dark)]">
                {consultation.answer.expertName}
              </span>
              <span className="text-sm font-medium text-[var(--color-primary)]">
                {consultation.answer.expertTitle}
              </span>
              <span className="text-sm text-[var(--color-muted)]">
                · {consultation.answer.answeredAt}
              </span>
            </div>
            <div className="mt-4 text-[15px] leading-relaxed text-[var(--color-body)] whitespace-pre-wrap">
              {consultation.answer.content}
            </div>
          </>
        ) : (
          <p className="py-4 text-center text-sm text-[var(--color-muted)]">
            아직 답변이 등록되지 않았습니다.<br />
            전문가 답변을 기다려 주세요.
          </p>
        )}
      </div>
    </div>
  );
}
