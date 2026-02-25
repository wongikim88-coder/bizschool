import Link from "next/link";
import { ChevronRight } from "lucide-react";
import CourseCard from "@/components/cards/CourseCard";
import type { Course } from "@/types";

export default function RecommendedCourses({ courses }: { courses: Course[] }) {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-12">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--color-dark-navy)]">추천강의</h2>
        <Link
          href="/courses"
          className="flex items-center gap-1 text-sm font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)]"
        >
          더보기
          <ChevronRight size={16} />
        </Link>
      </div>

      {/* Card Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {courses.slice(0, 4).map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
