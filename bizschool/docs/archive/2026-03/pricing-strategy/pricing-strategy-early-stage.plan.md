# Pricing Strategy — Early Stage Planning Document

> **Summary**: A phased pricing approach for BIZSCHOOL that is honest about the current limited content catalog and evolves naturally as the platform grows.
>
> **Project**: BIZSCHOOL
> **Version**: 0.1
> **Author**: Product Manager
> **Date**: 2026-03-23
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

Define a realistic, trust-preserving pricing structure for BIZSCHOOL that matches the current product reality (few online courses, available books and offline courses, newly launched expert consultation), and lays a clear path toward a full membership model as the content library grows.

### 1.2 Background

An earlier membership concept (19,800원/월) was designed around:
- Expert consultation 5 sessions/month
- 10% discount on online courses
- 5% discount on books
- Annual plan: free course vouchers + free book

The problem: online course content is still being built. Promising discounts or vouchers on products that barely exist damages trust and creates an empty-feeling membership. The platform must earn recurring revenue now, without overpromising.

Additional context:
- Legacy 경리코리아 customers have been paying 11,000원/월 for consultation — this is a real price anchor.
- Expert consultation (회계, 세무, 4대보험, 인사·총무) is the most immediately valuable and differentiated service.
- Books (15,000~35,000원) and offline courses (50,000~400,000원) are individually purchased today.
- Government-subsidized training (인재키움 프리미엄 훈련) operates on its own funding track.

### 1.3 Related Documents

- References: legacy 경리코리아 membership model (11,000원/월)

---

## 2. Scope

### 2.1 In Scope

- [ ] Phase 1 pricing: standalone expert consultation subscription
- [ ] Phase 1 pricing: per-consultation (pay-as-you-go) option
- [ ] Phase 1 pricing: books and offline courses remain individually priced
- [ ] Phase 2 pricing: light membership when online course catalog reaches meaningful size
- [ ] Phase 3 pricing: full membership model with course discounts and bundles
- [ ] Legacy customer migration path (경리코리아 11,000원/월 → BIZSCHOOL)
- [ ] Clear public messaging that does NOT overpromise unavailable benefits

### 2.2 Out of Scope

- Content production schedule (that is an editorial/operations decision)
- Government-subsidized training (인재키움) pricing — operates independently
- Payment gateway implementation details

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | Users can subscribe to expert consultation on a monthly basis | Must | Pending |
| FR-02 | Users can purchase individual consultation sessions (pay-as-you-go) | Must | Pending |
| FR-03 | Legacy 경리코리아 subscribers are offered a migration path at ≤ their current price | Must | Pending |
| FR-04 | Subscription benefits page clearly lists only what is currently available | Must | Pending |
| FR-05 | Books and offline courses remain purchasable without any subscription | Must | Pending |
| FR-06 | Phase 2 membership tier is designed and documented before launch (not built yet) | Should | Pending |
| FR-07 | Annual subscription option available with a modest discount | Should | Pending |
| FR-08 | Subscription can be upgraded or downgraded between tiers as they become available | Could | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Trust | No pricing page mentions benefits that are not yet live | Manual review before each launch |
| Simplicity | Phase 1 pricing fits on a single screen with no confusion | User feedback / usability test |
| Migration | Zero legacy customer loss due to price shock | Churn rate tracking after migration |

---

## 4. Phased Pricing Plan

### Phase 1 — Honest Launch (Now, limited content)

**Core principle**: Sell only what exists. Do not bundle non-existent course benefits.

#### 4.1 Expert Consultation

Expert consultation is the anchor product in Phase 1. Two options:

| Option | Name | Price | What You Get |
|--------|------|-------|--------------|
| Pay-as-you-go | 단건 상담 | 30,000~50,000원 / 1회 | One consultation session (회계, 세무, 4대보험, 인사·총무) |
| Monthly subscription | 상담 정기권 | 19,800원 / 월 | 3 sessions/month + unlimited text Q&A |
| Annual subscription | 연간 상담권 | 190,000원 / 년 (~15,800원/월) | Same as monthly, billed annually (2개월 무료 효과) |

**Rationale for 19,800원/월:**
- Keeps continuity with the previously discussed price point.
- 경리코리아 legacy customers were paying 11,000원/월 but for a simpler product. BIZSCHOOL adds structured expert matching — a modest premium is defensible.
- 3 sessions is a concrete, deliverable promise. Not "up to 5" on a platform that has nothing else.

**Legacy customer migration (경리코리아):**
- Offer a grandfather price of 14,900원/월 for 12 months, then move to 19,800원.
- This is above their current 11,000원 but below the full price — positions the increase as a service upgrade, not a price hike.

#### 4.2 Books

- Individually purchased at retail price (15,000~35,000원).
- No discount. No bundling.
- Reason: the catalog is not large enough to justify a bundle, and discounting before volume erodes margin.

#### 4.3 Offline Courses (현장강의)

- Individually purchased (50,000~400,000원).
- No membership discount in Phase 1.
- Reason: Same as books — catalog is limited and discounting prematurely trains customers to wait for deals.

#### 4.4 What NOT to Show in Phase 1

