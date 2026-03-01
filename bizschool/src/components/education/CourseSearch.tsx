"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

interface CourseSearchProps {
  defaultValue?: string;
}

export default function CourseSearch({ defaultValue = "" }: CourseSearchProps) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("search", value.trim());
    } else {
      params.delete("search");
    }
    router.push(`/education?${params.toString()}`);
  };

  return (
    <form
      aria-label="교육과정 검색"
      className="mt-8 flex max-w-md gap-2"
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
          placeholder="검색어를 입력하세요"
          aria-label="교육과정 검색"
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
