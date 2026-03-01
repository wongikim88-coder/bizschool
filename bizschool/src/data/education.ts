import type { EducationCourse } from "@/types";

// 카테고리 색상 매핑
export const categoryColors: Record<string, string> = {
  "세무회계": "text-blue-600",
  "특강": "text-amber-500",
  "재산제세(이론)": "text-emerald-600",
};

// 연도 범위
export const YEAR_RANGE = { min: 2006, max: 2027 };

// 관리자 기본 페이지 설정 (null이면 현재 날짜 기준)
export const DEFAULT_PAGE: { year: number; month: number } | null = {
  year: 2026,
  month: 4,
};

// 2026년 4월 교육과정 데이터 (참조 사이트 기반)
export const educationCourses: EducationCourse[] = [
  {
    id: 1,
    category: "세무회계",
    title: "고경희 세무사의 상속증여세 실무(2026)",
    dateRange: "2026-04-03 ~ 2026-04-11(매주 금토)",
    timeRange: "13:00 ~ 19:00 (4일 24시간)",
    fee: 550000,
    instructor: "고경희 세무사",
    status: "open",
  },
  {
    id: 2,
    category: "특강",
    title: "MSO법인과 병의원 절세컨설팅",
    dateRange: "2026-04-08(수)",
    timeRange: "13:00 ~ 17:00 (1일 4시간)",
    fee: 200000,
    instructor: "윤창인 공인회계사, 세무사",
    status: "open",
  },
  {
    id: 3,
    category: "재산제세(이론)",
    title: "주택임대사업자의 모든 것(2026)",
    dateRange: "2026-04-15(수)",
    timeRange: "13:00 ~ 18:00 (1일 5시간)",
    fee: 150000,
    instructor: "지병근 세무사",
    status: "open",
  },
  {
    id: 4,
    category: "특강",
    title: "법인컨설팅을 위한 보험세무 핵심포인트(2026)",
    dateRange: "2026-04-16(목)",
    timeRange: "13:00 ~ 18:00 (1일 5시간)",
    fee: 150000,
    instructor: "박진호 세무사",
    status: "open",
  },
  {
    id: 5,
    category: "재산제세(이론)",
    title: "정문현교수의 핵심실무 양도소득세(2026)",
    dateRange: "2026-04-17 ~ 2026-04-25(금토)",
    timeRange: "13:00 ~ 19:00 (3일 18시간)",
    fee: 420000,
    instructor: "정문현 교수",
    status: "open",
  },
  {
    id: 6,
    category: "재산제세(이론)",
    title: "2026부동산세금의 정석(Ⅰ)",
    dateRange: "2026-04-22(수)",
    timeRange: "13:00 ~ 18:00 (1일 5시간)",
    fee: 150000,
    instructor: "지병근 세무사",
    status: "open",
  },
  {
    id: 7,
    category: "특강",
    title: "국세청 세무조사, 금융조사 및 조세범칙조사",
    dateRange: "2026-04-23(목)",
    timeRange: "13:00 ~ 17:00 (1일 4시간)",
    fee: 220000,
    instructor: "윤창인 공인회계사, 세무사",
    status: "open",
  },
  {
    id: 8,
    category: "재산제세(이론)",
    title: "2026부동산세금의 정석(Ⅱ)",
    dateRange: "2026-04-29(수)",
    timeRange: "13:00 ~ 18:00 (1일 5시간)",
    fee: 150000,
    instructor: "지병근 세무사",
    status: "open",
  },
];

// 과정을 카테고리별로 그룹화 (원본 순서 유지)
export function groupByCategory(courses: EducationCourse[]) {
  const groups: { category: string; courses: EducationCourse[] }[] = [];
  let currentCategory = "";

  for (const course of courses) {
    if (course.category !== currentCategory) {
      groups.push({ category: course.category, courses: [course] });
      currentCategory = course.category;
    } else {
      groups[groups.length - 1].courses.push(course);
    }
  }

  return groups;
}

// 금액 포맷
export function formatFee(fee: number): string {
  return fee.toLocaleString("ko-KR") + "원";
}
