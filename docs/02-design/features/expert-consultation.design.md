# 전문가상담 (Expert Consultation) Design Document

> **Feature**: expert-consultation
> **Plan Reference**: `docs/01-plan/features/expert-consultation.plan.md`
> **Date**: 2026-03-23
> **Status**: Draft

---

## 1. Component Architecture

### 1.1 Component Tree

```
app/community/page.tsx (Server Component) ── 기존 수정
├── components/community/CommunityTabs.tsx (Client) ── 기존 수정 (탭 추가)
├── components/community/ExpertTab.tsx (Client) ── 신규
│   ├── components/community/ExpertFilterBar.tsx (Client) ── 신규
│   │   └── 카테고리 버튼 그룹 + 검색 입력 + 정렬 토글 + 상담등록 버튼
│   ├── components/community/ExpertPostCard.tsx ── 신규
│   │   └── 상담 카드 (카테고리, 제목, 작성자, 날짜, 조회수, 답변상태)
│   └── components/community/CommunityPagination.tsx (Client) ── 기존 재사용
│
app/community/expert/[id]/page.tsx (Server Component) ── 신규
├── components/community/ExpertDetailView.tsx (Client) ── 신규
│   ├── 질문 영역 (카테고리, 제목, 메타정보, 본문)
│   └── 답변 영역 (전문가 정보, 답변 본문) 또는 미답변 안내
│
app/community/expert/write/page.tsx (Server Component) ── 신규
└── components/community/ExpertWriteForm.tsx (Client) ── 신규
    └── 카테고리 선택, 제목 입력, 본문 입력, 등록/취소 버튼
```

### 1.2 Component Responsibilities

| Component | Type | File | Responsibility |
|-----------|------|------|----------------|
| `community/page.tsx` | Server | 기존 수정 | searchParams에 `expert` 탭 + `category`, `search`, `sort` 파싱 추가 |
| `CommunityTabs.tsx` | Client | 기존 수정 | communityTabs에 "전문가상담" 탭 표시 |
| `ExpertTab.tsx` | Client | 신규 | 필터/검색/정렬 적용 후 목록 렌더링, 페이지네이션 |
| `ExpertFilterBar.tsx` | Client | 신규 | 카테고리 필터 버튼 + 검색 입력 + 정렬 토글 + 상담등록 버튼 (통합 바) |
| `ExpertPostCard.tsx` | - | 신규 | 상담 1건의 카드 UI (카테고리 뱃지, 제목, 메타, 답변상태) |
| `expert/[id]/page.tsx` | Server | 신규 | 상담 ID로 데이터 조회, metadata 생성, 상세뷰 렌더링 |
| `ExpertDetailView.tsx` | Client | 신규 | 질문+답변 상세 표시, 목록으로 돌아가기 |
| `expert/write/page.tsx` | Server | 신규 | 상담 등록 페이지 라우트 |
| `ExpertWriteForm.tsx` | Client | 신규 | 등록 폼 (카테고리, 제목, 본문), 유효성 검증, 등록 처리 |

### 1.3 신규 파일 목록

```
신규 생성:
├── src/types/index.ts                              # 타입 추가 (기존 파일 수정)
├── src/data/expert-consultation.ts                  # Mock 데이터
├── src/components/community/ExpertTab.tsx            # 목록 탭
├── src/components/community/ExpertFilterBar.tsx      # 필터+검색+정렬 통합 바
├── src/components/community/ExpertPostCard.tsx       # 상담 카드
├── src/components/community/ExpertDetailView.tsx     # 상세 뷰
├── src/components/community/ExpertWriteForm.tsx      # 등록 폼
├── src/app/community/expert/[id]/page.tsx            # 상세 라우트
└── src/app/community/expert/write/page.tsx           # 등록 라우트

기존 수정:
├── src/types/index.ts                               # CommunityTab에 "expert" 추가
├── src/data/community.ts                            # communityTabs에 탭 추가, getShuffledFeed 수정
├── src/app/community/page.tsx                       # ExpertTab import 및 렌더링 추가
└── src/components/community/CommunityTabs.tsx       # (자동 반영 - communityTabs 데이터 변경으로)
```

