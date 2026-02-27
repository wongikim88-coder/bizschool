# Design: book-search-autocomplete

> Plan Reference: `docs/01-plan/features/book-search-autocomplete.plan.md`

## 1. Component Architecture

```
BookSearch (MODIFY - src/components/books/BookSearch.tsx)
│  "use client"
│  Props: { currentSearch: string }
│
├── <form> (기존 유지)
│   ├── <div className="relative flex-1">  ← wrapper를 relative 유지
│   │   ├── <Search /> icon (기존)
│   │   ├── <input /> (기존, onChange에 debounce 로직 추가)
│   │   └── <SearchAutocomplete /> (신규, absolute positioned)
│   └── <button type="submit"> (기존)
│
└── State:
    ├── value: string (기존)
    ├── showAutocomplete: boolean (신규)
    └── debouncedQuery: string (신규)
```

```
SearchAutocomplete (NEW - src/components/books/SearchAutocomplete.tsx)
│  No "use client" needed (BookSearch 내부에서 사용)
│  Props: { books: Book[], query: string, onSelect: (search: string) => void, onClose: () => void }
│
└── <div> (absolute dropdown)
    ├── AutocompleteItem * N (최대 5개)
    │   ├── Cover thumbnail (48x64)
    │   ├── Title (query 부분 하이라이트)
    │   ├── Author
    │   └── Price (할인율 + 가격)
    └── "전체 검색 결과 보기" link (하단)
```

## 2. File Changes

| Action | File | Changes |
|--------|------|---------|
| **MODIFY** | `src/components/books/BookSearch.tsx` | debounce 로직, showAutocomplete 상태, 외부클릭/ESC 처리, SearchAutocomplete 렌더 |
| **NEW** | `src/components/books/SearchAutocomplete.tsx` | 자동완성 드롭다운 UI 컴포넌트 |

## 3. Detailed Component Design

### 3.1 BookSearch.tsx (수정)

**추가 imports:**
```tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { allBooks } from "@/data/books";
import SearchAutocomplete from "./SearchAutocomplete";
```

**추가 State:**
```tsx
const [showAutocomplete, setShowAutocomplete] = useState(false);
const [debouncedQuery, setDebouncedQuery] = useState("");
const wrapperRef = useRef<HTMLDivElement>(null);
```

**Debounce 로직:**
```tsx
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(value.trim());
  }, 300);
  return () => clearTimeout(timer);
}, [value]);
```

**필터링 로직:**
```tsx
const filteredBooks = debouncedQuery.length >= 1
  ? allBooks
      .filter((book) => {
        const q = debouncedQuery.toLowerCase();
        return (
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q)
        );
      })
      .slice(0, 5)
  : [];
```

**외부 클릭 닫기:**
```tsx
useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setShowAutocomplete(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
```

**ESC 키 닫기:**
- input의 onKeyDown에서 `Escape` 감지 시 `setShowAutocomplete(false)`

**자동완성 표시 조건:**
- `showAutocomplete && debouncedQuery.length >= 1 && filteredBooks.length > 0`

**항목 선택 핸들러:**
```tsx
const handleSelect = (search: string) => {
  setValue(search);
  setShowAutocomplete(false);
  // 선택한 검색어로 즉시 검색 실행
  const params = new URLSearchParams(searchParams.toString());
  params.set("search", search);
  params.set("page", "1");
  router.push(`/books?${params.toString()}`);
};
```

**onChange 수정:**
```tsx
onChange={(e) => {
  setValue(e.target.value);
  setShowAutocomplete(true);
}}
```

### 3.2 SearchAutocomplete.tsx (신규)

**Props Interface:**
```tsx
interface SearchAutocompleteProps {
  books: Book[];
  query: string;
  onSelect: (search: string) => void;
  onClose: () => void;
}
```

**키워드 하이라이트 함수:**
```tsx
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="bg-transparent font-bold text-[var(--color-primary)]">{part}</mark>
      : part
  );
}
```

