import { Suspense } from "react";
import type { Metadata } from "next";
import type { MypageTab, InquiryFilter } from "@/types";
import MypageSidebar from "@/components/mypage/MypageSidebar";
import MypageContent from "@/components/mypage/MypageContent";

export const metadata: Metadata = {
  title: "마이페이지 - BIZSCHOOL",
  description: "BIZSCHOOL 마이페이지에서 내 정보와 1:1 문의를 관리하세요.",
};

const validTabs: MypageTab[] = ["profile", "inquiry", "courses", "purchases"];
const validFilters: InquiryFilter[] = ["all", "pending", "answered"];

export default async function MypagePage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string;
    filter?: string;
    page?: string;
    view?: string;
    write?: string;
  }>;
}) {
  const params = await searchParams;
  const tab: MypageTab = validTabs.includes(params.tab as MypageTab)
    ? (params.tab as MypageTab)
    : "profile";
  const filter: InquiryFilter = validFilters.includes(params.filter as InquiryFilter)
    ? (params.filter as InquiryFilter)
    : "all";
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const view = params.view ? parseInt(params.view, 10) || null : null;
  const write = params.write === "true";

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-[var(--color-dark)]">
        마이페이지
      </h1>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden shrink-0 md:block">
          <MypageSidebar currentTab={tab} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <Suspense>
            <MypageContent
              currentTab={tab}
              filter={filter}
              page={page}
              viewId={view}
              writeMode={write}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
