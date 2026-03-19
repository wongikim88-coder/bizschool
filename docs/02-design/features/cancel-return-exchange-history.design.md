# Design: 취소/반품/교환/환불내역 메뉴

## 1. 아키텍처 개요

```
/mypage?tab=claims
│
├── ClaimsSection (메인 컨테이너)
│   ├── [목록 뷰] ClaimsList
│   │   ├── 서브탭: "취소/반품/교환" | "무통장환불"
│   │   ├── 안내 문구 + 고객센터 링크
│   │   └── 내역 카드 리스트 (ClaimCard)
│   │
│   ├── [상세 뷰] ClaimDetail
│   │   ├── CancelDetail (취소 상세)
│   │   ├── ReturnDetail (반품 상세)
│   │   └── ExchangeDetail (교환 상세)
│   │
│   └── [모달들]
│       ├── CancelReceiptModal (취소영수증 조회/발급)
│       ├── PickupChangeModal (회수 예정일/요청사항 변경)
│       └── CancelConfirmModal (반품/교환 철회 확인)
│
├── CancelWizard (취소 신청 위자드 - BookOrderSection에서 진입)
│   ├── Step 1: 상품 선택
│   ├── Step 2: 취소 사유 선택
│   ├── Step 3: 해결방법 선택 + 환불 정보 확인
│   ├── 확인 모달
│   └── 완료 페이지
```

## 2. 타입 정의

### 2.1 MypageTab 확장

```typescript
// src/types/index.ts
export type MypageTab = "profile" | "inquiry" | "courses" | "purchases" | "claims";
```

### 2.2 클레임 관련 타입

```typescript
// src/types/index.ts 에 추가

// ── 취소/반품/교환/환불내역 ──

export type ClaimType = "cancel" | "return" | "exchange";
export type ClaimStatus =
  | "취소완료"       // 취소 완료
  | "취소접수"       // 취소 접수 중
  | "반품"          // 반품 접수
  | "반품완료"       // 반품 완료
  | "교환진행"       // 교환 진행 중
  | "교환완료"       // 교환 완료
  | "교환철회";      // 교환 철회

export type ClaimSubTab = "claims" | "bankRefund";

export type CancelReason =
  | "wrong-address"      // 배송지를 잘못 입력함
  | "not-satisfied"      // 상품이 마음에 들지 않음 (단순변심)
  | "reorder"            // 다른 상품 추가 후 재주문 예정
  ;

export type CancelResolution =
  | "change-address"     // 배송지 변경하고 주문 유지
  | "cancel"             // 취소
  ;

export type PickupRequestLocation = "door" | "security" | "other";

// 클레임 내역 아이템 (목록용)
export interface ClaimItem {
  id: string;
  claimType: ClaimType;
  claimStatus: ClaimStatus;
  claimDate: string;          // 접수일 (YYYY/M/D)
  orderDate: string;          // 주문일
  orderNumber: string;        // 주문번호
  product: {
    name: string;
    description: string;
    imageUrl: string;
    quantity: number;
    price: number;
  };
  refundExpectedDate?: string;       // 환불 예정일
  refundExpectedDescription?: string; // "3/19(목) 이내" 등
  refundMethod?: string;             // "카드사 환불 완료 예정" 등
}

// 취소 상세 정보
export interface CancelDetailInfo {
  claimItem: ClaimItem;
  cancelReceiptDate: string;     // 취소접수일자
  cancelReceiptNumber: string;   // 취소접수번호
  cancelCompleteDate?: string;   // 취소완료일
  cancelReason: string;          // 취소 사유 텍스트
  refund: RefundInfo;
}

// 반품 상세 정보
export interface ReturnDetailInfo {
  claimItem: ClaimItem;
  returnReceiptDate: string;     // 반품접수일자
  returnReceiptNumber: string;   // 반품접수번호
  pickupInfo: PickupInfo;        // 상품 회수정보
  shippingInfo: ShippingReturnInfo; // 반송장정보
  pickupSchedule: PickupScheduleInfo; // 회수 예정일/요청사항
  returnReason: string;          // 반품 사유
  refund: RefundInfo;
}

// 교환 상세 정보
export interface ExchangeDetailInfo {
  claimItem: ClaimItem;
  exchangeReceiptDate: string;      // 교환접수일자
  exchangeReceiptNumber: string;    // 교환접수번호
  exchangeDeliveryInfo: {           // 교환 상품 배송정보
    deliveryStatus: string;
    deliveryCarrier: string;
  };
  pickupInfo: PickupInfo;           // 상품 회수정보
  shippingInfo: ShippingReturnInfo; // 반송장정보
  pickupSchedule: PickupScheduleInfo;
  exchangeReason: string;           // 교환 사유
}

// 공통: 환불 정보
export interface RefundInfo {
  productAmount: number;     // 상품금액
  shippingFee: number;       // 배송비
  returnFee: number;         // 반품비
  refundMethod: string;      // 환불 수단
  refundAmount: number;      // 환불 금액
  isCompleted: boolean;      // 환불 완료 여부
}

// 공통: 회수 정보
export interface PickupInfo {
  pickupPerson: string;          // 회수인
  phone: string;                 // 휴대폰
  contact: string;               // 연락처
  address: string;               // 주소
}

// 공통: 반송장 정보
export interface ShippingReturnInfo {
  carrier: string;               // 택배기사
  trackingNumber: string;        // 송장번호
}

// 공통: 회수 예정일/요청사항
export interface PickupScheduleInfo {
  pickupDate: string;                    // 회수 예정일
  pickupRequest: PickupRequestLocation;  // 요청사항
  pickupRequestText?: string;            // "그 외 장소" 시 텍스트
}

// 취소 신청 위자드 폼 상태
export interface CancelWizardFormState {
  // Step 1
  selectedOrderIds: string[];
  // Step 2
  cancelReason: CancelReason | null;
  // Step 3
  resolution: CancelResolution | null;
  addToCart: boolean;                   // 장바구니 다시 담기
}

// 취소영수증 정보
export interface CancelReceiptInfo {
  productCancelAmount: number;    // 상품 취소 금액
  discountDeduction: number;      // 할인금액 차감
  shippingFee: number;            // 배송비
  totalRefundAmount: number;      // 총 환불 금액
  receiptMethod: string;          // 신용카드 등
  receiptAmount: number;          // 영수증 금액
  receiptLink?: string;           // 카드 취소영수증 링크
}
```

