"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Inquiry, InquiryCategory } from "@/types";
import { inquiryCategories } from "@/data/mypage";

interface InquiryFormProps {
  onSubmit: (inquiry: Inquiry) => void;
  nextId: number;
}

export default function InquiryForm({ onSubmit, nextId }: InquiryFormProps) {
  const router = useRouter();
  const [category, setCategory] = useState<InquiryCategory | "">("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const isValid = category !== "" && title.trim() !== "" && content.trim() !== "";
  const hasDraft = category !== "" || title.trim() !== "" || content.trim() !== "";

  const handleGoBack = () => {
    if (hasDraft) {
      setShowLeaveModal(true);
    } else {
      router.push("/mypage?tab=inquiry");
    }
  };

  const handleSubmit = () => {
    if (!isValid) return;

    const newInquiry: Inquiry = {
      id: nextId,
      category: category as InquiryCategory,
      title: title.trim(),
      content: content.trim(),
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };

    onSubmit(newInquiry);
    router.push("/mypage?tab=inquiry");
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[var(--color-dark)]">
        1:1 문의하기
      </h2>

      <div className="mt-6 space-y-5">
        {/* Category */}
        <div>
          <label className="text-sm font-medium text-[var(--color-dark)]">
            카테고리 <span className="text-[var(--color-red)]">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as InquiryCategory | "")}
            className="mt-1.5 w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-body)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          >
            <option value="">카테고리를 선택해주세요</option>
            {inquiryCategories.map((cat) => (
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
            placeholder="문의 제목을 입력해주세요"
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
            placeholder="문의 내용을 상세히 입력해주세요"
            className="mt-1.5 min-h-[160px] w-full resize-none rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-body)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-6 py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
          >
            <ArrowLeft size={16} />
            목록으로
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="rounded-lg bg-[var(--color-primary)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            문의 등록
          </button>
        </div>
      </div>

      {/* Leave confirmation modal */}
      {showLeaveModal &&
        createPortal(
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setShowLeaveModal(false)}
          >
            <div
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-xs -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <p className="mb-2 text-center font-medium text-[var(--color-dark)]">
                작성 중인 내용이 저장되지 않습니다.
              </p>
              <p className="mb-6 text-center text-sm text-[var(--color-muted)]">
                목록으로 이동하시겠습니까?
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
                  onClick={() => router.push("/mypage?tab=inquiry")}
                  className="flex-1 rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
                >
                  목록으로 이동
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
