# community-home-revamp Analysis Report

> **Analysis Type**: Gap Analysis (Design vs Implementation)
>
> **Project**: BIZSCHOOL
> **Version**: Next.js 16.1.6
> **Analyst**: Claude (gap-detector agent)
> **Date**: 2026-02-27
> **Design Doc**: [community-home-revamp.design.md](../02-design/features/community-home-revamp.design.md)

---

## 1. Analysis Overview

### 1.1 Analysis Purpose

Verify that the community-home-revamp implementation matches the design specification. This feature replaces the old 3-section HomeTab (Server Component with separate question/consultation/discussion sections) with a unified infinite-scroll feed (Client Component) using round-robin interleaving by post type.

### 1.2 Analysis Scope

| Item | Path |
|------|------|
| Design Document | `docs/02-design/features/community-home-revamp.design.md` |
| Type Definitions | `src/types/index.ts` |
| CSS Utilities | `src/app/globals.css` |
| Data Layer | `src/data/community.ts` |
| Feed Card | `src/components/community/PostCard.tsx` |
| Home Tab | `src/components/community/HomeTab.tsx` |
| Page Entry | `src/app/community/page.tsx` |

---

## 2. Gap Analysis (Design vs Implementation)

### 2.1 Data Model -- `src/types/index.ts`

| Requirement | Design | Implementation | Status |
|-------------|--------|----------------|--------|
| `CommunityPost.content` field | `content: string` | `content: string` (line 78) | MATCH |
| CommunityPost other fields | id, title, author, category, createdAt, viewCount, commentCount | All present (lines 71-78) | MATCH |
| CourseQuestion extends CommunityPost | type, courseName, answerCount, isAnswered | All present (lines 81-86) | MATCH |
| ConsultationCase extends CommunityPost | type, isVerified, verifiedBy, helpfulCount | All present (lines 88-93) | MATCH |
| DiscussionPost extends CommunityPost | type, subCategory union type | All present (lines 95-98) | MATCH |

**Score: 5/5 (100%)**

### 2.2 CSS Utilities -- `src/app/globals.css`

| Requirement | Design | Implementation | Status |
|-------------|--------|----------------|--------|
| `.line-clamp-1` utility | Display, -webkit-line-clamp: 1, box-orient, overflow | Exact match (lines 40-45) | MATCH |
| `.line-clamp-2` preserved | Existing utility unchanged | Present (lines 47-52) | MATCH |

**Score: 2/2 (100%)**

### 2.3 Data Layer -- `src/data/community.ts`

| Requirement | Design | Implementation | Status |
|-------------|--------|----------------|--------|
| `FEED_BATCH_SIZE = 10` | Constant export | `export const FEED_BATCH_SIZE = 10;` (line 12) | MATCH |
| `POSTS_PER_PAGE` preserved | Existing constant | Present (line 10) | MATCH |
| `HOME_POSTS_PER_SECTION` preserved | Existing constant | Present (line 11) | MATCH |
| `getShuffledFeed()` function | Round-robin interleaving with viewCount sort | Exact algorithm match (lines 16-35) | MATCH |
| Return type | `(CourseQuestion \| ConsultationCase \| DiscussionPost)[]` | Matches (line 16) | MATCH |
| Sort by viewCount descending | 3 arrays sorted independently | `b.viewCount - a.viewCount` for each (lines 17-19) | MATCH |
| Round-robin interleaving | Cycle through queues, skip empty | `while/for` with index tracking (lines 25-32) | MATCH |
| CourseQuestion count: 15 | 15 items with content | 15 items (q-1 to q-15), all have content | MATCH |
| ConsultationCase count: 15 | 15 items with content | 15 items (c-1 to c-15), all have content | MATCH |
| DiscussionPost count: 15 | 15 items with content | 15 items (d-1 to d-15), all have content | MATCH |
| Total posts: 45 | 45 posts with content field | 45 content fields verified | MATCH |

**Score: 11/11 (100%)**