## 3. 컴포넌트 설계

### 3.1 ClaimsSection.tsx (메인 컨테이너)

```
┌─────────────────────────────────────────────────┐
│ 취소/반품/교환/환불내역                              │
│                                                 │
│  ┌──────────────────┬──────────────────┐        │
│  │  취소/반품/교환    │   무통장환불       │        │
│  └──────────────────┴──────────────────┘        │
│                                                 │
│  - 취소/반품/교환 신청한 내역을 확인할 수 있습니다.     │
│  - 하단 상품목록에 없는 상품은 1:1문의 또는          │
│    고객센터(1577-7011)로 문의주세요.                │
│                                    취소/반품 안내 > │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ 취소접수일: 2026/3/19 | 주문일: 2026/3/19  │    │
│  │ 주문번호: 2110017866L                     │    │
│  │                                         │    │
│  │ [img] 상품명                    1개      │    │
│  │       상세설명               3,200 원    │    │
│  │                                         │    │
│  │                     취소완료             │    │
│  │                     3/19(목) 이내        │    │
│  │                     카드사               │    │
│  │                     환불 완료 예정   [취소상세] │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ 교환접수일: 2026/3/19 | 주문일: 2026/3/11  │    │
│  │ 주문번호: 2110017692L                     │    │
│  │                                         │    │
│  │ [img] 상품명                    1개      │    │
│  │       상세설명               9,890 원    │    │
│  │                                         │    │
│  │                     교환철회   [교환상세]  │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

**Props:**
```typescript
interface ClaimsSectionProps {
  // 내부 state로 관리 (목록/상세 뷰 전환)
}
```

**State:**
```typescript
const [activeSubTab, setActiveSubTab] = useState<ClaimSubTab>("claims");
const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
const [selectedClaimType, setSelectedClaimType] = useState<ClaimType | null>(null);
```

### 3.2 ClaimDetail.tsx (상세 페이지)

내부에서 claimType에 따라 취소/반품/교환 상세를 분기 렌더링.

#### 3.2.1 취소 상세 레이아웃

```
┌─────────────────────────────────────────────────┐
│ 취소/반품/교환/환불내역 상세                          │
│ 주문일: 2026/3/19 | 주문번호: 2110017866r          │
│                                                 │
│  ┌──────────┬────────┬──────────┐               │
│  │   상품    │  금액   │ 진행 상태  │               │
│  ├──────────┼────────┼──────────┤               │
│  │[img] 이름 │ 1개    │ 취소완료   │               │
│  │     설명  │3,200원 │ 3/19(목)  │               │
│  │          │        │ 이내      │               │
│  │          │        │ 카드사    │               │
│  │          │        │환불완료예정│  [취소상세]    │
│  └──────────┴────────┴──────────┘               │
│                                                 │
│  ┌ 상세정보 ────────────────────────┐            │
│  │ 취소접수일자    2026/3/19         │            │
│  │ 취소접수번호    1671085           │            │
│  │ 취소완료일      2026/3/19         │            │
│  └──────────────────────────────────┘            │
│                                                 │
│  ┌ 취소 사유 ───────────────────────┐            │
│  │ 취소 사유    필요 없어짐 (단순 변심) │            │
│  └──────────────────────────────────┘            │
│                                                 │
│  ┌ 환불안내 ────────────────────────┐ [취소영수증] │
│  │ 상품금액      3,200 원 │환불수단  │            │
│  │ 배송비           0 원 │현대비자  │            │
│  │ 반품비           0 원 │개인/일시불│            │
│  │                      │ 3,200원  │            │
│  │              환불 완료  3,200원   │            │
│  └──────────────────────────────────┘            │
│  ⓘ 카드사로 결제 취소 요청이 전달된 후               │
│    환불까지 평일 기준 3~7일이 소요됩니다.              │
│                                                 │
│              [ 목록 ]                            │
└─────────────────────────────────────────────────┘
```

#### 3.2.2 반품 상세 레이아웃

```
┌─────────────────────────────────────────────────┐
│ 취소/반품/교환/환불내역 상세                          │
│ 주문일: 2026/3/11 | 주문번호: 2110017692L          │
│                                                 │
│  ┌──────────┬────────┬──────────────────┐       │
│  │   상품    │  금액   │    진행 상태       │       │
│  ├──────────┼────────┼──────────────────┤       │
│  │[img] 이름 │ 1개    │ 반품   [회수조회]   │       │
│  │     설명  │9,890원 │       [반품철회]   │       │
│  └──────────┴────────┴──────────────────┘       │
│                                                 │
│  ┌ 상세정보 ────────────────────────┐            │
│  │ 반품접수일자    2026/3/19         │            │
│  │ 반품접수번호    1671061x          │            │
│  └──────────────────────────────────┘            │
│                                                 │
│  ┌ 상품 회수정보 ──────────────────────────┐      │
│  │         상품회수요청    │  반송장정보      │      │
│  │ 상품회수 진행여부       │                │      │
│  │ 회수인    김○○          │ 택배기사  쿠친  │      │
│  │ 휴대폰    010-xxxx     │ 송장번호 xxxxx │      │
│  │ 연락처    010-xxxx     │                │      │
│  │ 주소      경기도 성남시  │                │      │
│  └────────────────────────────────────────┘      │
│                                                 │
│  ┌ 회수 예정일 / 요청사항 ───── [변경하기 >]┐      │
│  │ 회수 예정일    2026/3/20(금)             │      │
│  │ 회수 요청사항  문 앞                     │      │
│  └────────────────────────────────────────┘      │
│                                                 │
│  ┌ 반품 사유 ───────────────────────┐            │
│  │ 반품 사유    필요 없어짐           │            │
│  └──────────────────────────────────┘            │
│                                                 │
│  ┌ 환불안내 ────────────────────────┐ [취소영수증] │
│  │ 상품금액      9,890원 │환불수단   │            │
│  │ 배송비           0원  │현대카드/  │            │
│  │ 반품비           0원  │일시불     │            │
│  │                      │ 9,890원  │            │
│  │          환불 예상금액  9,890원    │            │
│  └──────────────────────────────────┘            │
│  ⓘ 카드사로 결제 취소 요청이 전달된 후               │
│    환불까지 평일 기준 3~7일이 소요됩니다.              │
│                                                 │
│              [ 목록 ]                            │
└─────────────────────────────────────────────────┘
```

#### 3.2.3 교환 상세 레이아웃

```
┌─────────────────────────────────────────────────┐
│ 취소/반품/교환/환불내역 상세                          │
│ 주문일: 2026/3/11 | 주문번호: 2110017692L          │
│                                                 │
│  ┌──────────┬────────┬──────────────────┐       │
│  │   상품    │  금액   │    진행 상태       │       │
│  ├──────────┼────────┼──────────────────┤       │
│  │[img] 이름 │ 1개    │ 교환진행 [교환철회]  │       │
│  │     설명  │9,890원 │                  │       │
│  └──────────┴────────┴──────────────────┘       │
│                                                 │
│  ┌ 상세정보 ────────────────────────┐            │
│  │ 교환접수일자    2026/3/19         │            │
│  │ 교환접수번호    910038098992      │            │
│  └──────────────────────────────────┘            │
│                                                 │
│  ┌ 교환 상품 배송정보 ─────────────────────┐      │
│  │         배송 진행 상태  │  배송운송장 정보  │      │
│  │ 상품준비중              │                │      │
│  │ 회수인    김○○          │ 택배기사  쿠친  │      │
│  │ 휴대폰    010-xxxx     │ 송장번호        │      │
│  │ 연락처    010-xxxx     │                │      │
│  │ 주소      경기도 성남시  │                │      │
│  └────────────────────────────────────────┘      │
│                                                 │
│  ┌ 상품 회수정보 ──────────────────────────┐      │
│  │ (반품 상세와 동일 구조)                   │      │
│  └────────────────────────────────────────┘      │
│                                                 │
│  ┌ 회수 예정일 / 요청사항 ───── [변경하기 >]┐      │
│  │ 회수 예정일    2026/3/20(금)             │      │
│  │ 회수 요청사항  문 앞                     │      │
│  └────────────────────────────────────────┘      │
│                                                 │
│  ┌ 교환 사유 ───────────────────────┐            │
│  │ 교환 사유    내가 주문한 상품과 아예  │            │
│  │             다른 상품이 배송됨     │            │
│  └──────────────────────────────────┘            │
│                                                 │
│              [ 목록 ]                            │
└─────────────────────────────────────────────────┘
```

### 3.3 CancelWizard.tsx (취소 신청 위자드)

```
Step 1: 상품 선택
┌─────────────────────────────────────────┐
│ 취소 신청                                │
│                                         │
│  상품을 선택해 주세요                      │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │ [✓] [img] 로켓 내일 상품명, 수량   │   │
│  │                            1개   │   │
│  └──────────────────────────────────┘   │
│                                         │
│          [ 다음 단계 > ]                  │
└─────────────────────────────────────────┘

