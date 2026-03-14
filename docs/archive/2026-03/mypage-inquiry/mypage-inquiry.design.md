# 마이페이지 & 1:1 문의 Design Document

> **Feature**: mypage-inquiry
> **Plan Reference**: `docs/01-plan/features/mypage-inquiry.plan.md`
> **Date**: 2026-03-14
> **Status**: Draft

---

## 1. Component Architecture

### 1.1 Component Tree

```
app/mypage/page.tsx (Server Component)
├── components/mypage/MypageSidebar.tsx (Client)
│   └── 프로필 카드 + 사이드바 메뉴
├── components/mypage/MypageContent.tsx (Client)
│   ├── components/mypage/ProfileSection.tsx
│   ├── components/mypage/InquiryList.tsx
│   │   └── components/mypage/InquiryDetail.tsx
│   ├── components/mypage/InquiryForm.tsx
│   └── (미구현 플레이스홀더: 수강내역, 구매내역)
└── components/mypage/MypagePagination.tsx (Client)
```

### 1.2 Component Responsibilities

| Component | Type | Responsibility |
|-----------|------|----------------|
| `page.tsx` | Server | searchParams 파싱, metadata, 레이아웃 렌더링 |
| `MypageSidebar.tsx` | Client | 프로필 표시, 메뉴 네비게이션 (Desktop: 사이드바, Mobile: 숨김) |
| `MypageContent.tsx` | Client | 탭별 콘텐츠 분기, Mobile 탭 메뉴 표시 |
| `InquiryList.tsx` | Client | 문의 목록 (Desktop: 테이블, Mobile: 카드), 필터, 문의하기 버튼 |
| `InquiryDetail.tsx` | Client | 문의 상세 (질문+답변), 목록으로 돌아가기 |
| `InquiryForm.tsx` | Client | 문의 작성 폼 (카테고리, 제목, 내용) |
| `ProfileSection.tsx` | Client | 내 정보 표시 (이름, 이메일, 가입일) |
| `MypagePagination.tsx` | Client | 페이지네이션 (CommunityPagination 패턴 재사용) |

---

## 2. Data Model

### 2.1 Type Definitions (`types/index.ts` 추가)

```typescript
// ── 마이페이지 ──

export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
}

export interface Inquiry {
  id: number;
  category: InquiryCategory;
  title: string;
  content: string;
  status: "pending" | "answered";
  createdAt: string;
  answer?: InquiryAnswer;
}

export interface InquiryAnswer {
  content: string;
  answeredAt: string;
  answeredBy: string;
}

export type InquiryCategory = "강의" | "도서" | "결제" | "기술문제" | "기타";

export type InquiryFilter = "all" | "pending" | "answered";

export type MypageTab = "profile" | "inquiry" | "courses" | "purchases";
```

### 2.2 Mock Data (`data/mypage.ts`)

