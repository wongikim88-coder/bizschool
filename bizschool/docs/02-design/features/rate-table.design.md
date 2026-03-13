# 조견표 신청 페이지 설계서

## Feature: rate-table
## Created: 2026-03-02

---

## 1. 개요

세금 관련 조견표(양도·상속·증여세, 지방세)의 수량별 가격표와 신청 기능을 제공하는 페이지.

- 참고: https://www.dzbizschool.net/new/index.php?page=sub&menu=biz0402

## 2. 라우트

- **경로**: `/rate-table`
- **파일**: `src/app/rate-table/page.tsx` (Server Component)

## 3. 파일 구조

| 파일 | 구분 | 역할 |
|------|------|------|
| `src/app/rate-table/page.tsx` | 신규 (Server) | 페이지 라우트, metadata, 레이아웃 |
| `src/data/rate-table.ts` | 신규 | 상품 데이터, 타입 정의, 가격 정보 |
| `src/components/rate-table/RateTableProduct.tsx` | 신규 (Client) | 상품 카드, 라디오 수량 선택, 신청 버튼 |

## 4. 페이지 구조

```
Hero Section (blue gradient — education/training 패턴 동일)
  ├── h1: "조견표 신청"
  └── subtitle: "세무 관련 조견표를 간편하게 신청하세요. 수량별 회원 할인가로 제공됩니다."
Notice Banner (안내 문구)
  ├── "조견표 신청 완료 시 담당자가 확인 후 작성해주신 연락처로 안내 연락 드리겠습니다."
  └── 회원 기준: 이택스코리아·양도코리아 유료회원
Section 1: 양도·상속·증여세 조견표
  ├── 설명 텍스트 + 규격 정보
  ├── 무지방식 (이미지 placeholder + 가격표 + 라디오 선택 + 신청)
  └── 상호인쇄 (이미지 placeholder + 가격표 + 라디오 선택 + 신청)
Section 2: 지방세 세율 등 일람표
  ├── 설명 텍스트 + 규격 정보
  ├── 무지방식 (이미지 placeholder + 가격표 + 라디오 선택 + 신청)
  └── 상호인쇄 (이미지 placeholder + 가격표 + 라디오 선택 + 신청)
```

## 5. 데이터 설계

### 5.1 타입 정의

```typescript
interface PriceOption {
  quantity: string;      // "100장", "200장", ...
  memberPrice: number;   // 회원가 (원)
  nonMemberPrice: number; // 비회원가 (원)
}

interface ProductType {
  type: "plain" | "printed";  // 무지방식 | 상호인쇄
  label: string;
  description: string;
  prices: PriceOption[];
}

interface RateTableProduct {
  id: string;
  name: string;
  description: string;
  spec: string;              // 규격 정보
  types: ProductType[];
}
```

### 5.2 가격 데이터

**무지방식 (양도세 & 지방세 동일)**

| 수량 | 회원가 | 비회원가 |
|------|--------|---------|
| 100장 | 50,000원 | 62,000원 |
| 200장 | 100,000원 | 124,000원 |
| 300장 | 138,000원 | 169,000원 |
| 500장 | 207,000원 | 274,000원 |
| 1,000장 | 380,000원 | 495,000원 |

**상호인쇄 (양도세 & 지방세 동일)**

| 수량 | 회원가 | 비회원가 |
|------|--------|---------|
| 1,000장 | 805,000원 | 966,000원 |
| 2,000장 | 1,116,000원 | 1,310,000원 |
| 3,000장 | 1,415,000원 | 1,714,000원 |

### 5.3 상수

- `MEMBER_NOTE`: "이택스코리아·양도코리아 유료회원"
- `NOTICE_TEXT`: "조견표 신청 완료 시 담당자가 확인 후 작성해주신 연락처로 안내 연락 드리겠습니다."

## 6. 컴포넌트 설계

### 6.1 RateTableProduct (Client Component)

- Props: `name`, `description`, `spec`, `types: ProductType[]`
- 각 type마다 `TypeSection` 서브 컴포넌트 렌더링
- 2열 그리드 (`md:grid-cols-2`)

### 6.2 TypeSection (내부 컴포넌트)

- `useState`로 `selectedIdx` 관리 (기본값: 0)
- 타입 배지 (label), 설명 텍스트
- 이미지 placeholder (높이 약 176px, bg-gray-100)
- 가격표 (`<table>`)
  - thead: 수량 / 회원가 / 비회원가
  - tbody: 각 행 클릭 또는 라디오 버튼으로 선택
  - 선택된 행 하이라이트 (bg-blue-50)
- 하단 요약 영역
  - 선택된 수량 + 회원가 표시
  - 신청하기 버튼 (blue, 100% 너비)

## 7. 스타일 설계

- Hero: 기존 `education`/`training` 페이지와 동일한 blue gradient 패턴
  - `bg-gradient-to-br from-[#155dfc] to-[#0d3b9e]`
  - 장식 원형 배경 3개
- Notice: amber 계열 배너 (border-amber-200, bg-amber-50)
- 상품 카드: white bg, rounded-2xl, border-gray-200, shadow-sm
- 가격 테이블: 선택 행 bg-blue-50, 회원가 text-blue-700
- 신청하기 버튼: bg-blue-600, hover:bg-blue-700, rounded-xl
- 콘텐츠 영역: `max-w-[1200px]`, `px-4`, `pb-16`

## 8. 메타데이터

```typescript
{
  title: "조견표 신청 | BIZSCHOOL",
  description: "양도·상속·증여세 조견표, 지방세 세율 일람표를 수량별로 신청하세요. 회원 할인가 제공."
}
```

## 9. 검증 항목

- [ ] `/rate-table` 경로 접근 가능
- [ ] Hero Section 렌더링 (blue gradient)
- [ ] Notice Banner 안내 문구 표시
- [ ] 2개 상품 각각 무지방식/상호인쇄 표시
- [ ] 라디오 버튼으로 수량 선택 가능
- [ ] 선택 시 하단 요약 가격 즉시 업데이트
- [ ] 가격 데이터가 참고 URL과 일치
- [ ] 반응형: 모바일에서 1열, 데스크톱에서 2열 그리드
- [ ] 신청하기 버튼 존재
