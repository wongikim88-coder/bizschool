# Design: 근로자 주도훈련 페이지 (worker-led-training)

> Plan 참조: `docs/01-plan/features/worker-led-training.plan.md`

## 1. 파일 구조

```
src/
├── app/training/
│   └── page.tsx                            # 메인 페이지 (Server Component)
├── components/training/
│   ├── ProgramGuide.tsx                    # 프로그램 안내 (Static)
│   ├── CourseIntro.tsx                     # 과정소개 카드 (Static)
│   └── TrainingMonthSelector.tsx           # 교육일정 월 선택 (Client Component)
├── data/
│   └── training.ts                         # Mock 데이터 + 유틸리티 함수
└── components/layout/
    └── Header.tsx                          # 메뉴 항목 추가 (수정)
```

## 2. 데이터 설계

### 2-1. `src/data/training.ts`

```typescript
import type { EducationCourse } from "@/types";

// ── 과정소개 데이터 ──
export interface TrainingProgram {
  id: number;
  title: string;
  description: string;
}

export const trainingPrograms: TrainingProgram[] = [
  {
    id: 1,
    title: "건설업 세무회계",
    description: "실무상 과세쟁점 및 사례중심",
  },
  {
    id: 2,
    title: "부가가치세 신고실무",
    description: "세무조사 대비 무결점",
  },
  {
    id: 3,
    title: "양도세 실무업무",
    description: "중소기업 근로자 대상",
  },
  {
    id: 4,
    title: "법인세 신고실무",
    description: "세무조사 대비 무결점",
  },
];

// ── 교육일정 Mock 데이터 ──
// EducationCourse 타입 재사용 (types/index.ts 에 이미 정의됨)
export const YEAR_RANGE = { min: 2006, max: 2027 };

export const DEFAULT_PAGE: { year: number; month: number } | null = {
  year: 2026,
  month: 4,
};

export const trainingCourses: EducationCourse[] = [
  {
    id: 101,
    category: "중기주도훈련",
    title: "[중기주도훈련]건설업 세무회계 실무(서울)",
    dateRange: "2026-04-07 ~ 2026-04-08(월화)",
    timeRange: "09:00 ~ 17:00 (2일 14시간)",
    fee: 420000,
    instructor: "김정호 세무사",
    status: "open",
  },
  {
    id: 102,
    category: "중기주도훈련",
    title: "[중기주도훈련]세무조사 대비 무결점 부가가치세 신고실무(서울)",
    dateRange: "2026-04-14 ~ 2026-04-15(월화)",
    timeRange: "09:00 ~ 17:00 (2일 14시간)",
    fee: 420000,
    instructor: "김정호 세무사",
    status: "open",
  },
  {
    id: 103,
    category: "중기주도훈련",
    title: "[중기주도훈련]양도세 실무업무(서울)",
    dateRange: "2026-04-21 ~ 2026-04-22(월화)",
    timeRange: "09:00 ~ 17:00 (2일 14시간)",
    fee: 420000,
    instructor: "김정호 세무사",
    status: "open",
  },
  {
    id: 104,
    category: "중기주도훈련",
    title: "[중기주도훈련]세무조사 대비 무결점 법인세 신고실무(청주)",
    dateRange: "2026-04-28 ~ 2026-04-29(월화)",
    timeRange: "09:00 ~ 17:00 (2일 14시간)",
    fee: 420000,
    instructor: "김정호 세무사",
    status: "open",
  },
];

// ── 유틸리티 함수 ──
export function formatFee(fee: number): string {
  return fee.toLocaleString("ko-KR") + "원";
}
```

### 2-2. 타입 (기존 재사용)

`EducationCourse` 타입을 그대로 재사용 — 별도 타입 추가 불필요.
`TrainingProgram` 인터페이스만 `data/training.ts`에 로컬 정의.

## 3. 컴포넌트 상세 설계

### 3-1. `src/app/training/page.tsx` (Server Component)

**역할**: 페이지 메타데이터 + 섹션 조립 + searchParams 처리

```typescript
import { Suspense } from "react";
import type { Metadata } from "next";
import { trainingCourses, DEFAULT_PAGE } from "@/data/training";
import ProgramGuide from "@/components/training/ProgramGuide";
import CourseIntro from "@/components/training/CourseIntro";
import TrainingMonthSelector from "@/components/training/TrainingMonthSelector";
import CourseTable from "@/components/education/CourseTable";  // 재사용

export const metadata: Metadata = {
  title: "근로자 주도훈련 | BIZSCHOOL",
  description: "중소기업 근로자 주도훈련 90% 환급 프로그램. 과정소개 및 교육일정을 확인하세요.",
};

interface Props {
  searchParams: Promise<{ year?: string; month?: string }>;
}
```

