# Plan: UX Improvements V1

## Feature Name
`ux-improvements-v1`

## Created
2026-02-27

## Status
Draft

---

## 1. Overview

BIZSCHOOL 플랫폼의 전반적인 UX를 개선하는 작업. 홈 화면 변경, 네비게이션 정리, 도서 검색 UI 개선, 전문가상담 페이지 레이아웃 통합 등 5가지 항목을 포함한다.

## 2. Requirements

### REQ-01: 홈 화면을 "강의" 화면으로 설정
- **현재 상태**: `/` 접속 시 MainBanner + 추천강의 + 추천도서 섹션이 표시됨. `/courses` 페이지는 존재하지 않음.
- **목표**: `/` 접속 시 강의 목록(코스 카탈로그) 화면이 바로 보이도록 변경.
- **구현 방향**:
  - 현재 홈 페이지(`src/app/page.tsx`)의 MainBanner + 추천 섹션 구조를 강의 목록 페이지로 교체
  - 기존 MainBanner는 강의 페이지의 상단 배너로 유지 가능
  - 강의 카탈로그: 카테고리 필터 + 강의 카드 그리드 + 페이지네이션
  - 데이터 소스: `src/data/courses.ts`의 `sampleCourses` 활용

### REQ-02: 헤더 "강의" 클릭 시 강의 화면 이동
- **현재 상태**: 헤더의 "강의" 링크가 `/courses`를 가리키지만 해당 페이지가 없음.
- **목표**: "강의" 클릭 시 홈(`/`)으로 이동하도록 변경 (REQ-01에서 홈을 강의 화면으로 설정하므로).
- **구현 방향**: `Header.tsx`의 menuItems에서 "강의"의 href를 `/courses` → `/`로 변경.

### REQ-03: 도서 페이지 검색 UI 개선 (인프런 스타일)
- **현재 상태**:
  - 상단: 레이아웃 글로벌 `SearchBar` (비기능적, "배우고 싶은 강의를 검색해보세요")
  - 중간: `CategoryFilter` (전체, 경영전략 등 카테고리 pill 버튼)
  - 하단: `BookSearch` (도서명/저자 검색 input + 검색 버튼)
- **목표**:
  - 검색창은 상단에 하나만 유지 (글로벌 SearchBar를 도서 페이지에서 활용)
  - 하단의 `BookSearch` 컴포넌트 제거
  - 검색창 클릭 시 카테고리 브라우즈 패널이 드롭다운으로 표시 (인프런 참고)
- **구현 방향**:
  - 글로벌 `SearchBar` 컴포넌트를 도서 페이지에서는 기능적으로 동작하도록 개선
  - 검색창 focus 시 하단에 카테고리 패널 드롭다운 표시
  - 패널 내용: "전체", "경영전략", "마케팅", "재무회계", "자기계발", "리더십", "IT/기술" 카테고리 목록
  - 카테고리 클릭 시 해당 카테고리로 필터링
  - 검색어 입력 + Enter로 도서 검색 수행
  - `CategoryFilter` 컴포넌트는 독립적으로 유지 (페이지 내 필터 역할)하되, 검색 패널에도 동일 카테고리 표시
  - books 페이지에서 `BookSearch` 컴포넌트 import/render 제거

### REQ-04: 전문가상담 페이지 헤더 통합
- **현재 상태**:
  - 전문가상담 페이지가 `fixed inset-0 z-[60]`으로 전체화면을 차지
  - 자체 헤더(BIZSCHOOL 로고 + "AI 전문가 상담" + "BIZSCHOOL 홈" 링크) 사용
  - 공통 Header/SearchBar/Footer가 뒤에 가려져 보이지 않음
- **목표**:
  - 다른 페이지와 동일한 공통 헤더 유지 (강의, 도서, 전문가상담, 커뮤니티 메뉴)
  - 우측 상단 "BIZSCHOOL 홈" 링크 삭제
  - 상담 영역은 `<main>` 안에서 렌더링 (fixed fullscreen 제거)
- **구현 방향**:
  - `consulting/page.tsx`에서 `fixed inset-0 z-[60]` 제거
  - 자체 `<header>` 제거 (공통 Header가 이미 layout에서 렌더링됨)
  - 상담 컨텐츠를 `<main>` 내에서 적절한 높이로 렌더링 (예: `calc(100vh - header - searchbar)`)
  - Footer는 상담 페이지에서는 불필요할 수 있으므로 조건부 숨김 또는 스크롤 아래 배치
  - Sidebar 위치 조정 (absolute → 페이지 내 상대적 위치)

### REQ-05: 전문가상담 사이드바 기본 열림
- **현재 상태**: `sidebarOpen` 초기값이 `false` → 사이드바가 닫힌 상태
- **목표**: 데스크톱에서 사이드바가 기본으로 열린 상태
- **구현 방향**:
  - `sidebarOpen` 초기값을 `true`로 변경
  - 또는 데스크톱에서는 항상 표시, 모바일에서만 토글 가능하도록 CSS로 제어
  - 현재 Sidebar 컴포넌트의 `md:hidden` 클래스를 `md:flex` 등으로 변경

## 3. Affected Files

### 수정 파일
| File | Change |
|------|--------|
| `src/app/page.tsx` | 강의 목록 페이지로 교체 |
| `src/components/layout/Header.tsx` | "강의" href → `/` 변경 |
| `src/components/layout/SearchBar.tsx` | 검색 기능 활성화 + 카테고리 패널 드롭다운 추가 |
| `src/app/books/page.tsx` | `BookSearch` 제거 |
| `src/app/consulting/page.tsx` | fixed fullscreen 제거, 자체 헤더 제거, sidebarOpen 기본값 변경 |
| `src/components/consultation/Sidebar.tsx` | 위치/레이아웃 조정 (fixed → 상대적) |

### 신규 파일 (필요 시)
| File | Purpose |
|------|---------|
| `src/components/layout/SearchBrowsePanel.tsx` | 검색창 클릭 시 나타나는 카테고리 브라우즈 패널 |

### 삭제 대상 없음
- `BookSearch.tsx`는 books 페이지에서 render하지 않을 뿐, 파일 자체는 유지 (다른 곳에서 재활용 가능)

## 4. Implementation Order

1. **REQ-01 + REQ-02** (강의 홈 + 헤더 링크) — 가장 기본적인 네비게이션 구조 변경
2. **REQ-04 + REQ-05** (전문가상담 헤더 통합 + 사이드바 기본 열림) — 레이아웃 구조 변경
3. **REQ-03** (도서 검색 UI 개선) — 가장 복잡한 UI 인터랙션 변경

## 5. Out of Scope
- 강의 상세 페이지 (`/courses/[id]`)
- 검색 결과 하이라이트
- 강의/도서 통합 검색
- 회원 인증/로그인 기능
- API 연동 (현재 모든 데이터는 mock)

## 6. Risk / Notes
- 홈 페이지를 강의 화면으로 변경하면 기존 MainBanner/추천 섹션이 사라짐 → 사용자 확인 필요
- 전문가상담 페이지의 fullscreen → inline 변경 시 높이 계산 주의 필요
- SearchBar를 functional하게 만들 때 서버 컴포넌트 → 클라이언트 컴포넌트로 변경 필요
- 인프런 스타일 검색 패널: 클릭 바깥 영역 클릭 시 닫히는 동작, 키보드 접근성 고려
