# 강의 구매내역 UI 개편 Design Document

> **Summary**: CourseOrderSection 컴포넌트 UI/UX 개편 상세 설계 - 경쟁사 벤치마킹 기반
>
> **Project**: bizschool
> **Version**: 0.1.0
> **Author**: AI Assistant
> **Date**: 2026-03-19
> **Status**: Draft
> **Planning Doc**: [course-order-ui-revamp.plan.md](../../01-plan/features/course-order-ui-revamp.plan.md)

---

## 1. Overview

### 1.1 Design Goals

- 테이블 컬럼 최적화 (7→6컬럼): 중복 정보 제거로 가독성 향상
- 환불/취소 상태 추가: 주문 라이프사이클 완전 커버
- 강의유형 필터: 온라인/현장 구분 필터링 기능 추가
- 주문 상세 보기: BookOrderSection 패턴과 일관된 full-page detail view
- 인터랙티브 상태바: 클릭으로 상태별 필터링
- 모바일 카드 최적화: 정보 밀도 축소 및 액션 버튼 추가

### 1.2 Design Principles

- **기존 패턴 일관성**: BookOrderSection의 detail view 패턴, 디자인 토큰 체계 유지
- **Progressive Disclosure**: 퀵 필터 → 상세조회 모달 → 주문 상세 보기 단계별 정보 공개
- **Mobile-First**: 모바일 카드에서 핵심 정보만 표시, 상세 정보는 detail view로 분리

---

## 2. Architecture

### 2.1 Component Hierarchy

```
PurchasesSection (탭 순서 변경: courses 먼저)
  ├── SubTab: "강의 구매내역" | "도서 구매내역"
  │
  └── CourseOrderSection (selectedOrderId === null ? list : detail)
        │
        ├── [List View] ─────────────────────────────────
        │   ├── CourseOrderStatusBar (인터랙티브, 클릭 필터)
        │   ├── CourseTypeFilterChips (전체/온라인/현장)
        │   ├── QuickPeriodBar (1m/3m/6m + 상세조회)
        │   ├── FilterSummary (기간 + 건수 + 활성 필터)
        │   ├── DetailSearchModal (기간+연도+상태+검색)
        │   ├── Desktop: Table (6컬럼)
        │   │   └── CourseOrderTableRow (상태배지+영수증+상세보기)
        │   ├── Mobile: Cards
        │   │   └── CourseOrderCard (최적화된 카드)
        │   └── Pagination
        │
        └── [Detail View] ──────────────────────────────
            └── CourseOrderDetail (신규 파일)
                ├── BackButton
                ├── OrderHeader (주문번호, 날짜, 상태)
                ├── CourseInfoSection (강좌명, 유형, 금액)
                ├── PaymentDetailSection (결제 상세)
                ├── RefundInfoSection (환불 정보, 조건부)
                └── ActionButtons (상태별 조건부)
```

### 2.2 File Structure

```
src/components/mypage/
  CourseOrderSection.tsx      ← 대폭 수정 (리스트 뷰 + 인라인 서브컴포넌트)
  CourseOrderDetail.tsx       ← 신규 생성 (상세 보기 full-page)
  PurchasesSection.tsx        ← 소폭 수정 (탭 순서, 건수 배지, onDetailViewChange)
  DatePicker.tsx              ← 변경 없음 (기존 공유 컴포넌트)

src/types/index.ts            ← CourseOrderStatus 확장, CourseOrderDetail 인터페이스 추가
src/data/mypage.ts            ← mock 데이터 추가 (환불/취소 주문, 상세 데이터)
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| CourseOrderSection | types/index.ts | CourseOrder, CourseOrderStatus 타입 |
| CourseOrderSection | data/mypage.ts | mockCourseOrders, mockCourseOrderDetails |
| CourseOrderDetail | types/index.ts | CourseOrderDetailType 인터페이스 |
| PurchasesSection | CourseOrderSection | onDetailViewChange prop 연결 |

---

## 3. Data Model

### 3.1 타입 변경 사항 (`src/types/index.ts`)

```typescript
// ── 변경: CourseOrderStatus 확장 ──
export type CourseOrderStatus =
  | "결제대기"
  | "결제완료"
  | "수강중"
  | "수강완료"
  | "환불신청"    // NEW
  | "환불완료"    // NEW
  | "취소";       // NEW

// ── 변경: CourseOrderStatusFilter 자동 확장 (기존 정의 유지) ──
export type CourseOrderStatusFilter = "전체" | CourseOrderStatus;

