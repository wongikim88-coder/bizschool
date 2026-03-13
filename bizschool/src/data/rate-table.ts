export interface PriceOption {
  quantity: string;
  memberPrice: number;
  nonMemberPrice: number;
}

export interface ProductType {
  type: "plain" | "printed";
  label: string;
  description: string;
  image: string;
  prices: PriceOption[];
}

export interface RateTableProduct {
  id: string;
  name: string;
  description: string;
  spec: string;
  types: ProductType[];
}

export const MEMBER_NOTE = "이택스코리아·양도코리아 유료회원";

export const NOTICE_TEXT =
  "조견표 신청 완료 시 담당자가 확인 후 작성해주신 연락처로 안내 연락 드리겠습니다.";

const plainPrices: PriceOption[] = [
  { quantity: "100장", memberPrice: 50000, nonMemberPrice: 62000 },
  { quantity: "200장", memberPrice: 100000, nonMemberPrice: 124000 },
  { quantity: "300장", memberPrice: 138000, nonMemberPrice: 169000 },
  { quantity: "500장", memberPrice: 207000, nonMemberPrice: 274000 },
  { quantity: "1,000장", memberPrice: 380000, nonMemberPrice: 495000 },
];

const printedPrices: PriceOption[] = [
  { quantity: "1,000장", memberPrice: 805000, nonMemberPrice: 966000 },
  { quantity: "2,000장", memberPrice: 1116000, nonMemberPrice: 1310000 },
  { quantity: "3,000장", memberPrice: 1415000, nonMemberPrice: 1714000 },
];

export const rateTableProducts: RateTableProduct[] = [
  {
    id: "transfer-tax",
    name: "양도·상속·증여세 조견표",
    description:
      "부동산 관련업종 종사자를 위한 홍보용 인쇄물입니다. 양도소득세·상속세·증여세 세율 및 주요 내용을 한눈에 확인할 수 있습니다.",
    spec: "아트용지 / 가로 67cm × 세로 47cm",
    types: [
      {
        type: "plain",
        label: "무지방식",
        description: "상호 없이 인쇄된 기본형 조견표",
        image: "/images/rate-table/rate-table-1.jpg",
        prices: plainPrices,
      },
      {
        type: "printed",
        label: "상호인쇄",
        description: "사무소 상호가 인쇄된 맞춤형 조견표",
        image: "/images/rate-table/rate-table-2.jpg",
        prices: printedPrices,
      },
    ],
  },
  {
    id: "local-tax",
    name: "지방세 세율 등 일람표",
    description:
      "부동산 관련업종 종사자를 위한 홍보용 인쇄물입니다. 지방세 세율 및 주요 내용을 한눈에 확인할 수 있습니다.",
    spec: "아트용지 / 가로 67cm × 세로 47cm",
    types: [
      {
        type: "plain",
        label: "무지방식",
        description: "상호 없이 인쇄된 기본형 일람표",
        image: "/images/rate-table/rate-table-3.jpg",
        prices: plainPrices,
      },
      {
        type: "printed",
        label: "상호인쇄",
        description: "사무소 상호가 인쇄된 맞춤형 일람표",
        image: "/images/rate-table/rate-table-4.jpg",
        prices: printedPrices,
      },
    ],
  },
];
