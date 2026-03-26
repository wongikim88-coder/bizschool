import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { StudioTab } from "@/types";
import ExpertStudioLayout from "@/components/expert/studio/ExpertStudioLayout";

export const metadata: Metadata = {
  title: "전문가 스튜디오 | BIZSCHOOL",
  description:
    "강의 관리, 수익 확인, 수강생 질문 답변 등 전문가를 위한 관리 페이지입니다.",
};

const validTabs: StudioTab[] = [
  "dashboard",
  "courses",
  "qna",
  "revenue",
  "guide",
  "meeting",
];

export default async function ExpertStudioPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "expert") {
    redirect("/expert");
  }

  const params = await searchParams;
  const tab: StudioTab = validTabs.includes(params.tab as StudioTab)
    ? (params.tab as StudioTab)
    : "dashboard";

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-[var(--color-dark)]">
        전문가 스튜디오
      </h1>
      <ExpertStudioLayout currentTab={tab} />
    </div>
  );
}
