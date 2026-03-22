# "내 학습" 페이지 UI 전면 개편 Design Document

> **Summary**: 마이페이지 "내 학습" 탭을 인프런 스타일 탭+카드 그리드 UI로 전면 개편하는 상세 설계
>
> **Project**: BIZSCHOOL
> **Author**: Frontend Architect
> **Date**: 2026-03-20
> **Status**: Draft
> **Plan Reference**: `docs/01-plan/features/my-learning-ui-revamp.plan.md`

---

## 1. Type Definitions

### 1.1 새로 추가하는 타입 (`src/types/index.ts`)

기존 `MyCourse` 관련 타입을 교체한다.

```typescript
// ── 내 학습 (수강내역) ── (기존 섹션 교체)

export type MyLearningTab = "courses" | "notes" | "clips" | "roadmap" | "mentoring" | "certificates";

export type CourseCategory = "온라인 강의" | "챌린지" | "모임/부트캠프";

export type CourseLearningStatus = "학습 중" | "완강";

export type CourseLearningStatusFilter = "전체" | CourseLearningStatus;

export interface MyCourse {
  id: string;
  title: string;
  thumbnailUrl: string;
  category: CourseCategory;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  learningStatus: CourseLearningStatus;
  periodLabel: string;                  // "무제한" 또는 "2025.03.01 ~ 2025.12.31"
  isReviewable?: boolean;
  isExpired?: boolean;
  instructorName?: string;
}
```

### 1.2 제거하는 타입 (`src/types/index.ts`)

```typescript
// 삭제 대상:
export type CourseGroupType = "online" | "public" | "completed";   // → CourseCategory로 대체
export type CoursePaymentStatus = "결제완료" | "미결제";            // → 카드 UI에서 불필요
```

### 1.3 영향 범위 확인

| 타입/값 | 사용 위치 | 조치 |
|---------|----------|------|
| `MyCourse` | `CoursesSection.tsx`, `mypage.ts` | 새 인터페이스로 교체 |
| `CourseGroupType` | `CoursesSection.tsx`, `mypage.ts`, `types/index.ts` | 삭제 |
| `CoursePaymentStatus` | `CoursesSection.tsx`, `mypage.ts`, `types/index.ts` | 삭제 |
| `mockMyCourses` | `CoursesSection.tsx` | 새 데이터로 교체 |

> `CourseGroupType`과 `CoursePaymentStatus`는 `CoursesSection.tsx`와 `mypage.ts`에서만 사용되므로 안전하게 제거 가능.

---

## 2. Mock Data (`src/data/mypage.ts`)

### 2.1 `mockMyCourses` 교체

기존 7개 항목을 새 인터페이스에 맞게 교체한다. 기존 강좌명을 최대한 유지하고, 새 필드를 추가한다.

```typescript
export const mockMyCourses: MyCourse[] = [
  {
    id: "mc-001",
    title: "세무회계 실무 기초",
    thumbnailUrl: "/images/courses/course-1.jpg",
    category: "온라인 강의",
    totalLessons: 24,
    completedLessons: 18,
    progressPercent: 75,
    learningStatus: "학습 중",
    periodLabel: "무제한",
    isReviewable: false,
    isExpired: false,
    instructorName: "김세무",
  },
  {
    id: "mc-002",
    title: "경영전략 핵심 노트: 전략적 사고를 위한 MBA 에센셜",
    thumbnailUrl: "/images/courses/course-2.jpg",
    category: "온라인 강의",
    totalLessons: 16,
    completedLessons: 4,
    progressPercent: 25,
    learningStatus: "학습 중",
    periodLabel: "무제한",
    isReviewable: false,
    isExpired: false,
    instructorName: "이전략",
  },
  {
    id: "mc-003",
    title: "인사노무관리 입문",
    thumbnailUrl: "/images/courses/course-3.jpg",
    category: "온라인 강의",
    totalLessons: 21,
    completedLessons: 0,
    progressPercent: 0,
    learningStatus: "학습 중",
    periodLabel: "무제한",
    isReviewable: false,
    isExpired: false,
    instructorName: "박노무",
  },
  {
    id: "mc-004",
    title: "노무관리 실무 과정",
    thumbnailUrl: "/images/courses/course-4.jpg",
    category: "모임/부트캠프",
    totalLessons: 8,
    completedLessons: 8,
    progressPercent: 100,
    learningStatus: "완강",
    periodLabel: "2026.03.10 ~ 2026.03.12",
    isReviewable: true,
    isExpired: false,
    instructorName: "최실무",
  },
  {
    id: "mc-005",
    title: "재경관리사 시험대비 특강",
    thumbnailUrl: "/images/courses/course-5.jpg",
    category: "챌린지",
    totalLessons: 12,
    completedLessons: 12,
    progressPercent: 100,
    learningStatus: "완강",
    periodLabel: "2026.04.01 ~ 2026.04.03",
    isReviewable: true,
    isExpired: false,
    instructorName: "정재경",
  },
  {
    id: "mc-006",
    title: "재무제표 분석 실무",
    thumbnailUrl: "/images/courses/course-6.jpg",
    category: "온라인 강의",
    totalLessons: 30,
    completedLessons: 30,
    progressPercent: 100,
    learningStatus: "완강",
    periodLabel: "2025.10.01 ~ 2025.12.31",
    isReviewable: true,
    isExpired: true,
    instructorName: "한재무",
  },
  {
    id: "mc-007",
    title: "근로기준법 핵심정리",
    thumbnailUrl: "/images/courses/course-7.jpg",
    category: "온라인 강의",
    totalLessons: 15,
    completedLessons: 15,
    progressPercent: 100,
    learningStatus: "완강",
    periodLabel: "2025.08.15 ~ 2025.11.15",
    isReviewable: false,
    isExpired: true,
    instructorName: "윤노동",
  },
];
```

