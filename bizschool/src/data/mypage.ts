import type { MockUser, Inquiry, InquiryCategory, MypageTab, MyCourse, BookOrder } from "@/types";

export const mockUser: MockUser = {
  id: "user-001",
  name: "김비즈",
  email: "biz@bizschool.co.kr",
  joinDate: "2025-11-15",
};

export const mypageTabs: { key: MypageTab; label: string }[] = [
  { key: "profile", label: "내 정보" },
  { key: "inquiry", label: "1:1 문의" },
  { key: "courses", label: "수강내역" },
  { key: "purchases", label: "구매내역" },
];

export const inquiryCategories: InquiryCategory[] = [
  "강의",
  "도서",
  "결제",
  "기술문제",
  "기타",
];

export const mockInquiries: Inquiry[] = [
  {
    id: 13,
    category: "강의",
    title: "강의 환불 절차 문의드립니다",
    content:
      "안녕하세요. 수강 중인 '세무회계 실무' 강의를 환불하고 싶은데 절차가 어떻게 되나요? 수강 시작한 지 3일 되었습니다.",
    status: "pending",
    createdAt: "2026-03-14",
  },
  {
    id: 12,
    category: "결제",
    title: "결제 오류가 발생했습니다",
    content:
      "도서 구매 시 결제가 완료되었다고 나오는데 주문 내역에는 표시되지 않습니다. 카드 승인은 된 상태입니다.",
    status: "answered",
    createdAt: "2026-03-12",
    answer: {
      content:
        "안녕하세요, BIZSCHOOL입니다. 확인 결과 결제 시스템 일시 오류로 인한 건으로, 현재 정상 처리 완료되었습니다. 주문 내역을 다시 확인해 주시기 바랍니다. 불편을 드려 죄송합니다.",
      answeredAt: "2026-03-12",
      answeredBy: "BIZSCHOOL 고객센터",
    },
  },
  {
    id: 11,
    category: "기타",
    title: "수료증 발급 방법을 알고 싶습니다",
    content: "공개교육 수료 후 수료증은 어떻게 발급받을 수 있나요?",
    status: "answered",
    createdAt: "2026-03-10",
    answer: {
      content:
        "수료증은 교육 완료 후 마이페이지 > 수강내역에서 직접 다운로드하실 수 있습니다. 교육 종료 후 1~2 영업일 내에 발급됩니다.",
      answeredAt: "2026-03-11",
      answeredBy: "BIZSCHOOL 교육팀",
    },
  },
  {
    id: 10,
    category: "강의",
    title: "강의 영상이 재생되지 않습니다",
    content:
      "크롬 브라우저에서 강의 영상 로딩이 되지 않고 검은 화면만 나옵니다.",
    status: "answered",
    createdAt: "2026-03-08",
    answer: {
      content:
        "브라우저 캐시를 삭제하신 후 다시 시도해 주세요. 문제가 지속되면 다른 브라우저(Edge, Firefox)에서 확인 부탁드립니다.",
      answeredAt: "2026-03-08",
      answeredBy: "BIZSCHOOL 기술지원팀",
    },
  },
  {
    id: 9,
    category: "도서",
    title: "도서 배송 일정 문의",
    content:
      "주문한 도서가 아직 배송되지 않았습니다. 예상 배송일을 알 수 있을까요?",
    status: "answered",
    createdAt: "2026-03-05",
    answer: {
      content:
        "주문하신 도서는 현재 출고 준비 중이며, 3월 7일 발송 예정입니다. 발송 시 배송 추적 번호를 문자로 안내드리겠습니다.",
      answeredAt: "2026-03-06",
      answeredBy: "BIZSCHOOL 배송팀",
    },
  },
  {
    id: 8,
    category: "기술문제",
    title: "모바일에서 로그인이 안됩니다",
    content:
      "아이폰 Safari 브라우저에서 로그인 시 흰 화면만 나옵니다.",
    status: "pending",
    createdAt: "2026-03-03",
  },
  {
    id: 7,
    category: "결제",
    title: "할인 쿠폰 적용이 안됩니다",
    content:
      "이벤트로 받은 20% 할인 쿠폰을 적용하려고 하는데 '사용 불가'로 표시됩니다.",
    status: "answered",
    createdAt: "2026-02-28",
    answer: {
      content:
        "해당 쿠폰은 5만원 이상 결제 시 사용 가능한 쿠폰입니다. 쿠폰 상세 조건을 확인해 주시기 바랍니다.",
      answeredAt: "2026-02-28",
      answeredBy: "BIZSCHOOL 고객센터",
    },
  },
  {
    id: 6,
    category: "강의",
    title: "강의 수강 기간 연장 가능한가요?",
    content:
      "현재 수강 중인 강의의 수강 기간이 곧 만료되는데 연장이 가능한지 문의드립니다.",
    status: "answered",
    createdAt: "2026-02-25",
    answer: {
      content:
        "수강 기간 연장은 만료 전 1회에 한하여 30일 연장이 가능합니다. 마이페이지 > 수강내역에서 연장 신청하시거나, 고객센터로 연락 주시면 처리해 드리겠습니다.",
      answeredAt: "2026-02-26",
      answeredBy: "BIZSCHOOL 교육팀",
    },
  },
  {
    id: 5,
    category: "기술문제",
    title: "PDF 교안 다운로드가 되지 않습니다",
    content:
      "강의 교안 PDF 파일을 다운로드하면 파일이 깨져서 열리지 않습니다. 여러 번 시도했는데 동일한 현상입니다.",
    status: "answered",
    createdAt: "2026-02-20",
    answer: {
      content:
        "해당 PDF 파일을 재업로드하였습니다. 다시 다운로드해 주시기 바랍니다. Chrome 브라우저 사용을 권장드립니다.",
      answeredAt: "2026-02-21",
      answeredBy: "BIZSCHOOL 기술지원팀",
    },
  },
  {
    id: 4,
    category: "도서",
    title: "교재 오탈자 신고합니다",
    content:
      "'경영전략 핵심노트' 도서 127페이지에 오탈자가 있습니다. '영업이익률'이 '영업이이률'로 표기되어 있습니다.",
    status: "answered",
    createdAt: "2026-02-15",
    answer: {
      content:
        "신고해 주셔서 감사합니다. 해당 오탈자를 확인하였으며, 다음 인쇄본부터 수정 반영됩니다. 정오표를 도서 상세 페이지에 업데이트하였습니다.",
      answeredAt: "2026-02-16",
      answeredBy: "BIZSCHOOL 출판팀",
    },
  },
  {
    id: 3,
    category: "결제",
    title: "세금계산서 발급 요청드립니다",
    content:
      "법인카드로 결제한 강의 3건에 대해 세금계산서 발급을 요청드립니다. 사업자등록번호는 별도 이메일로 보내드리겠습니다.",
    status: "pending",
    createdAt: "2026-02-10",
  },
  {
    id: 2,
    category: "강의",
    title: "단체 수강 할인 가능한가요?",
    content:
      "직원 교육용으로 동일 강의를 10명 이상 등록하려고 합니다. 단체 할인이 가능한지 문의드립니다.",
    status: "answered",
    createdAt: "2026-02-05",
    answer: {
      content:
        "10명 이상 단체 등록 시 20% 할인이 적용됩니다. 자세한 견적은 enterprise@bizschool.co.kr로 문의해 주시면 별도 안내드리겠습니다.",
      answeredAt: "2026-02-06",
      answeredBy: "BIZSCHOOL 영업팀",
    },
  },
  {
    id: 1,
    category: "기타",
    title: "강사 지원 방법이 궁금합니다",
    content:
      "BIZSCHOOL에서 강의를 개설하고 싶은데 강사 지원 절차와 자격 요건이 궁금합니다.",
    status: "answered",
    createdAt: "2026-01-28",
    answer: {
      content:
        "강사 지원은 공식 홈페이지 하단 '강사 지원' 메뉴에서 가능합니다. 해당 분야 경력 3년 이상, 포트폴리오 제출이 필요하며 심사 후 개별 연락드립니다.",
      answeredAt: "2026-01-29",
      answeredBy: "BIZSCHOOL 교육팀",
    },
  },
];

