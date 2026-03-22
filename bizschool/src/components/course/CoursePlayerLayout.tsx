"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ListOrdered,
  MessagesSquare,
  FolderDown,
  X,
  Play,
} from "lucide-react";
import type { MyCourse, CoursePlayerTab, CourseSection, CourseMaterial, CourseQna } from "@/types";
import CourseCurriculum from "./CourseCurriculum";
import CourseMaterialList from "./CourseMaterialList";
import CourseQnaPanel from "./CourseQnaPanel";

interface CoursePlayerLayoutProps {
  course: MyCourse;
  sections: CourseSection[];
  materials: CourseMaterial[];
  qnas: CourseQna[];
}

const sidebarTabs: { id: CoursePlayerTab; label: string; icon: typeof ListOrdered }[] = [
  { id: "curriculum", label: "커리큘럼", icon: ListOrdered },
  { id: "materials", label: "강의자료", icon: FolderDown },
  { id: "qna", label: "Q&A", icon: MessagesSquare },
];

const tabLabels: Record<CoursePlayerTab, string> = {
  curriculum: "커리큘럼",
  qna: "Q&A",
  materials: "강의자료",
};

export default function CoursePlayerLayout({
  course,
  sections,
  materials,
  qnas,
}: CoursePlayerLayoutProps) {
  const [activeTab, setActiveTab] = useState<CoursePlayerTab>("curriculum");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Left: header + video (stacked) */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <div className="flex h-14 shrink-0 items-center gap-3 bg-[var(--color-light-bg)] px-4">
          <Link
            href="/mypage?tab=courses"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)] hover:text-[var(--color-dark)]"
            aria-label="내 학습으로 돌아가기"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--color-dark)]">
            {course.title}
          </h1>
        </div>

        {/* Video area - fills remaining height on desktop, aspect-ratio on mobile */}
        <div className="relative aspect-video w-full bg-gray-900 lg:aspect-auto lg:flex-1">
          <div className="flex h-full items-center justify-center">
            <button
              className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
              aria-label="강의 재생"
            >
              <Play size={28} className="ml-1 fill-white text-white" />
            </button>
          </div>
        </div>

        {/* Mobile tabs (shown below video on mobile) */}
        <div className="flex border-b border-[var(--color-border)] bg-[var(--color-light-bg)] lg:hidden">
          {sidebarTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors ${
                  isActive
                    ? "border-b-2 border-[var(--color-primary)] bg-white text-[var(--color-primary)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-dark)]"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile tab content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden lg:hidden">
          <MobileSidebarContent
            activeTab={activeTab}
            course={course}
            sections={sections}
            materials={materials}
            qnas={qnas}
          />
        </div>
      </div>

      {/* Right: full-height sidebar (desktop only) */}
      {sidebarOpen && (
        <div className="hidden w-[460px] shrink-0 overflow-hidden lg:flex">
          {/* Sidebar content panel */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Sidebar header */}
            <div className="flex h-14 shrink-0 items-center justify-between px-4">
              <span className="text-sm font-bold text-[var(--color-dark)]">
                {tabLabels[activeTab]}
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)] hover:text-[var(--color-dark)]"
                aria-label="사이드바 닫기"
              >
                <X size={16} />
              </button>
            </div>

            {/* Course info (curriculum only) */}
            {activeTab === "curriculum" && (
              <div className="border-b border-[var(--color-border)] px-4 py-3">
                <p className="text-sm font-medium leading-snug text-[var(--color-dark)]">
                  {course.title}
                </p>
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  수강 기한: {course.periodLabel}
                </p>
                {/* Progress */}
                <div className="mt-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-[var(--color-muted)]">
                      진도율 {course.completedLessons}/{course.totalLessons}
                    </span>
                    <span className="font-medium text-[var(--color-dark)]">
                      {course.progressPercent}%
                    </span>
                  </div>
                  <div className="mt-1 h-2.5 w-full rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-[var(--color-primary)]"
                      style={{ width: `${course.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab content - scrollable */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              {activeTab === "curriculum" && (
                <CourseCurriculum sections={sections} />
              )}
              {activeTab === "qna" && (
                <CourseQnaPanel courseId={course.id} initialQnas={qnas} />
              )}
              {activeTab === "materials" && (
                <CourseMaterialList materials={materials} />
              )}
            </div>
          </div>

          {/* Vertical icon tabs */}
          <div className="flex w-14 shrink-0 flex-col items-center gap-1 border-l border-[var(--color-border)] bg-[var(--color-light-bg)] pt-2">
            {sidebarTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(true);
                  }}
                  className={`flex w-12 flex-col items-center gap-0.5 rounded-lg px-1 py-2 transition-colors ${
                    isActive
                      ? "bg-white text-[var(--color-primary)] shadow-sm"
                      : "text-[var(--color-muted)] hover:bg-white/60 hover:text-[var(--color-dark)]"
                  }`}
                  aria-label={tab.label}
                >
                  <Icon size={20} />
                  <span className="text-[10px] font-medium leading-tight">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sidebar collapsed: show only icon tabs (desktop) */}
      {!sidebarOpen && (
        <div className="hidden w-14 shrink-0 flex-col items-center gap-1 border-l border-[var(--color-border)] bg-[var(--color-light-bg)] pt-2 lg:flex">
          {sidebarTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(true);
                }}
                className="flex w-12 flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[var(--color-muted)] transition-colors hover:bg-white/60 hover:text-[var(--color-dark)]"
                aria-label={tab.label}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium leading-tight">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Mobile sidebar content (reuses same tab switching) */
function MobileSidebarContent({
  activeTab,
  course,
  sections,
  materials,
  qnas,
}: {
  activeTab: CoursePlayerTab;
  course: MyCourse;
  sections: CourseSection[];
  materials: CourseMaterial[];
  qnas: CourseQna[];
}) {
  return (
    <>
      {/* Course info (curriculum only) */}
      {activeTab === "curriculum" && (
        <div className="border-b border-[var(--color-border)] px-4 py-3">
          <p className="text-sm font-medium leading-snug text-[var(--color-dark)]">
            {course.title}
          </p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            수강 기한: {course.periodLabel}
          </p>
          <div className="mt-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-[var(--color-muted)]">
                진도율 {course.completedLessons}/{course.totalLessons}
              </span>
              <span className="font-medium text-[var(--color-dark)]">
                {course.progressPercent}%
              </span>
            </div>
            <div className="mt-1 h-2.5 w-full rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-[var(--color-primary)]"
                style={{ width: `${course.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab content */}
      {activeTab === "curriculum" && <CourseCurriculum sections={sections} />}
      {activeTab === "qna" && (
        <CourseQnaPanel courseId={course.id} initialQnas={qnas} />
      )}
      {activeTab === "materials" && <CourseMaterialList materials={materials} />}
    </>
  );
}
