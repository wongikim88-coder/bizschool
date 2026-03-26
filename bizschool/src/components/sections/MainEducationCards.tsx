import Link from "next/link";
import { Calendar, User, Wallet } from "lucide-react";
import { educationCourses, categoryColors, formatFee } from "@/data/education";

export default function MainEducationCards() {
  const courses = educationCourses.slice(0, 4);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#155dfc] to-[#0d3b9e] px-4 py-12 md:py-16">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-10 right-20 h-40 w-40 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute left-1/3 top-0 h-32 w-32 rounded-full bg-white/5" />

      <div className="relative z-10 mx-auto max-w-[1440px]">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              현장 강의 일정
            </h2>
            <p className="mt-2 text-sm text-white/60 md:text-base">
              전문가와 함께하는 현장 교육과정을 확인하세요
            </p>
          </div>
          <Link
            href="/education"
            className="hidden rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:block"
          >
            전체 일정 보기
          </Link>
        </div>

        {/* Card Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <Link
              key={course.id}
              href="/education"
              className="group rounded-xl bg-white/10 p-5 backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <span
                className={`inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold ${
                  categoryColors[course.category]
                    ? "text-white"
                    : "text-white/80"
                }`}
              >
                {course.category}
              </span>

              <h3 className="mt-3 line-clamp-2 text-[15px] font-bold leading-snug text-white">
                {course.title}
              </h3>

              <div className="mt-4 space-y-2 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="shrink-0" />
                  <span className="truncate">{course.dateRange}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={14} className="shrink-0" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet size={14} className="shrink-0" />
                  <span className="font-medium text-white/80">
                    {formatFee(course.fee)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile: 전체 일정 보기 */}
        <div className="mt-6 sm:hidden">
          <Link
            href="/education"
            className="block rounded-lg border border-white/20 py-3 text-center text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            전체 일정 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
