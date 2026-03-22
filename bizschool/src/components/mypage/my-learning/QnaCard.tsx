"use client";

import { Clock, CheckCircle } from "lucide-react";
import type { CourseQna, CourseCategory, QnaAnswerStatus } from "@/types";

interface QnaCardProps {
  qna: CourseQna;
  onClick: (id: string) => void;
}

const categoryShortLabel: Record<CourseCategory, string> = {
  "온라인 강의": "온라인",
  "현장 강의": "현장",
  "인재키움 프리미엄 훈련": "인재키움",
};

function StatusBadge({ status }: { status: QnaAnswerStatus }) {
  if (status === "답변대기") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
        <Clock size={12} />
        답변대기
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-primary-light)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-primary)]">
      <CheckCircle size={12} />
      답변완료
    </span>
  );
}

/* Desktop table row */
export function QnaTableRow({ qna, onClick }: QnaCardProps) {
  return (
    <tr
      onClick={() => onClick(qna.id)}
      className="cursor-pointer border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-light-bg)]"
    >
      <td className="px-4 py-4 text-center text-sm text-[var(--color-body)]">
        {categoryShortLabel[qna.courseCategory]}
      </td>
      <td className="truncate px-4 py-4 text-sm text-[var(--color-body)]">
        {qna.courseTitle}
      </td>
      <td className="truncate px-4 py-4 text-sm font-medium text-[var(--color-dark)]">
        {qna.title}
      </td>
      <td className="px-4 py-4 text-center text-sm text-[var(--color-body)]">
        {qna.createdAt}
      </td>
      <td className="px-4 py-4 text-center">
        <StatusBadge status={qna.answerStatus} />
      </td>
    </tr>
  );
}

/* Mobile card */
export function QnaMobileCard({ qna, onClick }: QnaCardProps) {
  return (
    <div
      onClick={() => onClick(qna.id)}
      className="cursor-pointer rounded-xl border border-[var(--color-border)] bg-white p-4 transition-colors hover:border-[var(--color-primary)]/30"
    >
      <div className="flex items-center gap-2">
        <StatusBadge status={qna.answerStatus} />
        <span className="text-xs text-[var(--color-muted)]">
          {categoryShortLabel[qna.courseCategory]}
        </span>
      </div>
      <p className="mt-2 text-xs text-[var(--color-muted)]">{qna.courseTitle}</p>
      <h4 className="mt-1 line-clamp-1 font-medium text-[var(--color-dark)]">
        {qna.title}
      </h4>
      <p className="mt-1 text-sm text-[var(--color-muted)]">{qna.createdAt}</p>
    </div>
  );
}