**렌더링 구조**:
```
<div>
  <!-- Section 1: Hero -->
  <section> Hero Banner </section>

  <!-- Section 2: 프로그램 안내 -->
  <ProgramGuide />

  <!-- Section 3: 과정소개 -->
  <CourseIntro />

  <!-- Section 4: 교육일정 -->
  <div className="mx-auto max-w-[1200px] px-4 pb-16">
    <h2> 교육일정 </h2>
    <Suspense>
      <TrainingMonthSelector currentYear={year} currentMonth={month} />
    </Suspense>
    <CourseTable courses={filtered} />
  </div>
</div>
```

**데이터 필터링 로직**: `/education/page.tsx`와 동일한 패턴
- searchParams에서 year, month 추출
- `trainingCourses`를 dateRange 기반으로 필터링
- 필터된 결과를 `CourseTable`에 전달

### 3-2. `src/components/training/ProgramGuide.tsx` (Static)

**역할**: biz0701 콘텐츠 전체 — 프로그램 설명, 4단계 프로세스, 제출서류, 비용 안내

**UI 구조**:

```
<section className="mx-auto max-w-[1200px] px-4 py-16 md:py-24">
  <!-- 프로그램 설명 배너 -->
  <div> 90% 환급 안내 텍스트 </div>

  <!-- 4단계 프로세스 -->
  <div className="mt-12">
    <h2> 신청에서 환급까지, 4단계 프로세스 </h2>
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-4">
      {steps.map(step => <StepCard />)}
    </div>
  </div>

  <!-- 필수 제출서류 -->
  <div className="mt-16">
    <h3> 필수 제출서류 </h3>
    <div> 서류 목록 (numbered list with icons) </div>
    <div> 간소화 안내 (2025.12.1~) </div>
  </div>

  <!-- 인정되는 훈련비 납입 영수증 -->
  <div className="mt-12">
    <h3> 인정되는 훈련비 납입 영수증 </h3>
    <div> 4가지 유형 리스트 </div>
  </div>

  <!-- 비용 신청 및 지급 절차 -->
  <div className="mt-12">
    <h3> 비용 신청 및 지급 절차 </h3>
    <div> 경로 안내, 지급액, 지급방식 </div>
  </div>

  <!-- 교육신청 전 확인사항 -->
  <div className="mt-12">
    <h3> 교육신청 전 확인사항 </h3>
    <div> 3가지 체크리스트 </div>
  </div>

  <!-- 문의 전화 -->
  <div className="mt-12 text-center">
    문의: 02-456-9156
  </div>
</section>
```

**4단계 프로세스 스텝 카드 데이터**:
```typescript
const steps = [
  {
    step: 1,
    title: "교육 준비",
    parties: "기업 - 공단",
    icon: ClipboardCheck, // lucide-react
    items: [
      "고용24 기업회원 가입",
      "기업규모 및 우선지원대상 확인",
      "계좌 등록",
    ],
  },
  {
    step: 2,
    title: "교육 신청",
    parties: "기업 - 더존비즈스쿨",
    icon: FileText,
    items: [
      "우선지원 대상기업 확인",
      "재직근로자 대상 확인",
      "수강신청 및 교육비 납부",
    ],
  },
  {
    step: 3,
    title: "교육참여 및 수료",
    parties: "더존비즈스쿨 - 기업",
    icon: GraduationCap,
    items: [
      "교육훈련 참여",
      "수료 시 확인서/수료증 발송",
    ],
  },
  {
    step: 4,
    title: "지원금 신청",
    parties: "기업 - 공단",
    icon: Banknote,
    items: [
      "제출서류 준비",
      "고용24 통해 비용 신청",
      "사업주 납입 훈련비 90% 지급",
    ],
  },
];
```

**스텝 카드 디자인**:
- 상단: step 번호 원형 배지 (`bg-[var(--color-primary)] text-white rounded-full w-8 h-8`)
- 중간: 아이콘 + 제목 + 관계자
- 하단: 항목 리스트 (bullet)
- 데스크톱: 4열 그리드, 카드 사이 화살표 연결선 (CSS `::after` pseudo-element)
- 모바일: 1열 세로 스택, 카드 사이 세로 화살표

**제출서류 섹션 디자인**:
- `rounded-2xl border border-[var(--color-border)] bg-white p-6` 카드
- numbered circle badges (1~4)
- 간소화 안내: `bg-blue-50 border-l-4 border-[var(--color-primary)] p-4` callout 스타일

**비용 신청/지급 섹션 디자인**:
- 경로: `bg-[var(--color-light-bg)] rounded-xl p-4` 안에 단계별 경로 텍스트
- 지급액/지급방식: key-value 형태 `grid grid-cols-[auto_1fr] gap-x-4 gap-y-2`

**교육신청 전 확인사항 디자인**:
- `bg-amber-50 border border-amber-200 rounded-xl p-6` 경고 스타일 카드
- CheckCircle 아이콘 + 텍스트 리스트

### 3-3. `src/components/training/CourseIntro.tsx` (Static)

**역할**: biz0702 상단 — 4개 교육과정 소개 카드

**UI 구조**:
```
<section className="bg-[var(--color-light-bg)]">
  <div className="mx-auto max-w-[1200px] px-4 py-16 md:py-24">
    <h2> 과정소개 </h2>
    <p> 부제 </p>
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
      {trainingPrograms.map(program => <ProgramCard />)}
    </div>
  </div>
</section>
```

