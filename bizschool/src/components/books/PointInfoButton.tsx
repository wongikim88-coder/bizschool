"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";

export default function PointInfoButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="ml-1 inline-flex items-center justify-center rounded-full text-[var(--color-muted)] transition-colors hover:text-[var(--color-dark)]"
        aria-label="적립 안내"
      >
        <Info size={16} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setIsOpen(false)}>
          <div
            className="mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--color-dark)]">적립 안내</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)]"
                aria-label="닫기"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-body)]">
              상품 가격의 5%를 적립해드립니다.
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-5 w-full rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
