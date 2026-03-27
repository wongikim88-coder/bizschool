import { Suspense } from "react";
import type { Metadata } from "next";
import type { CommunityTab } from "@/types";
import CommunityTabs from "@/components/community/CommunityTabs";
import HomeTab from "@/components/community/HomeTab";
import QuestionsTab from "@/components/community/QuestionsTab";
import CasesTab from "@/components/community/CasesTab";
import DiscussionTab from "@/components/community/DiscussionTab";
import ColumnTab from "@/components/community/ColumnTab";
import WritePostFAB from "@/components/community/WritePostFAB";

export const metadata: Metadata = {
  title: "커뮤니티 - BIZSCHOOL",
  description: "BIZSCHOOL 커뮤니티에서 강의질문, 상담사례, 자유토론을 나눠보세요.",
};

const validTabs: CommunityTab[] = ["all", "questions", "cases", "discussion", "column"];

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string }>;
}) {
  const params = await searchParams;
  const tab: CommunityTab = validTabs.includes(params.tab as CommunityTab)
    ? (params.tab as CommunityTab)
    : "all";
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6">
      <Suspense>
        <CommunityTabs currentTab={tab} />
      </Suspense>

      <div className="mt-4">
        {tab === "all" && (
          <Suspense>
            <HomeTab />
          </Suspense>
        )}

        {tab === "questions" && (
          <Suspense>
            <QuestionsTab page={page} />
          </Suspense>
        )}

        {tab === "cases" && (
          <Suspense>
            <CasesTab page={page} />
          </Suspense>
        )}

        {tab === "discussion" && (
          <Suspense>
            <DiscussionTab page={page} />
          </Suspense>
        )}

        {tab === "column" && (
          <Suspense>
            <ColumnTab page={page} />
          </Suspense>
        )}
      </div>

      <WritePostFAB />
    </div>
  );
}
