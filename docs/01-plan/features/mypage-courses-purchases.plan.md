# mypage-courses-purchases Planning Document

> **Summary**: Implement the "수강내역" (courses) and "구매내역" (purchases) tabs in the BIZSCHOOL mypage using static mock data, replacing the current placeholder UI.
>
> **Project**: BIZSCHOOL
> **Version**: N/A (static mock)
> **Author**: Product Manager
> **Date**: 2026-03-14
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

The mypage currently shows "준비 중인 기능입니다" for both the "수강내역" (courses) and "구매내역" (purchases) tabs. This plan defines what those tabs should display, what data models are required, and how to build them using mock data — consistent with the project's static approach.

### 1.2 Background

The project is a Next.js App Router static mock site for BIZSCHOOL, a Korean business education platform. No real backend or authentication exists. Mock data lives in `bizschool/src/data/mypage.ts` and types in `bizschool/src/types/index.ts`.

The original BIZSCHOOL site has:
- **나의 강의실**: Three collapsible sections showing the user's enrolled courses
- **도서 주문내역**: An order history page for book purchases with status filtering and a period filter

These two features correspond to the "courses" and "purchases" tabs respectively. They need to be faithfully reproduced as static UI with hardcoded mock data.

### 1.3 Related Documents

- Archived mypage-inquiry plan: `docs/archive/2026-03/mypage-inquiry/mypage-inquiry.plan.md`
- Existing types: `bizschool/src/types/index.ts`
- Existing mock data: `bizschool/src/data/mypage.ts`
- MypageContent (entry point): `bizschool/src/components/mypage/MypageContent.tsx`

---

## 2. Scope

### 2.1 In Scope

- [ ] TypeScript interfaces for `MyCourse` (online, public, completed subtypes) and `BookOrder`
- [ ] Mock data for courses (at least 2 entries per section) and book orders (at least 5 entries)
- [ ] **수강내역 tab (CoursesSection)**: Three collapsible accordion sections each rendering a table
- [ ] **구매내역 tab (PurchasesSection)**: Status summary bar, period filter buttons, summary text, and order table
- [ ] Full responsive layout consistent with existing mypage components
- [ ] Korean labels and terminology preserved throughout
- [ ] Wiring into `MypageContent.tsx` to replace the `PlaceholderSection`

### 2.2 Out of Scope

- Real API calls or backend integration
- Authentication / per-user data isolation
- Real date range picker (a simplified static period filter is sufficient)
- Actual shipping/tracking links
- Payment processing or real order status updates
- Pagination for either tab (mock data sets are small)
- Filtering by course name or order search

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 수강내역 tab renders three collapsible sections: 나의 온라인 강의실, 나의 강의실(공개교육), 이수과정 | Must | Pending |
| FR-02 | Each course section shows a table with appropriate columns per section type | Must | Pending |
| FR-03 | Collapsible sections default to open; clicking the header toggles open/closed state | Must | Pending |
| FR-04 | 구매내역 tab renders a status summary bar with 5 status counts: 주문건수, 결제대기, 결제완료, 발송준비, 발송완료 | Must | Pending |
| FR-05 | 구매내역 tab renders period filter buttons: 1주일, 15일, 1개월 (static — selecting a button updates the summary text label only; data does not change) | Should | Pending |
| FR-06 | 구매내역 tab renders an order table with columns: 날짜, 상품정보, 수량, 결제방식, 결제여부, 주문상태 | Must | Pending |
| FR-07 | 구매내역 tab shows a summary line "YYYY-MM-DD ~ YYYY-MM-DD까지의 주문 (총 N건)" above the table | Must | Pending |
| FR-08 | Mock data is added to `bizschool/src/data/mypage.ts` | Must | Pending |
| FR-09 | TypeScript interfaces are added to `bizschool/src/types/index.ts` | Must | Pending |
| FR-10 | `MypageContent.tsx` imports and renders the two new section components | Must | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Consistency | Visual style matches existing mypage components (border radius, colors, spacing) | Manual review against InquiryList / ProfileSection |
| Responsiveness | Tables scroll horizontally on mobile; layout does not break below 375px | Browser devtools mobile emulation |
| Type Safety | No TypeScript errors (`tsc --noEmit` passes) | Build output |
| Korean Terminology | All labels use the Korean terms specified in requirements | Manual review |

---

## 4. Data Models

### 4.1 수강내역 — Course Enrollment Types