// ── 변경 없음: CourseOrder 인터페이스 ──
// paymentStatus 필드는 유지하되 UI 테이블에서는 표시하지 않음
export interface CourseOrder {
  id: string;
  orderedAt: string;
  courseTitle: string;
  courseType: "온라인" | "공개교육";
  price: number;
  paymentMethod: PaymentMethod;
  paymentStatus: "결제완료" | "결제대기";
  orderStatus: CourseOrderStatus;
}

// ── 신규: CourseOrderDetailType 인터페이스 ──
export interface CourseOrderDetailType extends CourseOrder {
  orderedTime: string;         // "14:30" 시간 정보
  coursePeriodStart?: string;  // 수강 시작일
  coursePeriodEnd?: string;    // 수강 종료일
  payment: {
    courseFee: number;         // 수강료 (할인 전)
    discountAmount: number;    // 할인 금액
    totalAmount: number;       // 최종 결제 금액
    paidAt?: string;           // 결제 일시 (결제대기 시 null)
  };
  refund?: {
    requestedAt: string;       // 환불 신청일
    reason: string;            // 환불 사유
    refundAmount: number;      // 환불 금액
    completedAt?: string;      // 환불 완료일 (환불신청 시 null)
  };
  cancelledAt?: string;        // 취소일 (취소 상태일 때)
  cancelReason?: string;       // 취소 사유
}

// ── 변경: CourseOrderFilter에 courseType 필터 추가는 하지 않음 ──
// courseType 필터는 별도 state로 관리 (CourseOrderFilter와 독립)
```

### 3.2 Mock 데이터 추가 (`src/data/mypage.ts`)

```typescript
// mockCourseOrders에 추가할 데이터 (3건)
{ id: "CRS-2026-019", orderedAt: "2025-11-20", courseTitle: "경영전략 심화과정",
  courseType: "공개교육", price: 450000, paymentMethod: "신용카드",
  paymentStatus: "결제완료", orderStatus: "환불신청" },
{ id: "CRS-2026-020", orderedAt: "2025-10-05", courseTitle: "마케팅 기초",
  courseType: "온라인", price: 89000, paymentMethod: "카카오페이",
  paymentStatus: "결제완료", orderStatus: "환불완료" },
{ id: "CRS-2026-021", orderedAt: "2025-09-12", courseTitle: "Python 데이터분석",
  courseType: "온라인", price: 120000, paymentMethod: "네이버페이",
  paymentStatus: "결제대기", orderStatus: "취소" },

// mockCourseOrderDetails (신규 export)
export const mockCourseOrderDetails: Record<string, CourseOrderDetailType> = {
  "CRS-2026-001": { /* 기존 주문 상세 */ },
  "CRS-2026-019": { /* 환불신청 상세 + refund 필드 */ },
  // ... 모든 주문에 대한 상세 데이터
};
```

---

## 4. UI/UX Design

### 4.1 전체 레이아웃 (Desktop)

```
┌─────────────────────────────────────────────────────────────────┐
│  [강의 구매내역 (18)]  [도서 구매내역 (20)]    ← 탭 (순서 변경+건수)│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─── 상태 요약 바 (인터랙티브) ──────────────────────────────┐  │
│  │ 주문건수  결제대기  결제완료  수강중  수강완료              │  │
│  │   18       1        5       4       8                    │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  [전체] [온라인] [현장교육]          ← 강의유형 필터 칩          │
│                                                                 │
│  [1개월] [3개월] [6개월] [📅 상세조회]  ← 퀵 기간 필터          │
│                               2026-01-01 ~ 2026-03-19 (총 12건) │
│                                                                 │
│  ┌─── 테이블 (6컬럼) ────────────────────────────────────────┐  │
│  │ 주문일  │   강좌명      │ 유형  │ 결제금액 │ 결제수단 │ 상태 │  │
│  ├─────────┼──────────────┼──────┼─────────┼────────┼──────┤  │
│  │ 03.14  │ 세무회계 실무.. │ 온라인│ 150,000원│ 신용카드 │[수강중]│
│  │        │              │      │         │        │ 영수증 │  │
│  │        │              │      │         │        │상세보기>│  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│               ‹ 1  2  3  ›      ← 페이지네이션                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 전체 레이아웃 (Mobile)