---

## 2. Data Model

### 2.1 Type Definitions (`types/index.ts` 추가)

```typescript
// ── 전문가상담 ──

export interface ExpertConsultation {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;               // MY상담 필터용 (마스킹된 ID)
  category: ExpertConsultationCategory;
  createdAt: string;              // "2026.03.23" 형식
  viewCount: number;
  status: "pending" | "answered";
  answer?: ExpertAnswer;
}

export interface ExpertAnswer {
  id: string;
  expertName: string;
  expertTitle: string;            // "세무사", "공인회계사", "노무사", "인사노무사"
  content: string;
  answeredAt: string;             // "2026.03.23" 형식
}

export type ExpertConsultationCategory = "회계" | "세무" | "노무" | "인사";

export type ExpertSortOption = "latest" | "views";
```

### 2.2 CommunityTab 타입 수정

```typescript
// 변경 전
export type CommunityTab = "home" | "questions" | "cases" | "discussion";

// 변경 후
export type CommunityTab = "home" | "questions" | "expert" | "cases" | "discussion";
```

### 2.3 Mock Data (`data/expert-consultation.ts`)

```typescript
import type { ExpertConsultation, ExpertConsultationCategory } from "@/types";

export const EXPERT_POSTS_PER_PAGE = 10;

export const expertCategories: { key: ExpertConsultationCategory | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "회계", label: "회계" },
  { key: "세무", label: "세무" },
  { key: "노무", label: "노무" },
  { key: "인사", label: "인사" },
];

export const expertConsultations: ExpertConsultation[] = [
  // 25~30건의 Mock 데이터
  // 카테고리별 균등 배분 (회계 7, 세무 8, 노무 6, 인사 6 등)
  // status: 약 70% answered, 30% pending
  // 세무 관련 실무 질문 위주 (부가세, 법인세, 급여, 4대보험 등)
];

// 상담 조회 헬퍼 함수
export function getExpertConsultationById(id: string): ExpertConsultation | undefined {
  return expertConsultations.find((c) => c.id === id);
}
```

데이터 규모: **27건** (카테고리별 균등 배분)

---

## 3. Page & Routing Design

### 3.1 community/page.tsx 수정사항

```typescript
// searchParams 확장
searchParams: Promise<{
  tab?: string;
  page?: string;
  category?: string;   // 신규: 전문가상담 카테고리 필터
  search?: string;     // 신규: 전문가상담 검색어
  sort?: string;       // 신규: 전문가상담 정렬
}>;

// validTabs 수정
const validTabs: CommunityTab[] = ["home", "questions", "expert", "cases", "discussion"];

// ExpertTab 렌더링 추가
{tab === "expert" && (
  <Suspense>
    <ExpertTab
      page={page}
      category={params.category}
      search={params.search}
      sort={params.sort}
    />
  </Suspense>
)}
```

### 3.2 expert/[id]/page.tsx (상세 페이지)

```typescript
// Server Component
export async function generateMetadata({ params }) {
  const consultation = getExpertConsultationById(params.id);
  return {
    title: consultation
      ? `${consultation.title} - 전문가상담 - BIZSCHOOL`
      : "전문가상담 - BIZSCHOOL",
  };
}

export default async function ExpertDetailPage({ params }) {
  const { id } = await params;
  const consultation = getExpertConsultationById(id);
  if (!consultation) notFound();
  return <ExpertDetailView consultation={consultation} />;
}
```

### 3.3 expert/write/page.tsx (등록 페이지)

```typescript
// Server Component
export const metadata: Metadata = {
  title: "상담 등록 - 전문가상담 - BIZSCHOOL",
};

export default function ExpertWritePage() {
  return (
    <div className="mx-auto max-w-[800px] px-4 py-6">
      <ExpertWriteForm />
    </div>
  );
}
```

