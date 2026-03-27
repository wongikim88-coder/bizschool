"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { allBooks, bookCategories } from "@/data/books";
import SearchAutocomplete from "@/components/books/SearchAutocomplete";

export default function SearchBar() {
  const [value, setValue] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isBooks = pathname === "/books";

  // Rotating placeholder
  const placeholderTexts: Record<string, string[]> = {
    "/": ["배우고 싶은 강의를 검색해보세요.", "관심있는 주제를 검색해보세요."],
    "/education": ["배우고 싶은 강의를 검색해보세요.", "관심있는 주제를 검색해보세요."],
    "/training": ["근로자 주도훈련 과정을 검색해보세요.", "관심있는 주제를 검색해보세요."],
    "/books": ["도서명 또는 저자를 검색하세요.", "관심있는 주제를 검색해보세요."],
    "/community": ["배우고 싶은 강의를 검색해보세요.", "관심있는 주제를 검색해보세요."],
  };
  const currentTexts = placeholderTexts[pathname] || placeholderTexts["/"];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (currentTexts.length <= 1) return;
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % currentTexts.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentTexts]);

  // Debounce: 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(value.trim());
    }, 50);
    return () => clearTimeout(timer);
  }, [value]);

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

  // 자동완성: title + author 매칭, 최대 5개
  const filteredBooks =
    isBooks && debouncedQuery.length >= 1
      ? allBooks
          .filter((book) => {
            const q = debouncedQuery.toLowerCase();
            return (
              book.title.toLowerCase().includes(q) ||
              book.author.toLowerCase().includes(q)
            );
          })
          .slice(0, 5)
      : [];

  const showAutocomplete =
    showPanel && isBooks && debouncedQuery.length >= 1 && filteredBooks.length > 0;
  const showBrowse =
    showPanel && isBooks && debouncedQuery.length === 0;

  const handleSearch = (searchValue?: string) => {
    const searchTerm = searchValue ?? value.trim();
    if (!searchTerm) return;
    if (isBooks) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("search", searchTerm);
      params.set("page", "1");
      router.push(`/books?${params.toString()}`);
    }
    setShowPanel(false);
  };

  const handleSelect = (title: string) => {
    setValue(title);
    setShowPanel(false);
    handleSearch(title);
  };

  const handleCategoryClick = (key: string) => {
    const params = new URLSearchParams();
    if (key !== "all") params.set("category", key);
    params.set("page", "1");
    router.push(`/books?${params.toString()}`);
    setShowPanel(false);
    setValue("");
  };

  const isFocused = useRef(false);

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-4" ref={containerRef}>
      <div className="group relative mx-auto max-w-[620px]">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setShowPanel(true);
          }}
          onFocus={() => {
            isFocused.current = true;
            if (isBooks) setShowPanel(true);
          }}
          onBlur={() => { isFocused.current = false; }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
              setShowPanel(false);
            }
            if (e.key === "Escape") setShowPanel(false);
          }}
          className="w-full rounded-full border border-gray-400 bg-[var(--color-light-bg)] py-4 pl-6 pr-16 text-base text-[var(--color-dark)] transition-all duration-200 group-focus-within:border-[var(--color-dark)] group-focus-within:bg-white focus:outline-none"
        />
        {!value && (
          <span
            className={`pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-base text-[var(--color-muted)] transition-all duration-300 ${
              isAnimating ? "-translate-y-[calc(50%+8px)] opacity-0" : "-translate-y-1/2 opacity-100"
            }`}
          >
            {currentTexts[placeholderIndex]}
          </span>
        )}
        {value ? (
          <button
            onClick={() => {
              setValue("");
              if (isBooks && searchParams.has("search")) {
                router.push("/books");
              }
            }}
            className="absolute right-2.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-[var(--color-muted)] hover:text-[var(--color-dark)]"
            aria-label="검색어 지우기"
          >
            <X size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleSearch()}
            className="absolute right-2.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-dark)] text-white transition-all hover:opacity-90"
          >
            <Search size={20} />
          </button>
        )}

        {/* 자동완성 드롭다운 — 검색어 입력 시 */}
        {showAutocomplete && (
          <SearchAutocomplete
            books={filteredBooks}
            query={debouncedQuery}
            onSelect={handleSelect}
          />
        )}

        {/* Browse Panel — 검색어 없을 때 카테고리 둘러보기 */}
        {showBrowse && (
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
