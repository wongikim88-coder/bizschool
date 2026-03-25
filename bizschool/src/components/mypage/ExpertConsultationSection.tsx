"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, PenSquare, Clock, CheckCircle, ArrowLeft, MessageSquare } from "lucide-react";
import { expertConsultations, EXPERT_POSTS_PER_PAGE } from "@/data/expert-consultation";
import { mockUser } from "@/data/mypage";
import type { ExpertConsultation, ExpertConsultationCategory } from "@/types";

interface ExpertConsultationSectionProps {
  page: number;
  viewId: string | null;
  filter: string;
  category: string;
}

const filterLabels: { key: string; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "pending", label: "대기중" },
  { key: "answered", label: "답변완료" },
];

const categoryLabels: { key: string; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "회계", label: "회계" },
  { key: "세무", label: "세무" },
  { key: "4대보험", label: "4대보험" },
  { key: "인사·총무", label: "인사·총무" },
];

function StatusBadge({ status }: { status: "pending" | "answered" }) {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
        <Clock size={12} />
        대기중
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
      <CheckCircle size={12} />
      답변완료
    </span>
  );
}

function ExpertDetail({ consultation }: { consultation: ExpertConsultation }) {
  const router = useRouter();

  return (
    <div>
      <button
        onClick={() => router.push("/mypage?tab=expert")}
        className="mb-6 flex items-center gap-1 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-body)]"
      >
        <ArrowLeft size={16} />
        목록으로
      </button>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-[var(--color-muted)]">
          {consultation.category}
        </span>
        <StatusBadge status={consultation.status} />
      </div>

      <h2 className="mt-2 text-xl font-bold text-[var(--color-dark)]">
        {consultation.title}
      </h2>

      <div className="mt-2 flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
        <span>{consultation.createdAt}</span>
      </div>

      <hr className="my-5 border-[var(--color-border)]" />

      <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--color-body)]">
        {consultation.content}
      </div>

      <div className="mt-8 rounded-lg bg-[var(--color-light-bg)] p-6">
        <div className="flex items-center gap-2 text-base font-bold text-[var(--color-dark)]">
          <MessageSquare size={18} />
          전문가 답변
        </div>

        <hr className="my-4 border-[var(--color-border)]" />

        {consultation.status === "answered" && consultation.answer ? (
          <>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--color-dark)]">
                {consultation.answer.expertName}
              </span>
              <span className="text-sm font-medium text-[var(--color-primary)]">
                {consultation.answer.expertTitle}
              </span>
              <span className="text-sm text-[var(--color-muted)]">
                · {consultation.answer.answeredAt}
              </span>
            </div>
            <div className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--color-body)]">
              {consultation.answer.content}
            </div>
          </>
        ) : (
          <p className="py-4 text-center text-sm text-[var(--color-muted)]">
            아직 답변이 등록되지 않았습니다.<br />
            전문가 답변을 기다려 주세요.
          </p>
        )}
      </div>
    </div>
  );
}

