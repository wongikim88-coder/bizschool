"use client";

import { useRouter } from "next/navigation";
import type { StudioTab } from "@/types";
import { studioTabs } from "@/data/expertStudio";
import ExpertStudioSidebar from "./ExpertStudioSidebar";
import StudioDashboard from "./dashboard/StudioDashboard";
import StudioCourses from "./courses/StudioCourses";
import StudioQna from "./qna/StudioQna";
import StudioRevenue from "./revenue/StudioRevenue";
import StudioGuide from "./guide/StudioGuide";
import StudioMeeting from "./meeting/StudioMeeting";

interface ExpertStudioLayoutProps {
  currentTab: StudioTab;
}

export default function ExpertStudioLayout({
  currentTab,
}: ExpertStudioLayoutProps) {
  const router = useRouter();

  const handleTabChange = (tab: StudioTab) => {
    if (tab === "dashboard") {
      router.push("/expert/center");
    } else {
      router.push(`/expert/center?tab=${tab}`);
    }
  };

  return (
    <div>
      {/* Mobile: Tab Bar */}
      <div
        role="tablist"
        className="flex overflow-x-auto border-b border-[var(--color-border)] md:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {studioTabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={currentTab === tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`shrink-0 whitespace-nowrap px-5 py-3 text-[15px] transition-colors ${
              currentTab === tab.key
                ? "border-b-2 border-[var(--color-primary)] font-bold text-[var(--color-primary)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-body)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Desktop: Sidebar + Content */}
      <div className="flex gap-8">
        <div className="hidden shrink-0 md:block">
          <ExpertStudioSidebar currentTab={currentTab} />
        </div>

        <div className="mt-4 min-w-0 flex-1 md:mt-0">
          {currentTab === "dashboard" && <StudioDashboard />}
          {currentTab === "courses" && <StudioCourses />}
          {currentTab === "qna" && <StudioQna />}
          {currentTab === "revenue" && <StudioRevenue />}
          {currentTab === "guide" && <StudioGuide />}
          {currentTab === "meeting" && <StudioMeeting />}
        </div>
      </div>
    </div>
  );
}
