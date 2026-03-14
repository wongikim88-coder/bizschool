# mypage-courses-purchases Design Document

> **Feature**: 마이페이지 수강내역 + 구매내역 탭 구현
> **Plan Reference**: `docs/01-plan/features/mypage-courses-purchases.plan.md`
> **Author**: Design Phase
> **Date**: 2026-03-14
> **Status**: Draft

---

## 1. Architecture Overview

### 1.1 Component Tree

```
MypageContent.tsx (기존 - 수정)
├── currentTab === "courses"
│   └── CoursesSection.tsx (신규)
│       ├── CourseAccordion (title="나의 온라인 강의실", groupType="online")
│       │   ├── Desktop: <table> [강좌명, 수강기간, 결제여부]
│       │   └── Mobile: Card list
│       ├── CourseAccordion (title="나의 강의실", groupType="public")
│       │   ├── Desktop: <table> [강좌명, 수강기간, 고용보험 환급과정 여부, 결제여부]
│       │   └── Mobile: Card list
│       └── CourseAccordion (title="이수과정", groupType="completed")
│           ├── Desktop: <table> [강좌명, 수강기간, 고용보험 환급과정 여부, 결제여부]
│           └── Mobile: Card list
│
├── currentTab === "purchases"
│   └── BookOrderSection.tsx (신규)
│       ├── OrderStatusBar (주문건수, 결제대기, 결제완료, 발송준비, 발송완료)
│       ├── OrderPeriodFilter (1주일, 15일, 1개월 + 요약 텍스트)
│       ├── Desktop: <table> [날짜, 상품정보, 수량, 결제방식, 결제여부, 주문상태]
│       └── Mobile: Card list
```

### 1.2 State Architecture

| State | Location | Type | Purpose |
|-------|----------|------|---------|
| `currentTab` | URL `?tab=` | `MypageTab` | 탭 전환 (기존) |
| `openGroups` | `CoursesSection` useState | `Record<CourseGroupType, boolean>` | 아코디언 토글 |
| `selectedPeriod` | `BookOrderSection` useState | `"1w" \| "15d" \| "1m"` | 기간 필터 활성 버튼 |

---

## 2. Type Definitions

### 2.1 수강내역 Types (`types/index.ts`에 추가)

```typescript
// ── 나의 강의실 (수강내역) ──

export type CourseGroupType = "online" | "public" | "completed";
export type CoursePaymentStatus = "결제완료" | "미결제";

export interface MyCourse {
  id: string;
  title: string;                      // 강좌명
  periodStart: string;                // 수강기간 시작 (YYYY-MM-DD)
  periodEnd: string;                  // 수강기간 종료 (YYYY-MM-DD)
  paymentStatus: CoursePaymentStatus; // 결제여부
  isInsuranceRefund?: boolean;        // 고용보험 환급과정 여부 (online은 없음)
  groupType: CourseGroupType;         // 섹션 구분
}
```

### 2.2 구매내역 Types (`types/index.ts`에 추가)

```typescript
// ── 도서 주문내역 (구매내역) ──

export type OrderStatus = "결제대기" | "결제완료" | "발송준비" | "발송완료";
export type PaymentMethod = "신용카드" | "무통장입금" | "카카오페이" | "네이버페이";

export interface BookOrder {
  id: string;
  orderedAt: string;              // 날짜 (YYYY-MM-DD)
  bookTitle: string;              // 상품정보 - 도서명
  bookAuthor: string;             // 상품정보 - 저자
  quantity: number;               // 수량
  paymentMethod: PaymentMethod;   // 결제방식
  paymentStatus: "결제완료" | "결제대기"; // 결제여부
  orderStatus: OrderStatus;       // 주문상태
}

export type PeriodFilterKey = "1w" | "15d" | "1m";
```

---

## 3. Mock Data Design

### 3.1 mockMyCourses (`data/mypage.ts`에 추가)

