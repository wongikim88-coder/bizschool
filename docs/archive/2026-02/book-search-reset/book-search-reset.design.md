# book-search-reset Design Document

> **Summary**: 도서 페이지 검색 후 기본 화면으로 자연스럽게 복귀하는 UX 개선
>
> **Project**: BIZSCHOOL
> **Version**: 1.0
> **Author**: Claude
> **Date**: 2026-02-27
> **Status**: Draft
> **Planning Doc**: [book-search-reset.plan.md](../../01-plan/features/book-search-reset.plan.md)

---

## 1. Overview

### 1.1 Design Goals

- 검색 활성 상태에서 기본 화면으로 복귀하는 3가지 자연스러운 경로 제공
- 기존 검색/필터링 동작 유지 (regression 없음)
- 최소 파일 수정 (3개 파일)

### 1.2 Design Principles

- **최소 변경**: 기존 컴포넌트를 수정, 새 파일 생성 없음
- **URL 기반 상태**: 모든 검색 상태는 URL searchParams로 관리 (기존 패턴 유지)
- **Tailwind CSS v4 준수**: CSS 커스텀 프로퍼티는 반드시 `var()` 래핑

---

## 2. Architecture

### 2.1 Component Diagram (현재)

```
┌─ layout.tsx ────────────────────────────────────┐
│  Header                                          │
│  SearchBar ← value 상태만 관리 (URL 미동기화)     │
│  ┌─ books/page.tsx ───────────────────────────┐  │
│  │  BookBanner                                 │  │
│  │  CategoryFilter ← search 파라미터 보존      │  │
│  │  ResultCount ← 검색 해제 수단 없음          │  │
│  │  BookListCard[]                             │  │
│  │  Pagination                                 │  │
│  └─────────────────────────────────────────────┘  │
│  Footer                                          │
└──────────────────────────────────────────────────┘
```

### 2.2 Component Diagram (개선)

```
┌─ layout.tsx ────────────────────────────────────┐
│  Header                                          │
│  SearchBar ← ★ URL search 파라미터 양방향 동기화  │
│             ← ★ X 클릭 시 URL 파라미터도 제거    │
│  ┌─ books/page.tsx ───────────────────────────┐  │
│  │  BookBanner                                 │  │
│  │  CategoryFilter ← ★ "전체" 탭: search 초기화│  │
│  │  ResultCount ← ★ 검색어 칩(chip) + X 버튼   │  │
│  │  BookListCard[]                             │  │
│  │  Pagination                                 │  │
│  └─────────────────────────────────────────────┘  │
│  Footer                                          │
└──────────────────────────────────────────────────┘
```

### 2.3 Data Flow (검색 초기화)

```
[경로 1] 검색어 칩 X 클릭
  → <Link href="/books"> 클릭
  → page.tsx 리렌더 (search="" → 전체 도서)

[경로 2] SearchBar X 클릭
  → setValue("") + router.push("/books")
  → page.tsx 리렌더 (search="" → 전체 도서)

[경로 3] "전체" 탭 클릭
  → params.delete("search") + params.delete("category")
  → router.push("/books?page=1")
  → page.tsx 리렌더 (search="" → 전체 도서)
```

---

## 3. UI/UX Design

### 3.1 검색어 칩(Chip) — 결과 카운트 영역 (FR-01, FR-02, FR-06)

**Before:**
```
총 1권 · "에릭" 검색 결과
```

**After:**
```
총 1권                          [ 에릭  ✕ ]
```

- 검색어 칩은 결과 카운트 우측에 배치 (flex justify-between)
- 칩 스타일: `rounded-full`, `bg-[var(--color-primary)]/10`, `text-[var(--color-primary)]`, `border border-[var(--color-primary)]/30`
- X 아이콘: lucide-react `X` (size=14)
- 칩은 `<Link href="/books">` 로 구현 (클라이언트 사이드 네비게이션)
- **검색어가 없을 때는 칩 미표시** (기존과 동일한 "총 42권" 표시)

### 3.2 SearchBar URL 동기화 (FR-03, FR-04)

**변경 사항:**

1. **URL → input 동기화**: `/books?search=에릭` 접속 시 SearchBar input에 "에릭" 반영
   - `useEffect`로 `searchParams.get("search")` 감시
   - `/books` 페이지일 때만 동기화 (다른 페이지에서는 빈 값 유지)

2. **X 버튼 동작 확장**: input 초기화 + URL 파라미터 제거
   - 현재: `setValue("")` (input만 초기화)
   - 개선: `setValue("")` + `/books` 페이지이고 URL에 `?search=`가 있으면 `router.push("/books")` 추가

### 3.3 "전체" 탭 검색 초기화 (FR-05)

**변경 사항:**

`CategoryFilter.handleCategoryChange`에서 `key === "all"`일 때:
- 현재: `params.delete("category")` (카테고리만 제거)
- 개선: `params.delete("category")` + `params.delete("search")` (검색어도 함께 제거)

**다른 카테고리 탭은 기존 동작 유지** (검색어 보존하여 카테고리 내 검색 결과 확인 가능)

---

## 4. Implementation Specification

### 4.1 File: `src/app/books/page.tsx` — 결과 카운트 영역 수정

**위치**: BooksContent 컴포넌트의 `{/* Result count */}` 섹션 (line 66-74)

