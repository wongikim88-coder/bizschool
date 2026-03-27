# expert-consultation-member-routing Planning Document

> **Summary**: Redirect paid/authenticated members away from the promotional landing page when clicking "전문가상담" in the header, sending them to a task-relevant destination instead.
>
> **Project**: BIZSCHOOL
> **Version**: 1.0
> **Author**: Product Manager Agent
> **Date**: 2026-03-26
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

Eliminate the friction of showing a promotional/sales landing page to users who have already purchased the 전문가상담 (Expert Consultation) service. When a paid member clicks "전문가상담" in the header, they should arrive at a page where they can immediately use the service — not re-read marketing content designed for prospective customers.

### 1.2 Background

The header menu item `{ label: "전문가상담", href: "/expert-consultation" }` currently routes all users — regardless of membership or purchase state — to the promotional landing page at `/expert-consultation`. This page contains a hero section, service descriptions, feature highlights, a step-by-step usage guide, and pricing cards.

Paid members who click this link have already made a purchase decision. Showing them the same sales page on every subsequent visit is a UX antipattern that:
- Creates unnecessary friction between intent ("use my consultation") and action
- Exposes irrelevant content (pricing, "why choose us") to existing customers
- Signals low product maturity compared to SaaS platforms users are familiar with (Notion, Linear, etc.)

The actual service area — consultation submission and case browsing — exists at `/expert-consultation/write` and `/community?tab=cases` respectively.

### 1.3 Related Documents

- Header component: `bizschool/src/components/layout/Header.tsx`
- Expert consultation landing page: `bizschool/src/app/expert-consultation/page.tsx`
- Expert consultation write page: `bizschool/src/app/expert-consultation/write/page.tsx`
- Community cases tab: `bizschool/src/app/community/page.tsx` (`?tab=cases`)
- Mock data: `bizschool/src/data/expert-consultation.ts`

---

## 2. Scope

### 2.1 In Scope

- [ ] Implement conditional routing logic for the "전문가상담" header link based on user authentication and purchase status
- [ ] Define the correct destination for paid members (see Requirements for decision)
- [ ] Handle both desktop nav link and mobile menu link in `Header.tsx`
- [ ] Maintain current routing for unauthenticated and non-paying authenticated users (promotional page)

### 2.2 Out of Scope

- Building a dedicated "내 상담 목록" (my consultations) dashboard page — that is a separate feature
- Modifying the promotional landing page content itself
- Backend purchase verification (project uses mock data only)
- Push notification or email flows triggered by consultation status

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | When an unauthenticated user clicks "전문가상담" in the header, they are routed to `/expert-consultation` (current behavior, unchanged) | Must | Pending |
| FR-02 | When an authenticated user without a 전문가상담 purchase clicks "전문가상담", they are routed to `/expert-consultation` (current behavior, unchanged) | Must | Pending |
| FR-03 | When an authenticated user WITH a 전문가상담 purchase clicks "전문가상담", they are NOT routed to the promotional landing page | Must | Pending |
| FR-04 | Paid members redirected to a task-relevant destination: primary candidate is `/expert-consultation/write` (submit a question) or a "내 상담" hub if one exists | Must | Pending |
| FR-05 | The routing decision must work for both desktop navigation and mobile menu | Must | Pending |
| FR-06 | Purchase state is determined via mock session/user data (no real API call required in this phase) | Should | Pending |
| FR-07 | The promotional landing page remains accessible directly via URL for all users (no hard block) | Should | Pending |
| FR-08 | If the write page (`/expert-consultation/write`) is chosen as the paid-member destination, a clear "내 상담 내역 보기" link back to the cases list should be visible on that page | Could | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | No additional network round-trips for routing decision (use session data already available from `useSession`) | Code review |
| UX | Paid member reaches service-entry point within 1 click from header | Manual test |
| Consistency | Routing behavior is identical on desktop and mobile | Manual test on both breakpoints |

---

## 4. Decision: Destination for Paid Members

### 4.1 Options Evaluated

| Option | Destination | Verdict |
|--------|-------------|---------|
| A | `/expert-consultation` (current, no change) | Rejected: promotional page is irrelevant to paid members; friction antipattern |
| B | `/community?tab=cases` | Partial: removes friction but sends user to a community browse list, not a consultation intake or personal hub. URL `community` is semantically misleading for "I want to use my expert consultation" |
| C | `/expert-consultation/write` | Recommended: directly serves the primary paid-member job-to-be-done ("I want to ask a question"). Most task-oriented. |
| D | `/mypage?tab=consultations` (future "내 상담" tab) | Best long-term UX but requires building a new mypage tab first. Defer to next iteration. |

### 4.2 Recommended Destination (FR-04)

**`/expert-consultation/write`** is the correct destination for this iteration because:
1. The primary intent of a paid member clicking "전문가상담" is to submit a question or check on their question — the write page directly serves the first use case
2. It avoids the semantic confusion of arriving in "커뮤니티" when the user clicked "전문가상담"
3. It requires zero new pages; the route already exists