```typescript
import type { MockUser, Inquiry, MypageTab } from "@/types";

// 사용자 정보
export const mockUser: MockUser = {
  id: "user-001",
  name: "김비즈",
  email: "biz@bizschool.co.kr",
  joinDate: "2025-11-15",
};

// 마이페이지 탭 정의
export const mypageTabs: { key: MypageTab; label: string }[] = [
  { key: "profile", label: "내 정보" },
  { key: "inquiry", label: "1:1 문의" },
  { key: "courses", label: "수강내역" },
  { key: "purchases", label: "구매내역" },
];

// 문의 카테고리
export const inquiryCategories: InquiryCategory[] = [
  "강의", "도서", "결제", "기술문제", "기타",
];

// Mock 문의 데이터 (8건)
export const mockInquiries: Inquiry[] = [
  {
    id: 8,
    category: "강의",
    title: "강의 환불 절차 문의드립니다",
    content: "안녕하세요. 수강 중인 '세무회계 실무' 강의를 환불하고 싶은데 절차가 어떻게 되나요? 수강 시작한 지 3일 되었습니다.",
    status: "pending",
    createdAt: "2026-03-14",
  },
  {
    id: 7,
    category: "결제",
    title: "결제 오류가 발생했습니다",
    content: "도서 구매 시 결제가 완료되었다고 나오는데 주문 내역에는 표시되지 않습니다. 카드 승인은 된 상태입니다.",
    status: "answered",
    createdAt: "2026-03-12",
    answer: {
      content: "안녕하세요, BIZSCHOOL입니다. 확인 결과 결제 시스템 일시 오류로 인한 건으로, 현재 정상 처리 완료되었습니다. 주문 내역을 다시 확인해 주시기 바랍니다. 불편을 드려 죄송합니다.",
      answeredAt: "2026-03-12",
      answeredBy: "BIZSCHOOL 고객센터",
    },
  },
  {
    id: 6,
    category: "기타",
    title: "수료증 발급 방법을 알고 싶습니다",
    content: "공개교육 수료 후 수료증은 어떻게 발급받을 수 있나요?",
    status: "answered",
    createdAt: "2026-03-10",
    answer: {
      content: "수료증은 교육 완료 후 마이페이지 > 수강내역에서 직접 다운로드하실 수 있습니다. 교육 종료 후 1~2 영업일 내에 발급됩니다.",
      answeredAt: "2026-03-11",
      answeredBy: "BIZSCHOOL 교육팀",
    },
  },
  {
    id: 5,
    category: "강의",
    title: "강의 영상이 재생되지 않습니다",
    content: "크롬 브라우저에서 강의 영상 로딩이 되지 않고 검은 화면만 나옵니다.",
    status: "answered",
    createdAt: "2026-03-08",
    answer: {
      content: "브라우저 캐시를 삭제하신 후 다시 시도해 주세요. 문제가 지속되면 다른 브라우저(Edge, Firefox)에서 확인 부탁드립니다.",
      answeredAt: "2026-03-08",
      answeredBy: "BIZSCHOOL 기술지원팀",
    },
  },
  {
    id: 4,
    category: "도서",
    title: "도서 배송 일정 문의",
    content: "주문한 도서가 아직 배송되지 않았습니다. 예상 배송일을 알 수 있을까요?",
    status: "answered",
    createdAt: "2026-03-05",
    answer: {
      content: "주문하신 도서는 현재 출고 준비 중이며, 3월 7일 발송 예정입니다. 발송 시 배송 추적 번호를 문자로 안내드리겠습니다.",
      answeredAt: "2026-03-06",
      answeredBy: "BIZSCHOOL 배송팀",
    },
  },
  {
    id: 3,
    category: "기술문제",
    title: "모바일에서 로그인이 안됩니다",
    content: "아이폰 Safari 브라우저에서 로그인 시 흰 화면만 나옵니다.",
    status: "pending",
    createdAt: "2026-03-03",
  },
  {
    id: 2,
    category: "결제",
    title: "할인 쿠폰 적용이 안됩니다",
    content: "이벤트로 받은 20% 할인 쿠폰을 적용하려고 하는데 '사용 불가'로 표시됩니다.",
    status: "answered",
    createdAt: "2026-02-28",
    answer: {
      content: "해당 쿠폰은 5만원 이상 결제 시 사용 가능한 쿠폰입니다. 쿠폰 상세 조건을 확인해 주시기 바랍니다.",
      answeredAt: "2026-02-28",
      answeredBy: "BIZSCHOOL 고객센터",
    },
  },
  {
    id: 1,
    category: "강의",
    title: "강의 수강 기간 연장 가능한가요?",
    content: "현재 수강 중인 강의의 수강 기간이 곧 만료되는데 연장이 가능한지 문의드립니다.",
    status: "answered",
    createdAt: "2026-02-25",
    answer: {
      content: "수강 기간 연장은 만료 전 1회에 한하여 30일 연장이 가능합니다. 마이페이지 > 수강내역에서 연장 신청하시거나, 고객센터로 연락 주시면 처리해 드리겠습니다.",
      answeredAt: "2026-02-26",
      answeredBy: "BIZSCHOOL 교육팀",
    },
  },
];

export const INQUIRIES_PER_PAGE = 5;
```

---

## 3. Detailed Component Specifications

### 3.1 `app/mypage/page.tsx`

**패턴 참조**: `app/community/page.tsx`

