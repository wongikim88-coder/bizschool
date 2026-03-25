# Pricing Strategy Planning Document

> **Summary**: Define a cohesive, B2B-appropriate pricing model for BIZSCHOOL that resolves the structural inconsistency introduced by having a single subscription product (전문가상담) alongside otherwise all-individual-purchase products.
>
> **Project**: BIZSCHOOL
> **Version**: 0.1
> **Author**: Product Manager
> **Date**: 2026-03-23
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

BIZSCHOOL currently sells three product types (현장강의, 온라인강의, 도서) as individual purchases and plans to sell 전문가상담 (expert consultation) as a standalone monthly subscription (월 11,000원, 월 10회). This creates a structural inconsistency: one subscription product floating in an otherwise transactional catalog confuses users about the platform's value proposition and pricing logic.

This plan defines a cohesive pricing strategy that:
- Eliminates the awkward single-subscription anomaly
- Strengthens perceived value for B2B buyers (SME finance/HR teams, individual professionals)
- Maintains revenue predictability where possible
- Is fully implementable as a UI/UX design with static/mock data (Starter project, no payment backend)

### 1.2 Background

**Current product catalog:**

| Product Type | Purchase Model | Est. Price Range |
|---|---|---|
| 현장강의 (Offline courses) | Per course | Mid-to-high (venue + instructor) |
| 온라인강의 (Online courses) | Per course | Low-to-mid |
| 도서 (Books) | Per book | Low |
| 전문가상담 (Expert consultation) | Planned: Monthly subscription (월 11,000원 / 10회) | Very low per-session |

**Competitive landscape:**

| Competitor | Primary Model | Key Strength |
|---|---|---|
| 더존 교육 | Per course / enterprise contract | Deep ERP ecosystem integration |
| 한국생산성본부 (KPC) | Per course + membership | Government-recognized certificates |
| 삼일아카데미 | Per course | Accounting/tax specialist depth |
| 택스넷 | Subscription + per course | Tax law update subscriptions |

**Key context:**
- Government-subsidized 인재키움 training coexists with paid products. Pricing strategy must not conflict with this channel.
- Target users are SME finance/HR managers who are budget-conscious and often need approval for purchases. Single invoices (subscriptions or bundles) are easier to justify internally than frequent per-item purchases.
- 전문가상담 at 월 11,000원 / 10회 (1,100원 per consultation) is priced so low it signals low value and may undermine the entire brand.

### 1.3 Related Documents

- References: Korean B2B education market competitive analysis (see Section 1.2)

---

## 2. Strategic Analysis: Pricing Model Options

### 2.1 Option A — Keep Everything as Individual Purchase (전문가상담 = per-consultation fee)

**Description:** Remove the subscription plan entirely. Charge per consultation session (e.g., 5,000~15,000원 per session). All four product types use the same transactional model.

**Evaluation:**

| Dimension | Score | Notes |
|---|---|---|
| Revenue predictability (MRR) | Low | No recurring revenue; lumpy cash flow |
| User acquisition friction | Low | Simple to understand; no commitment required |
| B2B perceived value | Medium | Per-session fee normalizes the service but risks underuse |
| Pricing consistency | High | All products use one model |
| Impact on existing products | None | Zero disruption |

**Verdict: Acceptable but misses opportunity.** Removes the inconsistency problem but leaves money on the table. No recurring revenue anchor. A per-consultation fee of 5,000~15,000원 also risks feeling too cheap to be credible (or too expensive to encourage trial).

---

### 2.2 Option B — Platform-Wide Subscription (All Services Bundled)

**Description:** Create a single membership tier that bundles unlimited or capped access to all four product types for a monthly or annual fee (e.g., 월 49,000원 or 연 490,000원).

**Evaluation:**

