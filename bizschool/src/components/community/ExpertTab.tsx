"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ExpertFilterBar from "./ExpertFilterBar";
import ExpertPostCard from "./ExpertPostCard";
import { expertConsultations, EXPERT_POSTS_PER_PAGE } from "@/data/expert-consultation";
import type { ExpertConsultationCategory } from "@/types";

const validCategories: ExpertConsultationCategory[] = ["회계", "세무", "4대보험", "인사", "총무"];

interface ExpertTabProps {
  page: number;
  category?: string;
  search?: string;
  sort?: string;
}

function buildPageUrl(
  page: number,
  category?: string,
  search?: string,
  sort?: string,
) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (category && validCategories.includes(category as ExpertConsultationCategory)) {
    params.set("category", category);
  }
  if (search) params.set("search", search);
  if (sort === "views") params.set("sort", sort);
  return `/expert-consultation?${params.toString()}`;
}

export default function ExpertTab({ page, category, search, sort }: ExpertTabProps) {
  const router = useRouter();

  // 필터링
  let filtered = [...expertConsultations];

  if (category && validCategories.includes(category as ExpertConsultationCategory)) {
    filtered = filtered.filter((c) => c.category === category);
  }

  if (search) {
    const keyword = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(keyword) ||
        c.content.toLowerCase().includes(keyword),
    );
  }

  if (sort === "views") {
    filtered.sort((a, b) => b.viewCount - a.viewCount);
  } else {
    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / EXPERT_POSTS_PER_PAGE);
  const startIndex = (page - 1) * EXPERT_POSTS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + EXPERT_POSTS_PER_PAGE);

  // 페이지 번호
  const getPageNumbers = () => {
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const goToPage = (p: number) => {
    router.push(buildPageUrl(p, category, search, sort));
  };

  return (
    <div>
      <ExpertFilterBar
        currentCategory={category}
        currentSearch={search}
        currentSort={sort}
        totalCount={totalCount}
      />

      {paginated.length > 0 ? (
        <div className="mt-3 divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
          {paginated.map((post) => (
            <ExpertPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-6 py-16 text-center text-sm text-[var(--color-muted)]">
          검색 결과가 없습니다.
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <nav aria-label="페이지 이동" className="flex items-center justify-center gap-1 py-8">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)] disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
            aria-label="이전 페이지"
          >
            <ChevronLeft size={18} />
          </button>
          {getPageNumbers().map((p) => (
            <button
              key={p}
              onClick={() => goToPage(p)}
              aria-current={p === page ? "page" : undefined}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? "bg-[var(--color-primary)] font-bold text-white"
                  : "text-[var(--color-body)] hover:bg-[var(--color-light-bg)]"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)] disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
            aria-label="다음 페이지"
          >
            <ChevronRight size={18} />
          </button>
        </nav>
      )}
    </div>
  );
}