Step 2: 취소 사유 선택
┌─────────────────────────────────────────┐
│ 취소 신청                                │
│                                         │
│  취소 사유를 선택해주세요                   │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │ ○ 배송지를 잘못 입력함              │   │
│  │ ○ 상품이 마음에 들지 않음 (단순변심)  │   │
│  │ ○ 다른 상품 추가 후 재주문 예정      │   │
│  └──────────────────────────────────┘   │
│                                         │
│  [< 이전 단계]         [ 다음 단계 > ]    │
└─────────────────────────────────────────┘

Step 3: 해결방법 선택 (사유가 "배송지 잘못 입력"인 경우)
┌─────────────────────────────────────────┐
│ 취소 신청                                │
│                                         │
│  ┌ 선택한 상품 1건 ─────────────────┐   │
│  │ [img] 상품명        1개 3,200원  │   │
│  │ 선택한 사유: 배송지를 잘못 입력함    │   │
│  └──────────────────────────────────┘   │
│                                         │
│  어떤 해결방법을 원하세요?                  │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │ ● 배송지 변경하고 주문 유지          │   │
│  │   [ 배송지 변경하기 ]               │   │
│  │                                  │   │
│  │ ○ 취소                            │   │
│  └──────────────────────────────────┘   │
│                                         │
│  [< 이전 단계]            [ 신청하기 ]    │
└─────────────────────────────────────────┘

