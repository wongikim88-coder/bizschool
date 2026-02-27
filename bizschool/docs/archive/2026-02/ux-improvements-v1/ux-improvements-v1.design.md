# Design: UX Improvements V1

## Feature Name
`ux-improvements-v1`

## Plan Reference
`docs/01-plan/features/ux-improvements-v1.plan.md`

## Created
2026-02-27

## Status
Draft

---

## 1. Implementation Order

```
Step 1: REQ-01 + REQ-02 — 홈 페이지를 강의 카탈로그로 변경 + 헤더 링크 수정
Step 2: REQ-04 + REQ-05 — 전문가상담 페이지 공통 헤더 통합 + 사이드바 기본 열림
Step 3: REQ-03 — 도서 페이지 검색 UI 개선 (인프런 스타일 카테고리 패널)
```

---

## 2. Detailed Design

### STEP 1: 홈 = 강의 카탈로그 (REQ-01 + REQ-02)

#### 2.1.1 `src/app/page.tsx` — 강의 카탈로그 페이지로 교체

**Before:**
```tsx
<MainBanner />
<RecommendedCourses courses={sampleCourses} />
<RecommendedBooks books={sampleBooks} />
```

**After:**
```tsx
<div className="mx-auto max-w-[1200px] px-4 pb-12">
  {/* 배너 섹션 */}
  <MainBanner />

  {/* 전체 강의 섹션 */}
  <section className="mt-8">
    <h2 className="text-xl font-bold text-[var(--color-dark)]">전체 강의</h2>
    <p className="mt-1 text-sm text-[var(--color-muted)]">
      총 {sampleCourses.length}개의 강의
    </p>
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {sampleCourses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  </section>
</div>
```

**핵심 변경:**
- `RecommendedCourses`, `RecommendedBooks` import 제거
- `sampleBooks` import 제거
- MainBanner 유지 (강의 관련 배너이므로 적합)
- `sampleCourses` 전체를 그리드로 표시
- `CourseCard` 직접 import하여 사용

#### 2.1.2 `src/components/layout/Header.tsx` — 강의 링크 수정

**Before:**
```ts
const menuItems: MenuItem[] = [
  { label: "강의", href: "/courses" },
  ...
];
```

**After:**
```ts
const menuItems: MenuItem[] = [
  { label: "강의", href: "/" },
  ...
];
```

**Footer.tsx도 동일하게 수정:**
```ts
// footerLinks 내 "강의" 섹션의 href들
{ label: "전체강의", href: "/" },
{ label: "추천강의", href: "/?filter=recommended" },
{ label: "신규강의", href: "/?filter=new" },
{ label: "무료강의", href: "/?filter=free" },
```

---

### STEP 2: 전문가상담 레이아웃 통합 (REQ-04 + REQ-05)

#### 2.2.1 `src/app/consulting/page.tsx` — 공통 헤더 사용 + inline 레이아웃

**Before:**
```tsx
<div className="fixed inset-0 z-[60] flex flex-col bg-[var(--color-light-bg)]">
  {/* 자체 Top Bar */}
  <header className="flex h-14 shrink-0 items-center justify-between ...">
    <div>
      <button>메뉴</button>
      <span>BIZSCHOOL</span>
      <span>AI 전문가 상담</span>
    </div>
    <Link href="/">BIZSCHOOL 홈</Link>  {/* 삭제 대상 */}
  </header>
  {/* Main Content */}
  <div className="flex flex-1 overflow-hidden">
    <Sidebar ... />
    <div className="flex flex-1 flex-col overflow-hidden">...</div>
  </div>
</div>
```

