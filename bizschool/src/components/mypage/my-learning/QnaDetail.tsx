"use client";

import { ArrowLeft, Clock, CheckCircle } from "lucide-react";
import type { CourseQna, CourseCategory } from "@/types";

interface QnaDetailProps {
  qna: CourseQna;
  onBack: () => void;
}

const categoryShortLabel: Record<CourseCategory, string> = {
  "온라인 강의": "온라인",
  "현장 강의": "현장",
  "인재키움 프리미엄 훈련": "인재키움",
};

export default function QnaDetail({ qna, onBack }: QnaDetailProps) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-end">
        {qna.answerStatus === "답변대기" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600">
            <Clock size={12} />
            답변대기
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
            <CheckCircle size={12} />
            답변완료
          </span>
        )}
      </div>

      {/* Course info */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-sm text-[var(--color-muted)]">
          {categoryShortLabel[qna.courseCategory]}
        </span>
        <span className="text-sm text-[var(--color-body)]">{qna.courseTitle}</span>
      </div>

      {/* Title */}
      <h2 className="mt-3 text-xl font-bold text-[var(--color-dark)]">
        {qna.title}
      </h2>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        작성일: {qna.createdAt}
      </p>

      {/* Question */}
      <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-6">
        <p className="text-lg font-bold text-[var(--color-primary)]">Q</p>
        <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-[var(--color-body)]">
          {qna.content}
        </p>
      </div>

      {/* Answer */}
      {qna.answerStatus === "답변완료" && qna.answer ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-emerald-600">A</p>
            <p className="text-sm text-[var(--color-muted)]">
              {qna.answer.instructorName} 강사 &nbsp;|&nbsp; {qna.answer.answeredAt}
            </p>
          </div>
          <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-[var(--color-body)]">
            {qna.answer.content}
          </p>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl bg-[var(--color-light-bg)] p-6 text-center">
          <Clock size={24} className="mx-auto text-[var(--color-muted)]" />
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            담당 강사가 답변을 준비 중입니다. 빠른 시일 내에 답변 드리겠습니다.
          </p>
        </div>
      )}

      {/* 하단 목록 버튼 */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={onBack}
          className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-6 py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
        >
          <ArrowLeft size={16} />
          Q&A 목록
        </button>
      </div>
    </div>
  );
}
