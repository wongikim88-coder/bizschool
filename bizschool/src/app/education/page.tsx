import { Suspense } from "react";
import type { Metadata } from "next";
import { educationCourses, DEFAULT_PAGE } from "@/data/education";
import MonthSelector from "@/components/education/MonthSelector";
import CourseTable from "@/components/education/CourseTable";

export const metadata: Metadata = {
  title: "공개교육 | BIZSCHOOL",
  description:
    "월별 공개교육 일정을 확인하고 수강신청하세요. 세무회계, 재산제세, 특강 등 전문가 교육과정을 제공합니다.",
};

interface EducationPageProps {
  searchParams: Promise<{
    year?: string;
    month?: string;
    search?: string;
  }>;
}

export default async function EducationPage({ searchParams }: EducationPageProps) {
  const params = await searchParams;
  const now = new Date();
  const fallbackYear = DEFAULT_PAGE?.year ?? now.getFullYear();
  const fallbackMonth = DEFAULT_PAGE?.month ?? (now.getMonth() + 1);
  const year = Number(params.year) || fallbackYear;
  const month = Number(params.month) || fallbackMonth;
  const search = params.search || "";

  // 필터링: 현재는 모든 Mock 데이터가 2026년 4월이므로 해당 조건만 표시
  let filtered = educationCourses.filter((course) => {
    // dateRange에서 연월 추출하여 매칭
    const matchYear = course.dateRange.includes(String(year));
    const monthStr = String(month).padStart(2, "0");
    const matchMonth = course.dateRange.includes(`-${monthStr}-`) || course.dateRange.includes(`-${monthStr}(`);
    return matchYear && matchMonth;
  });

  // 검색 필터
  if (search) {
    const query = search.toLowerCase();
    filtered = filtered.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query)
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#155dfc] to-[#0d3b9e] px-8 py-16 text-center md:px-16 md:py-24 lg:py-28">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 right-20 h-40 w-40 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute left-1/3 top-0 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
            공개교육
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            세무실무 전문가들의 교육과정을 만나보세요.
            <br />
            월별 교육일정을 확인하고 수강신청할 수 있습니다.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-[1200px] px-4 pb-16">
        <Suspense>
          <MonthSelector currentYear={year} currentMonth={month} />
        </Suspense>

        <CourseTable courses={filtered} />
      </div>
    </div>
  );
}