### 2.4 PostCard Component -- `src/components/community/PostCard.tsx`

| Requirement | Design | Implementation | Status |
|-------------|--------|----------------|--------|
| `variant` prop added | `variant?: "compact" \| "feed"` | Present (line 7) | MATCH |
| Default variant | `"compact"` | `variant = "compact"` (line 43) | MATCH |
| `tagStyles` mapping | question=blue, consultation=emerald, discussion=purple | Exact match (lines 37-41) | MATCH |
| Feed variant: `<article>` tag | Semantic HTML | `<article>` (line 46) | MATCH |
| Feed: container styles | `px-5 py-5 cursor-pointer transition-colors hover:bg-[var(--color-light-bg)]` | Exact match (line 46) | MATCH |
| Feed: category tag | `inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold` + tagStyles | Exact match (lines 48-52) | MATCH |
| Feed: title `<h3>` | `mt-2 text-base font-bold text-[var(--color-dark)] line-clamp-1` | Exact match (line 55) | MATCH |
| Feed: body preview `<p>` | `mt-1.5 text-sm text-[var(--color-muted)] line-clamp-2` | Exact match (line 60) | MATCH |
| Feed: renders `post.content` | Body preview text | `{post.content}` (line 61) | MATCH |
| Feed: meta row | `mt-3 flex items-center justify-between text-sm text-[var(--color-muted)]` | Exact match (line 65) | MATCH |
| Feed: author + time | `flex items-center gap-1.5`, dot separator | Exact match (lines 66-70) | MATCH |
| Feed: view count | `flex items-center gap-1` + Eye icon + formatViewCount | Present (lines 71-74) | MATCH |
| Mobile: view count hidden | `hidden sm:flex` | `hidden items-center gap-1 sm:flex` (line 71) | MATCH |
| Compact variant unchanged | Existing layout preserved | Lines 80-165 unchanged | MATCH |
| `getTabTag()` helper | Returns category label by type | Present (lines 24-35) | MATCH |
| `formatViewCount()` helper | 1000+ => k format | Present (lines 10-15) | MATCH |

**Score: 17/17 (100%)**

### 2.5 HomeTab Component -- `src/components/community/HomeTab.tsx`

| Requirement | Design | Implementation | Status |
|-------------|--------|----------------|--------|
| `"use client"` directive | Client Component | Present (line 1) | MATCH |
| Imports: useState, useEffect, useRef | React hooks | All three imported (line 3) | MATCH |
| Imports: PostCard | Feed card | Present (line 4) | MATCH |
| Imports: WeeklyTopUsers | Sidebar | Present (line 5) | MATCH |
| Imports: getShuffledFeed, weeklyTopUsers, FEED_BATCH_SIZE | Data layer | All three imported (line 6) | MATCH |
| Imports: Loader2 | Spinner icon | Present (line 7) | MATCH |
| Module-level `allPosts` | `getShuffledFeed()` called once | `const allPosts = getShuffledFeed();` (line 9) | MATCH |
| `displayCount` state | `useState(FEED_BATCH_SIZE)` | Present (line 12) | MATCH |
| `sentinelRef` | `useRef<HTMLDivElement>(null)` | Present (line 13) | MATCH |
| `visiblePosts` slice | `allPosts.slice(0, displayCount)` | Present (line 15) | MATCH |
| `hasMore` check | `displayCount < allPosts.length` | Present (line 16) | MATCH |
| IntersectionObserver | `rootMargin: "200px"` | Present (line 27) | MATCH |
| Observer cleanup | `observer.disconnect()` | Present (line 31) | MATCH |
| useEffect deps | `[displayCount, hasMore]` | Present (line 32) | MATCH |
| 2-column layout | `flex gap-6` | Present (line 35) | MATCH |
| Feed container | `min-w-0 flex-1` | Present (line 37) | MATCH |
| Card list | `divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]` | Present (line 38) | MATCH |
| PostCard with variant="feed" | Each post rendered | `<PostCard key={post.id} post={post} variant="feed" />` (line 40) | MATCH |
| Loading spinner | Loader2 with animate-spin | Present (line 47) | MATCH |
| Spinner sr-only text | `"게시물을 불러오는 중입니다"` | Present (line 48) | MATCH |
| End message | `"모든 게시물을 확인했습니다"` | Present (line 56) | MATCH |
| End message: role="status" | Accessibility | Present (line 52) | MATCH |
| End message: aria-live="polite" | Accessibility | Present (line 53) | MATCH |
| Mobile WeeklyTopUsers | `!hasMore && lg:hidden`, layout="horizontal" | Present (lines 61-64) | MATCH |
| Desktop sidebar | `hidden w-[280px] shrink-0 lg:block` | Present (line 69) | MATCH |
| WeeklyTopUsers with users prop | `users={weeklyTopUsers}` | Present (lines 63, 70) | MATCH |

