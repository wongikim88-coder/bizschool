"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { ExpertConsultation, ExpertConsultationCategory } from "@/types";

interface ExpertWriteFormProps {
  onSubmit: (consultation: ExpertConsultation) => void;
  onCancel: () => void;
}

const categories: ExpertConsultationCategory[] = [
  "회계",
  "세무",
  "4대보험",
  "인사·총무",
];

export default function ExpertWriteForm({
  onSubmit,
  onCancel,
}: ExpertWriteFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    ExpertConsultationCategory | ""
  >("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const isDirty = title.trim().length > 0 || content.trim().length > 0;

  const handleCancel = () => {
    if (isDirty) {
      setShowLeaveModal(true);
    } else {
      onCancel();
    }
  };

  const isValid =
    selectedCategory !== "" && title.trim() !== "" && content.trim() !== "";

  const handleSubmit = () => {
    if (!isValid) return;

    const newConsultation: ExpertConsultation = {
      id: `ec-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      author: "김비즈",
      authorId: "user-001",
      category: selectedCategory as ExpertConsultationCategory,
      createdAt: new Date().toISOString().split("T")[0].replace(/-/g, "."),
      viewCount: 0,
      status: "pending",
    };

    onSubmit(newConsultation);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[var(--color-dark)]">
        전문가상담 등록
      </h2>

      <div className="mt-6 space-y-5">
        {/* Category */}
        <div>
          <label className="text-sm font-medium text-[var(--color-dark)]">
            상담 분야 <span className="text-[var(--color-red)]">*</span>
          </label>
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(
                e.target.value as ExpertConsultationCategory | ""
              )
            }
            className="mt-1.5 w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-body)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          >
            <option value="">분야를 선택해주세요</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="text-sm font-medium text-[var(--color-dark)]">
            제목 <span className="text-[var(--color-red)]">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="상담 제목을 입력해주세요"
            className="mt-1.5 w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-body)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </div>

        {/* Content */}
        <div>
          <label className="text-sm font-medium text-[var(--color-dark)]">
            내용 <span className="text-[var(--color-red)]">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="상담 내용을 상세히 입력해주세요"
            className="mt-1.5 min-h-[160px] w-full resize-none rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-body)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-6 py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
          >
            <ArrowLeft size={16} />
            상담 목록
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="rounded-lg bg-[var(--color-primary)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            등록하기
          </button>
        </div>
      </div>

      {/* Leave confirmation modal */}
      {showLeaveModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowLeaveModal(false)}
        >
          <div
            className="mx-4 w-full max-w-xs rounded-lg bg-white p-6"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <p className="mb-2 text-center font-medium text-[var(--color-dark)]">
              작성 중인 내용이 저장되지 않습니다.
            </p>
            <p className="mb-6 text-center text-sm text-[var(--color-muted)]">
              상담 목록으로 돌아가시겠습니까?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 rounded-lg border border-[var(--color-border)] py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
              >
                계속 작성
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
              >
                목록으로 이동
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
