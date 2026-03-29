# Design: 강의 상세페이지 (lecture-detail-page)

> Plan 문서: `docs/01-plan/features/lecture-detail-page.plan.md`

## 1. 타입 정의

### 1.1 LectureDetail (src/types/index.ts 에 추가)

```typescript
// ── 강의 상세페이지 (수강 전 랜딩) ──

export type LectureLevel = "입문" | "초급" | "중급" | "고급";

export interface LectureReview {
  reviewer: string;
  rating: number;
  date: string;
  content: string;
}

export interface LectureFaq {
  question: string;
  answer: string;
}

export interface LectureInstructor {
  name: string;
  bio: string;
  profileImage?: string;
}

export interface LectureCurriculumItem {
  title: string;
  duration: string;
}

export interface LectureDetail {
  id: string;
  title: string;
  description: string;
  categories: { main: string; sub: string }[];
  tags: string[];
  learningPoints: string[];
  targetAudience: string[];
  detail: string;
  curriculum: LectureCurriculumItem[];
  instructor: LectureInstructor;
  price: number;
  originalPrice?: number;
  discountRate?: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
  totalDuration: string;
  lessonCount: number;
  level: LectureLevel;
  updatedAt: string;
  reviews: LectureReview[];
  faqs: LectureFaq[];
}

export type LectureTab = "intro" | "curriculum" | "reviews" | "faq";
```

## 2. 파일 구조 및 컴포넌트 트리

```
src/
├── app/lectures/[id]/page.tsx              # Server Component (metadata + data fetch)
├── components/lectures/
│   └── LectureDetailContent.tsx            # Client Component (메인 레이아웃)
└── data/lectures.ts                        # Mock 데이터
```

### 컴포넌트 트리
```
page.tsx (Server)
  └── LectureDetailContent (Client)
        ├── HeroSection          (히어로 영역 - inline)
        ├── TabNavigation        (Sticky 탭 - inline)
        ├── MainContent (좌측)
        │   ├── IntroSection     (강의소개)
        │   ├── CurriculumSection(커리큘럼)
        │   ├── ReviewsSection   (리뷰)
        │   └── FaqSection       (FAQ)
        ├── Sidebar (우측, lg 이상)
        └── MobileStickyBar (모바일)
```

> 단일 Client Component(`LectureDetailContent.tsx`) 안에서 섹션별 inline 렌더링.
> 컴포넌트 수를 최소화하여 파일 bloat 방지.

## 3. 컴포넌트 상세 설계

### 3.1 page.tsx (Server Component)

```typescript
// Props
interface LecturePageProps {
  params: Promise<{ id: string }>;
}

// 역할:
// - generateMetadata: title, description SEO
// - lectures mock data에서 id로 조회
// - notFound() 처리
// - LectureDetailContent에 lecture prop 전달
```

### 3.2 LectureDetailContent.tsx (Client Component)

**Props:**
```typescript
interface LectureDetailContentProps {
  lecture: LectureDetail;
}
```

**State:**
```typescript
const [activeTab, setActiveTab] = useState<LectureTab>("intro");
const [expandedFaqs, setExpandedFaqs] = useState<Set<number>>(new Set());
```

**Refs (IntersectionObserver용):**
```typescript
const introRef = useRef<HTMLDivElement>(null);
const curriculumRef = useRef<HTMLDivElement>(null);
const reviewsRef = useRef<HTMLDivElement>(null);
const faqRef = useRef<HTMLDivElement>(null);
```

## 4. 섹션별 UI 명세

### 4.1 히어로 영역

```
┌──────────────────────────────────────────────────────────────┐
│ bg: var(--color-dark-navy) → gradient to var(--color-dark-deep)│
│                                                               │
│ max-w-[1200px] mx-auto px-4 py-10 md:py-14                   │
│                                                               │
│ [카테고리: 세무 > 법인세]  ← breadcrumb (text-white/60)       │
│                                                               │
│ 강의 제목                  ← h1, text-2xl md:text-3xl, white  │
│ 강의 소개 (2줄 제한)       ← text-sm md:text-base, white/70   │
│                                                               │
│ ★ 4.8(234) · 수강생 1,200명 · 총 24개 수업 · 입문            │
│                                                               │
│ 강사: 김세무                                                   │
│                                                               │
│ #세금신고  #연말정산  #법인세                                    │
└──────────────────────────────────────────────────────────────┘
```

**세부:**
- 배경: `bg-gradient-to-br from-[var(--color-dark-navy)] to-[var(--color-dark-deep)]`
- 카테고리: 슬래시(/) 구분, `text-white/60`
- 제목: `text-2xl md:text-3xl font-bold text-white`
- 설명: `line-clamp-2 text-white/70`
- 메타 정보: `flex items-center gap-3 text-sm text-white/60`
  - 별점: 노란 별 아이콘 + rating + (reviewCount)
  - 수강생: Users 아이콘 + studentCount
  - 수업 수: BookOpen 아이콘 + lessonCount개
  - 레벨: Signal 아이콘 + level
- 태그: `text-white/50` #태그 나열

### 4.2 Sticky 탭 네비게이션

