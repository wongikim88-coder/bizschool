# "내 학습" 페이지 UI 전면 개편 Planning Document

> **Summary**: 마이페이지 "내 학습" 탭의 UI를 아코디언+테이블 방식에서 탭+카드 그리드 방식으로 전면 개편
>
> **Project**: BIZSCHOOL
> **Author**: Product Manager
> **Date**: 2026-03-20
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

현재 "내 학습" 페이지는 아코디언 기반 테이블 레이아웃으로 구성되어 있으며, 강좌명/수강기간/결제여부만 표시한다.
이를 인프런 스타일의 탭+카드 그리드 UI로 전면 개편하여 학습 진행률 시각화, 필터링, 검색, 정렬 기능을 제공한다.

### 1.2 Background

**현재 UI 구조 (CoursesSection.tsx):**
- 3개 아코디언 섹션 (나의 온라인 강의실 / 나의 강의실 / 이수과정)
- 데스크톱: 테이블 형태 (강좌명, 수강기간, 고용보험 환급, 결제여부)
- 모바일: 카드 형태 (텍스트 정보만)
- 썸네일, 진행률 바, 필터, 검색, 정렬 기능 없음

**목표 UI 구조 (참고 이미지 기반):**
- 상단 탭 네비게이션: 강의 | 강의 노트 | 클립 | 참여 중 로드맵 | 멘토링 | 수료증
- 카테고리 필터 바: 필터 아이콘 | 온라인 강의(pill) | 챌린지 | 모임/부트캠프 + 검색/정렬
- 카드 그리드: 썸네일 + 재생 버튼 + 제목 + 진행률 바 + 기간 + 더보기 메뉴
- 필터 드롭다운: 학습 상태 필터(전체/학습 중/완강) + 토글 옵션
- 카드 컨텍스트 메뉴: 수강 취소 / 폴더에 추가

### 1.3 Related Documents

- 현재 컴포넌트: `src/components/mypage/CoursesSection.tsx`
- 타입 정의: `src/types/index.ts` (`MyCourse`, `CourseGroupType`)
- 데이터: `src/data/mypage.ts` (`mockMyCourses`)

---

## 2. Scope

### 2.1 In Scope

- [x] "강의" 탭 UI 전면 개편 (카드 그리드 레이아웃)
- [x] 상단 탭 네비게이션 구현 (강의/강의 노트/클립/참여 중 로드맵/멘토링/수료증)
- [x] 카테고리 필터 바 (온라인 강의/챌린지/모임·부트캠프 pill 버튼)
- [x] 필터 드롭다운 (학습 상태: 전체/학습 중/완강 + 토글 옵션)
- [x] 강의 카드 컴포넌트 (썸네일, 재생 버튼, 제목, 진행률, 기간, 더보기 메뉴)
- [x] 카드 컨텍스트 메뉴 (수강 취소, 폴더에 추가)
- [x] 검색 아이콘 + 정렬 아이콘 UI
- [x] 데이터 모델 확장 (썸네일, 진행률, 카테고리 등)

### 2.2 Out of Scope