```typescript
export const mockMyCourses: MyCourse[] = [
  // ── 나의 온라인 강의실 (online) ──
  {
    id: "mc-001",
    title: "세무회계 실무 기초",
    periodStart: "2026-01-15",
    periodEnd: "2026-07-15",
    paymentStatus: "결제완료",
    groupType: "online",
  },
  {
    id: "mc-002",
    title: "경영전략 핵심 노트",
    periodStart: "2026-02-01",
    periodEnd: "2026-04-01",
    paymentStatus: "결제완료",
    groupType: "online",
  },
  {
    id: "mc-003",
    title: "인사노무관리 입문",
    periodStart: "2026-03-01",
    periodEnd: "2026-06-30",
    paymentStatus: "미결제",
    groupType: "online",
  },

  // ── 나의 강의실 - 공개교육 (public) ──
  {
    id: "mc-004",
    title: "노무관리 실무 과정",
    periodStart: "2026-03-10",
    periodEnd: "2026-03-12",
    paymentStatus: "결제완료",
    isInsuranceRefund: true,
    groupType: "public",
  },
  {
    id: "mc-005",
    title: "재경관리사 시험대비 특강",
    periodStart: "2026-04-01",
    periodEnd: "2026-04-03",
    paymentStatus: "결제완료",
    isInsuranceRefund: false,
    groupType: "public",
  },

  // ── 이수과정 (completed) ──
  {
    id: "mc-006",
    title: "재무제표 분석 실무",
    periodStart: "2025-10-01",
    periodEnd: "2025-12-31",
    paymentStatus: "결제완료",
    isInsuranceRefund: false,
    groupType: "completed",
  },
  {
    id: "mc-007",
    title: "근로기준법 핵심정리",
    periodStart: "2025-08-15",
    periodEnd: "2025-11-15",
    paymentStatus: "결제완료",
    isInsuranceRefund: true,
    groupType: "completed",
  },
];
```

### 3.2 mockBookOrders (`data/mypage.ts`에 추가)

```typescript
export const mockBookOrders: BookOrder[] = [
  {
    id: "ORD-2026-001",
    orderedAt: "2026-03-12",
    bookTitle: "경영전략 핵심노트",
    bookAuthor: "박전략",
    quantity: 1,
    paymentMethod: "신용카드",
    paymentStatus: "결제완료",
    orderStatus: "발송완료",
  },
  {
    id: "ORD-2026-002",
    orderedAt: "2026-03-10",
    bookTitle: "세무회계 실무 교재",
    bookAuthor: "김세무",
    quantity: 2,
    paymentMethod: "카카오페이",
    paymentStatus: "결제완료",
    orderStatus: "발송준비",
  },
  {
    id: "ORD-2026-003",
    orderedAt: "2026-03-08",
    bookTitle: "인사노무관리 핸드북",
    bookAuthor: "이노무",
    quantity: 1,
    paymentMethod: "무통장입금",
    paymentStatus: "결제대기",
    orderStatus: "결제대기",
  },
  {
    id: "ORD-2026-004",
    orderedAt: "2026-03-05",
    bookTitle: "재무제표 분석 가이드",
    bookAuthor: "최재무",
    quantity: 1,
    paymentMethod: "네이버페이",
    paymentStatus: "결제완료",
    orderStatus: "발송완료",
  },
  {
    id: "ORD-2026-005",
    orderedAt: "2026-03-01",
    bookTitle: "근로기준법 해설",
    bookAuthor: "정근로",
    quantity: 3,
    paymentMethod: "신용카드",
    paymentStatus: "결제완료",
    orderStatus: "발송완료",
  },
  {
    id: "ORD-2026-006",
    orderedAt: "2026-02-25",
    bookTitle: "경영학개론",
    bookAuthor: "한경영",
    quantity: 1,
    paymentMethod: "신용카드",
    paymentStatus: "결제완료",
    orderStatus: "결제완료",
  },
];
```

---

## 4. Component Specifications

### 4.1 CoursesSection.tsx

**경로**: `bizschool/src/components/mypage/CoursesSection.tsx`

```
"use client"
```

**역할**: 수강내역 탭 루트 컴포넌트. 3개의 CourseAccordion을 렌더링.

**로직**:
- `mockMyCourses`를 `groupType`별로 필터링
- `openGroups` state로 각 아코디언 열림/닫힘 관리
- 기본값: 모두 열림 `{ online: true, public: true, completed: true }`

**컬럼 정의 (groupType별)**:

| groupType | 강좌명 | 수강기간 | 고용보험 환급과정 여부 | 결제여부 |
|-----------|--------|----------|----------------------|----------|
| online | O | O | X | O |
| public | O | O | O | O |
| completed | O | O | O | O |

**아코디언 헤더 스타일**:
```
┌─────────────────────────────────────────────┐
│ ▶ 나의 온라인 강의실                            │
├─────────────────────────────────────────────┤
│ 강좌명              │ 수강기간       │ 결제여부 │
│ 세무회계 실무 기초    │ 2026-01-15 ~  │ 결제완료 │
│                     │ 2026-07-15    │         │
└─────────────────────────────────────────────┘
```

