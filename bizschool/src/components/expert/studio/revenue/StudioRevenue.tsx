"use client";

import { CircleDollarSign } from "lucide-react";
import type { SettlementStatus } from "@/types";
import {
  expertCourses,
  monthlyRevenues,
  settlementRecords,
  getTotalRevenue,
  formatKRW,
} from "@/data/expertStudio";

const settlementStatusConfig: Record<
  SettlementStatus,
  { bg: string; text: string }
> = {
  정산완료: { bg: "bg-green-50", text: "text-green-600" },
  정산예정: { bg: "bg-blue-50", text: "text-blue-600" },
  정산대기: { bg: "bg-gray-100", text: "text-gray-600" },
};

export default function StudioRevenue() {
  const totalRevenue = getTotalRevenue(expertCourses);
  const publishedCourses = expertCourses.filter(
    (c) => c.status === "published" && c.totalRevenue > 0
  );

  return (
    <div className="space-y-6">
      {/* Total Revenue Card */}
      <div className="rounded-xl border border-[var(--color-border)] bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg bg-amber-50 p-2.5">
            <CircleDollarSign size={24} className="text-amber-500" />
          </div>
          <div>
            <p className="text-sm text-[var(--color-muted)]">총 누적 수익</p>
            <p className="text-3xl font-bold text-[var(--color-dark)]">
              ₩{formatKRW(totalRevenue)}
            </p>
            <p className="mt-0.5 text-xs text-[var(--color-muted)]">
              플랫폼 수수료 제외 순수익 기준
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Table */}
      <div className="rounded-xl border border-[var(--color-border)] bg-white">
        <div className="border-b border-[var(--color-border)] px-5 py-4">
          <h2 className="font-bold text-[var(--color-dark)]">월별 수익 내역</h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-light-bg)]">
                <th className="px-5 py-3 text-left font-medium text-[var(--color-muted)]">
                  월
                </th>
                <th className="px-5 py-3 text-right font-medium text-[var(--color-muted)]">
                  매출
                </th>
                <th className="px-5 py-3 text-right font-medium text-[var(--color-muted)]">
                  수수료 (20%)
                </th>
                <th className="px-5 py-3 text-right font-medium text-[var(--color-muted)]">
                  순수익
                </th>
              </tr>
            </thead>
            <tbody>
              {[...monthlyRevenues].reverse().map((rev) => {
                const [year, month] = rev.month.split("-");
                return (
                  <tr
                    key={rev.month}
                    className="border-b border-[var(--color-border)] last:border-b-0"
                  >
                    <td className="px-5 py-3 text-[var(--color-body)]">
                      {year}년 {parseInt(month)}월
                    </td>
                    <td className="px-5 py-3 text-right text-[var(--color-body)]">
                      ₩{formatKRW(rev.grossSales)}
                    </td>
                    <td className="px-5 py-3 text-right text-[var(--color-muted)]">
                      -₩{formatKRW(rev.platformFee)}
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-[var(--color-dark)]">
                      ₩{formatKRW(rev.netRevenue)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y divide-[var(--color-border)] md:hidden">
          {[...monthlyRevenues].reverse().map((rev) => {
            const [year, month] = rev.month.split("-");
            return (
              <div key={rev.month} className="px-4 py-3">
                <p className="text-sm font-medium text-[var(--color-dark)]">
                  {year}년 {parseInt(month)}월
                </p>
                <div className="mt-1 flex justify-between text-xs text-[var(--color-muted)]">
                  <span>매출 ₩{formatKRW(rev.grossSales)}</span>
                  <span>수수료 -₩{formatKRW(rev.platformFee)}</span>
                </div>
                <p className="mt-1 text-right text-sm font-medium text-[var(--color-dark)]">
                  순수익 ₩{formatKRW(rev.netRevenue)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Course Revenue */}
      <div className="rounded-xl border border-[var(--color-border)] bg-white">
        <div className="border-b border-[var(--color-border)] px-5 py-4">
          <h2 className="font-bold text-[var(--color-dark)]">강의별 수익</h2>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {publishedCourses.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between px-5 py-3"
            >
              <div>
                <p className="text-sm font-medium text-[var(--color-dark)]">
                  {course.title}
                </p>
                <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                  수강생 {course.studentCount}명
                </p>
              </div>
              <p className="text-sm font-medium text-[var(--color-dark)]">
                ₩{formatKRW(course.totalRevenue)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Settlement History */}
      <div className="rounded-xl border border-[var(--color-border)] bg-white">
        <div className="border-b border-[var(--color-border)] px-5 py-4">
          <h2 className="font-bold text-[var(--color-dark)]">정산 내역</h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-light-bg)]">
                <th className="px-5 py-3 text-left font-medium text-[var(--color-muted)]">
                  정산기간
                </th>
                <th className="px-5 py-3 text-right font-medium text-[var(--color-muted)]">
                  금액
                </th>
                <th className="px-5 py-3 text-center font-medium text-[var(--color-muted)]">
                  상태
                </th>
                <th className="px-5 py-3 text-center font-medium text-[var(--color-muted)]">
                  지급일
                </th>
              </tr>
            </thead>
            <tbody>
              {settlementRecords.map((record) => {
                const config = settlementStatusConfig[record.status];
                return (
                  <tr
                    key={record.id}
                    className="border-b border-[var(--color-border)] last:border-b-0"
                  >
                    <td className="px-5 py-3 text-[var(--color-body)]">
                      {record.period}
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-[var(--color-dark)]">
                      ₩{formatKRW(record.amount)}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center text-[var(--color-muted)]">
                      {record.payoutDate || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y divide-[var(--color-border)] md:hidden">
          {settlementRecords.map((record) => {
            const config = settlementStatusConfig[record.status];
            return (
              <div key={record.id} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[var(--color-dark)]">
                    {record.period}
                  </p>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
                  >
                    {record.status}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-[var(--color-muted)]">
                  <span>₩{formatKRW(record.amount)}</span>
                  <span>지급일: {record.payoutDate || "-"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
