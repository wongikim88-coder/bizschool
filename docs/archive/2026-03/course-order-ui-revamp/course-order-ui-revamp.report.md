# Course Order UI Revamp Completion Report

> **Summary**: 강의 구매내역 테이블의 상태 열 분리, 통합, 스타일링 개선 및 UX 최적화.
>
> **Project**: BIZSCHOOL (Next.js App Router, Starter Level)
> **Feature**: course-order-ui-revamp
> **Duration**: 2026-03-19 ~ 2026-03-20
> **Owner**: Team

---

## Overview

강의 구매내역(CourseOrderSection) 테이블의 상태 표시 UX를 개선한 작업. 초기에는 "결제 / 수강" 단일 열을 "결제상태"와 "수강상태" 2열로 분리했으나, 에이전트 UX 분석을 통해 15가지 조합의 복잡성을 인지하고 최종적으로 단일 "수강상태" 열로 통합하는 의사결정을 거침.

### Key Deliverables
- 결제상태 + 수강상태 2열 → 단일 "수강상태" 열 통합
- CourseUnifiedStatus 타입 정의 (7개 통합 상태값)
- getUnifiedStatus() 도출 함수 구현
- OrderStatusBadge 단일 배지 컴포넌트
- 도서 구매내역과 일관된 스타일링 (폰트 크기, 색상, 상세보기 버튼)
- Mock 데이터 다양화 (7개 통합 상태 모두 포함)

---

## PDCA Cycle Summary

### Plan Phase
**Status**: Iterative (대화 기반 요구사항 도출)

- 사용자 요청에 따라 점진적으로 요구사항 정의
- 초기: 2열 분리 → 스타일링 → UX 분석 → 단일 열 통합

### Design Phase
**Status**: Agent-Assisted Decision

- frontend-architect, product-manager 에이전트와 3차례 UX 상의
- 1차: 2열 vs 단일 열 비교 분석 → 단일 열 권장 (업계 벤치마크 포함)
- 2차: 열 헤더 네이밍 ("주문상태" 유지 vs 변경) → "주문상태" 유지 권장
- 3차: "주문상태"의 의미적 부적합성 재검토 → "수강상태" vs "이용현황" 비교 → "수강상태" 채택

### Do Phase
**Status**: Completed

**변경 이력 (시간순):**

1. 결제상태/수강상태 2열 분리 구현
2. 상태값 정의 (결제: 결제대기/결제완료/환불신청/환불완료, 수강: 수강전/수강중/수강완료)
3. "취소"를 결제상태 열에 추가 (text-red-500)
4. 폰트 색상 통일 (검정 → 도서 구매내역 패턴으로 변경)
5. 폰트 크기 통일 (text-xs → text-sm)
6. 열 헤더 변경 ("주문상세"), 열 너비 조정
7. "상세보기 >" 스타일 도서 구매내역과 동기화
8. Mock 데이터 정리 (null enrollStatus 제거, 취소 데이터 추가)
9. 강좌명 가운데 정렬
10. **2열 → 단일 열 통합** (핵심 변경)
11. 열 헤더 "주문상태" → "수강상태" 변경
12. Mock 데이터 다양화 (환불신청/환불완료/수강전 추가)

### Check Phase
**Status**: Complete (대화 기반 확인)

- TypeScript 빌드: Pass (tsc --noEmit)
- 7개 통합 상태값 모두 Mock 데이터에 포함
- 데스크톱 테이블 + 모바일 카드 뷰 모두 적용

---

## Results

### 통합 상태 체계

| 통합 수강상태 | 도출 규칙 | 색상 |
|-------------|----------|------|
| 결제대기 | paymentStatus=결제대기, claimStatus=null | muted |
| 수강전 | paymentStatus=결제완료, enrollStatus=수강전, claimStatus=null | muted |
| 수강중 | paymentStatus=결제완료, enrollStatus=수강중, claimStatus=null | dark |
| 수강완료 | paymentStatus=결제완료, enrollStatus=수강완료, claimStatus=null | primary |
| 환불신청 | claimStatus=환불신청 (우선) | muted |
| 환불완료 | claimStatus=환불완료 (우선) | dark |
| 취소 | claimStatus=취소 (우선) | red-500 |

