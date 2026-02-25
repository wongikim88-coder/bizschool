import { Star, Users } from "lucide-react";
import type { Course } from "@/types";

const badgeStyles: Record<string, string> = {
  primary: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
  green: "bg-emerald-50 text-emerald-600",
  red: "bg-red-50 text-red-500",
  blue: "bg-blue-50 text-blue-500",
  gray: "bg-gray-100 text-gray-600",
};

export default function CourseCard({ course }: { course: Course }) {
  const hasDiscount = course.originalPrice && course.discountRate;

  return (
    <article className="group cursor-pointer">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-dark-navy)]/30 transition-all group-hover:brightness-95">
          <span className="text-xs font-medium text-white/80">
            {course.title.slice(0, 8)}...
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-[var(--color-dark)]">
          {course.title}
        </h3>

        <p className="mt-1 text-sm text-[var(--color-muted)]">{course.instructor}</p>

        {/* Price */}
        <div className="mt-2">
          {hasDiscount ? (
            <>
              <span className="text-sm text-[var(--color-muted)] line-through">
                ₩{course.originalPrice!.toLocaleString()}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[var(--color-red)]">
                  {course.discountRate}%
                </span>
                <span className="font-bold text-[var(--color-dark)]">
                  ₩{course.price.toLocaleString()}
                </span>
              </div>
            </>
          ) : (
            <span className="font-bold text-[var(--color-dark)]">
              ₩{course.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="mt-2 flex items-center gap-3 text-sm text-[var(--color-muted)]">
          <span className="flex items-center gap-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            {course.rating}
            <span className="text-xs">({course.reviewCount})</span>
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} />
            {course.studentCount.toLocaleString()}+
          </span>
        </div>

        {/* Badges */}
        {course.badges && course.badges.length > 0 && (
          <div className="mt-2 flex gap-1.5">
            {course.badges.map((badge) => (
              <span
                key={badge.label}
                className={`rounded px-2 py-0.5 text-xs font-medium ${badgeStyles[badge.variant] || badgeStyles.gray}`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
