import type { LectureDetail } from "@/types";

export const allLectures: LectureDetail[] = [
  {
    id: "lec-001",
    title: "세무 실무 마스터클래스 - 법인세부터 부가세까지",
    description:
      "본 강의는 세무 분야의 핵심 실무 지식을 체계적으로 다루며, 실제 사례 중심으로 현장에서 바로 활용할 수 있는 내용을 제공합니다.",
    categories: [
      { main: "세무", sub: "법인세" },
      { main: "세무", sub: "소득세" },
    ],
    tags: ["세금신고", "연말정산", "법인세", "부가가치세", "원천징수"],
    learningPoints: [
      "세무회계 기초 이론 완전 정복",
      "부가가치세 신고서 작성 실무",
      "원천징수 실무와 급여 관리",
      "종합소득세 신고 완벽 대비",
      "법인세 세무조정 기초",
    ],
    targetAudience: [
      "세무회계 실무를 처음 시작하는 분",
      "개인사업자로 직접 세금 신고를 해야 하는 분",
      "경리/회계 부서 신입 실무자",
      "세무사 시험을 준비하는 수험생",
    ],
    detail:
      "이 강의는 세무회계의 기초부터 실무 적용까지 체계적으로 학습할 수 있도록 구성되었습니다.\n\n부가가치세, 원천징수, 종합소득세, 법인세의 핵심 개념을 이해하고, 실제 신고서 작성 실습을 통해 현장에서 바로 활용 가능한 역량을 키울 수 있습니다.\n\n각 섹션마다 실무 사례와 연습 문제가 포함되어 있어 이론과 실무를 동시에 학습할 수 있습니다.",
    curriculum: [
      { title: "세무회계란?", duration: "12:30" },
      { title: "세금의 종류와 체계", duration: "15:42" },
      { title: "부가가치세 기초", duration: "18:20" },
      { title: "소득세 개요", duration: "14:05" },
      { title: "법인세 개요", duration: "19:33" },
      { title: "매출세액 계산", duration: "16:10" },
      { title: "매입세액 공제", duration: "20:15" },
      { title: "부가세 신고서 작성", duration: "22:30" },
      { title: "전자세금계산서 실무", duration: "18:45" },
      { title: "수정신고와 경정청구", duration: "15:20" },
      { title: "원천징수 개념", duration: "12:00" },
      { title: "근로소득 원천징수", duration: "18:30" },
      { title: "사업소득 원천징수", duration: "14:20" },
      { title: "기타소득 원천징수", duration: "16:45" },
      { title: "퇴직소득 원천징수", duration: "13:10" },
      { title: "원천징수이행상황신고서", duration: "15:25" },
      { title: "종합소득세 체계", duration: "14:50" },
      { title: "소득금액 계산", duration: "18:20" },
      { title: "세액공제와 감면", duration: "16:40" },
      { title: "종합소득세 신고서 작성", duration: "22:15" },
      { title: "법인세 과세표준", duration: "15:30" },
      { title: "세무조정 기초", duration: "18:40" },
      { title: "감가상각비 조정", duration: "20:10" },
      { title: "법인세 신고 절차", duration: "16:00" },
    ],
    instructor: {
      name: "김세무",
      bio: "현직 세무사로 15년간 법인 및 개인 세무 자문을 담당하고 있습니다. 한국세무사회 정회원이며, 다수의 세무 실무 교재를 집필하였습니다.",
    },
    price: 55000,
    originalPrice: 77000,
    discountRate: 30,
    rating: 4.8,
    reviewCount: 234,
    studentCount: 1200,
    totalDuration: "6시간 45분",
    lessonCount: 24,
    level: "입문",
    updatedAt: "2026-03-15",
    reviews: [
      {
        reviewer: "홍길동",
        rating: 5,
        date: "2026-03-15",
        content:
          "세무 실무에 대해 체계적으로 배울 수 있어서 정말 좋았습니다. 특히 부가세 신고서 작성 실습이 실무에 큰 도움이 되었어요.",
      },
      {
        reviewer: "김영희",
        rating: 5,
        date: "2026-03-10",
        content:
          "경리 부서에 처음 배치되어 막막했는데, 이 강의 덕분에 기초를 탄탄히 다질 수 있었습니다. 강사님 설명이 명쾌합니다.",
      },
      {
        reviewer: "이철수",
        rating: 4,
        date: "2026-03-05",
        content:
          "전반적으로 만족스러운 강의입니다. 다만 법인세 부분이 좀 더 심화된 내용이 있으면 좋겠어요.",
      },
      {
        reviewer: "박지민",
        rating: 5,
        date: "2026-02-28",
        content:
          "개인사업자인데 매년 세금 신고 때마다 고민이었는데, 이 강의를 듣고 나서 자신감이 생겼습니다!",
      },
      {
        reviewer: "최수진",
        rating: 5,
        date: "2026-02-20",
        content:
          "세무사 시험 준비하면서 기초를 다지기 위해 수강했는데 기대 이상이었습니다. 실무 사례가 풍부해서 이해가 잘 됩니다.",
      },
    ],
    faqs: [
      {
        question: "수강 기한이 있나요?",
        answer:
          "수강 기한은 무제한입니다. 한 번 결제하시면 평생 소장하실 수 있으며, 이후 업데이트되는 내용도 추가 비용 없이 시청하실 수 있습니다.",
      },
      {
        question: "환불 규정은 어떻게 되나요?",
        answer:
          "결제 후 7일 이내, 강의 진도율 10% 미만일 경우 전액 환불이 가능합니다. 자세한 환불 정책은 이용약관을 참고해 주세요.",
      },
      {
        question: "수료증이 발급되나요?",
        answer:
          "네, 전체 커리큘럼의 80% 이상을 수강하시면 수료증이 자동 발급됩니다. 마이페이지에서 다운로드하실 수 있습니다.",
      },
      {
        question: "강의 자료는 제공되나요?",
        answer:
          "강의 교안(PDF), 실습 파일(엑셀), 신고서 양식 등의 자료가 제공됩니다. 강의 플레이어의 '강의자료' 탭에서 다운로드하실 수 있습니다.",
      },
    ],
  },
  {
    id: "lec-002",
    title: "인사노무 핵심 실무 과정 - 채용부터 퇴직까지",
    description:
      "인사관리와 노무관리의 핵심 실무를 체계적으로 학습하여, HR 전문가로 성장할 수 있는 종합 과정입니다.",
    categories: [
      { main: "인사", sub: "노무관리" },
      { main: "인사", sub: "채용·온보딩" },
    ],
    tags: ["인사관리", "노무관리", "근로기준법", "4대보험", "급여관리"],
    learningPoints: [
      "채용부터 퇴직까지 인사 라이프사이클 전체 이해",
      "근로기준법 핵심 조문 해석과 실무 적용",
      "4대 사회보험 취득·상실 신고 실무",
      "연차유급휴가 계산과 관리 방법",
    ],
    targetAudience: [
      "인사/총무 부서 신입 실무자",
      "소규모 사업장 대표 및 관리자",
      "HR 분야 커리어 전환을 희망하는 분",
    ],
    detail:
      "인사노무관리의 기초부터 심화까지 다루는 종합 과정입니다.\n\n근로기준법, 4대보험, 급여관리, 징계 및 해고 등 HR 실무자가 반드시 알아야 할 핵심 내용을 체계적으로 구성하였습니다.\n\n각 주제별 실무 사례와 양식(근로계약서, 4대보험 신고서 등)을 함께 제공하여 현장 적용력을 높였습니다.",
    curriculum: [
      { title: "인사관리의 이해", duration: "13:20" },
      { title: "채용과 선발", duration: "15:40" },
      { title: "인사평가 체계", duration: "17:00" },
      { title: "보상과 복리후생", duration: "14:00" },
      { title: "근로기준법 핵심", duration: "18:30" },
      { title: "근로계약서 작성", duration: "14:20" },
      { title: "임금과 근로시간", duration: "16:50" },
      { title: "연차유급휴가", duration: "13:40" },
      { title: "퇴직급여 제도", duration: "16:40" },
      { title: "국민연금 실무", duration: "15:10" },
      { title: "건강보험 실무", duration: "14:30" },
      { title: "고용보험 실무", duration: "16:20" },
      { title: "산재보험 실무", duration: "13:50" },
      { title: "사회보험 통합 신고", duration: "17:10" },
      { title: "징계 절차와 유의사항", duration: "16:00" },
      { title: "해고의 종류와 요건", duration: "18:20" },
      { title: "부당해고 구제신청", duration: "14:30" },
      { title: "인사노무 실무 사례 분석", duration: "18:50" },
    ],
    instructor: {
      name: "박인사",
      bio: "노무법인 대표 공인노무사로 12년간 기업 인사노무 컨설팅을 수행하고 있습니다. 중소기업 노무관리 전문가로 다수의 강의 경력을 보유하고 있습니다.",
    },
    price: 89000,
    rating: 4.7,
    reviewCount: 156,
    studentCount: 890,
    totalDuration: "4시간 40분",
    lessonCount: 18,
    level: "초급",
    updatedAt: "2026-03-10",
    reviews: [
      {
        reviewer: "장미래",
        rating: 5,
        date: "2026-03-08",
        content:
          "인사팀에 배치되고 나서 가장 도움이 된 강의입니다. 실무 양식까지 제공해주셔서 바로 업무에 활용하고 있어요.",
      },
      {
        reviewer: "윤하늘",
        rating: 4,
        date: "2026-03-01",
        content:
          "전반적으로 알차게 구성되어 있습니다. 4대보험 신고 부분이 특히 유용했습니다.",
      },
      {
        reviewer: "한솔",
        rating: 5,
        date: "2026-02-25",
        content:
          "소규모 사업장을 운영하면서 인사노무 관리에 어려움이 많았는데, 이 강의를 통해 체계를 잡을 수 있었습니다.",
      },
    ],
    faqs: [
      {
        question: "수강 기한이 있나요?",
        answer:
          "수강 기한은 무제한입니다. 한 번 결제하시면 언제든 다시 수강하실 수 있습니다.",
      },
      {
        question: "실무 양식이 제공되나요?",
        answer:
          "네, 근로계약서 표준 양식, 4대보험 취득·상실 신고서 양식, 연차유급휴가 계산 시트 등의 실무 양식이 제공됩니다.",
      },
      {
        question: "질문은 어떻게 할 수 있나요?",
        answer:
          "강의 플레이어의 Q&A 탭에서 질문을 남기시면 영업일 기준 2~3일 이내에 강사가 직접 답변드립니다.",
      },
    ],
  },
  {
    id: "lec-003",
    title: "4대보험 완전정복 - 실무자를 위한 핵심 가이드",
    description:
      "4대 사회보험(국민연금, 건강보험, 고용보험, 산재보험)의 취득·상실 신고부터 보수총액 정산까지 완벽 마스터합니다.",
    categories: [
      { main: "4대보험", sub: "취득·상실신고" },
      { main: "4대보험", sub: "보수총액 신고" },
    ],
    tags: ["4대보험", "국민연금", "건강보험", "고용보험", "산재보험"],
    learningPoints: [
      "4대 사회보험 제도 전체 구조 이해",
      "취득·상실 신고 실무 완벽 마스터",
      "보수총액 신고와 정산 프로세스",
    ],
    targetAudience: [
      "4대보험 업무를 처음 담당하게 된 실무자",
      "급여 업무를 겸하는 경리/회계 담당자",
    ],
    detail:
      "4대 사회보험의 기초 개념부터 실무 신고까지 한 번에 마스터할 수 있는 과정입니다.\n\n각 보험별 적용 대상, 보험료 계산 방법, 취득·상실 신고 절차를 상세히 다루며, 연간 보수총액 신고와 건강보험 정산까지 체계적으로 학습합니다.",
    curriculum: [
      { title: "4대보험 제도 개요", duration: "14:20" },
      { title: "적용 대상과 제외 대상", duration: "12:40" },
      { title: "국민연금 취득·상실 신고", duration: "16:30" },
      { title: "건강보험 취득·상실 신고", duration: "15:20" },
      { title: "고용보험 취득·상실 신고", duration: "14:50" },
      { title: "산재보험 기본 실무", duration: "13:10" },
      { title: "보험료 계산 방법", duration: "18:20" },
      { title: "보수총액 신고 절차", duration: "20:15" },
      { title: "건강보험 연말정산", duration: "17:40" },
      { title: "일자리 안정자금 신청", duration: "14:30" },
      { title: "현지조사 대응 방법", duration: "16:00" },
      { title: "종합 사례와 Q&A", duration: "15:45" },
    ],
    instructor: {
      name: "이보험",
      bio: "사회보험노무사로 10년간 4대보험 전문 컨설팅을 수행하고 있습니다. 국민건강보험공단 자문위원을 역임하였습니다.",
    },
    price: 42000,
    originalPrice: 60000,
    discountRate: 30,
    rating: 4.9,
    reviewCount: 312,
    studentCount: 2100,
    totalDuration: "3시간 10분",
    lessonCount: 12,
    level: "입문",
    updatedAt: "2026-03-20",
    reviews: [
      {
        reviewer: "정하나",
        rating: 5,
        date: "2026-03-18",
        content:
          "4대보험 업무를 처음 맡게 되었는데, 이 강의 하나로 기본기를 다질 수 있었습니다. 정말 추천합니다!",
      },
      {
        reviewer: "김민수",
        rating: 5,
        date: "2026-03-12",
        content:
          "보수총액 신고 부분이 특히 도움이 되었습니다. 실제 서식을 활용한 실습이 좋았어요.",
      },
      {
        reviewer: "이서연",
        rating: 4,
        date: "2026-03-05",
        content:
          "깔끔한 설명과 체계적인 구성이 인상적입니다. 건강보험 정산 부분이 더 상세했으면 합니다.",
      },
      {
        reviewer: "송재민",
        rating: 5,
        date: "2026-02-28",
        content:
          "경리 업무를 하면서 4대보험이 항상 헷갈렸는데 확실히 정리되었습니다. 감사합니다.",
      },
      {
        reviewer: "오지영",
        rating: 5,
        date: "2026-02-20",
        content:
          "현지조사 대응 방법 강의가 특히 유용했습니다. 실무에서 겪을 수 있는 상황을 잘 설명해주세요.",
      },
    ],
    faqs: [
      {
        question: "수강 기한이 있나요?",
        answer: "수강 기한은 무제한이며, 한 번 결제하시면 평생 소장 가능합니다.",
      },
      {
        question: "환불이 가능한가요?",
        answer:
          "결제 후 7일 이내, 강의 진도율 10% 미만일 경우 전액 환불됩니다.",
      },
      {
        question: "강의 업데이트가 있나요?",
        answer:
          "매년 보험료율 변경, 제도 개편 등 주요 변경사항이 있을 때마다 강의가 업데이트됩니다. 추가 비용은 없습니다.",
      },
    ],
  },
];

export function getLectureById(id: string): LectureDetail | undefined {
  return allLectures.find((l) => l.id === id);
}
