import Link from "next/link";
import { ChevronRight } from "lucide-react";
import BookCard from "@/components/cards/BookCard";
import type { Book } from "@/types";

export default function RecommendedBooks({ books }: { books: Book[] }) {
  return (
    <section className="bg-[var(--color-light-bg)]">
      <div className="mx-auto max-w-[1200px] px-4 py-12">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[var(--color-dark-navy)]">추천도서</h2>
          <Link
            href="/books"
            className="flex items-center gap-1 text-sm font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)]"
          >
            더보기
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* Card Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {books.slice(0, 4).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
}