**After:**
```tsx
<div className="flex" style={{ height: "calc(100vh - 120px)" }}>
  {/* Sidebar — 모바일 토글, 데스크톱 기본 표시 */}
  <Sidebar
    sessions={sessions}
    currentSessionId={currentSessionId}
    isOpen={sidebarOpen}
    onToggle={() => setSidebarOpen(!sidebarOpen)}
    onNewChat={handleNewChat}
    onSelectSession={handleSelectSession}
  />
  {/* Chat Column */}
  <div className="flex flex-1 flex-col overflow-hidden">
    {/* 모바일 전용 상단 바 — 사이드바 토글 + 제목 */}
    <div className="flex h-12 shrink-0 items-center gap-3 border-b border-[var(--color-border)] bg-white px-4 md:hidden">
      <button onClick={() => setSidebarOpen(!sidebarOpen)}>
        <Menu size={20} />
      </button>
      <span className="text-sm font-medium text-[var(--color-primary)]">AI 전문가 상담</span>
    </div>
    <ChatArea ... />
    <ChatInput ... />
    <SuggestChips ... />
  </div>
</div>
```

**핵심 변경:**
- `fixed inset-0 z-[60]` → 제거. `<main>` 안에서 정상 렌더링
- 자체 `<header>` 완전 제거 (layout의 공통 Header 사용)
- "BIZSCHOOL 홈" 링크 삭제
- 높이: `calc(100vh - 120px)` (Header 64px + SearchBar ~56px = ~120px)
- 모바일 전용 상단 바: 사이드바 토글 버튼 + "AI 전문가 상담" 제목만 표시 (`md:hidden`)
- `Home`, `Link` import 불필요시 제거

#### 2.2.2 `src/components/consultation/Sidebar.tsx` — 레이아웃 조정

**Before:**
```tsx
<aside className={`
  fixed left-0 top-14 z-50 flex h-[calc(100vh-56px)] w-[280px] flex-col ...
  md:static md:z-auto md:h-auto md:w-[260px] md:translate-x-0
  ${isOpen ? "translate-x-0" : "-translate-x-full md:hidden"}
`}>
```

**After:**
```tsx
<aside className={`
  fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col border-r border-[var(--color-border)] bg-white transition-transform duration-200
  md:static md:z-auto md:flex md:h-auto md:w-[260px] md:translate-x-0
  ${isOpen ? "translate-x-0" : "-translate-x-full"}
`}>
```

**핵심 변경:**
- `top-14` → `top-0` (더 이상 자체 header 아래가 아님; 모바일에서는 fixed 오버레이)
- `h-[calc(100vh-56px)]` → `h-full`
- `md:hidden` (닫힌 상태에서 숨김) → 제거. 데스크톱에서는 항상 `md:flex`로 표시
- `${isOpen ? ... : "-translate-x-full md:hidden"}` → `${isOpen ? ... : "-translate-x-full"}` (md:hidden 제거)

#### 2.2.3 `sidebarOpen` 기본값 변경 (REQ-05)

**Before:**
```ts
const [sidebarOpen, setSidebarOpen] = useState(false);
```

**After:**
```ts
const [sidebarOpen, setSidebarOpen] = useState(true);
```

**동작:**
- 데스크톱: CSS `md:flex md:translate-x-0`로 항상 표시 (state와 무관)
- 모바일: `sidebarOpen` state에 의해 토글 (기본 true이면 처음에 열림)

---

### STEP 3: 도서 검색 UI 개선 (REQ-03)

#### 2.3.1 `src/components/layout/SearchBar.tsx` — 기능적 검색 + 카테고리 패널

**현재:** Server Component, 비기능적 input
**변경:** Client Component로 전환, 페이지별 동적 동작

