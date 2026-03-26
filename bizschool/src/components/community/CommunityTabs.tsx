"use client";

import { useRouter } from "next/navigation";
import { BookOpenCheck, MessageSquareText, Users, LayoutGrid, PenLine } from "lucide-react";
import type { CommunityTab } from "@/types";
import { communityTabs } from "@/data/community";

const tabIcons: Record<CommunityTab, React.ComponentType<{ className?: string; size?: number }>> = {
  all: LayoutGrid,
  questions: BookOpenCheck,
  cases: MessageSquareText,
  discussion: Users,
  column: PenLine,
};

const tabColors: Record<CommunityTab, { icon: string; bg: string; activeBorder: string }> = {
  all: { icon: "text-slate-500", bg: "bg-slate-100", activeBorder: "border-[var(--color-primary)]" },
  questions: { icon: "text-blue-500", bg: "bg-blue-50", activeBorder: "border-[var(--color-primary)]" },
  cases: { icon: "text-emerald-500", bg: "bg-emerald-50", activeBorder: "border-[var(--color-primary)]" },
  discussion: { icon: "text-sky-500", bg: "bg-sky-50", activeBorder: "border-[var(--color-primary)]" },
  column: { icon: "text-orange-500", bg: "bg-orange-50", activeBorder: "border-[var(--color-primary)]" },
};

interface CommunityTabsProps {
  currentTab: CommunityTab;
}

export default function CommunityTabs({ currentTab }: CommunityTabsProps) {
  const router = useRouter();

  const handleTabChange = (tab: CommunityTab) => {
    router.push(`/community?tab=${tab}`);
  };

  return (
    <div
      role="tablist"
      className="flex justify-center gap-3 overflow-x-auto py-2"
      style={{ scrollbarWidth: "none" }}
    >
      {communityTabs.map((tab) => {
        const Icon = tabIcons[tab.key];
        const colors = tabColors[tab.key];
        const isActive = currentTab === tab.key;

        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => handleTabChange(tab.key)}
            className={`flex shrink-0 cursor-pointer flex-col items-center gap-1.5 rounded-xl border px-6 py-3 ${
              isActive
                ? `border-2 ${colors.activeBorder} bg-white shadow-sm`
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${colors.bg}`}>
              <Icon size={20} className={colors.icon} />
            </div>
            <span
              className={`text-[13px] whitespace-nowrap ${
                isActive ? "font-bold text-gray-900" : "text-gray-500"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