### 테이블 구조 변경

**Before (7열):**
주문일(14%) | 강좌명(28%) | 유형(8%) | 결제금액(13%) | 결제상태(12%) | 수강상태(12%) | 주문상세(13%)

**After (6열):**
주문일(14%) | 강좌명(38%) | 유형(8%) | 결제금액(13%) | 수강상태(14%) | 주문상세(13%)

- 강좌명 열: 28% → 38% (긴 강좌명 절단 문제 해소)
- 열 수 감소: 7 → 6 (시각적 복잡도 감소)

---

## Modified Files

| File | Changes |
|------|---------|
| `types/index.ts` | CourseUnifiedStatus 타입 추가, CourseOrderStatusFilter를 통합 상태 기준으로 변경, CourseOrderStatus 레거시 타입 제거 |
| `components/mypage/CourseOrderSection.tsx` | PaymentBadge+EnrollBadge+ClaimBadge → OrderStatusBadge 통합, getUnifiedStatus() 추가, 7열→6열, 필터 로직 단순화, 모바일 카드 단일 배지 |
| `data/mypage.ts` | CRS-2026-006 환불신청, CRS-2026-008 수강전, CRS-2026-009 환불완료, CRS-2026-015 취소 데이터 추가/변경 |

---

## Metrics

### Code Quality
- **Type Safety**: CourseUnifiedStatus 완전 타입 (7개 값)
- **Responsive**: 데스크톱 테이블 + 모바일 카드 모두 적용
- **Build**: tsc --noEmit Pass

### UX Improvement
- **상태 조합 복잡도**: 15가지 → 7가지 (53% 감소)
- **열 수**: 7 → 6 (14% 감소)
- **강좌명 표시 공간**: 28% → 38% (36% 증가)
- **인지 부하**: 2열 조합 해석 불필요 → 단일 값으로 즉시 이해

### Mock Data Coverage
- 7개 통합 상태 모두 Mock 데이터에 포함
- 21건 주문 데이터

---

## Lessons Learned

### What Went Well
1. **에이전트 기반 UX 의사결정**: frontend-architect, product-manager 에이전트와 3차례 상의를 통해 2열→단일열 통합이라는 구조적 개선 도출
2. **업계 벤치마크 활용**: 인프런, 클래스101, Udemy 등의 패턴을 참고하여 단일 상태 열이 업계 표준임을 확인
3. **점진적 개선**: 초기 2열 분리 → 스타일 정제 → 구조적 통합으로 자연스럽게 진화
4. **도메인 적합 네이밍**: "주문상태" → "수강상태"로 변경하여 강의 플랫폼 맥락에 적합한 용어 채택

### To Apply Next Time
1. 상태 표시 설계 시 조합 경우의 수를 먼저 분석하여 복잡도를 평가한 후 열 구조 결정
2. 도메인별로 열 헤더 네이밍이 달라질 수 있음 (도서=주문상태, 강의=수강상태) — 일관성보다 맥락 적합성 우선

---

## Agent Consultation Summary

| 회차 | 주제 | 참여 에이전트 | 결론 |
|------|------|-------------|------|
| 1차 | 2열 vs 단일 열 | frontend-architect, product-manager | 단일 열 통합 (만장일치) |
| 2차 | 헤더명 "주문상태" 유지 여부 | frontend-architect, product-manager | "주문상태" 유지 (만장일치) |
| 3차 | "주문상태" 의미적 부적합 재검토 | frontend-architect, product-manager | "수강상태" vs "이용현황" (의견 분리, 사용자 결정) |

---

**Report Generated**: 2026-03-20
**Project**: BIZSCHOOL
**Level**: Starter
**Status**: Complete
