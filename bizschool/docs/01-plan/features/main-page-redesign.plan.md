# Plan: 메인페이지 UI 리디자인

> **Feature**: main-page-redesign
> **Created**: 2026-03-26
> **Status**: Plan

## 1. 개요

메인페이지(`/`)의 레이아웃을 4개 섹션으로 재구성한다.

## 2. 현재 상태

- **MainBanner**: 5장 슬라이드 캐러셀 (온라인 강의 홍보)
- **전체 강의**: `sampleCourses` 8개를 4열 그리드로 표시

## 3. 변경 요구사항

### 섹션 1: 상단 메인카드 (현장강의 매핑)
- `/education` 페이지의 교육과정 데이터(`educationCourses`)를 카드 형태로 표시
- 현장강의 일정 카드 → 클릭 시 `/education`으로 이동
- 주요 표시 정보: 교육과정명, 일시, 강사, 수강료, 카테고리
- 눈에 띄는 히어로 영역으로 디자인

### 섹션 2: 알고리즘 추천강의
- 4개 카드를 1줄(4열)로 표시
- 기존 `CourseCard` 컴포넌트 재활용
- "추천강의" 섹션 헤더 + "더보기" 링크

### 섹션 3: 추천도서
- **5개** 카드를 **1줄(5열)**로 표시
- 기존 `BookCard` 컴포넌트 재활용
- `/books` 페이지의 `sampleBooks` 데이터 매핑
- "추천도서" 섹션 헤더 + "더보기" 링크 (`/books`)
- 기존 `RecommendedBooks.tsx` 컴포넌트를 5열로 수정하여 재활용

### 섹션 4: 온라인 강의
- 16개 카드를 4줄(4열 x 4행)로 표시
- 16개 초과 시 페이지네이션 UI
- 기존 `CourseCard` 컴포넌트 재활용
- "온라인 강의" 섹션 헤더

## 4. 영향 범위

| 파일 | 변경 내용 |
|------|----------|
| `src/app/page.tsx` | 4개 섹션으로 레이아웃 재구성 |
| `src/components/sections/MainBanner.tsx` | 제거 또는 대체 (현장강의 카드 섹션으로) |
| `src/components/sections/MainEducationCards.tsx` | **신규** - 현장강의 메인카드 섹션 |
| `src/components/sections/RecommendedCourses.tsx` | 기존 컴포넌트 재활용 (4개 1줄) |
| `src/components/sections/RecommendedBooks.tsx` | 기존 컴포넌트 수정 (4열 → 5열, 5개 표시) |
| `src/components/sections/OnlineCourses.tsx` | **신규** - 온라인 강의 섹션 (페이지네이션 포함) |
| `src/data/courses.ts` | 온라인 강의 데이터 16개 이상으로 확장 |

## 5. 데이터 소스

| 섹션 | 데이터 | 비고 |
|------|--------|------|
| 메인카드 | `educationCourses` (education.ts) | 현장강의 일정 |
| 추천강의 | `sampleCourses` (courses.ts) | 상위 4개 |
| 추천도서 | `sampleBooks` (books.ts) | 상위 5개 |
| 온라인 강의 | `sampleCourses` (courses.ts) | 16개/페이지, 확장 필요 |

## 6. 구현 순서

1. 온라인 강의 데이터 확장 (8개 → 20개+)
2. 메인 교육카드 섹션 컴포넌트 생성
3. `RecommendedBooks.tsx` 수정 (4열 → 5열, slice 5개)
4. 온라인 강의 섹션 컴포넌트 (페이지네이션 포함) 생성
5. `page.tsx` 레이아웃 재구성 (4개 섹션)
6. 불필요한 `MainBanner` 정리

## 7. 기술 사항

- **페이지네이션**: 클라이언트 사이드 (Mock 데이터 기반)
- **반응형**: 모바일 1열 → 태블릿 2~3열 → 데스크톱 4~5열
- **기존 컴포넌트**: `CourseCard`, `BookCard`, `RecommendedCourses`, `RecommendedBooks` 최대한 재활용
