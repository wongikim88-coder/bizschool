import type { BookTocItem } from "@/types";

export default function BookPreviewToc({ toc }: { toc: BookTocItem[] }) {
  return (
    <div className="p-6">
      <h3 className="mb-4 text-lg font-bold text-[var(--color-dark)]">목차</h3>
      <ul className="space-y-1">
        {toc.map((item, idx) => (
          <li
            key={idx}
            className="flex items-baseline gap-2 rounded-lg px-3 py-2.5 transition-colors hover:bg-[var(--color-light-bg)]"
          >
            <span className="flex-shrink-0 text-sm font-medium text-[var(--color-primary)]">
              {item.chapter}
            </span>
            <span className="text-sm text-[var(--color-dark)]">{item.title}</span>
            <span className="mx-1 flex-1 border-b border-dotted border-gray-300" />
            <span className="flex-shrink-0 text-sm tabular-nums text-[var(--color-muted)]">
              {item.page}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