```typescript
// Type of course section / enrollment category
export type CourseCategory = "online" | "public" | "completed";

// Payment status shared by all course types
export type CoursePaymentStatus = "결제완료" | "미결제" | "환불";

// Employment insurance reimbursement flag
// Only applies to public and completed enrollment types
export type EmploymentInsuranceEligible = boolean;

export interface MyCourse {
  id: string;
  category: CourseCategory;
  title: string;                        // 강좌명
  periodStart: string;                  // 수강기간 시작 (YYYY-MM-DD)
  periodEnd: string;                    // 수강기간 종료 (YYYY-MM-DD)
  paymentStatus: CoursePaymentStatus;   // 결제여부
  // Only present for "public" and "completed" categories:
  isInsuranceReimbursable?: boolean;    // 고용보험 환급과정 여부
}
```

Column mapping per section:

| Section | 강좌명 | 수강기간 | 고용보험 환급과정 여부 | 결제여부 |
|---------|--------|----------|----------------------|----------|
| 나의 온라인 강의실 | Yes | Yes | No | Yes |
| 나의 강의실 (공개교육) | Yes | Yes | Yes | Yes |
| 이수과정 | Yes | Yes | Yes | Yes |

### 4.2 구매내역 — Book Order Types

```typescript
export type OrderStatus = "주문완료" | "결제대기" | "결제완료" | "발송준비" | "발송완료";
export type PaymentMethod = "신용카드" | "무통장입금" | "카카오페이" | "네이버페이";
export type OrderPaymentStatus = "결제완료" | "결제대기" | "결제취소";

export interface BookOrderItem {
  bookTitle: string;   // 상품정보 — book title
  bookAuthor: string;  // 상품정보 — author line
}

export interface BookOrder {
  id: string;
  orderedAt: string;              // 날짜 (YYYY-MM-DD)
  item: BookOrderItem;            // 상품정보
  quantity: number;               // 수량
  paymentMethod: PaymentMethod;   // 결제방식
  paymentStatus: OrderPaymentStatus; // 결제여부
  orderStatus: OrderStatus;       // 주문상태
}
```

Status summary bar counts are derived from `mockBookOrders` at render time:
- **주문건수**: `mockBookOrders.length`
- **결제대기**: count where `orderStatus === "결제대기"`
- **결제완료**: count where `orderStatus === "결제완료"`
- **발송준비**: count where `orderStatus === "발송준비"`
- **발송완료**: count where `orderStatus === "발송완료"`

### 4.3 Mock Data Plan

**mockMyCourses** (add to `bizschool/src/data/mypage.ts`):
- 3 entries with `category: "online"` — covering active, expiring-soon, and expired states
- 2 entries with `category: "public"` — one reimbursable, one not
- 2 entries with `category: "completed"` — both with `isInsuranceReimbursable`

**mockBookOrders** (add to `bizschool/src/data/mypage.ts`):
- 6–8 entries covering all 5 order statuses
- Date range spanning roughly 1 month (2026-02-14 ~ 2026-03-14)
- Mix of payment methods

---

## 5. Component Plan

### 5.1 New Components (priority order)

| Priority | Component | Path | Description |
|----------|-----------|------|-------------|
| Must | `CoursesSection` | `bizschool/src/components/mypage/CoursesSection.tsx` | Container with 3 accordion sections |
| Must | `CourseAccordion` | `bizschool/src/components/mypage/CourseAccordion.tsx` | Single collapsible section with a course table |
| Must | `PurchasesSection` | `bizschool/src/components/mypage/PurchasesSection.tsx` | Full purchases tab: status bar + filter + table |
| Should | `OrderStatusBar` | Inside `PurchasesSection.tsx` (co-located sub-component) | 5-icon status summary strip |
| Could | `PeriodFilter` | Inside `PurchasesSection.tsx` (co-located sub-component) | Quick period buttons (1주일, 15일, 1개월) |

### 5.2 Files to Modify

| File | Change |
|------|--------|
| `bizschool/src/types/index.ts` | Add `MyCourse`, `BookOrder`, and related union types |
| `bizschool/src/data/mypage.ts` | Add `mockMyCourses`, `mockBookOrders` |
| `bizschool/src/components/mypage/MypageContent.tsx` | Import `CoursesSection` and `PurchasesSection`, replace `PlaceholderSection` render for those tabs |

### 5.3 Implementation Order

1. Add TypeScript interfaces to `types/index.ts`
2. Add mock data to `data/mypage.ts`
3. Build `CourseAccordion` (reusable table-in-accordion)
4. Build `CoursesSection` (composes three `CourseAccordion` instances)
5. Build `PurchasesSection` with status bar, period filter, and order table
6. Wire both into `MypageContent.tsx`