---

## 4. UI Specification

### 4.1 ExpertTab (목록 페이지)

```
┌──────────────────────────────────────────────────────┐
│ [ExpertFilterBar]                                     │
│ ┌──────────────────────────────────────────────────┐ │
│ │ [전체] [회계] [세무] [노무] [인사]   🔍[검색]     │ │
│ │                                                  │ │
│ │ 총 27개의 전문가상담  [최신순▼] [상담등록]        │ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│ ┌──────────────────────────────────────────────────┐ │
│ │ [ExpertPostCard]                                 │ │
│ │ 세무 │ 부가세 예정신고 누락 시 가산세 계산법?     │ │
│ │ 이초보 · 2026.03.22 · 조회 142    [답변완료 ✓]  │ │
│ ├──────────────────────────────────────────────────┤ │
│ │ 회계 │ 급여 분개 시 4대보험 처리 방법            │ │
│ │ 김수강생 · 2026.03.21 · 조회 98   [대기중 ○]    │ │
│ ├──────────────────────────────────────────────────┤ │
│ │ ...                                              │ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│              [< 1 2 3 >]  (CommunityPagination)      │
└──────────────────────────────────────────────────────┘
```

### 4.2 ExpertFilterBar 상세

```
Row 1 (카테고리 버튼):
┌────────────────────────────────────────────────────────────────┐
│ [전체]  [회계]  [세무]  [노무]  [인사]     [🔍 검색어 입력  ] │
└────────────────────────────────────────────────────────────────┘

Row 2 (카운트 + 정렬 + 등록 버튼):
┌────────────────────────────────────────────────────────────────┐
│ 총 N개의 전문가상담           [최신순|조회순]   [✏️ 상담등록] │
└────────────────────────────────────────────────────────────────┘
```

**카테고리 버튼 스타일**:
- 선택됨: `bg-[var(--color-primary)] text-white rounded-full px-4 py-1.5 text-sm font-medium`
- 미선택: `bg-gray-100 text-[var(--color-body)] rounded-full px-4 py-1.5 text-sm hover:bg-gray-200`

**정렬 토글**:
- 2개 버튼(최신순/조회순) 토글, 선택된 항목 bold + primary color

**상담등록 버튼**:
- DiscussionTab의 "글쓰기" 버튼과 동일 스타일
- `bg-[var(--color-primary)] text-white rounded-lg px-4 py-2 text-sm font-medium`
- 클릭 시 `/community/expert/write`로 이동

### 4.3 ExpertPostCard 상세

```
┌──────────────────────────────────────────────────────────────┐
│ 세무 │ 제목 텍스트 (truncate)                      조회 142  │
│ 작성자 · 2026.03.22                       [답변완료 ✓] green │
│                                           [대기중 ○]  amber  │
└──────────────────────────────────────────────────────────────┘
```

**카테고리 표시**: 뱃지 없이 텍스트만 표시
- 스타일: `text-sm font-medium text-[var(--color-muted)]`
- 제목과 `│` 구분선 또는 공백으로 구분

**답변 상태 뱃지**:
| 상태 | 스타일 |
|------|--------|
| answered | `<CheckCircle size={12} /> 답변완료` — `text-emerald-600` |
| pending | `<Clock size={12} /> 대기중` — `text-amber-500` |

**클릭 동작**: `/community/expert/{id}` 상세 페이지로 이동

### 4.4 ExpertDetailView (상세 페이지)

