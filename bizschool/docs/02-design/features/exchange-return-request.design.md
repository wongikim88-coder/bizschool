# Design: 교환/반품 신청 페이지

## 개요

| 항목 | 내용 |
|------|------|
| **Feature** | exchange-return-request |
| **Plan 참조** | `docs/01-plan/features/exchange-return-request.plan.md` |
| **작성일** | 2026-03-15 |
| **설계자** | Frontend Architect + Claude |

## 컴포넌트 아키텍처

### 컴포넌트 트리

```
BookOrderSection (기존)
  └─ [returnOrderId !== null] 조건부 렌더링
       └─ ExchangeReturnWizard (루트 위자드)
            ├─ Header (제목 "교환/반품 신청" + 돌아가기 버튼)
            ├─ StepIndicator (① 상품 선택 — ② 사유 선택 — ③ 해결방법 선택)
            ├─ [step === 1] Step1ProductSelect
            │   ├─ 안내 배너 (amber, AlertCircle)
            │   ├─ 상품 체크박스 목록 (ul > li > label)
            │   └─ "다음 단계" CTA
            ├─ [step === 2] Step2ReasonSelect
            │   ├─ 사유 유형 선택 (3-column grid 버튼)
            │   ├─ 세부 사유 선택 (RadioOption fieldset)
            │   └─ 이전/다음 네비게이션
            ├─ [step === 3] Step3Resolution
            │   ├─ 신청 내역 요약 카드
            │   ├─ 해결방법 선택 (RadioOption fieldset)
            │   ├─ 수거 정보 (주소, 예정일)
            │   ├─ 수거 요청 장소 (3-column icon grid)
            │   ├─ [기타 선택 시] 텍스트 입력
            │   ├─ 안내 문구 (반품 조건)
            │   └─ 이전/신청하기 네비게이션
            └─ [submitted] ConfirmationView
                ├─ 성공 배너 (green, CheckCircle2)
                ├─ 신청 내용 요약 (dl)
                └─ "주문/배송 목록" 버튼
```

### 파일 구조

| 파일 | 역할 | 라인 수 |
|------|------|---------|
| `src/components/mypage/ExchangeReturnWizard.tsx` | 위자드 전체 (단일 파일) | ~950 |
| `src/components/mypage/BookOrderSection.tsx` | 진입점 통합 (기존 수정) | 변경 ~20줄 |

**설계 결정**: 컴포넌트를 단일 파일로 유지. 프로젝트의 기존 패턴(BookOrderDetail, BookOrderShippingTracker)과 동일하게 관련 서브 컴포넌트를 같은 파일에 정의.

## 타입 설계

```typescript
// ── 도메인 타입 (ExchangeReturnWizard.tsx 내부 정의) ──

export type ReturnReasonCategory = "단순변심" | "배송문제" | "상품문제";
export type ReturnResolution = "교환" | "반품후환불";
export type PickupLocation = "문앞" | "경비실" | "기타";

export interface ReturnReasonOption {
  id: string;                        // "r01" ~ "r09"
  category: ReturnReasonCategory;
  label: string;
}

export interface WizardFormState {
  selectedOrderIds: string[];         // Step 1: 선택된 주문 ID
  reasonCategory: ReturnReasonCategory | null;  // Step 2: 사유 카테고리
  reasonId: string | null;            // Step 2: 세부 사유 ID
  resolution: ReturnResolution | null; // Step 3: 해결방법
  pickupLocation: PickupLocation | null; // Step 3: 수거 장소
  pickupEtcText: string;             // Step 3: 기타 장소 텍스트
}
```

**설계 결정**: types/index.ts에 추가하지 않고 위자드 파일 내부에 타입 정의. 이유: 이 타입들은 위자드 내부에서만 사용되며, WizardFormState만 BookOrderSection의 onSubmit 콜백으로 전달.

## 상태 관리 설계

### 상태 구조

```
ExchangeReturnWizard (루트)
├── step: 1 | 2 | 3          ← 현재 단계
├── submitted: boolean        ← 신청 완료 여부
└── formState: WizardFormState ← 폼 전체 상태 (단일 useState)
```

