# 전문가 스튜디오 (Expert Studio) Planning Document

> **Summary**: Expert users' management dashboard at `/expert/center` — covers course management, Q&A, revenue, guides, meeting requests, and an overview dashboard.
>
> **Project**: BIZSCHOOL
> **Version**: 0.1
> **Author**: Product Manager
> **Date**: 2026-03-26
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

Approved experts (role: `"expert"`) need a dedicated workspace to manage the full lifecycle of their content and business on BIZSCHOOL. Currently no such page exists at `/expert/center` — the link appears in the UserMenu dropdown but leads nowhere. This feature fills that gap by providing a structured, tab-based studio dashboard.

### 1.2 Background

The platform already supports role-based auth (`user | expert`). Experts can apply via `/expert` (ExpertApplicationForm), the Header shows a "콘텐츠 업로드" button for experts linking to `/expert/upload`, and the UserMenu already links to `/expert/center` labeled "전문가 스튜디오". The studio page itself must now be built.

The studio is intentionally a **frontend-only, mock-data implementation** — no real backend API for this iteration. The architecture follows the existing Starter-level pattern (`src/components/`, `src/data/`, `src/types/`).

### 1.3 Related Documents

- Expert consultation feature: archived 2026-03-25 (`docs/archive/2026-03/expert-consultation-design/`)
- Unified login (NextAuth 5 integration): archived 2026-03-26 (`docs/archive/2026-03/unified-login/`)
- Existing types: `bizschool/src/types/index.ts`

---

## 2. Scope

### 2.1 In Scope

- [ ] Route: `bizschool/src/app/expert/center/page.tsx` (access-guarded for `role === "expert"`)
- [ ] Studio layout with sidebar navigation (6 tabs mirroring mypage layout pattern)
- [ ] **대시보드 (Dashboard)**: Summary KPI cards + recent activity + revenue trend (static chart)
- [ ] **강의 관리 (Course Management)**: List of uploaded courses with status badge, edit/delete actions, stats per course
- [ ] **강의 질문 관리 (Q&A Management)**: Student questions across all expert's courses, filter + reply UI
- [ ] **수익 관리 (Revenue Management)**: Revenue dashboard with totals, monthly breakdown, settlement history
- [ ] **전문가 가이드 (Expert Guide)**: Static content — step-by-step guides, tips, FAQ accordion
- [ ] **미팅 요청 (Meeting Request)**: Form to request MD meeting, history list with status badges
- [ ] Mock data for all 6 sub-features in `bizschool/src/data/expertStudio.ts`
- [ ] New TypeScript interfaces in `bizschool/src/types/index.ts` (under `── 전문가 스튜디오 ──` section)
- [ ] Route guard: redirect non-expert users to `/` or `/expert` (application page)
- [ ] Responsive layout (mobile tabs + desktop sidebar, consistent with mypage)

### 2.2 Out of Scope

