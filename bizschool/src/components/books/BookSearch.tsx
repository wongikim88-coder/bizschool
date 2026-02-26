"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

interface BookSearchProps {
  currentSearch: string;
}

export default function BookSearch({ currentSearch }: BookSearchProps) {
  const [value, setValue] = useState(currentSearch);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("search", value.trim());
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`/books?${params.toString()}`);
  };

  return (
    <form
      aria-label="도서 검색"
      className="mt-4 flex max-w-md gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
    >
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="도서명 또는 저자를 검색하세요"
          className="w-full rounded-lg border border-[var(--color-border)] py-2 pl-9 pr-4 text-sm text-[var(--color-dark)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-[var(--color-dark)] px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
      >
        검색
      </button>
    </form>
  );
}