Step 3: 해결방법 선택 (사유가 "단순변심" 등인 경우 → 취소만 가능)
┌─────────────────────────────────────────┐
│ 취소 신청                                │
│                                         │
│  ┌ 선택한 상품 1건 ─────────────────┐   │
│  │ [img] 상품명        1개 3,200원  │   │
│  │ 선택한 사유: 상품이 마음에 들지 않음 │   │
│  └──────────────────────────────────┘   │
│                                         │
│  환불 정보를 확인해주세요                   │
│                                         │
│  ┌ 환불안내 ────────────────────────┐   │
│  │ 상품금액          3,200 원        │   │
│  │ 배송비               0 원        │   │
│  │ 반품비               0 원        │   │
│  │ 환불 예상금액      3,200 원       │   │
│  │ 환불 수단   현대비자개인/일시불     │   │
│  │                    3,200 원      │   │
│  └──────────────────────────────────┘   │
│                                         │
│  [< 이전 단계]            [ 신청하기 ]    │
└─────────────────────────────────────────┘

확인 모달
┌──────────────────────────────┐
│                              │
│   취소 신청하시겠습니까?        │
│   [✓] 장바구니 다시 담기       │
│                              │
│   [ 취소 ]     [ 확인 ]       │
└──────────────────────────────┘

