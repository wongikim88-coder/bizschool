# expert-consultation-design PDCA Report

> **Summary**: 전문가상담 페이지(/expert-consultation) 전체 UI 리디자인
> **Project**: BIZSCHOOL
> **Feature**: expert-consultation-design
> **Date**: 2026-03-25
> **Status**: Completed (Archive)

---

## 1. 개요

전문가상담 소개 페이지(`/expert-consultation`)의 전체 섹션을 모던 SaaS 랜딩 스타일로 리디자인. Frontend Architect Agent와 반복적으로 상의하며 각 섹션의 시각적 차별화와 UX 개선을 진행함.

## 2. 작업 범위

### 2.1 수정 파일

| 파일 | 역할 | 상태 |
|------|------|------|
| `src/app/expert-consultation/page.tsx` | 메인 페이지 (Server Component) | 수정 |
| `src/components/expert-consultation/PricingCard.tsx` | 요금 선택 카드 (Client Component) | 신규 |
| `src/components/expert-consultation/HeroStats.tsx` | Hero 통계 카운트업 (Client Component) | 신규 |

### 2.2 코드 규모

- 총 3개 파일, 약 337줄
- page.tsx: 175줄
- PricingCard.tsx: 93줄
- HeroStats.tsx: 70줄

## 3. 섹션별 작업 내역

### 3.1 Hero 섹션
- 풀너비 다크 그라디언트 배경 (`from-[#101828] via-[#1e2839] to-[#155dfc]`)
- 장식용 블러 블롭 3개 (배경 깊이감)
- 카테고리 칩 (회계, 세무, 4대보험, 인사·총무)
- 불필요 요소 제거: 상담 신청 버튼, 내 상담 내역 버튼, EXPERT CONSULTATION 배지
- 설명 텍스트 가독성 개선 (`text-white/90`)
- **통계 카운트업 애니메이션** 추가 (누적 상담건수 73,000+ / 업력 20년+)
  - Intersection Observer 기반 뷰포트 진입 시 트리거
  - easeOutCubic 이징
  - Rules of Hooks 준수를 위한 StatItem 컴포넌트 분리

### 3.2 상담 분야 섹션
- 2컬럼 카드 그리드
- 그라디언트 아이콘 박스 (`from-[var(--color-primary)] to-[#2b7fff]`)
- Hover 애니메이션: translate-y, shadow, border color, gradient overlay
- Hero 직후 첫 섹션이므로 mt 제거 (컨테이너 py-10으로 간격 확보)

### 3.3 서비스 특징 섹션
- 상담 분야와 차별화: 연한 회색 배경 (`--color-light-bg`) + 넘버 카드 방식
- 아이콘 제거, 대형 넘버(01/02/03)만 표시 (`text-5xl font-black`)
- 3컬럼 개별 화이트 카드 (shadow-sm)
- Agent 상의 결과: 섹션 간 시각적 모노톤 방지를 위해 배경+넘버 방식 채택

### 3.4 이용 안내 섹션
- Step 1 / Step 2 / Step 3 레이블 방식
- 연한 파란 배경 박스 (`--color-primary-light`) + 파란 텍스트
- 3컬럼 그리드 (gap-[70px])
- 데스크톱: 단계 간 그라디언트 연결선
- whitespace-nowrap + `<br/>` 조합으로 줄바꿈 제어
- 요금 안내 위로 순서 이동 (흐름 이해 → 결제 결정)

### 3.5 요금 안내 섹션
- PricingCard 클라이언트 컴포넌트로 분리 (인터랙티브 선택)
- 월간/연간 구독 선택 UI: 클릭 시 파란 테두리 + 연한 배경
- 초기 상태: 둘 다 미선택 (회색 테두리 동일)
- 선택 전: 비활성 버튼 ("결제 방식을 선택해주세요")
- 선택 후: 활성 버튼 ("월간/연간 구독하고 상담 시작하기")
- 가격: 월간 11,000원, 연간 9,900원/월 (10% 절약, 연 118,800원)
- 리다이렉트 기능 제거 (버튼만 표시)

## 4. 레이아웃 & 간격

### 4.1 섹션 순서 (최종)
1. Hero (풀너비, 다크 그라디언트)
2. 상담 분야
3. 서비스 특징
4. 이용 안내
5. 요금 안내

### 4.2 간격 결정
- 섹션 간: `mt-20` (80px) 통일 — SaaS 표준 (Stripe, Linear 등 80~96px 범위)
- Hero → 상담 분야: mt 제거 (배경 전환이 이미 섹션 분리 역할)
- 컨테이너: `max-w-[960px] px-4 py-10`

## 5. Agent 상의 내역

| 주제 | Agent | 결정 |
|------|-------|------|
| 설명 텍스트 가독성 | Frontend Architect | `text-white/90` 적용 |
| 서비스 특징 차별화 | Frontend Architect | 연한 배경 + 넘버 방식 (방안 B) |
| 요금 UX (토글 vs 병렬) | Frontend Architect | 현재 병렬 구조 유지 |
| 통계 항목 선정 | Frontend Architect | 누적 상담건수 + 업력 (2개) |
| 통계 위치 | Frontend Architect | Hero 내부 하단 |
| 섹션 간격 최적값 | Frontend Architect | mt-20 (80px) |
| Hero-상담분야 간격 | Frontend Architect | mt 제거 (배경 전환이 분리 역할) |

## 6. 디자인 결정 근거

- **섹션별 시각 차별화**: 다크 Hero → 흰 카드 그리드 → 회색 배경 넘버 → 흰 스텝 → 단일 카드
- **카운트업 애니메이션**: SaaS 랜딩 표준 패턴, 신뢰 증거(social proof) 역할
- **요금 선택 UI**: 선택 전/후 상태 구분으로 사용자 혼란 방지
- **이용 안내 → 요금 안내 순서**: 흐름 이해 후 결제 결정이 전환율에 유리

## 7. Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-03-25 | 전문가상담 페이지 전체 UI 리디자인 완료 | Claude |
