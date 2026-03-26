"use client";

import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  MessageCircleQuestion,
  CircleDollarSign,
  Lightbulb,
  CalendarClock,
} from "lucide-react";
import type { StudioTab } from "@/types";
import { studioTabs } from "@/data/expertStudio";
import type { LucideIcon } from "lucide-react";

const tabIcons: Record<StudioTab, LucideIcon> = {
  dashboard: LayoutDashboard,
  courses: BookOpen,
  qna: MessageCircleQuestion,
  revenue: CircleDollarSign,
  guide: Lightbulb,
  meeting: CalendarClock,
};

interface ExpertStudioSidebarProps {
  currentTab: StudioTab;
}

export default function ExpertStudioSidebar({
  currentTab,
}: ExpertStudioSidebarProps) {
  const router = useRouter();

  const handleTabChange = (tab: StudioTab) => {
    if (tab === "dashboard") {
      router.push("/expert/center");
    } else {
      router.push(`/expert/center?tab=${tab}`);
    }
  };

  return (
    <div className="w-[240px] rounded-2xl border border-[var(--color-border)] bg-white p-6">
      <div className="space-y-1">
        {studioTabs.map((tab) => {
          const Icon = tabIcons[tab.key];
          const isActive = currentTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 text-[15px] transition-colors ${
                isActive
                  ? "bg-[var(--color-primary)]/10 font-bold text-[var(--color-primary)]"
                  : "text-[var(--color-body)] hover:bg-[var(--color-light-bg)]"
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