- Real API integration or database persistence
- File upload for course content (the `/expert/upload` route is a separate feature)
- Payment/settlement processing — display only
- Real-time notifications or live data
- Email/push notifications for Q&A answers
- Admin review workflow for meeting requests
- Analytics beyond static mock charts
- Editing actual course content (linking out to `/expert/upload` is sufficient)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | Route `/expert/center` renders the studio page only for `role === "expert"` users; others are redirected | Must | Pending |
| FR-02 | Studio has a persistent sidebar (desktop) and horizontal tab bar (mobile) with 6 navigation items | Must | Pending |
| FR-03 | Dashboard tab: 4 KPI summary cards (total courses, total revenue, total students, avg rating) | Must | Pending |
| FR-04 | Dashboard tab: recent activity feed (last 5 Q&A questions + course events) | Should | Pending |
| FR-05 | Dashboard tab: revenue trend chart (static SVG or simple bar visualization — no chart lib required) | Could | Pending |
| FR-06 | Course Management tab: paginated list of expert's courses with status badges (`draft`, `under_review`, `published`, `rejected`) | Must | Pending |
| FR-07 | Course Management tab: per-course stats row (수강생 수, 평점, 완료율) | Should | Pending |
| FR-08 | Course Management tab: edit action links to `/expert/upload?id={id}`, delete shows confirmation modal | Should | Pending |
| FR-09 | Q&A Management tab: list of student questions filterable by course and answer status (`answered` / `unanswered`) | Must | Pending |
| FR-10 | Q&A Management tab: inline reply form — expert can submit a mock answer | Should | Pending |
| FR-11 | Revenue Management tab: total revenue card, monthly revenue table, per-course breakdown | Must | Pending |
| FR-12 | Revenue Management tab: settlement history list with status (`정산완료`, `정산예정`, `정산대기`) | Should | Pending |
| FR-13 | Expert Guide tab: step-by-step course creation guide (numbered sections) | Must | Pending |
| FR-14 | Expert Guide tab: FAQ accordion (open/close individual items) | Should | Pending |
| FR-15 | Meeting Request tab: form with fields (topic, preferred date, message) and mock submit | Must | Pending |
| FR-16 | Meeting Request tab: history list of past/pending meeting requests with status badges | Should | Pending |
| FR-17 | All mock data sourced from `src/data/expertStudio.ts` | Must | Pending |
| FR-18 | TypeScript types for all new data shapes defined in `src/types/index.ts` | Must | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | Page renders without layout shift on tab switch | Visual check |
| Accessibility | All interactive elements keyboard-navigable, ARIA roles on tablist | Manual review |
| Responsiveness | Usable on 375px mobile and 1280px desktop | Chrome DevTools |
| Styling | Uses existing CSS variables (`var(--color-primary)`, `var(--color-border)`, etc.) — no new color tokens | Code review |
| Naming safety | No collision with existing `Course` or `Book` interfaces — use `ExpertCourse` for studio-side course objects | Code review |

---

## 4. User Stories

### 4.1 대시보드 (Dashboard)

**US-01**: As an expert, I want to see a summary of my key metrics at a glance (total courses, students, revenue, average rating) so that I can quickly assess my performance without navigating multiple tabs.

*Acceptance criteria:*
- 4 KPI cards are visible immediately on page load
- Each card shows a label, a primary value, and a unit (e.g., "₩1,240,000", "수강생 342명")
- Cards are responsive: 2-column on mobile, 4-column on desktop

**US-02**: As an expert, I want to see a feed of recent student activity (new questions, new enrollments) so that I can respond promptly without checking each course individually.

*Acceptance criteria:*
- Feed shows the 5 most recent events in chronological order (newest first)
- Each event shows event type icon, description, and relative time (e.g., "3시간 전")

**US-03**: As an expert, I want to see a revenue trend chart so that I can understand whether my earnings are growing or declining over time.

*Acceptance criteria:*
- Chart displays at least 6 months of revenue data
- No external chart library required — simple bar or line visualization acceptable for MVP

### 4.2 강의 관리 (Course Management)

**US-04**: As an expert, I want to see all my uploaded courses in a list with their current review status so that I know which ones are live and which need attention.

*Acceptance criteria:*
- Each row shows: thumbnail, title, status badge, enrollment count, rating, completion rate
- Status badges: `초안` (gray), `검토중` (blue), `게시됨` (green), `반려됨` (red)
- Rows are sorted by most recently updated

**US-05**: As an expert, I want to edit or delete one of my courses so that I can correct mistakes or remove outdated content.

*Acceptance criteria:*
- Edit button navigates to `/expert/upload?id={courseId}`
- Delete button shows a confirmation dialog; on confirm, removes from the list (mock state update)
- Rejected courses display a rejection reason tooltip or expandable note

**US-06**: As an expert, I want to see enrollment and completion statistics per course so that I can identify which courses are performing well.

*Acceptance criteria:*
- Stats displayed per course: 수강생 수, 평점 (with star icon), 완료율 (%)
- Stats are readable without opening a detail view

### 4.3 강의 질문 관리 (Q&A Management)