```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { bookCategories } from "@/data/books";

export default function SearchBar() {
  const [value, setValue] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isBooks = pathname === "/books";

  // Outside click handler
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowPanel(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = () => {
    if (!value.trim()) return;
    if (isBooks) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("search", value.trim());
      params.set("page", "1");
      router.push(`/books?${params.toString()}`);
    }
    setShowPanel(false);
  };

  const handleCategoryClick = (key: string) => {
    const params = new URLSearchParams();
    if (key !== "all") params.set("category", key);
    params.set("page", "1");
    router.push(`/books?${params.toString()}`);
    setShowPanel(false);
  };

  const placeholder = isBooks
    ? "도서명 또는 저자를 검색하세요"
    : "배우고 싶은 강의를 검색해보세요";

  return (
    <div className="mx-auto max-w-[800px] px-4 py-4" ref={containerRef}>
      <div className="relative">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => isBooks && setShowPanel(true)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={placeholder}
          className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-light-bg)] py-3.5 pl-12 pr-5 text-sm ..."
        />
        {/* Clear button */}
        {value && (
          <button onClick={() => setValue("")} className="absolute right-4 top-1/2 -translate-y-1/2">
            <X size={16} />
          </button>
        )}

        {/* Browse Panel — 도서 페이지에서만 표시 */}
        {showPanel && isBooks && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-lg">
            <p className="mb-3 text-xs font-semibold text-[var(--color-muted)]">둘러보기</p>
            <div className="flex flex-wrap gap-2">
              {bookCategories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryClick(cat.key)}
                  className="rounded-full border border-[var(--color-border)] px-4 py-1.5 text-sm text-[var(--color-body)] hover:bg-[var(--color-light-bg)] hover:text-[var(--color-dark)] transition-colors"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

**핵심:**
- `usePathname()`으로 현재 페이지 감지
- `/books`일 때만 검색 기능 활성화 + 카테고리 패널 표시
- 다른 페이지에서는 기존과 동일 (비기능적 placeholder)
- 패널 UI: 인프런 스타일 — 검색창 바로 아래 드롭다운, "둘러보기" 제목 + 카테고리 pill 버튼
- 바깥 클릭 시 패널 닫힘 (mousedown 이벤트)
- Enter 키로 검색 실행

#### 2.3.2 `src/app/books/page.tsx` — BookSearch 제거

**Before:**
```tsx
import BookSearch from "@/components/books/BookSearch";
...
<Suspense>
  <CategoryFilter currentCategory={category} />
</Suspense>
<Suspense>
  <BookSearch currentSearch={search} />
</Suspense>
```

**After:**
```tsx
// BookSearch import 제거
...
<Suspense>
  <CategoryFilter currentCategory={category} />
</Suspense>
{/* BookSearch 렌더링 제거 — 상단 글로벌 SearchBar가 대체 */}
```

#### 2.3.3 `src/app/layout.tsx` — SearchBar를 Suspense로 감싸기

SearchBar가 Client Component로 전환되고 `useSearchParams`를 사용하므로:

```tsx
import { Suspense } from "react";
...
<Header />
<Suspense>
  <SearchBar />
</Suspense>
<main>{children}</main>
<Footer />
```

---

## 3. Component Dependency Map

```
layout.tsx
├── Header.tsx ............. [수정] "강의" href → "/"
├── SearchBar.tsx .......... [수정] Client Component 전환 + 카테고리 패널
├── <main>
│   ├── page.tsx ........... [수정] 강의 카탈로그로 교체
│   ├── books/page.tsx ..... [수정] BookSearch 제거
│   └── consulting/page.tsx  [수정] fixed fullscreen → inline, 자체 헤더 제거
│       ├── Sidebar.tsx .... [수정] 레이아웃 조정, 데스크톱 항상 표시
│       ├── ChatArea.tsx ... [변경 없음]
│       ├── ChatInput.tsx .. [변경 없음]
│       └── SuggestChips.tsx [변경 없음]
└── Footer.tsx ............. [수정] 강의 링크 href 수정
```

---

## 4. File Change Summary

| File | Action | Description |
|------|--------|-------------|
| `src/app/page.tsx` | **MODIFY** | MainBanner + 전체 강의 그리드로 교체 |
| `src/components/layout/Header.tsx` | **MODIFY** | `"강의"` href: `/courses` → `/` |
| `src/components/layout/Footer.tsx` | **MODIFY** | 강의 섹션 href들 수정 |
| `src/app/consulting/page.tsx` | **MODIFY** | fixed 레이아웃 제거, 자체 헤더 제거, sidebarOpen 기본값 true |
| `src/components/consultation/Sidebar.tsx` | **MODIFY** | fixed → static(md:), 데스크톱 항상 표시 |
| `src/components/layout/SearchBar.tsx` | **MODIFY** | Client Component 전환, 검색 기능 + 카테고리 패널 |
| `src/app/books/page.tsx` | **MODIFY** | BookSearch import/render 제거 |
| `src/app/layout.tsx` | **MODIFY** | SearchBar를 Suspense로 감싸기 |

**신규 파일: 없음** (SearchBrowsePanel을 별도로 분리하지 않고 SearchBar 내에 인라인 구현)

---

## 5. UI Specifications

### 5.1 홈 페이지 (강의 카탈로그)
- **레이아웃**: max-w-[1200px], px-4
- **배너**: 기존 MainBanner 유지 (5개 슬라이드 캐러셀)
- **강의 그리드**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`
- **강의 카드**: 기존 `CourseCard` 컴포넌트 재사용

