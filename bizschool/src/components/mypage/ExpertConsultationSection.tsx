"use client";

import { useState, useMemo } from "react";
import type { ExpertConsultation } from "@/types";
import { expertConsultations, EXPERT_POSTS_PER_PAGE } from "@/data/expert-consultation";
import { mockUser } from "@/data/mypage";
import ExpertFilterBar from "./expert-consultation/ExpertFilterBar";
import type {
  ExpertStatusFilter,
  ExpertCategoryFilter,
} from "./expert-consultation/ExpertFilterBar";
import { ExpertTableRow, ExpertMobileCard } from "./expert-consultation/ExpertCard";
import ExpertDetail from "./expert-consultation/ExpertDetail";
import ExpertWriteForm from "./expert-consultation/ExpertWriteForm";

type ViewMode = "list" | "detail" | "write";

export default function ExpertConsultationSection() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [allConsultations, setAllConsultations] = useState<ExpertConsultation[]>(
    () => expertConsultations.filter((c) => c.authorId === mockUser.id)
  );

  // Filters
  const [statusFilter, setStatusFilter] = useState<ExpertStatusFilter>("all");
  const [categoryFilter, setCategoryFilter] =
    useState<ExpertCategoryFilter>("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered data
  const filteredConsultations = useMemo(() => {
    let result = allConsultations;

    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter((c) => c.category === categoryFilter);
    }

    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase();
      result = result.filter((c) => c.title.toLowerCase().includes(kw));
    }

    return result;
  }, [allConsultations, statusFilter, categoryFilter, searchKeyword]);

  // Counts (based on category + search filtered, before status filter)
  const baseFiltered = useMemo(() => {
    let result = allConsultations;
    if (categoryFilter !== "all") {
      result = result.filter((c) => c.category === categoryFilter);
    }
    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase();
      result = result.filter((c) => c.title.toLowerCase().includes(kw));
    }
    return result;
  }, [allConsultations, categoryFilter, searchKeyword]);

  const totalCount = baseFiltered.length;
  const pendingCount = baseFiltered.filter(
    (c) => c.status === "pending"
  ).length;
  const answeredCount = baseFiltered.filter(
    (c) => c.status === "answered"
  ).length;

  // Pagination
  const totalPages = Math.ceil(
    filteredConsultations.length / EXPERT_POSTS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * EXPERT_POSTS_PER_PAGE;
  const paginatedConsultations = filteredConsultations.slice(
    startIndex,
    startIndex + EXPERT_POSTS_PER_PAGE
  );

  // Handlers
  const handleViewDetail = (id: string) => {
    setSelectedId(id);
    setViewMode("detail");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedId(null);
  };

  const handleWriteClick = () => {
    setViewMode("write");
  };

  const handleSubmit = (newConsultation: ExpertConsultation) => {
    setAllConsultations((prev) => [newConsultation, ...prev]);
    setViewMode("list");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset page when filters change
  const handleStatusFilterChange = (filter: ExpertStatusFilter) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (filter: ExpertCategoryFilter) => {
    setCategoryFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchKeywordChange = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
  };

  // Detail view
  if (viewMode === "detail" && selectedId) {
    const selected = allConsultations.find((c) => c.id === selectedId);
    if (!selected) {
      setViewMode("list");
      return null;
    }
    return <ExpertDetail consultation={selected} onBack={handleBackToList} />;
  }

  // Write view
  if (viewMode === "write") {
    return (
      <ExpertWriteForm onSubmit={handleSubmit} onCancel={handleBackToList} />
    );
  }

  // List view
  return (
    <div>
      <ExpertFilterBar
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={handleCategoryFilterChange}
        searchKeyword={searchKeyword}
        onSearchKeywordChange={handleSearchKeywordChange}
        onWriteClick={handleWriteClick}
        totalCount={totalCount}
        pendingCount={pendingCount}
        answeredCount={answeredCount}
      />

      {/* Empty State */}
      {paginatedConsultations.length === 0 ? (
        <div className="mt-12 py-20 text-center">
          <p className="text-lg font-medium text-[var(--color-muted)]">
            등록한 상담이 없습니다
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            상담 신청 버튼을 눌러 전문가에게 문의해보세요
          </p>
        </div>
      ) : (
        <>
          {/* Desktop: Table */}
          <div className="mt-4 hidden min-h-[572px] overflow-x-auto md:block">
            <table className="w-full table-fixed text-sm">
              <colgroup>
                <col className="w-[12%]" />
                <col className="w-[55%]" />
                <col className="w-[16%]" />
                <col className="w-[17%]" />
              </colgroup>
              <thead>
                <tr className="bg-[var(--color-light-bg)]">
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                    분야
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-muted)]">
                    제목
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                    작성일
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedConsultations.map((c) => (
                  <ExpertTableRow
                    key={c.id}
                    consultation={c}
                    onClick={handleViewDetail}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: Cards */}
          <div className="mt-4 min-h-[480px] space-y-3 md:hidden">
            {paginatedConsultations.map((c) => (
              <ExpertMobileCard
                key={c.id}
                consultation={c}
                onClick={handleViewDetail}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="rounded-lg px-3 py-2 text-sm text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`min-w-[36px] rounded-lg px-3 py-2 text-sm transition-colors ${
                      currentPage === page
                        ? "bg-[var(--color-primary)] font-medium text-white"
                        : "text-[var(--color-muted)] hover:bg-[var(--color-light-bg)]"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="rounded-lg px-3 py-2 text-sm text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
