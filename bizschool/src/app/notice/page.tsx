import { Suspense } from "react";
import type { Metadata } from "next";
import { notices, NOTICES_PER_PAGE, getSortedNotices } from "@/data/notice";
import NoticeTable from "@/components/notice/NoticeTable";
import NoticePagination from "@/components/notice/NoticePagination";

export const metadata: Metadata = {
  title: "공지사항 | BIZSCHOOL",
  description: "비즈스쿨의 공지사항, 서비스 업데이트, 이벤트 소식을 확인하세요.",
};

interface NoticePageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function NoticePage({ searchParams }: NoticePageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);

  // 데이터 처리: 정렬 → 페이지네이션
  const sorted = getSortedNotices(notices);
  const totalPages = Math.ceil(sorted.length / NOTICES_PER_PAGE);
  const startIndex = (page - 1) * NOTICES_PER_PAGE;
  const paginatedNotices = sorted.slice(startIndex, startIndex + NOTICES_PER_PAGE);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#155dfc] to-[#0d3b9e] px-8 py-16 text-center md:px-16 md:py-24 lg:py-28">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 right-20 h-40 w-40 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute left-1/3 top-0 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
            공지사항
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            비즈스쿨의 새로운 소식과 서비스 업데이트,
            <br />
            이벤트 정보를 확인하세요.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-[1200px] px-4 pb-16">
        <div className="mt-8">
          <NoticeTable notices={paginatedNotices} />
        </div>

        <Suspense>
          <NoticePagination
            currentPage={page}
            totalPages={totalPages}
          />
        </Suspense>
      </div>
    </div>
  );
}
