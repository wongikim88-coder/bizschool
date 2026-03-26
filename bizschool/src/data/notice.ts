import type { Notice } from "@/types";

export const NOTICES_PER_PAGE = 10;

export const notices: Notice[] = [
  // 중요 공지 3건
  {
    id: 1,
    title: "2026년 상반기 교육과정 안내",
    content: `<p>안녕하세요, 비즈스쿨입니다.</p>
<p>2026년 상반기 교육과정이 확정되어 안내드립니다. 세무회계, 재산제세, 특강 등 다양한 교육과정이 준비되어 있으며, 자세한 일정은 현장 강의 페이지에서 확인하실 수 있습니다.</p>
<p>많은 관심과 참여 부탁드립니다.</p>`,
    author: "관리자",
    createdAt: "2026-03-20",
    views: 254,
    isImportant: true,
  },
  {
    id: 2,
    title: "시스템 정기 점검 안내 (3/25 02:00~06:00)",
    content: `<p>안녕하세요, 비즈스쿨입니다.</p>
<p>서비스 안정성 향상을 위한 시스템 정기 점검이 아래 일정으로 진행됩니다.</p>
<p><strong>점검 일시:</strong> 2026년 3월 25일(수) 02:00 ~ 06:00 (약 4시간)</p>
<p><strong>점검 내용:</strong> 서버 업데이트 및 보안 패치</p>
<p>점검 시간 동안 서비스 이용이 일시적으로 제한될 수 있습니다. 이용에 불편을 드려 죄송합니다.</p>`,
    author: "관리자",
    createdAt: "2026-03-18",
    views: 180,
    isImportant: true,
  },
  {
    id: 3,
    title: "개인정보처리방침 변경 안내",
    content: `<p>안녕하세요, 비즈스쿨입니다.</p>
<p>개인정보처리방침이 2026년 4월 1일부로 아래와 같이 변경됩니다.</p>
<p><strong>주요 변경 사항:</strong></p>
<ul>
<li>개인정보 보유 기간 명확화</li>
<li>제3자 제공 항목 정비</li>
<li>개인정보 보호책임자 연락처 변경</li>
</ul>
<p>변경된 개인정보처리방침은 시행일로부터 효력이 발생합니다.</p>`,
    author: "관리자",
    createdAt: "2026-03-15",
    views: 122,
    isImportant: true,
  },
  // 일반 공지 17건
  {
    id: 4,
    title: "3월 신규 강의 오픈 안내",
    content: `<p>3월 신규 강의가 오픈되었습니다.</p>
<p>실무에서 바로 활용할 수 있는 세무회계 강의와 재산제세 심화 과정이 새롭게 추가되었습니다. 강의 목록에서 확인해 보세요.</p>`,
    author: "관리자",
    createdAt: "2026-03-12",
    views: 67,
    isImportant: false,
  },
  {
    id: 5,
    title: "도서 할인 이벤트 안내 (3월 한정)",
    content: `<p>3월 한 달간 비즈스쿨 도서 전 품목 15% 할인 이벤트를 진행합니다.</p>
<p>이벤트 기간: 2026.03.01 ~ 2026.03.31</p>
<p>도서 페이지에서 할인된 가격으로 만나보세요.</p>`,
    author: "관리자",
    createdAt: "2026-03-10",
    views: 89,
    isImportant: false,
  },
  {
    id: 6,
    title: "2026년 근로자 주도훈련 신청 안내",
    content: `<p>2026년 근로자 주도훈련 과정 신청이 시작되었습니다.</p>
<p>훈련비 지원을 받으실 수 있으며, 자세한 내용은 근로자 주도훈련 페이지에서 확인해 주세요.</p>`,
    author: "관리자",
    createdAt: "2026-03-08",
    views: 156,
    isImportant: false,
  },
  {
    id: 7,
    title: "강의장 시설 리뉴얼 완료 안내",
    content: `<p>비즈스쿨 강의장 시설 리뉴얼이 완료되었습니다.</p>
<p>최신 멀티미디어 장비와 개선된 학습 환경에서 수강하실 수 있습니다.</p>`,
    author: "관리자",
    createdAt: "2026-03-05",
    views: 73,
    isImportant: false,
  },
  {
    id: 8,
    title: "설 연휴 고객센터 운영 안내",
    content: `<p>설 연휴 기간 고객센터 운영 안내드립니다.</p>
<p>휴무 기간: 2026.02.15(토) ~ 2026.02.18(화)</p>
<p>연휴 기간 중 문의사항은 1:1 문의 게시판을 이용해 주시면 업무 재개일에 순차적으로 답변드리겠습니다.</p>`,
    author: "관리자",
    createdAt: "2026-02-28",
    views: 95,
    isImportant: false,
  },
  {
    id: 9,
    title: "모바일 앱 업데이트 안내 (v2.5.0)",
    content: `<p>비즈스쿨 모바일 앱이 v2.5.0으로 업데이트되었습니다.</p>
<p>주요 변경 사항: 강의 다운로드 기능 개선, 알림 설정 추가, 버그 수정</p>`,
    author: "관리자",
    createdAt: "2026-02-25",
    views: 48,
    isImportant: false,
  },
  {
    id: 10,
    title: "2월 베스트 강의 선정 결과",
    content: `<p>2026년 2월 베스트 강의가 선정되었습니다.</p>
<p>수강생 평가와 수강률을 종합하여 선정된 강의를 확인해 보세요.</p>`,
    author: "관리자",
    createdAt: "2026-02-20",
    views: 112,
    isImportant: false,
  },
  {
    id: 11,
    title: "전문가 상담 서비스 확대 안내",
    content: `<p>AI 전문가 상담 서비스가 확대 운영됩니다.</p>
<p>세무, 회계, 노무 등 다양한 분야의 전문가 상담을 이용하실 수 있습니다.</p>`,
    author: "관리자",
    createdAt: "2026-02-15",
    views: 63,
    isImportant: false,
  },
  {
    id: 12,
    title: "수료증 발급 기능 업데이트 안내",
    content: `<p>수료증 발급 기능이 업데이트되었습니다.</p>
<p>마이페이지에서 수료한 강의의 수료증을 PDF로 다운로드하실 수 있습니다.</p>`,
    author: "관리자",
    createdAt: "2026-02-10",
    views: 87,
    isImportant: false,
  },
  {
    id: 13,
    title: "2026년 1분기 현장 강의 일정 안내",
    content: `<p>2026년 1분기 현장 강의 일정을 안내드립니다.</p>
<p>현장 강의 페이지에서 월별 교육 일정을 확인하시고 수강 신청해 주세요.</p>`,
    author: "관리자",
    createdAt: "2026-02-05",
    views: 198,
    isImportant: false,
  },
  {
    id: 14,
    title: "비즈스쿨 커뮤니티 오픈 안내",
    content: `<p>비즈스쿨 커뮤니티가 새롭게 오픈되었습니다.</p>
<p>강의 질문, 상담 사례, 자유 토론 등 다양한 주제로 소통할 수 있는 공간입니다.</p>`,
    author: "관리자",
    createdAt: "2026-01-28",
    views: 231,
    isImportant: false,
  },
  {
    id: 15,
    title: "결제 수단 추가 안내 (카카오페이, 네이버페이)",
    content: `<p>간편결제 수단이 추가되었습니다.</p>
<p>카카오페이, 네이버페이로 더욱 편리하게 결제하실 수 있습니다.</p>`,
    author: "관리자",
    createdAt: "2026-01-25",
    views: 76,
    isImportant: false,
  },
  {
    id: 16,
    title: "신년 특별 할인 이벤트 종료 안내",
    content: `<p>신년 특별 할인 이벤트가 1월 31일부로 종료됩니다.</p>
<p>아직 수강 신청하지 않으신 분들은 서둘러 주세요.</p>`,
    author: "관리자",
    createdAt: "2026-01-20",
    views: 54,
    isImportant: false,
  },
  {
    id: 17,
    title: "2026년 비즈스쿨 운영 계획 안내",
    content: `<p>2026년 비즈스쿨 운영 계획을 안내드립니다.</p>
<p>올해도 다양한 교육 콘텐츠와 서비스 개선으로 수강생 여러분께 더 나은 학습 경험을 제공하겠습니다.</p>`,
    author: "관리자",
    createdAt: "2026-01-15",
    views: 167,
    isImportant: false,
  },
  {
    id: 18,
    title: "홈페이지 리뉴얼 안내",
    content: `<p>비즈스쿨 홈페이지가 새롭게 리뉴얼되었습니다.</p>
<p>더욱 편리한 UI/UX와 빠른 로딩 속도로 개선되었습니다. 이용 중 불편사항은 1:1 문의로 알려주세요.</p>`,
    author: "관리자",
    createdAt: "2026-01-10",
    views: 289,
    isImportant: false,
  },
  {
    id: 19,
    title: "2025년 연말정산 특별 강의 안내",
    content: `<p>연말정산 시즌을 맞아 특별 강의를 준비했습니다.</p>
<p>실무에서 꼭 알아야 할 연말정산 핵심 포인트를 정리한 무료 특강입니다.</p>`,
    author: "관리자",
    createdAt: "2026-01-05",
    views: 312,
    isImportant: false,
  },
  {
    id: 20,
    title: "신년 인사 및 휴무 안내",
    content: `<p>새해 복 많이 받으세요!</p>
<p>2026년에도 비즈스쿨이 여러분의 성장을 함께하겠습니다.</p>
<p>신년 휴무: 2026.01.01(목) ~ 2026.01.02(금)</p>`,
    author: "관리자",
    createdAt: "2026-01-01",
    views: 145,
    isImportant: false,
  },
];

/** 중요 공지를 상단에 배치 + 일반 공지는 ID 내림차순 */
export function getSortedNotices(allNotices: Notice[]): Notice[] {
  const important = allNotices.filter((n) => n.isImportant);
  const normal = allNotices
    .filter((n) => !n.isImportant)
    .sort((a, b) => b.id - a.id);
  return [...important, ...normal];
}

/** 검색 필터 */
export function filterNotices(allNotices: Notice[], search: string): Notice[] {
  if (!search) return allNotices;
  const query = search.toLowerCase();
  return allNotices.filter((n) => n.title.toLowerCase().includes(query));
}
