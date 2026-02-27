import { Suspense } from "react";
import type { Metadata } from "next";
import { allBooks, BOOKS_PER_PAGE } from "@/data/books";
import BookBanner from "@/components/books/BookBanner";
import CategoryFilter from "@/components/books/CategoryFilter";

import BookListCard from "@/components/books/BookListCard";
import Pagination from "@/components/books/Pagination";

export const metadata: Metadata = {
  title: "도서 - BIZSCHOOL",
  description: "비즈니스 성장을 위한 전문 도서를 만나보세요. 경영전략, 마케팅, 재무회계, 자기계발, 리더십, IT/기술 분야의 엄선된 도서를 제공합니다.",
};

interface BooksPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
  }>;
}

function BooksContent({
  page,
  category,
  search,
}: {
  page: number;
  category: string;
  search: string;
}) {
  // Step 1: Filter by search (across all categories)
  const searchFiltered = search
    ? allBooks.filter((book) => {
        const query = search.toLowerCase();
        return (
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
        );
      })
    : allBooks;

  // Step 2: Calculate per-category counts
  const categoryCounts: Record<string, number> = { all: searchFiltered.length };
  for (const book of searchFiltered) {
    if (book.category) {
      categoryCounts[book.category] = (categoryCounts[book.category] ?? 0) + 1;
    }
  }

  // Step 3: Filter by selected category
  const filtered = category === "all"
    ? searchFiltered
    : searchFiltered.filter((book) => book.category === category);

  const totalPages = Math.ceil(filtered.length / BOOKS_PER_PAGE);
  const safePage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (safePage - 1) * BOOKS_PER_PAGE;
  const paginatedBooks = filtered.slice(startIndex, startIndex + BOOKS_PER_PAGE);

  return (
    <>
      <Suspense>
        <CategoryFilter currentCategory={category} categoryCounts={categoryCounts} />
      </Suspense>
      {/* Result count */}
      <div className="mt-6 flex items-center gap-2 text-sm text-[var(--color-muted)]">
        {search ? (
          <>
            <span>
              &lsquo;{search}&rsquo;에 대한 <span className="font-semibold text-[var(--color-dark)]">{filtered.length}</span>권의 검색 결과
            </span>
            <a
              href="/books"
              className="inline-flex items-center gap-1 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/20"
              aria-label={`"${search}" 검색 해제`}
            >
              {search}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </a>
          </>
        ) : (
          <span>
            총 <span className="font-semibold text-[var(--color-dark)]">{filtered.length}</span>권
          </span>
        )}
      </div>

      {/* Book list */}
      <div className="mt-4">
        {paginatedBooks.length > 0 ? (
          paginatedBooks.map((book) => <BookListCard key={book.id} book={book} />)
        ) : (
          <div className="py-20 text-center text-[var(--color-muted)]">
            <p className="text-lg font-medium">검색 결과가 없습니다</p>
            <p className="mt-1 text-sm">다른 검색어나 카테고리를 시도해 보세요</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Suspense>
        <Pagination currentPage={safePage} totalPages={totalPages} />
      </Suspense>
    </>
  );
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const category = params.category || "all";
  const search = params.search || "";

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-12">
      <BookBanner />
      <BooksContent page={page} category={category} search={search} />
    </div>
  );
}
