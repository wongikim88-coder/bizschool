"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { bookCategories } from "@/data/books";

export default function SearchBar() {
  const [value, setValue] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isBooks = pathname === "/books";

  // Outside click handler
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowPanel(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close panel on route change
  useEffect(() => {
    setShowPanel(false);
  }, [pathname]);

  // Sync input with URL search param (books page only)
  useEffect(() => {
    if (isBooks) {
      const urlSearch = searchParams.get("search") || "";
      setValue(urlSearch);
    } else {
      setValue("");
    }
  }, [isBooks, searchParams]);

  const handleSearch = () => {
    if (!value.trim()) return;
    if (isBooks) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("search", value.trim());
      params.set("page", "1");
      router.push(`/books?${params.toString()}`);
    }
    setShowPanel(false);
  };

  const handleCategoryClick = (key: string) => {
    const params = new URLSearchParams();
    if (key !== "all") params.set("category", key);
    params.set("page", "1");
    router.push(`/books?${params.toString()}`);
    setShowPanel(false);
    setValue("");
  };

  const placeholder = isBooks
    ? "도서명 또는 저자를 검색하세요"
    : "배우고 싶은 강의를 검색해보세요";

  return (
    <div className="mx-auto max-w-[800px] px-4 py-4" ref={containerRef}>
      <div className="relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => isBooks && setShowPanel(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
            if (e.key === "Escape") setShowPanel(false);
          }}
          placeholder={placeholder}
          className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-light-bg)] py-3.5 pl-12 pr-10 text-sm text-[var(--color-dark)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
        />
        {value && (
          <button
            onClick={() => {
              setValue("");
              if (isBooks && searchParams.has("search")) {
                router.push("/books");
              }
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-[var(--color-muted)] hover:text-[var(--color-dark)]"
            aria-label="검색어 지우기"
          >
            <X size={16} />
          </button>
        )}

        {/* Browse Panel — 도서 페이지에서만 표시 */}
        {showPanel && isBooks && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-lg">
            <p className="mb-3 text-xs font-semibold text-[var(--color-muted)]">
              둘러보기
            </p>
            <div className="flex flex-wrap gap-2">
              {bookCategories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryClick(cat.key)}
                  className="rounded-full border border-[var(--color-border)] px-4 py-1.5 text-sm text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)] hover:text-[var(--color-dark)]"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