| Dimension | Score | Notes |
|---|---|---|
| Revenue predictability (MRR) | High | Strong recurring revenue |
| User acquisition friction | High | Large upfront commitment; hard sell for one-time learners |
| B2B perceived value | Medium | Attractive for heavy users; poor value for occasional buyers |
| Pricing consistency | High | One model for everything |
| Impact on existing products | High disruption | Current users may resist migration from a la carte |

**Verdict: Too aggressive for current stage.** BIZSCHOOL does not yet have the content depth or brand trust to command a full-platform subscription. Forcing all products into a bundle that the user has not validated creates churn risk. Not recommended as a primary model.

---

### 2.3 Option C — Hybrid Model: Individual Purchase + Optional Membership Add-On (RECOMMENDED)

**Description:** Keep per-item purchasing as the default for 현장강의, 온라인강의, and 도서. Introduce an optional "멤버십" tier that unlocks 전문가상담 + member-only discounts on courses and books. Expert consultation becomes a membership benefit rather than a standalone subscription.

**Structure:**

| Tier | Price | What You Get |
|---|---|---|
| 기본 (Free/No membership) | 0원 | Individual purchase access to all products at standard prices |
| 비즈스쿨 멤버십 | 월 19,800원 or 연 190,000원 | 전문가상담 월 5회 포함 + 강의 10% 할인 + 도서 5% 할인 |

**Evaluation:**

| Dimension | Score | Notes |
|---|---|---|
| Revenue predictability (MRR) | Medium-High | Membership creates MRR anchor without forcing all users to subscribe |
| User acquisition friction | Low | Default is still zero-commitment individual purchase |
| B2B perceived value | High | Membership is easy to justify as a corporate expense; single monthly invoice |
| Pricing consistency | High | Clear two-tier logic; consultation is a membership feature, not an orphaned product |
| Impact on existing products | Low | Individual products retain their own pricing; no disruption |

**Verdict: Best fit for current stage.** This model solves the core problem (consultation is no longer isolated), adds a recurring revenue layer without forcing it, and gives B2B buyers a simple value proposition for internal budget approval.

---

### 2.4 Option D — Tiered Membership (Bronze / Silver / Gold)

**Description:** Three membership levels with increasing access and consultation quota.

| Tier | Price | Consultation | Discount |
|---|---|---|---|
| 브론즈 | 월 9,900원 | 월 2회 | 5% |
| 실버 | 월 19,800원 | 월 5회 | 10% |
| 골드 | 월 39,600원 | 월 10회 | 15% + 전용 강의 |

**Evaluation:**

| Dimension | Score | Notes |
|---|---|---|
| Revenue predictability (MRR) | High | Multiple tiers create upsell path |
| User acquisition friction | Medium | Three choices create decision paralysis for new users |
| B2B perceived value | Medium | Complex for SME teams to evaluate |
| Pricing consistency | Medium | Three tiers can feel overwhelming for a platform of this size |
| Impact on existing products | Low | Individual purchases unchanged |

**Verdict: Viable long-term evolution of Option C.** Premature for current stage. Tiering requires sufficient user base to validate which tier resonates. Recommended as a Phase 2 evolution after Option C is validated.

---

## 3. Recommendation

### 3.1 Recommended Model: Hybrid (Option C) — "비즈스쿨 멤버십"

**Core principle:** Individual purchase is the default. Membership is an opt-in upgrade that makes 전문가상담 a natural benefit rather than a standalone product.

### 3.2 Specific Price Points

**Individual Purchase (unchanged):**

| Product | Price Range | Notes |
|---|---|---|
| 현장강의 | 50,000~300,000원 per course | Varies by course length and venue |
| 온라인강의 | 19,000~99,000원 per course | Varies by content depth |
| 도서 | 15,000~35,000원 per book | Standard book pricing |
| 전문가상담 (non-member) | 10,000원 per session | Available a la carte; signals real value |

**Membership Tier:**

