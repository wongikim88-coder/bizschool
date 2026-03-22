# notice-page Design Document

> **Summary**: 공지사항 게시판 페이지(`/notice`) 목록 + 상세 상세 설계
>
> **Project**: BIZSCHOOL
> **Author**: allen
> **Date**: 2026-03-22
> **Status**: Draft
> **Plan Reference**: `docs/01-plan/features/notice-page.plan.md`

---

## 1. File Structure

```
src/
├── types/
│   └── index.ts                       ← Notice 타입 추가
├── data/
│   └── notice.ts                      ← Mock 데이터 + 상수 (신규)
├── app/
│   └── notice/
│       ├── page.tsx                   ← 목록 페이지 (Server Component)
│       └── [id]/
│           └── page.tsx               ← 상세 페이지 (Server Component)
└── components/
    └── notice/
        ├── NoticeSearch.tsx            ← 검색 입력 (Client)
        ├── NoticeTable.tsx             ← 테이블+카드 듀얼 레이아웃 (Server)
        └── NoticePagination.tsx        ← 페이지네이션 (Client)
```

---

## 2. Type Definition

### 2.1 `src/types/index.ts`에 추가

```typescript
// ─── 공지사항 ───
export interface Notice {
  id: number;
  title: string;
  content: string;        // HTML 본문
  author: string;
  createdAt: string;      // "2026-03-20" 형식
  views: number;
  isImportant: boolean;   // 중요 공지 여부 (상단 고정)
}
```

---

## 3. Mock Data (`src/data/notice.ts`)

```typescript
import type { Notice } from "@/types";

export const NOTICES_PER_PAGE = 10;

export const notices: Notice[] = [
  // 중요 공지 3건
  {
    id: 1,
    title: "2026년 상반기 교육과정 안내",
    content: "<p>2026년 상반기 교육과정...</p>",
    author: "관리자",
    createdAt: "2026-03-20",
    views: 254,
    isImportant: true,
  },
  // ... 중요 2건 더
  // 일반 공지 17건 (총 20건 → 2페이지 분량)
];

/** 중요 공지를 상단에 배치 + 일반 공지는 ID 내림차순 */
export function getSortedNotices(allNotices: Notice[]): Notice[] {
  const important = allNotices.filter((n) => n.isImportant);
  const normal = allNotices
    .filter((n) => !n.isImportant)
    .sort((a, b) => b.id - a.id);
  return [...important, ...normal];
}

/** 검색 필터 */
export function filterNotices(allNotices: Notice[], search: string): Notice[] {
  if (!search) return allNotices;
  const query = search.toLowerCase();
  return allNotices.filter((n) => n.title.toLowerCase().includes(query));
}
```

**Mock 데이터 규칙**:
- `id`: 1~20 (1~3은 중요 공지)
- `author`: 모두 "관리자"
- `createdAt`: 2026-01 ~ 2026-03 사이 날짜
- `views`: 10~300 범위 랜덤
- `content`: 간단한 HTML 문단 2~3개
- 총 20건으로 페이지네이션 2페이지 테스트 가능

---

## 4. Page Design: 목록 (`/notice`)

### 4.1 `src/app/notice/page.tsx` (Server Component)

**Metadata**:
```typescript
export const metadata: Metadata = {
  title: "공지사항 | BIZSCHOOL",
  description: "비즈스쿨의 공지사항, 서비스 업데이트, 이벤트 소식을 확인하세요.",
};
```

**Props**:
```typescript
interface NoticePageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}
```

**데이터 처리 흐름** (서버 사이드):
```
notices → filterNotices(search) → getSortedNotices() → slice(page) → NoticeTable
```

**레이아웃**:

