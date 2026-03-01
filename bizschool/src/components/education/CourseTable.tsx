import type { EducationCourse } from "@/types";
import { groupByCategory, categoryColors, formatFee } from "@/data/education";
import { Calendar, Clock, Wallet, User, Calculator, Star, Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  "세무회계": Calculator,
  "특강": Star,
  "재산제세(이론)": Building2,
};

interface CourseTableProps {
  courses: EducationCourse[];
}

export default function CourseTable({ courses }: CourseTableProps) {
  if (courses.length === 0) {
    return (
      <div className="mt-12 py-20 text-center">
        <p className="text-lg font-medium text-[var(--color-muted)]">
          해당 월에 예정된 교육과정이 없습니다
        </p>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          다른 월을 선택해 주세요
        </p>
      </div>
    );
  }

  const groups = groupByCategory(courses);

  return (
    <div className="mt-8 space-y-8">
      {groups.map((group, groupIdx) => {
        const iconColor = categoryColors[group.category] ?? "text-gray-400";
        const IconComponent = categoryIcons[group.category];

        return (
          <div key={`${group.category}-${groupIdx}`}>
            {/* 카테고리 헤더 */}
            <div className="flex items-center gap-2 pb-3">
              {IconComponent ? (
                <IconComponent size={18} className={iconColor} />
              ) : (
                <span className={`h-2.5 w-2.5 rounded-full bg-gray-400`} />
              )}
              <h3 className="text-base font-bold text-[var(--color-dark)]">
                {group.category}
              </h3>
            </div>

            {/* Desktop: 테이블 */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full table-fixed text-sm">
                <colgroup>
                  <col className="w-[25%]" />
                  <col className="w-[22%]" />
                  <col className="w-[18%]" />
                  <col className="w-[9%]" />
                  <col className="w-[16%]" />
                  <col className="w-[10%]" />
                </colgroup>
                <thead>
                  <tr className="bg-[var(--color-light-bg)]">
                    <th className="px-4 py-3 text-left font-medium text-[var(--color-muted)]">
                      교육과정명
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                      교육일시
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                      교육시간
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                      교육비
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                      교수
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                      접수
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {group.courses.map((course) => (
                    <tr
                      key={course.id}
                      className="border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-light-bg)]"
                    >
                      <td className="px-4 py-4 font-medium text-[var(--color-dark)]">
                        {course.title}
                      </td>
                      <td className="px-4 py-4 text-center text-[var(--color-body)]">
                        {course.dateRange}
                      </td>
                      <td className="px-4 py-4 text-center text-[var(--color-body)]">
                        {course.timeRange}
                      </td>
                      <td className="px-4 py-4 text-center font-medium text-[var(--color-dark)]">
                        {formatFee(course.fee)}
                      </td>
                      <td className="px-4 py-4 text-center text-[var(--color-body)]">
                        {course.instructor}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {course.status === "open" ? (
                          <button className="rounded-lg bg-[var(--color-primary)] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:opacity-90">
                            수강신청
                          </button>
                        ) : (
                          <button
                            disabled
                            aria-disabled="true"
                            className="cursor-not-allowed rounded-lg bg-gray-200 px-4 py-1.5 text-sm font-medium text-gray-400"
                          >
                            마감
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: 카드 레이아웃 */}
            <div className="space-y-3 md:hidden">
              {group.courses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-xl border border-[var(--color-border)] bg-white p-5"
                >
                  <h4 className="font-medium text-[var(--color-dark)]">
                    {course.title}
                  </h4>
                  <div className="mt-3 space-y-2 text-sm text-[var(--color-body)]">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="shrink-0 text-[var(--color-muted)]" />
                      <span>{course.dateRange}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="shrink-0 text-[var(--color-muted)]" />
                      <span>{course.timeRange}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet size={14} className="shrink-0 text-[var(--color-muted)]" />
                      <span className="font-medium text-[var(--color-dark)]">
                        {formatFee(course.fee)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={14} className="shrink-0 text-[var(--color-muted)]" />
                      <span>{course.instructor}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    {course.status === "open" ? (
                      <button className="w-full rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90">
                        수강신청
                      </button>
                    ) : (
                      <button
                        disabled
                        aria-disabled="true"
                        className="w-full cursor-not-allowed rounded-lg bg-gray-200 py-2.5 text-sm font-medium text-gray-400"
                      >
                        마감
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
