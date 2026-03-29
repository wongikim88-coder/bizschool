"use client";

import { useState, useEffect, useCallback } from "react";
import type { MyCourse, CourseSection } from "@/types";
import CoursePlayerLayout from "@/components/course/CoursePlayerLayout";

interface CoursePreviewData {
  course: MyCourse;
  sections: CourseSection[];
}

export default function CoursePreviewPage() {
  const [data, setData] = useState<CoursePreviewData | null>(null);
  const [error, setError] = useState(false);

  const loadPreview = useCallback(() => {
    try {
      const raw = localStorage.getItem("course-preview");
      if (!raw) {
        setError(true);
        return;
      }
      setData(JSON.parse(raw) as CoursePreviewData);
      setError(false);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    loadPreview();

    const channel = new BroadcastChannel("lecture-preview");
    channel.onmessage = (e) => {
      if (e.data?.type === "lecture-preview-update") loadPreview();
    };
    return () => channel.close();
  }, [loadPreview]);

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

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <CoursePlayerLayout
      course={data.course}
      sections={data.sections}
      materials={[]}
      qnas={[]}
      backHref="/lectures/preview"
    />
  );
}
