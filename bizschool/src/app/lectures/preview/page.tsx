"use client";

import { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import type { LectureDetail } from "@/types";
import LectureDetailContent from "@/components/lectures/LectureDetailContent";

export default function LecturePreviewPage() {
  const [lecture, setLecture] = useState<LectureDetail | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("lecture-preview");
      if (!raw) {
        setError(true);
        return;
      }
      const data = JSON.parse(raw) as LectureDetail;
      setLecture(data);
    } catch {
      setError(true);
    }
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-medium text-[var(--color-dark)]">
          미리보기 데이터가 없습니다.
        </p>
        <p className="text-sm text-[var(--color-muted)]">
          강의 업로드 페이지에서 미리보기 버튼을 클릭해주세요.
        </p>
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <>
      {/* 미리보기 모드 배너 */}
      <div className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-amber-50 border-b border-amber-200 px-4 py-2.5">
        <Eye size={16} className="text-amber-600" />
        <span className="text-sm font-medium text-amber-700">
          미리보기 모드 — 실제 발행 전 확인용입니다.
        </span>
        <button
          type="button"
          onClick={() => window.close()}
          className="ml-2 flex cursor-pointer items-center gap-1 rounded-md border border-amber-300 bg-white px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-50"
        >
          <X size={12} />
          닫기
        </button>
      </div>
      <LectureDetailContent lecture={lecture} />
    </>
  );
}