**US-07**: As an expert, I want to see all questions students have asked across my courses in one place so that I don't have to visit each course individually.

*Acceptance criteria:*
- List shows: student name, question title, associated course name, submitted date, answer status badge
- Default sort: unanswered questions appear first
- Filter dropdown: by course name, by answer status

**US-08**: As an expert, I want to reply to a student's question directly from the management page so that I can answer efficiently without losing context.

*Acceptance criteria:*
- Clicking a question expands or navigates to a detail view with the full question
- A reply textarea and submit button are present
- On submit, the question status changes to "답변완료" (mock state update)

**US-09**: As an expert, I want to filter questions by course so that I can focus on a specific course's Q&A in one session.

*Acceptance criteria:*
- Course filter is a select/dropdown populated with the expert's published course titles
- "전체" option shows all questions
- Filter state is preserved when switching between questions

### 4.4 수익 관리 (Revenue Management)

**US-10**: As an expert, I want to see my total lifetime revenue and monthly breakdown so that I can track my earnings over time.

*Acceptance criteria:*
- Top section: total accumulated revenue in KRW
- Monthly table: month, gross sales, platform fee (%), net revenue
- Per-course section: course title, units sold, revenue contribution

**US-11**: As an expert, I want to see my settlement history so that I know when payments were or will be processed.

*Acceptance criteria:*
- Settlement list shows: period, amount, status badge (`정산완료` green, `정산예정` blue, `정산대기` gray), payout date
- Most recent settlement appears first

### 4.5 전문가 가이드 (Expert Guide)

**US-12**: As a newly approved expert, I want to follow a step-by-step guide for creating my first course so that I can get started without support.

*Acceptance criteria:*
- Guide has numbered steps (at least 5) with title, description, and optional tip callout
- Each step references the relevant tool or page (e.g., "콘텐츠 업로드 버튼 클릭")
- A "지금 시작하기" CTA links to `/expert/upload`

**US-13**: As an expert, I want to browse a FAQ about content policies and platform rules so that I can resolve common questions without contacting support.

*Acceptance criteria:*
- FAQ section has at least 8 items
- Each FAQ item toggles open/closed (accordion behavior)
- Only one item can be open at a time (single-expand mode is acceptable; multi-expand also acceptable)

### 4.6 미팅 요청 (Meeting Request)

**US-14**: As an expert, I want to request a meeting with my assigned MD so that I can get strategic advice on growing my content business.

*Acceptance criteria:*
- Form fields: topic (select from preset list), preferred date (date picker or text input), message (textarea)
- On submit, a new entry appears in the request history with status "검토중"
- Form resets after successful submission

**US-15**: As an expert, I want to see the history of my meeting requests so that I know the status of each one.

*Acceptance criteria:*
- History list shows: request date, topic, preferred date, status badge (`검토중` gray, `확정됨` blue, `완료` green)
- Most recent request appears first

---

## 5. Feature Prioritization (MoSCoW)

### Must (MVP — first iteration)

| Feature | Rationale |
|---------|-----------|
| Route + auth guard at `/expert/center` | Without this, no feature is accessible |
| Studio layout (sidebar + tab shell) | All sub-features depend on this |
| Dashboard KPI cards (FR-03) | Highest perceived value on first load |
| Course Management list + status badges (FR-06) | Core expert use case |
| Q&A Management list + filter (FR-09) | Time-sensitive for experts (students waiting) |
| Revenue total + monthly table (FR-11) | Experts expect financial visibility |
| Expert Guide static content (FR-13) | Self-service onboarding reduces support load |
| Meeting Request form + history (FR-15, FR-16) | Enables expert-MD communication |
| Mock data file + TypeScript types (FR-17, FR-18) | Foundation for all sub-features |

### Should (complete if time permits in first iteration)

