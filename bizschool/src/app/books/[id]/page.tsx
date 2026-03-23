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
                ? "fill-[var(--color-primary)] text-[var(--color-primary)]"
                : half
                  ? "fill-[var(--color-primary)]/50 text-[var(--color-primary)]"
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
          <div className="relative mx-auto h-[439px] w-[312px] overflow-hidden rounded-lg shadow-md md:h-[670px] md:w-[485px]">
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
            <div className="mt-2 mx-auto w-[312px] md:w-[485px]">
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
            <a href="#reviews" className="mt-3 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <StarRating rating={book.rating} />
              <span className="text-sm font-bold text-[var(--color-dark)]">{book.rating}</span>
              <span className="text-sm text-[var(--color-muted)] hover:underline">
                ({book.reviewCount}개의 리뷰)
              </span>
            </a>
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
          <div className="mt-4 flex items-center gap-2 border-t border-[var(--color-border)] pt-4">
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
        <>
        <div className="relative mt-10">
          <div className="absolute left-1/2 w-screen -translate-x-1/2 border-t border-[var(--color-dark)]" />
        </div>
        <section className="pt-8">
          <h2 className="text-lg font-bold text-[var(--color-dark)]">도서 소개</h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-body)] md:text-base">
            {book.description}
          </p>
        </section>
        </>
      )}

      {/* ── 목차 ── */}
      {book.preview?.toc && book.preview.toc.length > 0 && (
        <section className="mt-10 border-t border-[var(--color-border)] pt-8">
          <h2 className="text-lg font-bold text-[var(--color-dark)]">목차</h2>
          <ul className="mt-4">
            {book.preview.toc.map((item, idx) => (
              <li key={idx} className="flex items-baseline gap-3 py-3 first:pt-0">
                <span className="shrink-0 text-sm font-bold text-[var(--color-body)]">
                  {item.chapter}
                </span>
                <span className="text-sm text-[var(--color-body)]">{item.title}</span>
                <span className="ml-auto shrink-0 text-sm text-[var(--color-body)]">p.{item.page}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── 저자 소개 ── */}
      <section className="mt-10 border-t border-[var(--color-border)] pt-8">
        <h2 className="text-lg font-bold text-[var(--color-dark)]">저자 소개</h2>
        <div className="mt-4">
          <h3 className="text-base font-bold text-[var(--color-dark)]">{book.author}</h3>
          {book.authorBio && (
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-body)]">
              {book.authorBio}
            </p>
          )}
        </div>

        {/* 동일 저자의 다른 책 */}
        {(() => {
          const otherBooks = allBooks
            .filter((b) => b.author === book.author && b.id !== book.id)
            .slice(0, 5);
          if (otherBooks.length === 0) return null;
          return (
            <div className="mt-6">
              <h4 className="text-sm font-bold text-[var(--color-muted)]">
                {book.author}의 다른 도서
              </h4>
              <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
                {otherBooks.map((ob) => (
                  <Link
                    key={ob.id}
                    href={`/books/${ob.id}`}
                    className="group rounded-lg border border-[var(--color-border)] p-2 transition-colors hover:border-[var(--color-primary)]"
                  >
                    <div className="flex h-[200px] items-center justify-center rounded bg-gradient-to-b from-gray-200 to-gray-300">
                      <p className="px-2 text-center text-xs font-bold leading-tight text-gray-600">
                        {ob.title.length > 20 ? ob.title.slice(0, 20) + "..." : ob.title}
                      </p>
                    </div>
                    <p className="mt-2 text-xs font-medium text-[var(--color-dark)] line-clamp-2 group-hover:text-[var(--color-primary)]">
                      {ob.title}
                    </p>
                    <p className="mt-1 text-xs font-bold text-[var(--color-dark)]">
                      {ob.price.toLocaleString()}원
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}
      </section>

      {/* ── 별점/리뷰 섹션 ── */}
      <section id="reviews" className="mt-10 border-t border-[var(--color-border)] pt-8 scroll-mt-20">
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
                            ? "fill-[var(--color-primary)] text-[var(--color-primary)]"
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