- 강의 노트, 클립, 멘토링, 수료증 등 다른 탭의 실제 콘텐츠 구현 (빈 상태 메시지만)
- 실제 영상 재생 기능 연동
- 실제 검색/정렬 API 연동 (프론트엔드 mock 필터링만)
- 폴더 관리 기능 구현 (메뉴 항목 UI만)
- 참여 중 로드맵 외부 링크 연동

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 상단 탭 네비게이션 (6개 탭: 강의, 강의 노트, 클립, 참여 중 로드맵, 멘토링, 수료증) | High | Pending |
| FR-02 | "강의" 탭 내 카테고리 필터 (온라인 강의/챌린지/모임·부트캠프) pill 버튼 | High | Pending |
| FR-03 | 필터 아이콘 클릭 시 드롭다운 (학습 상태: 전체/학습 중/완강) | High | Pending |
| FR-04 | 필터 드롭다운 내 토글 스위치 (수강평 작성 가능한 / 만료된 강의 숨기기) | Medium | Pending |
| FR-05 | 강의 카드: 썸네일 이미지 + 재생 버튼 오버레이 | High | Pending |
| FR-06 | 강의 카드: 강좌명 (최대 2줄, 말줄임) | High | Pending |
| FR-07 | 강의 카드: 진행률 표시 (N / M강 (X%) + 프로그레스 바) | High | Pending |
| FR-08 | 강의 카드: 수강 기간 표시 (무제한 / 날짜) | High | Pending |
| FR-09 | 강의 카드: 더보기(...) 버튼 → 컨텍스트 메뉴 (수강 취소, 폴더에 추가) | Medium | Pending |
| FR-10 | 검색 아이콘 UI (돋보기) | Medium | Pending |
| FR-11 | 정렬 아이콘 UI (상하 화살표) | Medium | Pending |
| FR-12 | 카드 그리드 반응형 레이아웃 (데스크톱 2열, 모바일 1열) | High | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| 반응형 | 모바일/태블릿/데스크톱 모두 정상 렌더링 | 브라우저 리사이즈 테스트 |
| 접근성 | 키보드 네비게이션, aria 라벨 | 수동 검증 |
| 일관성 | 기존 bizschool 컬러 토큰/디자인 변수 활용 | 코드 리뷰 |

---

## 4. UI Structure

### 4.1 레이아웃 구조

```
┌─────────────────────────────────────────────────────┐
│ 내 학습                                              │
├─────────────────────────────────────────────────────┤
│ [강의]  강의 노트  클립  참여 중 로드맵↗  멘토링  수료증  │  ← 상단 탭
├─────────────────────────────────────────────────────┤
│ ☰  [온라인 강의]  챌린지  모임/부트캠프     🔍  ⇅     │  ← 필터 바
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐  ┌──────────────┐                 │
│  │  [썸네일]  ▶  │  │  [썸네일]  ▶  │                 │  ← 카드 그리드
│  │              │  │              │                 │
│  │ 강좌명 (2줄)  │  │ 강좌명 (2줄)  │                 │
│  │ ██████░░░░░  │  │ ░░░░░░░░░░░  │                 │  ← 진행률 바
│  │ 1/4강 (25%)  │  │ 0/21강 (0%)  │                 │
│  │ 무제한    ... │  │ 무제한    ... │                 │  ← 기간 + 더보기
│  └──────────────┘  └──────────────┘                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 4.2 필터 드롭다운 구조

```
┌─────────────────────┐
│ 강의 필터링           │
│                     │
│ [전체] 학습 중  완강  │  ← 상태 필터 탭
│                     │
│ ○ 수강평 작성 가능한  │  ← 토글 스위치
│ ○ 만료된 강의 숨기기  │  ← 토글 스위치
└─────────────────────┘
```

### 4.3 컨텍스트 메뉴 구조

```
┌────────────────┐
│ ⊖ 수강 취소     │
│ ⊞ 폴더에 추가   │
└────────────────┘
```

---

## 5. Data Model Changes

### 5.1 MyCourse 인터페이스 확장

현재:
```typescript
export interface MyCourse {
  id: string;
  title: string;
  periodStart: string;
  periodEnd: string;
  paymentStatus: CoursePaymentStatus;
  isInsuranceRefund?: boolean;
  groupType: CourseGroupType;
}
```

변경 후:
```typescript
export type CourseCategory = "온라인 강의" | "챌린지" | "모임/부트캠프";
export type CourseLearningStatus = "학습 중" | "완강";