```
┌────────────────────────────┐
│ [강의 구매내역] [도서 구매내역]│
├────────────────────────────┤
│  주문건수  결제대기  결제완료  │
│    18       1       5      │
│  수강중   수강완료           │
│    4       8               │
├────────────────────────────┤
│ [전체] [온라인] [현장교육]    │
├────────────────────────────┤
│ [1개월] [3개월] [6개월]      │
│              [📅 상세조회]   │
│ 01.01 ~ 03.19 (총 12건)     │
├────────────────────────────┤
│ ┌──────────────────────┐   │
│ │ [수강중]     2026-03-14│   │
│ │ 세무회계 실무 기초      │   │
│ │ 온라인 · 150,000원     │   │
│ │ ──────────────────── │   │
│ │ [영수증]    [상세보기 >]│   │
│ └──────────────────────┘   │
│                            │
│ ┌──────────────────────┐   │
│ │ [환불신청]   2025-11-20│   │
│ │ 경영전략 심화과정       │   │
│ │ 현장교육 · 450,000원   │   │
│ │ ──────────────────── │   │
│ │           [상세보기 >] │   │
│ └──────────────────────┘   │
└────────────────────────────┘
```

### 4.3 주문 상세 보기 (CourseOrderDetail)

```
┌─────────────────────────────────────────────┐
│ ‹ 강의 구매 목록으로                          │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─── 주문 정보 ──────────────────────────┐  │
│  │ 주문번호    CRS-2026-001              │  │
│  │ 주문일시    2026-03-14 14:30          │  │
│  │ 주문상태    [수강중]                   │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌─── 강의 정보 ──────────────────────────┐  │
│  │ 강좌명      세무회계 실무 기초          │  │
│  │ 강의유형    온라인                     │  │
│  │ 수강기간    2026-03-14 ~ 2026-09-14   │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌─── 결제 정보 ──────────────────────────┐  │
│  │ 수강료           ₩150,000             │  │
│  │ 할인금액          -₩0                 │  │
│  │ ─────────────────────────────          │  │
│  │ 결제금액          ₩150,000 (bold)     │  │
│  │ 결제수단          신용카드              │  │
│  │ 결제일            2026-03-14          │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌─── 액션 버튼 (상태별 조건부) ──────────┐  │
│  │ [영수증 다운로드]  [환불 신청]          │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ※ 환불/취소 시 추가 정보 섹션 표시          │
│                                             │
└─────────────────────────────────────────────┘
```

### 4.4 환불 정보 섹션 (환불신청/환불완료 상태일 때)

```
┌─── 환불 정보 ──────────────────────────┐
│ 환불 상태    [환불신청] / [환불완료]     │
│ 신청일       2026-03-15               │
│ 환불사유     개인사정                   │
│ 환불금액     ₩150,000                 │
│ 완료일       2026-03-18 (환불완료 시)   │
└────────────────────────────────────────┘
```

### 4.5 상세조회 모달 (DetailSearchModal) 개선

```
┌─────────────────────────────────────────┐
│  상세조회                           [X]  │
├─────────────────────────────────────────┤
│  ⓘ 조회기간은 최대 5년까지 가능합니다.    │
├─────────────────────────────────────────┤
│  기간조회                               │
│                                         │
│  연도 선택:                              │
│  (2026) (2025) (2024) (2023) (2022)     │
│                                         │
│  기간 설정:                              │
│  [최근 1개월 ▼]  [2026-01-01] ~ [03-19] │
├─────────────────────────────────────────┤
│  주문 상태                              │
│  [전체 ▼]                               │
│  → 드롭다운: 전체/결제대기/결제완료/      │
│    수강중/수강완료/환불신청/환불완료/취소   │
├─────────────────────────────────────────┤
│  검색                                   │
│  [강좌명 ▼] [________________]          │
├─────────────────────────────────────────┤
│        [↺ 초기화]    [적용]              │
└─────────────────────────────────────────┘
```

---

## 5. Component Specifications

### 5.1 CourseOrderStatusBadge (수정)

7개 상태에 대한 배지 색상 매핑:

| Status | Background | Text Color | Rationale |
|--------|-----------|------------|-----------|
| 결제대기 | `bg-amber-50` | `text-amber-600` | 기존 유지 - 대기 상태 |
| 결제완료 | `bg-blue-50` | `text-blue-600` | 기존 유지 - 완료 확인 |
| 수강중 | `bg-purple-50` | `text-purple-600` | 기존 유지 - 활성 상태 |
| 수강완료 | `bg-emerald-50` | `text-emerald-600` | 기존 유지 - 성공 완료 |
| 환불신청 | `bg-orange-50` | `text-orange-600` | **신규** - 진행중 주의 |
| 환불완료 | `bg-gray-100` | `text-gray-500` | **신규** - 종료 상태 |
| 취소 | `bg-red-50` | `text-red-500` | **신규** - 파괴적 종료 (BookOrderSection 일관) |