---

## 6. UX Design Notes

### 6.1 수강내역 (CoursesSection)

- Section headers styled with a subtle background (e.g., `bg-gray-50`) and a chevron icon that rotates on open/closed
- Each table row alternates lightly or uses a border-bottom divider — consistent with the existing site's table style
- 고용보험 환급과정 여부 column shows "Y" / "N" or a badge (green "해당" / gray "해당없음")
- 결제여부 column shows a status badge matching `CoursePaymentStatus` value

### 6.2 구매내역 (PurchasesSection)

- Status summary bar: 5 cells in a horizontal strip, each with an icon, label, and count number
- Active period filter button is visually highlighted (primary color)
- Summary text is right-aligned or centered above the table: e.g., "2026-02-14 ~ 2026-03-14까지의 주문 (총 7건)"
- Order table: on mobile, horizontal scroll with `overflow-x-auto`
- 주문상태 column uses a colored badge: green for 발송완료, blue for 발송준비, orange for 결제대기, gray for others

### 6.3 Styling Conventions

- Use existing CSS variables: `var(--color-primary)`, `var(--color-border)`, `var(--color-muted)`, `var(--color-dark)`
- Rounded corners: `rounded-2xl` for card wrappers, matching `ProfileSection` and `InquiryList`
- White background cards with `border border-[var(--color-border)]`

---

## 7. Success Criteria

### 7.1 Definition of Done

- [ ] `tsc --noEmit` passes with no new errors
- [ ] Both tabs render meaningful content (not the placeholder)
- [ ] 수강내역: all 3 collapsible sections visible with correct columns; toggle works
- [ ] 구매내역: status bar counts are accurate against mock data; period buttons render; table shows all mock orders
- [ ] Responsive: no horizontal overflow on 375px viewport for the page layout (tables may scroll internally)
- [ ] No inline styles that conflict with existing CSS variables

### 7.2 Quality Criteria

- [ ] Zero TypeScript errors
- [ ] Zero lint errors
- [ ] Components use Korean labels as specified
- [ ] Visual consistency with ProfileSection and InquiryList components

---

## 8. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Table overflow on mobile breaks layout | Medium | Medium | Wrap tables in `overflow-x-auto` container |
| Type naming conflict with existing `Course` interface (used for catalog courses) | Medium | High | Name new interfaces `MyCourse` and `BookOrder` (distinct from catalog `Course` and `Book`) |
| Period filter state causing confusion (no real filtering) | Low | Low | Label the filter UI as display-only; update summary text string only |
| Accordion state management complexity | Low | Low | Use simple `useState` per accordion; no shared state needed |

---

## 9. Architecture Considerations

### 9.1 Project Level

This project follows the **Starter** level: `src/components/`, `src/data/`, `src/types/` — no feature modules or service layers.

| Level | Selected |
|-------|:--------:|
| Starter | X |
| Dynamic | |
| Enterprise | |

### 9.2 Key Architectural Decisions

| Decision | Selected | Rationale |
|----------|----------|-----------|
| Framework | Next.js App Router | Already established |
| State Management | React `useState` | Accordion open/closed + active period filter; no global state needed |
| Styling | Tailwind CSS + CSS variables | Already established project convention |
| Data | Static mock in `src/data/mypage.ts` | Consistent with existing inquiry mock data pattern |
| Backend | None | Static project requirement |

### 9.3 Folder Structure (additions only)

```
bizschool/src/
├── components/mypage/
│   ├── CoursesSection.tsx       (new)
│   ├── CourseAccordion.tsx      (new)
│   └── PurchasesSection.tsx     (new)
├── data/
│   └── mypage.ts                (add mockMyCourses, mockBookOrders)
└── types/
    └── index.ts                 (add MyCourse, BookOrder, union types)
```

---

## 10. Convention Prerequisites

### 10.1 Existing Project Conventions

- [x] TypeScript configured (`tsconfig.json`)
- [x] Tailwind CSS configured
- [x] ESLint configured
- [x] CSS variables for colors defined in global CSS
- [x] Component naming: PascalCase, one component per file
- [x] Data file: all mock data in `src/data/mypage.ts`, imported by components

### 10.2 Environment Variables Needed

None. This is a static mock project with no external API calls.

---

## 11. Next Steps

1. [ ] CTO review and approval of this plan
2. [ ] Write design document (`mypage-courses-purchases.design.md`)
3. [ ] Implement TypeScript types and mock data
4. [ ] Build and wire up components

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-14 | Initial draft | Product Manager |