export interface MyCourse {
  id: string;
  title: string;
  thumbnailUrl: string;             // 추가: 썸네일 이미지 URL
  category: CourseCategory;         // 추가: 카테고리 (기존 groupType 대체)
  totalLessons: number;             // 추가: 총 강의 수
  completedLessons: number;         // 추가: 완료 강의 수
  progressPercent: number;          // 추가: 진행률 (%)
  learningStatus: CourseLearningStatus; // 추가: 학습 상태
  periodLabel: string;              // 추가: "무제한" 또는 "2025.03.01 ~ 2025.12.31"
  isReviewable?: boolean;           // 추가: 수강평 작성 가능 여부
  isExpired?: boolean;              // 추가: 만료 여부
  instructorName?: string;          // 추가: 강사명 (선택)
}
```

### 5.2 제거되는 필드

- `periodStart`, `periodEnd` → `periodLabel`로 통합
- `paymentStatus` → 카드 UI에서 불필요 (구매내역에서 관리)
- `isInsuranceRefund` → 카드 UI에서 불필요
- `groupType` → `category`로 대체

---

## 6. Component Architecture

### 6.1 컴포넌트 트리

```
CoursesSection (전면 교체)
├── MyLearningTabs              (상단 탭 네비게이션)
├── CourseFilterBar              (카테고리 필터 + 검색 + 정렬)
│   └── CourseFilterDropdown     (필터 드롭다운 패널)
├── CourseCardGrid               (카드 그리드 컨테이너)
│   └── CourseCard               (개별 강의 카드)
│       ├── CourseCardThumbnail  (썸네일 + 재생 버튼)
│       ├── CourseProgressBar    (진행률 바)
│       └── CourseCardMenu       (... 컨텍스트 메뉴)
└── EmptyState                   (강의 없음 상태)
```

### 6.2 파일 구조

```
src/components/mypage/
├── CoursesSection.tsx           (기존 파일 전면 교체)
├── my-learning/                 (새 폴더)
│   ├── MyLearningTabs.tsx
│   ├── CourseFilterBar.tsx
│   ├── CourseFilterDropdown.tsx
│   ├── CourseCardGrid.tsx
│   ├── CourseCard.tsx
│   └── CourseCardMenu.tsx
```

---

## 7. Implementation Order

| Step | Task | Dependencies | Estimated Effort |
|------|------|-------------|-----------------|
| 1 | 타입 정의 변경 (`MyCourse` 확장, 새 타입 추가) | 없음 | S |
| 2 | Mock 데이터 갱신 (썸네일, 진행률 등 추가) | Step 1 | S |
| 3 | MyLearningTabs 컴포넌트 구현 | 없음 | S |
| 4 | CourseCard 컴포넌트 구현 (썸네일 + 진행률) | Step 1 | M |
| 5 | CourseCardMenu 컴포넌트 구현 (컨텍스트 메뉴) | Step 4 | S |
| 6 | CourseCardGrid 구현 (반응형 그리드) | Step 4 | S |
| 7 | CourseFilterBar + CourseFilterDropdown 구현 | Step 1 | M |
| 8 | CoursesSection.tsx 전면 교체 (조합) | Step 3~7 | M |
| 9 | 반응형 테스트 및 미세 조정 | Step 8 | S |

---

## 8. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 기존 MyCourse 데이터 모델 변경으로 다른 컴포넌트 영향 | Medium | Low | MyCourse를 사용하는 곳이 CoursesSection뿐인지 확인 후 변경 |
| 썸네일 이미지 없을 때 UI 깨짐 | Low | Medium | 기본 placeholder 이미지 제공 |
| 필터/정렬 로직 복잡도 증가 | Low | Low | mock 데이터 기반 프론트엔드 필터링으로 단순 구현 |

---

## 9. Success Criteria

### 9.1 Definition of Done

- [ ] 참고 이미지와 동일한 레이아웃으로 "강의" 탭 렌더링
- [ ] 카테고리 필터(온라인 강의/챌린지/모임·부트캠프) 작동
- [ ] 필터 드롭다운(학습 상태 + 토글 옵션) 작동
- [ ] 카드 컨텍스트 메뉴 표시
- [ ] 모바일/데스크톱 반응형 정상 동작
- [ ] 다른 탭(강의 노트, 클립 등)은 빈 상태 메시지 표시

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-20 | Initial draft | Product Manager |