### 5.2 CourseOrderStatusBar (수정)

- `orders` prop: 현재 기간 필터가 적용된 주문 목록 (상태/유형/검색 필터 제외)
- `activeStatus` prop: 현재 `filter.orderStatus` 값
- `onStatusClick` prop: `(status: CourseOrderStatusFilter) => void`
- 5개 항목 유지 (주문건수, 결제대기, 결제완료, 수강중, 수강완료)
- 환불/취소는 상태바에 포함하지 않음 (드롭다운 필터로만 접근)
- 클릭 시 `filter.orderStatus` 변경, 이미 활성이면 "전체"로 리셋
- 활성 상태: `bg-[var(--color-primary-light)]` 배경 + `text-[var(--color-primary)]` 카운트

```typescript
interface CourseOrderStatusBarProps {
  orders: CourseOrder[];
  activeStatus: CourseOrderStatusFilter;
  onStatusClick: (status: CourseOrderStatusFilter) => void;
}
```

### 5.3 CourseTypeFilterChips (신규)

```typescript
const COURSE_TYPE_OPTIONS = [
  { key: "전체", label: "전체" },
  { key: "온라인", label: "온라인" },
  { key: "현장", label: "현장교육" },
] as const;

type CourseTypeFilterKey = "전체" | "온라인" | "현장";
```

- 배치: 상태 요약 바 아래, 퀵 기간 버튼 위
- 스타일: 활성 → `bg-[var(--color-primary)] text-white`, 비활성 → `bg-white text-[var(--color-body)] border-[var(--color-border)]`
- 독립 AND 필터: orderStatus 필터와 동시 적용 가능
- "현장" 선택 시 `courseType === "공개교육"` 으로 매핑

### 5.4 QuickPeriodBar (수정)

```typescript
const QUICK_PERIODS = [
  { key: "1m", label: "1개월" },
  { key: "3m", label: "3개월" },
  { key: "6m", label: "6개월" },
] as const;
```

- 기본 선택: `"1m"` (현재 `"6m"` → 변경)
- 연도별 버튼(2026, 2025...) 제거 → DetailSearchModal 내부로 이동
- "상세조회" 버튼 유지 (Calendar 아이콘)

### 5.5 Desktop Table (6컬럼)

```
| 주문일 (10%) | 강좌명 (30%) | 유형 (10%) | 결제금액 (15%) | 결제수단 (13%) | 상태 (22%) |
```

**상태 컬럼 내부 구조:**

```
[상태배지]
영수증 ↓     ← canDownloadReceipt 시에만 표시
상세보기 >   ← 항상 표시
```

- `PaymentStatusBadge` 컴포넌트 삭제 → `CourseOrderStatusBadge`로 통합
- `결제여부` 컬럼 삭제
- 강좌명 클릭 시 `setSelectedOrderId(order.id)` 호출

### 5.6 Mobile Card (수정)

```
┌──────────────────────────────────┐
│ [상태배지]              주문일   │
│ 강좌명                          │
│ 유형 · 결제금액                  │
│ ─────────────────────────────── │
│ [조건부 액션버튼]    [상세보기 >] │
└──────────────────────────────────┘
```

- `paymentMethod` 제거 (모바일 정보 밀도 축소)
- `PaymentStatusBadge` 제거 (orderStatus 배지로 통합)
- 하단 구분선 + 액션 영역 추가
- 조건부 액션 버튼 로직:

| orderStatus | 액션 버튼 |
|-------------|---------|
| 결제대기 | - |
| 결제완료, 수강중 | 영수증 |
| 수강완료 | 영수증 |
| 환불신청 | - |
| 환불완료 | - |
| 취소 | - |

### 5.7 CourseOrderDetail (신규 파일)

```typescript
interface CourseOrderDetailProps {
  order: CourseOrderDetailType;
  onBack: () => void;
}
```

**레이아웃 구조:**

