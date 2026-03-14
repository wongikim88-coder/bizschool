"use client";

import { useRouter } from "next/navigation";
import { Plus, Clock, CheckCircle } from "lucide-react";
import type { Inquiry, InquiryFilter } from "@/types";
import MypagePagination from "./MypagePagination";
import { INQUIRIES_PER_PAGE } from "@/data/mypage";

interface InquiryListProps {
  inquiries: Inquiry[];
  filter: InquiryFilter;
  page: number;
}

const filterLabels: { key: InquiryFilter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "pending", label: "대기중" },
  { key: "answered", label: "답변완료" },
];

function StatusBadge({ status }: { status: "pending" | "answered" }) {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600">
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

export default function InquiryList({ inquiries, filter, page }: InquiryListProps) {
  const router = useRouter();

  const filtered =
    filter === "all"
      ? inquiries
      : inquiries.filter((inq) => inq.status === filter);

  const totalPages = Math.ceil(filtered.length / INQUIRIES_PER_PAGE);
  const startIndex = (page - 1) * INQUIRIES_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + INQUIRIES_PER_PAGE);

  const pendingCount = inquiries.filter((i) => i.status === "pending").length;
  const answeredCount = inquiries.filter((i) => i.status === "answered").length;

  const getCounts = (key: InquiryFilter) => {
    if (key === "all") return inquiries.length;
    if (key === "pending") return pendingCount;
    return answeredCount;
  };

  const handleFilterChange = (f: InquiryFilter) => {
    if (f === "all") {
      router.push("/mypage?tab=inquiry");
    } else {
      router.push(`/mypage?tab=inquiry&filter=${f}`);
    }
  };

  const handleViewDetail = (id: number) => {
    router.push(`/mypage?tab=inquiry&view=${id}`);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm text-[var(--color-muted)]">
            총 {filtered.length}건의 문의
          </p>
        </div>
        <button
          onClick={() => router.push("/mypage?tab=inquiry&write=true")}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
        >
          <Plus size={16} />
          문의하기
        </button>
      </div>

      {/* Filters */}
      <div className="mt-3 flex gap-2">
        {filterLabels.map((f) => (
          <button
            key={f.key}
            onClick={() => handleFilterChange(f.key)}
            className={`cursor-pointer rounded-full px-3 py-1 text-sm transition-colors ${
              filter === f.key
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-light-bg)] text-[var(--color-muted)] hover:bg-gray-200"
            }`}
          >
            {f.label}({getCounts(f.key)})
          </button>
        ))}
      </div>

      {/* Empty State */}
      {paginated.length === 0 ? (
        <div className="mt-12 py-20 text-center">
          <p className="text-lg font-medium text-[var(--color-muted)]">
            해당하는 문의가 없습니다
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            문의하기 버튼을 눌러 새 문의를 작성해보세요
          </p>
        </div>
      ) : (
        <>
          {/* Desktop: Table */}
          <div className="mt-4 hidden min-h-[572px] overflow-x-auto md:block">
            <table className="w-full table-fixed text-sm">
              <colgroup>
                <col className="w-[8%]" />
                <col className="w-[12%]" />
                <col className="w-[45%]" />
                <col className="w-[18%]" />
                <col className="w-[17%]" />
              </colgroup>
              <thead>
                <tr className="bg-[var(--color-light-bg)]">
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                    No
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                    카테고리
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
                {paginated.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    onClick={() => handleViewDetail(inquiry.id)}
                    className="cursor-pointer border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-light-bg)]"
                  >
                    <td className="px-4 py-4 text-center text-[var(--color-muted)]">
                      {inquiry.id}
                    </td>
                    <td className="px-4 py-4 text-center text-[var(--color-body)]">
                      {inquiry.category}
                    </td>
                    <td className="truncate px-4 py-4 font-medium text-[var(--color-dark)]">
                      {inquiry.title}
                    </td>
                    <td className="px-4 py-4 text-center text-[var(--color-body)]">
                      {inquiry.createdAt}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <StatusBadge status={inquiry.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: Cards */}
          <div className="mt-4 min-h-[480px] space-y-3 md:hidden">
            {paginated.map((inquiry) => (
              <div
                key={inquiry.id}
                onClick={() => handleViewDetail(inquiry.id)}
                className="cursor-pointer rounded-xl border border-[var(--color-border)] bg-white p-4 transition-colors hover:border-[var(--color-primary)]/30"
              >
                <div className="flex items-center gap-2">
                  <StatusBadge status={inquiry.status} />
                  <span className="text-xs text-[var(--color-muted)]">
                    {inquiry.category}
                  </span>
                </div>
                <h4 className="mt-2 font-medium text-[var(--color-dark)] line-clamp-1">
                  {inquiry.title}
                </h4>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {inquiry.createdAt}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <MypagePagination
            currentPage={page}
            totalPages={totalPages}
            currentFilter={filter}
          />
        </>
      )}
    </div>
  );
}
