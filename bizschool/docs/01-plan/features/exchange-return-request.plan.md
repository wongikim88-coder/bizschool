# Plan: 교환/반품 신청 페이지

## 개요

| 항목 | 내용 |
|------|------|
| **Feature** | exchange-return-request |
| **설명** | 도서 구매내역에서 교환/반품 신청을 위한 3단계 위자드 페이지 |
| **작성일** | 2026-03-15 |
| **우선순위** | High |
| **예상 영향** | mypage 구매내역 기능 완성도 향상 |

## 배경 및 목적

현재 `BookOrderSection`의 주문 목록에 "교환, 반품 신청" 버튼이 존재하지만 onClick 핸들러가 없는 플레이스홀더 상태. 이 기능을 3단계 위자드(Step Wizard) 형태로 구현하여 사용자가 교환/반품을 직관적으로 신청할 수 있도록 한다.

## 기능 요구사항

### Step 1: 상품 선택

- 해당 주문의 상품 목록 표시 (체크박스로 선택)
- 상품 이미지, 이름, 수량 표시
- 최소 1개 이상 선택 시 "다음 단계" 버튼 활성화

### Step 2: 사유 선택

- 카테고리별 사유 라디오 버튼 목록:
  - **단순 변심**: 상품이 마음에 들지 않음, 더 저렴한 상품을 발견함
  - **배송문제**: 다른 상품이 배송됨
  - **상품문제**: 상품 일부에 문제가 있음, 구성품/부속품이 들어있지 않음, 상품이 설명과 다름, 상품이 파손되어 배송됨, 상품 결함/기능에 이상이 있음
- 1개 선택 필수
- "이전 단계" / "다음 단계" 버튼

### Step 3: 해결방법 선택

- 선택한 상품 요약 정보 (상품명, 수량, 가격, 선택 사유)
- 해결방법 선택 (라디오):
  - 교환
  - 반품 후 환불
- 배송/회수 정보 확인:
  - **상품 배송지**: 수령인명, 주소 (변경하기 링크)
  - **배송 예정일**: 날짜 표시
  - **상품 회수지**: 수령인명, 주소 (변경하기 링크)
  - **회수 예정일**: 날짜 표시
  - **회수 요청사항**: 문 앞 / 경비실 / 그 외 장소 (라디오)
- "이전 단계" / "신청하기" 버튼

### 공통 UI

- 상단 Step Indicator: ① 상품 선택 — ② 사유 선택 — ③ 해결방법 선택
- 현재 단계 강조 (파란색), 완료 단계 활성화, 미진행 단계 회색
- 페이지 제목: "교환, 반품 신청"
- 전체 컨테이너는 기존 BookOrderSection과 동일한 카드 스타일

## 기술 스택

| 항목 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Icons | lucide-react |
| State | React useState (로컬 상태) |
| Types | TypeScript 5 |

## 구현 범위

### 신규 파일

| 파일 | 설명 |
|------|------|
| `src/components/mypage/ExchangeReturnRequest.tsx` | 교환/반품 신청 메인 위자드 컴포넌트 |

### 수정 파일

| 파일 | 변경 내용 |
|------|-----------|
| `src/types/index.ts` | 교환/반품 관련 타입 추가 |
| `src/data/mypage.ts` | 교환/반품 사유 목록 데이터 추가 |
| `src/components/mypage/BookOrderSection.tsx` | "교환, 반품 신청" 버튼에 onClick 핸들러 연결 |

### 타입 정의 계획

```typescript
// 교환/반품 사유 카테고리
type ReturnReasonCategory = "단순변심" | "배송문제" | "상품문제";

// 교환/반품 사유
interface ReturnReason {
  id: string;
  category: ReturnReasonCategory;
  label: string;
}

// 해결방법
type ResolutionType = "교환" | "반품후환불";

// 회수 요청사항
type PickupRequest = "문앞" | "경비실" | "기타";

// 교환/반품 신청 데이터
interface ExchangeReturnFormData {
  orderId: string;
  selectedItems: string[];        // 선택 상품 ID
  reason: ReturnReason | null;    // 선택 사유
  resolution: ResolutionType | null;
  deliveryAddress: BookOrderShippingInfo;
  pickupAddress: BookOrderShippingInfo;
  deliveryDate: string;
  pickupDate: string;
  pickupRequest: PickupRequest | null;
}
```

## UI 흐름

```
BookOrderSection (주문 목록)
  └─ "교환, 반품 신청" 버튼 클릭
       └─ ExchangeReturnRequest (위자드 표시)
            ├─ Step 1: 상품 선택
            ├─ Step 2: 사유 선택
            └─ Step 3: 해결방법 선택 → "신청하기" → 완료 처리 후 목록 복귀
```

## 진입 조건

- 주문 상태가 "배송완료"인 주문만 교환/반품 신청 가능
- 기존 BookOrderSection의 버튼 조건과 동일

## 제약사항

- 프론트엔드 Mock 데이터 기반 (백엔드 API 미연동)
- 신청 완료 시 alert로 처리 후 목록으로 복귀
- 기존 디자인 시스템 (CSS 변수, Tailwind 패턴) 준수
- 외부 라이브러리 추가 없음

## 완료 기준

- [ ] 3단계 위자드 UI 정상 작동
- [ ] Step 간 이전/다음 네비게이션
- [ ] 각 Step별 유효성 검사 (선택 필수)
- [ ] 참고 이미지와 동일한 레이아웃 및 스타일
- [ ] 반응형 디자인 (모바일/데스크톱)
- [ ] 기존 코드 패턴과 일관성 유지
