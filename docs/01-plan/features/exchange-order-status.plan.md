# Exchange Order Status Planning Document

> **Summary**: Define and implement the "교환" (exchange) order status flow for the book order history page, covering post-request tracking from pickup through re-delivery.
>
> **Project**: BIZSCHOOL
> **Version**: 0.1
> **Author**: Product Manager Agent
> **Date**: 2026-03-18
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

After a user submits an exchange request via `ExchangeReturnWizard`, the order's `orderStatus` must communicate where the exchange stands — from initial acceptance through pickup, inspection, re-delivery, and final completion. Currently, `OrderStatus` has no exchange states; a submitted exchange request has nowhere to land in the type system or the UI.

### 1.2 Background

**Current `OrderStatus` union:**
```
"배송준비" | "배송중" | "배송완료" | "취소" | "반품"
```

The wizard (`ExchangeReturnWizard.tsx`) captures resolution = `"교환" | "반품후환불"`. When the user chooses `"교환"`, the wizard calls `onSubmit(formState)`, but the order's `orderStatus` is never updated because no exchange sub-states exist.

**Korean market benchmark (standard across 쿠팡/11번가/스마트스토어):**

Platforms universally express exchange progress as a sub-flow inside the order, not as a separate order. The consumer-facing states observed in practice are:

| Step | Common label | Notes |
|------|-------------|-------|
| 1 | 교환접수 | Request recorded |
| 2 | 수거중 | Courier dispatched to pick up |
| 3 | 수거완료 | Item retrieved, at inspection |
| 4 | 교환배송중 | Replacement out for delivery |
| 5 | 교환완료 | Replacement delivered |

쿠팡 (rocket delivery) sometimes collapses steps 2–3 ("수거완료" is confirmed when 쿠팡친구 picks up at door). 11번가 / 스마트스토어follow the full 5-state model. For a book-only, single-carrier platform like BIZSCHOOL, 5 states is the right balance of clarity and simplicity.

### 1.3 Related Documents

- Existing plan: `docs/01-plan/features/mypage-courses-purchases.plan.md`
- Types: `bizschool/src/types/index.ts` (lines 158–175)
- Wizard: `bizschool/src/components/mypage/ExchangeReturnWizard.tsx`
- Order list: `bizschool/src/components/mypage/BookOrderSection.tsx`

---

## 2. Scope

### 2.1 In Scope

- [ ] Add `ExchangeStatus` type to `src/types/index.ts`
- [ ] Extend `OrderStatus` to include an "교환" umbrella value that flags an order is in exchange process
- [ ] Add `exchangeStatus?: ExchangeStatus` optional field to `BookOrder` and `BookOrderDetail`
- [ ] Update `OrderStatusFilter` and `OrderStatusBar` to display exchange orders correctly
- [ ] Add mock data entries covering each exchange sub-state
- [ ] Display exchange progress in the order row and detail view (status label + progress badge)
- [ ] `BookOrderSection`: update `getStatusColor`, `orderStatusOptions`, and `statusItems` for `"교환"` entry
- [ ] Correct `onSubmit` in `BookOrderSection` to set `orderStatus = "교환"` + `exchangeStatus = "교환접수"` on wizard completion

### 2.2 Out of Scope

- Real API integration (this is a static mock project)
- "반품후환불" sub-state tracking (반품 already exists; its sub-states are not requested)
- Email/push notification for status changes
- Admin / seller-side status management
- Exchange request cancellation flow

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | `OrderStatus` union gains `"교환"` value representing any order actively in an exchange process | Must | Pending |
| FR-02 | A new `ExchangeStatus` type covers the 5 sub-states: `"교환접수" \| "수거중" \| "수거완료" \| "교환배송중" \| "교환완료"` | Must | Pending |
| FR-03 | `BookOrder.exchangeStatus` is optional (`ExchangeStatus \| undefined`); present only when `orderStatus === "교환"` | Must | Pending |
| FR-04 | Order list row shows `"교환"` label with the current `exchangeStatus` sub-label (e.g., "교환 · 수거중") | Must | Pending |
| FR-05 | `OrderStatusBar` summary counts include an `"교환"` tile; exchange orders are excluded from `"배송완료"` count | Must | Pending |
| FR-06 | `OrderStatusFilter` dropdown includes `"교환"` as a filterable option | Must | Pending |
| FR-07 | After wizard `onSubmit` with `resolution === "교환"`, the target order's status updates to `orderStatus: "교환", exchangeStatus: "교환접수"` in mock state | Must | Pending |
| FR-08 | `getStatusColor` assigns a distinct color for `"교환"` (e.g., amber/orange, distinct from primary blue and red) | Should | Pending |
| FR-09 | Mock data includes at least one order for each of the 5 exchange sub-states to support visual QA | Should | Pending |
| FR-10 | When `exchangeStatus === "교환완료"`, an optional inline note ("새 상품 배송이 완료되었습니다") appears in the order row | Could | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Type safety | No TypeScript errors; all `exchangeStatus` usages narrowed with `orderStatus === "교환"` guard | `tsc --noEmit` passes |
| Consistency | Color, label format, and filter behavior match the existing `"반품"` pattern | Visual review |
| Backward compat | All existing orders without `exchangeStatus` continue to render without errors | Runtime check of mock data |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] `OrderStatus` includes `"교환"` and `ExchangeStatus` type is exported from `src/types/index.ts`
- [ ] `BookOrder` and `BookOrderDetail` accept `exchangeStatus?: ExchangeStatus`
- [ ] `OrderStatusBar` shows a 7-tile grid (주문건수 + 6 statuses including 교환) or merges tiles if layout requires — decision deferred to Design phase
- [ ] Filter dropdown and order list correctly filter by `"교환"`
- [ ] Wizard submission triggers `"교환접수"` state on the correct order
- [ ] Mock data has at least 5 exchange orders (one per sub-state)
- [ ] `tsc --noEmit` passes with zero errors