export default function ExpertConsultationSection({
  page,
  viewId,
  filter,
  category,
}: ExpertConsultationSectionProps) {
  const router = useRouter();

  // 내 상담만 필터 (1:1 private)
  const myConsultations = expertConsultations.filter(
    (c) => c.authorId === mockUser.id,
  );

  // Detail view
  if (viewId) {
    const consultation = myConsultations.find((c) => c.id === viewId);
    if (!consultation) {
      return (
        <div className="py-20 text-center">
          <p className="text-lg font-medium text-[var(--color-muted)]">
            상담을 찾을 수 없습니다
          </p>
          <button
            onClick={() => router.push("/mypage?tab=expert")}
            className="mt-4 text-sm text-[var(--color-primary)] hover:underline"
          >
            목록으로 돌아가기
          </button>
        </div>
      );
    }
    return <ExpertDetail consultation={consultation} />;
  }

  // List view - apply filters
  let filtered = [...myConsultations];

  if (filter && filter !== "all") {
    filtered = filtered.filter((c) => c.status === filter);
  }

  if (category && category !== "all") {
    filtered = filtered.filter((c) => c.category === category);
  }

  filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / EXPERT_POSTS_PER_PAGE);
  const startIndex = (page - 1) * EXPERT_POSTS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + EXPERT_POSTS_PER_PAGE);

  const pendingCount = myConsultations.filter((c) => c.status === "pending").length;
  const answeredCount = myConsultations.filter((c) => c.status === "answered").length;

  const getCounts = (key: string) => {
    if (key === "all") return myConsultations.length;
    if (key === "pending") return pendingCount;
    return answeredCount;
  };

  const buildUrl = (overrides: { filter?: string; category?: string; page?: number }) => {
    const params = new URLSearchParams();
    params.set("tab", "expert");

    const f = overrides.filter ?? filter;
    if (f && f !== "all") params.set("filter", f);

    const c = overrides.category ?? category;
    if (c && c !== "all") params.set("category", c);

    const p = overrides.page ?? 1;
    if (p > 1) params.set("page", String(p));

    return `/mypage?${params.toString()}`;
  };

  const handleFilterChange = (f: string) => {
    router.push(buildUrl({ filter: f, page: 1 }));
  };

  const handleCategoryChange = (c: string) => {
    router.push(buildUrl({ category: c, page: 1 }));
  };

  const handleViewDetail = (id: string) => {
    router.push(`/mypage?tab=expert&view=${id}`);
  };

  const goToPage = (p: number) => {
    router.push(buildUrl({ page: p }));
  };

  const getPageNumbers = () => {
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-[var(--color-muted)]">
          총 {totalCount}건의 상담
        </p>
        <button
          onClick={() => router.push("/expert-consultation/write")}
          className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 md:w-auto"
        >
          <PenSquare size={16} />
          상담 신청
        </button>
      </div>

      {/* Status Filter */}
      <div className="mt-3 flex gap-2">
        {filterLabels.map((f) => (
          <button
            key={f.key}
            onClick={() => handleFilterChange(f.key)}
            className={`cursor-pointer rounded-full px-3 py-1 text-sm transition-colors ${
              (filter || "all") === f.key
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-light-bg)] text-[var(--color-muted)] hover:bg-gray-200"
            }`}
          >
            {f.label}({getCounts(f.key)})
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="mt-2 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {categoryLabels.map((c) => (
          <button
            key={c.key}
            onClick={() => handleCategoryChange(c.key)}
            className={`shrink-0 rounded-full px-3 py-1 text-sm transition-colors ${
              (category || "all") === c.key
                ? "bg-[var(--color-dark)] text-white"
                : "bg-gray-100 text-[var(--color-body)] hover:bg-gray-200"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {paginated.length === 0 ? (
        <div className="mt-12 py-20 text-center">
          <p className="text-lg font-medium text-[var(--color-muted)]">
            등록한 상담이 없습니다
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            전문가상담 신청을 통해 궁금한 점을 문의해보세요
          </p>
        </div>
      ) : (
        <>
          {/* Desktop: Table */}
          <div className="mt-4 hidden min-h-[480px] overflow-x-auto md:block">
            <table className="w-full table-fixed text-sm">
              <colgroup>
                <col className="w-[10%]" />
                <col className="w-[50%]" />
                <col className="w-[15%]" />
                <col className="w-[25%]" />
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
                {paginated.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => handleViewDetail(c.id)}
                    className="cursor-pointer border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-light-bg)]"
                  >
                    <td className="px-4 py-4 text-center text-[var(--color-body)]">
                      {c.category}
                    </td>
                    <td className="truncate px-4 py-4 font-medium text-[var(--color-dark)]">
                      {c.title}
                    </td>
                    <td className="px-4 py-4 text-center text-[var(--color-body)]">
                      {c.createdAt}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <StatusBadge status={c.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: Cards */}
          <div className="mt-4 min-h-[400px] space-y-3 md:hidden">
            {paginated.map((c) => (
              <div
                key={c.id}
                onClick={() => handleViewDetail(c.id)}
                className="cursor-pointer rounded-xl border border-[var(--color-border)] bg-white p-4 transition-colors hover:border-[var(--color-primary)]/30"
              >
                <div className="flex items-center gap-2">
                  <StatusBadge status={c.status} />
                  <span className="text-xs text-[var(--color-muted)]">
                    {c.category}
                  </span>
                </div>
                <h4 className="mt-2 font-medium text-[var(--color-dark)] line-clamp-1">
                  {c.title}
                </h4>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {c.createdAt}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="페이지 이동" className="flex items-center justify-center gap-1 py-8">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)] disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
                aria-label="이전 페이지"
              >
                <ChevronLeft size={18} />
              </button>
              {getPageNumbers().map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  aria-current={p === page ? "page" : undefined}
                  className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-sm font-medium transition-colors ${
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
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)] disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
                aria-label="다음 페이지"
              >
                <ChevronRight size={18} />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