```typescript
// Server Component
// searchParams: tab (MypageTab), filter (InquiryFilter), page (number), view (number - 상세 ID)
interface PageProps {
  searchParams: Promise<{
    tab?: string;
    filter?: string;
    page?: string;
    view?: string;      // 문의 상세 보기 ID
    write?: string;     // "true"이면 작성 폼 표시
  }>;
}
```

**URL 패턴**:
| URL | 화면 |
|-----|------|
| `/mypage` | 내 정보 (기본) |
| `/mypage?tab=inquiry` | 1:1 문의 목록 |
| `/mypage?tab=inquiry&filter=pending` | 대기중 문의만 |
| `/mypage?tab=inquiry&view=5` | 문의 #5 상세 |
| `/mypage?tab=inquiry&write=true` | 문의 작성 폼 |
| `/mypage?tab=inquiry&page=2` | 문의 목록 2페이지 |
| `/mypage?tab=courses` | 수강내역 (플레이스홀더) |
| `/mypage?tab=purchases` | 구매내역 (플레이스홀더) |

### 3.2 `MypageSidebar.tsx`

**Desktop 전용** (Mobile에서는 숨김, MypageContent에서 탭 메뉴 대체)

```
┌────────────────────┐
│ ┌────────────────┐ │
│ │   [이니셜 원형]  │ │  h-16 w-16 bg-primary/10
│ │     김비즈      │ │  text-lg font-bold
│ │ biz@bizschool.. │ │  text-sm text-muted
│ └────────────────┘ │
│                    │
│ ┌────────────────┐ │
│ │ 📋 내 정보      │ │  active: bg-primary/10 text-primary font-bold
│ │ 💬 1:1 문의     │ │  default: text-body hover:bg-light-bg
│ │ 📚 수강내역     │ │
│ │ 🛒 구매내역     │ │
│ └────────────────┘ │
└────────────────────┘
```

**스타일 규격**:
- 컨테이너: `w-[240px] shrink-0 rounded-2xl border border-[var(--color-border)] bg-white p-6`
- 아바타: `h-16 w-16 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]` (이니셜)
- 메뉴 항목: `rounded-lg px-4 py-2.5 text-[15px] transition-colors`
- 활성 메뉴: `bg-[var(--color-primary)]/10 font-bold text-[var(--color-primary)]`
- 비활성 메뉴: `text-[var(--color-body)] hover:bg-[var(--color-light-bg)]`

**아이콘** (lucide-react):
| 메뉴 | 아이콘 |
|------|--------|
| 내 정보 | `User` |
| 1:1 문의 | `MessageSquare` |
| 수강내역 | `BookOpen` |
| 구매내역 | `ShoppingBag` |

### 3.3 `MypageContent.tsx`

**역할**: Mobile 탭 메뉴 표시 + 탭별 콘텐츠 분기

**Mobile 탭 메뉴 스타일** (CommunityTabs 패턴):
```
[내 정보] [1:1 문의] [수강내역] [구매내역]
─────────────────────────────────────────
```
- 컨테이너: `flex overflow-x-auto border-b border-[var(--color-border)] md:hidden`
- 탭 버튼: `shrink-0 whitespace-nowrap px-6 py-3 text-[15px] transition-colors`
- 활성: `border-b-2 border-[var(--color-primary)] font-bold text-[var(--color-primary)]`
- 비활성: `text-[var(--color-muted)] hover:text-[var(--color-body)]`

**콘텐츠 분기**:
```typescript
{tab === "profile" && <ProfileSection />}
{tab === "inquiry" && !view && !write && <InquiryList />}
{tab === "inquiry" && view && <InquiryDetail inquiryId={view} />}
{tab === "inquiry" && write && <InquiryForm />}
{tab === "courses" && <PlaceholderSection title="수강내역" />}
{tab === "purchases" && <PlaceholderSection title="구매내역" />}
```

### 3.4 `InquiryList.tsx`

**필터 + 문의하기 버튼 영역**:
```
총 8건의 문의  [전체] [대기중(2)] [답변완료(6)]           [문의하기]
```
- 필터 버튼: `rounded-full px-3 py-1 text-sm`
- 활성 필터: `bg-[var(--color-primary)] text-white`
- 비활성 필터: `bg-[var(--color-light-bg)] text-[var(--color-muted)] hover:bg-gray-200`
- 문의하기 버튼: `rounded-lg bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white`
- 아이콘: `Plus` (lucide-react)

