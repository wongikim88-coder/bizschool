import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Star, ChevronLeft } from "lucide-react";
import { allBooks } from "@/data/books";
import BookPreviewButton from "@/components/books/BookPreviewButton";
import BookStickyBar from "@/components/books/BookStickyBar";
import PointInfoButton from "@/components/books/PointInfoButton";
import ShippingInfoButton from "@/components/books/ShippingInfoButton";
import DeliveryEstimate from "@/components/books/DeliveryEstimate";

interface BookDetailProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: BookDetailProps): Promise<Metadata> {
  const { id } = await params;
  const book = allBooks.find((b) => b.id === id);
  return {
    title: book ? `${book.title} | BIZSCHOOL` : "도서 | BIZSCHOOL",
    description: book?.description ?? book?.title,
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <Star
            key={i}
            size={18}
            className={
              filled
                ? "fill-yellow-400 text-yellow-400"
                : half
                  ? "fill-yellow-400/50 text-yellow-400"
                  : "text-gray-300"
            }
          />
        );
      })}
    </div>
  );
}

export default async function BookDetailPage({ params }: BookDetailProps) {
  const { id } = await params;
  const book = allBooks.find((b) => b.id === id);

  if (!book) notFound();

  const hasDiscount = book.originalPrice && book.discountRate;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 pb-24 md:py-12 md:pb-28">
      {/* ── 상단: 도서 정보 ── */}
      <div className="flex flex-col gap-6 md:flex-row md:gap-20">
        {/* Cover + Preview */}
        <div className="mx-auto flex-shrink-0 md:mx-0">
          <div className="relative mx-auto h-[380px] w-[270px] overflow-hidden rounded-lg shadow-md md:h-[580px] md:w-[420px]">
            <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-gray-200 to-gray-300 p-6">
              <p className="text-center text-sm font-bold leading-tight text-gray-600 md:text-lg">
                {book.title.length > 30 ? book.title.slice(0, 30) + "..." : book.title}
              </p>
              <p className="mt-2 text-xs text-gray-500 md:text-sm">{book.author}</p>
            </div>
            {/* Badges */}
            {book.badges && book.badges.length > 0 && (
              <div className="absolute left-2 top-2 flex flex-col gap-1">
                {book.badges.map((badge) => (
                  <span
                    key={badge.label}
                    className={`rounded px-2 py-0.5 text-[10px] font-bold text-white ${
                      badge.variant === "green"
                        ? "bg-emerald-500"
                        : badge.variant === "primary"
                          ? "bg-[var(--color-primary)]"
                          : badge.variant === "red"
                            ? "bg-red-500"
                            : badge.variant === "blue"
                              ? "bg-blue-500"
                              : "bg-gray-500"
                    }`}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Preview Button below cover */}
          {book.preview && (
            <div className="mt-2 mx-auto w-[270px] md:w-[420px]">
              <BookPreviewButton book={book} variant="inline" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col">
          <h1 className="text-xl font-bold text-[var(--color-dark)] md:text-2xl">
            {book.title}
            {book.isSoldOut && (
              <span className="ml-2 text-base font-bold text-[var(--color-red)]">[품절]</span>
            )}
          </h1>

          {/* 저자/출판 정보 */}
          <div className="mt-2 pt-2">
            <p className="text-sm text-[var(--color-muted)]">
              {book.author}
              {book.publisher && <span> | {book.publisher}</span>}
              {book.publishDate && <span> | {book.publishDate}</span>}
            </p>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <StarRating rating={book.rating} />
              <span className="text-sm font-bold text-[var(--color-dark)]">{book.rating}</span>
              <span className="text-sm text-[var(--color-muted)]">
                ({book.reviewCount}개의 리뷰)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="mt-4 pt-4">
            {hasDiscount ? (
              <>
                <div className="text-sm text-[var(--color-muted)]">
                  정가 :{" "}
                  <span className="line-through">
                    {book.originalPrice!.toLocaleString()}원
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[var(--color-dark)]">
                    {book.price.toLocaleString()}원
                  </span>
                  <span className="text-2xl font-bold text-[var(--color-primary)]">
                    ({book.discountRate}% 할인)
                  </span>
                </div>
              </>
            ) : (
              <span className="text-2xl font-bold text-[var(--color-dark)]">
                {book.price.toLocaleString()}원
              </span>
            )}
          </div>

          {/* 적립/혜택 */}
          <div className="mt-4 flex items-center gap-2 border-t border-[var(--color-dark)] pt-4">
            <span className="text-sm font-bold text-[var(--color-dark)]">적립</span>
            <span className="flex items-center text-sm font-bold text-[var(--color-primary)]">
              {Math.floor((book.originalPrice ?? book.price) * 0.05).toLocaleString()}P
              <PointInfoButton />
            </span>
          </div>

          {/* 배송안내 */}
          <div className="mt-3 border-t border-[var(--color-border)] pt-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--color-dark)]">배송안내</span>
              <span className="flex items-center text-sm text-[var(--color-body)]">
                {book.price < 10000 ? "배송비 3,000원" : "무료배송"}
                <ShippingInfoButton />
              </span>
            </div>
            <DeliveryEstimate />
          </div>

          {/* 규격 정보 */}
          {book.specs && (
            <div className="mt-4 border-t border-[var(--color-border)] pt-4">
              <span className="text-sm font-bold text-[var(--color-dark)]">규격 정보</span>
              <table className="mt-2 w-full text-sm">
                <tbody className="text-[var(--color-body)]">
                  {book.specs.pages && (
                    <tr>
                      <td className="w-20 py-1 text-[var(--color-muted)]">쪽수</td>
                      <td className="py-1">{book.specs.pages}쪽</td>
                    </tr>
                  )}
                  {book.specs.size && (
                    <tr>
                      <td className="w-20 py-1 text-[var(--color-muted)]">크기</td>
                      <td className="py-1">{book.specs.size}</td>
                    </tr>
                  )}
                  {book.specs.weight && (
                    <tr>
                      <td className="w-20 py-1 text-[var(--color-muted)]">무게</td>
                      <td className="py-1">{book.specs.weight}</td>
                    </tr>
                  )}
                  {book.specs.binding && (
                    <tr>
                      <td className="w-20 py-1 text-[var(--color-muted)]">제본</td>
                      <td className="py-1">{book.specs.binding}</td>
                    </tr>
                  )}
                  {book.specs.isbn && (
                    <tr>
                      <td className="w-20 py-1 text-[var(--color-muted)]">ISBN</td>
                      <td className="py-1">{book.specs.isbn}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>

      {/* ── 중단: 도서 설명 ── */}
      {book.description && (
        <section className="mt-10 border-t border-[var(--color-dark)] pt-8">
          <h2 className="text-lg font-bold text-[var(--color-dark)]">도서 소개</h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-body)] md:text-base">
            {book.description}
          </p>
        </section>
      )}

      {/* ── 별점/리뷰 섹션 ── */}
      <section className="mt-10 border-t border-[var(--color-border)] pt-8">
        <h2 className="text-lg font-bold text-[var(--color-dark)]">
          리뷰
          <span className="ml-2 text-base font-normal text-[var(--color-muted)]">
            ({book.reviewCount})
          </span>
        </h2>

        {/* 평균 별점 */}
        <div className="mt-4 flex items-center gap-4 rounded-lg bg-[var(--color-light-bg)] p-5">
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--color-dark)]">{book.rating}</div>
            <StarRating rating={book.rating} />
          </div>
          <div className="text-sm text-[var(--color-muted)]">
            총 {book.reviewCount}개의 리뷰
          </div>
        </div>

        {/* 리뷰 목록 */}
        {book.reviews && book.reviews.length > 0 ? (
          <ul className="mt-6 divide-y divide-[var(--color-border)]">
            {book.reviews.map((review, idx) => (
              <li key={idx} className="py-5 first:pt-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[var(--color-dark)]">
                    {review.reviewer}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[var(--color-muted)]">
                    {review.date.replace(/-/g, ".")}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-body)]">
                  {review.content}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-sm text-[var(--color-muted)]">
            아직 작성된 리뷰가 없습니다.
          </p>
        )}
      </section>

      {/* ── 하단: 목록으로 버튼 ── */}
      <div className="mt-10 flex justify-center">
        <Link
          href="/books"
          className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-8 py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
        >
          <ChevronLeft size={16} />
          목록으로
        </Link>
      </div>

      {/* ── Sticky Bottom Bar ── */}
      <BookStickyBar price={book.price} isSoldOut={book.isSoldOut} book={book} />
    </div>
  );
}