### 5.2 도서 검색 패널
- **트리거**: 검색창 focus (도서 페이지에서만)
- **위치**: 검색창 바로 아래, absolute 포지셔닝
- **크기**: 검색창과 동일 너비 (left-0 right-0)
- **스타일**: rounded-xl, border, bg-white, shadow-lg, p-4
- **제목**: "둘러보기" (text-xs, font-semibold, color-muted)
- **카테고리**: flex-wrap gap-2, pill 버튼 (rounded-full, border, px-4 py-1.5)
- **닫기**: 바깥 영역 클릭 또는 카테고리 선택 시

### 5.3 전문가상담 페이지
- **높이**: `calc(100vh - 120px)` (Header 64px + SearchBar ~56px)
- **사이드바**: 데스크톱 w-[260px] 항상 표시, 모바일 w-[280px] fixed 오버레이
- **모바일 상단 바**: h-12, 메뉴 버튼 + "AI 전문가 상담" 텍스트 (md:hidden)
- **채팅 영역**: flex-1 flex-col overflow-hidden

---

## 6. Edge Cases

| Case | Handling |
|------|----------|
| 도서 검색 패널에서 카테고리 클릭 후 검색어 유지 | 카테고리 클릭 시 검색어 리셋 (새 필터링) |
| 전문가상담에서 모바일 사이드바 열린 채 화면 회전 | CSS `md:static` 전환으로 자연 처리 |
| 검색창 입력 중 다른 페이지 이동 | pathname 변경 감지, 패널 자동 닫힘 |
| 홈에서 검색창 focus 시 | `/books`가 아니므로 패널 미표시, 기존 동작 유지 |

---

## 7. Verification Checklist

- [ ] `/` 접속 시 MainBanner + 강의 카드 그리드가 표시됨
- [ ] 헤더 "강의" 클릭 시 `/`로 이동
- [ ] `/books` 페이지에서 하단 BookSearch가 없음
- [ ] `/books` 페이지에서 상단 검색창 클릭 시 카테고리 패널 드롭다운 표시
- [ ] 카테고리 패널에서 항목 클릭 시 해당 카테고리로 필터링
- [ ] 검색창에 텍스트 입력 + Enter로 도서 검색 동작
- [ ] 패널 바깥 클릭 시 패널 닫힘
- [ ] `/consulting` 페이지에서 공통 헤더(강의, 도서, 전문가상담, 커뮤니티) 표시
- [ ] `/consulting` 페이지에서 "BIZSCHOOL 홈" 링크 없음
- [ ] `/consulting` 데스크톱에서 좌측 대화기록 사이드바 기본 열림
- [ ] `/consulting` 모바일에서 사이드바 토글 동작
- [ ] 모든 페이지에서 헤더 동일 (sticky, 4개 메뉴)