A secondary link to `/community?tab=cases` (to browse answered cases) should be visible on the write page as "상담사례 보기" (FR-08 — Could priority).

---

## 5. Success Criteria

### 5.1 Definition of Done

- [ ] Unauthenticated users see no change in behavior
- [ ] Non-paying authenticated users see no change in behavior
- [ ] Paid members clicking "전문가상담" in the header land on `/expert-consultation/write` (not the promotional page)
- [ ] Behavior is consistent on desktop and mobile header
- [ ] No TypeScript errors introduced
- [ ] No regression on existing header functionality (search slide, dropdown menus, auth state display)

### 5.2 Quality Criteria

- [ ] Zero lint errors
- [ ] Build succeeds (`next build`)
- [ ] Routing logic is readable and commented for mock-data context

---

## 6. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Mock session does not carry a `hasPurchasedConsultation` flag — purchase state is undefined | High | High | Define a boolean field on mock user type or derive from existing `role`/`purchases` mock data; document the mock assumption clearly |
| `useSession` hook is only available in Client Components — `Header.tsx` is already a Client Component, so this is safe | Low | Low | Confirm with read of `Header.tsx`; already confirmed "use client" is present |
| Paid member navigates to write page but has already submitted all allowed questions (quota exhausted) — write page may show empty/error state | Medium | Low | Out of scope for this plan; write page should handle gracefully in its own iteration |
| Redirect on click (via `router.push`) may feel unexpected vs. a simple `<Link href>` — prefer conditional `href` on `<Link>` to avoid JS-only navigation | Low | Medium | Use conditional `href` prop on the `<Link>` component rather than `onClick` + `router.push` |

---

## 7. Architecture Considerations

### 7.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure (`components/`, `lib/`, `types/`) | Static sites, portfolios, landing pages | X |
| **Dynamic** | Feature-based modules, BaaS integration | Web apps with backend, SaaS MVPs | ☐ |
| **Enterprise** | Strict layer separation, DI, microservices | High-traffic systems | ☐ |

This is a Starter-level change: a conditional `href` in an existing Client Component. No new files, services, or feature modules required.

### 7.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Routing mechanism | `<Link href={conditional}>` vs `onClick + router.push` | Conditional `href` on `<Link>` | Preserves browser-native link behavior (right-click open in tab, prefetch); avoids JS-only navigation |
| Purchase state source | Mock field on session user vs. separate mock data lookup | Mock field on session user | Consistent with existing pattern (`session.user.role` already drives header content) |
| Component change scope | Header.tsx only | Header.tsx only | Routing logic is self-contained in navigation item rendering |

### 7.3 Implementation Sketch

In `Header.tsx`, the menu item for 전문가상담 is rendered via the `menuItems` array as a standard `<Link>`. Since the destination needs to be conditional on session state, the cleanest approach is:

```tsx
// Instead of a static menuItems array entry driving the href,
// compute the consultation href based on session state

const expertConsultationHref =
  session?.user?.hasPurchasedConsultation
    ? "/expert-consultation/write"
    : "/expert-consultation";
```

Then pass this computed href when rendering the link for the 전문가상담 item specifically. The `menuItems` array structure is preserved; only the render path for this one item uses the dynamic href.

Note: `hasPurchasedConsultation` must be added to the mock user type and populated in mock session data.

---

## 8. Convention Prerequisites

### 8.1 Existing Project Conventions

- Tailwind CSS + CSS variables (`var(--color-primary)`, etc.)
- Component naming: PascalCase, one component per file
- `useSession` from `next-auth/react` for auth state
- All mock data in `src/data/` files, types in `src/types/index.ts`

### 8.2 Type Change Required

Add `hasPurchasedConsultation?: boolean` to the user type used by `next-auth` session. This follows the existing pattern where `role` is extended on the session user object.

---

## 9. MoSCoW Summary

| Priority | Items |
|----------|-------|
| Must | FR-01 through FR-05: Conditional routing for paid vs. non-paid users in both desktop and mobile header |
| Should | FR-06: Mock purchase state via session data; FR-07: Promotional page still URL-accessible |
| Could | FR-08: "상담사례 보기" link on write page |
| Won't (this iteration) | Dedicated "내 상담 목록" dashboard page; real backend purchase verification |

---

## 10. Next Steps

1. [ ] Get CTO approval on the destination choice (`/expert-consultation/write` for paid members)
2. [ ] Extend mock user type with `hasPurchasedConsultation` flag in `src/types/index.ts`
3. [ ] Update mock session data to mark at least one test user as a paid member
4. [ ] Modify `Header.tsx` to use conditional href for the 전문가상담 menu item
5. [ ] Write design document (`expert-consultation-member-routing.design.md`)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-26 | Initial draft | Product Manager Agent |
