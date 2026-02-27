"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { bookCategories } from "@/data/books";

interface CategoryFilterProps {
  currentCategory: string;
  categoryCounts: Record<string, number>;
}

export default function CategoryFilter({ currentCategory, categoryCounts }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "all") {
      params.delete("category");
    } else {
      params.set("category", key);
    }
    params.set("page", "1");
    router.push(`/books?${params.toString()}`);
  };

  return (
    <div className="mt-6 overflow-x-auto" role="tablist" aria-label="도서 카테고리">
      <div className="flex border-b border-[var(--color-border)]">
        {bookCategories.map((cat) => {
          const count = categoryCounts[cat.key] ?? 0;
          const isActive = currentCategory === cat.key;
          return (
            <button
              key={cat.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleCategoryChange(cat.key)}
              className={`shrink-0 px-5 py-3 text-sm transition-colors ${
                isActive
                  ? "mb-[-1px] border-b-2 border-[var(--color-primary)] font-semibold text-[var(--color-dark)]"
                  : "text-[var(--color-muted)] hover:bg-[var(--color-light-bg)] hover:text-[var(--color-dark)]"
              }`}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>
    </div>
  );
}
