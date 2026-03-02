"use client";

import { useState, Suspense } from "react";
import type { EducationCourse } from "@/types";
import ProgramGuide from "./ProgramGuide";
import CourseIntro from "./CourseIntro";
import TrainingMonthSelector from "./TrainingMonthSelector";
import CourseTable from "@/components/education/CourseTable";

type TrainingTab = "guide" | "course";

const tabs: { key: TrainingTab; label: string }[] = [
  { key: "guide", label: "중소기업 근로자 주도훈련" },
  { key: "course", label: "과정소개 및 교육일정" },
];

interface TrainingPageContentProps {
  currentYear: number;
  currentMonth: number;
  filteredCourses: EducationCourse[];
}

export default function TrainingPageContent({
  currentYear,
  currentMonth,
  filteredCourses,
}: TrainingPageContentProps) {
  const [activeTab, setActiveTab] = useState<TrainingTab>("guide");

  return (
    <div>
      {/* 탭 네비게이션 */}
      <div className="mx-auto max-w-[1200px] px-4">
        <div
          role="tablist"
          className="flex overflow-x-auto border-b border-[var(--color-border)]"
          style={{ scrollbarWidth: "none" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 whitespace-nowrap px-6 py-3 text-[15px] transition-colors ${
                activeTab === tab.key
                  ? "border-b-2 border-[var(--color-primary)] font-bold text-[var(--color-primary)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-body)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === "guide" && <ProgramGuide />}

      {activeTab === "course" && (
        <>
          <CourseIntro />
          <div className="mx-auto max-w-[1200px] px-4 pb-16">
            <h2 className="mt-16 text-center text-xl font-bold text-[var(--color-dark)] md:mt-24 md:text-2xl">
              교육일정
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-[var(--color-muted)] md:text-base">
              월별 근로자 주도훈련 교육일정을 확인하고 수강신청하세요.
            </p>
            <Suspense>
              <TrainingMonthSelector
                currentYear={currentYear}
                currentMonth={currentMonth}
              />
            </Suspense>
            <CourseTable courses={filteredCourses} />
          </div>
        </>
      )}
    </div>
  );
}