- 헤더: `bg-[var(--color-light-bg)]` 배경, 좌측 `ChevronRight`/`ChevronDown` 아이콘
- 아이콘 회전: `transition-transform duration-200`
- 헤더 텍스트: `font-bold text-[var(--color-dark)]`
- Empty state: "수강중인 과정이 없습니다." / "수강종료 과정이 없습니다."

**Desktop 테이블 스타일** (InquiryList 패턴 따름):
- `table-fixed` + `colgroup`으로 컬럼 너비 고정
- 헤더: `bg-[var(--color-light-bg)]`, `text-center`, `font-medium text-[var(--color-muted)]`
- 행: `border-b border-[var(--color-border)]`
- 결제여부 뱃지:
  - 결제완료: `bg-emerald-50 text-emerald-600`
  - 미결제: `bg-amber-50 text-amber-600`
- 고용보험 환급:
  - 해당: `bg-blue-50 text-blue-600` "해당"
  - 비해당: `text-[var(--color-muted)]` "해당없음"

**Mobile 카드 스타일** (InquiryList 모바일 카드 패턴 따름):
- `rounded-xl border border-[var(--color-border)] bg-white p-4`
- 강좌명 + 수강기간 + 뱃지들 수직 배치

### 4.2 BookOrderSection.tsx

**경로**: `bizschool/src/components/mypage/BookOrderSection.tsx`

```
"use client"
```

**역할**: 구매내역 탭 루트 컴포넌트. 상태 요약 바 + 기간 필터 + 주문 테이블.

**서브 컴포넌트** (같은 파일 내 co-located):
- `OrderStatusBar` - 5개 상태 요약
- `OrderPeriodFilter` - 기간 버튼
- `OrderStatusBadge` - 주문상태 뱃지

#### 4.2.1 OrderStatusBar

```
┌──────────────────────────────────────────────────────┐
│  📋 주문건수   💳 결제대기   ✅ 결제완료   📦 발송준비   🚚 발송완료  │
│     6           1           1           1           3         │
└──────────────────────────────────────────────────────┘
```

- 래퍼: `rounded-2xl border border-[var(--color-border)] bg-white`
- 레이아웃: `grid grid-cols-3 md:grid-cols-5 gap-4 p-6`
- 각 셀: 아이콘(lucide) + 라벨 + 숫자 수직 정렬, `text-center`
- 카운트: mock 데이터에서 `orderStatus` 기준으로 실시간 계산
- 아이콘 매핑:
  - 주문건수: `ClipboardList`
  - 결제대기: `Clock`
  - 결제완료: `CreditCard`
  - 발송준비: `Package`
  - 발송완료: `Truck`

#### 4.2.2 OrderPeriodFilter

```
┌──────────────────────────────────────────────────┐
│ 기간별 조회:  [1주일] [15일] [1개월]                  │
│                                                  │
│ 2026-02-14 ~ 2026-03-14까지의 주문 (총 6건)         │
└──────────────────────────────────────────────────┘
```

- 레이아웃: `flex flex-wrap items-center gap-2`
- 버튼 스타일 (InquiryList 필터 버튼 패턴):
  - 활성: `bg-[var(--color-primary)] text-white`
  - 비활성: `bg-[var(--color-light-bg)] text-[var(--color-muted)] hover:bg-gray-200`
  - `rounded-full px-4 py-1.5 text-sm`
- 기본 선택: `"1m"` (1개월)
- 요약 텍스트: `text-sm text-[var(--color-muted)]`
- 기간 계산: 오늘 기준 역산 (`1w` = 7일, `15d` = 15일, `1m` = 1개월)
- **참고**: 이 프로젝트에서는 실제 필터링 적용. `orderedAt` 기준으로 해당 기간 내 주문만 표시.

#### 4.2.3 주문 테이블

**Desktop 테이블 컬럼**:

| 컬럼 | 너비 | 정렬 |
|------|------|------|
| 날짜 | 12% | center |
| 상품정보 | 32% | left |
| 수량 | 10% | center |
| 결제방식 | 15% | center |
| 결제여부 | 15% | center |
| 주문상태 | 16% | center |

