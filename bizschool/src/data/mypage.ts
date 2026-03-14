import type { MockUser, Inquiry, InquiryCategory, MypageTab } from "@/types";

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