| Feature | Rationale |
|---------|-----------|
| Dashboard activity feed (FR-04) | Adds value but KPI cards cover the critical need |
| Course stats per row (FR-07) | Nice visual enhancement |
| Course edit/delete actions (FR-08) | Quality of life — low risk to defer |
| Q&A inline reply (FR-10) | Core but slightly complex; filter alone is high value |
| Settlement history (FR-12) | Revenue tab is complete without it for MVP |
| FAQ accordion (FR-14) | Guide is usable as static text without accordion |

### Could (defer to next iteration)

| Feature | Rationale |
|---------|-----------|
| Revenue trend chart (FR-05) | Requires chart work; tables convey the same info |
| Course completion rate stats (FR-07 partial) | Data exists but adds visual complexity |
| Multi-course Q&A navigation (US-09 advanced) | Basic filter covers the need |

### Won't (explicitly out of scope)

- Real backend API integration
- `/expert/upload` route implementation (separate feature)
- Notification system
- Revenue payment processing

---

## 6. Dependencies Between Sub-Features

```
Route + Auth Guard
      |
      v
Studio Layout (sidebar + tab shell)
      |
      +──> Dashboard (reads from: course list, Q&A list, revenue data)
      |
      +──> Course Management (independent — own mock data)
      |
      +──> Q&A Management (depends on: course list for filter options)
      |
      +──> Revenue Management (independent — own mock data)
      |
      +──> Expert Guide (fully independent — static content)
      |
      +──> Meeting Request (independent — own mock data)
```

**Key dependency**: The Q&A Management course filter requires the Course Management mock data (course titles/IDs). Both must use the same `ExpertCourse` data array.

**Dashboard dependency**: The Dashboard aggregates from all other data shapes. Build it after the base data structures are defined, or use hardcoded summary values initially.

---

## 7. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Type name collision with existing `Course` interface (catalog browsing) | High | High | Use `ExpertCourse` for studio-side entities; document naming rule |
| Expert Studio layout diverges from Mypage layout pattern, creating maintenance burden | Medium | Medium | Copy MypageLayout sidebar pattern exactly; extract a shared `StudioLayout` if identical |
| Dashboard chart complexity delays delivery | Medium | Medium | Downgrade to "Could" priority; ship table/list fallback first |
| Auth guard misconfiguration exposes expert routes to regular users | High | Low | Use server-side session check in `page.tsx` (getServerSession or middleware); test with both roles |
| Scope creep from mixing `/expert/upload` into this feature | High | Medium | Keep explicit "not in scope" reminder in Design doc; link only, never implement upload here |
| Mock data volume makes `expertStudio.ts` unmanageable | Low | Low | Limit to 5 courses, 10 Q&A items, 6 months revenue, 3 settlements, 5 meeting requests |

---

## 8. Architecture Considerations

### 8.1 Project Level Selection

| Level | Characteristics | Selected |
|-------|-----------------|:--------:|
| **Starter** | Simple structure (`components/`, `lib/`, `types/`) | X |
| Dynamic | Feature-based modules, service layers | |
| Enterprise | Strict layer separation, DI | |

Rationale: Existing project is Starter-level. Adding a new page follows the same flat component pattern as mypage. No new architecture layer is warranted.

### 8.2 Key Architectural Decisions

| Decision | Selected | Rationale |
|----------|----------|-----------|
| Route | `/expert/center/page.tsx` | Matches existing UserMenu link |
| Auth guard | `getServerSession` in Server Component `page.tsx` | Consistent with existing auth approach |
| State | `useState` (local) | No global state needed; mock data is static |
| Styling | Tailwind + `var(--color-*)` CSS variables | Consistent with all existing components |
| Charts | Native SVG or CSS bar chart | No chart library to avoid new dependencies |
| Data | `src/data/expertStudio.ts` | Consistent with `src/data/mypage.ts` pattern |
| Types | Appended to `src/types/index.ts` | Single source of truth for all types |

### 8.3 New File Structure

