# Shipping Tracker Completion Report

> **Summary**: 도서 구매내역의 "배송 조회" 버튼 클릭 시 배송 추적 정보를 보여주는 인라인 뷰 구현.
>
> **Project**: BIZSCHOOL (Next.js App Router, Starter Level)
> **Feature**: shipping-tracker
> **Duration**: 2026-03-15
> **Owner**: Team

---

## Overview

도서 구매내역(BookOrderSection)에서 "배송 조회" 버튼 클릭 시 배송 추적 페이지(BookOrderShippingTracker)를 인라인으로 표시하는 기능 구현. 택배사 정보, 수취인 정보, 배송 이력 테이블, FAQ 아코디언 섹션을 포함.

### Key Deliverables
- ShippingTrackingStep, ShippingTrackingInfo 타입 정의
- 4건의 mock 배송 추적 데이터 (2건 배송완료, 2건 배송중)
- BookOrderShippingTracker 컴포넌트 (185 LOC)
- BookOrderSection에서 배송 조회 버튼 클릭 → 추적 뷰 전환 wiring
- 서브탭 숨김 처리 (onDetailViewChange 콜백)

---

## PDCA Cycle Summary

### Plan Phase
**Status**: Approved

- 배송 조회 인라인 뷰 요구사항 정의
- 참고 이미지 기반 UI 구조 설계
- 9개 요구사항 도출 (R1~R9)

### Design Phase
**Status**: Approved

- 인라인 교체 패턴 설계 (trackingOrderId state)
- 컴포넌트 6개 섹션 구조 정의
- 2개 TypeScript interface 설계
- 반응형 레이아웃 (desktop 2-column, mobile 1-column)

### Do Phase
**Status**: Completed

**Implementation Steps (4 steps):**

1. **Types**: `types/index.ts`에 ShippingTrackingStep, ShippingTrackingInfo 추가
2. **Mock Data**: `data/mypage.ts`에 mockShippingTracking (4건) 추가
3. **Component**: `BookOrderShippingTracker.tsx` 생성 (185 LOC)
   - Header + Status Banner + Delivery Info + Tracking History + FAQ + Back Button
4. **Wiring**: `BookOrderSection.tsx`에 trackingOrderId state, 핸들러, 버튼 onClick 연결

**New Files Created:**

| File | Purpose | LOC |
|------|---------|-----|
| BookOrderShippingTracker.tsx | 배송 추적 인라인 뷰 | 185 |

**Modified Files:**

| File | Changes |
|------|---------|
| types/index.ts | ShippingTrackingStep, ShippingTrackingInfo 인터페이스 추가 |
| data/mypage.ts | mockShippingTracking (4건 추적 데이터) 추가 |
| BookOrderSection.tsx | trackingOrderId state, handleShowTracking/handleBackFromTracking, 버튼 onClick, import 추가 |

### Check Phase
**Status**: Complete - Match Rate: 100%

- 16개 설계 항목 중 16개 구현 완료
- Types: 2/2, Mock Data: 4/4, Component Sections: 6/6, Wiring: 4/4
- Next.js build: Pass

---

## Results

### Completed Items

**Component Sections**
- Header: "배송 조회" 제목 + ArrowLeft "돌아가기" 버튼
- Status Banner: 배송완료 시 "M/D(요일) 도착 완료", 배송중 시 "배송중" 표시
- Delivery Info: 택배사/송장번호 (왼쪽) + 수취인 정보 dl/dt/dd (오른쪽)
- Tracking History: 3-column grid (시간/현재위치/배송상태), 최신 항목 primary 색상 강조
- FAQ Accordion: 4개 질문, ChevronDown/Up 토글, 기본 응답 텍스트
- Back Button: bg-[var(--color-primary)] 브랜드 블루 + ArrowLeft + "주문/배송 목록"

**State Management**
- trackingOrderId: string | null state
- handleShowTracking(id): 추적 뷰 진입 + 서브탭 숨김
- handleBackFromTracking(): 목록 복귀 + 서브탭 표시
- Mock 데이터 없는 주문: 자동 목록 복귀 (fallback)

**Responsive Design**
- Desktop (md+): 2-column delivery info, 3-column tracking table
- Mobile: 단일 컬럼, hr 구분선

---

## Metrics

### Code Quality
- **Match Rate**: 100% (16/16 design items)
- **Type Safety**: 100% (ShippingTrackingInfo fully typed props)
- **Responsive**: md breakpoint 적용
- **Component Size**: 185 LOC (적정 수준)

### Mock Data
- **Orders with Tracking**: 4건 (ORD-001, 004, 005, 007)
- **Status Distribution**: 2 배송완료, 2 배송중
- **Carriers**: CJ대한통운 (2), 한진택배 (1), 롯데택배 (1)
- **Max Tracking Steps**: 5 steps (배송완료 주문)

---

## Lessons Learned

### What Went Well
1. **인라인 교체 패턴 재사용**: selectedOrderId와 동일한 패턴으로 trackingOrderId 구현 → 일관성 있는 코드
2. **Mock 데이터 다양성**: 배송완료/배송중 2건씩, 3개 택배사 → 다양한 상태 테스트 가능
3. **참고 이미지 기반 설계**: 사용자 제공 참고 이미지로 UI 구조 명확화

### To Apply Next Time
1. 인라인 교체 뷰가 3개 이상이면 view state enum 패턴 고려 (현재: selectedOrderId, trackingOrderId 별도 관리)
2. FAQ 콘텐츠는 데이터 파일로 분리 고려 (현재: 컴포넌트 내 하드코딩)

---

## Files Summary

### Type Definitions

| Type | Purpose |
|------|---------|
| ShippingTrackingStep | 배송 추적 단계 (datetime, location, status) |
| ShippingTrackingInfo | 배송 추적 전체 정보 (택배사, 수취인, steps 등) |

### Component Props

| Component | Props |
|-----------|-------|
| BookOrderShippingTracker | tracking: ShippingTrackingInfo, onBack: () => void |

---

## Related Context

이 기능은 도서 구매내역(BookOrderSection) 대규모 리팩토링의 일부로 구현됨:
- 테이블 → 카드 기반 레이아웃 전환
- 날짜별 주문 그룹핑
- 주문 상태 체계 변경 (결제대기/결제완료 제거, 취소/반품 추가)
- 배송 조회 / 교환,반품 신청 / 리뷰 작성 3개 버튼 배치
- 배송완료 아이콘 변경 (Truck → PackageCheck → Home → CheckCircle)

---

**Report Generated**: 2026-03-15
**Project**: BIZSCHOOL
**Level**: Starter
**Status**: Complete
