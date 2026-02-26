import { ShoppingCart, CreditCard } from "lucide-react";
import type { Book } from "@/types";

export default function BookListCard({ book }: { book: Book }) {
  const hasDiscount = book.originalPrice && book.discountRate;

  return (
    <article className="border-b border-[var(--color-border)] py-6 last:border-b-0">
      <div className="flex gap-4 md:gap-6">
        {/* Book Cover */}
        <div className="h-[160px] w-[120px] flex-shrink-0 overflow-hidden rounded-lg shadow-sm md:h-[240px] md:w-[180px]">
          <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-gray-200 to-gray-300 p-3">
            <div className="text-center">
              <p className="text-[10px] font-bold leading-tight text-gray-600 md:text-xs">
                {book.title.length > 20 ? book.title.slice(0, 20) + "..." : book.title}
              </p>
              <p className="mt-1 text-[8px] text-gray-500 md:mt-2 md:text-[10px]">{book.author}</p>
            </div>
          </div>
        </div>

        {/* Book Info */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Title */}
          <h3 className="text-base font-bold text-[var(--color-dark)] md:text-xl">
            {book.title}
            {book.isSoldOut && (
              <span className="ml-1 text-sm font-bold text-[var(--color-red)] md:text-base">[품절]</span>
            )}
          </h3>

          {/* Meta */}
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {book.author}
            {book.publisher && <span> | {book.publisher}</span>}
            {book.publishDate && <span> | {book.publishDate}</span>}
          </p>

          {/* Price */}
          <div className="mt-2">
            {hasDiscount ? (
              <>
                <span className="text-sm text-[var(--color-muted)] line-through">
                  정가 : {book.originalPrice!.toLocaleString()}원
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-[var(--color-muted)]">할인가 :</span>
                  <span className="text-base font-bold text-[var(--color-red)] md:text-lg">
                    {book.price.toLocaleString()}원
                  </span>
                  <span className="text-sm text-[var(--color-red)]">({book.discountRate}%할인)</span>
                </div>
              </>
            ) : (
              <span className="text-sm text-[var(--color-muted)]">
                정가 : <span className="text-base font-bold text-[var(--color-dark)] md:text-lg">{book.price.toLocaleString()}원</span>
              </span>
            )}
          </div>

          {/* Description */}
          {book.description && (
            <div className="mt-3 hidden rounded-lg bg-[var(--color-light-bg)] p-4 text-sm leading-relaxed text-[var(--color-body)] sm:block">
              {book.description.length > 150 ? book.description.slice(0, 150) + "..." : book.description}
            </div>
          )}
        </div>

        {/* Buttons (Desktop) */}
        <div className="hidden flex-shrink-0 flex-col gap-2 self-start md:flex">
          <button
            className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
            aria-label={`${book.title} 장바구니에 담기`}
          >
            <ShoppingCart size={16} />
            장바구니
          </button>
          <button
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
            aria-label={`${book.title} 바로구매`}
          >
            <CreditCard size={16} />
            바로구매
          </button>
        </div>
      </div>

      {/* Description (Mobile) */}
      {book.description && (
        <div className="mt-3 rounded-lg bg-[var(--color-light-bg)] p-3 text-sm leading-relaxed text-[var(--color-body)] sm:hidden">
          {book.description.length > 100 ? book.description.slice(0, 100) + "..." : book.description}
        </div>
      )}

      {/* Buttons (Mobile) */}
      <div className="mt-3 flex gap-2 md:hidden">
        <button
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
          aria-label={`${book.title} 장바구니에 담기`}
        >
          <ShoppingCart size={14} />
          장바구니
        </button>
        <button
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
          aria-label={`${book.title} 바로구매`}
        >
          <CreditCard size={14} />
          바로구매
        </button>
      </div>
    </article>
  );
}