```
┌─────────────────────────────────────────────────────┐
│  Hero Section                                       │
│  - bg-gradient-to-br from-[#155dfc] to-[#0d3b9e]   │
│  - h1: "공지사항"                                    │
│  - subtitle: "비즈스쿨의 새로운 소식과 ..."           │
├─────────────────────────────────────────────────────┤
│  Content Container (max-w-[1200px] px-4 pb-16)      │
│  ┌─────────────────────────────────────────────┐    │
│  │  NoticeSearch (mt-8)                         │    │
│  │  총 N개의 공지사항 (검색 시 "검색결과 N건")     │    │
│  ├─────────────────────────────────────────────┤    │
│  │  NoticeTable (mt-4)                          │    │
│  ├─────────────────────────────────────────────┤    │
│  │  NoticePagination                            │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

#### Hero Section

```tsx
<section className="relative overflow-hidden bg-gradient-to-br from-[#155dfc] to-[#0d3b9e] px-8 py-16 text-center md:px-16 md:py-24 lg:py-28">
  <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
  <div className="pointer-events-none absolute -bottom-10 right-20 h-40 w-40 rounded-full bg-white/5" />
  <div className="pointer-events-none absolute left-1/3 top-0 h-32 w-32 rounded-full bg-white/5" />
  <div className="relative z-10 mx-auto max-w-3xl">
    <h1 className="text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
      공지사항
    </h1>
    <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
      비즈스쿨의 새로운 소식과 서비스 업데이트,<br />
      이벤트 정보를 확인하세요.
    </p>
  </div>
</section>
```

*(education/page.tsx Hero 패턴 동일)*

---

### 4.2 `src/components/notice/NoticeSearch.tsx` (Client Component)

**역할**: 검색 키워드 입력 → URL params 업데이트

```typescript
"use client";

