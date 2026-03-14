"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { MyCourse, CourseGroupType } from "@/types";
import { mockMyCourses } from "@/data/mypage";

const sectionConfig: {
  key: CourseGroupType;
  title: string;
  showInsurance: boolean;
  emptyText: string;
}[] = [
  {
    key: "online",
    title: "나의 온라인 강의실",
    showInsurance: false,
    emptyText: "수강중인 온라인 과정이 없습니다.",
  },
  {
    key: "public",
    title: "나의 강의실",
    showInsurance: true,
    emptyText: "수강중인 과정이 없습니다.",
  },
  {
    key: "completed",
    title: "이수과정",
    showInsurance: true,
    emptyText: "수강종료 과정이 없습니다.",
  },
];

function PaymentBadge({ status }: { status: "결제완료" | "미결제" }) {
  if (status === "결제완료") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
        결제완료
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600">
      미결제
    </span>
  );
}

function InsuranceBadge({ value }: { value?: boolean }) {
  if (value) {
    return (
      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
        해당
      </span>
    );
  }
  return (
    <span className="text-sm text-[var(--color-muted)]">해당없음</span>
  );
}

function CourseAccordion({
  title,
  courses,
  showInsurance,
  emptyText,
  isOpen,
  onToggle,
}: {
  title: string;
  courses: MyCourse[];
  showInsurance: boolean;
  emptyText: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
      {/* Header */}
      <button
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center gap-2 bg-[var(--color-light-bg)] px-5 py-3.5 text-left transition-colors hover:bg-gray-100"
      >
        <ChevronRight
          size={18}
          className={`shrink-0 text-[var(--color-primary)] transition-transform duration-200 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
        <span className="font-bold text-[var(--color-dark)]">{title}</span>
      </button>

      {/* Body */}
      {isOpen && (
        <div>
          {courses.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-[var(--color-muted)]">{emptyText}</p>
            </div>
          ) : (
            <>
              {/* Desktop: Table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full table-fixed text-sm">
                  <colgroup>
                    {showInsurance ? (
                      <>
                        <col className="w-[40%]" />
                        <col className="w-[25%]" />
                        <col className="w-[20%]" />
                        <col className="w-[15%]" />
                      </>
                    ) : (
                      <>
                        <col className="w-[50%]" />
                        <col className="w-[30%]" />
                        <col className="w-[20%]" />
                      </>
                    )}
                  </colgroup>
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-light-bg)]">
                      <th className="px-5 py-3 text-center font-medium text-[var(--color-muted)]">
                        강좌명
                      </th>
                      <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                        수강기간
                      </th>
                      {showInsurance && (
                        <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                          고용보험 환급과정 여부
                        </th>
                      )}
                      <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                        결제여부
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr
                        key={course.id}
                        className="border-b border-[var(--color-border)] last:border-0"
                      >
                        <td className="px-5 py-4 font-medium text-[var(--color-dark)]">
                          {course.title}
                        </td>
                        <td className="px-4 py-4 text-center text-[var(--color-body)]">
                          {course.periodStart} ~ {course.periodEnd}
                        </td>
                        {showInsurance && (
                          <td className="px-4 py-4 text-center">
                            <InsuranceBadge value={course.isInsuranceRefund} />
                          </td>
                        )}
                        <td className="px-4 py-4 text-center">
                          <PaymentBadge status={course.paymentStatus} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile: Cards */}
              <div className="space-y-3 p-4 md:hidden">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="rounded-xl border border-[var(--color-border)] bg-white p-4"
                  >
                    <h4 className="font-medium text-[var(--color-dark)]">
                      {course.title}
                    </h4>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      {course.periodStart} ~ {course.periodEnd}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <PaymentBadge status={course.paymentStatus} />
                      {showInsurance && (
                        <InsuranceBadge value={course.isInsuranceRefund} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function CoursesSection() {
  const [openGroups, setOpenGroups] = useState<
    Record<CourseGroupType, boolean>
  >({
    online: true,
    public: true,
    completed: true,
  });

  const toggle = (key: CourseGroupType) =>
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-4">
      {sectionConfig.map((section) => {
        const courses = mockMyCourses.filter(
          (c) => c.groupType === section.key
        );
        return (
          <CourseAccordion
            key={section.key}
            title={section.title}
            courses={courses}
            showInsurance={section.showInsurance}
            emptyText={section.emptyText}
            isOpen={openGroups[section.key]}
            onToggle={() => toggle(section.key)}
          />
        );
      })}
    </div>
  );
}