- 상품정보: 도서명 (bold) + 저자 (muted, text-sm)를 줄바꿈으로 표시
- 결제여부 뱃지:
  - 결제완료: `bg-emerald-50 text-emerald-600`
  - 결제대기: `bg-amber-50 text-amber-600`
- 주문상태 뱃지:
  - 결제대기: `bg-amber-50 text-amber-600`
  - 결제완료: `bg-blue-50 text-blue-600`
  - 발송준비: `bg-purple-50 text-purple-600`
  - 발송완료: `bg-emerald-50 text-emerald-600`

**Mobile 카드**:
```
┌─────────────────────────────┐
│ [발송완료]        2026-03-12 │
│ 경영전략 핵심노트              │
│ 박전략 | 1권                  │
│ 신용카드 · 결제완료            │
└─────────────────────────────┘
```

**Empty State**: "주문내역이 없습니다." (기존 패턴과 동일한 스타일)

---

## 5. MypageContent.tsx 수정 사항

### 5.1 Import 변경

```typescript
// 제거
import { BookOpen, ShoppingBag } from "lucide-react";

// 추가
import CoursesSection from "./CoursesSection";
import BookOrderSection from "./BookOrderSection";
```

### 5.2 렌더링 변경

```typescript
// Before
{currentTab === "courses" && (
  <PlaceholderSection title="수강내역" icon={BookOpen} />
)}
{currentTab === "purchases" && (
  <PlaceholderSection title="구매내역" icon={ShoppingBag} />
)}

// After
{currentTab === "courses" && <CoursesSection />}
{currentTab === "purchases" && <BookOrderSection />}
```

### 5.3 PlaceholderSection 정리

- 두 탭 모두 실제 컴포넌트로 교체되므로 `PlaceholderSection` 함수 삭제
- `BookOpen`, `ShoppingBag` import 제거

---

## 6. File Changes Summary

| Action | File | Description |
|--------|------|-------------|
| MODIFY | `bizschool/src/types/index.ts` | `MyCourse`, `BookOrder`, union types 추가 |
| MODIFY | `bizschool/src/data/mypage.ts` | `mockMyCourses`, `mockBookOrders` 추가 |
| CREATE | `bizschool/src/components/mypage/CoursesSection.tsx` | 수강내역 탭 (아코디언 3개) |
| CREATE | `bizschool/src/components/mypage/BookOrderSection.tsx` | 구매내역 탭 (상태바 + 필터 + 테이블) |
| MODIFY | `bizschool/src/components/mypage/MypageContent.tsx` | PlaceholderSection → 실제 컴포넌트 교체 |

**총 신규 파일**: 2개
**총 수정 파일**: 3개

---

## 7. Implementation Order

| Step | Task | Dependencies |
|------|------|-------------|
| 1 | `types/index.ts`에 타입 추가 | 없음 |
| 2 | `data/mypage.ts`에 mock 데이터 추가 | Step 1 |
| 3 | `CoursesSection.tsx` 생성 | Step 1, 2 |
| 4 | `BookOrderSection.tsx` 생성 | Step 1, 2 |
| 5 | `MypageContent.tsx` 수정 | Step 3, 4 |

---

## 8. Styling Conventions (기존 패턴 준수)

### 8.1 카드 래퍼
```css
rounded-2xl border border-[var(--color-border)] bg-white
```

### 8.2 테이블 헤더
```css
bg-[var(--color-light-bg)]
px-4 py-3 text-center font-medium text-[var(--color-muted)]
```

### 8.3 테이블 행
```css
border-b border-[var(--color-border)]
```

### 8.4 뱃지
```css
inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium
```

### 8.5 반응형
```css
Desktop: hidden md:block (테이블)
Mobile: md:hidden (카드)
```

---

## 9. Success Criteria

- [ ] `?tab=courses` 클릭 시 3개 아코디언 섹션 렌더링
- [ ] 아코디언 토글 정상 동작 (열기/닫기)
- [ ] online 그룹은 고용보험 컬럼 없음, public/completed는 있음
- [ ] `?tab=purchases` 클릭 시 상태 요약 바 + 기간 필터 + 주문 테이블 렌더링
- [ ] 상태 요약 바 카운트가 mock 데이터와 일치
- [ ] 기간 필터 버튼 클릭 시 활성 상태 변경 + 요약 텍스트 업데이트
- [ ] 모바일 뷰에서 테이블 → 카드 전환 정상
- [ ] PlaceholderSection 완전 제거
- [ ] TypeScript 에러 없음

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-14 | Initial design | Design Phase |
