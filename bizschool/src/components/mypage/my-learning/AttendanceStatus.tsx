import type { MyOfflineCourse, CourseSession, AttendanceStatus as AttendanceStatusType } from "@/types";

/* ── Helpers ──────────────────────────────────────────────── */

function dotColor(attendance: AttendanceStatusType): string {
  if (attendance === "출석") return "bg-[var(--color-primary)]";
  if (attendance === "결석") return "bg-red-500";
  return "bg-gray-300"; // 미진행
}

/* ── Dot sequence ─────────────────────────────────────────── */

function DotSequence({ sessions }: { sessions: CourseSession[] }) {
  const attended = sessions.filter((s) => s.attendance === "출석").length;
  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`총 ${sessions.length}회 중 ${attended}회 출석`}
    >
      {sessions.map((s, i) => (
        <span
          key={i}
          title={`${s.label} · ${s.attendance}`}
          className={`inline-block h-2.5 w-2.5 rounded-full ${dotColor(s.attendance)}`}
        />
      ))}
      <span className="ml-1 text-xs text-[var(--color-muted)]">
        {attended}/{sessions.length}회 출석
      </span>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────── */

interface AttendanceStatusProps {
  course: MyOfflineCourse;
}

export default function AttendanceStatus({ course }: AttendanceStatusProps) {
  const { sessions, status } = course;

  if (!sessions || sessions.length <= 1) return null;
  if (status === "수강 전") return null;

  return (
    <div className="mt-3">
      <DotSequence sessions={sessions} />
    </div>
  );
}