1. **BackButton**: `< 강의 구매 목록으로` (ChevronLeft 아이콘)
2. **OrderHeader**: 주문번호 + 주문일시 + 상태 배지 (큰 배지)
3. **CourseInfoSection**: 강좌명, 강의유형, 수강기간 → rounded-2xl 카드
4. **PaymentDetailSection**: 수강료, 할인, 결제금액, 결제수단, 결제일 → rounded-2xl 카드
5. **RefundInfoSection**: 환불 정보 (환불신청/환불완료 시에만 표시) → rounded-2xl 카드
6. **CancelInfoSection**: 취소 정보 (취소 상태 시에만 표시) → rounded-2xl 카드
7. **ActionButtons**: 상태별 조건부 버튼

**상태별 액션 버튼:**

| orderStatus | Primary Button | Secondary Button |
|-------------|---------------|-----------------|
| 결제대기 | 결제하기 | 주문취소 |
| 결제완료 | 영수증 다운로드 | 환불 신청 |
| 수강중 | 영수증 다운로드 | 환불 신청 |
| 수강완료 | 영수증 다운로드 | - |
| 환불신청 | - | - (환불 정보 표시) |
| 환불완료 | - | - (환불 정보 표시) |
| 취소 | - | - (취소 정보 표시) |

---

## 6. State Management

### 6.1 CourseOrderSection State

```typescript
// ── Filter State ──
const [filter, setFilter] = useState<CourseOrderFilter>(getDefaultFilter);
const [quickPeriod, setQuickPeriod] = useState<string | null>("1m");  // 변경: 6m → 1m
const [courseTypeFilter, setCourseTypeFilter] = useState<CourseTypeFilterKey>("전체");  // 신규

// ── UI State ──
const [isModalOpen, setIsModalOpen] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);  // 신규: detail view
```

### 6.2 Derived State (useMemo)

```typescript
// Step 1: 기간 필터만 적용 (상태바 카운트용)
const dateFilteredOrders = useMemo(() => {
  return mockCourseOrders.filter(
    (o) => o.orderedAt >= filter.dateFrom && o.orderedAt <= filter.dateTo
  );
}, [filter.dateFrom, filter.dateTo]);

// Step 2: 모든 필터 적용 (테이블/카드 표시용)
const filteredOrders = useMemo(() => {
  let orders = dateFilteredOrders;

  // 주문 상태 필터
  if (filter.orderStatus !== "전체") {
    orders = orders.filter((o) => o.orderStatus === filter.orderStatus);
  }

  // 강의 유형 필터
  if (courseTypeFilter !== "전체") {
    const typeMap = { "온라인": "온라인", "현장": "공개교육" } as const;
    orders = orders.filter((o) => o.courseType === typeMap[courseTypeFilter]);
  }

  // 검색 키워드
  if (filter.searchKeyword.trim()) {
    const kw = filter.searchKeyword.toLowerCase();
    orders = orders.filter((o) => o.courseTitle.toLowerCase().includes(kw));
  }

  return orders;
}, [dateFilteredOrders, filter.orderStatus, filter.searchKeyword, courseTypeFilter]);
```

### 6.3 State Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    CourseOrderSection                         │
│                                                              │
│  filter ──────────┬──→ dateFilteredOrders ──→ StatusBar      │
│  courseTypeFilter ─┼──→ filteredOrders ──────→ Table/Cards   │
│  currentPage ─────┘──→ paginatedOrders                      │
│                                                              │
│  StatusBar.onClick ──→ setFilter({orderStatus})              │
│  TypeChips.onClick ──→ setCourseTypeFilter()                 │
│  QuickPeriod.onClick ─→ setFilter({dateFrom,dateTo})         │
│  Modal.onApply ──────→ setFilter(newFilter)                  │
│  Row/Card.onClick ───→ setSelectedOrderId(id)                │
│                                                              │
│  selectedOrderId !== null ──→ render CourseOrderDetail        │
│  CourseOrderDetail.onBack ──→ setSelectedOrderId(null)       │
└──────────────────────────────────────────────────────────────┘
```

---

## 7. PurchasesSection 수정 사항

### 7.1 탭 순서 변경

```typescript
// Before:
const subTabs = [
  { key: "books", label: "도서 구매내역" },
  { key: "courses", label: "강의 구매내역" },
];

// After:
const subTabs = [
  { key: "courses", label: "강의 구매내역" },
  { key: "books", label: "도서 구매내역" },
];
```

기본 활성 탭: `"courses"` (현재 `"books"` → 변경)

### 7.2 건수 배지 추가

```tsx
<button role="tab" ...>
  {tab.label}
  <span className="ml-1.5 inline-flex items-center justify-center
    rounded-full bg-[var(--color-light-bg)] px-2 py-0.5
    text-xs font-medium text-[var(--color-muted)]">
    {tab.key === "courses" ? mockCourseOrders.length : mockBookOrders.length}
  </span>
