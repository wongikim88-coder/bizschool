"use client";

import { useRouter } from "next/navigation";
import { User, MessageSquare, BookOpen, ShoppingBag } from "lucide-react";
import type { MypageTab } from "@/types";
import { mypageTabs } from "@/data/mypage";
import type { LucideIcon } from "lucide-react";

const tabIcons: Record<MypageTab, LucideIcon> = {
  profile: User,
  inquiry: MessageSquare,
  courses: BookOpen,
  purchases: ShoppingBag,
};

interface MypageSidebarProps {
  currentTab: MypageTab;
  onTabClick?: (tab: MypageTab) => void;
}

export default function MypageSidebar({ currentTab, onTabClick }: MypageSidebarProps) {
  const router = useRouter();

  const handleTabChange = (tab: MypageTab) => {
    onTabClick?.(tab);
    if (tab === "profile") {
      router.push("/mypage");
    } else {
      router.push(`/mypage?tab=${tab}`);
    }
  };

  return (
    <div className="w-[240px] rounded-2xl border border-[var(--color-border)] bg-white p-6">
      {/* Menu */}
      <div className="space-y-1">
        {mypageTabs.map((tab) => {
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