interface NoticeSearchProps {
  initialSearch: string;
  totalCount: number;
  isSearchResult: boolean; // search param이 존재하는지
}
```

**레이아웃**:

```
┌─────────────────────────────────────────────┐
│  ┌─────────────────────────────┬──────────┐ │
│  │ 🔍 공지사항 검색             │  검색     │ │
│  └─────────────────────────────┴──────────┘ │
│  총 20개의 공지사항 (or "검색결과 3건")       │
└─────────────────────────────────────────────┘
```

**스타일 사양**:
- 컨테이너: 없음 (page.tsx에서 감싸는 `div` 내부)
- form: `flex gap-2`
- input: `flex-1 rounded-lg border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-body)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]`
- button: `shrink-0 rounded-lg bg-[var(--color-primary)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90`
- 카운트 텍스트: `mt-3 text-sm text-[var(--color-muted)]`
  - 검색 시: `"검색결과 {N}건"` + 검색어 초기화 링크
  - 미검색 시: `"총 {N}개의 공지사항"`

**동작**:
- Enter 또는 검색 버튼 클릭 → `router.push(/notice?search=keyword&page=1)`
- 검색어 초기화: `router.push(/notice)`

---

### 4.3 `src/components/notice/NoticeTable.tsx` (Server Component)

**역할**: 공지사항 목록을 데스크톱 테이블 / 모바일 카드로 표시

```typescript
interface NoticeTableProps {
  notices: Notice[];
}
```

#### Desktop: 테이블 (`hidden md:block`)

```
┌────────┬───────────────────────────┬────────┬──────────┬────────┐
│  번호  │           제목             │ 작성자  │   작성일  │ 조회수 │
├────────┼───────────────────────────┼────────┼──────────┼────────┤
│  중요  │ [중요] 2026년 상반기 교육..│ 관리자  │ 03.20    │   254  │
│  중요  │ [중요] 시스템 점검 안내     │ 관리자  │ 03.18    │   180  │
│  중요  │ [중요] 개인정보처리방침 변경│ 관리자  │ 03.15    │   122  │
│   20   │ 3월 신규 강의 오픈 안내     │ 관리자  │ 03.12    │    67  │
│   19   │ 도서 할인 이벤트            │ 관리자  │ 03.10    │    45  │
│  ...   │ ...                       │  ...   │   ...    │  ...   │
└────────┴───────────────────────────┴────────┴──────────┴────────┘
```

**테이블 사양**:
- wrapper: `hidden md:block overflow-x-auto`
- table: `w-full table-fixed text-sm`
- colgroup 비율:
  ```html
  <col className="w-[8%]" />    <!-- 번호 -->
  <col className="w-[52%]" />   <!-- 제목 -->
  <col className="w-[12%]" />   <!-- 작성자 -->
  <col className="w-[15%]" />   <!-- 작성일 -->
  <col className="w-[13%]" />   <!-- 조회수 -->
  ```
- thead: `bg-[var(--color-light-bg)]`
- th: `px-4 py-3 text-center font-medium text-[var(--color-muted)]` (제목 열만 `text-left`)
- tbody tr: `border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-light-bg)] cursor-pointer`
- td: `px-4 py-4 text-center text-[var(--color-body)]`

**번호 열 처리**:
- `isImportant: true` → 번호 대신 빨간 "중요" 배지:
  ```tsx
  <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-500">
    중요
  </span>
  ```
- `isImportant: false` → 일반 번호 표시

**제목 열 처리**:
- `isImportant` → 제목 앞에 `font-bold text-[var(--color-dark)]`
- 일반 → `text-[var(--color-body)]`
- 클릭 시 `/notice/[id]`로 이동 (`<Link>` 또는 `tr` onClick)

**작성일 포맷**: `"2026-03-20"` → `"2026.03.20"` (replace `-` → `.`)

#### Mobile: 카드 (`space-y-3 md:hidden`)

```
┌──────────────────────────────────────────────┐
│ [중요] 2026년 상반기 교육과정 안내              │
│ 관리자 · 2026.03.20 · 조회 254               │
├──────────────────────────────────────────────┤
│ [중요] 시스템 점검 안내                        │
│ 관리자 · 2026.03.18 · 조회 180               │
├──────────────────────────────────────────────┤
│ 3월 신규 강의 오픈 안내                        │
│ 관리자 · 2026.03.12 · 조회 67                │
└──────────────────────────────────────────────┘
```

**카드 사양**:
- wrapper: `space-y-3 md:hidden`
- 각 카드: `<Link>` wrapper
  ```tsx
  <Link
    href={`/notice/${notice.id}`}
    className="block rounded-xl border border-[var(--color-border)] bg-white p-4 transition-colors hover:bg-[var(--color-light-bg)]"
  >
  ```
- 제목 행:
  - 중요 공지: `<span className="mr-1.5 inline-flex ... text-red-500">중요</span>` + `font-bold text-[var(--color-dark)]`
  - 일반: `font-medium text-[var(--color-dark)]`
- 메타 정보: `mt-2 text-xs text-[var(--color-muted)]`
  - 형식: `"관리자 · 2026.03.20 · 조회 254"`
  - 구분자: ` · ` (middle dot with spaces)

#### Empty State

```tsx
<div className="py-20 text-center">
  <p className="text-lg font-medium text-[var(--color-muted)]">
    등록된 공지사항이 없습니다
  </p>
  <p className="mt-1 text-sm text-[var(--color-muted)]">
    새로운 소식이 등록되면 이곳에 표시됩니다
  </p>
</div>
```

검색 결과가 없을 때:
```tsx
<div className="py-20 text-center">
  <p className="text-lg font-medium text-[var(--color-muted)]">
    검색 결과가 없습니다
  </p>
  <p className="mt-1 text-sm text-[var(--color-muted)]">
    다른 검색어로 시도해 보세요
  </p>
</div>
```

---

### 4.4 `src/components/notice/NoticePagination.tsx` (Client Component)

**역할**: CommunityPagination과 동일한 로직, URL 경로만 `/notice`로 변경

```typescript
"use client";

