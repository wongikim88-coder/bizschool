"use client";

import { SUGGEST_CHIPS } from "@/data/consultation";

interface SuggestChipsProps {
  onChipClick: (query: string) => void;
}

export default function SuggestChips({ onChipClick }: SuggestChipsProps) {
  return (
    <div className="mx-auto flex max-w-[768px] flex-wrap justify-center gap-2 px-4 pb-4">
      {SUGGEST_CHIPS.map((chip) => (
        <button
          key={chip.label}
          onClick={() => onChipClick(chip.query)}
          className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-dark)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
