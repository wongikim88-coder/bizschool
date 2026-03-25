"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { ExpertConsultationCategory } from "@/types";

const categories: ExpertConsultationCategory[] = ["회계", "세무", "4대보험", "인사·총무"];
const MAX_CONTENT_LENGTH = 2000;

export default function ExpertWriteForm() {
  const router = useRouter();
  const [category, setCategory] = useState<ExpertConsultationCategory | "">("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!category) newErrors.category = "상담 분야를 선택해주세요";
    if (!title.trim()) newErrors.title = "제목을 입력해주세요";
    if (!content.trim()) newErrors.content = "내용을 입력해주세요";
    if (content.length > MAX_CONTENT_LENGTH)
      newErrors.content = "내용은 2000자 이내로 작성해주세요";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    alert("상담이 등록되었습니다.");
    router.push("/mypage?tab=expert");
  };

  return (
    <div className="mx-auto max-w-[800px] px-4 py-6">
      {/* 돌아가기 */}
      <button
        onClick={() => router.push("/mypage?tab=expert")}
        className="mb-6 flex items-center gap-1 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-body)]"
      >
        <ArrowLeft size={16} />
        돌아가기
      </button>

      <h1 className="text-xl font-bold text-[var(--color-dark)]">전문가상담 등록</h1>
      <hr className="my-5 border-[var(--color-border)]" />

      {/* 상담 분야 */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-[var(--color-dark)]">
          상담 분야 <span className="text-[var(--color-red)]">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategory(cat);
                setErrors((prev) => ({ ...prev, category: "" }));
              }}
              className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                category === cat
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                  : "border-[var(--color-border)] text-[var(--color-body)] hover:border-gray-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {errors.category && (
          <p className="mt-1.5 text-xs text-[var(--color-red)]">{errors.category}</p>
        )}
      </div>

      {/* 제목 */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-[var(--color-dark)]">
          제목 <span className="text-[var(--color-red)]">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setErrors((prev) => ({ ...prev, title: "" }));
          }}
          placeholder="상담 제목을 입력해주세요"
          className="w-full rounded-lg border border-[var(--color-border)] px-4 py-3 text-[15px] outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
        />
        {errors.title && (
          <p className="mt-1.5 text-xs text-[var(--color-red)]">{errors.title}</p>
        )}
      </div>

      {/* 내용 */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-[var(--color-dark)]">
          내용 <span className="text-[var(--color-red)]">*</span>
        </label>
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setErrors((prev) => ({ ...prev, content: "" }));
            }}
            placeholder="상담 내용을 상세히 작성해주세요"
            className="min-h-[200px] w-full resize-y rounded-lg border border-[var(--color-border)] px-4 py-3 text-[15px] outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
          />
          <span className="absolute bottom-3 right-3 text-sm text-[var(--color-muted)]">
            {content.length}/{MAX_CONTENT_LENGTH}
          </span>
        </div>
        {errors.content && (
          <p className="mt-1.5 text-xs text-[var(--color-red)]">{errors.content}</p>
        )}
      </div>

      {/* 버튼 */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/mypage?tab=expert")}
          className="rounded-lg border border-[var(--color-border)] px-6 py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-gray-50"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-lg bg-[var(--color-primary)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)]"
        >
          등록하기
        </button>
      </div>
    </div>
  );
}