### 4.2 Quality Criteria

- [ ] Zero lint errors
- [ ] Build succeeds (`next build` or `next dev` without crash)
- [ ] No visual regression on existing `"반품"`, `"취소"`, `"배송완료"` states

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| `OrderStatusBar` grid overflows at 7 items on small screens | Medium | High | Design phase: consider merging "교환" + "반품" into "교환/반품" tile, or use responsive wrap |
| `OrderStatusFilter` type collision — `"교환"` is not in current `OrderStatus` | High | Medium | Extend `OrderStatusFilter = "전체" \| OrderStatus` after adding `"교환"` to `OrderStatus` |
| `getStatusColor` switch becomes exhaustive-check issue if new value missing | Low | Low | TypeScript `satisfies` pattern or default fallback branch |
| Mock data mutation on wizard submit (state is static file) | Medium | Medium | `BookOrderSection` must manage exchange overrides in local React state, not mutate import |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level | Selected |
|-------|:--------:|
| Starter | X |
| Dynamic | |
| Enterprise | |

Starter — no service layer. All changes are confined to `src/types/`, `src/data/mypage.ts`, and `src/components/mypage/`.

### 6.2 Key Architectural Decisions

| Decision | Selected | Rationale |
|----------|----------|-----------|
| Exchange state location | Extend `OrderStatus` + optional `exchangeStatus` sub-field | Keeps `OrderStatusFilter` simple; one canonical status per order; aligns with platform convention |
| Separation vs combined | Combined — `orderStatus: "교환"` is the top-level bucket, `exchangeStatus` carries sub-state | Avoids a parallel status system; status bar only needs one new tile |
| Mock state mutation | Local React state override map `Record<orderId, Partial<BookOrder>>` in `BookOrderSection` | Preserves the static import; allows wizard to "apply" a status change without writing to file |
| Status bar layout | Expand to 7 tiles (add 교환) or merge 교환+반품 | Decision deferred to Design; current grid is `grid-cols-3 md:grid-cols-6` |

### 6.3 Type System Design

```typescript
// New in src/types/index.ts

export type ExchangeStatus =
  | "교환접수"
  | "수거중"
  | "수거완료"
  | "교환배송중"
  | "교환완료";

// Updated:
export type OrderStatus =
  | "배송준비"
  | "배송중"
  | "배송완료"
  | "취소"
  | "반품"
  | "교환";           // <- new

// Updated BookOrder:
export interface BookOrder {
  // ... existing fields ...
  orderStatus: OrderStatus;
  exchangeStatus?: ExchangeStatus;  // <- new, present only when orderStatus === "교환"
}
```

---

## 7. Convention Prerequisites

### 7.1 Existing Project Conventions (confirmed)

- Tailwind CSS + CSS variables: `var(--color-primary)`, `var(--color-border)`, `var(--color-muted)`, `var(--color-dark)`
- Korean labels used throughout; no English in user-facing text
- `OrderStatusFilter = "전체" | OrderStatus` pattern — extending `OrderStatus` automatically extends the filter union
- `getStatusColor(status: OrderStatus): string` switch — must add `"교환"` case

### 7.2 Color Assignment for "교환"

"교환" is an active, in-progress state. Recommended color: `text-amber-600` (orange-amber tone, distinct from blue `--color-primary` for `"배송완료"` and red `text-red-500` for `"취소"/"반품"`). Final color confirmed at Design phase.

---

## 8. Product Recommendation Summary

**Q1: Standard exchange status flows in Korean e-commerce?**

The 5-state model is standard across all major Korean platforms:
`교환접수 → 수거중 → 수거완료 → 교환배송중 → 교환완료`

쿠팡 may collapse steps on rocket delivery, but all five states are recognizable and expected by Korean consumers for third-party/standard delivery.

**Q2: Separate from main status or combined?**

Combined. Use `orderStatus: "교환"` as the top-level bucket (same tier as `"배송중"`, `"반품"`), with `exchangeStatus` as an optional sub-field. This avoids a second parallel status axis, keeps the filter dropdown clean, and follows what Korean platforms show to consumers (the order stays in the same order history row, just with an updated label).

**Q3: Which sub-states should exist?**

`"교환접수" | "수거중" | "수거완료" | "교환배송중" | "교환완료"`

All five are Must. They map directly to courier activity milestones that consumers need to distinguish (e.g., "수거중" tells the user to have the package ready; "교환배송중" tells them to expect delivery).

**Q4: How should the status bar summary counts reflect exchange orders?**

Add an `"교환"` tile to `OrderStatusBar`. Exchange orders must NOT be counted in `"배송완료"` — they are distinct. The 교환완료 sub-state reads "exchange complete" but the order's top-level `orderStatus` remains `"교환"` throughout the sub-flow. This means a single count tile covers all five sub-states. If the product needs sub-state visibility in the bar (e.g., "교환배송중" count), that is a Could for a future iteration.

---

## 9. Next Steps

1. [ ] CTO/team review and approval of this plan
2. [ ] Write design document: `docs/02-design/features/exchange-order-status.design.md`
3. [ ] Implement type changes in `src/types/index.ts`
4. [ ] Update `src/data/mypage.ts` with exchange mock orders
5. [ ] Update `BookOrderSection.tsx` and related components

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-18 | Initial draft | Product Manager Agent |