```
┌──────────────────────────────────────────────────────────────┐
│ ← 목록으로                                                   │
│                                                              │
│ 세무  답변완료 ✓                                             │
│ ─────────────────────────────────────────────                │
│ 부가세 예정신고 누락 시 가산세는 어떻게 계산하나요?          │
│ ─────────────────────────────────────────────                │
│ 이초보 · 2026.03.22 · 조회 142                               │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ 질문 본문 텍스트...                                    │   │
│ │ 부가세 예정신고를 누락했는데 가산세가 어떻게           │   │
│ │ 계산되는지 궁금합니다...                               │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ 💬 전문가 답변                                         │   │
│ │ ──────────────────────────────────────────────         │   │
│ │ 박세무  세무사 · 2026.03.22                            │   │
│ │                                                        │   │
│ │ 답변 본문 텍스트...                                    │   │
│ │ 부가세 예정신고 누락에 따른 가산세는...                │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│ (status === "pending" 인 경우)                                │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ 💬 전문가 답변                                         │   │
│ │ ──────────────────────────────────────────────         │   │
│ │ 아직 답변이 등록되지 않았습니다.                       │   │
│ │ 전문가 답변을 기다려 주세요.                           │   │
│ └────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

**레이아웃**: `mx-auto max-w-[800px] px-4 py-6`

**"← 목록으로" 버튼**: `router.push('/community?tab=expert')` — 탭 상태 유지

**질문 영역**:
- 배경: `bg-white` (기본)
- 본문: `text-[var(--color-body)] text-[15px] leading-relaxed whitespace-pre-wrap`

**답변 영역**:
- 배경: `bg-[var(--color-light-bg)] rounded-lg p-6`
- 전문가 이름: `font-bold text-[var(--color-dark)]`
- 전문가 직함: `text-sm text-[var(--color-primary)] font-medium`
- 답변 본문: `text-[var(--color-body)] text-[15px] leading-relaxed whitespace-pre-wrap`

### 4.5 ExpertWriteForm (등록 페이지)

```
┌──────────────────────────────────────────────────────────────┐
│ ← 돌아가기                                                   │
│                                                              │
│ 전문가상담 등록                                              │
│ ─────────────────────────────────────────────                │
│                                                              │
│ 상담 분야 *                                                  │
│ (회계) (세무) (노무) (인사)     ← 라디오 버튼 그룹           │
│                                                              │
│ 제목 *                                                       │
│ ┌──────────────────────────────────────────────────────┐     │
│ │ 상담 제목을 입력해주세요                              │     │
│ └──────────────────────────────────────────────────────┘     │
│                                                              │
│ 내용 *                                                       │
│ ┌──────────────────────────────────────────────────────┐     │
│ │                                                      │     │
│ │ 상담 내용을 상세히 작성해주세요                      │     │
│ │                                                      │     │
│ │                                                      │     │
│ │                                              0/2000  │     │
│ └──────────────────────────────────────────────────────┘     │
│                                                              │
│                           [취소]  [등록하기]                  │
└──────────────────────────────────────────────────────────────┘
```

**카테고리 선택**: 라디오 버튼 스타일 (원형 선택자)
- 선택됨: `border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]`
- 미선택: `border-[var(--color-border)] hover:border-gray-400`

**입력 필드 스타일**:
- `w-full rounded-lg border border-[var(--color-border)] px-4 py-3 text-[15px]`
- focus: `focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none`

**본문 textarea**: `min-h-[200px] resize-y`

**글자 수 카운터**: `text-sm text-[var(--color-muted)]` 우측 하단 — 최대 2000자

**등록하기 버튼**: `bg-[var(--color-primary)] text-white rounded-lg px-6 py-2.5 font-medium`
**취소 버튼**: `border border-[var(--color-border)] text-[var(--color-body)] rounded-lg px-6 py-2.5`

**유효성 검증**:
- 카테고리 미선택 시: "상담 분야를 선택해주세요" (인라인 에러)
- 제목 미입력 시: "제목을 입력해주세요"
- 내용 미입력 시: "내용을 입력해주세요"
- 내용 2000자 초과 시: "내용은 2000자 이내로 작성해주세요"

**등록 처리** (Mock):
- 새 ExpertConsultation 객체 생성 (status: "pending")
- alert("상담이 등록되었습니다.") 후 `/community?tab=expert`로 이동

---

## 5. State Management

### 5.1 ExpertTab 상태 흐름

```
URL searchParams (Server)
  ↓
