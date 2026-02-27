import type { WeeklyActiveUser } from "@/types";
import { Trophy } from "lucide-react";

interface WeeklyTopUsersProps {
  users: WeeklyActiveUser[];
  layout?: "vertical" | "horizontal";
}

const medals: Record<string, string> = {
  gold: "🥇",
  silver: "🥈",
  bronze: "🥉",
};

export default function WeeklyTopUsers({ users, layout = "vertical" }: WeeklyTopUsersProps) {
  if (layout === "horizontal") {
    return (
      <div className="rounded-lg border border-[var(--color-border)] p-5">
        <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-[var(--color-dark)]">
          <Trophy size={18} className="text-amber-500" />
          주간 활동 TOP 10
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {users.map((user) => (
            <div
              key={user.rank}
              className="flex shrink-0 flex-col items-center rounded-lg border border-[var(--color-border)] px-4 py-3"
            >
              <span className="text-xs font-bold text-[var(--color-muted)]">
                {user.badge ? medals[user.badge] : user.rank}
              </span>
              <span className="mt-1 text-sm font-medium text-[var(--color-dark)]">
                {user.nickname}
              </span>
              <span className="mt-0.5 text-xs text-[var(--color-muted)]">{user.points}pt</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-[var(--color-muted)]">2026.02.23 기준</p>
      </div>
    );
  }

  return (
    <aside
      aria-label="주간 활동 TOP 10"
      className="sticky top-24 rounded-lg border border-[var(--color-border)] p-5"
    >
      <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-[var(--color-dark)]">
        <Trophy size={18} className="text-amber-500" />
        주간 활동 TOP 10
      </h3>
      <div className="divide-y divide-[var(--color-border)]/50">
        {users.map((user) => (
          <div key={user.rank} className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 text-center text-sm font-bold ${
                  user.rank <= 3 ? "text-[var(--color-primary)]" : "text-[var(--color-muted)]"
                }`}
              >
                {user.rank}
              </span>
              {user.badge && <span className="text-sm">{medals[user.badge]}</span>}
              <span className="text-sm text-[var(--color-dark)]">{user.nickname}</span>
            </div>
            <span className="text-xs text-[var(--color-muted)]">{user.points}pt</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-[var(--color-muted)]">2026.02.23 기준</p>
    </aside>
  );
}