완료 페이지
┌─────────────────────────────────────────┐
│ 취소 신청                                │
│                                         │
│     취소 신청이 완료되었습니다.              │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │ 취소 상품 1건                      │   │
│  │ [img] 상품명        1개 3,200원   │   │
│  │                                  │   │
│  │ 환불 예정일  평일 3~7일 이내        │   │
│  │ 환불 수단    신용카드/체크카드       │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │ 카드사로 결제취소요청이 전달되었습니다│   │
│  └──────────────────────────────────┘   │
│                                         │
│  주문 취소 신청 과정이 만족스러웠나요?       │
│       ☆ ☆ ☆ ☆ ☆                        │
│                                         │
│  [ 신청내역 확인하기 ]  [ 쇼핑 계속하기 ]   │
└─────────────────────────────────────────┘
```

### 3.4 모달 컴포넌트

#### 취소영수증 조회/발급 모달

```
┌─────────────────────────────────────────────────┐
│  취소영수증 조회/발급                          × │
│                                                 │
│  ┌─────────┬──────────┬──────┬──────────┐      │
│  │상품취소금액│할인금액차감│ 배송비│총환불금액   │      │
│  ├─────────┼──────────┼──────┼──────────┤      │
│  │ 3,200원  │   0원    │  0원 │  3,200원  │      │
│  └─────────┴──────────┴──────┴──────────┘      │
│                                                 │
│  취소영수증 출력          신용카드    3,200 원     │
│                                                 │
│  쿠팡(주) 카드 취소영수증  쿠팡(주)    3,200 원    │
│                                                 │
│  ⓘ 부분취소 후, 상품별 할인쿠폰 적용 금액이        │
│    변경되어 신용카드 사용액 중 일부가 취소되었습니다.  │
└─────────────────────────────────────────────────┘
```

#### 회수 예정일/요청사항 변경 모달

```
┌──────────────────────────────────┐
│  회수 예정일 / 요청사항            │
│                                  │
│  회수 예정일                      │
│  2026/3/20(금)                   │
│                                  │
│  회수 요청사항                    │
│  ● 문 앞                         │
│  ○ 경비실                        │
│  ○ 그 외 장소 (예: 계단 밑 옥상 등) │
│                                  │
│  [ 이전 돌아가기 ]    [ 확인 ]     │
└──────────────────────────────────┘
```

## 4. 데이터 설계

### 4.1 Mock 데이터 구조

```typescript
// src/data/mypage.ts 에 추가

