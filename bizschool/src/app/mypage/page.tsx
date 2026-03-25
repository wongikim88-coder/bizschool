import type { Metadata } from "next";
import type { MypageTab, InquiryFilter } from "@/types";
import MypageLayout from "@/components/mypage/MypageLayout";

export const metadata: Metadata = {
  title: "마이페이지 - BIZSCHOOL",
  description: "BIZSCHOOL 마이페이지에서 내 정보와 1:1 문의를 관리하세요.",
};

const validTabs: MypageTab[] = ["profile", "inquiry", "courses", "purchases", "claims", "expert"];
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
    category?: string;
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

  // Expert tab params
  const expertViewId = tab === "expert" && params.view ? params.view : null;
  const expertFilter = params.filter || "all";
  const expertCategory = params.category || "all";

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-[var(--color-dark)]">
        마이페이지
      </h1>

      <MypageLayout
        currentTab={tab}
        filter={filter}
        page={page}
        viewId={view}
        writeMode={write}
        expertViewId={expertViewId}
        expertFilter={expertFilter}
        expertCategory={expertCategory}
      />
    </div>
  );
}
