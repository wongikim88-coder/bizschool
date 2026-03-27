"use client";

import type { ReactNode } from "react";

interface ContentTypeCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  isSelected: boolean;
  onSelect: () => void;
}

export default function ContentTypeCard({
  icon,
  title,
  subtitle,
  description,
  tags,
  isSelected,
  onSelect,
}: ContentTypeCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative w-full cursor-pointer rounded-2xl border-2 p-6 text-left transition-all ${
        isSelected
          ? "border-[var(--color-primary)] shadow-sm"
          : "border-gray-200 hover:shadow-md"
      }`}
    >
      {/* Header: Icon + Title + Radio */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8faf3] text-[var(--color-primary)]">
            {icon}
          </div>
          <span className="text-lg font-bold text-[var(--color-dark)]">{title}</span>
        </div>
        {/* Radio indicator */}
        <input
          type="radio"
          checked={isSelected}
          readOnly
          className="h-5 w-5 shrink-0 accent-[var(--color-primary)]"
        />
      </div>

      {/* Subtitle */}
      <p className="mt-4 text-sm font-semibold text-[var(--color-dark)]">
        {subtitle}
      </p>

      {/* Description */}
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
        {description}
      </p>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-sm font-medium text-[var(--color-primary)]"
          >
            #{tag}
          </span>
        ))}
      </div>
    </button>
  );
}
