"use client";

import { useState } from "react";
import { ChevronDown, CheckCircle2, Circle, PlayCircle } from "lucide-react";
import type { CourseSection } from "@/types";

interface CourseCurriculumProps {
  sections: CourseSection[];
}

export default function CourseCurriculum({ sections }: CourseCurriculumProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(sections.map((s) => s.id))
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-[var(--color-muted)]">커리큘럼 정보가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[var(--color-border)]">
      {sections.map((section) => {
        const isExpanded = expandedSections.has(section.id);
        const completedCount = section.lessons.filter((l) => l.isCompleted).length;
        const totalCount = section.lessons.length;

        return (
          <div key={section.id}>
            {/* Section header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-[var(--color-light-bg)]"
            >
              <ChevronDown
                size={16}
                className={`shrink-0 text-[var(--color-muted)] transition-transform ${
                  isExpanded ? "" : "-rotate-90"
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--color-dark)]">
                  {section.title}
                </p>
                <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                  {totalCount}강 · {section.totalDuration}
                  {completedCount > 0 && (
                    <span className="ml-2 text-[var(--color-primary)]">
                      ({completedCount}/{totalCount} 완료)
                    </span>
                  )}
                </p>
              </div>
            </button>

            {/* Lessons */}
            {isExpanded && (
              <div className="pb-2">
                {section.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[var(--color-light-bg)]"
                  >
                    {lesson.isCompleted ? (
                      <CheckCircle2
                        size={18}
                        className="shrink-0 text-[var(--color-primary)]"
                      />
                    ) : (
                      <Circle
                        size={18}
                        className="shrink-0 text-[var(--color-border)]"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm ${
                          lesson.isCompleted
                            ? "text-[var(--color-muted)]"
                            : "text-[var(--color-body)]"
                        }`}
                      >
                        {lesson.title}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-[var(--color-muted)]">
                      {lesson.duration}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