- No "online course discount" benefit.
- No "free course voucher" for annual plans.
- These appear on the pricing page only when the online course catalog is ready.

---

### Phase 2 — Growing Catalog (When online courses reach ~20+ titles)

**Trigger condition**: Online course catalog reaches approximately 20 titles across at least 3 subject areas.

**Introduce: BIZSCHOOL 스탠다드 멤버십**

| Feature | Detail |
|---------|--------|
| Price | 24,900원/월 or 239,000원/년 |
| Expert consultation | 5 sessions/month |
| Online course discount | 15% off |
| Book discount | 10% off |
| Offline course discount | None (margin is tight) |

**Key change from Phase 1**: Online course discount is now a real, usable benefit — not an empty promise.

**Migration from Phase 1 상담 정기권:**
- Existing 19,800원 subscribers are offered an upgrade to 스탠다드 멤버십 at a 1-month free trial before billing changes.

---

### Phase 3 — Full Platform (When online courses reach ~50+ titles, diverse catalog)

**Introduce: BIZSCHOOL 프리미엄 멤버십 + free tier restructuring**

| Tier | Price | Key Benefits |
|------|-------|--------------|
| 무료 | 0원 | Browse catalog, 1 free consultation/month |
| 스탠다드 | 24,900원/월 | 5 consultations, 15% course discount, 10% book discount |
| 프리미엄 | 39,900원/월 | Unlimited consultations, 20% course discount, 15% book discount, 1 free book/분기 |

**Annual plan** (프리미엄):
- 379,000원/년 (equivalent to ~31,600원/월 — 2개월 할인 효과)
- Free book voucher on sign-up + renewal

---

## 5. Transition Logic Summary

```
Phase 1 (Now)
  └─ 상담 정기권 19,800원/월 (3 consultations)
  └─ 단건 상담 30,000~50,000원/회
  └─ Books & Offline: individual purchase only

      [Trigger: ~20 online courses live]
              ↓
Phase 2
  └─ 스탠다드 멤버십 24,900원/월 (replaces 상담 정기권)
  └─ 단건 상담 continues
  └─ Books: 10% member discount
  └─ Online courses: 15% member discount

      [Trigger: ~50 online courses, diverse subjects]
              ↓
Phase 3
  └─ Free / 스탠다드 / 프리미엄 three-tier model
  └─ Annual plans with meaningful vouchers
```

---

## 6. Success Criteria

### 6.1 Phase 1 Definition of Done

- [ ] 상담 정기권 purchase flow live and tested
- [ ] 단건 상담 purchase flow live and tested
- [ ] Pricing page shows no benefits for unavailable features
- [ ] Legacy 경리코리아 migration offer email drafted and sent
- [ ] Grandfather price (14,900원/월) correctly applied in billing system

### 6.2 Phase 1 Quality Criteria

- [ ] Zero customer complaints about advertised benefits not being available
- [ ] Legacy churn rate after migration < 20% within first 3 months
- [ ] At least 50% of 단건 상담 purchasers convert to 상담 정기권 within 60 days (conversion funnel health)

---

## 7. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Legacy customers reject price increase (11,000 → 14,900) | High | Medium | Lead with the value story: structured expert matching, more subjects. Offer 3-month free trial at old price before increasing. |
| Phase 1 membership feels too narrow (consultation only) | Medium | High | Position it explicitly as "전문가 상담 서비스" — not a full learning membership. Honest framing prevents disappointment. |
| Phase 2 trigger (20 courses) takes longer than expected | Medium | Medium | Do not set a public date for Phase 2. Migrate customers when ready, not on a calendar deadline. |
| Per-session pricing cannibalizes subscription | Low | Low | 단건 상담 is priced high enough (30,000~50,000원/회) that 2+ sessions/month makes the 19,800원 subscription clearly better value. |
| Competitors launch a cheaper consultation product | High | Low | BIZSCHOOL's edge is subject-matter depth (회계, 세무, 4대보험, 인사·총무 together) + integration with courses and books. Monitor and respond. |

---

## 8. Open Questions for CTO / Business Review

1. **Session definition**: What counts as one "consultation session"? Is it time-boxed (30 min)? Is async text Q&A separate from a live session?
2. **Expert supply**: Can we guarantee 3 sessions/month per subscriber from day 1? If expert capacity is limited, we may need to cap new subscriptions or use a waitlist.
3. **Legacy cutoff date**: What is the hard deadline to migrate 경리코리아 customers? A soft migration window should be defined.
4. **Offline course discount in Phase 2**: Left out intentionally — should the team revisit this if offline course volume grows?
5. **Government training (인재키움) interaction**: Does a BIZSCHOOL subscription give any benefit for subsidized training enrollment? Needs legal/compliance check.

---

## 9. Next Steps

1. [ ] CTO / business lead review and approval of this plan
2. [ ] Confirm expert consultant capacity for Phase 1 subscription volume
3. [ ] Draft legacy customer migration email and offer
4. [ ] Design the subscription purchase flow (Design phase)
5. [ ] Define "session" in terms of time, format, and medium (sync vs. async)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-23 | Initial draft | Product Manager |
