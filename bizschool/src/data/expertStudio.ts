import type {
  StudioTab,
  ExpertCourse,
  StudioQuestion,
  MonthlyRevenue,
  SettlementRecord,
  MeetingRequest,
  RecentActivity,
} from "@/types";

// ── 탭 정의 ──

export const studioTabs: { key: StudioTab; label: string }[] = [
  { key: "dashboard", label: "대시보드" },
  { key: "courses", label: "강의 관리" },
  { key: "qna", label: "질문 관리" },
  { key: "revenue", label: "수익 관리" },
  { key: "guide", label: "전문가 가이드" },
  { key: "meeting", label: "미팅 요청" },
];

// ── 강의 Mock 데이터 (5건) ──

export const expertCourses: ExpertCourse[] = [
  {
    id: "ec-1",
    title: "2026 세무회계 실무 완성",
    thumbnailUrl: "/images/course-thumb-1.jpg",
    category: "세무회계",
    status: "published",
    createdAt: "2025-11-15",
    updatedAt: "2026-03-20",
    studentCount: 156,
    rating: 4.7,
    completionRate: 78,
    totalRevenue: 4680000,
  },
  {
    id: "ec-2",
    title: "법인세 핵심정리 특강",
    thumbnailUrl: "/images/course-thumb-2.jpg",
    category: "법인세",
    status: "published",
    createdAt: "2026-01-10",
    updatedAt: "2026-03-18",
    studentCount: 89,
    rating: 4.5,
    completionRate: 65,
    totalRevenue: 2670000,
  },
  {
    id: "ec-3",
    title: "부가가치세 신고실무",
    thumbnailUrl: "/images/course-thumb-3.jpg",
    category: "부가세",
    status: "under_review",
    createdAt: "2026-03-01",
    updatedAt: "2026-03-22",
    studentCount: 0,
    rating: 0,
    completionRate: 0,
    totalRevenue: 0,
  },
  {
    id: "ec-4",
    title: "4대보험 실무 가이드",
    thumbnailUrl: "/images/course-thumb-4.jpg",
    category: "4대보험",
    status: "draft",
    createdAt: "2026-03-15",
    updatedAt: "2026-03-25",
    studentCount: 0,
    rating: 0,
    completionRate: 0,
    totalRevenue: 0,
  },
  {
    id: "ec-5",
    title: "전산세무 2급 집중반",
    thumbnailUrl: "/images/course-thumb-5.jpg",
    category: "전산세무",
    status: "rejected",
    createdAt: "2026-02-20",
    updatedAt: "2026-03-10",
    studentCount: 0,
    rating: 0,
    completionRate: 0,
    totalRevenue: 0,
    rejectionReason:
      "강의 영상 화질이 기준에 미달합니다. 720p 이상으로 재촬영해 주세요.",
  },
];

// ── Q&A Mock 데이터 (10건) ──

