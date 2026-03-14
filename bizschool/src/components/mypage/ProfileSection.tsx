"use client";

import { mockUser } from "@/data/mypage";

export default function ProfileSection() {
  const initial = mockUser.name.charAt(0);

  const infoRows = [
    { label: "이름", value: mockUser.name },
    { label: "이메일", value: mockUser.email },
    {
      label: "가입일",
      value: new Date(mockUser.joinDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  ];

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-8">
      <h2 className="text-lg font-bold text-[var(--color-dark)]">내 정보</h2>

      {/* Profile Card */}
      <div className="mt-6 flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-xl font-bold text-[var(--color-primary)]">
          {initial}
        </div>
        <div>
          <p className="text-lg font-bold text-[var(--color-dark)]">
            {mockUser.name}
          </p>
          <p className="mt-0.5 text-sm text-[var(--color-muted)]">
            {mockUser.email}
          </p>
        </div>
      </div>

      {/* Info Rows */}
      <div className="mt-6 border-t border-[var(--color-border)]">
        {infoRows.map((row) => (
          <div
            key={row.label}
            className="flex items-center border-b border-[var(--color-border)] py-4 last:border-0"
          >
            <span className="w-24 shrink-0 text-sm font-medium text-[var(--color-muted)]">
              {row.label}
            </span>
            <span className="text-sm text-[var(--color-dark)]">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
