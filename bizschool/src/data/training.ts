import type { EducationCourse } from "@/types";

// ── 과정소개 데이터 ──

export interface TrainingProgram {
  id: number;
  title: string;
  description: string;
}

export const trainingPrograms: TrainingProgram[] = [
  {
    id: 1,
    title: "건설업 세무회계",
    description: "실무상 과세쟁점 및 사례중심",
  },
  {
    id: 2,
    title: "부가가치세 신고실무",
    description: "세무조사 대비 무결점",
  },
  {
    id: 3,
    title: "양도세 실무업무",
    description: "중소기업 근로자 대상",
  },
  {
    id: 4,
    title: "법인세 신고실무",
    description: "세무조사 대비 무결점",
  },
];

// ── 교육일정 설정 ──

export const YEAR_RANGE = { min: 2006, max: 2027 };

export const DEFAULT_PAGE: { year: number; month: number } | null = {
  year: 2026,
  month: 4,
};

// ── 교육일정 Mock 데이터 ──

export const trainingCourses: EducationCourse[] = [
  {
    id: 101,
    category: "중기주도훈련",
    title: "[중기주도훈련]건설업 세무회계 실무(서울)",
    dateRange: "2026-04-07 ~ 2026-04-08(월화)",
    timeRange: "09:00 ~ 17:00 (2일 14시간)",
    fee: 420000,
    instructor: "김정호 세무사",
    status: "open",
  },
  {
    id: 102,
    category: "중기주도훈련",
    title: "[중기주도훈련]세무조사 대비 무결점 부가가치세 신고실무(서울)",
    dateRange: "2026-04-14 ~ 2026-04-15(월화)",
    timeRange: "09:00 ~ 17:00 (2일 14시간)",
    fee: 420000,
    instructor: "김정호 세무사",
    status: "open",
  },
  {
    id: 103,
    category: "중기주도훈련",
    title: "[중기주도훈련]양도세 실무업무(서울)",
    dateRange: "2026-04-21 ~ 2026-04-22(월화)",
    timeRange: "09:00 ~ 17:00 (2일 14시간)",
    fee: 420000,
    instructor: "김정호 세무사",
    status: "open",
  },
  {
    id: 104,
    category: "중기주도훈련",
    title: "[중기주도훈련]세무조사 대비 무결점 법인세 신고실무(청주)",
    dateRange: "2026-04-28 ~ 2026-04-29(월화)",
    timeRange: "09:00 ~ 17:00 (2일 14시간)",
    fee: 420000,
    instructor: "김정호 세무사",
    status: "open",
  },
];

// ── 유틸리티 함수 ──

export function formatFee(fee: number): string {
  return fee.toLocaleString("ko-KR") + "원";
}