export const studioQuestions: StudioQuestion[] = [
  {
    id: "q-1",
    courseId: "ec-1",
    courseTitle: "2026 세무회계 실무 완성",
    studentName: "김수강",
    title: "세금계산서 발행 기한 관련 질문",
    content:
      "세금계산서 발행 기한이 매월 10일까지인가요, 아니면 거래 후 즉시 발행해야 하나요?",
    createdAt: "2026-03-25T14:30:00",
    status: "unanswered",
  },
  {
    id: "q-2",
    courseId: "ec-1",
    courseTitle: "2026 세무회계 실무 완성",
    studentName: "이학생",
    title: "부가세 매입세액 공제 범위",
    content: "접대비로 사용한 금액도 매입세액 공제가 가능한가요?",
    createdAt: "2026-03-24T10:15:00",
    status: "unanswered",
  },
  {
    id: "q-3",
    courseId: "ec-2",
    courseTitle: "법인세 핵심정리 특강",
    studentName: "박세무",
    title: "법인세 중간예납 면제 조건",
    content:
      "직전 사업연도 법인세가 일정 금액 이하면 중간예납이 면제되는 것으로 알고 있는데, 정확한 기준 금액이 얼마인가요?",
    createdAt: "2026-03-23T16:45:00",
    status: "unanswered",
  },
  {
    id: "q-4",
    courseId: "ec-1",
    courseTitle: "2026 세무회계 실무 완성",
    studentName: "최회계",
    title: "강의 자료 다운로드 관련",
    content:
      "3강 강의 자료 PDF가 다운로드되지 않습니다. 확인 부탁드립니다.",
    createdAt: "2026-03-22T09:00:00",
    status: "answered",
    answer: {
      content:
        "안녕하세요, 해당 자료 링크를 수정했습니다. 다시 시도해 주세요.",
      answeredAt: "2026-03-22T11:30:00",
    },
  },
  {
    id: "q-5",
    courseId: "ec-2",
    courseTitle: "법인세 핵심정리 특강",
    studentName: "정경리",
    title: "이월결손금 공제 한도",
    content: "이월결손금 공제 한도가 각 사업연도 소득의 몇 퍼센트인가요?",
    createdAt: "2026-03-21T13:20:00",
    status: "answered",
    answer: {
      content:
        "중소기업은 100%, 일반기업은 60%입니다. 강의 5강에서 자세히 다루고 있습니다.",
      answeredAt: "2026-03-21T15:00:00",
    },
  },
  {
    id: "q-6",
    courseId: "ec-1",
    courseTitle: "2026 세무회계 실무 완성",
    studentName: "한실무",
    title: "종합소득세 신고 시 필요서류",
    content:
      "프리랜서 종합소득세 신고 시 필요한 서류 목록을 알 수 있을까요?",
    createdAt: "2026-03-20T11:00:00",
    status: "answered",
    answer: {
      content:
        "소득금액증명원, 사업소득 원천징수영수증, 경비 증빙 자료가 필요합니다. 4강을 참고해 주세요.",
      answeredAt: "2026-03-20T14:00:00",
    },
  },
  {
    id: "q-7",
    courseId: "ec-2",
    courseTitle: "법인세 핵심정리 특강",
    studentName: "오공부",
    title: "세무조정 순서 관련",
    content: "세무조정을 어떤 순서로 진행하면 효율적인가요?",
    createdAt: "2026-03-19T10:30:00",
    status: "answered",
    answer: {
      content:
        "결산조정 → 신고조정 → 소득처분 순서로 진행하시면 됩니다.",
      answeredAt: "2026-03-19T16:00:00",
    },
  },
  {
    id: "q-8",
    courseId: "ec-1",
    courseTitle: "2026 세무회계 실무 완성",
    studentName: "윤학습",
    title: "전자세금계산서 의무발급 대상",
    content: "개인사업자도 전자세금계산서 의무발급 대상인가요?",
    createdAt: "2026-03-18T14:00:00",
    status: "answered",
    answer: {
      content:
        "직전연도 공급가액 합계 1억원 이상인 개인사업자는 의무발급 대상입니다.",
      answeredAt: "2026-03-18T17:30:00",
    },
  },
  {
    id: "q-9",
    courseId: "ec-1",
    courseTitle: "2026 세무회계 실무 완성",
    studentName: "장수강",
    title: "수정세금계산서 발급 사유",
    content: "수정세금계산서는 어떤 경우에 발급할 수 있나요?",
    createdAt: "2026-03-17T09:45:00",
    status: "answered",
    answer: {
      content:
        "기재사항 착오, 환입, 계약의 해제 등의 사유가 있을 때 발급합니다. 2강에서 다루고 있습니다.",
      answeredAt: "2026-03-17T12:00:00",
    },
  },
  {
    id: "q-10",
    courseId: "ec-2",
    courseTitle: "법인세 핵심정리 특강",
    studentName: "김학습",
    title: "접대비 한도 계산 방법",
    content: "접대비 한도를 계산하는 기본 공식을 알려주세요.",
    createdAt: "2026-03-16T15:30:00",
    status: "answered",
    answer: {
      content:
        "기본한도(1,200만~3,600만) + 수입금액별 적수로 계산합니다. 3강 자료를 참고하세요.",
      answeredAt: "2026-03-16T18:00:00",
    },
  },
];