**Desktop 테이블** (CourseTable 패턴):
```
┌────┬──────────┬──────────────────────┬──────────┬────────────┐
│ No │ 카테고리  │ 제목                  │ 작성일    │ 상태        │
├────┼──────────┼──────────────────────┼──────────┼────────────┤
│ 8  │ 강의     │ 강의 환불 절차 문의..  │ 2026-03-14│ [대기중]   │
│ 7  │ 결제     │ 결제 오류가 발생..    │ 2026-03-12│ [답변완료]  │
│ 6  │ 기타     │ 수료증 발급 방법을..  │ 2026-03-10│ [답변완료]  │
└────┴──────────┴──────────────────────┴──────────┴────────────┘
```

테이블 규격:
- 컨테이너: `hidden md:block overflow-x-auto`
- `<table>`: `w-full table-fixed text-sm`
- `<colgroup>`: No(8%), 카테고리(12%), 제목(45%), 작성일(18%), 상태(17%)
- `<thead>`: `bg-[var(--color-light-bg)]`
- `<th>`: `px-4 py-3 text-left font-medium text-[var(--color-muted)]` (제목만 left, 나머지 center)
- `<tr>`: `border-b border-[var(--color-border)] cursor-pointer transition-colors hover:bg-[var(--color-light-bg)]`
- 제목 셀: `truncate font-medium text-[var(--color-dark)]`
- 행 클릭: `/mypage?tab=inquiry&view={id}` 이동

**상태 뱃지**:
- 대기중: `inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600`
- 답변완료: `inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600`
- 아이콘: 대기중 `Clock`, 답변완료 `CheckCircle` (lucide-react, size=12)

**Mobile 카드** (CourseTable 모바일 패턴):
```
┌─────────────────────────────┐
│ [대기중]  강의                │  상태뱃지 + 카테고리
│ 강의 환불 절차 문의드립니다    │  제목 (line-clamp-1)
│ 2026-03-14                   │  작성일
└─────────────────────────────┘
```
- 컨테이너: `space-y-3 md:hidden`
- 카드: `rounded-xl border border-[var(--color-border)] bg-white p-4 cursor-pointer transition-colors hover:border-[var(--color-primary)]/30`
- 클릭: 상세 이동

**빈 상태** (필터 결과 없을 때):
```
해당하는 문의가 없습니다
문의하기 버튼을 눌러 새 문의를 작성해보세요
```

### 3.5 `InquiryDetail.tsx`

```
← 목록으로                              [답변완료]

강의 환불 절차 문의드립니다
카테고리: 강의  |  작성일: 2026-03-14

┌─────────────────────────────────────────────────┐
│ Q                                                │
│                                                  │
│ 안녕하세요. 수강 중인 '세무회계 실무' 강의를        │
│ 환불하고 싶은데 절차가 어떻게 되나요?               │
│ 수강 시작한 지 3일 되었습니다.                      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐  ← status=answered일 때만
│ A  BIZSCHOOL 고객센터  |  2026-03-15              │
│                                                  │
│ 안녕하세요, BIZSCHOOL입니다. 수강 시작 후 7일       │
│ 이내에는 전액 환불이 가능합니다...                   │
└─────────────────────────────────────────────────┘
```

**스타일 규격**:
- 뒤로가기: `flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-dark)]` + `ArrowLeft` 아이콘
- 제목: `text-xl font-bold text-[var(--color-dark)]`
- 메타: `text-sm text-[var(--color-muted)]`
- 질문 박스: `rounded-2xl border border-[var(--color-border)] bg-white p-6`
- Q 라벨: `text-lg font-bold text-[var(--color-primary)]`
- 답변 박스: `rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6`
- A 라벨: `text-lg font-bold text-emerald-600`
- 대기중 안내: `rounded-2xl bg-[var(--color-light-bg)] p-6 text-center text-[var(--color-muted)]`
  - 내용: "답변 대기 중입니다. 빠른 시일 내에 답변 드리겠습니다."