export const mockClaimItems: ClaimItem[] = [
  {
    id: "claim-001",
    claimType: "cancel",
    claimStatus: "취소완료",
    claimDate: "2026/3/19",
    orderDate: "2026/3/19",
    orderNumber: "2110017866L",
    product: {
      name: "리빙웰 자작나무 양면 이쑤시개",
      description: "리빙웰 자작나무 양면 이쑤시개, 500개입, 2개",
      imageUrl: "/images/products/toothpick.jpg",
      quantity: 1,
      price: 3200,
    },
    refundExpectedDescription: "3/19(목) 이내",
    refundMethod: "카드사 환불 완료 예정",
  },
  {
    id: "claim-002",
    claimType: "exchange",
    claimStatus: "교환철회",
    claimDate: "2026/3/19",
    orderDate: "2026/3/11",
    orderNumber: "2110017692L",
    product: {
      name: "탐사 투명 PET 아이스컵 + 스트로우프리 뚜껑 (국내 생산)",
      description: "탐사 투명 PET 아이스컵 + 스트로우프리 뚜껑 (국내 생산), 410ml, 100개",
      imageUrl: "/images/products/cup.jpg",
      quantity: 1,
      price: 9890,
    },
  },
  {
    id: "claim-003",
    claimType: "return",
    claimStatus: "반품",
    claimDate: "2026/3/19",
    orderDate: "2026/3/11",
    orderNumber: "2110017692",
    product: {
      name: "탐사 투명 PET 아이스컵 + 스트로우프리 뚜껑 (국내 생산)",
      description: "탐사 투명 PET 아이스컵 + 스트로우프리 뚜껑 (국내 생산), 410ml, 100개",
      imageUrl: "/images/products/cup.jpg",
      quantity: 1,
      price: 9890,
    },
  },
  // 추가 mock 데이터...
];
```

## 5. 라우팅 설계

### URL 패턴

| URL | 뷰 |
|-----|-----|
| `/mypage?tab=claims` | 취소/반품/교환/환불내역 목록 |
| `/mypage?tab=claims` (내부 state) | 상세 뷰 (컴포넌트 내 state 전환) |
| `/mypage?tab=purchases` (내부 state) | 취소 신청 위자드 (BookOrderSection에서 진입) |

### 탭 메뉴 순서

```
내 정보 | 1:1 문의 | 수강내역 | 구매내역 | 취소/반품/교환/환불내역
```

## 6. 구현 순서

| 순서 | 작업 | 파일 | 의존성 |
|-----|------|------|--------|
| 1 | 타입 정의 | `src/types/index.ts` | 없음 |
| 2 | Mock 데이터 추가 | `src/data/mypage.ts` | 1 |
| 3 | MypageTab 확장 + 라우팅 | `page.tsx`, `MypageSidebar`, `MypageContent` | 1 |
| 4 | ClaimsSection (목록) | `ClaimsSection.tsx` | 2, 3 |
| 5 | ClaimDetail (상세) | `ClaimDetail.tsx` | 2, 4 |
| 6 | CancelWizard (취소 신청) | `CancelWizard.tsx` | 2 |
| 7 | BookOrderSection 연동 | `BookOrderSection.tsx` | 6 |
| 8 | 모달들 | ClaimsSection 내부 | 5 |

## 7. 스타일 가이드

- 기존 프로젝트의 CSS 변수 사용: `--color-primary`, `--color-dark`, `--color-border`, `--color-body`, `--color-muted`, `--color-light-bg`
- 반응형: `md:` 브레이크포인트 (768px) 기준
- 테이블: `border-collapse` + `border-[var(--color-border)]`
- 카드: `rounded-lg border border-[var(--color-border)] bg-white p-6`
- 버튼:
  - Primary: `bg-[var(--color-primary)] text-white rounded-lg px-6 py-2.5`
  - Secondary: `border border-[var(--color-border)] text-[var(--color-body)] rounded-lg px-6 py-2.5`
  - Outline: `border border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg px-4 py-1.5 text-sm`
- 금액 강조: `text-red-500 font-bold` (환불 금액)
- 상태 뱃지: 텍스트로 표시 (배경색 없이)

## 8. 접근성

- 모든 버튼에 명시적 `type="button"`
- 탭 패널에 `role="tabpanel"`, 탭 버튼에 `role="tab"`, `aria-selected`
- 모달: `Escape` 키로 닫기, `aria-modal="true"`, `role="dialog"`
- 테이블: `<table>`, `<thead>`, `<tbody>`, `<th scope="col">` 사용
- 폼 요소: `<label>` 연결 + `aria-required`
