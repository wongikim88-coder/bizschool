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
  // Filter by category
  let filtered = category === "all"
    ? allBooks
    : allBooks.filter((book) => book.category === category);

  // Filter by search
  if (search) {
    const query = search.toLowerCase();
    filtered = filtered.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
  }

  const totalPages = Math.ceil(filtered.length / BOOKS_PER_PAGE);
  const safePage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (safePage - 1) * BOOKS_PER_PAGE;
  const paginatedBooks = filtered.slice(startIndex, startIndex + BOOKS_PER_PAGE);

  return (
    <>
      <Suspense>
        <CategoryFilter currentCategory={category} />
      </Suspense>
      {/* Result count */}
      <div className="mt-6 text-sm text-[var(--color-muted)]">
        총 <span className="font-semibold text-[var(--color-dark)]">{filtered.length}</span>권
        {search && (
          <span>
            {" "}&middot; &quot;{search}&quot; 검색 결과
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