| Option | Price | Included |
|---|---|---|
| 월간 멤버십 | 월 19,800원 | 전문가상담 월 5회 + 강의 10% 할인 + 도서 5% 할인 |
| 연간 멤버십 | 연 190,000원 (월 15,833원 상당, 약 20% 절약) | 동일 혜택 + 연간 무료 도서 1권 |

**Rationale for 19,800원:**
- At 5 consultations/month, member pays 3,960원/session vs 10,000원 a la carte. The value story is clear.
- Under 20,000원 psychologically anchors it as an affordable business expense.
- For a company with 3 employees using it, the per-person cost is under 7,000원/month — easy internal approval.
- Competitive comparison: 택스넷 subscription tiers start at ~22,000원/month. BIZSCHOOL undercuts while offering fresher content.

**Rationale against keeping 월 11,000원 / 10회 as-is:**
- 1,100원 per consultation signals negligible value. Professionals will not take advice at that price point seriously.
- Bundling consultation into a broader membership at 19,800원 reframes the value: users pay for platform membership and get expert advice as a feature.

### 3.3 How Expert Consultation Fits Into the Overall Structure

전문가상담 is repositioned from "standalone subscription product" to "flagship membership benefit":

1. Non-members see 전문가상담 listed in the product catalog at 10,000원/session with a clear upsell prompt: "멤버십 가입 시 월 5회 포함 — 월 19,800원"
2. Members see their remaining consultation quota in the 마이페이지 dashboard.
3. Members who exceed their monthly quota can purchase additional sessions at the member rate (7,000원/session).
4. The pricing page communicates: "강의, 도서, 전문가 상담을 하나의 멤버십으로"

### 3.4 How to Present This to Users on the Platform

**Pricing Page Structure (UI/UX guidance):**

```
[헤더] BIZSCHOOL 요금 안내

[섹션 1] 기본 이용 (무료 회원)
  - 모든 강의/도서 개별 구매 가능
  - 전문가상담: 회당 10,000원

[섹션 2] 비즈스쿨 멤버십 [추천 배지]
  월 19,800원 / 연 190,000원
  ✓ 전문가상담 월 5회 포함
  ✓ 강의 10% 할인
  ✓ 도서 5% 할인
  ✓ (연간) 무료 도서 1권

[섹션 3] 자주 묻는 질문
  - 인재키움 환급 과정은 멤버십 할인과 중복 적용되나요?
  - 상담 잔여 횟수는 어디서 확인하나요?
```

**마이페이지 멤버십 위젯:**
- 멤버십 상태 배지 (활성/미가입)
- 이번 달 상담 잔여 횟수 (예: 3/5회 사용)
- 멤버십 갱신일
- 비멤버 대비 이번 달 절약 금액 (동기부여 요소)

---

## 4. Scope

### 4.1 In Scope

- [ ] Define final pricing model and price points (this document)
- [ ] Design pricing page UI (별도 design 문서)
- [ ] Design 마이페이지 멤버십 status widget (별도 design 문서)
- [ ] Update product catalog display to show membership pricing alongside standard pricing
- [ ] Update 전문가상담 product listing to reflect new a la carte price and membership upsell

### 4.2 Out of Scope

- Real payment processing backend
- Actual membership subscription management
- Consultation booking/scheduling system
- 인재키움 subsidy integration logic (separate regulatory concern)
- Tiered membership (Phase 2 only)

---

## 5. Requirements

### 5.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | Pricing page displays both free-tier and membership-tier options clearly | Must | Pending |
| FR-02 | 전문가상담 product page shows a la carte price (10,000원/session) and membership upsell | Must | Pending |
| FR-03 | 마이페이지 shows membership status and remaining consultation quota | Must | Pending |
| FR-04 | Monthly and annual membership options are selectable on the pricing page | Must | Pending |
| FR-05 | Product cards for courses and books display member discount badge when user is a member | Should | Pending |
| FR-06 | Non-member product pages show "멤버십 가입 시 X원 절약" prompt | Should | Pending |
| FR-07 | Pricing page includes FAQ section addressing 인재키움 interaction | Could | Pending |

