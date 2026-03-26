# Design: 메인페이지 UI 리디자인

> **Feature**: main-page-redesign
> **Plan**: [main-page-redesign.plan.md](../../01-plan/features/main-page-redesign.plan.md)
> **Created**: 2026-03-26
> **Status**: Design

---

## 1. 페이지 레이아웃 (위→아래)

```
┌──────────────────────────────────────────────────────┐
│  섹션 1: 현장강의 메인카드 (히어로 영역)                  │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                         │
│  │ Ed │ │ Ed │ │ Ed │ │ Ed │  ... 가로 스크롤 or 그리드 │
│  └────┘ └────┘ └────┘ └────┘                         │
├──────────────────────────────────────────────────────┤
│  섹션 2: 추천강의                    [더보기 →]         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                    │
│  │ C1  │ │ C2  │ │ C3  │ │ C4  │    4개 / 1줄        │
│  └─────┘ └─────┘ └─────┘ └─────┘                    │
├──────────────────────────────────────────────────────┤
│  섹션 3: 추천도서                    [더보기 →]         │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                 │
│  │ B1 │ │ B2 │ │ B3 │ │ B4 │ │ B5 │   5개 / 1줄     │
│  └────┘ └────┘ └────┘ └────┘ └────┘                 │
├──────────────────────────────────────────────────────┤
│  섹션 4: 온라인 강의                                   │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                    │
│  │     │ │     │ │     │ │     │   4열 x 4행          │
│  │     │ │     │ │     │ │     │   = 16개             │
│  │     │ │     │ │     │ │     │                      │
│  │     │ │     │ │     │ │     │                      │
│  └─────┘ └─────┘ └─────┘ └─────┘                    │
│           [ 1 ] [ 2 ] [ 3 ] ...    페이지네이션         │
└──────────────────────────────────────────────────────┘
```

---

## 2. 컴포넌트 설계

### 2-1. MainEducationCards (신규)

**파일**: `src/components/sections/MainEducationCards.tsx`
**타입**: Server Component (데이터 import만)

```
Props: 없음 (educationCourses 직접 import)

구조:
- 그라데이션 배경 히어로 영역
- 제목: "현장 강의 일정"
- educationCourses를 카드 그리드로 표시
- 각 카드: 카테고리 뱃지, 교육과정명, 일시, 강사, 수강료
- 전체 카드 클릭 → /education 링크
- 하단 "전체 일정 보기" 버튼 → /education
```

**카드 레이아웃 (데스크톱)**:
```
┌─────────────────────────────────┐
│ [세무회계]                        │
│ 고경희 세무사의 상속증여세 실무     │
│ 📅 2026-04-03 ~ 04-11           │
│ 👤 고경희 세무사                   │
│ 💰 550,000원                     │
└─────────────────────────────────┘
```

**반응형**: 모바일 1열 → 태블릿 2열 → 데스크톱 4열
**표시 개수**: 최대 4개 (나머지는 "전체 일정 보기"로 유도)

### 2-2. RecommendedCourses (기존 수정)

**파일**: `src/components/sections/RecommendedCourses.tsx`
**변경사항**: 없음 (이미 4개/1줄, CourseCard 사용)

- `sampleCourses.slice(0, 4)` → CourseCard 4개
- 섹션 헤더 "추천강의" + "더보기" 링크

### 2-3. RecommendedBooks (기존 수정)

**파일**: `src/components/sections/RecommendedBooks.tsx`
**변경사항**: 그리드 4열 → 5열, slice 4→5개

```diff
- <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
-   {books.slice(0, 4).map(...)}
+ <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
+   {books.slice(0, 5).map(...)}
```

**데이터**: `sampleBooks` (books.ts) → 상위 5개
**반응형**: 모바일 2열 → 태블릿 3열 → 데스크톱 5열

### 2-4. OnlineCourses (신규)

**파일**: `src/components/sections/OnlineCourses.tsx`
**타입**: Client Component ("use client" — 페이지네이션 state)