// ── 월별 수익 Mock (6개월) ──

export const monthlyRevenues: MonthlyRevenue[] = [
  { month: "2025-10", grossSales: 890000, platformFee: 178000, netRevenue: 712000 },
  { month: "2025-11", grossSales: 1250000, platformFee: 250000, netRevenue: 1000000 },
  { month: "2025-12", grossSales: 1580000, platformFee: 316000, netRevenue: 1264000 },
  { month: "2026-01", grossSales: 1420000, platformFee: 284000, netRevenue: 1136000 },
  { month: "2026-02", grossSales: 1680000, platformFee: 336000, netRevenue: 1344000 },
  { month: "2026-03", grossSales: 1530000, platformFee: 306000, netRevenue: 1224000 },
];

// ── 정산 내역 Mock (3건) ──

export const settlementRecords: SettlementRecord[] = [
  { id: "s-1", period: "2026년 2월", amount: 1344000, status: "정산완료", payoutDate: "2026-03-15" },
  { id: "s-2", period: "2026년 3월", amount: 1224000, status: "정산예정", payoutDate: "2026-04-15" },
  { id: "s-3", period: "2026년 1월", amount: 1136000, status: "정산완료", payoutDate: "2026-02-15" },
];

// ── 미팅 요청 Mock (5건) ──

export const meetingRequests: MeetingRequest[] = [
  { id: "m-1", topic: "콘텐츠 전략", preferredDate: "2026-04-05", message: "신규 강의 시리즈 기획 관련 상담을 요청합니다.", requestedAt: "2026-03-25", status: "검토중" },
  { id: "m-2", topic: "수익 개선", preferredDate: "2026-03-28", message: "강의 가격 전략과 프로모션 운영에 대해 논의하고 싶습니다.", requestedAt: "2026-03-20", status: "확정됨" },
  { id: "m-3", topic: "강의 품질", preferredDate: "2026-03-15", message: "반려된 강의의 품질 개선 방향에 대해 상담 요청합니다.", requestedAt: "2026-03-10", status: "완료" },
  { id: "m-4", topic: "기타", preferredDate: "2026-02-25", message: "전문가 프로필 최적화 관련 미팅 요청합니다.", requestedAt: "2026-02-20", status: "완료" },
  { id: "m-5", topic: "콘텐츠 전략", preferredDate: "2026-02-10", message: "첫 강의 업로드 가이드 관련 질문이 있습니다.", requestedAt: "2026-02-05", status: "완료" },
];

// ── 최근 활동 Mock (5건) ──

export const recentActivities: RecentActivity[] = [
  { id: "a-1", type: "new_question", description: "김수강님이 '세무회계 실무 완성'에 새 질문을 등록했습니다.", createdAt: "2026-03-25T14:30:00" },
  { id: "a-2", type: "new_enrollment", description: "3명의 새 수강생이 '법인세 핵심정리 특강'에 등록했습니다.", createdAt: "2026-03-25T10:00:00" },
  { id: "a-3", type: "settlement_completed", description: "2026년 2월 정산이 완료되었습니다. (₩1,344,000)", createdAt: "2026-03-15T09:00:00" },
  { id: "a-4", type: "new_question", description: "이학생님이 '세무회계 실무 완성'에 새 질문을 등록했습니다.", createdAt: "2026-03-24T10:15:00" },
  { id: "a-5", type: "course_published", description: "'부가가치세 신고실무' 강의가 검토 상태로 변경되었습니다.", createdAt: "2026-03-22T09:00:00" },
];

// ── 전문가 가이드 콘텐츠 ──

