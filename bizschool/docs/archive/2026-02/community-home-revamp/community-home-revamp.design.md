# Design: 커뮤니티 홈 리뉴얼 (community-home-revamp)

> Feature: 커뮤니티 홈 탭 — 인기 게시글 통합 피드 + 무한 스크롤
> Created: 2026-02-27
> Status: Design
> Plan Reference: `docs/01-plan/features/community-home-revamp.plan.md`

---

## 1. 아키텍처 개요

### 1.1 변경 전 (현재)

```
/community (page.tsx - Server Component)
├── CommunityTabs              - 탭 네비게이션 (Client)
├── [tab === "home"]
│   └── HomeTab                - Server Component
│       ├── Section "인기 강의질문"
│       │   └── PostCard x 5
│       ├── Section "인기 상담사례"
│       │   └── PostCard x 5
│       ├── Section "인기 소통공간"
│       │   └── PostCard x 5
│       └── WeeklyTopUsers     - 우측 사이드바
```

### 1.2 변경 후

```
/community (page.tsx - Server Component)
├── CommunityTabs              - 탭 네비게이션 (Client) [변경 없음]
├── [tab === "home"]
│   └── HomeTab                - Client Component ("use client")
│       ├── InfinitePostFeed   - 통합 피드 + 무한 스크롤 (Client)
│       │   ├── FeedPostCard x N - 피드 전용 카드
│       │   ├── LoadingSpinner   - 로딩 인디케이터
│       │   └── EndOfFeed        - 끝 메시지
│       └── WeeklyTopUsers     - 우측 사이드바 [변경 없음]
```

### 1.3 데이터 흐름

```
[data/community.ts]
  allPosts = [...courseQuestions, ...consultationCases, ...discussionPosts]
  ↓ viewCount 내림차순 정렬
  ↓ 인터리빙 셔플 (같은 타입 연속 방지)
  = shuffledFeed: (CourseQuestion | ConsultationCase | DiscussionPost)[]

[HomeTab.tsx] (Client Component)
  ↓ useState: displayCount = 10
  ↓ visiblePosts = shuffledFeed.slice(0, displayCount)
  ↓ IntersectionObserver → sentinel 감지 → displayCount += 10
  ↓ 렌더링: visiblePosts.map(post => <FeedPostCard />)
```

---

## 2. 데이터 모델 변경

### 2.1 타입 변경 — `src/types/index.ts`

```typescript
// CommunityPost에 content 필드 추가
export interface CommunityPost {
  id: string;
  title: string;
  author: string;
  category: string;
  createdAt: string;
  viewCount: number;
  commentCount: number;
  content: string;           // NEW: 본문 미리보기 텍스트 (1~2문장)
}
```

**변경 이유**: 인프런 레퍼런스처럼 게시물 카드에 본문 미리보기를 표시하기 위함.

### 2.2 Mock 데이터 변경 — `src/data/community.ts`

**추가할 항목**:

```typescript
// 기존 상수 유지
export const POSTS_PER_PAGE = 10;
export const HOME_POSTS_PER_SECTION = 5;   // 기존 탭에서 여전히 사용

// NEW: 무한 스크롤 배치 크기
export const FEED_BATCH_SIZE = 10;

// NEW: 통합 피드 생성 함수
export function getShuffledFeed(): (CourseQuestion | ConsultationCase | DiscussionPost)[] {
  // 구현 상세: 섹션 3.1 참조
}
```

**각 게시물 데이터에 `content` 필드 추가**:

| 타입 | content 예시 |
|------|-------------|
| CourseQuestion | `"급여 분개 시 4대보험 사용자부담분과 회사부담분을 어떻게 구분하여 처리하는지 궁금합니다. 특히 건강보험과 국민연금의 경우..."` |
| ConsultationCase | `"퇴직금 중간정산은 근로자가 요청하고 사용자가 승인해야 하며, 주택구입, 전세자금 등 법정 사유에 해당해야..."` |
| DiscussionPost | `"이직 고민이 있어서 글 올려봅니다. 현재 중소기업에서 경리로 3년째 근무 중인데, 연봉이 너무 낮아서..."` |

---

## 3. 핵심 로직 상세

### 3.1 셔플링 알고리즘 — `getShuffledFeed()`

**목표**: viewCount 기반 인기순을 유지하면서 같은 타입이 연속하지 않도록 배치

**알고리즘**:
```
1. 모든 게시물(45개)을 viewCount 내림차순 정렬
2. 타입별 큐 생성:
   - questionQueue: CourseQuestion[] (인기순)
   - consultationQueue: ConsultationCase[] (인기순)
   - discussionQueue: DiscussionPost[] (인기순)
3. Round-robin 인터리빙:
   - 3개 큐에서 번갈아 가며 1개씩 꺼냄
   - 큐가 비면 건너뜀
   - 결과: [Q, C, D, Q, C, D, Q, C, D, ...] (각각 인기순 유지)
```

