# Shipping Tracker Design

> **Feature**: shipping-tracker (배송 조회 페이지)
> **Project**: BIZSCHOOL (Next.js App Router, Starter Level)
> **Created**: 2026-03-15
> **Status**: Approved

---

## Architecture

인라인 교체 패턴 (selectedOrderId와 동일 방식):
- BookOrderSection에서 `trackingOrderId` state 관리
- trackingOrderId가 설정되면 BookOrderShippingTracker 렌더링
- onBack 시 trackingOrderId를 null로 리셋

```
BookOrderSection
  ├─ trackingOrderId ? → BookOrderShippingTracker
  ├─ selectedOrderId ? → BookOrderDetail
  └─ default → Order List (card-based with date grouping)
```

## Type Definitions

```typescript
interface ShippingTrackingStep {
  datetime: string;
  location: string;
  status: string;
}

interface ShippingTrackingInfo {
  orderId: string;
  carrier: string;
  trackingNumber: string;
  recipientName: string;
  recipientAddress: string;
  deliveryRequest?: string;
  deliveryMethod: string;
  currentStatus: string;
  statusMessage: string;
  completedDate?: string;
  steps: ShippingTrackingStep[];
}
```

## Component Structure: BookOrderShippingTracker

### Props
```typescript
interface BookOrderShippingTrackerProps {
  tracking: ShippingTrackingInfo;
  onBack: () => void;
}
```

### Layout Sections (top to bottom)
1. **Header**: "배송 조회" 제목 + "돌아가기" 버튼 (ArrowLeft)
2. **Status Banner**: 상태 메시지 (도착완료 날짜 또는 배송중), 부가 설명
3. **Delivery Info Card**: 2-column (md breakpoint)
   - Left: Truck 아이콘 + 택배사명 + 송장번호 + 안내문
   - Right: 받는사람 / 받는주소 / 배송요청사항 / 상품수령방법 (dl/dt/dd)
4. **Tracking History Table**: grid-cols-3 (시간 / 현재위치 / 배송상태)
   - 첫 번째 행(최신) 상태는 primary 색상으로 강조
5. **FAQ Accordion**: 4개 항목, Q 마커 + ChevronDown/Up 토글
6. **Back Button**: bg-[var(--color-primary)] + 흰색 텍스트 + ArrowLeft

### Responsive Design
- Desktop (md+): 2-column delivery info, 3-column tracking table
- Mobile: 단일 컬럼, hr 구분선

## Mock Data

4건 제공: ORD-2026-001 (배송완료), ORD-2026-004 (배송중), ORD-2026-005 (배송완료), ORD-2026-007 (배송중)

## Wiring in BookOrderSection

- `trackingOrderId` useState 추가
- `handleShowTracking(id)` / `handleBackFromTracking()` 핸들러
- "배송 조회" 버튼 onClick에 handleShowTracking 바인딩 (desktop + mobile)
- onDetailViewChange 콜백으로 서브탭 숨김 처리
- 추적 데이터 없는 주문은 fallback으로 목록 복귀
