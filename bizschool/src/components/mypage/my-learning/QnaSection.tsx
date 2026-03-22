"use client";

import { useState, useMemo } from "react";
import type { CourseQna, QnaCategoryFilter, QnaAnswerStatusFilter } from "@/types";
import { mockCourseQnas, QNA_PER_PAGE } from "@/data/mypage";
import QnaFilterBar from "./QnaFilterBar";
import { QnaTableRow, QnaMobileCard } from "./QnaCard";
import QnaDetail from "./QnaDetail";
import QnaWriteForm from "./QnaWriteForm";

type ViewMode = "list" | "detail" | "write";

export default function QnaSection() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedQnaId, setSelectedQnaId] = useState<string | null>(null);
  const [allQnas, setAllQnas] = useState<CourseQna[]>(mockCourseQnas);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<QnaCategoryFilter>("전체");
  const [answerStatusFilter, setAnswerStatusFilter] =
    useState<QnaAnswerStatusFilter>("전체");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered data
  const filteredQnas = useMemo(() => {
    let result = allQnas;

    if (categoryFilter !== "전체") {
      result = result.filter((q) => q.courseCategory === categoryFilter);
    }

    if (answerStatusFilter !== "전체") {
      result = result.filter((q) => q.answerStatus === answerStatusFilter);
    }

    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase();
      result = result.filter(
        (q) =>
          q.title.toLowerCase().includes(kw) ||
          q.courseTitle.toLowerCase().includes(kw)
      );
    }

    return result;
  }, [allQnas, categoryFilter, answerStatusFilter, searchKeyword]);

  // Counts (based on category + search filtered, before answer status filter)
  const baseFiltered = useMemo(() => {
    let result = allQnas;
    if (categoryFilter !== "전체") {
      result = result.filter((q) => q.courseCategory === categoryFilter);
    }
    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase();
      result = result.filter(
        (q) =>
          q.title.toLowerCase().includes(kw) ||
          q.courseTitle.toLowerCase().includes(kw)
      );
    }
    return result;
  }, [allQnas, categoryFilter, searchKeyword]);

  const totalCount = baseFiltered.length;
  const pendingCount = baseFiltered.filter(
    (q) => q.answerStatus === "답변대기"
  ).length;
  const answeredCount = baseFiltered.filter(
    (q) => q.answerStatus === "답변완료"
  ).length;

  // Pagination
  const totalPages = Math.ceil(filteredQnas.length / QNA_PER_PAGE);
  const startIndex = (currentPage - 1) * QNA_PER_PAGE;
  const paginatedQnas = filteredQnas.slice(
    startIndex,
    startIndex + QNA_PER_PAGE
  );

  // Handlers
  const handleViewDetail = (id: string) => {
    setSelectedQnaId(id);
    setViewMode("detail");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedQnaId(null);
  };

  const handleWriteClick = () => {
    setViewMode("write");
  };

  const handleSubmitQna = (newQna: CourseQna) => {
    setAllQnas((prev) => [newQna, ...prev]);
    setViewMode("list");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset page when filters change
  const handleCategoryFilterChange = (filter: QnaCategoryFilter) => {
    setCategoryFilter(filter);
    setCurrentPage(1);
  };

  const handleAnswerStatusFilterChange = (filter: QnaAnswerStatusFilter) => {
    setAnswerStatusFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchKeywordChange = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
  };

  // Detail view
  if (viewMode === "detail" && selectedQnaId) {
    const selectedQna = allQnas.find((q) => q.id === selectedQnaId);
    if (!selectedQna) {
      setViewMode("list");
      return null;
    }
    return <QnaDetail qna={selectedQna} onBack={handleBackToList} />;
  }

  // Write view
  if (viewMode === "write") {
    return <QnaWriteForm onSubmit={handleSubmitQna} onCancel={handleBackToList} />;
  }

  // List view
  return (
    <div>
      <QnaFilterBar
        categoryFilter={categoryFilter}
        onCategoryFilterChange={handleCategoryFilterChange}
        answerStatusFilter={answerStatusFilter}
        onAnswerStatusFilterChange={handleAnswerStatusFilterChange}
        searchKeyword={searchKeyword}
        onSearchKeywordChange={handleSearchKeywordChange}
        onWriteClick={handleWriteClick}
        totalCount={totalCount}
        pendingCount={pendingCount}
        answeredCount={answeredCount}
      />

      {/* Empty State */}
      {paginatedQnas.length === 0 ? (
        <div className="mt-12 py-20 text-center">
          <p className="text-lg font-medium text-[var(--color-muted)]">
            해당하는 질문이 없습니다
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            질문하기 버튼을 눌러 새 질문을 작성해보세요
          </p>
        </div>
      ) : (
        <>
          {/* Desktop: Table */}
          <div className="mt-4 hidden min-h-[572px] overflow-x-auto md:block">
            <table className="w-full table-fixed text-sm">
              <colgroup>
                <col className="w-[12%]" />
                <col className="w-[22%]" />
                <col className="w-[33%]" />
                <col className="w-[16%]" />
                <col className="w-[17%]" />
              </colgroup>
              <thead>
                <tr className="bg-[var(--color-light-bg)]">
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                    카테고리
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--color-muted)]">
                    강의명
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
                {paginatedQnas.map((qna) => (
                  <QnaTableRow
                    key={qna.id}
                    qna={qna}
                    onClick={handleViewDetail}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: Cards */}
          <div className="mt-4 min-h-[480px] space-y-3 md:hidden">
            {paginatedQnas.map((qna) => (
              <QnaMobileCard
                key={qna.id}
                qna={qna}
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