**구현 코드 (data/community.ts)**:
```typescript
export function getShuffledFeed(): (CourseQuestion | ConsultationCase | DiscussionPost)[] {
  const questions = [...courseQuestions].sort((a, b) => b.viewCount - a.viewCount);
  const cases = [...consultationCases].sort((a, b) => b.viewCount - a.viewCount);
  const discussions = [...discussionPosts].sort((a, b) => b.viewCount - a.viewCount);

  const queues = [questions, cases, discussions];
  const result: (CourseQuestion | ConsultationCase | DiscussionPost)[] = [];
  const indices = [0, 0, 0];

  while (indices.some((idx, i) => idx < queues[i].length)) {
    for (let i = 0; i < queues.length; i++) {
      if (indices[i] < queues[i].length) {
        result.push(queues[i][indices[i]]);
        indices[i]++;
      }
    }
  }

  return result;
}
```

### 3.2 무한 스크롤 — `IntersectionObserver`

**구현 위치**: `HomeTab.tsx` 내부

```typescript
// 상태 관리
const [displayCount, setDisplayCount] = useState(FEED_BATCH_SIZE); // 10
const sentinelRef = useRef<HTMLDivElement>(null);

// 전체 피드 (모듈 레벨에서 한 번 생성)
const allPosts = getShuffledFeed(); // 45개

// 표시할 게시물
const visiblePosts = allPosts.slice(0, displayCount);
const hasMore = displayCount < allPosts.length;

// IntersectionObserver
useEffect(() => {
  if (!sentinelRef.current || !hasMore) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        setDisplayCount((prev) => Math.min(prev + FEED_BATCH_SIZE, allPosts.length));
      }
    },
    { rootMargin: "200px" }  // 200px 전에 미리 로드
  );

  observer.observe(sentinelRef.current);
  return () => observer.disconnect();
}, [displayCount, hasMore]);
```

**rootMargin "200px"**: 스크롤이 sentinel에 200px 전에 도달하면 미리 다음 배치를 로드하여 끊김 없는 UX 제공.

---

## 4. 컴포넌트 상세 설계

### 4.1 `HomeTab.tsx` (Client Component) — 전면 재작성

**역할**: 통합 인기 피드 + 무한 스크롤 관리. WeeklyTopUsers 사이드바 유지.

**Props**: 없음 (데이터를 data/community.ts에서 직접 import)

**레이아웃 (Desktop)**:
```
┌─────────────────────────────────────────────┬────────────────────────┐
│ 통합 인기 피드 (flex-1, min-w-0)             │ 우측 패널 (w-[280px])  │
│                                             │                        │
│ ┌─────────────────────────────────────────┐ │ ┌────────────────────┐ │
│ │ FeedPostCard                            │ │ │ 주간 활동 TOP 10   │ │
│ ├─────────────────────────────────────────┤ │ │ (sticky top-24)    │ │
│ │ FeedPostCard                            │ │ │                    │ │
│ ├─────────────────────────────────────────┤ │ └────────────────────┘ │
│ │ FeedPostCard                            │ │                        │
│ ├─────────────────────────────────────────┤ │                        │
│ │ ...                                     │ │                        │
│ ├─────────────────────────────────────────┤ │                        │
│ │ [로딩 스피너] 또는 [끝 메시지]            │ │                        │
│ └─────────────────────────────────────────┘ │                        │
└─────────────────────────────────────────────┴────────────────────────┘
```

**핵심 코드 구조**:
```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import PostCard from "./PostCard";
import WeeklyTopUsers from "./WeeklyTopUsers";
import { getShuffledFeed, weeklyTopUsers, FEED_BATCH_SIZE } from "@/data/community";
import { Loader2 } from "lucide-react";

const allPosts = getShuffledFeed();

export default function HomeTab() {
  const [displayCount, setDisplayCount] = useState(FEED_BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const visiblePosts = allPosts.slice(0, displayCount);
  const hasMore = displayCount < allPosts.length;

  useEffect(() => { /* IntersectionObserver - 섹션 3.2 참조 */ }, [displayCount, hasMore]);

  return (
    <div className="flex gap-6">
      <div className="min-w-0 flex-1">
        <div className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
          {visiblePosts.map((post) => (
            <PostCard key={post.id} post={post} variant="feed" />
          ))}
        </div>

        {/* Sentinel & Status */}
        {hasMore ? (
          <div ref={sentinelRef} className="flex justify-center py-8">
            <Loader2 size={24} className="animate-spin text-[var(--color-muted)]" />
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-[var(--color-muted)]">
            모든 게시물을 확인했습니다
          </p>
        )}
      </div>

      {/* 우측 사이드바 - 데스크톱 */}
      <div className="hidden w-[280px] shrink-0 pt-0 lg:block">
        <WeeklyTopUsers users={weeklyTopUsers} />
      </div>
    </div>
  );
}
```

