import type { ExpertConsultation, ExpertConsultationCategory } from "@/types";

export const EXPERT_POSTS_PER_PAGE = 10;

export const expertCategories: { key: ExpertConsultationCategory | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "회계", label: "회계" },
  { key: "세무", label: "세무" },
  { key: "4대보험", label: "4대보험" },
  { key: "인사", label: "인사" },
  { key: "총무", label: "총무" },
];

export const expertConsultations: ExpertConsultation[] = [
  {
    id: "ec-1",
    title: "부가세 예정신고 누락 시 가산세는 어떻게 계산하나요?",
    content:
      "부가세 예정신고를 누락했는데 가산세가 어떻게 계산되는지 궁금합니다. 1기 예정신고를 놓쳤고, 확정신고 때 함께 신고하려고 합니다. 이 경우 무신고 가산세와 납부불성실 가산세가 각각 어떻게 적용되나요?",
    author: "김비즈",
    authorId: "user-001",
    category: "세무",
    createdAt: "2026.03.23",
    createdTime: "14:30",
    viewCount: 342,
    status: "answered",
    aiAnswer: {
      content:
        "부가세 예정신고 누락 시 가산세는 크게 두 가지로 구분됩니다.\n\n1) 무신고 가산세: 납부세액의 20% (일반무신고)\n- 부정행위로 인한 경우 40%\n- 기한 후 1개월 이내 자진신고 시 50% 감면\n- 기한 후 1~3개월 이내 자진신고 시 30% 감면\n\n2) 납부불성실 가산세: 미납세액 × 경과일수 × 0.022%\n- 예정신고 기한 다음날부터 실제 납부일까지 적용\n\n확정신고 시 함께 신고하더라도 예정신고분에 대한 가산세는 별도로 부과되므로 유의하시기 바랍니다.\n\n본 답변은 AI가 생성한 참고용 답변입니다. 보다 정확한 답변은 담당 전문가가 곧 제공해드리겠습니다.",
      answeredAt: "2026.03.23",
      answeredTime: "14:35",
      model: "gpt-4o-mini",
      citations: [
        { title: "국세기본법 제47조의2 (무신고가산세) 해설 - 국세법령정보시스템" },
        { title: "부가가치세 예정신고 관련 가산세 안내 - 국세청 홈택스" },
        { title: "2025년 세법 개정에 따른 가산세 감면 규정 변경 안내" },
      ],
      citedBooks: [
        {
          bookId: "ab17",
          title: "세무실무 완전정복 2026",
          author: "김완일, 고경희",
          cover: "/images/books/book-17.jpg",
          pageFrom: 187,
          pageTo: 195,
          excerpt: "부가가치세 가산세 유형 및 계산 방법 상세 해설",
        },
        {
          bookId: "ab27",
          title: "알면 돈되고 모르면 돈내는 절세비법",
          author: "김혜리, 호지영",
          cover: "/images/books/book-27.jpg",
          pageFrom: 112,
          pageTo: 118,
          excerpt: "부가세 신고 누락 시 가산세 최소화 전략",
        },
      ],
      relatedQuestions: [
        "부가세 예정신고 기한이 지난 후 자진신고하면 가산세가 얼마나 감면되나요?",
        "부가세 확정신고 시 예정신고 누락분을 함께 신고할 수 있나요?",
        "부가세 무신고와 과소신고의 가산세 차이는 무엇인가요?",
      ],
      relatedLaws: [
        "국세기본법 제47조의2(무신고가산세)",
        "국세기본법 제47조의4(납부지연가산세)",
        "부가가치세법 제48조(예정신고와 납부)",
        "국세기본법 제48조(가산세 감면)",
      ],
    },
    answers: [
      {
        id: "ea-1",
        expertName: "박세무",
        expertTitle: "세무사",
        content:
          "부가세 예정신고를 누락한 경우, 확정신고 시 함께 신고하면 무신고 가산세(일반: 납부세액의 20%)가 부과됩니다. 다만, 기한 후 1개월 이내 자진 신고하면 50% 감면을 받을 수 있습니다. 납부불성실 가산세는 미납세액 × 경과일수 × 0.022%로 계산됩니다. 예정신고 기한 다음날부터 실제 납부일까지의 기간에 대해 적용됩니다.",
        answeredAt: "2026.03.23 15:20",
        replies: [
          {
            id: "er-1",
            authorName: "김비즈",
            isExpert: false,
            content: "자세한 답변 감사합니다. 기한 후 1개월 이내면 50% 감면이 되는군요. 바로 자진신고 하겠습니다!",
            repliedAt: "2026.03.23 16:05",
          },
        ],
      },
    ],
  },
  {
    id: "ec-2",
    title: "급여 분개 시 4대보험 처리 방법이 궁금합니다",
    content:
      "급여 분개 시 4대보험 사용자부담분과 회사부담분을 어떻게 구분하여 처리하는지 궁금합니다. 특히 건강보험과 국민연금의 경우 회사부담분은 복리후생비로 처리하는 게 맞나요?",
    author: "김수강생",
    authorId: "kim0***",
    category: "회계",
    createdAt: "2026.03.22",
    createdTime: "09:15",
    viewCount: 198,
    status: "answered",
    answers: [
      {
        id: "ea-2",
        expertName: "최회계",
        expertTitle: "공인회계사",
        content:
          "4대보험 회계처리는 다음과 같습니다.\n\n1) 급여 지급 시:\n- 급여(비용) / 예수금(4대보험 근로자부담분) + 보통예금\n\n2) 회사부담분 인식:\n- 복리후생비(4대보험 회사부담분) / 미지급비용\n\n건강보험, 국민연금의 회사부담분은 복리후생비로, 산재보험과 고용보험 회사부담분도 복리후생비로 처리하는 것이 맞습니다.",
        answeredAt: "2026.03.22 11:30",
      },
    ],
  },
  {
    id: "ec-3",
    title: "퇴직금 중간정산 요건이 궁금합니다",
    content:
      "직원이 주택 구입을 이유로 퇴직금 중간정산을 요청했습니다. 중간정산이 가능한 사유와 필요한 서류가 무엇인지 알려주세요.",
    author: "박인사",
    authorId: "park***",
    category: "4대보험",
    createdAt: "2026.03.22",
    createdTime: "10:42",
    viewCount: 156,
    status: "answered",
    answers: [
      {
        id: "ea-3",
        expertName: "정노무",
        expertTitle: "공인노무사",
        content:
          "근로자퇴직급여보장법 제8조에 따라 퇴직금 중간정산이 가능한 사유는 다음과 같습니다.\n\n1) 무주택자의 주택 구입\n2) 무주택자의 전세금 또는 보증금 부담\n3) 6개월 이상 요양이 필요한 질병·부상\n4) 파산선고·개인회생절차 개시 결정\n5) 천재지변 등\n\n주택 구입의 경우 매매계약서, 주민등록등본(무주택 확인), 중간정산 신청서가 필요합니다.",
        answeredAt: "2026.03.22 14:15",
      },
    ],
  },
  {
    id: "ec-4",
    title: "연차유급휴가 발생 기준일 통일 방법",
    content:
      "입사일 기준으로 연차를 부여하고 있는데, 회계연도 기준으로 통일하고 싶습니다. 전환 시 불이익이 없도록 하려면 어떻게 해야 하나요?",
    author: "송관리",
    authorId: "song***",
    category: "인사",
    createdAt: "2026.03.21",
    createdTime: "08:30",
    viewCount: 234,
    status: "answered",
    answers: [
      {
        id: "ea-4",
        expertName: "한인사",
        expertTitle: "인사노무사",
        content:
          "연차 기준일을 입사일에서 회계연도로 변경할 때는 근로기준법 제60조의 취지에 따라 근로자에게 불이익이 없어야 합니다.\n\n전환 방법:\n1) 입사일~회계연도 말까지의 기간에 비례하여 연차를 부여\n2) 이미 발생한 미사용 연차는 그대로 보전\n3) 취업규칙 변경 절차(근로자 과반수 동의) 필요\n\n예: 7월 1일 입사자가 1월 1일 기준으로 전환 시, 전환연도에 비례 연차(6/12 × 15일)를 추가 부여합니다.",
        answeredAt: "2026.03.21 10:45",
      },
    ],
  },
  {
    id: "ec-5",
    title: "법인세 중간예납 계산 방법 문의",
    content:
      "12월 결산법인인데 법인세 중간예납을 해야 합니다. 직전 사업연도 기준과 중간결산 기준 중 어떤 방법이 유리한지 궁금합니다.",
    author: "김비즈",
    authorId: "user-001",
    category: "세무",
    createdAt: "2026.03.21",
    createdTime: "11:20",
    viewCount: 189,
    status: "answered",
    aiAnswer: {
      content:
        "법인세 중간예납 방법은 두 가지가 있으며, 상황에 따라 유불리가 달라집니다.\n\n1) 직전 사업연도 기준법\n- 계산: 직전 사업연도 법인세액 × 6/12\n- 장점: 계산이 간편, 별도 결산 불필요\n- 적합: 올해 실적이 전년과 비슷하거나 증가한 경우\n\n2) 중간결산 기준법\n- 계산: 상반기(1~6월) 실적 기준으로 법인세 산출\n- 장점: 실적 감소 시 납부세액 절감\n- 적합: 올해 상반기 실적이 전년 대비 크게 감소한 경우\n\n중간예납 기한: 상반기 종료일 다음 달 말일(8월 31일)\n\n실무 팁: 중간결산 방식은 별도의 재무제표 작성이 필요하므로, 세액 절감 효과와 추가 비용을 비교하여 결정하시기 바랍니다.\n\n본 답변은 AI가 생성한 참고용 답변입니다. 보다 정확한 답변은 담당 전문가가 곧 제공해드리겠습니다.",
      answeredAt: "2026.03.21",
      answeredTime: "11:25",
      model: "gpt-4o-mini",
      citations: [
        { title: "법인세 중간예납 안내 - 국세청 홈택스" },
        { title: "법인세법 시행령 제68조 해설 - 국세법령정보시스템" },
      ],
      citedBooks: [
        {
          bookId: "ab17",
          title: "세무실무 완전정복 2026",
          author: "김완일, 고경희",
          cover: "/images/books/book-17.jpg",
          pageFrom: 302,
          pageTo: 315,
          excerpt: "법인세 중간예납 신고 방법 및 직전사업연도 기준법 vs 중간결산 기준법 비교",
        },
        {
          bookId: "ab18",
          title: "원가관리회계 - 전략적 의사결정을 위한 관리회계",
          author: "박정식",
          cover: "/images/books/book-18.jpg",
          pageFrom: 78,
          pageTo: 85,
          excerpt: "중간결산 재무제표 작성과 세액 산출 실무",
        },
      ],
      relatedQuestions: [
        "법인세 중간예납 면제 대상은 어떤 법인인가요?",
        "중간결산 방식으로 중간예납 시 별도 세무조정이 필요한가요?",
        "법인세 중간예납 기한을 놓치면 가산세가 부과되나요?",
      ],
      relatedLaws: [
        "법인세법 제63조(중간예납)",
        "법인세법 시행령 제68조(중간예납세액의 계산)",
        "법인세법 제63조의2(중간예납 의무 면제)",
      ],
    },
  },
  {
    id: "ec-6",
    title: "감가상각 방법 변경 시 회계처리",
    content:
      "기존에 정률법으로 감가상각하던 자산을 정액법으로 변경하려고 합니다. 회계처리 방법과 세무상 주의점이 있을까요?",
    author: "윤회계",
    authorId: "yoon***",
    category: "회계",
    createdAt: "2026.03.21",
    createdTime: "13:55",
    viewCount: 145,
    status: "answered",
    answers: [
      {
        id: "ea-6",
        expertName: "최회계",
        expertTitle: "공인회계사",
        content:
          "감가상각 방법 변경은 회계추정의 변경으로 처리합니다.\n\n1) 변경 시점의 장부금액을 기초로 새로운 방법 적용\n2) 전진적용(소급적용 아님)\n3) 세무상으로는 감가상각방법 변경신고서를 관할 세무서에 제출해야 합니다 (변경 사업연도 종료일 3개월 전)\n\n주의: 세무상 미신고 시 기존 방법으로 상각한 것으로 간주되어 세무조정이 필요할 수 있습니다.",
        answeredAt: "2026.03.21 16:30",
      },
    ],
  },
  {
    id: "ec-7",
    title: "근로계약서 미작성 시 벌칙이 있나요?",
    content:
      "소규모 사업장(5인 미만)인데 근로계약서를 작성하지 않은 직원이 있습니다. 이 경우 사업주에게 어떤 불이익이 있나요?",
    author: "정사장",
    authorId: "jung***",
    category: "4대보험",
    createdAt: "2026.03.20",
    createdTime: "09:00",
    viewCount: 267,
    status: "answered",
    answers: [
      {
        id: "ea-7",
        expertName: "정노무",
        expertTitle: "공인노무사",
        content:
          "근로기준법 제17조에 따라 사업장 규모와 관계없이 근로계약서 서면 교부는 의무입니다.\n\n미작성·미교부 시 500만원 이하의 벌금이 부과될 수 있습니다(근로기준법 제114조). 5인 미만 사업장이라도 근로계약서 관련 조항은 적용됩니다.\n\n반드시 기재해야 할 사항: 임금, 소정근로시간, 휴일, 연차유급휴가 등입니다.",
        answeredAt: "2026.03.20 11:20",
      },
    ],
  },
  {
    id: "ec-8",
    title: "수습기간 중 급여를 90%만 지급해도 되나요?",
    content:
      "신입사원 수습기간 3개월 동안 급여의 90%만 지급하려고 합니다. 법적으로 문제가 없는지 궁금합니다.",
    author: "김비즈",
    authorId: "user-001",
    category: "인사",
    createdAt: "2026.03.20",
    createdTime: "15:10",
    viewCount: 312,
    status: "answered",
    aiAnswer: {
      content:
        "수습기간 중 급여 90% 지급은 조건에 따라 가능합니다.\n\n최저임금법 제5조에 의거, 수습 사용 중인 근로자에 대해 최저임금의 10%를 감액할 수 있으나, 다음 조건을 모두 충족해야 합니다:\n\n1) 1년 이상의 근로계약을 체결한 경우에만 적용\n2) 수습 시작일부터 3개월 이내\n3) 단순노무직(고용노동부 고시 직종)은 감액 불가\n\n회사 급여가 최저임금 이상이라면 내규로 90% 지급 자체는 가능하지만, 근로계약서에 수습기간과 급여 조건을 반드시 명시해야 합니다.\n\n본 답변은 AI가 생성한 참고용 답변입니다. 보다 정확한 답변은 담당 전문가가 곧 제공해드리겠습니다.",
      answeredAt: "2026.03.20",
      answeredTime: "15:15",
      model: "gpt-4o-mini",
      citations: [
        { title: "최저임금법 제5조 수습근로자 감액 규정 해설 - 고용노동부" },
        { title: "수습기간 급여 감액 관련 판례 - 대법원 2019다12345" },
        { title: "2026년 최저임금 적용 안내 - 최저임금위원회" },
      ],
      citedBooks: [
        {
          bookId: "ab31",
          title: "팀장의 탄생 - 팀을 이끄는 기술",
          author: "줄리 주오",
          cover: "/images/books/book-31.jpg",
          pageFrom: 45,
          pageTo: 52,
          excerpt: "신입사원 수습기간 운영과 온보딩 프로세스 설계",
        },
        {
          bookId: "ab28",
          title: "하이 아웃풋 매니지먼트",
          author: "앤디 그로브",
          cover: "/images/books/book-28.jpg",
          pageFrom: 134,
          pageTo: 140,
          excerpt: "신규 인력 채용 후 교육 훈련 및 성과 관리 체계",
        },
      ],
      relatedQuestions: [
        "수습기간 종료 후 정규직 전환을 거부할 수 있나요?",
        "수습기간 중 해고 시 해고예고수당을 지급해야 하나요?",
        "수습기간을 6개월로 설정해도 법적으로 문제가 없나요?",
      ],
      relatedLaws: [
        "최저임금법 제5조(최저임금의 적용)",
        "최저임금법 시행령 제3조(수습 사용 중인 근로자의 범위)",
        "근로기준법 제17조(근로조건의 명시)",
        "근로기준법 제26조(해고의 예고)",
      ],
    },
  },
  {
    id: "ec-9",
    title: "간이과세자에서 일반과세자로 전환 시 주의사항",
    content:
      "매출이 증가하여 간이과세자에서 일반과세자로 전환될 예정입니다. 전환 시 기존 매입세액 공제는 어떻게 되나요?",
    author: "오사업",
    authorId: "oh00***",
    category: "세무",
    createdAt: "2026.03.20",
    createdTime: "10:30",
    viewCount: 178,
    status: "answered",
    answers: [
      {
        id: "ea-9",
        expertName: "박세무",
        expertTitle: "세무사",
        content:
          "간이과세자에서 일반과세자로 전환 시 다음 사항을 유의하세요.\n\n1) 전환 시점의 재고품·감가상각자산에 대해 매입세액 공제 가능\n2) 재고납부세액 = 재고품 취득가액 × 해당 업종 부가가치율 × 10%\n3) 전환일이 속하는 과세기간의 확정신고 시 공제\n4) 세금계산서 발급 의무 발생\n5) 부가세 신고가 연 2회(예정+확정)로 변경\n\n전환 전에 재고자산 목록을 정리해 두시는 것이 좋습니다.",
        answeredAt: "2026.03.20 14:00",
      },
    ],
  },
  {
    id: "ec-10",
    title: "매출채권 대손상각 요건",
    content:
      "거래처가 부도가 나서 매출채권을 회수하지 못하고 있습니다. 대손상각을 하려면 어떤 요건을 충족해야 하나요?",
    author: "배과장",
    authorId: "bae0***",
    category: "회계",
    createdAt: "2026.03.19",
    createdTime: "16:20",
    viewCount: 203,
    status: "answered",
    answers: [
      {
        id: "ea-10",
        expertName: "최회계",
        expertTitle: "공인회계사",
        content:
          "대손상각 처리를 위해서는 다음 요건을 확인하세요.\n\n회계상:\n- 회수 불가능성이 객관적으로 입증되면 대손 처리 가능\n- 대손충당금 설정 후 상각\n\n세무상(법인세법 시행령 제19조의2):\n- 부도발생일로부터 6개월 이상 경과\n- 소멸시효 완성\n- 회생계획인가 결정에 따라 회수불능 확정\n- 채무자의 파산·강제집행 등\n\n부도업체의 경우 부도확인서(은행), 부도일자 증빙 등을 보관하셔야 합니다.",
        answeredAt: "2026.03.19 17:45",
      },
    ],
  },
  {
    id: "ec-11",
    title: "주52시간 위반 시 사업주 처벌 수위",
    content:
      "프로젝트가 급해서 직원들이 주 52시간 이상 근무했습니다. 적발 시 어떤 처벌을 받게 되나요?",
    author: "임팀장",
    authorId: "lim0***",
    category: "4대보험",
    createdAt: "2026.03.19",
    createdTime: "11:00",
    viewCount: 389,
    status: "answered",
    answers: [
      {
        id: "ea-11",
        expertName: "정노무",
        expertTitle: "공인노무사",
        content:
          "근로기준법 제50조 위반으로 2년 이하의 징역 또는 2천만원 이하의 벌금에 처해질 수 있습니다.\n\n주의할 점:\n1) 5인 이상 사업장에 적용\n2) 특별연장근로(주 12시간 초과)는 고용노동부 인가 필요\n3) 반복 위반 시 가중처벌 가능\n4) 근로시간 기록 미보관도 별도 과태료\n\n대안으로 탄력적 근로시간제나 선택적 근로시간제 도입을 검토해 보시기 바랍니다.",
        answeredAt: "2026.03.19 14:30",
        replies: [
          {
            id: "er-2",
            authorName: "임팀장",
            isExpert: false,
            content: "탄력적 근로시간제 도입 절차에 대해서도 별도로 상담 요청 드리겠습니다.",
            repliedAt: "2026.03.19 15:10",
          },
          {
            id: "er-3",
            authorName: "정노무",
            isExpert: true,
            content: "네, 별도 상담 등록해 주시면 상세히 안내드리겠습니다. 3개월 단위/6개월 단위 탄력적 근로시간제 모두 가능합니다.",
            repliedAt: "2026.03.19 15:45",
          },
        ],
      },
    ],
  },
  {
    id: "ec-12",
    title: "재직증명서 발급 의무가 있나요?",
    content:
      "퇴사한 직원이 재직증명서를 요청했습니다. 회사가 반드시 발급해야 하는 의무가 있는지, 어떤 내용을 포함해야 하는지 궁금합니다.",
    author: "조인사",
    authorId: "cho0***",
    category: "총무",
    createdAt: "2026.03.19",
    createdTime: "09:30",
    viewCount: 176,
    status: "answered",
    answers: [
      {
        id: "ea-12",
        expertName: "한인사",
        expertTitle: "인사노무사",
        content:
          "근로기준법 제39조에 따라 사용자는 근로자가 요구하면 사용증명서를 교부할 의무가 있습니다. 퇴직한 근로자도 마찬가지입니다.\n\n필수 기재 사항:\n- 사용기간, 업무의 종류, 지위, 임금\n- 그 밖에 필요한 사항(근로자가 요구한 사항만)\n\n미교부 시 500만원 이하의 과태료가 부과될 수 있습니다. 근로자가 요구하지 않은 사항은 기재하면 안 됩니다.",
        answeredAt: "2026.03.19 11:15",
      },
    ],
  },
  {
    id: "ec-13",
    title: "사업용 차량의 감가상각비 한도",
    content:
      "법인 소유 업무용 승용차의 감가상각비 한도가 어떻게 되나요? 리스 차량과 소유 차량의 차이도 알려주세요.",
    author: "한대표",
    authorId: "han0***",
    category: "세무",
    createdAt: "2026.03.18",
    createdTime: "14:00",
    viewCount: 256,
    status: "answered",
    answers: [
      {
        id: "ea-13",
        expertName: "박세무",
        expertTitle: "세무사",
        content:
          "업무용 승용차 관련 비용은 연간 1,500만원까지 손금(비용) 인정됩니다.\n\n1) 감가상각비: 연 800만원 한도 (정액법, 내용연수 5년)\n2) 차량유지비(보험료, 수선비, 유류비 등): 감가상각비와 합산하여 연 1,500만원\n3) 리스의 경우: 리스료 중 보험료·자동차세 제외 금액이 연 800만원 한도\n\n업무사용비율 입증(운행일지 작성)이 필요하며, 미작성 시 업무사용비율 1,500만원만 인정됩니다.",
        answeredAt: "2026.03.18 16:30",
      },
    ],
  },
  {
    id: "ec-14",
    title: "유형자산 재평가 회계처리 방법",
    content:
      "건물을 재평가모형으로 변경하려고 합니다. 재평가 시 회계처리 방법과 재평가잉여금 처리에 대해 알려주세요.",
    author: "문회계",
    authorId: "moon***",
    category: "회계",
    createdAt: "2026.03.18",
    createdTime: "10:15",
    viewCount: 134,
    status: "pending",
  },
  {
    id: "ec-15",
    title: "해고예고수당 지급 기준",
    content:
      "직원을 해고해야 하는 상황인데, 30일 전에 예고하지 못했습니다. 해고예고수당은 어떻게 계산하나요?",
    author: "김비즈",
    authorId: "user-001",
    category: "4대보험",
    createdAt: "2026.03.18",
    createdTime: "16:45",
    viewCount: 298,
    status: "pending",
  },
  {
    id: "ec-16",
    title: "연말정산 시 중소기업 취업자 감면 적용 범위",
    content:
      "중소기업에 취업한 청년인데 소득세 감면을 받을 수 있다고 들었습니다. 감면율과 적용 기간, 대상 요건을 알려주세요.",
    author: "신입사",
    authorId: "shin***",
    category: "세무",
    createdAt: "2026.03.17",
    createdTime: "13:20",
    viewCount: 445,
    status: "answered",
    answers: [
      {
        id: "ea-16",
        expertName: "박세무",
        expertTitle: "세무사",
        content:
          "조세특례제한법 제30조에 따른 중소기업 취업자 소득세 감면 요건입니다.\n\n감면율:\n- 청년(15~34세): 소득세 90% 감면 (연 200만원 한도)\n- 60세 이상·장애인·경력단절여성: 70% 감면 (연 200만원 한도)\n\n적용 기간: 취업일로부터 5년간\n\n대상:\n- 중소기업기본법상 중소기업\n- 일부 업종 제외(전문서비스업, 금융보험업 등)\n\n회사에서 '중소기업 취업자 소득세 감면신청서'를 원천징수의무자에게 제출해야 합니다.",
        answeredAt: "2026.03.17 15:00",
      },
    ],
  },
  {
    id: "ec-17",
    title: "재고자산 평가방법 변경 절차",
    content:
      "선입선출법에서 총평균법으로 재고자산 평가방법을 변경하고 싶습니다. 어떤 절차를 밟아야 하나요?",
    author: "김비즈",
    authorId: "user-001",
    category: "회계",
    createdAt: "2026.03.17",
    createdTime: "08:50",
    viewCount: 112,
    status: "pending",
  },
  {
    id: "ec-18",
    title: "육아휴직 중 사회보험료 처리",
    content:
      "직원이 육아휴직에 들어가는데, 4대보험료는 어떻게 처리해야 하나요? 회사부담분도 면제되나요?",
    author: "유과장",
    authorId: "yu00***",
    category: "인사",
    createdAt: "2026.03.17",
    createdTime: "11:30",
    viewCount: 287,
    status: "answered",
    answers: [
      {
        id: "ea-18",
        expertName: "한인사",
        expertTitle: "인사노무사",
        content:
          "육아휴직 기간 중 사회보험 처리는 다음과 같습니다.\n\n1) 건강보험: 보험료 경감(60%) - 근로자·사업주 모두\n2) 국민연금: 납입 예외 신청 가능 (본인 희망 시 계속 납부)\n3) 고용보험: 근로자 부담분 면제, 사업주 부담분도 면제\n4) 산재보험: 보수총액에서 제외\n\n각 공단에 육아휴직 신고를 해야 하며, 건강보험은 EDI로 휴직 신고하면 자동 경감됩니다.",
        answeredAt: "2026.03.17 14:45",
      },
    ],
  },
  {
    id: "ec-19",
    title: "세금계산서 발급 기한을 놓쳤습니다",
    content:
      "지난 달 거래분의 세금계산서를 발급하지 못했습니다. 지금이라도 발급이 가능한가요? 가산세가 있나요?",
    author: "강사업",
    authorId: "kang2**",
    category: "세무",
    createdAt: "2026.03.16",
    createdTime: "17:00",
    viewCount: 367,
    status: "answered",
    answers: [
      {
        id: "ea-19",
        expertName: "박세무",
        expertTitle: "세무사",
        content:
          "세금계산서 발급 기한은 공급시기가 속하는 달의 다음 달 10일까지입니다.\n\n기한 후 발급:\n- 확정신고 기한까지 발급 시: 공급가액의 1% 가산세\n- 확정신고 기한 경과 후: 발급 불가, 공급가액의 2% 가산세\n\n매입자 입장:\n- 기한 후 수취한 세금계산서도 매입세액 공제 가능\n- 단, 매입세액 불공제 가산세(0.5%)가 적용될 수 있음\n\n가능한 빨리 발급하시는 것이 유리합니다.",
        answeredAt: "2026.03.16 18:30",
      },
    ],
  },
  {
    id: "ec-20",
    title: "건설업 기성금 수익인식 기준",
    content:
      "건설업을 영위하고 있는데 기성금 수익인식은 진행기준과 완성기준 중 어떤 것을 적용해야 하나요?",
    author: "조건설",
    authorId: "jo00***",
    category: "회계",
    createdAt: "2026.03.16",
    createdTime: "09:40",
    viewCount: 98,
    status: "pending",
  },
  {
    id: "ec-21",
    title: "파견근로자와 도급근로자의 차이",
    content:
      "외주 인력을 사용하려고 하는데, 파견과 도급의 차이가 무엇인가요? 불법파견으로 판단되는 기준이 궁금합니다.",
    author: "백부장",
    authorId: "baek***",
    category: "4대보험",
    createdAt: "2026.03.16",
    createdTime: "14:25",
    viewCount: 234,
    status: "answered",
    answers: [
      {
        id: "ea-21",
        expertName: "정노무",
        expertTitle: "공인노무사",
        content:
          "파견과 도급의 핵심 차이는 '지휘·감독권'입니다.\n\n도급: 수급인이 근로자를 지휘·감독, 업무 결과물 납품\n파견: 사용사업주가 파견근로자를 직접 지휘·감독\n\n불법파견 판단 기준:\n1) 도급인이 근로자에게 직접 업무지시\n2) 근무시간·장소를 도급인이 결정\n3) 도급인의 취업규칙·복무규정 적용\n4) 도급인이 근로자 선발에 관여\n\n불법파견 시 직접고용 의무가 발생하므로 주의가 필요합니다.",
        answeredAt: "2026.03.16 16:50",
      },
    ],
  },
  {
    id: "ec-22",
    title: "인사평가 결과를 급여에 반영하는 방법",
    content:
      "연 1회 인사평가를 실시하고 있는데, 평가 결과를 성과급이나 기본급 인상에 반영하는 일반적인 방법이 궁금합니다.",
    author: "김인사",
    authorId: "kim2***",
    category: "인사",
    createdAt: "2026.03.15",
    createdTime: "10:00",
    viewCount: 198,
    status: "pending",
  },
  {
    id: "ec-23",
    title: "외화 매출채권의 환율 적용 기준",
    content:
      "수출 거래로 USD 매출채권이 있습니다. 결산 시 환율은 어떤 기준을 적용해야 하나요? 환율 차이는 어떻게 회계처리하나요?",
    author: "이무역",
    authorId: "lee2***",
    category: "회계",
    createdAt: "2026.03.15",
    createdTime: "15:35",
    viewCount: 167,
    status: "answered",
    answers: [
      {
        id: "ea-23",
        expertName: "최회계",
        expertTitle: "공인회계사",
        content:
          "외화 매출채권의 환율 적용 기준입니다.\n\n1) 거래 발생 시: 거래일의 매매기준율\n2) 결산 시: 보고기간 말 매매기준율로 환산\n3) 환산손익: 외환차손익(영업외손익) 또는 외화환산손익으로 처리\n\n회수 시:\n- 회수일 환율과 장부금액 차이 → 외환차손익\n\nK-IFRS 적용 시 화폐성 항목은 마감환율, 비화폐성 항목은 역사적 환율을 적용합니다.",
        answeredAt: "2026.03.15 17:20",
      },
    ],
  },
  {
    id: "ec-24",
    title: "종합소득세 신고 시 필요경비 인정 범위",
    content:
      "프리랜서로 일하고 있는데 종합소득세 신고 시 어떤 것들을 필요경비로 인정받을 수 있나요?",
    author: "박프리",
    authorId: "park2**",
    category: "세무",
    createdAt: "2026.03.15",
    createdTime: "12:10",
    viewCount: 423,
    status: "answered",
    answers: [
      {
        id: "ea-24",
        expertName: "박세무",
        expertTitle: "세무사",
        content:
          "프리랜서의 필요경비 인정 범위입니다.\n\n1) 기준경비율 적용 시:\n- 매입비용, 임차료, 인건비는 증빙 기반 공제\n- 나머지는 기준경비율로 일괄 공제\n\n2) 주요 인정 경비:\n- 사무실 임차료, 통신비, 교통비\n- 업무용 장비 구입비\n- 접대비(한도 있음)\n- 업무 관련 교육비\n- 세무사 수수료\n\n3) 단순경비율 적용(수입 2,400만원 미만):\n- 업종별 단순경비율로 일괄 공제\n\n증빙 보관이 중요합니다. 사업용 신용카드 등록을 권장합니다.",
        answeredAt: "2026.03.15 14:50",
      },
    ],
  },
  {
    id: "ec-25",
    title: "통상임금에 포함되는 수당 기준",
    content:
      "통상임금에 어떤 수당이 포함되는지 헷갈립니다. 식대, 교통비, 직책수당 등이 통상임금에 포함되나요?",
    author: "서대리",
    authorId: "seo0***",
    category: "4대보험",
    createdAt: "2026.03.14",
    createdTime: "08:20",
    viewCount: 356,
    status: "pending",
  },
  {
    id: "ec-26",
    title: "퇴직연금 DB형과 DC형 선택 기준",
    content:
      "회사에서 퇴직연금제도를 도입하려고 합니다. DB형과 DC형의 차이와 어떤 기준으로 선택해야 하는지 알려주세요.",
    author: "권총무",
    authorId: "kwon***",
    category: "총무",
    createdAt: "2026.03.14",
    createdTime: "11:50",
    viewCount: 213,
    status: "pending",
  },
  {
    id: "ec-27",
    title: "가지급금 인정이자 계산법",
    content:
      "대표이사에게 가지급금이 발생했는데, 인정이자는 어떻게 계산하나요? 인정이자율과 세무상 처리 방법을 알려주세요.",
    author: "도경리",
    authorId: "do00***",
    category: "세무",
    createdAt: "2026.03.14",
    createdTime: "13:40",
    viewCount: 289,
    status: "answered",
    answers: [
      {
        id: "ea-27",
        expertName: "박세무",
        expertTitle: "세무사",
        content:
          "가지급금 인정이자 계산 방법입니다.\n\n인정이자율(2026년 기준):\n- 당좌대출이자율(가중평균차입이자율) 우선 적용\n- 특수관계인 간: 4.6%(기획재정부 고시)\n\n계산: 가지급금 잔액 × 인정이자율 × 경과일수/365\n\n세무처리:\n1) 인정이자 미수수 시 → 익금 산입(소득처분: 상여)\n2) 대표이사 소득세 추가 부담\n3) 가지급금 자체에 대해 지급이자 손금불산입\n\n가능한 빨리 정리하는 것이 세무상 유리합니다.",
        answeredAt: "2026.03.14 15:30",
      },
    ],
  },
];

export function getExpertConsultationById(id: string): ExpertConsultation | undefined {
  return expertConsultations.find((c) => c.id === id);
}
