"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface NoticeSearchProps {
  initialSearch: string;
  totalCount: number;
  isSearchResult: boolean;
}

export default function NoticeSearch({
  initialSearch,
  totalCount,
  isSearchResult,
}: NoticeSearchProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(initialSearch);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (trimmed) {
      router.push(`/notice?search=${encodeURIComponent(trimmed)}&page=1`);
    } else {
      router.push("/notice");
    }
  };

  const handleReset = () => {
    setKeyword("");
    router.push("/notice");
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
          />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="공지사항 검색"
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

      <div className="mt-3 text-sm text-[var(--color-muted)]">
        {isSearchResult ? (
          <span>
            검색결과 {totalCount}건
            <button
              onClick={handleReset}
              className="ml-2 text-[var(--color-primary)] hover:underline"
            >
              초기화
            </button>
          </span>
        ) : (
          <span>총 {totalCount}개의 공지사항</span>
        )}
      </div>
    </div>
  );
}