**디자인 사양**:

| 요소 | 스타일 |
|------|--------|
| 2열 컨테이너 | `flex gap-6` |
| 피드 컨테이너 | `flex-1 min-w-0` |
| 피드 카드 리스트 | `divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]` |
| 로딩 스피너 | `flex justify-center py-8` + `Loader2 animate-spin text-[var(--color-muted)]` |
| 끝 메시지 | `py-8 text-center text-sm text-[var(--color-muted)]` |
| 우측 패널 | `w-[280px] shrink-0 hidden lg:block` |

---

### 4.2 `PostCard.tsx` — `variant` prop 추가

**변경**: 기존 PostCard에 `variant` prop을 추가하여 피드용 레이아웃 지원. 기존 `"compact"` 레이아웃은 기본값으로 유지.

**Props 변경**:
```typescript
interface PostCardProps {
  post: CourseQuestion | ConsultationCase | DiscussionPost;
  showTabTag?: boolean;       // 기존: 홈 섹션에서 탭 구분 태그
  variant?: "compact" | "feed";  // NEW: 카드 레이아웃 변형
}
```

**variant="feed" 레이아웃** (인프런 참고):
```
┌──────────────────────────────────────────────────────────────┐
│ [카테고리태그(색상)]                                           │
│                                                              │
│ 게시물 제목 (text-base font-bold)                              │
│                                                              │
│ 본문 미리보기 텍스트가 여기에 2줄까지 표시됩니다.                  │
│ 긴 텍스트는 말줄임표로 잘립니다...                               │
│                                                              │
│ 작성자 · 3시간 전                                    👁 342   │
└──────────────────────────────────────────────────────────────┘
```

**variant="compact" 레이아웃** (기존 — 변경 없음):
```
┌──────────────────────────────────────────────────────────────┐
│ [탭태그] [카테고리] 게시물 제목                        👁 342   │
│ 작성자 · 날짜 · 답변수/댓글수 · 상태배지                       │
└──────────────────────────────────────────────────────────────┘
```

**카테고리 태그 색상 (variant="feed")**:

| 타입 | 태그 텍스트 | 텍스트 색상 | 배경 색상 |
|------|-----------|-----------|----------|
| `question` | 강의질문 | `text-blue-600` | `bg-blue-50` |
| `consultation` | 상담사례 | `text-emerald-600` | `bg-emerald-50` |
| `discussion` | 소통공간 | `text-purple-600` | `bg-purple-50` |

**피드 카드 디자인 사양**:

| 요소 | 스타일 |
|------|--------|
| 컨테이너 | `px-5 py-5 cursor-pointer transition-colors hover:bg-[var(--color-light-bg)]` |
| 카테고리 태그 | `inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold` |
| 제목 | `mt-2 text-base font-bold text-[var(--color-dark)] line-clamp-1` |
| 본문 미리보기 | `mt-1.5 text-sm text-[var(--color-muted)] line-clamp-2` |
| 메타 정보 행 | `mt-3 flex items-center justify-between text-sm text-[var(--color-muted)]` |
| 작성자 + 시간 | `flex items-center gap-1.5` |
| 조회수 | `flex items-center gap-1 text-sm text-[var(--color-muted)]` |

**`line-clamp-1` 추가 필요**: globals.css에 line-clamp-1 유틸리티 추가.

