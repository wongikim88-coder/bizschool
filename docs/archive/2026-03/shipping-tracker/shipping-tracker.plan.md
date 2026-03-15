# Shipping Tracker Plan

> **Feature**: shipping-tracker (배송 조회 페이지)
> **Project**: BIZSCHOOL (Next.js App Router, Starter Level)
> **Created**: 2026-03-15
> **Status**: Approved

---

## Background

도서 구매내역(BookOrderSection)의 각 주문 항목에 "배송 조회" 버튼이 존재하지만, 클릭 시 실제 배송 추적 페이지가 없었음. 사용자가 배송 현황을 확인할 수 있는 인라인 배송 조회 뷰 구현이 필요.

## Objectives

1. 배송 조회 버튼 클릭 시 배송 추적 정보를 보여주는 컴포넌트 제작
2. 기존 주문 목록/상세보기와 동일한 인라인 교체 패턴 적용
3. 택배사 정보, 수취인 정보, 배송 이력 테이블, FAQ 섹션 포함

## Scope

### In Scope
- ShippingTrackingStep, ShippingTrackingInfo 타입 정의
- 4건의 mock 배송 추적 데이터 (ORD-001, 004, 005, 007)
- BookOrderShippingTracker 컴포넌트 (상태 배너, 택배사/수취인 정보, 추적 이력, FAQ)
- BookOrderSection에서 버튼 클릭 → 추적 뷰 전환 wiring
- 추적 뷰 표시 시 서브탭 숨김 (onDetailViewChange 콜백)

### Out of Scope
- 실제 택배사 API 연동
- 실시간 배송 위치 지도
- 알림 기능

## Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| R1 | 배송 조회 버튼 클릭 시 추적 페이지 표시 | High |
| R2 | 상태 배너 (도착완료/배송중) | High |
| R3 | 택배사 + 송장번호 표시 | High |
| R4 | 수취인 정보 (이름, 주소, 요청사항, 수령방법) | High |
| R5 | 배송 이력 테이블 (시간/위치/상태) | High |
| R6 | FAQ 아코디언 섹션 | Medium |
| R7 | 브랜드 블루 돌아가기 버튼 | Medium |
| R8 | 서브탭 숨김 처리 | Medium |
| R9 | 반응형 디자인 (모바일/데스크톱) | High |
