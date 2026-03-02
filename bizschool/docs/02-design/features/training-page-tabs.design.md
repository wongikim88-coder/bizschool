# Design: training-page-tabs

> 근로자 주도훈련 페이지 UI 개선 및 탭 분리 — 상세 설계

## 1. 컴포넌트 구조

### 1.1 전체 레이아웃

```
/training (page.tsx) — Server Component
├── Hero Section (탭 외부, 항상 표시)
├── TrainingPageContent (Client Component, 신규)
│   ├── 탭 네비게이션 바
│   ├── [탭1] "중소기업 근로자 주도훈련"
│   │   └── ProgramGuide
│   └── [탭2] "과정소개 및 교육일정"
│       ├── CourseIntro
│       ├── TrainingMonthSelector
│       └── CourseTable
```

### 1.2 파일 목록

| 파일 | 구분 | 역할 |
|------|------|------|
| `src/app/training/page.tsx` | 수정 | Hero + TrainingPageContent 배치 |
| `src/components/training/TrainingPageContent.tsx` | **신규** | 탭 상태 관리 + 탭별 콘텐츠 렌더링 (Client) |
| `src/components/training/ProgramGuide.tsx` | 수정 | 박스 높이 통일, 제출서류 수정 |
| `src/components/training/CourseIntro.tsx` | 변경없음 | — |
| `src/components/training/TrainingMonthSelector.tsx` | 변경없음 | — |

## 2. 상세 설계

### 2.1 TrainingPageContent.tsx (신규)

```tsx
"use client";

// 탭 정의
type TrainingTab = "guide" | "course";

const tabs = [
  { key: "guide", label: "중소기업 근로자 주도훈련" },
  { key: "course", label: "과정소개 및 교육일정" },
] as const;

// Props: 탭2에 필요한 서버 데이터를 props로 전달받음
interface TrainingPageContentProps {
  currentYear: number;
  currentMonth: number;
  filteredCourses: EducationCourse[];
}
```

**탭 상태 관리**: `useState`로 클라이언트 state 관리 (URL param 사용하지 않음)

**탭 UI 스타일**: 기존 `CommunityTabs.tsx` 패턴 동일 적용
- `role="tablist"`, `role="tab"`, `aria-selected`
- 활성 탭: `border-b-2 border-[var(--color-primary)] font-bold text-[var(--color-primary)]`
- 비활성 탭: `text-[var(--color-muted)] hover:text-[var(--color-body)]`
- 탭 바 위치: Hero 바로 아래, `max-w-[1200px] mx-auto px-4`

**탭별 콘텐츠 렌더링**:
- `guide` 탭: `<ProgramGuide />`
- `course` 탭: `<CourseIntro />` + `<TrainingMonthSelector />` + `<CourseTable />`

### 2.2 page.tsx 수정

**변경 전**:
```
Hero → ProgramGuide → CourseIntro → 교육일정(MonthSelector + CourseTable)
```

**변경 후**:
```
Hero → TrainingPageContent(탭 포함)
  ├── [탭1] ProgramGuide
  └── [탭2] CourseIntro + MonthSelector + CourseTable
```

- Hero 섹션은 기존 코드 유지
- Hero 아래에 `<TrainingPageContent>` 배치
- `filteredCourses`, `currentYear`, `currentMonth`를 props로 전달

### 2.3 ProgramGuide.tsx 수정

#### 2.3.1 4단계 프로세스 박스 높이 통일

**현재**: 각 카드가 내용 길이에 따라 높이가 다름
```tsx
<div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
```

**변경**: `min-h`를 추가하고, flex column + justify-between으로 내부 정렬
```tsx
<div className="flex min-h-[220px] flex-col rounded-2xl border border-[var(--color-border)] bg-white p-6">
```

- `min-h-[220px]`: 가장 긴 카드(3개 항목) 기준으로 최소 높이 설정
- `flex flex-col`: 내부 요소 세로 배치
- CSS Grid의 `grid-cols-4`가 이미 너비를 동일하게 맞추므로, 높이만 통일하면 됨

#### 2.3.2 필수 제출서류 수정

**현재 데이터**:
```tsx
const requiredDocs = [
  "근로자 훈련 참여 사업주확인서",      // 삭제
  "근로자 훈련 참여 훈련기관 확인서",    // 삭제
  "훈련비 납입 영수증",                  // 유지
  "훈련 수료증",                         // 유지
];
```

**변경 후 데이터**:
```tsx
const requiredDocs = [
  "훈련비 납입 영수증",
  "훈련 수료증",
];
```

**아이콘 변경**:

현재: 숫자가 든 파란색 원형 배지
```tsx
<div className="flex h-8 w-8 ... rounded-full bg-[var(--color-primary)] ...">
  {idx + 1}
</div>
```

변경 후: 초록색 CheckCircle 아이콘 (lucide-react)
```tsx
<CheckCircle size={24} className="shrink-0 text-emerald-500" />
```

- 기존 `CheckCircle`은 이미 import되어 있음 (`lucide-react`)
- 숫자 배지 `div` → `CheckCircle` 컴포넌트로 교체

## 3. 구현 순서

| 순서 | 작업 | 파일 |
|------|------|------|
| 1 | `TrainingPageContent.tsx` 생성 (탭 상태 + 렌더링) | 신규 |
| 2 | `page.tsx` 수정 (Hero + TrainingPageContent) | 수정 |
| 3 | `ProgramGuide.tsx` 수정 (박스 높이 + 서류) | 수정 |

## 4. 검증 기준

| # | 항목 | 검증 방법 |
|---|------|-----------|
| 1 | 탭 2개 표시 | "중소기업 근로자 주도훈련", "과정소개 및 교육일정" 탭이 Hero 아래에 보임 |
| 2 | 기본 탭 | 페이지 진입 시 "중소기업 근로자 주도훈련" 탭이 활성 |
| 3 | 탭 전환 | 탭 클릭 시 해당 콘텐츠로 전환, Hero는 유지 |
| 4 | 4단계 박스 높이 | 4개 프로세스 박스의 높이가 동일 |
| 5 | 필수 서류 2개 | "훈련비 납입 영수증", "훈련 수료증"만 표시 |
| 6 | 초록 체크 아이콘 | 숫자 대신 초록색 CheckCircle 아이콘 표시 |
| 7 | 반응형 | 모바일/태블릿에서 탭이 정상 동작 |