### 2.2 탭 설정 데이터

`mypage.ts`에 추가할 상수:

```typescript
export const myLearningTabs: { key: MyLearningTab; label: string; isExternal?: boolean }[] = [
  { key: "courses", label: "강의" },
  { key: "notes", label: "강의 노트" },
  { key: "clips", label: "클립" },
  { key: "roadmap", label: "참여 중 로드맵", isExternal: true },
  { key: "mentoring", label: "멘토링" },
  { key: "certificates", label: "수료증" },
];

export const courseCategories: CourseCategory[] = ["온라인 강의", "챌린지", "모임/부트캠프"];
```

---

## 3. Component Design

### 3.1 파일 구조

```
src/components/mypage/
├── CoursesSection.tsx           ← 전면 교체 (루트 컨테이너)
└── my-learning/                 ← 새 폴더
    ├── MyLearningTabs.tsx       ← 상단 탭 네비게이션
    ├── CourseFilterBar.tsx      ← 카테고리 필터 + 검색 + 정렬
    ├── CourseFilterDropdown.tsx ← 필터 드롭다운 패널
    ├── CourseCard.tsx           ← 개별 강의 카드
    └── CourseCardMenu.tsx       ← ... 컨텍스트 메뉴
```

### 3.2 CoursesSection.tsx (루트 컨테이너)

**역할**: 상태 관리 및 하위 컴포넌트 조합

