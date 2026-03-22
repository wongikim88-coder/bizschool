"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ListOrdered,
  MessageCircleQuestion,
  FolderDown,
  X,
  SkipBack,
  SkipForward,
  Check,
  Play,
} from "lucide-react";
import type { MyCourse, CoursePlayerTab, CourseSection, CourseMaterial } from "@/types";
import CourseCurriculum from "./CourseCurriculum";
import CourseMaterialList from "./CourseMaterialList";

interface CoursePlayerLayoutProps {
  course: MyCourse;
  sections: CourseSection[];
  materials: CourseMaterial[];
}

const sidebarTabs: { id: CoursePlayerTab; label: string; icon: typeof ListOrdered }[] = [
  { id: "curriculum", label: "커리큘럼", icon: ListOrdered },
  { id: "qna", label: "Q&A", icon: MessageCircleQuestion },
  { id: "materials", label: "강의자료", icon: FolderDown },
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
}: CoursePlayerLayoutProps) {
  const [activeTab, setActiveTab] = useState<CoursePlayerTab>("curriculum");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      {/* Top bar */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--color-border)] bg-white px-4">
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

      {/* Main content */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Video area */}
        <div className="flex flex-1 flex-col">
          {/* Video player placeholder */}
          <div className="relative aspect-video w-full bg-gray-900 lg:aspect-auto lg:flex-1">
            <div className="flex h-full items-center justify-center">
              <button
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
                aria-label="강의 재생"
              >
                <Play size={28} className="ml-1 fill-white text-white" />
              </button>
            </div>
            {/* Lesson title overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
              <p className="text-sm text-white/90">강의 영상 영역</p>
            </div>
          </div>

          {/* Bottom nav */}
          <div className="flex h-12 shrink-0 items-center justify-center gap-3 border-t border-[var(--color-border)] bg-white px-4">
            <button className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)] hover:text-[var(--color-dark)]">
              <SkipBack size={16} />
              <span>이전</span>
            </button>
            <button className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)] hover:text-[var(--color-dark)]">
              <span>다음</span>
              <SkipForward size={16} />
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-white">
              <Check size={16} />
              <span>봤어요</span>
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
          />
        </div>

        {/* Desktop sidebar */}
        {sidebarOpen && (
          <div className="hidden w-[380px] shrink-0 overflow-hidden border-l border-[var(--color-border)] lg:flex">
            {/* Sidebar content panel */}
            <div className="flex min-w-0 flex-1 flex-col">
              {/* Sidebar header */}
              <div className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--color-border)] px-4">
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

              {/* Course info */}
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
                    <span className="flex items-center gap-1 text-[var(--color-primary)]">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                      진도율 {course.completedLessons}/{course.totalLessons}
                    </span>
                    <span className="font-medium text-[var(--color-dark)]">
                      {course.progressPercent}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{ width: `${course.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Tab content - scrollable */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                {activeTab === "curriculum" && (
                  <CourseCurriculum sections={sections} />
                )}
                {activeTab === "qna" && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <MessageCircleQuestion size={40} className="text-[var(--color-border)]" />
                    <p className="mt-3 text-sm font-medium text-[var(--color-muted)]">
                      Q&A 기능 준비 중
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      마이페이지 &gt; 내 학습 &gt; 강의 Q&A에서
                      <br />
                      질문을 등록할 수 있습니다.
                    </p>
                  </div>
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

        {/* Sidebar collapsed: show only icon tabs */}
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
    </div>
  );
}

/** Mobile sidebar content (reuses same tab switching) */
function MobileSidebarContent({
  activeTab,
  course,
  sections,
  materials,
}: {
  activeTab: CoursePlayerTab;
  course: MyCourse;
  sections: CourseSection[];
  materials: CourseMaterial[];
}) {
  return (
    <>
      {/* Course info */}
      <div className="border-b border-[var(--color-border)] px-4 py-3">
        <p className="text-sm font-medium leading-snug text-[var(--color-dark)]">
          {course.title}
        </p>
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          수강 기한: {course.periodLabel}
        </p>
        <div className="mt-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-[var(--color-primary)]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
              진도율 {course.completedLessons}/{course.totalLessons}
            </span>
            <span className="font-medium text-[var(--color-dark)]">
              {course.progressPercent}%
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-green-500"
              style={{ width: `${course.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "curriculum" && <CourseCurriculum sections={sections} />}
      {activeTab === "qna" && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MessageCircleQuestion size={40} className="text-[var(--color-border)]" />
          <p className="mt-3 text-sm font-medium text-[var(--color-muted)]">
            Q&A 기능 준비 중
          </p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            마이페이지 &gt; 내 학습 &gt; 강의 Q&A에서
            <br />
            질문을 등록할 수 있습니다.
          </p>
        </div>
      )}
      {activeTab === "materials" && <CourseMaterialList materials={materials} />}
    </>
  );
}
