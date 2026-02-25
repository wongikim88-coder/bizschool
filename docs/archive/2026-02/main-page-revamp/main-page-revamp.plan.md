# Plan: Main Page Revamp

## Feature Overview
메인 페이지 개선 - 배너 캐러셀 추가, 히어로 텍스트/버튼 제거, 푸터 보강

## Requirements

### REQ-1: 메인 배너 캐러셀
- 검색창 아래에 슬라이딩 배너 추가
- 대표 강의 5개가 자동/수동으로 넘어가는 캐러셀
- 인프런 스타일 참고 (둥근 모서리, 그라데이션 배경, 강의 정보 표시)
- 좌우 화살표 + 하단 인디케이터 도트

### REQ-2: 히어로 텍스트 제거
- "BIZSCHOOL에서 비즈니스 역량을 키워보세요" 문구 제거
- "전문가가 직접 전하는 실무 중심의 강의와 도서" 문구 제거

### REQ-3: CTA 버튼 제거
- "무료로 시작하기" 버튼 제거

### REQ-4: 푸터 영역 보강
- 인프런 스타일 참고하여 기존 푸터 보강
- 회사 정보, SNS 링크, 사업자 정보 등 추가

## Implementation Plan

### Task 1: HeroBanner → MainBanner 캐러셀 교체
**파일**: `src/components/sections/HeroBanner.tsx` → `src/components/sections/MainBanner.tsx`
- 기존 HeroBanner 컴포넌트를 캐러셀 배너로 완전 교체
- "use client" 클라이언트 컴포넌트로 변경 (상태 관리 필요)
- 5개 대표 강의 데이터로 슬라이드 구성
- 자동 재생 (5초 간격) + 수동 네비게이션
- 좌우 화살표 버튼, 하단 도트 인디케이터
- REQ-2, REQ-3 자동 해결 (HeroBanner 전체 교체)

### Task 2: page.tsx 업데이트
**파일**: `src/app/page.tsx`
- HeroBanner import를 MainBanner로 교체

### Task 3: Footer 보강
**파일**: `src/components/layout/Footer.tsx`
- 사업자 정보 섹션 추가 (대표, 사업자번호, 주소, 이메일)
- SNS 아이콘 링크 추가
- "개인정보처리방침", "이용약관" 등 법적 링크 추가
- 인프런 스타일 참고한 레이아웃 개선

### Task 4: 반응형 확인
- 모바일/태블릿/데스크톱 레이아웃 확인
- Playwright로 최종 결과 스크린샷 검증

## Technical Notes
- 외부 라이브러리 없이 순수 React + CSS로 캐러셀 구현
- Tailwind CSS 활용
- `courses.ts`에서 상위 5개 강의 데이터 활용
- `lucide-react` 아이콘 활용 (이미 설치됨)

## Dependencies
- 없음 (추가 패키지 불필요)