```
┌──────────────────────────────────────────────────────────────┐
│ sticky top-0 z-30 bg-white border-b                          │
│ max-w-[1200px] mx-auto                                       │
│                                                               │
│ [강의소개]  [커리큘럼(24)]  [리뷰(234)]  [수강전 FAQ]          │
│  ^^^^^^^^ active: border-b-2 border-primary, font-bold        │
└──────────────────────────────────────────────────────────────┘
```

**동작:**
- 탭 클릭 → 해당 섹션 `scrollIntoView({ behavior: "smooth" })`
- IntersectionObserver로 뷰포트 내 섹션 감지 → activeTab 자동 업데이트
- `threshold: 0.3`, rootMargin: `-80px 0px 0px 0px` (탭 높이 고려)

### 4.3 본문 레이아웃 (2-column)

```
max-w-[1200px] mx-auto px-4 py-8
flex gap-8

┌─────────────────────────┐ ┌──────────────────┐
│ 좌측 메인 콘텐츠 (flex-1) │ │ 우측 사이드바 (w-[340px]) │
│ min-w-0                  │ │ hidden lg:block    │
│                          │ │ sticky top-[60px]  │
│ [IntroSection]           │ │                    │
│ [CurriculumSection]      │ │ 썸네일 placeholder  │
│ [ReviewsSection]         │ │ 가격               │
│ [FaqSection]             │ │ [수강신청] 버튼     │
│                          │ │ 강의 요약 정보      │
│                          │ │ [찜] [공유]         │
└─────────────────────────┘ └──────────────────┘
```

### 4.4 IntroSection (강의소개)

```
ref={introRef} id="intro"

┌─ 이 강의에서 배우는 것들 ─────────────────────────┐
│ ✓ 세무회계 기초 이론 완전 정복                      │
│ ✓ 부가가치세 신고서 작성 실무                       │
│ ✓ 원천징수 실무와 급여 관리                         │
│ ✓ 종합소득세 신고 완벽 대비                         │
└─────────────────────────────────────────────────┘

┌─ 이런 분들께 추천해요 ──────────────────────────┐
│ → 세무회계 실무를 처음 시작하는 분                   │
│ → 개인사업자로 직접 세금 신고를 해야 하는 분          │
│ → 경리/회계 부서 신입 실무자                        │
└─────────────────────────────────────────────────┘

┌─ 강의 상세정보 ────────────────────────────────┐
│ (courseDetail 전체 텍스트)                       │
│ white-space: pre-line으로 줄바꿈 보존             │
└─────────────────────────────────────────────────┘
```

**아이콘:**
- 배우는 것들: `CircleCheck` (lucide) + `text-[var(--color-primary)]`
- 추천 대상: `ChevronRight` (lucide) + `text-[var(--color-primary)]`

### 4.5 CurriculumSection (커리큘럼)

```
ref={curriculumRef} id="curriculum"

섹션 헤더: "커리큘럼" + "총 N개 수업 · 총 HH시간 MM분"

┌─────────────────────────────────────────────┐
│  1  수업 1: 세무회계란?              12:30   │
│  2  수업 2: 세금의 종류와 체계        15:42   │
│  3  수업 3: 부가가치세 기초           18:20   │
│  ...                                         │
└─────────────────────────────────────────────┘
```

- 번호: `text-[var(--color-muted)]` 원형 배경 또는 숫자
- 제목: `text-[var(--color-dark)]`
- 시간: `text-[var(--color-muted)]` 우측 정렬
- `Play` 아이콘 (잠금 표시, 미수강)
- 구분선: `divide-y`

### 4.6 ReviewsSection (리뷰)

```
ref={reviewsRef} id="reviews"

┌─ 수강생 리뷰 (234) ────────────────────────────┐
│                                                  │
│  ┌── 평균 평점 ──┐                               │
│  │  ★★★★★  4.8  │  총 234개 리뷰               │
│  └───────────────┘                               │
│                                                  │
│  ┌── 리뷰 1 ──────────────────────┐             │
│  │ 홍길동 · ★★★★★ · 2026.03.15  │             │
│  │ 세무 실무에 대해 체계적으로...    │             │
│  └────────────────────────────────┘             │
│  ┌── 리뷰 2 ──────────────────────┐             │
│  │ ...                             │             │
│  └────────────────────────────────┘             │
└──────────────────────────────────────────────────┘
```

- 평균 평점: 큰 숫자 + StarRating 컴포넌트 (books/[id] 패턴 재사용)
- 개별 리뷰: `divide-y`, 리뷰어명, 별점, 날짜, 내용

### 4.7 FaqSection (수강전 FAQ)

```
ref={faqRef} id="faq"

┌─ 수강전 FAQ ───────────────────────────────────┐
│                                                  │
│ ▸ 수강 기한이 있나요?                             │
│   (접힌 상태)                                    │
│                                                  │
│ ▾ 환불 규정은 어떻게 되나요?                      │
│   결제 후 7일 이내, 강의 진도율 10% 미만일 경우... │
│                                                  │
│ ▸ 수료증이 발급되나요?                            │
│                                                  │
└──────────────────────────────────────────────────┘
```