```typescript
"use client";

import { useState, useMemo } from "react";
import type { MyLearningTab, CourseCategory, CourseLearningStatusFilter } from "@/types";
import { mockMyCourses, myLearningTabs } from "@/data/mypage";
import MyLearningTabs from "./my-learning/MyLearningTabs";
import CourseFilterBar from "./my-learning/CourseFilterBar";
import CourseCard from "./my-learning/CourseCard";

export default function CoursesSection() {
  const [activeTab, setActiveTab] = useState<MyLearningTab>("courses");
  const [activeCategory, setActiveCategory] = useState<CourseCategory | null>(null);
  const [statusFilter, setStatusFilter] = useState<CourseLearningStatusFilter>("전체");
  const [hideExpired, setHideExpired] = useState(false);
  const [onlyReviewable, setOnlyReviewable] = useState(false);

  const filteredCourses = useMemo(() => {
    let courses = mockMyCourses;
    if (activeCategory) {
      courses = courses.filter((c) => c.category === activeCategory);
    }
    if (statusFilter !== "전체") {
      courses = courses.filter((c) => c.learningStatus === statusFilter);
    }
    if (hideExpired) {
      courses = courses.filter((c) => !c.isExpired);
    }
    if (onlyReviewable) {
      courses = courses.filter((c) => c.isReviewable);
    }
    return courses;
  }, [activeCategory, statusFilter, hideExpired, onlyReviewable]);

  // activeTab이 "courses"가 아니면 빈 상태 메시지
  if (activeTab !== "courses") {
    return (
      <div>
        <MyLearningTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="py-20 text-center">
          <p className="text-sm text-[var(--color-muted)]">
            준비 중인 기능입니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <MyLearningTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <CourseFilterBar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        hideExpired={hideExpired}
        onHideExpiredChange={setHideExpired}
        onlyReviewable={onlyReviewable}
        onOnlyReviewableChange={setOnlyReviewable}
      />
      {filteredCourses.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm text-[var(--color-muted)]">
            해당하는 강의가 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### 3.3 MyLearningTabs.tsx

**역할**: 6개 탭 네비게이션 (강의, 강의 노트, 클립, 참여 중 로드맵, 멘토링, 수료증)

**Props**:
```typescript
interface MyLearningTabsProps {
  activeTab: MyLearningTab;
  onTabChange: (tab: MyLearningTab) => void;
}
```

**UI 구현 사양**:
- 탭 레이아웃: 수평 나열, `flex`, `gap-6`
- 활성 탭: 텍스트 굵게(`font-bold`), 하단 2px 녹색 보더(`border-b-2 border-[var(--color-primary)]`)
- 비활성 탭: 텍스트 일반, `text-[var(--color-muted)]`, hover 시 `text-[var(--color-dark)]`
- "참여 중 로드맵" 탭: 외부 링크 아이콘(`ExternalLink`, 12px) 표시, 클릭 시 새 탭 열기 (실제 URL은 `#`)
- 하단 구분선: `border-b border-[var(--color-border)]`
- 패딩: `pb-3`, 탭 영역 전체에 `mb-4`

### 3.4 CourseFilterBar.tsx

**역할**: 카테고리 pill 필터 + 필터 드롭다운 + 검색/정렬 아이콘

**Props**:
```typescript
interface CourseFilterBarProps {
  activeCategory: CourseCategory | null;
  onCategoryChange: (category: CourseCategory | null) => void;
  statusFilter: CourseLearningStatusFilter;
  onStatusFilterChange: (filter: CourseLearningStatusFilter) => void;
  hideExpired: boolean;
  onHideExpiredChange: (value: boolean) => void;
  onlyReviewable: boolean;
  onOnlyReviewableChange: (value: boolean) => void;
}
```

**UI 구현 사양**:
- 레이아웃: `flex items-center justify-between`, 패딩 `py-4`
- 좌측 영역 (`flex items-center gap-2`):
  - 필터 아이콘 버튼: `SlidersHorizontal` (lucide, 18px), 클릭 시 `CourseFilterDropdown` 토글
  - 카테고리 pill 버튼 3개: `courseCategories` 배열 기반
    - 활성: `bg-[var(--color-dark)] text-white rounded-full px-4 py-1.5 text-sm font-medium`
    - 비활성: `bg-white border border-[var(--color-border)] text-[var(--color-body)] rounded-full px-4 py-1.5 text-sm`
    - 이미 활성인 카테고리 클릭 시 해제 (`null`)
- 우측 영역 (`flex items-center gap-2`):
  - 검색 아이콘: `Search` (lucide, 20px), `p-2 rounded-lg hover:bg-gray-100`
  - 정렬 아이콘: `ChevronsUpDown` (lucide, 20px), `p-2 rounded-lg hover:bg-gray-100`
- 필터 드롭다운:
  - 필터 아이콘 클릭 시 아래로 펼쳐짐
  - `CourseFilterDropdown` 컴포넌트를 조건부 렌더링
  - 외부 클릭 시 닫힘 (`useEffect` + `mousedown` 이벤트)

### 3.5 CourseFilterDropdown.tsx

**역할**: 학습 상태 필터 + 토글 옵션 드롭다운

**Props**:
```typescript
interface CourseFilterDropdownProps {
  statusFilter: CourseLearningStatusFilter;
  onStatusFilterChange: (filter: CourseLearningStatusFilter) => void;
  hideExpired: boolean;
  onHideExpiredChange: (value: boolean) => void;
  onlyReviewable: boolean;
  onOnlyReviewableChange: (value: boolean) => void;
}
```