interface NoticePaginationProps {
  currentPage: number;
  totalPages: number;
  search?: string; // 검색 상태 유지
}
```

**동작**:
- `router.push(/notice?page=N)` (검색 중이면 `&search=keyword` 유지)
- max 5 visible pages, sliding window
- `totalPages <= 1`이면 `return null`

**스타일**: CommunityPagination과 동일
- nav: `flex items-center justify-center gap-1 py-8`
- 페이지 버튼: `h-10 w-10 rounded-lg`
- 활성: `bg-[var(--color-primary)] font-bold text-white`
- 비활성: `text-[var(--color-body)] hover:bg-[var(--color-light-bg)]`
- 이전/다음: `ChevronLeft` / `ChevronRight` size={18}

---

## 5. Page Design: 상세 (`/notice/[id]`)

### 5.1 `src/app/notice/[id]/page.tsx` (Server Component)

**Metadata** (dynamic):
```typescript
export async function generateMetadata({ params }: NoticeDetailProps): Promise<Metadata> {
  const { id } = await params;
  const notice = notices.find((n) => n.id === Number(id));
  return {
    title: notice ? `${notice.title} | BIZSCHOOL` : "공지사항 | BIZSCHOOL",
    description: notice?.title,
  };
}
```

**Props**:
```typescript
interface NoticeDetailProps {
  params: Promise<{ id: string }>;
}
```

**데이터 처리**:
```typescript
const { id } = await params;
const notice = notices.find((n) => n.id === Number(id));
if (!notice) notFound();

// 이전글/다음글 계산 (정렬된 목록 기준)
const sorted = getSortedNotices(notices);
const currentIndex = sorted.findIndex((n) => n.id === notice.id);
const prevNotice = currentIndex > 0 ? sorted[currentIndex - 1] : null;
const nextNotice = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;
```

**레이아웃**:

```
┌─────────────────────────────────────────────────────┐
│  Container (max-w-[1200px] mx-auto px-4 py-8)       │
│                                                      │
│  ┌───────────────────────────────────────────────┐   │
│  │  Header Area                                   │   │
│  │  [중요] 배지 (isImportant일 때만)               │   │
│  │  h1: 공지사항 제목 (text-2xl font-bold)         │   │
│  │  ─── 구분선 ───                                 │   │
│  │  작성자 · 작성일 · 조회수                        │   │
│  └───────────────────────────────────────────────┘   │
│                                                      │
│  ┌───────────────────────────────────────────────┐   │
│  │  Content Area (mt-8)                           │   │
│  │  HTML 본문 (prose 스타일)                       │   │
│  └───────────────────────────────────────────────┘   │
│                                                      │
│  ┌───────────────────────────────────────────────┐   │
│  │  Navigation (mt-10)                            │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │ △ 이전글  2026년 교육 일정 변경 안내      │   │   │
│  │  ├─────────────────────────────────────────┤   │   │
│  │  │ ▽ 다음글  시스템 점검 안내               │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  └───────────────────────────────────────────────┘   │
│                                                      │
│  ┌───────────────────────────────────────────────┐   │
│  │  [목록으로] 버튼 (mt-6, 중앙 정렬)             │   │
│  └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

#### Header Area

```tsx
<div className="border-b border-[var(--color-border)] pb-6">
  {notice.isImportant && (
    <span className="mb-3 inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-500">
      중요
    </span>
  )}
  <h1 className="text-xl font-bold text-[var(--color-dark)] md:text-2xl">
    {notice.title}
  </h1>
  <div className="mt-3 flex items-center gap-3 text-sm text-[var(--color-muted)]">
    <span>{notice.author}</span>
    <span className="text-[var(--color-border)]">|</span>
    <span>{notice.createdAt.replace(/-/g, ".")}</span>
    <span className="text-[var(--color-border)]">|</span>
    <span>조회 {notice.views.toLocaleString()}</span>
  </div>
</div>
```

#### Content Area