**컴포넌트 구조:**
```tsx
export default function SearchAutocomplete({ books, query, onSelect, onClose }: SearchAutocompleteProps) {
  if (books.length === 0) return null;

  return (
    <div className="absolute left-0 top-full z-50 mt-1 w-full ...">
      {books.map((book) => (
        <button key={book.id} onClick={() => onSelect(book.title의 검색키워드)}>
          {/* 도서 썸네일 */}
          {/* 도서 정보 */}
        </button>
      ))}
    </div>
  );
}
```

## 4. UI Specification

### 4.1 드롭다운 컨테이너

```
Position: absolute, top: 100%, left: 0
Width: 100% (검색 input wrapper 기준)
Z-index: 50
Background: white
Border: 1px solid var(--color-border)
Border-radius: 0.75rem (rounded-xl)
Box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1)
Max-height: 없음 (최대 5개로 제한하므로)
Overflow: hidden
```

### 4.2 각 도서 항목 (AutocompleteItem)

```
┌─────────────────────────────────────────────────┐
│ ┌──────┐                                        │
│ │      │  린 **스타트업** - 지속적 혁신을 실현   │
│ │ 48px │  에릭 리스                              │
│ │ x64  │  10% 22,500원                           │
│ └──────┘                                        │
├─────────────────────────────────────────────────┤  ← border-b (마지막 항목 제외)
│ ...                                             │
└─────────────────────────────────────────────────┘
```

**항목 스타일:**
```
Layout: flex, gap-3, items-center
Padding: px-3 py-2.5
Hover: bg-[var(--color-light-bg)]
Cursor: pointer
Transition: background-color
Border-bottom: 1px solid var(--color-border) (last:border-b-0)
```

**썸네일:**
```
Size: w-12 h-16 (48px x 64px)
Border-radius: rounded (0.25rem)
Background: gradient placeholder (기존 BookListCard 스타일 축소)
Flex-shrink: 0
Overflow: hidden
```

**도서명:**
```
Font: text-sm, font-medium
Color: var(--color-dark)
Line-clamp: 1 (한 줄 말줄임)
Highlight: 매칭 키워드 → font-bold text-[var(--color-primary)]
```

**저자:**
```
Font: text-xs
Color: var(--color-muted)
```

**가격:**
```
Layout: flex, items-center, gap-1
할인율: text-xs text-[var(--color-red)] font-semibold
가격: text-sm font-bold text-[var(--color-dark)]
```

### 4.3 반응형

- **모바일/데스크톱 동일**: 드롭다운이 검색 input 너비에 맞춰 100% 표시
- 별도 반응형 분기 불필요 (검색 input이 이미 `max-w-md`로 제한됨)

## 5. Interaction Flow

```
User types "린" in search input
  → onChange: setValue("린"), setShowAutocomplete(true)
  → 300ms debounce 후: setDebouncedQuery("린")
  → filteredBooks 계산: title/author에 "린" 포함하는 도서 최대 5개
  → 드롭다운 표시

User clicks an autocomplete item
  → onSelect(검색어): setValue, setShowAutocomplete(false)
  → router.push("/books?search=검색어&page=1")
  → 전체 검색 결과 페이지로 이동

User presses Escape
  → setShowAutocomplete(false)
  → 드롭다운 닫힘, input focus 유지

User clicks outside
  → mousedown event → wrapperRef.contains 체크
  → setShowAutocomplete(false)

User submits form (Enter or 검색 버튼)
  → 기존 handleSearch() 실행
  → setShowAutocomplete(false)
```

## 6. Implementation Order

1. `SearchAutocomplete.tsx` 신규 생성 (독립 컴포넌트)
2. `BookSearch.tsx` 수정 (debounce + state + 외부클릭 + SearchAutocomplete 통합)

## 7. Edge Cases

| Case | Handling |
|------|----------|
| 검색어 1글자 미만 | 드롭다운 미표시 |
| 매칭 결과 0건 | 드롭다운 미표시 (빈 상태 UI 불필요) |
| 매칭 결과 5건 초과 | 처음 5개만 표시 |
| 검색어에 정규식 특수문자 포함 | escape 처리 (highlightMatch 내) |
| 폼 submit 시 | 드롭다운 닫기 |
| input focus 시 (이미 입력값 있을 때) | 드롭다운 다시 표시 |
| 빠른 타이핑 | debounce 300ms로 마지막 입력만 처리 |