export const INQUIRIES_PER_PAGE = 10;

// ── 나의 강의실 (수강내역) ──

export const mockMyCourses: MyCourse[] = [
  // 나의 온라인 강의실
  {
    id: "mc-001",
    title: "세무회계 실무 기초",
    periodStart: "2026-01-15",
    periodEnd: "2026-07-15",
    paymentStatus: "결제완료",
    groupType: "online",
  },
  {
    id: "mc-002",
    title: "경영전략 핵심 노트",
    periodStart: "2026-02-01",
    periodEnd: "2026-04-01",
    paymentStatus: "결제완료",
    groupType: "online",
  },
  {
    id: "mc-003",
    title: "인사노무관리 입문",
    periodStart: "2026-03-01",
    periodEnd: "2026-06-30",
    paymentStatus: "미결제",
    groupType: "online",
  },
  // 나의 강의실 - 공개교육
  {
    id: "mc-004",
    title: "노무관리 실무 과정",
    periodStart: "2026-03-10",
    periodEnd: "2026-03-12",
    paymentStatus: "결제완료",
    isInsuranceRefund: true,
    groupType: "public",
  },
  {
    id: "mc-005",
    title: "재경관리사 시험대비 특강",
    periodStart: "2026-04-01",
    periodEnd: "2026-04-03",
    paymentStatus: "결제완료",
    isInsuranceRefund: false,
    groupType: "public",
  },
  // 이수과정
  {
    id: "mc-006",
    title: "재무제표 분석 실무",
    periodStart: "2025-10-01",
    periodEnd: "2025-12-31",
    paymentStatus: "결제완료",
    isInsuranceRefund: false,
    groupType: "completed",
  },
  {
    id: "mc-007",
    title: "근로기준법 핵심정리",
    periodStart: "2025-08-15",
    periodEnd: "2025-11-15",
    paymentStatus: "결제완료",
    isInsuranceRefund: true,
    groupType: "completed",
  },
];

