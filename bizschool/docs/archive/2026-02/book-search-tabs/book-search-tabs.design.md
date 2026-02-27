# Design: 도서 페이지 카테고리 탭 UI 개선

> Plan 참조: `docs/01-plan/features/book-search-tabs.plan.md`

## 1. 컴포넌트 설계

### 1.1 CategoryFilter.tsx (변경)

#### Props 변경

```typescript
// Before
interface CategoryFilterProps {
  currentCategory: string;
}

// After
interface CategoryFilterProps {
  currentCategory: string;
  categoryCounts: Record<string, number>;
}
```

#### UI 구조 (교보문고 스타일 세그먼트 탭)

```
┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│  전체 (42)   │ 경영전략 (7) │  마케팅 (6)  │ 재무회계 (7) │ 자기계발 (7) │  리더십 (8)  │  IT/기술 (7) │
├══════════════┼──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
   ▲ 선택 탭: 하단 2px 볼드 보더 (primary color) + font-semibold
```

#### 스타일 명세

| 요소 | 클래스 / 스타일 |
|------|-----------------|
| 컨테이너 | `mt-6 overflow-x-auto` (기존 유지) |
| 탭 래퍼 | `flex border-b border-[var(--color-border)]` |
| 탭 버튼 (공통) | `shrink-0 px-5 py-3 text-sm transition-colors relative` |
| 선택 탭 | `font-semibold text-[var(--color-dark)]` + `::after` pseudo로 하단 2px 보더 (primary) |
| 미선택 탭 | `text-[var(--color-muted)] hover:text-[var(--color-dark)] hover:bg-[var(--color-light-bg)]` |
| 건수 텍스트 | 탭 label 뒤에 ` (N)` 형태, 같은 스타일로 자연스럽게 표시 |

#### 선택 탭 하단 보더 구현 방식

Tailwind만으로 처리 (pseudo element 없이):
- 컨테이너에 `border-b`
- 선택된 탭에 `border-b-2 border-[var(--color-primary)]` + 부모 `border-b`를 덮도록 `mb-[-1px]`(negative margin)

#### 렌더링 로직

```tsx
{bookCategories.map((cat) => {
  const count = categoryCounts[cat.key] ?? 0;
  const isActive = currentCategory === cat.key;
  return (
    <button
      key={cat.key}
      role="tab"
      aria-selected={isActive}
      onClick={() => handleCategoryChange(cat.key)}
      className={`shrink-0 px-5 py-3 text-sm transition-colors ${
        isActive
          ? "mb-[-1px] border-b-2 border-[var(--color-primary)] font-semibold text-[var(--color-dark)]"
          : "text-[var(--color-muted)] hover:text-[var(--color-dark)] hover:bg-[var(--color-light-bg)]"
      }`}
    >
      {cat.label} ({count})
    </button>
  );
})}
```

### 1.2 page.tsx (변경)

#### 카테고리별 건수 계산 로직

```typescript
// Step 1: 검색어로 전체 도서 필터 (카테고리 무관)
const searchFiltered = search
  ? allBooks.filter((book) => {
      const query = search.toLowerCase();
      return (
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      );
    })
  : allBooks;

// Step 2: 카테고리별 건수 계산
const categoryCounts: Record<string, number> = { all: searchFiltered.length };
for (const book of searchFiltered) {
  if (book.category) {
    categoryCounts[book.category] = (categoryCounts[book.category] ?? 0) + 1;
  }
}

// Step 3: 선택된 카테고리로 최종 필터
const filtered = category === "all"
  ? searchFiltered
  : searchFiltered.filter((book) => book.category === category);
```

#### CategoryFilter 호출부 변경

```tsx
// Before
<CategoryFilter currentCategory={category} />

// After
<CategoryFilter currentCategory={category} categoryCounts={categoryCounts} />
```

#### BooksContent 함수 시그니처 변경 없음

`BooksContent`는 이미 `page`, `category`, `search`를 받고 있으므로, 내부에서 `categoryCounts` 계산 후 `CategoryFilter`에 전달하면 됨.

## 2. 데이터 흐름

```
BooksContent({ page, category, search })
  │
  ├─ searchFiltered = allBooks.filter(by search)
  │
  ├─ categoryCounts = { all: N, 경영전략: N, 마케팅: N, ... }
  │     ↓
  │   <CategoryFilter currentCategory={category} categoryCounts={categoryCounts} />
  │
  ├─ filtered = searchFiltered.filter(by category)
  │
  └─ paginatedBooks = filtered.slice(pagination)
       ↓
     <BookListCard ... /> (map)
```

## 3. 구현 순서

| 순서 | 파일 | 작업 |
|------|------|------|
| 1 | `src/app/books/page.tsx` | 검색 필터 분리, categoryCounts 계산, props 전달 |
| 2 | `src/components/books/CategoryFilter.tsx` | Props에 categoryCounts 추가, 탭 UI 스타일 변경, 건수 표시 |

## 4. 검증 기준

| ID | 검증 항목 | 기대 결과 |
|----|-----------|-----------|
| V-01 | 탭 UI 스타일 | pill 버튼 → 세그먼트 탭 (하단 보더 강조) |
| V-02 | 선택 탭 표시 | 하단 2px primary 보더 + font-semibold |
| V-03 | 미선택 탭 표시 | muted 텍스트 + hover 시 배경/텍스트 변경 |
| V-04 | 건수 표시 (비검색) | 전체 (42), 경영전략 (7), 마케팅 (6) 등 |
| V-05 | 건수 표시 (검색) | 검색 결과 기준으로 카테고리별 건수 업데이트 |
| V-06 | 카테고리 클릭 | 해당 카테고리 도서만 표시, 건수와 일치 |
| V-07 | 모바일 반응형 | 탭 가로 스크롤 동작 |
| V-08 | 접근성 | role="tablist", role="tab", aria-selected 유지 |