### 5.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Clarity | A new user can identify the pricing structure within 10 seconds | Usability review / heuristic evaluation |
| Consistency | Membership benefits are surfaced at every relevant touchpoint | Design review checklist |
| Accessibility | Pricing page meets WCAG 2.1 AA contrast ratios | Visual inspection |

---

## 6. Success Criteria

### 6.1 Definition of Done (UI/UX scope — Starter project)

- [ ] Pricing page component renders with correct mock data for both tiers
- [ ] 전문가상담 listing page displays a la carte price + membership upsell
- [ ] 마이페이지 멤버십 widget renders with mock membership state (active/inactive) and consultation quota
- [ ] Product cards conditionally render member discount badge
- [ ] Design review completed and approved

### 6.2 Quality Criteria

- [ ] No pricing information is contradictory across pages
- [ ] Membership value proposition is legible at a glance (no wall-of-text pricing tables)
- [ ] Zero lint errors; build succeeds

---

## 7. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 19,800원 membership feels too close to competitor pricing without sufficient differentiation | Medium | Medium | Emphasize the consultation + discount bundle; add 1-month free trial framing in copy |
| Users confuse 인재키움-subsidized courses with membership discounts | High | Medium | Add explicit FAQ clarifying the two are separate; do not display membership discount on subsidized course pages |
| Low-priced a la carte consultation (10,000원) cannibalizes membership sign-up | Low | Low | Position membership as the better default; a la carte is for one-time testers |
| Tiered pricing (Option D) requested prematurely by stakeholders | Medium | Medium | Document Option D as the explicit Phase 2 roadmap item; set expectations in this plan |
| Price anchoring failure: 연간 190,000원 feels large without monthly comparison shown | Medium | Medium | Always display annual price with "월 15,833원 상당" equivalence |

---

## 8. Architecture Considerations

### 8.1 Project Level

| Level | Selected |
|-------|:--------:|
| Starter | X |
| Dynamic | |
| Enterprise | |

This is a UI/UX-only deliverable. No payment backend. Static/mock data only.

### 8.2 Key Architectural Decisions

| Decision | Selected | Rationale |
|----------|----------|-----------|
| Framework | Next.js | Existing project stack |
| Styling | Tailwind CSS | Existing project convention |
| State (membership status) | Mock data / props | No auth/payment backend; Starter level |
| Data | Static mock in `src/data/` | Consistent with existing mypage.ts pattern |

### 8.3 New Files Expected

```
src/
├── app/
│   └── pricing/
│       └── page.tsx                     # Pricing page
├── components/
│   └── pricing/
│       ├── PricingHero.tsx              # Header + tier comparison
│       ├── MembershipCard.tsx           # Monthly / Annual toggle
│       ├── ConsultationCard.tsx         # A la carte consultation listing
│       └── PricingFAQ.tsx              # FAQ accordion
│   └── mypage/
│       └── MembershipStatusWidget.tsx   # 마이페이지 membership quota widget
└── data/
    └── pricing.ts                       # Mock pricing and membership data
```

---

## 9. Convention Prerequisites

### 9.1 Existing Conventions

- [x] Next.js App Router structure in use
- [x] Tailwind CSS for styling
- [x] TypeScript throughout
- [x] Component pattern: `src/components/{domain}/{ComponentName}.tsx`
- [x] Mock data pattern: `src/data/{domain}.ts`

### 9.2 No New Environment Variables Required

This is a static UI feature. No API keys or backend URLs needed.

---

## 10. Next Steps

1. [ ] CTO (team lead) review and approval of this pricing strategy
2. [ ] Confirm final price points with stakeholders
3. [ ] Write design document (`pricing-strategy.design.md`)
4. [ ] Implement pricing page and membership widget components
5. [ ] Review against this plan (Check phase)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-23 | Initial draft — pricing strategy analysis and recommendation | Product Manager |
