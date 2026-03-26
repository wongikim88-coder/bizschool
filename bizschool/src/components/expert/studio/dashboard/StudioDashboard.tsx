"use client";

import {
  BookOpen,
  Users,
  CircleDollarSign,
  Star,
  MessageCircle,
  UserPlus,
  CheckCircle,
  Wallet,
} from "lucide-react";
import type { ActivityType } from "@/types";
import {
  expertCourses,
  monthlyRevenues,
  recentActivities,
  getTotalStudents,
  getTotalRevenue,
  getAverageRating,
  formatKRW,
  getRelativeTime,
} from "@/data/expertStudio";
import type { LucideIcon } from "lucide-react";

const activityIcons: Record<ActivityType, LucideIcon> = {
  new_question: MessageCircle,
  new_enrollment: UserPlus,
  course_published: CheckCircle,
  settlement_completed: Wallet,
};

const activityColors: Record<ActivityType, string> = {
  new_question: "text-blue-500",
  new_enrollment: "text-green-500",
  course_published: "text-purple-500",
  settlement_completed: "text-amber-500",
};

export default function StudioDashboard() {
  const publishedCount = expertCourses.filter(
    (c) => c.status === "published"
  ).length;
  const totalStudents = getTotalStudents(expertCourses);
  const totalRevenue = getTotalRevenue(expertCourses);
  const avgRating = getAverageRating(expertCourses);

  const maxRevenue = Math.max(...monthlyRevenues.map((r) => r.netRevenue));

  const kpiCards = [
    {
      icon: BookOpen,
      label: "게시된 강의",
      value: `${publishedCount}개`,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      icon: Users,
      label: "총 수강생",
      value: `${totalStudents}명`,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      icon: CircleDollarSign,
      label: "총 수익",
      value: `₩${formatKRW(totalRevenue)}`,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      icon: Star,
      label: "평균 평점",
      value: avgRating.toFixed(1),
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border border-[var(--color-border)] bg-white p-5"
            >
              <div
                className={`mb-3 inline-flex rounded-lg p-2 ${card.bg}`}
              >
                <Icon size={20} className={card.color} />
              </div>
              <p className="text-2xl font-bold text-[var(--color-dark)]">
                {card.value}
              </p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                {card.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-[var(--color-border)] bg-white p-5">
        <h2 className="mb-4 text-lg font-bold text-[var(--color-dark)]">
          최근 활동
        </h2>
        <div className="divide-y divide-[var(--color-border)]">
          {recentActivities.map((activity) => {
            const Icon = activityIcons[activity.type];
            const color = activityColors[activity.type];
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 py-3"
              >
                <div className="mt-0.5 shrink-0">
                  <Icon size={16} className={color} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[var(--color-body)]">
                    {activity.description}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                    {getRelativeTime(activity.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="rounded-xl border border-[var(--color-border)] bg-white p-5">
        <h2 className="mb-4 text-lg font-bold text-[var(--color-dark)]">
          월별 수익 추이
        </h2>
        <div className="space-y-3">
          {monthlyRevenues.map((rev) => {
            const widthPercent =
              maxRevenue > 0
                ? Math.round((rev.netRevenue / maxRevenue) * 100)
                : 0;
            const [year, month] = rev.month.split("-");
            const monthLabel = `${year}.${month}`;

            return (
              <div key={rev.month} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-right text-sm text-[var(--color-muted)]">
                  {monthLabel}
                </span>
                <div className="flex-1">
                  <div className="h-6 w-full rounded-full bg-[var(--color-light-bg)]">
                    <div
                      className="flex h-6 items-center rounded-full bg-[var(--color-primary)] px-2 text-xs font-medium text-white transition-all"
                      style={{ width: `${Math.max(widthPercent, 15)}%` }}
                    >
                      {widthPercent > 30 && `₩${formatKRW(rev.netRevenue)}`}
                    </div>
                  </div>
                </div>
                {widthPercent <= 30 && (
                  <span className="shrink-0 text-xs text-[var(--color-muted)]">
                    ₩{formatKRW(rev.netRevenue)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
