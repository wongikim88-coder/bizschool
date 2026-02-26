"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { bookCategories } from "@/data/books";

interface CategoryFilterProps {
  currentCategory: string;
}

export default function CategoryFilter({ currentCategory }: CategoryFilterProps) {
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
      <div className="flex gap-2">
        {bookCategories.map((cat) => (
          <button
            key={cat.key}
            role="tab"
            aria-selected={currentCategory === cat.key}
            onClick={() => handleCategoryChange(cat.key)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              currentCategory === cat.key
                ? "bg-[var(--color-primary)] text-white"
                : "border border-[var(--color-border)] text-[var(--color-body)] hover:bg-[var(--color-light-bg)]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