**카드 디자인**:
- `rounded-2xl border border-[var(--color-border)] bg-white p-6 transition-all hover:shadow-lg`
- 상단: lucide 아이콘 (Calculator, FileCheck, Building2, Landmark) `h-10 w-10 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)]`
- 제목: `text-base font-bold text-[var(--color-dark)]`
- 설명: `text-sm text-[var(--color-muted)]`

**아이콘 매핑**:
```typescript
import { Calculator, FileCheck, Building2, Landmark } from "lucide-react";

const programIcons = [Calculator, FileCheck, Building2, Landmark];
```

### 3-4. `src/components/training/TrainingMonthSelector.tsx` (Client Component)

**역할**: 교육일정 연도/월 선택 — MonthSelector와 동일 로직이나 라우트가 `/training`

**기존 MonthSelector와의 차이점**:
- `router.push()` 경로만 `/training`으로 변경
- `YEAR_RANGE`를 `@/data/training`에서 import

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { YEAR_RANGE } from "@/data/training";

interface TrainingMonthSelectorProps {
  currentYear: number;
  currentMonth: number;
}
```

**UI**: 기존 MonthSelector와 100% 동일한 마크업/스타일

### 3-5. `CourseTable` 재사용 (수정 없음)

기존 `src/components/education/CourseTable.tsx`를 그대로 import하여 사용.
- `EducationCourse[]` 타입으로 데이터 전달
- `categoryIcons`에 "중기주도훈련" 키가 없으면 기본 dot 아이콘 표시 (기존 fallback 로직)

### 3-6. `Header.tsx` 수정

**변경**: menuItems 배열에 항목 추가

```typescript
const menuItems: MenuItem[] = [
  { label: "공개교육", href: "/education" },
  { label: "근로자 주도훈련", href: "/training" },  // 추가
  { label: "강의", href: "/" },
  { label: "도서", href: "/books" },
  { label: "전문가상담", href: "/consulting" },
  { label: "커뮤니티", href: "/community" },
];
```

## 4. UI 상세 스펙

### 4-1. Hero Section

기존 공개교육/기관소개 Hero와 동일한 패턴:

```
<section className="relative overflow-hidden bg-gradient-to-br from-[#155dfc] to-[#0d3b9e] px-8 py-16 text-center md:px-16 md:py-24 lg:py-28">
  <!-- 장식 원 3개 (동일) -->
  <div className="relative z-10 mx-auto max-w-3xl">
    <h1> "근로자 주도훈련" </h1>
    <p> "사업주가 부담한 훈련비의 90%까지 환급받을 수 있는..." </p>
  </div>
</section>
```

### 4-2. 반응형 브레이크포인트

| 영역 | Mobile (<768px) | Desktop (>=768px) |
|------|-----------------|-------------------|
| 4단계 프로세스 | 1열 세로 스택 | 4열 그리드 + 화살표 |
| 과정소개 카드 | 1열 (sm:2열) | 4열 그리드 |
| 교육일정 테이블 | 카드 레이아웃 | 테이블 레이아웃 |
| 제출서류 | 1열 리스트 | 2열 그리드 |

### 4-3. 색상 팔레트 (기존 CSS variables 사용)

| 용도 | 변수 |
|------|------|
| 메인 액센트 | `var(--color-primary)` (#155dfc) |
| 배경 하이라이트 | `var(--color-primary-light)` (#eff6ff) |
| 텍스트 제목 | `var(--color-dark)` (#282c34) |
| 텍스트 본문 | `var(--color-body)` (#4a5565) |
| 텍스트 보조 | `var(--color-muted)` (#6a7282) |
| 테두리 | `var(--color-border)` (#e5e7eb) |
| 섹션 배경 | `var(--color-light-bg)` (#f8f9fa) |
| 경고/주의 배경 | `bg-amber-50` / `border-amber-200` |
| 정보 callout | `bg-blue-50` / `border-[var(--color-primary)]` |

## 5. 구현 순서 (체크리스트)

1. [ ] `src/data/training.ts` — Mock 데이터 + TrainingProgram 인터페이스 + 유틸리티
2. [ ] `src/components/training/ProgramGuide.tsx` — 프로그램 안내 전체 섹션
3. [ ] `src/components/training/CourseIntro.tsx` — 과정소개 카드 그리드
4. [ ] `src/components/training/TrainingMonthSelector.tsx` — 월 선택 (Client)
5. [ ] `src/app/training/page.tsx` — 메인 페이지 조립 + 필터링 로직
6. [ ] `src/components/layout/Header.tsx` — 메뉴 항목 추가

## 6. 의존성

- **신규 패키지**: 없음
- **재사용 컴포넌트**: `CourseTable` (education)
- **재사용 타입**: `EducationCourse` (types/index.ts)
- **lucide-react 아이콘**: ClipboardCheck, FileText, GraduationCap, Banknote, Calculator, FileCheck, Building2, Landmark, CheckCircle, Phone, ChevronRight