- 아코디언: 클릭 시 열림/닫힘 (expandedFaqs state)
- 아이콘: `ChevronDown` (회전 애니메이션)
- 열린 상태: `bg-[var(--color-light-bg)]` 배경

### 4.8 Sidebar (데스크톱 우측)

```
┌─────────────────────────────────┐
│  ┌───────────────────────┐      │
│  │  썸네일 placeholder    │      │
│  │  (aspect-video)       │      │
│  └───────────────────────┘      │
│                                  │
│  ₩55,000                 (bold) │
│  정가: ₩77,000 (30% 할인)       │
│                                  │
│  ┌──────────────────────────┐   │
│  │    수강신청하기            │   │
│  └──────────────────────────┘   │
│  bg-primary, text-white, w-full  │
│                                  │
│  ─────── 구분선 ──────────      │
│                                  │
│  📚 총 N개 수업                  │
│  ⏱ 총 수업시간 HH시간 MM분      │
│  📊 난이도: 입문                 │
│  📅 수강기한: 무제한              │
│  📜 수료증 발급                  │
│                                  │
│  ─────── 구분선 ──────────      │
│                                  │
│  [♡ 찜하기]  [↗ 공유하기]        │
│  half-width buttons              │
└─────────────────────────────────┘
```

- `sticky top-[60px]` (탭 높이 고려)
- `w-[340px]` 고정 너비
- 그림자: `rounded-2xl border border-gray-200 shadow-sm`
- 수강신청 버튼: `bg-[var(--color-primary)] text-white rounded-xl py-3.5 font-bold`

### 4.9 MobileStickyBar (모바일 하단)

```
┌──────────────────────────────────────────────┐
│ fixed bottom-0 left-0 right-0 z-40           │
│ lg:hidden                                     │
│ bg-white border-t shadow-lg                   │
│ px-4 py-3 flex items-center gap-3             │
│                                               │
│  ₩55,000            [수강신청하기]             │
│  (flex-1)           (flex-1, primary button)   │
└──────────────────────────────────────────────┘
```

## 5. Mock 데이터 설계 (src/data/lectures.ts)

업로드 페이지 필드를 기반으로 3개 강의:

| ID | 제목 | 카테고리 | 수업 수 |
|----|------|---------|---------|
| `lec-001` | 세무 실무 마스터클래스 | 세무 > 법인세, 소득세 | 24 |
| `lec-002` | 인사노무 핵심 실무 과정 | 인사 > 노무관리, 채용·온보딩 | 18 |
| `lec-003` | 4대보험 완전정복 | 4대보험 > 취득·상실신고, 보수총액 신고 | 12 |

각 강의에 포함:
- `learningPoints`: 3~5개
- `targetAudience`: 2~4개
- `detail`: 150~300자
- `curriculum`: lessonCount 만큼의 수업 (title + duration)
- `reviews`: 3~5개
- `faqs`: 3~4개
- `instructor`: name + bio

## 6. 구현 순서

| 순서 | 작업 | 파일 |
|------|------|------|
| 1 | 타입 추가 | `src/types/index.ts` |
| 2 | Mock 데이터 생성 | `src/data/lectures.ts` |
| 3 | 서버 컴포넌트 (라우트) | `src/app/lectures/[id]/page.tsx` |
| 4 | 클라이언트 컴포넌트 | `src/components/lectures/LectureDetailContent.tsx` |

## 7. 반응형 브레이크포인트

| 요소 | Mobile (<lg) | Desktop (lg+) |
|------|-------------|---------------|
| 히어로 | py-8, text-xl | py-14, text-3xl |
| 탭 | 가로 스크롤, text-sm | 고정, text-sm |
| 본문 | 단일 컬럼 | 2-column (flex) |
| 사이드바 | hidden | w-[340px] sticky |
| 하단 Bar | fixed bottom, 가격+버튼 | hidden |
| 리뷰 카드 | 전체 너비 | 전체 너비 |

## 8. 아이콘 매핑 (lucide-react)

| 용도 | 아이콘 | 사이즈 |
|------|--------|--------|
| 별점 | Star (fill) | 14~18 |
| 수강생 | Users | 16 |
| 수업 수 | BookOpen | 16 |
| 난이도 | Signal | 16 |
| 학습 포인트 | CircleCheck | 18 |
| 추천 대상 | ChevronRight | 18 |
| 수업 항목 | Play | 16 |
| FAQ 토글 | ChevronDown | 18 |
| 찜 | Heart | 18 |
| 공유 | Share2 | 18 |
| 시간 | Clock | 16 |
| 수료증 | Award | 16 |
| 달력 | Calendar | 16 |
| 뒤로가기 | ChevronLeft | 16 |

## 9. 접근성

- 탭 네비게이션: `role="tablist"`, `role="tab"`, `aria-selected`
- FAQ 아코디언: `aria-expanded`, `aria-controls`
- 별점: `aria-label="평점 4.8점"`
- 이미지: `alt` 텍스트
- 색상 대비: WCAG AA 기준 준수 (다크 배경 위 흰색 텍스트)