```
bizschool/src/
├── app/
│   └── expert/
│       ├── page.tsx                          (existing — ExpertApplicationForm)
│       └── center/
│           └── page.tsx                      (NEW — Expert Studio entry, server component with auth guard)
├── components/
│   └── expert/
│       ├── ExpertApplicationForm.tsx         (existing)
│       └── studio/                           (NEW directory)
│           ├── ExpertStudioLayout.tsx
│           ├── ExpertStudioSidebar.tsx
│           ├── dashboard/
│           │   ├── StudioDashboard.tsx
│           │   └── KpiCard.tsx
│           ├── courses/
│           │   └── StudioCourses.tsx
│           ├── qna/
│           │   └── StudioQna.tsx
│           ├── revenue/
│           │   └── StudioRevenue.tsx
│           ├── guide/
│           │   └── StudioGuide.tsx
│           └── meeting/
│               └── StudioMeeting.tsx
├── data/
│   ├── mypage.ts                             (existing)
│   └── expertStudio.ts                       (NEW)
└── types/
    └── index.ts                              (APPEND new interfaces under ── 전문가 스튜디오 ── section)
```

### 8.4 New TypeScript Interfaces (proposed)

```typescript
// ── 전문가 스튜디오 ──

export type ExpertCourseStatus = "draft" | "under_review" | "published" | "rejected";

export interface ExpertCourse {
  id: string;
  title: string;
  thumbnailUrl: string;
  status: ExpertCourseStatus;
  createdAt: string;
  updatedAt: string;
  studentCount: number;
  rating: number;
  completionRate: number;    // 0–100 (%)
  totalRevenue: number;      // KRW
  rejectionReason?: string;
}

export type StudioQnaStatus = "unanswered" | "answered";

export interface StudioQuestion {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  title: string;
  content: string;
  createdAt: string;
  status: StudioQnaStatus;
  answer?: {
    content: string;
    answeredAt: string;
  };
}

export type SettlementStatus = "정산완료" | "정산예정" | "정산대기";

export interface MonthlyRevenue {
  month: string;          // "2026-01"
  grossSales: number;
  platformFee: number;    // amount (not %)
  netRevenue: number;
}

export interface SettlementRecord {
  id: string;
  period: string;         // "2026년 1월"
  amount: number;
  status: SettlementStatus;
  payoutDate?: string;
}

export type MeetingRequestStatus = "검토중" | "확정됨" | "완료";
export type MeetingTopic = "콘텐츠 전략" | "수익 개선" | "강의 품질" | "기타";

export interface MeetingRequest {
  id: string;
  topic: MeetingTopic;
  preferredDate: string;
  message: string;
  requestedAt: string;
  status: MeetingRequestStatus;
}

export type StudioTab = "dashboard" | "courses" | "qna" | "revenue" | "guide" | "meeting";
```

---

## 9. Success Criteria

### 9.1 Definition of Done

- [ ] `/expert/center` route exists and redirects non-expert users
- [ ] All 6 tabs are reachable and render without runtime errors
- [ ] Dashboard KPI cards display correct aggregated values from mock data
- [ ] Course Management shows all mock courses with correct status badges
- [ ] Q&A Management filter by course and status works correctly
- [ ] Revenue Management displays total, monthly table, and settlement history
- [ ] Expert Guide renders all steps and FAQ items
- [ ] Meeting Request form submits and new entry appears in history
- [ ] Responsive layout verified on mobile (375px) and desktop (1280px)
- [ ] Zero TypeScript errors (`tsc --noEmit`)
- [ ] Zero ESLint errors

### 9.2 Quality Criteria

- [ ] No hardcoded colors — all styling uses `var(--color-*)` variables or Tailwind classes
- [ ] No type name collision with existing interfaces (`Course`, `Book`, `CourseQna`)
- [ ] Component files are single-responsibility (one component per file)
- [ ] Mock data file is under 200 lines (keep it lean)

---

## 10. Next Steps

1. [ ] CTO review and approval of this Plan document
2. [ ] Write Design document: `docs/02-design/features/expert-studio.design.md`
3. [ ] Define detailed component hierarchy and data flow in Design
4. [ ] Implementation (Do phase)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-26 | Initial draft | Product Manager |
