import { Suspense } from "react";
import type { Metadata } from "next";
import { trainingCourses, DEFAULT_PAGE } from "@/data/training";
import ProgramGuide from "@/components/training/ProgramGuide";
import CourseIntro from "@/components/training/CourseIntro";
import TrainingMonthSelector from "@/components/training/TrainingMonthSelector";
import CourseTable from "@/components/education/CourseTable";

export const metadata: Metadata = {
  title: "근로자 주도훈련 | BIZSCHOOL",
  description:
    "중소기업 근로자 주도훈련 90% 환급 프로그램. 과정소개 및 교육일정을 확인하세요.",
};

interface TrainingPageProps {
  searchParams: Promise<{
    year?: string;
    month?: string;
  }>;
}

export default async function TrainingPage({
  searchParams,
}: TrainingPageProps) {
  const params = await searchParams;
  const now = new Date();
  const fallbackYear = DEFAULT_PAGE?.year ?? now.getFullYear();
  const fallbackMonth = DEFAULT_PAGE?.month ?? now.getMonth() + 1;
  const year = Number(params.year) || fallbackYear;
  const month = Number(params.month) || fallbackMonth;

  const filtered = trainingCourses.filter((course) => {
    const matchYear = course.dateRange.includes(String(year));
    const monthStr = String(month).padStart(2, "0");
    const matchMonth =
      course.dateRange.includes(`-${monthStr}-`) ||
      course.dateRange.includes(`-${monthStr}(`);
    return matchYear && matchMonth;
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#155dfc] to-[#0d3b9e] px-8 py-16 text-center md:px-16 md:py-24 lg:py-28">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 right-20 h-40 w-40 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute left-1/3 top-0 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
            근로자 주도훈련
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            사업주가 부담한 훈련비의 90%까지 환급받을 수 있는
            <br />
            중소기업 근로자 주도훈련 프로그램입니다.
          </p>
        </div>
      </section>

      {/* Section 2: 프로그램 안내 */}
      <ProgramGuide />

      {/* Section 3: 과정소개 */}
      <CourseIntro />

      {/* Section 4: 교육일정 */}
      <div className="mx-auto max-w-[1200px] px-4 pb-16">
        <h2 className="mt-16 text-center text-xl font-bold text-[var(--color-dark)] md:mt-24 md:text-2xl">
          교육일정
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-[var(--color-muted)] md:text-base">
          월별 근로자 주도훈련 교육일정을 확인하고 수강신청하세요.
        </p>

        <Suspense>
          <TrainingMonthSelector
            currentYear={year}
            currentMonth={month}
          />
        </Suspense>

        <CourseTable courses={filtered} />
      </div>
    </div>
  );
}