**UI 구현 사양**:
- 컨테이너: `absolute top-full left-0 mt-2 w-64 bg-white rounded-xl border border-[var(--color-border)] shadow-lg p-4 z-20`
- 제목: "강의 필터링", `text-sm font-medium text-[var(--color-muted)] mb-3`
- 상태 필터 탭 (3개): 전체 / 학습 중 / 완강
  - 레이아웃: `flex gap-1 mb-4`
  - 활성: `bg-white border border-[var(--color-border)] font-medium text-[var(--color-dark)] rounded-lg px-3 py-1.5 text-sm`
  - 비활성: `text-[var(--color-muted)] px-3 py-1.5 text-sm rounded-lg hover:bg-gray-50`
- 토글 스위치 2개:
  - "수강평 작성 가능한": `onlyReviewable` 토글
  - "만료된 강의 숨기기": `hideExpired` 토글
  - 각 토글: `flex items-center justify-between py-2`
  - 토글 UI: `div` 기반 커스텀 토글 (24x14px, 활성 시 `bg-[var(--color-primary)]`, 비활성 시 `bg-gray-200`)

### 3.6 CourseCard.tsx

**역할**: 개별 강의 카드 (썸네일 + 정보 + 진행률 + 메뉴)

**Props**:
```typescript
interface CourseCardProps {
  course: MyCourse;
}
```

**UI 구현 사양**:

```
┌──────────────────────────────┐
│ ┌──────────────────────────┐ │
│ │                          │ │
│ │      썸네일 이미지        │ │  aspect-video, rounded-lg
│ │          ▶ (중앙)         │ │  재생 버튼 overlay
│ │                          │ │
│ └──────────────────────────┘ │
│                              │
│ 강좌명 (최대 2줄, 말줄임)      │  text-sm font-medium, line-clamp-2
│                              │
│ ██████████░░░░░░░░           │  h-1 rounded-full, bg-[--color-primary]
│ 1 / 4강 (25%)                │  text-xs text-[--color-muted]
│ 무제한                   ...  │  text-xs + CourseCardMenu
└──────────────────────────────┘
```

- 카드 컨테이너: `flex flex-col`, 패딩 없음 (이미지가 상단에 풀 width)
- 썸네일 영역:
  - `relative aspect-video rounded-lg overflow-hidden bg-gray-100`
  - 이미지: `object-cover w-full h-full`, 이미지 없으면 플레이스홀더 배경
  - 재생 버튼: 중앙 배치, `absolute inset-0 flex items-center justify-center`
    - 원형 배경: `w-12 h-12 rounded-full bg-black/50 flex items-center justify-center`
    - 아이콘: `Play` (lucide, 20px, white, `fill-white`)
- 강좌명:
  - `mt-3 text-sm font-medium text-[var(--color-dark)] line-clamp-2 leading-snug`
- 진행률 바:
  - 배경: `mt-3 h-1 w-full rounded-full bg-gray-200`
  - 채움: `h-full rounded-full bg-[var(--color-primary)]`, `width: ${progressPercent}%`
- 진행률 텍스트:
  - `mt-1.5 text-xs text-[var(--color-muted)]`
  - 포맷: `{completedLessons} / {totalLessons}강 ({progressPercent}%)`
- 하단 행 (기간 + 메뉴):
  - `flex items-center justify-between mt-0.5`
  - 기간: `text-xs text-[var(--color-muted)]` → `periodLabel`
  - 더보기 버튼: `CourseCardMenu` 컴포넌트

### 3.7 CourseCardMenu.tsx

**역할**: 카드 우하단 "..." 버튼 + 컨텍스트 메뉴

**Props**:
```typescript
interface CourseCardMenuProps {
  courseId: string;
}
```

**UI 구현 사양**:
- 트리거 버튼: `MoreHorizontal` (lucide, 16px), `p-1 rounded hover:bg-gray-100`
- 메뉴 패널:
  - `absolute right-0 bottom-full mb-1 w-40 bg-white rounded-lg border border-[var(--color-border)] shadow-lg py-1 z-20`
  - 위치: 버튼 위쪽으로 열림 (`bottom-full`)
- 메뉴 항목:
  - "수강 취소": 아이콘 `MinusCircle` (16px) + 텍스트, `flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 w-full`
  - "폴더에 추가": 아이콘 `FolderPlus` (16px) + 텍스트, 동일 스타일
- 외부 클릭 시 닫힘
- 클릭 시 동작: `console.log` (실제 기능 Out of Scope)

---

## 4. State Management

### 4.1 상태 흐름도

