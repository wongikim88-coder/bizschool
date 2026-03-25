"use client";

import { useState, Suspense } from "react";
import type { MypageTab, InquiryFilter } from "@/types";
import MypageSidebar from "./MypageSidebar";
import MypageContent from "./MypageContent";

interface MypageLayoutProps {
  currentTab: MypageTab;
  filter: InquiryFilter;
  page: number;
  viewId: number | null;
  writeMode: boolean;
  expertViewId: string | null;
  expertFilter: string;
  expertCategory: string;
}

export default function MypageLayout({
  currentTab,
  filter,
  page,
  viewId,
  writeMode,
  expertViewId,
  expertFilter,
  expertCategory,
}: MypageLayoutProps) {
  const [purchaseResetKey, setPurchaseResetKey] = useState(0);

  const handleSidebarTabClick = (tab: MypageTab) => {
    if (tab === "purchases" && currentTab === "purchases") {
      setPurchaseResetKey((k) => k + 1);
    }
  };

  return (
    <div className="flex gap-8">
      {/* Desktop Sidebar */}
      <div className="hidden shrink-0 md:block">
        <MypageSidebar currentTab={currentTab} onTabClick={handleSidebarTabClick} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <Suspense>
          <MypageContent
            currentTab={currentTab}
            filter={filter}
            page={page}
            viewId={viewId}
            writeMode={writeMode}
            purchaseResetKey={purchaseResetKey}
            onPurchaseReset={() => setPurchaseResetKey((k) => k + 1)}
            expertViewId={expertViewId}
            expertFilter={expertFilter}
            expertCategory={expertCategory}
          />
        </Suspense>
      </div>
    </div>
  );
}
