"use client";

import { useState } from "react";
import { ShoppingCart, CreditCard, Heart, Minus, Plus } from "lucide-react";
import type { Book } from "@/types";
import BookPreviewButton from "./BookPreviewButton";

interface BookStickyBarProps {
  price: number;
  isSoldOut?: boolean;
  book?: Book;
}

export default function BookStickyBar({ price, isSoldOut, book }: BookStickyBarProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const totalPrice = price * quantity;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-border)] bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3 md:gap-6 md:py-4">
        {/* Left: Total + Quantity */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Quantity Selector */}
          <div className="flex items-center rounded-lg border border-[var(--color-border)]">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={isSoldOut}
              className="flex h-9 w-9 items-center justify-center text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)] disabled:opacity-40 md:h-10 md:w-10"
              aria-label="수량 감소"
            >
              <Minus size={16} />
            </button>
            <span className="flex h-9 w-10 items-center justify-center border-x border-[var(--color-border)] text-sm font-medium text-[var(--color-dark)] md:h-10 md:w-12">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              disabled={isSoldOut}
              className="flex h-9 w-9 items-center justify-center text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)] disabled:opacity-40 md:h-10 md:w-10"
              aria-label="수량 증가"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Total Price */}
          <div className="hidden sm:block">
            <p className="text-xs text-[var(--color-muted)]">총 상품금액</p>
            <p className="text-lg font-bold text-[var(--color-dark)] md:text-xl">
              {totalPrice.toLocaleString()}
              <span className="text-sm font-normal">원</span>
            </p>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Mobile total price (inline) */}
          <div className="mr-1 sm:hidden">
            <p className="text-right text-[10px] text-[var(--color-muted)]">총 상품금액</p>
            <p className="text-base font-bold text-[var(--color-dark)]">
              {totalPrice.toLocaleString()}
              <span className="text-xs font-normal">원</span>
            </p>
          </div>

          {/* Preview (icon) */}
          {book?.preview && <BookPreviewButton book={book} variant="icon" />}

          {/* Favorite */}
          <button
            onClick={() => setIsFavorite((f) => !f)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors md:h-11 md:w-11 ${
              isFavorite
                ? "border-red-300 bg-red-50 text-red-500"
                : "border-[var(--color-border)] text-[var(--color-muted)] hover:bg-[var(--color-light-bg)]"
            }`}
            aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기"}
          >
            <Heart
              size={20}
              className={isFavorite ? "fill-red-500" : ""}
            />
          </button>

          {/* Cart */}
          {!isSoldOut ? (
            <>
              <button className="flex h-10 items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-white px-4 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)] md:h-11 md:gap-2 md:px-6">
                <ShoppingCart size={16} />
                <span className="hidden sm:inline">장바구니</span>
              </button>
              <button className="flex h-10 items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 text-sm font-medium text-white transition-colors hover:opacity-90 md:h-11 md:gap-2 md:px-6">
                <CreditCard size={16} />
                <span className="hidden sm:inline">바로구매</span>
              </button>
            </>
          ) : (
            <button
              disabled
              className="flex h-10 cursor-not-allowed items-center gap-2 rounded-lg bg-gray-300 px-6 text-sm font-medium text-gray-500 md:h-11"
            >
              품절
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