### 상태 흐름

```
Step 1                    Step 2                    Step 3
─────────                 ─────────                 ─────────
selectedOrderIds[]  ──→   reasonCategory     ──→    resolution
                          reasonId                  pickupLocation
                                                    pickupEtcText
                                                         │
                                                    ──→ onSubmit(formState)
                                                         │
                                                    ConfirmationView
```

### 유효성 검사 규칙

| Step | 조건 | "다음" 버튼 상태 |
|------|------|-------------------|
| 1 | `selectedOrderIds.length > 0` | disabled/enabled |
| 2 | `reasonCategory !== null && reasonId !== null` | disabled/enabled |
| 3 | `resolution !== null && pickupLocation !== null && (pickupLocation !== "기타" \|\| pickupEtcText.trim())` | disabled/enabled |

### 특수 동작

- **카테고리 변경 시**: `reasonId`를 null로 리셋 (이전 카테고리의 사유가 남지 않도록)
- **수거 장소 변경 시**: "기타"가 아닌 옵션 선택 시 `pickupEtcText`를 빈 문자열로 리셋

## 통합 설계

### BookOrderSection 연결

기존 `selectedOrderId`/`trackingOrderId` 패턴과 동일한 조건부 렌더링:

```typescript
// BookOrderSection 내부
const [returnOrderId, setReturnOrderId] = useState<string | null>(null);

// 렌더링 우선순위:
if (returnOrderId !== null) return <ExchangeReturnWizard ... />;
if (trackingOrderId) return <BookOrderShippingTracker ... />;
if (selectedOrderId) return <BookOrderDetail ... />;
return <OrderList />; // 기본
```

### Props 인터페이스

```typescript
interface ExchangeReturnWizardProps {
  initialOrderId?: string;           // 클릭한 주문 ID (사전 선택)
  eligibleOrders: BookOrder[];       // 배송완료 상태 주문 목록
  onBack: () => void;                // 목록으로 복귀
  onSubmit: (state: WizardFormState) => void;  // 신청 완료 콜백
}
```

## UI 상세 설계

### StepIndicator

- 3단계 수평 레이아웃 (flex)
- 원형 번호 (h-9 w-9, rounded-full)
- 완료 단계: `CheckCircle2` 아이콘 + primary 배경
- 현재 단계: 숫자 + primary 배경 + `ring-4` 외곽선
- 미진행 단계: 숫자 + gray-100 배경
- 단계 간 연결선: `h-0.5` 가로선 (완료=primary, 미완료=gray-200)
- `aria-current="step"` 접근성 지원

### Step1: 상품 선택

- 안내 배너: amber-50 배경, AlertCircle 아이콘
- 상품 목록: 카드 내 ul/li, 각 항목 label로 전체 클릭 가능
- 체크박스: sr-only native input + 커스텀 시각적 체크박스 (5x5, rounded, primary 색)
- 상품 정보: 도서 아이콘(BookOpen) + 제목(line-clamp-2) + 저자 + 수량/가격/주문일
- 선택 시: `bg-[var(--color-primary-light)]` 배경 하이라이트
- CTA: 우측 정렬, primary 배경, disabled 시 opacity-40

### Step2: 사유 선택

- 카테고리 버튼: 3-column grid, pill 스타일
  - 선택: primary 배경 + 흰 텍스트
  - 미선택: white 배경 + border, hover 시 primary 틴트
- 세부 사유: RadioOption 컴포넌트 목록 (fieldset)
  - 선택: primary border + primary-light 배경
  - 미선택: border + white, hover 시 primary/50 border
  - CheckCircle2/Circle 아이콘으로 시각적 표시
- 카테고리 변경 시 세부 목록 즉시 전환

### Step3: 해결방법 선택

**4개 섹션:**

1. **신청 내역 요약**: 선택 상품 리스트 + 사유 표시
2. **해결방법 선택**: RadioOption 2개 (교환, 반품 후 환불) + 각각 설명 텍스트
3. **수거 정보**: dl(정의 목록) - 주소(MapPin), 예정일(Calendar)
4. **수거 요청 장소**: 3-column icon grid (Home/Shield/MoreHorizontal)
   - "기타" 선택 시 텍스트 입력 표시