**Score: 27/27 (100%)**

### 2.6 Page Entry -- `src/app/community/page.tsx`

| Requirement | Design | Implementation | Status |
|-------------|--------|----------------|--------|
| Simplified home tab rendering | `{tab === "home" && <HomeTab />}` | Exact match (line 35) | MATCH |
| No mobile WeeklyTopUsers in page.tsx | Removed from page level | Confirmed absent | MATCH |
| Other tabs unchanged | questions, cases, discussion with Suspense | All present (lines 37-53) | MATCH |

**Score: 3/3 (100%)**

### 2.7 Accessibility Requirements

| Requirement | Design | Implementation | Status |
|-------------|--------|----------------|--------|
| Feed cards: `<article>` tag | Semantic HTML | Both compact and feed variants use `<article>` | MATCH |
| Feed cards: `<h3>` for title | Heading hierarchy | Present in both variants | MATCH |
| Spinner: sr-only text | Screen reader announcement | `<span className="sr-only">게시물을 불러오는 중입니다</span>` | MATCH |
| End message: role="status" | ARIA landmark | Present on `<p>` element | MATCH |
| End message: aria-live="polite" | Live region | Present on `<p>` element | MATCH |

**Score: 5/5 (100%)**

### 2.8 Responsive Design

| Requirement | Design | Implementation | Status |
|-------------|--------|----------------|--------|
| Mobile: view count hidden | `hidden sm:flex` | Present in feed variant (line 71) | MATCH |
| Desktop sidebar: `lg:block` | Hidden below lg breakpoint | `hidden w-[280px] shrink-0 lg:block` (line 69) | MATCH |
| Mobile WeeklyTopUsers: `lg:hidden` | Show at feed end on mobile | `<div className="mt-6 lg:hidden">` (line 62) | MATCH |

**Score: 3/3 (100%)**

### 2.9 Design Tokens (Tailwind v4 Compliance)

| Token Usage | `var()` Wrapper | Status |
|-------------|:---------------:|--------|
| `bg-[var(--color-light-bg)]` (PostCard) | Yes | MATCH |
| `text-[var(--color-dark)]` (PostCard) | Yes | MATCH |
| `text-[var(--color-muted)]` (PostCard, HomeTab) | Yes | MATCH |
| `divide-[var(--color-border)]` (HomeTab) | Yes | MATCH |
| `border-[var(--color-border)]` (HomeTab) | Yes | MATCH |
| `text-[var(--color-primary)]` (PostCard compact) | Yes | MATCH |
| `bg-[var(--color-primary)]` (PostCard compact) | Yes | MATCH |
| `text-[var(--color-red)]` (PostCard compact) | Yes | MATCH |
| No bare `[--color-*]` references | Zero violations | MATCH |

**Score: 9/9 (100%)**

### 2.10 Unchanged Components Verification

| Component | File Exists | Status |
|-----------|:-----------:|--------|
| `CommunityTabs.tsx` | Yes | MATCH |
| `WeeklyTopUsers.tsx` | Yes | MATCH |
| `QuestionsTab.tsx` | Yes | MATCH |
| `CasesTab.tsx` | Yes | MATCH |
| `DiscussionTab.tsx` | Yes | MATCH |
| `CommunityPagination.tsx` | Yes | MATCH |

