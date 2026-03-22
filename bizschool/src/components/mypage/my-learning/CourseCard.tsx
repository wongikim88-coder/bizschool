import Link from "next/link";
import { Play } from "lucide-react";
import type { MyCourse } from "@/types";

interface CourseCardProps {
  course: MyCourse;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="flex flex-col">
      {/* Thumbnail */}
      <Link
        href={`/course/${course.id}`}
        className="relative block aspect-video overflow-hidden rounded-lg bg-gray-100"
      >
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <span
          className="absolute inset-0 flex items-center justify-center"
          aria-label="강의 재생"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 transition-colors group-hover:bg-black/70">
            <Play size={20} className="fill-white text-white" />
          </span>
        </span>
      </Link>

      {/* Title */}
      <Link
        href={`/course/${course.id}`}
        className="mt-3 line-clamp-2 text-sm font-medium leading-snug text-[var(--color-dark)] hover:text-[var(--color-primary)]"
      >
        {course.title}
      </Link>

      {/* Progress bar */}
      <div className="mt-3 h-1 w-full rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-[var(--color-primary)]"
          style={{ width: `${course.progressPercent}%` }}
        />
      </div>

      {/* Progress text */}
      <p className="mt-1.5 text-xs text-[var(--color-muted)]">
        {course.completedLessons} / {course.totalLessons}강 ({course.progressPercent}%)
      </p>

      {/* Period */}
      <span className="mt-0.5 text-xs text-[var(--color-muted)]">
        {course.periodLabel}
      </span>
    </div>
  );
}