// ── 도서 주문내역 (구매내역) ──

export const ORDERS_PER_PAGE = 10;

export const mockBookOrders: BookOrder[] = [
  {
    id: "ORD-2026-001",
    orderedAt: "2026-03-14",
    bookTitle: "경영전략 핵심노트",
    bookAuthor: "박전략",
    quantity: 1,
    paymentMethod: "신용카드",
    paymentStatus: "결제완료",
    orderStatus: "발송완료",
  },
  {
    id: "ORD-2026-002",
    orderedAt: "2026-03-12",
    bookTitle: "세무회계 실무 교재",
    bookAuthor: "김세무",
    quantity: 2,
    paymentMethod: "카카오페이",
    paymentStatus: "결제완료",
    orderStatus: "발송준비",
  },
  {
    id: "ORD-2026-003",
    orderedAt: "2026-03-10",
    bookTitle: "인사노무관리 핸드북",
    bookAuthor: "이노무",
    quantity: 1,
    paymentMethod: "무통장입금",
    paymentStatus: "결제대기",
    orderStatus: "결제대기",
  },
  {
    id: "ORD-2026-004",
    orderedAt: "2026-03-08",
    bookTitle: "재무제표 분석 가이드",
    bookAuthor: "최재무",
    quantity: 1,
    paymentMethod: "네이버페이",
    paymentStatus: "결제완료",
    orderStatus: "발송완료",
  },
  {
    id: "ORD-2026-005",
    orderedAt: "2026-03-05",
    bookTitle: "근로기준법 해설",
    bookAuthor: "정근로",
    quantity: 3,
    paymentMethod: "신용카드",
    paymentStatus: "결제완료",
    orderStatus: "발송완료",
  },
  {
    id: "ORD-2026-006",
    orderedAt: "2026-03-03",
    bookTitle: "경영학개론",
    bookAuthor: "한경영",
    quantity: 1,
    paymentMethod: "신용카드",
    paymentStatus: "결제완료",
    orderStatus: "결제완료",
  },
  {
    id: "ORD-2026-007",
    orderedAt: "2026-02-28",
    bookTitle: "회계원리 입문",
    bookAuthor: "김회계",
    quantity: 1,
    paymentMethod: "카카오페이",
    paymentStatus: "결제완료",
    orderStatus: "발송완료",
  },
  {
    id: "ORD-2026-008",
    orderedAt: "2026-02-25",
    bookTitle: "조직행동론",
    bookAuthor: "이조직",
    quantity: 2,
    paymentMethod: "신용카드",
    paymentStatus: "결제완료",
    orderStatus: "발송완료",
  },
  {
    id: "ORD-2026-009",
    orderedAt: "2026-02-20",
    bookTitle: "마케팅 전략론",
    bookAuthor: "박마케",
    quantity: 1,
    paymentMethod: "네이버페이",
    paymentStatus: "결제완료",
    orderStatus: "발송완료",
  },
  {
    id: "ORD-2026-010",
    orderedAt: "2026-02-15",
    bookTitle: "재경관리사 기출문제집",
    bookAuthor: "최기출",
    quantity: 1,
    paymentMethod: "무통장입금",
    paymentStatus: "결제완료",
    orderStatus: "발송완료",
  },
  {
    id: "ORD-2026-011",
    orderedAt: "2026-02-10",
    bookTitle: "인적자원관리론",
    bookAuthor: "정인사",
    quantity: 1,
    paymentMethod: "신용카드",
    paymentStatus: "결제완료",
    orderStatus: "발송완료",
  },
  {
    id: "ORD-2026-012",
    orderedAt: "2026-02-05",
    bookTitle: "원가회계 실무",
    bookAuthor: "김원가",
    quantity: 2,
    paymentMethod: "카카오페이",
    paymentStatus: "결제완료",
    orderStatus: "결제완료",
  },
  {
    id: "ORD-2026-013",
    orderedAt: "2026-01-28",
    bookTitle: "노동법 핵심요약",
    bookAuthor: "이노동",
    quantity: 1,
    paymentMethod: "신용카드",
    paymentStatus: "결제완료",
    orderStatus: "발송완료",
  },
  {
    id: "ORD-2026-014",
    orderedAt: "2026-01-20",
    bookTitle: "경제학 원론",
    bookAuthor: "한경제",
    quantity: 1,
    paymentMethod: "네이버페이",
    paymentStatus: "결제완료",
    orderStatus: "발송완료",
  },
  {
    id: "ORD-2026-015",
    orderedAt: "2026-01-15",
    bookTitle: "세법개론",
    bookAuthor: "박세법",
    quantity: 3,
    paymentMethod: "무통장입금",
    paymentStatus: "결제대기",
    orderStatus: "결제대기",
  },
  {
    id: "ORD-2026-016",
    orderedAt: "2026-01-10",
    bookTitle: "기업재무론",
    bookAuthor: "강재무",
    quantity: 1,
    paymentMethod: "신용카드",
    paymentStatus: "결제완료",
    orderStatus: "발송완료",
  },
  {
    id: "ORD-2026-017",
    orderedAt: "2026-01-05",
    bookTitle: "생산운영관리",
    bookAuthor: "윤생산",
    quantity: 2,
    paymentMethod: "카카오페이",
    paymentStatus: "결제완료",
    orderStatus: "발송완료",
  },
  {
    id: "ORD-2026-018",
    orderedAt: "2025-12-28",
    bookTitle: "국제통상론",
    bookAuthor: "서통상",
    quantity: 1,
    paymentMethod: "네이버페이",
    paymentStatus: "결제완료",
    orderStatus: "결제완료",
  },
  {
    id: "ORD-2026-019",
    orderedAt: "2025-12-20",
    bookTitle: "디지털 마케팅 전략",
    bookAuthor: "조디지",
    quantity: 1,
    paymentMethod: "신용카드",
    paymentStatus: "결제완료",
    orderStatus: "발송완료",
  },
  {
    id: "ORD-2026-020",
    orderedAt: "2025-12-15",
    bookTitle: "ESG 경영실무",
    bookAuthor: "임이에스",
    quantity: 2,
    paymentMethod: "무통장입금",
    paymentStatus: "결제대기",
    orderStatus: "결제대기",
  },
];