export const guideSteps = [
  { step: 1, title: "강의 주제 선정", description: "수강생이 필요로 하는 주제를 선정하세요. BIZSCHOOL 인기 카테고리(세무회계, 법인세, 4대보험)를 참고하면 좋습니다.", tip: "기존에 없는 틈새 주제를 선택하면 경쟁이 적어 노출이 유리합니다." },
  { step: 2, title: "강의 구성 설계", description: "전체 커리큘럼을 섹션과 강의로 나누어 설계하세요. 각 강의는 10~20분 분량이 적절합니다.", tip: "첫 강의는 무료 미리보기로 제공하면 수강 전환율이 높아집니다." },
  { step: 3, title: "강의 영상 촬영", description: "720p 이상 해상도로 촬영하세요. 조명과 마이크 품질이 수강생 만족도에 큰 영향을 미칩니다.", tip: "OBS Studio나 Camtasia를 활용하면 화면 녹화가 편리합니다." },
  { step: 4, title: "강의 자료 준비", description: "PDF 교안, 실습 파일, 퀴즈 등 보조 자료를 준비하세요. 자료가 풍부할수록 수강생 만족도가 높습니다." },
  { step: 5, title: "콘텐츠 업로드", description: "'콘텐츠 업로드' 버튼을 클릭하여 강의 정보를 입력하고 영상을 업로드하세요.", tip: "썸네일 이미지는 1280x720px 권장. 강의 내용을 잘 전달하는 이미지를 사용하세요." },
  { step: 6, title: "검토 및 게시", description: "업로드 후 BIZSCHOOL 팀이 콘텐츠를 검토합니다. 검토에는 보통 3~5 영업일이 소요됩니다. 승인되면 자동으로 게시됩니다.", tip: "반려 시 사유를 확인하고 수정 후 재제출할 수 있습니다." },
];

export const guideFaqs = [
  { question: "강의 영상은 어떤 형식으로 업로드하나요?", answer: "MP4 형식을 권장합니다. 해상도는 720p 이상, 파일 크기는 강의당 최대 2GB입니다." },
  { question: "강의 가격은 어떻게 설정하나요?", answer: "최소 10,000원부터 자유롭게 설정할 수 있습니다. 경쟁 강의 가격과 시장 수요를 고려하여 설정하세요." },
  { question: "플랫폼 수수료는 얼마인가요?", answer: "판매 금액의 20%가 플랫폼 수수료로 차감됩니다. 정산은 매월 15일에 진행됩니다." },
  { question: "강의를 수정할 수 있나요?", answer: "게시된 강의도 수정할 수 있습니다. '강의 관리' 탭에서 해당 강의의 '편집' 버튼을 클릭하세요." },
  { question: "반려된 강의는 어떻게 하나요?", answer: "반려 사유를 확인하고 해당 부분을 수정한 후 다시 제출하면 됩니다. 반려 사유는 '강의 관리' 탭에서 확인할 수 있습니다." },
  { question: "정산은 언제 되나요?", answer: "매월 1일~말일 발생한 수익은 다음 달 15일에 정산됩니다. 정산 상태는 '수익 관리' 탭에서 확인할 수 있습니다." },
  { question: "수강생 질문에 답변하지 않으면 어떻게 되나요?", answer: "48시간 이내 답변을 권장합니다. 장기간 미답변 시 수강생 만족도에 영향을 줄 수 있습니다." },
  { question: "MD 미팅은 무료인가요?", answer: "네, 담당 MD와의 미팅은 무료입니다. '미팅 요청' 탭에서 원하는 일정을 선택하여 신청하세요." },
];

// ── 헬퍼 함수 ──

export function getTotalStudents(courses: ExpertCourse[]): number {
  return courses.reduce((sum, c) => sum + c.studentCount, 0);
}

export function getTotalRevenue(courses: ExpertCourse[]): number {
  return courses.reduce((sum, c) => sum + c.totalRevenue, 0);
}

export function getAverageRating(courses: ExpertCourse[]): number {
  const published = courses.filter((c) => c.status === "published" && c.rating > 0);
  if (published.length === 0) return 0;
  return published.reduce((sum, c) => sum + c.rating, 0) / published.length;
}

export function formatKRW(amount: number): string {
  return new Intl.NumberFormat("ko-KR").format(amount);
}

export function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}시간 전`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}일 전`;
  return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
}