```css
/* globals.css에 추가 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

**variant="feed" 렌더링 코드**:
```tsx
if (variant === "feed") {
  return (
    <article className="cursor-pointer px-5 py-5 transition-colors hover:bg-[var(--color-light-bg)]">
      {/* 카테고리 태그 */}
      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${tagStyles[post.type]}`}>
        {getTabTag(post)}
      </span>

      {/* 제목 */}
      <h3 className="mt-2 text-base font-bold text-[var(--color-dark)] line-clamp-1">
        {post.title}
      </h3>

      {/* 본문 미리보기 */}
      <p className="mt-1.5 text-sm text-[var(--color-muted)] line-clamp-2">
        {post.content}
      </p>

      {/* 메타 정보 */}
      <div className="mt-3 flex items-center justify-between text-sm text-[var(--color-muted)]">
        <div className="flex items-center gap-1.5">
          <span>{post.author}</span>
          <span>·</span>
          <span>{post.createdAt}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye size={14} />
          <span>{formatViewCount(post.viewCount)}</span>
        </div>
      </div>
    </article>
  );
}
```

**tagStyles 매핑 객체**:
```typescript
const tagStyles: Record<string, string> = {
  question: "bg-blue-50 text-blue-600",
  consultation: "bg-emerald-50 text-emerald-600",
  discussion: "bg-purple-50 text-purple-600",
};
```

---

### 4.3 `community/page.tsx` — 최소 변경

**변경 내용**: HomeTab이 Client Component가 되어도 page.tsx의 구조는 거의 동일. 단, 모바일 WeeklyTopUsers 위치를 HomeTab 내부로 이동.

**변경 전**:
```tsx
{tab === "home" && (
  <>
    <HomeTab />
    <div className="mt-6 lg:hidden">
      <WeeklyTopUsers users={weeklyTopUsers} layout="horizontal" />
    </div>
  </>
)}
```

**변경 후**:
```tsx
{tab === "home" && <HomeTab />}
```

모바일 WeeklyTopUsers는 HomeTab 내부에서 처리 (피드 하단 배치):

```tsx
// HomeTab.tsx 내부 - 피드 끝 메시지 아래
{!hasMore && (
  <div className="mt-6 lg:hidden">
    <WeeklyTopUsers users={weeklyTopUsers} layout="horizontal" />
  </div>
)}
```

---

### 4.4 변경 없는 컴포넌트 (확인)

| 컴포넌트 | 상태 |
|----------|------|
| `CommunityTabs.tsx` | 변경 없음 |
| `WeeklyTopUsers.tsx` | 변경 없음 |
| `QuestionsTab.tsx` | 변경 없음 |
| `CasesTab.tsx` | 변경 없음 |
| `DiscussionTab.tsx` | 변경 없음 |
| `CommunityPagination.tsx` | 변경 없음 |

---

## 5. 구현 순서

| # | 파일 | 변경 내용 | 의존성 |
|---|------|----------|--------|
| 1 | `src/types/index.ts` | `CommunityPost`에 `content: string` 필드 추가 | 없음 |
| 2 | `src/app/globals.css` | `.line-clamp-1` 유틸리티 추가 | 없음 |
| 3 | `src/data/community.ts` | 모든 게시물에 `content` 필드 추가 + `FEED_BATCH_SIZE` + `getShuffledFeed()` 함수 | #1 |
| 4 | `src/components/community/PostCard.tsx` | `variant` prop 추가 + `"feed"` 레이아웃 구현 + `tagStyles` 매핑 | #1 |
| 5 | `src/components/community/HomeTab.tsx` | 전면 재작성: Client Component + 무한 스크롤 + 통합 피드 | #3, #4 |
| 6 | `src/app/community/page.tsx` | 모바일 WeeklyTopUsers 제거 (HomeTab 내부로 이동) | #5 |

---

## 6. 반응형 디자인

### 6.1 브레이크포인트별 동작

| 브레이크포인트 | 피드 영역 | 사이드바 | 비고 |
|----------------|----------|---------|------|
| `< 640px` (모바일) | 1열, 전체 너비 | 숨김 (피드 끝에 가로스크롤) | PostCard 조회수 숨김 (`hidden sm:flex`) |
| `640px ~ 1023px` (태블릿) | 1열, 전체 너비 | 숨김 (피드 끝에 가로스크롤) | PostCard 조회수 표시 |
| `>= 1024px` (데스크톱) | flex-1 | w-[280px] sticky | 2열 레이아웃 |

### 6.2 피드 카드 반응형

- 모바일: 조회수 `hidden sm:flex`
- 본문 미리보기: 모든 해상도에서 `line-clamp-2` (2줄 제한)

---

## 7. 디자인 토큰

기존 CSS Variables 활용 (새 토큰 추가 불필요):

| 용도 | CSS Variable / Tailwind |
|------|------------------------|
| 카드 hover 배경 | `var(--color-light-bg)` |
| 제목 텍스트 | `var(--color-dark)` |
| 본문/메타 텍스트 | `var(--color-muted)` |
| 카드 구분선 | `var(--color-border)` |
| 로딩 스피너 | `var(--color-muted)` |
| 강의질문 태그 | Tailwind `blue-50`, `blue-600` |
| 상담사례 태그 | Tailwind `emerald-50`, `emerald-600` |
| 소통공간 태그 | Tailwind `purple-50`, `purple-600` |

**Tailwind CSS v4 주의**: `bg-[var(--color-light-bg)]` (O) / `bg-[--color-light-bg]` (X)

---

## 8. 접근성 요구사항

| 컴포넌트 | 접근성 처리 |
|----------|-------------|
| 피드 카드 리스트 | 각 카드 `<article>` 태그 유지, 제목 `<h3>` |
| 무한 스크롤 | 로딩 중 `aria-busy="true"`, `role="status"` for 로딩 스피너 |
| 로딩 스피너 | `<span className="sr-only">게시물을 불러오는 중입니다</span>` |
| 끝 메시지 | `role="status"` + `aria-live="polite"` |
| 카테고리 태그 | 태그 텍스트가 이미 의미를 담으므로 추가 aria 불필요 |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-27 | Initial draft | Claude |