```
Props: { courses: Course[] }

State:
- currentPage: number (기본 1)

상수:
- ITEMS_PER_PAGE = 16

계산:
- totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE)
- paginatedCourses = courses.slice((currentPage-1)*16, currentPage*16)

구조:
- 섹션 헤더 "온라인 강의" + 총 개수 표시
- 4열 x 4행 그리드 (CourseCard)
- 하단 페이지네이션 (totalPages > 1일 때만)
```

**페이지네이션 UI**:
```
[← 이전]  1  2  3  [다음 →]
```
- 현재 페이지 강조 (primary 색상)
- 이전/다음 버튼 (첫/마지막 페이지에서 비활성)

**반응형**: 모바일 1열 → 태블릿 2열 → 데스크톱 4열

---

## 3. 데이터 설계

### 3-1. courses.ts 확장

현재 `sampleCourses` 8개 → **20개 이상**으로 확장

추가 강의 (c9~c20+):
- 다양한 카테고리 (경영, 마케팅, 재무, IT, 리더십 등)
- 가격대, 할인율, 평점, 뱃지 다양화
- 기존 구조(`Course` 타입) 그대로 유지

### 3-2. 기존 데이터 활용

| 섹션 | import | 데이터 |
|------|--------|--------|
| 메인카드 | `educationCourses` from `@/data/education` | 8개 중 4개 표시 |
| 추천강의 | `sampleCourses` from `@/data/courses` | 상위 4개 |
| 추천도서 | `sampleBooks` from `@/data/books` | 상위 5개 |
| 온라인강의 | `sampleCourses` from `@/data/courses` | 전체 (16개/페이지) |

---

## 4. page.tsx 구조

```tsx
// src/app/page.tsx
import MainEducationCards from "@/components/sections/MainEducationCards";
import RecommendedCourses from "@/components/sections/RecommendedCourses";
import RecommendedBooks from "@/components/sections/RecommendedBooks";
import OnlineCourses from "@/components/sections/OnlineCourses";
import { sampleCourses } from "@/data/courses";
import { sampleBooks } from "@/data/books";

export default function Home() {
  return (
    <div>
      {/* 섹션 1: 현장강의 메인카드 */}
      <MainEducationCards />

      {/* 섹션 2: 추천강의 (4개/1줄) */}
      <RecommendedCourses courses={sampleCourses} />

      {/* 섹션 3: 추천도서 (5개/1줄) */}
      <RecommendedBooks books={sampleBooks} />

      {/* 섹션 4: 온라인 강의 (16개/페이지 + 페이지네이션) */}
      <OnlineCourses courses={sampleCourses} />
    </div>
  );
}
```

---

## 5. 구현 순서

| 순서 | 작업 | 파일 | 의존성 |
|------|------|------|--------|
| 1 | 온라인 강의 Mock 데이터 확장 (8→20+) | `src/data/courses.ts` | 없음 |
| 2 | MainEducationCards 컴포넌트 생성 | `src/components/sections/MainEducationCards.tsx` | education.ts |
| 3 | RecommendedBooks 그리드 5열로 수정 | `src/components/sections/RecommendedBooks.tsx` | 없음 |
| 4 | OnlineCourses 컴포넌트 생성 | `src/components/sections/OnlineCourses.tsx` | courses.ts |
| 5 | page.tsx 레이아웃 재구성 | `src/app/page.tsx` | 1~4 완료 |

---

## 6. 스타일 가이드

- **색상**: 기존 CSS 변수 활용 (`--color-primary`, `--color-dark`, `--color-muted` 등)
- **간격**: 섹션 간 `py-12`, 카드 간 `gap-6`
- **메인카드 배경**: `bg-gradient-to-br from-[#155dfc] to-[#0d3b9e]` (education 페이지와 통일)
- **페이지네이션**: 기존 도서 페이지네이션 스타일 참고
- **카드 hover**: `group-hover` 패턴 유지