5. **안내 문구**: 반품 조건 (미개봉/미사용, 왕복 배송비)

### ConfirmationView (신청 완료)

- 성공 배너: green-50 배경, CheckCircle2(48px), 제목 + 안내 문구
- 신청 내용 dl: 상품 수, 사유, 해결방법, 수거 장소
- "주문/배송 목록" 버튼: 중앙 정렬, primary

## 사유 목록 데이터

```typescript
const REASON_OPTIONS: ReturnReasonOption[] = [
  // 단순변심
  { id: "r01", category: "단순변심", label: "단순 변심 (마음이 바뀜)" },
  { id: "r02", category: "단순변심", label: "다른 제품 구매 예정" },
  { id: "r03", category: "단순변심", label: "가격 불만족" },
  // 배송문제
  { id: "r04", category: "배송문제", label: "배송 지연" },
  { id: "r05", category: "배송문제", label: "배송 중 파손" },
  { id: "r06", category: "배송문제", label: "오배송 (다른 상품 수령)" },
  // 상품문제
  { id: "r07", category: "상품문제", label: "상품 불량/하자" },
  { id: "r08", category: "상품문제", label: "상품 설명과 다름" },
  { id: "r09", category: "상품문제", label: "구성품 누락" },
];
```

## 재사용 컴포넌트

### RadioOption

범용 라디오 옵션 컴포넌트 (Step 2, Step 3에서 재사용):

```typescript
interface RadioOptionProps {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}
```

- sr-only native input + 시각적 카드 label
- CheckCircle2 (선택) / Circle (미선택) 아이콘
- 선택 시 border-primary + bg-primary-light

## 접근성 설계

| 요소 | ARIA 속성 | 설명 |
|------|-----------|------|
| StepIndicator 현재 단계 | `aria-current="step"` | 현재 위치 표시 |
| RadioOption native input | `sr-only` + visible label | 스크린리더 접근성 |
| 체크박스 native input | `sr-only` + custom visual | 스크린리더 접근성 |
| 사유 라디오 그룹 | `<fieldset>` + `<legend className="sr-only">` | 그룹 레이블 |
| 비활성 버튼 | `aria-disabled` + `disabled` | 이중 비활성 표시 |
| 아이콘 | `aria-hidden="true"` | 장식용 아이콘 숨김 |

## 반응형 설계

위자드는 기본적으로 모바일 퍼스트로 설계:

- **상품 목록**: 수직 스택 (flex-col), 모바일에서도 동일 레이아웃
- **카테고리 버튼**: `grid-cols-3` (모든 뷰포트에서 3열 유지, 한국어 짧은 레이블)
- **수거 장소**: `grid-cols-3` (아이콘 + 2~3자 레이블)
- **네비게이션 버튼**: `flex justify-between` (양 끝 정렬)
- **카드**: `rounded-2xl` + `p-5` (데스크톱/모바일 동일)

## 구현 순서

1. `ExchangeReturnWizard.tsx` 생성 (타입 + 정적 데이터 + 서브 컴포넌트 + 루트)
2. `BookOrderSection.tsx` 수정 (returnOrderId 상태 + 핸들러 + 조건부 렌더링 + import)
3. 브라우저 테스트 (3단계 전체 흐름)

## 참고 이미지 대비 차이점

| 참고 이미지 | 구현 설계 | 이유 |
|-------------|-----------|------|
| 사유가 카테고리 없이 1개 리스트 | 카테고리 선택 → 세부 사유 2단계 | UX 개선: 9개 사유를 한 번에 보여주면 스크롤 길어짐 |
| 배송지 변경하기 링크 | 수거 주소 표시만 (변경 불가) | Mock 데이터 기반, 주소 변경 기능 미구현 |
| 배송 예정일 + 회수 예정일 분리 | 수거 정보로 통합 | 도서 프로젝트 특성상 배송지=회수지가 일반적 |
| 해결방법에 설명 없음 | 각 옵션에 description 추가 | UX 개선: 교환/반품의 차이 명확히 |
