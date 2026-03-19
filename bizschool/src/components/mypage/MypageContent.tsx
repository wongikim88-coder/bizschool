"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { MypageTab, InquiryFilter, Inquiry } from "@/types";
import { mockUser, mypageTabs, mockInquiries } from "@/data/mypage";
import ProfileSection from "./ProfileSection";
import InquiryList from "./InquiryList";
import InquiryDetail from "./InquiryDetail";
import InquiryForm from "./InquiryForm";
import CoursesSection from "./CoursesSection";
import PurchasesSection from "./PurchasesSection";
import ClaimsSection from "./ClaimsSection";

interface MypageContentProps {
  currentTab: MypageTab;
  filter: InquiryFilter;
  page: number;
  viewId: number | null;
  writeMode: boolean;
  purchaseResetKey: number;
  onPurchaseReset: () => void;
}

export default function MypageContent({
  currentTab,
  filter,
  page,
  viewId,
  writeMode,
  purchaseResetKey,
  onPurchaseReset,
}: MypageContentProps) {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries);

  const initial = mockUser.name.charAt(0);

  const handleTabChange = (tab: MypageTab) => {
    // 구매내역 탭을 다시 클릭하면 위자드/상세 뷰를 닫고 목록으로 복귀
    if (tab === "purchases" && currentTab === "purchases") {
      onPurchaseReset();
      return;
    }
    if (tab === "profile") {
      router.push("/mypage");
    } else {
      router.push(`/mypage?tab=${tab}`);
    }
  };

  const handleNewInquiry = (inquiry: Inquiry) => {
    setInquiries((prev) => [inquiry, ...prev]);
  };

  const nextId =
    inquiries.length > 0 ? Math.max(...inquiries.map((i) => i.id)) + 1 : 1;

  return (
    <div>
      {/* Mobile: Profile Card */}
      <div className="mb-4 flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-white p-4 md:hidden">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-base font-bold text-[var(--color-primary)]">
          {initial}
        </div>
        <div>
          <p className="font-bold text-[var(--color-dark)]">{mockUser.name}</p>
          <p className="text-sm text-[var(--color-muted)]">{mockUser.email}</p>
        </div>
      </div>

      {/* Mobile: Tab Menu */}
      <div
        role="tablist"
        className="flex overflow-x-auto border-b border-[var(--color-border)] md:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {mypageTabs.map((tab) => (
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

      {/* Content */}
      <div className="mt-4 md:mt-0">
        {currentTab === "profile" && <ProfileSection />}

        {currentTab === "inquiry" && !viewId && !writeMode && (
          <InquiryList inquiries={inquiries} filter={filter} page={page} />
        )}

        {currentTab === "inquiry" && viewId && (
          <InquiryDetail
            inquiry={inquiries.find((i) => i.id === viewId)}
          />
        )}

        {currentTab === "inquiry" && writeMode && (
          <InquiryForm onSubmit={handleNewInquiry} nextId={nextId} />
        )}

        {currentTab === "courses" && <CoursesSection />}

        {currentTab === "purchases" && <PurchasesSection key={purchaseResetKey} />}

        {currentTab === "claims" && <ClaimsSection />}
      </div>
    </div>
  );
}