```tsx
<div
  className="prose prose-sm mt-8 max-w-none text-[var(--color-body)] md:prose-base"
  dangerouslySetInnerHTML={{ __html: notice.content }}
/>
```

**주의**: Mock 데이터는 직접 작성한 정적 HTML이므로 sanitize 불필요. 추후 백엔드 연동 시 DOMPurify 등 적용 고려.

Tailwind prose 플러그인이 없으면 기본 스타일로 대체:
```tsx
<div className="mt-8 space-y-4 text-sm leading-relaxed text-[var(--color-body)] md:text-base">
```

#### Prev/Next Navigation

```tsx
<div className="mt-10 divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
  {prevNotice && (
    <Link
      href={`/notice/${prevNotice.id}`}
      className="flex items-center gap-3 px-5 py-4 text-sm transition-colors hover:bg-[var(--color-light-bg)]"
    >
      <span className="shrink-0 text-xs font-medium text-[var(--color-muted)]">△ 이전글</span>
      <span className="truncate text-[var(--color-body)]">{prevNotice.title}</span>
    </Link>
  )}
  {nextNotice && (
    <Link
      href={`/notice/${nextNotice.id}`}
      className="flex items-center gap-3 px-5 py-4 text-sm transition-colors hover:bg-[var(--color-light-bg)]"
    >
      <span className="shrink-0 text-xs font-medium text-[var(--color-muted)]">▽ 다음글</span>
      <span className="truncate text-[var(--color-body)]">{nextNotice.title}</span>
    </Link>
  )}
</div>
```

#### 목록 버튼

```tsx
<div className="mt-6 flex justify-center">
  <Link
    href="/notice"
    className="rounded-lg border border-[var(--color-border)] px-8 py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
  >
    목록으로
  </Link>
</div>
```

---

## 6. Implementation Order

| Step | Task | Files | FR |
|------|------|-------|----|
| 1 | Notice 타입 추가 | `src/types/index.ts` | - |
| 2 | Mock 데이터 생성 | `src/data/notice.ts` | - |
| 3 | NoticeSearch 컴포넌트 | `src/components/notice/NoticeSearch.tsx` | FR-04 |
| 4 | NoticeTable 컴포넌트 | `src/components/notice/NoticeTable.tsx` | FR-02, FR-03, FR-09 |
| 5 | NoticePagination 컴포넌트 | `src/components/notice/NoticePagination.tsx` | FR-05 |
| 6 | 목록 페이지 조립 | `src/app/notice/page.tsx` | FR-01 |
| 7 | 상세 페이지 | `src/app/notice/[id]/page.tsx` | FR-06, FR-07, FR-08 |

---

## 7. Acceptance Criteria

| ID | Criteria | Verification |
|----|----------|-------------|
| AC-01 | `/notice` 페이지에 Hero + 검색 + 테이블 + 페이지네이션 표시 | Visual |
| AC-02 | 테이블 컬럼: 번호, 제목, 작성자, 작성일, 조회수 표시 | Visual |
| AC-03 | 중요 공지 3건이 상단 고정 + "중요" 빨간 배지 표시 | Visual |
| AC-04 | 검색 입력 후 제목 키워드 필터링 동작, 결과 건수 표시 | Functional |
| AC-05 | 페이지네이션 10개씩 분할, 2페이지 이상 동작 | Functional |
| AC-06 | 목록 항목 클릭 → `/notice/[id]` 상세 페이지 이동 | Navigation |
| AC-07 | 상세: 제목, 작성자, 작성일, 조회수, 본문 표시 | Visual |
| AC-08 | 상세: 이전글/다음글 네비게이션 동작 | Navigation |
| AC-09 | 상세: "목록으로" 버튼 → `/notice` 이동 | Navigation |
| AC-10 | 모바일 (md 미만): 테이블 → 카드 레이아웃 전환 | Responsive |
| AC-11 | 빌드 에러 없음 | `npm run build` |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-22 | Initial draft | allen |