</button>
```

### 7.3 onDetailViewChange 연결

```tsx
{activeSubTab === "courses" && (
  <CourseOrderSection onDetailViewChange={setIsDetailView} />
)}
```

---

## 8. 삭제 대상

| 항목 | 위치 | 사유 |
|------|------|------|
| `PaymentStatusBadge` 컴포넌트 | CourseOrderSection.tsx 내부 | `CourseOrderStatusBadge`로 통합 |
| `결제여부` 테이블 컬럼 | CourseOrderSection.tsx 테이블 | 주문상태에 통합 |
| `paymentStatus` 관련 UI | CourseOrderSection.tsx | 테이블/카드에서 제거 (타입은 유지) |
| 연도별 퀵 버튼 (2026, 2025...) | CourseOrderSection.tsx | DetailSearchModal로 이동 |

---

## 9. Implementation Order

### Phase 1: 타입 및 데이터 (기반 작업)
1. `src/types/index.ts` - CourseOrderStatus 확장, CourseOrderDetailType 추가
2. `src/data/mypage.ts` - 환불/취소 mock 데이터 + 상세 데이터 추가

### Phase 2: 테이블 컬럼 최적화 (핵심 변경)
3. `CourseOrderStatusBadge` - 7개 상태 variantMap 추가
4. `PaymentStatusBadge` 삭제
5. 테이블 7→6컬럼 변경 (결제여부 제거, colgroup 조정)
6. 상태 컬럼에 상세보기/영수증 링크 추가

### Phase 3: 필터 개선
7. `CourseOrderStatusBar` - 인터랙티브 변경 (클릭 필터링)
8. `CourseTypeFilterChips` - 신규 추가
9. `QuickPeriodBar` - 1m/3m/6m으로 변경
10. `DetailSearchModal` - 연도 선택 pills 추가, 상태 드롭다운 옵션 확장

### Phase 4: 모바일 카드 최적화
11. 모바일 카드 구조 변경 (paymentMethod 제거, 액션 영역 추가)

### Phase 5: 상세 보기 (신규 기능)
12. `CourseOrderDetail.tsx` 신규 생성
13. `CourseOrderSection` - selectedOrderId 상태 + render guard 추가
14. `PurchasesSection.tsx` - onDetailViewChange 연결

### Phase 6: 탭 관련 변경
15. `PurchasesSection.tsx` - 탭 순서 변경 + 기본 탭 변경 + 건수 배지

---

## 10. Coding Conventions

### 10.1 This Feature's Conventions

| Item | Convention Applied |
|------|-------------------|
| Component naming | PascalCase (CourseOrderDetail, CourseTypeFilterChips) |
| File organization | mypage/ 폴더 내 배치, 인라인 서브컴포넌트 우선 |
| State management | useState + useMemo (local state only) |
| Styling | Tailwind CSS + CSS custom properties (var(--color-*)) |
| Icons | lucide-react (Download, ChevronLeft 등) |
| Border radius | rounded-2xl (카드), rounded-lg (버튼), rounded-full (배지) |

### 10.2 Import Order

```typescript
// 1. React
import { useState, useMemo, useCallback } from "react";
// 2. lucide-react icons
import { ChevronLeft, Download, ... } from "lucide-react";
// 3. Types
import type { CourseOrder, CourseOrderDetailType, ... } from "@/types";
// 4. Data
import { mockCourseOrders, mockCourseOrderDetails, ... } from "@/data/mypage";
// 5. Local components (if separate file)
import CourseOrderDetail from "./CourseOrderDetail";
```

---

## 11. Receipt Download Implementation

```typescript
const handleDownloadReceipt = useCallback((orderId: string) => {
  // Stub: 실제 구현 시 API 연동
  console.info("[Receipt] download requested:", orderId);
  // Production: window.open(`/api/receipts/${orderId}`, "_blank");
}, []);

function canDownloadReceipt(order: CourseOrder): boolean {
  return (
    order.paymentStatus === "결제완료" &&
    order.orderStatus !== "취소" &&
    order.orderStatus !== "결제대기"
  );
}
```

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-19 | Initial draft - frontend-architect 상의 후 작성 | AI Assistant |