```
CoursesSection (상태 소유)
├── activeTab: MyLearningTab           → MyLearningTabs
├── activeCategory: CourseCategory     → CourseFilterBar
├── statusFilter: CourseLearningStatusFilter → CourseFilterBar → CourseFilterDropdown
├── hideExpired: boolean               → CourseFilterBar → CourseFilterDropdown
├── onlyReviewable: boolean            → CourseFilterBar → CourseFilterDropdown
└── filteredCourses: MyCourse[] (derived) → CourseCard[]
```

### 4.2 필터 로직

```
1. activeCategory !== null → category 일치 필터
2. statusFilter !== "전체" → learningStatus 일치 필터
3. hideExpired === true → isExpired !== true 필터
4. onlyReviewable === true → isReviewable === true 필터
(모든 조건은 AND로 결합)
```

---

## 5. Styling Conventions

### 5.1 기존 디자인 토큰 활용

| Token | Usage |
|-------|-------|
| `--color-primary` | 활성 pill 배경, 진행률 바, 활성 탭 하단 보더 |
| `--color-dark` | 강좌명, 활성 pill 배경(검정) |
| `--color-body` | 비활성 pill 텍스트 |
| `--color-muted` | 진행률 텍스트, 기간, 비활성 탭 |
| `--color-border` | pill 보더, 드롭다운 보더 |
| `--color-light-bg` | 필요시 배경 |

### 5.2 아이콘 (lucide-react)

| Icon | Usage |
|------|-------|
| `SlidersHorizontal` | 필터 아이콘 버튼 |
| `Search` | 검색 아이콘 |
| `ChevronsUpDown` | 정렬 아이콘 |
| `ExternalLink` | "참여 중 로드맵" 탭 외부 링크 |
| `Play` | 카드 썸네일 재생 버튼 |
| `MoreHorizontal` | 카드 더보기 버튼 |
| `MinusCircle` | 수강 취소 메뉴 아이콘 |
| `FolderPlus` | 폴더에 추가 메뉴 아이콘 |

---

## 6. Implementation Order

| Step | Task | Files | FR Coverage |
|------|------|-------|------------|
| 1 | 타입 정의 변경 | `types/index.ts` | - |
| 2 | Mock 데이터 교체 + 탭 상수 추가 | `data/mypage.ts` | - |
| 3 | MyLearningTabs 구현 | `my-learning/MyLearningTabs.tsx` | FR-01 |
| 4 | CourseCard 구현 (썸네일 + 진행률) | `my-learning/CourseCard.tsx` | FR-05~08, FR-12 |
| 5 | CourseCardMenu 구현 | `my-learning/CourseCardMenu.tsx` | FR-09 |
| 6 | CourseFilterDropdown 구현 | `my-learning/CourseFilterDropdown.tsx` | FR-03, FR-04 |
| 7 | CourseFilterBar 구현 | `my-learning/CourseFilterBar.tsx` | FR-02, FR-10, FR-11 |
| 8 | CoursesSection.tsx 전면 교체 | `CoursesSection.tsx` | 전체 조합 |

---

## 7. Responsive Design

| Breakpoint | Grid | Card Thumbnail | Filter Bar |
|------------|------|----------------|------------|
| < 640px (mobile) | 1열 | aspect-video full | pill 수평 스크롤 |
| >= 640px (sm+) | 2열 | aspect-video full | 기본 레이아웃 |

---

## 8. Acceptance Criteria

| ID | Criteria | Verification |
|----|----------|-------------|
| AC-01 | 6개 탭 렌더링, 활성 탭 하단 녹색 보더 | Visual |
| AC-02 | "강의" 탭에서 카드 그리드 2열 표시 | Visual |
| AC-03 | 카테고리 pill 클릭 시 필터 작동 | Functional |
| AC-04 | 필터 드롭다운 열기/닫기, 상태 필터 작동 | Functional |
| AC-05 | 토글 스위치(수강평/만료) 작동 | Functional |
| AC-06 | 카드에 썸네일, 재생 버튼, 진행률 바, 기간 표시 | Visual |
| AC-07 | 카드 ... 버튼 클릭 시 컨텍스트 메뉴 표시 | Functional |
| AC-08 | 모바일(< 640px)에서 1열 레이아웃 | Responsive |
| AC-09 | "강의" 외 탭 선택 시 "준비 중" 메시지 | Visual |
| AC-10 | 필터 결과 없을 때 빈 상태 메시지 | Visual |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-20 | Initial draft | Frontend Architect |
