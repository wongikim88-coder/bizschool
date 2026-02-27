import type { Book } from "@/types";

interface SearchAutocompleteProps {
  books: Book[];
  query: string;
  onSelect: (title: string) => void;
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark
        key={i}
        className="bg-transparent font-bold text-[var(--color-primary)]"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function SearchAutocomplete({
  books,
  query,
  onSelect,
}: SearchAutocompleteProps) {
  if (books.length === 0) return null;

  return (
    <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-lg">
      {books.map((book) => {
        const hasDiscount = book.originalPrice && book.discountRate;
        return (
          <button
            key={book.id}
            type="button"
            className="flex w-full items-center gap-3 border-b border-[var(--color-border)] px-3 py-2.5 text-left transition-colors last:border-b-0 hover:bg-[var(--color-light-bg)]"
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(book.title);
            }}
          >
            {/* Thumbnail */}
            <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded bg-gradient-to-b from-gray-200 to-gray-300">
              <div className="flex h-full items-center justify-center p-1">
                <p className="text-center text-[7px] font-bold leading-tight text-gray-500">
                  {book.title.length > 12
                    ? book.title.slice(0, 12) + "..."
                    : book.title}
                </p>
              </div>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--color-dark)]">
                {highlightMatch(book.title, query)}
              </p>
              <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                {book.author}
              </p>
              <div className="mt-0.5 flex items-center gap-1">
                {hasDiscount && (
                  <span className="text-xs font-semibold text-[var(--color-red)]">
                    {book.discountRate}%
                  </span>
                )}
                <span className="text-sm font-bold text-[var(--color-dark)]">
                  {book.price.toLocaleString()}원
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
