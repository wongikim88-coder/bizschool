"use client";

import { useMemo, useState, useRef } from "react";
import { X } from "lucide-react";
import type { CertificateCourse } from "@/types";
import { mockMyCourses, mockMyOfflineCourses, mockUser } from "@/data/mypage";
import CertificateRow from "./CertificateRow";

export default function CertificateSection() {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const completedCourses = useMemo<CertificateCourse[]>(() => {
    const onlineCourses: CertificateCourse[] = mockMyCourses
      .filter((c) => c.learningStatus === "수강완료")
      .map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        instructorName: c.instructorName,
        periodLabel: c.periodLabel,
        thumbnailUrl: c.thumbnailUrl,
      }));

    const offlineCourses: CertificateCourse[] = mockMyOfflineCourses
      .filter((c) => c.status === "수강완료")
      .map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        instructorName: c.instructorName,
        periodLabel: c.dateRangeLabel,
        thumbnailUrl: "/images/courses/course-1.jpg",
      }));

    return [...onlineCourses, ...offlineCourses];
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setShowModal(false);
    }
  };

  if (completedCourses.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-[var(--color-muted)]">
          수강완료한 강의가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="flex items-center justify-between py-3">
        <p className="text-sm text-[var(--color-body)]">
          전체{" "}
          <span className="font-semibold text-[var(--color-primary)]">
            {completedCourses.length}
          </span>
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="cursor-pointer text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-dark)]"
        >
          수료증 ⓘ
        </button>
      </div>

      {/* List */}
      <div className="divide-y divide-[var(--color-border)]">
        {completedCourses.map((course) => (
          <CertificateRow
            key={course.id}
            course={course}
            userName={mockUser.name}
          />
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={handleBackdropClick}
        >
          <div
            ref={modalRef}
            className="relative mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
          >
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 cursor-pointer rounded-lg p-1 transition-colors hover:bg-gray-100"
              aria-label="닫기"
            >
              <X size={20} className="text-[var(--color-muted)]" />
            </button>

            {/* Title */}
            <h3 className="text-lg font-bold text-[var(--color-dark)]">
              수료증 안내
            </h3>

            {/* Description */}
            <ul className="mt-4 ml-4 list-disc space-y-2 text-sm leading-relaxed text-[var(--color-body)]">
              <li>수강완료한 강의에 한하여 수료증을 발급받으실 수 있습니다.</li>
              <li>다운로드 버튼을 클릭하시면 PDF 형태의 수료증이 자동으로 생성되어 다운로드됩니다.</li>
              <li>수료증에는 수료자명, 교육과정명, 교육기간, 발급일자가 포함됩니다.</li>
            </ul>

            {/* Certificate Sample */}
            <div className="mt-5 overflow-hidden rounded-lg border border-[var(--color-border)] bg-gray-50 p-4">
              <p className="mb-3 text-xs font-medium text-[var(--color-muted)]">
                수료증 샘플
              </p>
              <div className="relative flex flex-col items-center rounded-lg bg-white px-6 py-8 shadow-sm">
                <span className="absolute left-3 top-3 rounded bg-black px-2 py-0.5 text-[10px] font-bold text-white">
                  예시
                </span>
                <span className="text-xl font-bold tracking-[0.4em] text-[var(--color-dark)]">
                  수 료 증
                </span>
                <span className="mt-1 text-[10px] tracking-[0.2em] text-[var(--color-muted)]">
                  CERTIFICATE
                </span>
                <div className="my-4 h-px w-3/4 bg-[var(--color-border)]" />
                <span className="text-sm font-semibold text-[var(--color-dark)]">
                  성명: 홍길동
                </span>
                <span className="mt-2 text-xs text-[var(--color-body)]">
                  위 사람은 다음 교육과정을 수료하였기에
                </span>
                <span className="text-xs text-[var(--color-body)]">
                  이 증서를 수여합니다.
                </span>
                <div className="my-4 h-px w-3/4 bg-[var(--color-border)]" />
                <div className="space-y-0.5 text-[11px] text-[var(--color-muted)]">
                  <p>교육과정명: OOO 실무 과정</p>
                  <p>교육기간: 2026.01.01 ~ 2026.03.31</p>
                  <p>발급일자: 2026년 03월 21일</p>
                </div>
                <div className="my-3 h-px w-3/4 bg-[var(--color-border)]" />
                <span className="text-sm font-bold text-[var(--color-primary)]">
                  BIZSCHOOL
                </span>
                <span className="text-[10px] text-[var(--color-muted)]">
                  더존비즈스쿨 평생교육원
                </span>
              </div>
            </div>

            {/* Close action */}
            <button
              onClick={() => setShowModal(false)}
              className="mt-5 w-full cursor-pointer rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
