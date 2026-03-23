"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import type { Resource, ResourceCategoryFilter } from "@/types";
import {
  RESOURCES_PER_PAGE,
  getSortedResources,
  filterByCategory,
  filterBySearch,
} from "@/data/resources";

interface ResourcePageContentProps {
  resources: Resource[];
}

const CATEGORIES: ResourceCategoryFilter[] = [
  "전체",
  "신청서·양식",
  "정오표",
  "교육자료",
  "참고자료",
];

function isNew(createdAt: string): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diffDays <= 7;
}

function formatDate(dateStr: string) {
  return dateStr.replace(/-/g, ".");
}

export default function ResourcePageContent({
  resources,
}: ResourcePageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = (searchParams.get("category") ||
    "전체") as ResourceCategoryFilter;
  const currentSearch = searchParams.get("search") || "";
  const currentPage = Math.max(
    1,
    parseInt(searchParams.get("page") || "1", 10) || 1
  );

  const [keyword, setKeyword] = useState(currentSearch);

  // 필터링: 카테고리 → 검색 → 정렬
  const sorted = getSortedResources(resources);
  const byCategory = filterByCategory(sorted, currentCategory);
  const filtered = filterBySearch(byCategory, currentSearch);

  // 페이지네이션
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / RESOURCES_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * RESOURCES_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + RESOURCES_PER_PAGE);

  const isSearchResult = currentSearch.length > 0;

  // URL 업데이트 헬퍼
  function buildUrl(params: {
    category?: string;
    search?: string;
    page?: number;
  }) {
    const p = new URLSearchParams();
    const cat = params.category ?? currentCategory;
    const srch = params.search ?? currentSearch;
    const pg = params.page ?? 1;

    if (cat && cat !== "전체") p.set("category", cat);
    if (srch) p.set("search", srch);
    if (pg > 1) p.set("page", String(pg));

    const qs = p.toString();
    return `/resources${qs ? `?${qs}` : ""}`;
  }

  // 카테고리 탭 클릭
  function onCategoryClick(cat: ResourceCategoryFilter) {
    router.push(buildUrl({ category: cat, page: 1 }));
  }

  // 검색 제출
  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildUrl({ search: keyword.trim(), page: 1 }));
  }

  // 검색 초기화
  function onSearchReset() {
    setKeyword("");
    router.push(buildUrl({ search: "", page: 1 }));
  }

  // 페이지 이동
  function goToPage(page: number) {
    router.push(buildUrl({ page }));
  }

  // 페이지네이션 번호
  function getPageNumbers() {
    const maxVisible = 5;
    let start = Math.max(1, safePage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  return (
    <div>
      {/* 카테고리 탭 */}
      <div className="mt-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryClick(cat)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              cat === currentCategory
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-light-bg)] text-[var(--color-muted)] hover:text-[var(--color-body)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 검색 */}
      <div className="mt-6">
        <form onSubmit={onSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
            />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="자료 검색"
              className="w-full rounded-lg border border-[var(--color-border)] bg-white py-2.5 pl-10 pr-4 text-sm text-[var(--color-body)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-[var(--color-primary)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
          >
            검색
          </button>
        </form>

        {isSearchResult && (
          <div className="mt-3 text-sm text-[var(--color-muted)]">
            검색결과 {totalCount}건
            <button
              onClick={onSearchReset}
              className="ml-2 text-[var(--color-primary)] hover:underline"
            >
              초기화
            </button>
          </div>
        )}
      </div>

      {/* 빈 상태 */}
      {paginated.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg font-medium text-[var(--color-muted)]">
            등록된 자료가 없습니다
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            다른 카테고리나 검색어로 시도해 보세요
          </p>
        </div>
      ) : (
        <>
          {/* Desktop 테이블 */}
          <div className="mt-6 hidden overflow-x-auto md:block">
            <table className="w-full table-fixed text-sm">
              <colgroup>
                <col className="w-[10%]" />
                <col className="w-[15%]" />
                <col className="w-[50%]" />
                <col className="w-[25%]" />
              </colgroup>
              <thead>
                <tr className="bg-[var(--color-light-bg)]">
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                    번호
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                    카테고리
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                    제목
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                    등록일
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((resource) => (
                  <tr
                    key={resource.id}
                    onClick={() => router.push(`/resources/${resource.id}`)}
                    className="cursor-pointer border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-light-bg)]"
                  >
                    <td className="px-4 py-4 text-center text-[var(--color-muted)]">
                      {resource.id}
                    </td>
                    <td className="px-4 py-4 text-center text-[var(--color-muted)]">
                      {resource.category}
                    </td>
                    <td className="px-4 py-4 text-[var(--color-body)]">
                      {resource.title}
                      {isNew(resource.createdAt) && (
                        <span className="ml-1.5 inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-500">
                          NEW
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center text-[var(--color-body)]">
                      {formatDate(resource.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile 카드 */}
          <div className="mt-6 space-y-3 md:hidden">
            {paginated.map((resource) => (
              <Link
                key={resource.id}
                href={`/resources/${resource.id}`}
                className="block rounded-xl border border-[var(--color-border)] bg-white p-4 transition-colors hover:bg-[var(--color-light-bg)]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--color-muted)]">
                    {resource.category}
                  </span>
                  {isNew(resource.createdAt) && (
                    <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-500">
                      NEW
                    </span>
                  )}
                </div>
                <p className="mt-2 font-medium text-[var(--color-dark)]">
                  {resource.title}
                </p>
                <p className="mt-2 text-xs text-[var(--color-muted)]">
                  {formatDate(resource.createdAt)}
                </p>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <nav
          aria-label="페이지 이동"
          className="flex items-center justify-center gap-1 py-8"
        >
          <button
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage <= 1}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)] disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
            aria-label="이전 페이지"
          >
            <ChevronLeft size={18} />
          </button>

          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              aria-current={page === safePage ? "page" : undefined}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                page === safePage
                  ? "bg-[var(--color-primary)] font-bold text-white"
                  : "text-[var(--color-body)] hover:bg-[var(--color-light-bg)]"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage >= totalPages}
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
