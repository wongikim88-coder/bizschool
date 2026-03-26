"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Users,
  AlertTriangle,
} from "lucide-react";
import type { ExpertCourse, ExpertCourseStatus } from "@/types";
import { expertCourses as initialCourses, formatKRW } from "@/data/expertStudio";

const statusConfig: Record<
  ExpertCourseStatus,
  { label: string; bg: string; text: string }
> = {
  draft: { label: "초안", bg: "bg-gray-100", text: "text-gray-600" },
  under_review: { label: "검토중", bg: "bg-blue-50", text: "text-blue-600" },
  published: { label: "게시됨", bg: "bg-green-50", text: "text-green-600" },
  rejected: { label: "반려됨", bg: "bg-red-50", text: "text-red-500" },
};

export default function StudioCourses() {
  const [courses, setCourses] = useState<ExpertCourse[]>(initialCourses);
  const [statusFilter, setStatusFilter] = useState<"all" | ExpertCourseStatus>(
    "all"
  );

  const filtered =
    statusFilter === "all"
      ? courses
      : courses.filter((c) => c.status === statusFilter);

  const handleDelete = (id: string) => {
    if (window.confirm("이 강의를 삭제하시겠습니까?")) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | ExpertCourseStatus)
            }
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-body)]"
          >
            <option value="all">전체 상태</option>
            <option value="published">게시됨</option>
            <option value="under_review">검토중</option>
            <option value="draft">초안</option>
            <option value="rejected">반려됨</option>
          </select>
          <span className="text-sm text-[var(--color-muted)]">
            총 {filtered.length}개
          </span>
        </div>
        <Link
          href="/expert/upload"
          className="flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
        >
          <Plus size={16} />
          강의 등록
        </Link>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-xl border border-[var(--color-border)] bg-white md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-light-bg)]">
              <th className="px-4 py-3 text-left font-medium text-[var(--color-muted)]">
                강의명
              </th>
              <th className="w-[90px] px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                상태
              </th>
              <th className="w-[80px] px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                수강생
              </th>
              <th className="w-[70px] px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                평점
              </th>
              <th className="w-[80px] px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                완료율
              </th>
              <th className="w-[120px] px-4 py-3 text-right font-medium text-[var(--color-muted)]">
                수익
              </th>
              <th className="w-[90px] px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                관리
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((course) => {
              const status = statusConfig[course.status];
              return (
                <tr
                  key={course.id}
                  className="border-b border-[var(--color-border)] last:border-b-0"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-[var(--color-dark)]">
                        {course.title}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                        {course.category}
                      </p>
                    </div>
                    {course.status === "rejected" && course.rejectionReason && (
                      <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-red-50 p-2.5 text-xs text-red-600">
                        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                        {course.rejectionReason}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-[var(--color-body)]">
                    {course.studentCount > 0 ? course.studentCount : "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {course.rating > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[var(--color-body)]">
                        <Star
                          size={13}
                          className="fill-amber-400 text-amber-400"
                        />
                        {course.rating}
                      </span>
                    ) : (
                      <span className="text-[var(--color-muted)]">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-[var(--color-body)]">
                    {course.completionRate > 0
                      ? `${course.completionRate}%`
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-right text-[var(--color-body)]">
                    {course.totalRevenue > 0
                      ? `₩${formatKRW(course.totalRevenue)}`
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        href={`/expert/upload?id=${course.id}`}
                        className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)] hover:text-[var(--color-body)]"
                        title="편집"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-red-50 hover:text-red-500"
                        title="삭제"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {filtered.map((course) => {
          const status = statusConfig[course.status];
          return (
            <div
              key={course.id}
              className="rounded-xl border border-[var(--color-border)] bg-white p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}
                >
                  {status.label}
                </span>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/expert/upload?id=${course.id}`}
                    className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-[var(--color-body)]"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <p className="font-medium text-[var(--color-dark)]">
                {course.title}
              </p>
              <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                {course.category}
              </p>
              {course.studentCount > 0 && (
                <div className="mt-2 flex items-center gap-3 text-xs text-[var(--color-muted)]">
                  <span className="inline-flex items-center gap-1">
                    <Users size={13} /> {course.studentCount}명
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Star
                      size={13}
                      className="fill-amber-400 text-amber-400"
                    />
                    {course.rating}
                  </span>
                  <span>완료율 {course.completionRate}%</span>
                </div>
              )}
              {course.totalRevenue > 0 && (
                <p className="mt-1 text-sm font-medium text-[var(--color-dark)]">
                  ₩{formatKRW(course.totalRevenue)}
                </p>
              )}
              {course.status === "rejected" && course.rejectionReason && (
                <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-red-50 p-2.5 text-xs text-red-600">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  {course.rejectionReason}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-[var(--color-muted)]">
            해당 상태의 강의가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