**존재하지 않는 ID**:
- `router.push("/mypage?tab=inquiry")` 로 리다이렉트

### 3.6 `InquiryForm.tsx`

```
← 목록으로

1:1 문의하기

카테고리 *
┌──────────────────────────────────┐
│ 카테고리를 선택해주세요       ▼    │
└──────────────────────────────────┘

제목 *
┌──────────────────────────────────┐
│                                  │
└──────────────────────────────────┘

내용 *
┌──────────────────────────────────┐
│                                  │
│                                  │
│                                  │
│                                  │
└──────────────────────────────────┘

            [취소]  [문의 등록]
```

**폼 필드 스타일**:
- `<label>`: `text-sm font-medium text-[var(--color-dark)]` + `<span className="text-[var(--color-red)]"> *</span>`
- `<select>`: `w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-body)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]`
- `<input>`: 동일한 스타일
- `<textarea>`: 동일한 스타일 + `min-h-[160px] resize-none`
- 취소 버튼: `rounded-lg border border-[var(--color-border)] px-6 py-2.5 text-sm font-medium text-[var(--color-body)] hover:bg-[var(--color-light-bg)]`
- 등록 버튼: `rounded-lg bg-[var(--color-primary)] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50`

**폼 동작**:
1. 필수 필드 미입력 시 등록 버튼 disabled
2. 등록 시 Mock: `mockInquiries` 배열 앞에 추가 (클라이언트 상태)
3. 등록 완료 후 목록으로 이동 (`/mypage?tab=inquiry`)
4. 취소 시 목록으로 이동

### 3.7 `ProfileSection.tsx`

```
┌──────────────────────────────────────────┐
│                                          │
│  내 정보                                  │
│                                          │
│  ┌──────┐  김비즈                         │
│  │ 이니셜 │  biz@bizschool.co.kr          │
│  └──────┘  가입일: 2025-11-15            │
│                                          │
│  ─────────────────────────────────────   │
│                                          │
│  이름       김비즈                        │
│  이메일     biz@bizschool.co.kr           │
│  가입일     2025년 11월 15일              │
│                                          │
└──────────────────────────────────────────┘
```

- 카드: `rounded-2xl border border-[var(--color-border)] bg-white p-8`
- 정보 행: `flex items-center py-3 border-b border-[var(--color-border)] last:border-0`
- 라벨: `w-24 shrink-0 text-sm font-medium text-[var(--color-muted)]`
- 값: `text-sm text-[var(--color-dark)]`

### 3.8 `MypagePagination.tsx`

CommunityPagination과 동일한 패턴이나, URL 베이스가 다름:
- 기존: `/community?tab=${tab}&page=${page}`
- 마이페이지: `/mypage?tab=inquiry&filter=${filter}&page=${page}`

Props:
```typescript
interface MypagePaginationProps {
  currentPage: number;
  totalPages: number;
  currentFilter: InquiryFilter;
}
```

### 3.9 Header 수정 (`Header.tsx`)

Mock 로그인 상태를 시뮬레이션:
- `isLoggedIn` 상수를 `true`로 설정
- 기존 "로그인" 링크를 "마이페이지" 링크로 교체

변경 사항:
```typescript
// Before
<Link href="/login">
  <LogIn size={18} />
  <span>로그인</span>
</Link>

// After (Mock: isLoggedIn = true)
<Link href="/mypage">
  <UserCircle size={18} />
  <span>마이페이지</span>
</Link>
```

아이콘 변경: `LogIn` → `UserCircle` (lucide-react)

---

## 4. Page Layout

### 4.1 Desktop Layout

```
max-w-[1200px] mx-auto px-4 py-8

┌──────────────────────────────────────────────────────────┐
│  마이페이지                                               │ text-2xl font-bold
│                                                          │
│  ┌──── 240px ────┐  ┌──────── flex-1 ────────────────┐  │
│  │               │  │                                │  │
│  │  Sidebar      │  │  Content                       │  │
│  │               │  │                                │  │
│  │               │  │                                │  │
│  └───────────────┘  └────────────────────────────────┘  │
│                                                          │
│  gap-8 between sidebar and content                       │
└──────────────────────────────────────────────────────────┘
```