**Before:**
```tsx
{/* Result count */}
<div className="mt-6 text-sm text-[var(--color-muted)]">
  총 <span className="font-semibold text-[var(--color-dark)]">{filtered.length}</span>권
  {search && (
    <span>
      {" "}&middot; &quot;{search}&quot; 검색 결과
    </span>
  )}
</div>
```

**After:**
```tsx
{/* Result count */}
<div className="mt-6 flex items-center justify-between text-sm text-[var(--color-muted)]">
  <span>
    총 <span className="font-semibold text-[var(--color-dark)]">{filtered.length}</span>권
  </span>
  {search && (
    <a
      href="/books"
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/20"
      aria-label={`"${search}" 검색 해제`}
    >
      {search}
      <X size={14} />
    </a>
  )}
</div>
```

**변경 포인트:**
- `div`에 `flex items-center justify-between` 추가
- 기존 `"에릭" 검색 결과` 텍스트 → 검색어 칩(chip) with X 아이콘으로 교체
- `<a href="/books">` 사용 (Server Component에서도 동작, client-side navigation)
- lucide-react `X` import 추가 필요 (page.tsx는 Server Component이므로 별도 처리 필요)

**Server Component 대안:**
page.tsx는 Server Component이므로 lucide-react 직접 사용 불가. 두 가지 옵션:
- **Option A**: 인라인 SVG로 X 아이콘 직접 구현 (의존성 없음, 권장)
- **Option B**: 검색어 칩을 별도 Client Component로 추출

→ **Option A 채택**: 인라인 SVG 사용으로 단순하게 유지

```tsx
{/* X icon - inline SVG */}
<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
</svg>
```

### 4.2 File: `src/components/layout/SearchBar.tsx` — URL 동기화

**변경 1: URL → input 동기화 (useEffect 추가)**

```tsx
// Sync input with URL search param (books page only)
useEffect(() => {
  if (isBooks) {
    const urlSearch = searchParams.get("search") || "";
    setValue(urlSearch);
  } else {
    setValue("");
  }
}, [isBooks, searchParams]);
```

**위치**: 기존 `useEffect` (line 32-35, Close panel on route change) 아래에 추가

**변경 2: X 버튼 클릭 시 URL 파라미터도 제거**

**Before (line 81-87):**
```tsx
{value && (
  <button
    onClick={() => setValue("")}
    ...
```

**After:**
```tsx
{value && (
  <button
    onClick={() => {
      setValue("");
      if (isBooks && searchParams.has("search")) {
        router.push("/books");
      }
    }}
    ...
```

### 4.3 File: `src/components/books/CategoryFilter.tsx` — "전체" 탭 초기화

**Before (line 15-24):**
```tsx
const handleCategoryChange = (key: string) => {
  const params = new URLSearchParams(searchParams.toString());
  if (key === "all") {
    params.delete("category");
  } else {
    params.set("category", key);
  }
  params.set("page", "1");
  router.push(`/books?${params.toString()}`);
};
```

**After:**
```tsx
const handleCategoryChange = (key: string) => {
  const params = new URLSearchParams(searchParams.toString());
  if (key === "all") {
    params.delete("category");
    params.delete("search");
  } else {
    params.set("category", key);
  }
  params.set("page", "1");
  router.push(`/books?${params.toString()}`);
};
```

**변경 포인트:** `key === "all"` 분기에 `params.delete("search")` 1줄 추가

---

## 5. Implementation Order

1. [ ] **CategoryFilter.tsx** — "전체" 탭에 `params.delete("search")` 추가 (1줄)
2. [ ] **SearchBar.tsx** — URL 동기화 useEffect 추가 + X 버튼 동작 확장
3. [ ] **page.tsx** — 결과 카운트 영역에 검색어 칩 UI 추가

---

## 6. Test Plan

### 6.1 Test Cases

| # | Scenario | Expected | FR |
|---|----------|----------|-----|
| 1 | "에릭" 검색 → 검색어 칩 표시됨 | `[ 에릭 ✕ ]` 칩 보임 | FR-01, FR-06 |
| 2 | 검색어 칩 X 클릭 | `/books`로 이동, 전체 도서 표시 | FR-02 |
| 3 | 검색 후 SearchBar에 검색어 반영됨 | input에 "에릭" 표시 | FR-03 |
| 4 | SearchBar X 클릭 | input 초기화 + `/books`로 이동 | FR-04 |
| 5 | 검색 후 "전체" 탭 클릭 | 검색어 + 카테고리 초기화, 전체 도서 표시 | FR-05 |
| 6 | 검색 후 다른 카테고리 탭 클릭 | 검색어 유지, 해당 카테고리 내 검색 결과 | Regression |
| 7 | 검색어 없는 기본 상태 | 칩 미표시, "총 42권" 표시 | Regression |
| 8 | 검색 후 다른 페이지 이동 → 도서 페이지 재진입 | 기본 상태로 표시 | Regression |

---

## 7. Coding Convention

| Item | Convention |
|------|-----------|
| CSS 커스텀 프로퍼티 | `var(--color-xxx)` 필수 (Tailwind v4) |
| 아이콘 | Server Component: inline SVG / Client Component: lucide-react |
| 링크 | `<a href>` (Server Component) 또는 `router.push` (Client Component) |
| 접근성 | `aria-label` on interactive elements |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-27 | Initial draft | Claude |
