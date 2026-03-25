"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Pencil } from "lucide-react";
import { expertCategories } from "@/data/expert-consultation";
import type { ExpertConsultationCategory, ExpertSortOption } from "@/types";

interface ExpertFilterBarProps {
  currentCategory?: string;
  currentSearch?: string;
  currentSort?: string;
  totalCount: number;
}

export default function ExpertFilterBar({
  currentCategory,
  currentSearch,
  currentSort,
  totalCount,
}: ExpertFilterBarProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(currentSearch || "");

  const activeCategory = currentCategory || "all";
  const activeSort: ExpertSortOption = currentSort === "views" ? "views" : "latest";

  const buildUrl = (overrides: {
    category?: string;
    search?: string;
    sort?: string;
  }) => {
    const params = new URLSearchParams();
    params.set("page", "1");

    const cat = overrides.category ?? activeCategory;
    if (cat && cat !== "all") params.set("category", cat);

    const search = overrides.search ?? currentSearch;
    if (search) params.set("search", search);

    const sort = overrides.sort ?? (activeSort === "views" ? "views" : undefined);
    if (sort) params.set("sort", sort);

    return `/expert-consultation?${params.toString()}`;
  };

  const handleCategoryChange = (key: ExpertConsultationCategory | "all") => {
    router.push(buildUrl({ category: key }));
  };

  const handleSearch = () => {
    router.push(buildUrl({ search: searchInput || undefined }));
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSortChange = (sort: ExpertSortOption) => {
    router.push(buildUrl({ sort: sort === "views" ? "views" : undefined }));
  };

  return (
    <div className="space-y-3">
      {/* Row 1: 카테고리 + 검색 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex gap-2 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {expertCategories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategoryChange(cat.key)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat.key
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-gray-100 text-[var(--color-body)] hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-[240px]">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="검색어 입력"
            className="w-full rounded-lg border border-[var(--color-border)] py-2 pl-3 pr-9 text-sm outline-none focus:border-[var(--color-primary)]"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
            aria-label="검색"
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* Row 2: 카운트 + 정렬 + 등록 버튼 */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-muted)]">
          총 {totalCount}개의 전문가상담
        </p>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-sm">
            <button
              onClick={() => handleSortChange("latest")}
              className={`px-1 ${
                activeSort === "latest"
                  ? "font-bold text-[var(--color-primary)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-body)]"
              }`}
            >
              최신순
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => handleSortChange("views")}
              className={`px-1 ${
                activeSort === "views"
                  ? "font-bold text-[var(--color-primary)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-body)]"
              }`}
            >
              조회순
            </button>
          </div>

          <button
            onClick={() => router.push("/expert-consultation/write")}
            className="flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)]"
          >
            <Pencil size={14} />
            상담등록
          </button>
        </div>
      </div>
    </div>
  );
}