- 컨테이너: `mx-auto max-w-[1200px] px-4 py-8`
- 페이지 제목: `text-2xl font-bold text-[var(--color-dark)] mb-6`
- Flex 레이아웃: `flex gap-8`
- 사이드바: `hidden md:block w-[240px] shrink-0`
- 콘텐츠: `min-w-0 flex-1`

### 4.2 Mobile Layout

```
mx-auto px-4 py-6

┌─────────────────────────────────┐
│  마이페이지                      │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 아바타  김비즈             │  │ 프로필 카드 (컴팩트)
│  │        biz@bizschool..    │  │
│  └───────────────────────────┘  │
│                                 │
│  [내정보][1:1문의][수강][구매]    │ 탭 메뉴 (md:hidden)
│  ─────────────────────────────  │
│                                 │
│  Content                        │
│                                 │
└─────────────────────────────────┘
```

- 모바일 프로필: `flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-white p-4 md:hidden`
- 아바타(소): `h-12 w-12`
- 탭 메뉴: CommunityTabs 패턴 (border-b, overflow-x-auto)

---

## 5. State Management

### 5.1 서버 상태 (URL searchParams)

| Param | Type | Default | Usage |
|-------|------|---------|-------|
| `tab` | MypageTab | `"profile"` | 탭 선택 |
| `filter` | InquiryFilter | `"all"` | 문의 필터 |
| `page` | number | `1` | 페이지네이션 |
| `view` | number | - | 문의 상세 ID |
| `write` | `"true"` | - | 문의 작성 모드 |

### 5.2 클라이언트 상태 (useState)

| Component | State | Type | Usage |
|-----------|-------|------|-------|
| `MypageContent` | `inquiries` | `Inquiry[]` | Mock 데이터 (작성 시 추가) |
| `InquiryForm` | `category` | `InquiryCategory \| ""` | 선택한 카테고리 |
| `InquiryForm` | `title` | `string` | 입력한 제목 |
| `InquiryForm` | `content` | `string` | 입력한 내용 |

---

## 6. Implementation Order

| Step | File | Description | Depends On |
|------|------|-------------|------------|
| 1 | `types/index.ts` | MockUser, Inquiry, MypageTab 등 타입 추가 | - |
| 2 | `data/mypage.ts` | Mock 사용자 + 문의 데이터 | Step 1 |
| 3 | `app/mypage/page.tsx` | 페이지 라우트 + 레이아웃 | Step 1 |
| 4 | `components/mypage/MypageSidebar.tsx` | 사이드바 | Step 2 |
| 5 | `components/mypage/ProfileSection.tsx` | 내 정보 섹션 | Step 2 |
| 6 | `components/mypage/MypageContent.tsx` | 콘텐츠 래퍼 + 탭 분기 | Step 4, 5 |
| 7 | `components/mypage/InquiryList.tsx` | 문의 목록 + 필터 | Step 2 |
| 8 | `components/mypage/InquiryDetail.tsx` | 문의 상세 | Step 2 |
| 9 | `components/mypage/InquiryForm.tsx` | 문의 작성 폼 | Step 2 |
| 10 | `components/mypage/MypagePagination.tsx` | 페이지네이션 | Step 7 |
| 11 | `components/layout/Header.tsx` | 마이페이지 링크 추가 | Step 3 |
| 12 | `components/layout/LayoutContent.tsx` | SearchBar 숨김 조건 추가 (/mypage) | Step 3 |

---

## 7. Accessibility

| Element | Requirement |
|---------|-------------|
| 탭 메뉴 | `role="tablist"`, `role="tab"`, `aria-selected` |
| 상태 뱃지 | 시각적 표시 + 텍스트 레이블 동시 제공 |
| 폼 필드 | `<label>` 연결, 필수 표시 (`aria-required`) |
| 테이블 | 시맨틱 `<table>`, `<thead>`, `<tbody>` |
| 페이지네이션 | `aria-label="페이지 이동"`, `aria-current="page"` |
| 목록 클릭 | `cursor-pointer`, hover 상태 시각적 표시 |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-14 | Initial design - 컴포넌트 아키텍처, 데이터 모델, UI 규격 정의 | Allen |
