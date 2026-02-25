import { Star } from "lucide-react";
import type { Book } from "@/types";

const badgeStyles: Record<string, string> = {
  primary: "bg-[--color-primary]/10 text-[--color-primary]",
  green: "bg-emerald-50 text-emerald-600",
  red: "bg-red-50 text-red-500",
  blue: "bg-blue-50 text-blue-500",
  gray: "bg-gray-100 text-gray-600",
};

export default function BookCard({ book }: { book: Book }) {
  const hasDiscount = book.originalPrice && book.discountRate;

  return (
    <article className="group cursor-pointer">
      {/* Cover */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 shadow-md transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-lg">
        <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-gray-200 to-gray-300 p-4">
          <div className="text-center">
            <p className="text-xs font-bold leading-tight text-gray-600">
              {book.title.length > 20 ? book.title.slice(0, 20) + "..." : book.title}
            </p>
            <p className="mt-2 text-[10px] text-gray-500">{book.author}</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-[--color-dark]">
          {book.title}
        </h3>

        <p className="mt-1 text-sm text-[--color-muted]">{book.author}</p>

        {/* Price */}
        <div className="mt-2">
          {hasDiscount ? (
            <>
              <span className="text-sm text-[--color-muted] line-through">
                ₩{book.originalPrice!.toLocaleString()}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[--color-red]">
                  {book.discountRate}%
                </span>
                <span className="font-bold text-[--color-dark]">
                  ₩{book.price.toLocaleString()}
                </span>
              </div>
            </>
          ) : (
            <span className="font-bold text-[--color-dark]">
              ₩{book.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1 text-sm text-[--color-muted]">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          {book.rating}
          <span className="text-xs">({book.reviewCount})</span>
        </div>

        {/* Badges */}
        {book.badges && book.badges.length > 0 && (
          <div className="mt-2 flex gap-1.5">
            {book.badges.map((badge) => (
              <span
                key={badge.label}
                className={`rounded px-2 py-0.5 text-xs font-medium ${badgeStyles[badge.variant] || badgeStyles.gray}`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