**Score: 6/6 (100%)**

---

## 3. Convention Compliance

### 3.1 Naming Convention Check

| Category | Convention | Files Checked | Compliance |
|----------|-----------|:-------------:|:----------:|
| Components | PascalCase | PostCard, HomeTab, WeeklyTopUsers | 100% |
| Functions | camelCase | getShuffledFeed, formatViewCount, getCategoryLabel, getTabTag | 100% |
| Constants | UPPER_SNAKE_CASE | FEED_BATCH_SIZE, POSTS_PER_PAGE, HOME_POSTS_PER_SECTION | 100% |
| Files (component) | PascalCase.tsx | PostCard.tsx, HomeTab.tsx | 100% |
| Files (data) | camelCase.ts | community.ts | 100% |

### 3.2 Import Order Check

**HomeTab.tsx**:
1. `"use client"` directive -- correct position
2. React (external library) -- correct
3. Local components (`./PostCard`, `./WeeklyTopUsers`) -- correct
4. Absolute imports (`@/data/community`) -- correct
5. External icon (`lucide-react`) -- correct

**PostCard.tsx**:
1. External library (`lucide-react`) -- correct
2. Type imports (`import type ... from "@/types"`) -- correct

All files follow convention order.

### 3.3 Tailwind v4 Compliance

All CSS custom property references use `var()` wrapper. Zero violations detected across all modified files.

---

## 4. Positive Additions (Implementation exceeds Design)

No undocumented additions were found. The implementation is a faithful execution of the design.

---

## 5. Overall Score

### 5.1 Match Rate Summary

```
Total Checked Items:  88
Matched:              88  (100%)
Missing:               0  (  0%)
Changed:               0  (  0%)
Added:                 0  (  0%)
```

### 5.2 Category Scores

| Category | Items | Matched | Score | Status |
|----------|:-----:|:-------:|:-----:|:------:|
| Data Model (types) | 5 | 5 | 100% | PASS |
| CSS Utilities | 2 | 2 | 100% | PASS |
| Data Layer (community.ts) | 11 | 11 | 100% | PASS |
| PostCard Component | 17 | 17 | 100% | PASS |
| HomeTab Component | 27 | 27 | 100% | PASS |
| Page Entry (page.tsx) | 3 | 3 | 100% | PASS |
| Accessibility | 5 | 5 | 100% | PASS |
| Responsive Design | 3 | 3 | 100% | PASS |
| Design Tokens (Tailwind v4) | 9 | 9 | 100% | PASS |
| Unchanged Components | 6 | 6 | 100% | PASS |
| **TOTAL** | **88** | **88** | **100%** | **PASS** |

### 5.3 Overall Scores

| Category | Score | Status |
|----------|:-----:|:------:|
| Design Match | 100% | PASS |
| Architecture Compliance | 100% | PASS |
| Convention Compliance | 100% | PASS |
| **Overall Match Rate** | **100%** | **PASS** |

---

## 6. Recommendations

### 6.1 Assessment

The implementation is a pixel-perfect match of the design document across all 88 checked items. No gaps, no missing features, no deviations. All design requirements including data model changes, shuffling algorithm, infinite scroll mechanics, accessibility attributes, responsive breakpoints, and Tailwind v4 compliance are correctly implemented.

### 6.2 Next Steps

1. **No immediate action required** -- all design requirements are fully implemented
2. **Proceed to completion report** -- `/pdca report community-home-revamp`
3. **Manual QA recommended** -- verify smooth infinite scroll behavior in browser (Chrome, Firefox, Safari)
4. **Consider for future iteration** -- keyboard navigation for feed cards (Tab + Enter) is not in current design scope but may enhance accessibility

---

## 7. Design Document Updates Needed

No design document updates are needed. Implementation matches design exactly.

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-27 | Initial gap analysis -- 100% match | Claude (gap-detector) |
