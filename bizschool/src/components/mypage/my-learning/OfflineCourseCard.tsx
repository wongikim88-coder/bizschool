import {
  CalendarDays,
  Clock,
  MapPin,
  User,
} from "lucide-react";
import type { MyOfflineCourse, OfflineCourseStatus } from "@/types";
import AttendanceStatus from "./AttendanceStatus";

/* ── Status label ──────────────────────────────────────────── */

function statusStyle(status: OfflineCourseStatus): string {
  if (status === "수강 중") return "border-[var(--color-dark)] text-[var(--color-dark)]";
  if (status === "수강완료") return "border-[var(--color-primary)] text-[var(--color-primary)]";
  return "border-[var(--color-muted)] text-[var(--color-muted)]";
}

function StatusLabel({ status }: { status: OfflineCourseStatus }) {
  return (
    <span className={`inline-block self-start rounded-full border px-3 py-0.5 text-xs font-medium ${statusStyle(status)}`}>
      {status}
    </span>
  );
}

/* ── Main card ─────────────────────────────────────────────── */

interface OfflineCourseCardProps {
  course: MyOfflineCourse;
}

export default function OfflineCourseCard({ course }: OfflineCourseCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 transition-shadow hover:shadow-sm">
      {/* Top: badge + title + instructor */}
      <div className="flex flex-col gap-2">
        <StatusLabel status={course.status} />
        <h4 className="line-clamp-2 text-sm font-medium leading-snug text-[var(--color-dark)]">
          {course.title}
        </h4>
        {course.instructorName && (
          <div className="flex items-center gap-1 text-xs text-[var(--color-muted)]">
            <User size={12} />
            {course.instructorName} 강사
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-[var(--color-border)]" />

      {/* Logistics */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-[var(--color-body)]">
          <CalendarDays size={13} className="shrink-0 text-[var(--color-muted)]" />
          {course.dateRangeLabel}
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-body)]">
          <Clock size={13} className="shrink-0 text-[var(--color-muted)]" />
          {course.timeLabel}
        </div>
        <div className="flex items-start gap-2 text-xs text-[var(--color-body)]">
          <MapPin size={13} className="mt-0.5 shrink-0 text-[var(--color-muted)]" />
          <span className="line-clamp-2">{course.venue.name}</span>
        </div>
      </div>

      {/* Session count for pre-start courses */}
      {course.status === "수강 전" && course.sessions && course.sessions.length > 1 && (
        <p className="mt-3 text-xs text-[var(--color-muted)]">
          총 {course.sessions.length}회 과정
        </p>
      )}

      {/* Attendance status */}
      <AttendanceStatus course={course} />

      {/* Government training info */}
      {course.governmentTraining && (
        <div className="mt-3 rounded-lg bg-[var(--color-light-bg)] px-3 py-2">
          <p className="text-xs text-[var(--color-muted)]">
            훈련기관: {course.governmentTraining.trainingOrg}
          </p>
          <p className="mt-0.5 text-xs text-[var(--color-muted)]">
            과정번호: {course.governmentTraining.courseCode}
          </p>
          <p className="mt-0.5 text-xs text-[var(--color-muted)]">
            자부담: {course.governmentTraining.selfPayAmount.toLocaleString()}원
          </p>
        </div>
      )}
    </div>
  );
}
