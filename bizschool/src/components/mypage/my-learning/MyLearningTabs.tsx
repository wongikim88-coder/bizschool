"use client";

import type { MyLearningTab } from "@/types";
import { myLearningTabs } from "@/data/mypage";

interface MyLearningTabsProps {
  activeTab: MyLearningTab;
  onTabChange: (tab: MyLearningTab) => void;
}

export default function MyLearningTabs({
  activeTab,
  onTabChange,
}: MyLearningTabsProps) {
  return (
    <div className="mb-4 border-b border-[var(--color-border)]">
      <nav className="-mb-px flex gap-6">
        {myLearningTabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`whitespace-nowrap pb-3 text-sm transition-colors ${
                isActive
                  ? "border-b-2 border-[var(--color-primary)] font-bold text-[var(--color-dark)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-dark)]"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
