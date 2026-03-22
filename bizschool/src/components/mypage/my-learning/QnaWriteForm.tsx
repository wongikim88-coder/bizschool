"use client";

import { useState, useMemo, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import type { CourseCategory, CourseQna } from "@/types";
import { mockMyCourses, mockMyOfflineCourses } from "@/data/mypage";

interface QnaWriteFormProps {
  onSubmit: (qna: CourseQna) => void;
  onCancel: () => void;
}

const categoryOptions: CourseCategory[] = [
  "온라인 강의",
  "현장 강의",
  "인재키움 프리미엄 훈련",
];

export default function QnaWriteForm({ onSubmit, onCancel }: QnaWriteFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | "">("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
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

  // 카테고리에 따른 강의 목록 필터링
  const availableCourses = useMemo(() => {
    if (!selectedCategory) return [];

    if (selectedCategory === "온라인 강의") {
      return mockMyCourses
        .filter((c) => c.category === "온라인 강의")
        .map((c) => ({ id: c.id, title: c.title }));
    }

    return mockMyOfflineCourses
      .filter((c) => c.category === selectedCategory)
      .map((c) => ({ id: c.id, title: c.title }));
  }, [selectedCategory]);

  // 카테고리 변경 시 선택된 강의 초기화
  useEffect(() => {
    setSelectedCourseId("");
  }, [selectedCategory]);

  const isValid =
    selectedCategory !== "" &&
    selectedCourseId !== "" &&
    title.trim() !== "" &&
    content.trim() !== "";

  const handleSubmit = () => {
    if (!isValid) return;

    const courseInfo =
      selectedCategory === "온라인 강의"
        ? mockMyCourses.find((c) => c.id === selectedCourseId)
        : mockMyOfflineCourses.find((c) => c.id === selectedCourseId);

    const newQna: CourseQna = {
      id: `qna-${Date.now()}`,
      courseId: selectedCourseId,
      courseTitle: courseInfo?.title || "",
      courseCategory: selectedCategory as CourseCategory,
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString().split("T")[0],
      answerStatus: "답변대기",
    };

    onSubmit(newQna);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[var(--color-dark)]">
        강의 Q&A 작성
      </h2>

      <div className="mt-6 space-y-5">
        {/* 강의 카테고리 */}
        <div>
          <label className="text-sm font-medium text-[var(--color-dark)]">
            강의 카테고리 <span className="text-[var(--color-red)]">*</span>
          </label>
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value as CourseCategory | "")
            }
            className="mt-1.5 w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-body)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          >
            <option value="">카테고리를 선택해주세요</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 강의 선택 */}
        <div>
          <label className="text-sm font-medium text-[var(--color-dark)]">
            강의 선택 <span className="text-[var(--color-red)]">*</span>
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            disabled={!selectedCategory}
            className="mt-1.5 w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-body)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">
              {selectedCategory
                ? "강의를 선택해주세요"
                : "카테고리를 먼저 선택해주세요"}
            </option>
            {availableCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* 제목 */}
        <div>
          <label className="text-sm font-medium text-[var(--color-dark)]">
            제목 <span className="text-[var(--color-red)]">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="질문 제목을 입력해주세요"
            className="mt-1.5 w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-body)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </div>

        {/* 내용 */}
        <div>
          <label className="text-sm font-medium text-[var(--color-dark)]">
            내용 <span className="text-[var(--color-red)]">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="질문 내용을 상세히 입력해주세요"
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
            Q&A 목록
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

      {/* 이탈 확인 모달 */}
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
              Q&A 목록으로 돌아가시겠습니까?
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