community/page.tsx가 파싱
  ↓ props
ExpertTab (category, search, sort, page)
  ↓ 필터링/정렬/페이지네이션 적용
ExpertPostCard[] 렌더링
```

**필터링 로직** (ExpertTab 내부):
```typescript
let filtered = [...expertConsultations];

// 1. 카테고리 필터
if (category && category !== "all") {
  filtered = filtered.filter((c) => c.category === category);
}

// 2. 검색 필터
if (search) {
  const keyword = search.toLowerCase();
  filtered = filtered.filter(
    (c) => c.title.toLowerCase().includes(keyword) || c.content.toLowerCase().includes(keyword)
  );
}

// 3. 정렬
if (sort === "views") {
  filtered.sort((a, b) => b.viewCount - a.viewCount);
} else {
  // 기본: 최신순 (createdAt 역순)
  filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// 4. 페이지네이션
const totalPages = Math.ceil(filtered.length / EXPERT_POSTS_PER_PAGE);
const paginated = filtered.slice((page - 1) * EXPERT_POSTS_PER_PAGE, page * EXPERT_POSTS_PER_PAGE);
```

### 5.2 ExpertFilterBar 상태 관리

```typescript
// URL 기반 상태 (router.push로 변경)
// 카테고리 변경 시: /community?tab=expert&category=세무&page=1
// 검색 시: /community?tab=expert&search=부가세&page=1
// 정렬 변경 시: /community?tab=expert&sort=views&page=1
// → 필터 변경 시 항상 page=1로 리셋
```

### 5.3 ExpertWriteForm 상태 관리

```typescript
// Client-side state (useState)
const [category, setCategory] = useState<ExpertConsultationCategory | "">("");
const [title, setTitle] = useState("");
const [content, setContent] = useState("");
const [errors, setErrors] = useState<Record<string, string>>({});
```

---

## 6. community.ts 수정사항

### 6.1 communityTabs 수정

```typescript
// 변경 전
export const communityTabs = [
  { key: "home" as const, label: "홈" },
  { key: "questions" as const, label: "강의질문" },
  { key: "cases" as const, label: "상담사례" },
  { key: "discussion" as const, label: "소통공간" },
] as const;

// 변경 후
export const communityTabs = [
  { key: "home" as const, label: "홈" },
  { key: "questions" as const, label: "강의질문" },
  { key: "expert" as const, label: "전문가상담" },
  { key: "cases" as const, label: "상담사례" },
  { key: "discussion" as const, label: "소통공간" },
] as const;
```

### 6.2 getShuffledFeed 수정

전문가상담은 홈탭 셔플 피드에 **포함하지 않음**.
- 이유: 전문가상담은 개인 질문 특성상 피드 콘텐츠와 성격이 다름
- 홈탭은 기존 3종(질문/상담사례/토론)만 유지

---

## 7. CommunityPagination 호환성

기존 `CommunityPagination`은 `currentTab: CommunityTab`을 받아 `/community?tab=${currentTab}&page=${page}`로 이동합니다.

`CommunityTab`에 `"expert"`를 추가하면 자동으로 호환됩니다.

**추가 쿼리 파라미터 보존**: CommunityPagination의 `goToPage`에서 기존 category, search, sort 파라미터가 유실되는 문제가 발생합니다.

**해결 방안**: ExpertTab에서 CommunityPagination 대신 **전문가상담 전용 페이지네이션 로직**을 ExpertFilterBar 또는 ExpertTab 내부에서 처리합니다.

```typescript
// ExpertTab 내부에서 페이지 이동 함수
const buildPageUrl = (page: number) => {
  const params = new URLSearchParams();
  params.set("tab", "expert");
  params.set("page", String(page));
  if (category && category !== "all") params.set("category", category);
  if (search) params.set("search", search);
  if (sort && sort !== "latest") params.set("sort", sort);
  return `/community?${params.toString()}`;
};
```

→ CommunityPagination에 **optional `buildUrl` prop**을 추가하여 커스텀 URL 빌더를 지원하거나, ExpertTab 전용 페이지네이션 컴포넌트를 사용합니다.

**채택 방안**: CommunityPagination에 `extraParams?: Record<string, string>` prop 추가

```typescript
// CommunityPagination 수정
interface CommunityPaginationProps {
  currentPage: number;
  totalPages: number;
  currentTab: CommunityTab;
  extraParams?: Record<string, string>;  // 신규 추가
}

const goToPage = (page: number) => {
  const params = new URLSearchParams({ tab: currentTab, page: String(page) });
  if (extraParams) {
    Object.entries(extraParams).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
  }
  router.push(`/community?${params.toString()}`);
};
```

---

## 8. Implementation Order

| 순서 | 작업 | 파일 | 의존성 |
|------|------|------|--------|
| 1 | 타입 정의 추가 | `types/index.ts` | 없음 |
| 2 | Mock 데이터 생성 | `data/expert-consultation.ts` | 1 |
| 3 | communityTabs 수정 | `data/community.ts` | 1 |
| 4 | CommunityPagination extraParams 추가 | `components/community/CommunityPagination.tsx` | 1 |
| 5 | ExpertPostCard 구현 | `components/community/ExpertPostCard.tsx` | 1 |
| 6 | ExpertFilterBar 구현 | `components/community/ExpertFilterBar.tsx` | 1 |
| 7 | ExpertTab 구현 | `components/community/ExpertTab.tsx` | 2, 4, 5, 6 |
| 8 | community/page.tsx 수정 | `app/community/page.tsx` | 3, 7 |
| 9 | ExpertDetailView 구현 | `components/community/ExpertDetailView.tsx` | 1 |
| 10 | expert/[id]/page.tsx 구현 | `app/community/expert/[id]/page.tsx` | 2, 9 |
| 11 | ExpertWriteForm 구현 | `components/community/ExpertWriteForm.tsx` | 1 |
| 12 | expert/write/page.tsx 구현 | `app/community/expert/write/page.tsx` | 11 |

---

## 9. Responsive Design

### 9.1 ExpertFilterBar 반응형

| Breakpoint | 레이아웃 |
|------------|----------|
| Mobile (<640px) | 카테고리: 가로 스크롤, 검색: 풀 너비, 정렬+등록: 풀 너비 Row |
| Tablet (640px~) | 카테고리 + 검색 한 줄, 카운트 + 정렬 + 등록 한 줄 |
| Desktop (1024px~) | 모든 요소 한 줄 또는 두 줄 |

### 9.2 ExpertPostCard 반응형

| Breakpoint | 변화 |
|------------|------|
| Mobile (<640px) | 조회수 숨김, 카테고리+제목 줄바꿈 허용 |
| Desktop (640px~) | 전체 표시 |

### 9.3 ExpertDetailView 반응형

- `max-w-[800px]` 컨테이너
- 모바일에서 패딩 축소 (`px-4` → `px-3`)

### 9.4 ExpertWriteForm 반응형

- `max-w-[800px]` 컨테이너
- 카테고리 라디오: 모바일에서 2x2 그리드, 데스크톱에서 4x1
- 버튼: 모바일에서 풀 너비 스택

---

## 10. Edge Cases

| 케이스 | 대응 |
|--------|------|
| 검색 결과 0건 | "검색 결과가 없습니다." 빈 상태 표시 |
| 잘못된 상담 ID | `notFound()` 호출 → 404 페이지 |
| 카테고리+검색 동시 적용 | 교집합 필터링 (AND 조건) |
| URL에 잘못된 category 값 | 무시하고 "전체"로 처리 |
| URL에 잘못된 sort 값 | 무시하고 "latest"로 처리 |
| 제목/내용 빈 값 등록 시도 | 인라인 유효성 에러 표시, 등록 방지 |
| 등록 폼 페이지 새로고침 | 상태 초기화 (별도 저장 없음) |
