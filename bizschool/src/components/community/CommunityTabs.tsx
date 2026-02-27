"use client";

import { useRouter } from "next/navigation";
import type { CommunityTab } from "@/types";
import { communityTabs } from "@/data/community";

interface CommunityTabsProps {
  currentTab: CommunityTab;
}

export default function CommunityTabs({ currentTab }: CommunityTabsProps) {
  const router = useRouter();

  const handleTabChange = (tab: CommunityTab) => {
    if (tab === "home") {
      router.push("/community");
    } else {
      router.push(`/community?tab=${tab}`);
    }
  };

  return (
    <div
      role="tablist"
      className="flex overflow-x-auto border-b border-[var(--color-border)]"
      style={{ scrollbarWidth: "none" }}
    >
      {communityTabs.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={currentTab === tab.key}
          onClick={() => handleTabChange(tab.key)}
          className={`shrink-0 whitespace-nowrap px-6 py-3 text-[15px] transition-colors ${
            currentTab === tab.key
              ? "border-b-2 border-[var(--color-primary)] font-bold text-[var(--color-primary)]"
              : "text-[var(--color-muted)] hover:text-[var(--color-body)]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
