import MainBanner from "@/components/sections/MainBanner";
import CourseCard from "@/components/cards/CourseCard";
import { sampleCourses } from "@/data/courses";

export default function Home() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-12">
      <MainBanner />

      <section className="mt-8">
        <h2 className="text-xl font-bold text-[var(--color-dark)]">전체 강의</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          총 {sampleCourses.length}개의 강의
        </p>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sampleCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
