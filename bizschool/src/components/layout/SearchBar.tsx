import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="mx-auto max-w-[800px] px-4 py-4">
      <div className="relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
        />
        <input
          type="text"
          placeholder="배우고 싶은 강의를 검색해보세요"
          className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-light-bg)] py-3.5 pl-12 pr-5 text-sm text-[var(--color-dark)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
        />
      </div>
    </div>
  );
}
