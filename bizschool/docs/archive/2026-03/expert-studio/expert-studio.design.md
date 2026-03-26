# expert-studio Design Document

> **Summary**: 전문가 스튜디오 (`/expert/center`) 상세 설계. 전문가 전용 관리 대시보드로 강의 관리, Q&A 관리, 수익 관리, 전문가 가이드, 미팅 요청, 대시보드 6개 탭 구성.
>
> **Project**: BIZSCHOOL
> **Version**: 1.0
> **Author**: allen
> **Date**: 2026-03-26
> **Plan Reference**: `docs/01-plan/features/expert-studio.plan.md` (v0.1)

---

## 1. Architecture Overview

### 1.1 Component Tree

```
/expert/center (page.tsx - Server Component, auth guard)
└── ExpertStudioLayout (Client Component)
    ├── ExpertStudioSidebar (Desktop only, md이상)
    ├── Mobile Tab Bar (md미만, inline)
    └── Tab Content (조건부 렌더링)
        ├── tab="dashboard"  → StudioDashboard
        │   ├── KpiCard (x4)
        │   ├── RecentActivity
        │   └── RevenueTrendChart
        ├── tab="courses"    → StudioCourses
        │   ├── CourseFilterBar
        │   ├── CourseTable (Desktop) / CourseCard (Mobile)
        │   └── Pagination (inline)
        ├── tab="qna"        → StudioQna
        │   ├── QnaFilterBar
        │   ├── QnaTable (Desktop) / QnaCard (Mobile)
        │   ├── QnaDetail (조건부)
        │   └── Pagination (inline)
        ├── tab="revenue"    → StudioRevenue
        │   ├── RevenueSummaryCard
        │   ├── MonthlyRevenueTable
        │   ├── CourseRevenueTable
        │   └── SettlementHistory
        ├── tab="guide"      → StudioGuide
        │   ├── StepGuide (numbered steps)
        │   └── FaqAccordion
        └── tab="meeting"    → StudioMeeting
            ├── MeetingRequestForm
            └── MeetingHistory
```

### 1.2 Design Decision: URL searchParams 기반 탭 전환

Mypage 패턴과 동일하게 `/expert/center?tab=courses` 형태로 URL searchParams를 사용한다.

- `page.tsx` (Server): auth guard + searchParams 파싱 + `<ExpertStudioLayout />` 렌더
- `ExpertStudioLayout` (Client): 탭별 콘텐츠 조건부 렌더링, 사이드바/모바일 탭 관리

---

## 2. File Structure

### 2.1 신규 파일

| File | Type | Description |
|------|------|-------------|
| `src/app/expert/center/page.tsx` | Server Component | auth guard + metadata + ExpertStudioLayout 렌더 |
| `src/components/expert/studio/ExpertStudioLayout.tsx` | Client Component | 사이드바 + 모바일 탭 + 콘텐츠 라우팅 |
| `src/components/expert/studio/ExpertStudioSidebar.tsx` | Client Component | 데스크톱 사이드바 (MypageSidebar 패턴) |
| `src/components/expert/studio/dashboard/StudioDashboard.tsx` | Client Component | 대시보드 탭 (KPI + 활동 + 차트) |
| `src/components/expert/studio/courses/StudioCourses.tsx` | Client Component | 강의 관리 탭 |
| `src/components/expert/studio/qna/StudioQna.tsx` | Client Component | 강의 질문 관리 탭 |
| `src/components/expert/studio/revenue/StudioRevenue.tsx` | Client Component | 수익 관리 탭 |
| `src/components/expert/studio/guide/StudioGuide.tsx` | Client Component | 전문가 가이드 탭 |
| `src/components/expert/studio/meeting/StudioMeeting.tsx` | Client Component | 미팅 요청 탭 |
| `src/data/expertStudio.ts` | Data | Mock 데이터 + 헬퍼 함수 |

### 2.2 수정 파일

| File | Change |
|------|--------|
| `src/types/index.ts` | 전문가 스튜디오 관련 타입 추가 (StudioTab, ExpertCourse 등) |
| `src/components/layout/LayoutContent.tsx` | `/expert/center` searchBar 숨김 처리 |

---

## 3. Type Definitions

### 3.1 `src/types/index.ts` 추가 내용

```typescript
// ── 전문가 스튜디오 ──

export type StudioTab = "dashboard" | "courses" | "qna" | "revenue" | "guide" | "meeting";

export type ExpertCourseStatus = "draft" | "under_review" | "published" | "rejected";

export interface ExpertCourse {
  id: string;
  title: string;
  thumbnailUrl: string;
  category: string;
  status: ExpertCourseStatus;
  createdAt: string;
  updatedAt: string;
  studentCount: number;
  rating: number;           // 0.0 ~ 5.0
  completionRate: number;   // 0 ~ 100 (%)
  totalRevenue: number;     // KRW
  rejectionReason?: string;
}

export type StudioQnaStatus = "unanswered" | "answered";

export interface StudioQuestion {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  title: string;
  content: string;
  createdAt: string;
  status: StudioQnaStatus;
  answer?: {
    content: string;
    answeredAt: string;
  };
}

export type SettlementStatus = "정산완료" | "정산예정" | "정산대기";

export interface MonthlyRevenue {
  month: string;          // "2026-01"
  grossSales: number;
  platformFee: number;    // KRW amount
  netRevenue: number;
}

export interface SettlementRecord {
  id: string;
  period: string;         // "2026년 1월"
  amount: number;
  status: SettlementStatus;
  payoutDate?: string;
}

export type MeetingRequestStatus = "검토중" | "확정됨" | "완료";
export type MeetingTopic = "콘텐츠 전략" | "수익 개선" | "강의 품질" | "기타";

export interface MeetingRequest {
  id: string;
  topic: MeetingTopic;
  preferredDate: string;
  message: string;
  requestedAt: string;
  status: MeetingRequestStatus;
}

// 대시보드 최근활동
export type ActivityType = "new_question" | "new_enrollment" | "course_published" | "settlement_completed";

export interface RecentActivity {
  id: string;
  type: ActivityType;
  description: string;
  createdAt: string;       // ISO string
}
```

---

## 4. Mock Data Design

### 4.1 `src/data/expertStudio.ts`

```typescript
import type {
  StudioTab, ExpertCourse, StudioQuestion, MonthlyRevenue,
  SettlementRecord, MeetingRequest, RecentActivity
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
    id: "ec-1", title: "2026 세무회계 실무 완성", thumbnailUrl: "/images/course-thumb-1.jpg",
    category: "세무회계", status: "published", createdAt: "2025-11-15", updatedAt: "2026-03-20",
    studentCount: 156, rating: 4.7, completionRate: 78, totalRevenue: 4680000,
  },
  {
    id: "ec-2", title: "법인세 핵심정리 특강", thumbnailUrl: "/images/course-thumb-2.jpg",
    category: "법인세", status: "published", createdAt: "2026-01-10", updatedAt: "2026-03-18",
    studentCount: 89, rating: 4.5, completionRate: 65, totalRevenue: 2670000,
  },
  {
    id: "ec-3", title: "부가가치세 신고실무", thumbnailUrl: "/images/course-thumb-3.jpg",
    category: "부가세", status: "under_review", createdAt: "2026-03-01", updatedAt: "2026-03-22",
    studentCount: 0, rating: 0, completionRate: 0, totalRevenue: 0,
  },
  {
    id: "ec-4", title: "4대보험 실무 가이드", thumbnailUrl: "/images/course-thumb-4.jpg",
    category: "4대보험", status: "draft", createdAt: "2026-03-15", updatedAt: "2026-03-25",
    studentCount: 0, rating: 0, completionRate: 0, totalRevenue: 0,
  },
  {
    id: "ec-5", title: "전산세무 2급 집중반", thumbnailUrl: "/images/course-thumb-5.jpg",
    category: "전산세무", status: "rejected", createdAt: "2026-02-20", updatedAt: "2026-03-10",
    studentCount: 0, rating: 0, completionRate: 0, totalRevenue: 0,
    rejectionReason: "강의 영상 화질이 기준에 미달합니다. 720p 이상으로 재촬영해 주세요.",
  },
];

// ── Q&A Mock 데이터 (10건) ──
export const studioQuestions: StudioQuestion[] = [
  { id: "q-1", courseId: "ec-1", courseTitle: "2026 세무회계 실무 완성", studentName: "김수강", title: "세금계산서 발행 기한 관련 질문", content: "세금계산서 발행 기한이 매월 10일까지인가요, 아니면 거래 후 즉시 발행해야 하나요?", createdAt: "2026-03-25T14:30:00", status: "unanswered" },
  { id: "q-2", courseId: "ec-1", courseTitle: "2026 세무회계 실무 완성", studentName: "이학생", title: "부가세 매입세액 공제 범위", content: "접대비로 사용한 금액도 매입세액 공제가 가능한가요?", createdAt: "2026-03-24T10:15:00", status: "unanswered" },
  { id: "q-3", courseId: "ec-2", courseTitle: "법인세 핵심정리 특강", studentName: "박세무", title: "법인세 중간예납 면제 조건", content: "직전 사업연도 법인세가 일정 금액 이하면 중간예납이 면제되는 것으로 알고 있는데, 정확한 기준 금액이 얼마인가요?", createdAt: "2026-03-23T16:45:00", status: "unanswered" },
  { id: "q-4", courseId: "ec-1", courseTitle: "2026 세무회계 실무 완성", studentName: "최회계", title: "강의 자료 다운로드 관련", content: "3강 강의 자료 PDF가 다운로드되지 않습니다. 확인 부탁드립니다.", createdAt: "2026-03-22T09:00:00", status: "answered", answer: { content: "안녕하세요, 해당 자료 링크를 수정했습니다. 다시 시도해 주세요.", answeredAt: "2026-03-22T11:30:00" } },
  { id: "q-5", courseId: "ec-2", courseTitle: "법인세 핵심정리 특강", studentName: "정경리", title: "이월결손금 공제 한도", content: "이월결손금 공제 한도가 각 사업연도 소득의 몇 퍼센트인가요?", createdAt: "2026-03-21T13:20:00", status: "answered", answer: { content: "중소기업은 100%, 일반기업은 60%입니다. 강의 5강에서 자세히 다루고 있습니다.", answeredAt: "2026-03-21T15:00:00" } },
  { id: "q-6", courseId: "ec-1", courseTitle: "2026 세무회계 실무 완성", studentName: "한실무", title: "종합소득세 신고 시 필요서류", content: "프리랜서 종합소득세 신고 시 필요한 서류 목록을 알 수 있을까요?", createdAt: "2026-03-20T11:00:00", status: "answered", answer: { content: "소득금액증명원, 사업소득 원천징수영수증, 경비 증빙 자료가 필요합니다. 4강을 참고해 주세요.", answeredAt: "2026-03-20T14:00:00" } },
  { id: "q-7", courseId: "ec-2", courseTitle: "법인세 핵심정리 특강", studentName: "오공부", title: "세무조정 순서 관련", content: "세무조정을 어떤 순서로 진행하면 효율적인가요?", createdAt: "2026-03-19T10:30:00", status: "answered", answer: { content: "결산조정 → 신고조정 → 소득처분 순서로 진행하시면 됩니다.", answeredAt: "2026-03-19T16:00:00" } },
  { id: "q-8", courseId: "ec-1", courseTitle: "2026 세무회계 실무 완성", studentName: "윤학습", title: "전자세금계산서 의무발급 대상", content: "개인사업자도 전자세금계산서 의무발급 대상인가요?", createdAt: "2026-03-18T14:00:00", status: "answered", answer: { content: "직전연도 공급가액 합계 1억원 이상인 개인사업자는 의무발급 대상입니다.", answeredAt: "2026-03-18T17:30:00" } },
  { id: "q-9", courseId: "ec-1", courseTitle: "2026 세무회계 실무 완성", studentName: "장수강", title: "수정세금계산서 발급 사유", content: "수정세금계산서는 어떤 경우에 발급할 수 있나요?", createdAt: "2026-03-17T09:45:00", status: "answered", answer: { content: "기재사항 착오, 환입, 계약의 해제 등의 사유가 있을 때 발급합니다. 2강에서 다루고 있습니다.", answeredAt: "2026-03-17T12:00:00" } },
  { id: "q-10", courseId: "ec-2", courseTitle: "법인세 핵심정리 특강", studentName: "김학습", title: "접대비 한도 계산 방법", content: "접대비 한도를 계산하는 기본 공식을 알려주세요.", createdAt: "2026-03-16T15:30:00", status: "answered", answer: { content: "기본한도(1,200만~3,600만) + 수입금액별 적수로 계산합니다. 3강 자료를 참고하세요.", answeredAt: "2026-03-16T18:00:00" } },
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

/** 총 수강생 수 */
export function getTotalStudents(courses: ExpertCourse[]): number {
  return courses.reduce((sum, c) => sum + c.studentCount, 0);
}

/** 총 수익 */
export function getTotalRevenue(courses: ExpertCourse[]): number {
  return courses.reduce((sum, c) => sum + c.totalRevenue, 0);
}

/** 평균 평점 (게시된 강의만) */
export function getAverageRating(courses: ExpertCourse[]): number {
  const published = courses.filter(c => c.status === "published" && c.rating > 0);
  if (published.length === 0) return 0;
  return published.reduce((sum, c) => sum + c.rating, 0) / published.length;
}

/** KRW 포맷 */
export function formatKRW(amount: number): string {
  return new Intl.NumberFormat("ko-KR").format(amount);
}

/** 상대 시간 */
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
```

---

## 5. Component Specifications

### 5.1 `src/app/expert/center/page.tsx` (Server Component)

```typescript
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { StudioTab } from "@/types";
import ExpertStudioLayout from "@/components/expert/studio/ExpertStudioLayout";

export const metadata: Metadata = {
  title: "전문가 스튜디오 | BIZSCHOOL",
  description: "강의 관리, 수익 확인, 수강생 질문 답변 등 전문가를 위한 관리 페이지입니다.",
};

const validTabs: StudioTab[] = ["dashboard", "courses", "qna", "revenue", "guide", "meeting"];

export default async function ExpertStudioPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();

  // Auth guard: 비로그인 또는 expert 아닌 경우 리다이렉트
  if (!session?.user || session.user.role !== "expert") {
    redirect("/expert");
  }

  const params = await searchParams;
  const tab: StudioTab = validTabs.includes(params.tab as StudioTab)
    ? (params.tab as StudioTab)
    : "dashboard";

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-[var(--color-dark)]">
        전문가 스튜디오
      </h1>
      <ExpertStudioLayout currentTab={tab} />
    </div>
  );
}
```

### 5.2 `ExpertStudioLayout.tsx` (Client Component)

```
역할: 사이드바(Desktop) + 모바일 탭바 + 탭별 콘텐츠 조건부 렌더링
패턴: MypageLayout + MypageContent 합친 형태

Props:
  currentTab: StudioTab

렌더 구조:
┌─────────────────────────────────────────────────────┐
│ Mobile: 프로필 카드 (md:hidden)                       │
│ ┌─────────────────────────────────────────────────┐  │
│ │ [아바타] 전문가명 · expert@bizschool.kr           │  │
│ └─────────────────────────────────────────────────┘  │
│                                                      │
│ Mobile: 탭 바 (md:hidden, overflow-x-auto)           │
│ ┌─────────────────────────────────────────────────┐  │
│ │ [대시보드] [강의관리] [질문관리] [수익] [가이드] [미팅]│  │
│ └─────────────────────────────────────────────────┘  │
│                                                      │
│ ┌────────────┬──────────────────────────────────────┐│
│ │  Sidebar   │  Content                              ││
│ │ (Desktop)  │  (탭별 조건부 렌더링)                    ││
│ │            │                                       ││
│ │ 대시보드    │  ← 현재 탭의 콘텐츠                     ││
│ │ 강의 관리   │                                       ││
│ │ 질문 관리   │                                       ││
│ │ 수익 관리   │                                       ││
│ │ 전문가 가이드│                                       ││
│ │ 미팅 요청   │                                       ││
│ └────────────┴──────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

### 5.3 `ExpertStudioSidebar.tsx`

MypageSidebar 패턴 동일. studioTabs 배열을 순회하며 버튼 렌더링.

```
아이콘 매핑:
  dashboard → LayoutDashboard
  courses   → BookOpen
  qna       → MessageCircleQuestion
  revenue   → CircleDollarSign
  guide     → Lightbulb
  meeting   → CalendarClock
```

- 사이드바 컨테이너: `w-[240px] rounded-2xl border border-[var(--color-border)] bg-white p-6`
- 활성 탭: `bg-[var(--color-primary)]/10 font-bold text-[var(--color-primary)]`
- 비활성 탭: `text-[var(--color-body)] hover:bg-[var(--color-light-bg)]`
- 탭 클릭: `router.push(/expert/center?tab={key})`

---

## 6. Tab Content Specifications

### 6.1 대시보드 (StudioDashboard)

```
┌──────────────────────────────────────────────────────┐
│  KPI Cards (grid: 2col mobile, 4col desktop)         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  │📚 총 강의 │ │👥 총 수강생│ │💰 총 수익  │ │⭐ 평균 평점││
│  │  2개      │ │  245명    │ │₩7,350,000│ │  4.6     ││
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘│
│                                                      │
│  최근 활동                                            │
│  ┌──────────────────────────────────────────────────┐│
│  │ 💬 김수강님이 '세무회계 실무 완성'에 질문  · 3시간 전││
│  │ 👥 3명이 '법인세 핵심정리 특강'에 등록      · 5시간 전││
│  │ 💰 2월 정산 완료 (₩1,344,000)             · 10일 전 ││
│  │ ...                                               ││
│  └──────────────────────────────────────────────────┘│
│                                                      │
│  월별 수익 추이                                       │
│  ┌──────────────────────────────────────────────────┐│
│  │  ▓▓▓▓▓▓▓▓  10월: ₩712,000                        ││
│  │  ▓▓▓▓▓▓▓▓▓▓▓  11월: ₩1,000,000                   ││
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓  12월: ₩1,264,000                ││
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓  1월: ₩1,136,000                   ││
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  2월: ₩1,344,000                ││
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓  3월: ₩1,224,000                  ││
│  └──────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────┘
```

**KPI Card 스타일**:
- 카드: `rounded-xl border border-[var(--color-border)] bg-white p-5`
- 아이콘: 각 카드별 lucide 아이콘 (BookOpen, Users, CircleDollarSign, Star)
- 숫자: `text-2xl font-bold text-[var(--color-dark)]`
- 레이블: `text-sm text-[var(--color-muted)]`

**최근 활동**:
- 컨테이너: `rounded-xl border border-[var(--color-border)] bg-white p-5`
- 각 항목: `flex items-start gap-3 py-3 border-b last:border-b-0`
- 아이콘: ActivityType별 (new_question→MessageCircle, new_enrollment→UserPlus, course_published→CheckCircle, settlement_completed→Wallet)
- 시간: `text-xs text-[var(--color-muted)]`, getRelativeTime() 사용

**수익 추이 차트**:
- CSS 기반 가로 막대 차트 (외부 라이브러리 없음)
- 각 막대: `bg-[var(--color-primary)]`, width를 최대값 대비 비율로 계산
- 레이블: 월 + 금액

### 6.2 강의 관리 (StudioCourses)

```
┌──────────────────────────────────────────────────────┐
│  필터: [전체 상태 ▼]                     [강의 등록 →] │
│                                                      │
│  Desktop Table (md이상)                               │
│  ┌─────────────────────────────────────────────────┐ │
│  │ 강의명              │상태   │수강생│평점│완료율│관리│ │
│  ├─────────────────────┼──────┼────┼───┼────┼───┤ │
│  │ 세무회계 실무 완성    │🟢게시됨│ 156│4.7│ 78%│✏️🗑│ │
│  │ 법인세 핵심정리 특강  │🟢게시됨│  89│4.5│ 65%│✏️🗑│ │
│  │ 부가가치세 신고실무   │🔵검토중│   -│  -│   -│✏️🗑│ │
│  │ 4대보험 실무 가이드   │⚪초안  │   -│  -│   -│✏️🗑│ │
│  │ 전산세무 2급 집중반   │🔴반려됨│   -│  -│   -│✏️🗑│ │
│  └─────────────────────┴──────┴────┴───┴────┴───┘ │
│                                                      │
│  Mobile Cards (md미만)                                │
│  ┌─────────────────────────────────────────────────┐ │
│  │ [🟢 게시됨]                                      │ │
│  │ 세무회계 실무 완성                                 │ │
│  │ 👥 156명 · ⭐ 4.7 · 완료율 78%                    │ │
│  │                              [편집]  [삭제]       │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

**상태 뱃지 색상**:
| Status | Label | Background | Text |
|--------|-------|-----------|------|
| draft | 초안 | `bg-gray-100` | `text-gray-600` |
| under_review | 검토중 | `bg-blue-50` | `text-blue-600` |
| published | 게시됨 | `bg-green-50` | `text-green-600` |
| rejected | 반려됨 | `bg-red-50` | `text-red-500` |

**반려 사유**: rejected 상태의 행 아래에 경고 배경(`bg-red-50 p-3 rounded-lg`)으로 rejectionReason 표시

**강의 등록 버튼**: `<Link href="/expert/upload">` — `bg-[var(--color-primary)] text-white rounded-lg px-4 py-2`

**삭제 확인**: `window.confirm("이 강의를 삭제하시겠습니까?")` → mock 상태에서 제거

### 6.3 강의 질문 관리 (StudioQna)

```
┌──────────────────────────────────────────────────────┐
│  필터: [전체 강의 ▼]  [전체 상태 ▼]                     │
│                                                      │
│  미답변 3건 · 답변완료 7건                              │
│                                                      │
│  목록 (list view)                                     │
│  ┌─────────────────────────────────────────────────┐ │
│  │ 🔴 미답변 | 세무회계 실무 완성                      │ │
│  │ 세금계산서 발행 기한 관련 질문                       │ │
│  │ 김수강 · 2026.03.25                               │ │
│  ├─────────────────────────────────────────────────┤ │
│  │ 🔴 미답변 | 세무회계 실무 완성                      │ │
│  │ 부가세 매입세액 공제 범위                           │ │
│  │ 이학생 · 2026.03.24                               │ │
│  ├─────────────────────────────────────────────────┤ │
│  │ 🟢 답변완료 | 세무회계 실무 완성                    │ │
│  │ 강의 자료 다운로드 관련                             │ │
│  │ 최회계 · 2026.03.22                               │ │
│  └─────────────────────────────────────────────────┘ │
│                                                      │
│  상세/답변 (질문 클릭 시 확장 또는 별도 뷰)             │
│  ┌─────────────────────────────────────────────────┐ │
│  │ Q: 세금계산서 발행 기한이 매월 10일까지인가요...    │ │
│  │                                                  │ │
│  │ 답변 작성:                                        │ │
│  │ ┌────────────────────────────────────────────┐   │ │
│  │ │                                            │   │ │
│  │ │  (textarea)                                │   │ │
│  │ │                                            │   │ │
│  │ └────────────────────────────────────────────┘   │ │
│  │                                  [답변 등록]      │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

**동작**:
- 필터: 강의 select + 상태 select (전체/미답변/답변완료)
- 기본 정렬: 미답변 우선, 최신순
- 질문 클릭: 상세 내용 확장 (accordion 패턴)
- 답변 등록: textarea + 등록 버튼, mock 상태 업데이트 (status: "answered" + answer 추가)
- 페이지네이션: 10건/페이지

### 6.4 수익 관리 (StudioRevenue)

```
┌──────────────────────────────────────────────────────┐
│  총 누적 수익                                         │
│  ┌─────────────────────────────────────────────────┐ │
│  │ 💰 ₩6,680,000                                   │ │
│  │ 플랫폼 수수료 제외 순수익 기준                      │ │
│  └─────────────────────────────────────────────────┘ │
│                                                      │
│  월별 수익 내역                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │ 월     │ 매출     │ 수수료  │ 순수익    │        │  │
│  ├────────┼────────┼────────┼─────────┤        │  │
│  │ 2026.03│₩1,530K │₩306K  │₩1,224K  │        │  │
│  │ 2026.02│₩1,680K │₩336K  │₩1,344K  │        │  │
│  │ ...    │        │        │         │        │  │
│  └────────┴────────┴────────┴─────────┘        │  │
│                                                      │
│  강의별 수익                                          │
│  ┌────────────────────────────────────────────────┐  │
│  │ 강의명                      │수강생│ 수익       │  │
│  ├───────────────────────────┼────┼──────────┤  │
│  │ 세무회계 실무 완성           │ 156│₩4,680,000│  │
│  │ 법인세 핵심정리 특강         │  89│₩2,670,000│  │
│  └───────────────────────────┴────┴──────────┘  │
│                                                      │
│  정산 내역                                            │
│  ┌────────────────────────────────────────────────┐  │
│  │ 정산기간    │ 금액       │ 상태     │ 지급일    │  │
│  ├───────────┼──────────┼────────┼─────────┤  │
│  │ 2026년 3월 │₩1,224,000│🔵정산예정│ 2026.04.15│  │
│  │ 2026년 2월 │₩1,344,000│🟢정산완료│ 2026.03.15│  │
│  │ 2026년 1월 │₩1,136,000│🟢정산완료│ 2026.02.15│  │
│  └───────────┴──────────┴────────┴─────────┘  │
└──────────────────────────────────────────────────────┘
```

**정산 상태 뱃지**:
| Status | Background | Text |
|--------|-----------|------|
| 정산완료 | `bg-green-50` | `text-green-600` |
| 정산예정 | `bg-blue-50` | `text-blue-600` |
| 정산대기 | `bg-gray-100` | `text-gray-600` |

### 6.5 전문가 가이드 (StudioGuide)

```
┌──────────────────────────────────────────────────────┐
│  강의 제작 가이드                                      │
│                                                      │
│  Step 1. 강의 주제 선정                                │
│  ┌─────────────────────────────────────────────────┐ │
│  │ 수강생이 필요로 하는 주제를 선정하세요...            │ │
│  │                                                  │ │
│  │ 💡 TIP: 기존에 없는 틈새 주제를 선택하면 경쟁이...  │ │
│  └─────────────────────────────────────────────────┘ │
│                                                      │
│  Step 2. 강의 구성 설계                                │
│  ┌─────────────────────────────────────────────────┐ │
│  │ ...                                              │ │
│  └─────────────────────────────────────────────────┘ │
│                                                      │
│  ...Step 3~6...                                      │
│                                                      │
│                    [🚀 지금 시작하기 → /expert/upload]  │
│                                                      │
│  ─────────────────────────────────────────────────── │
│                                                      │
│  자주 묻는 질문                                        │
│  ┌─────────────────────────────────────────────────┐ │
│  │ ▶ 강의 영상은 어떤 형식으로 업로드하나요?           │ │
│  ├─────────────────────────────────────────────────┤ │
│  │ ▶ 강의 가격은 어떻게 설정하나요?                   │ │
│  ├─────────────────────────────────────────────────┤ │
│  │ ▼ 플랫폼 수수료는 얼마인가요?                      │ │
│  │   판매 금액의 20%가 플랫폼 수수료로 차감됩니다...   │ │
│  ├─────────────────────────────────────────────────┤ │
│  │ ...                                              │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

**Step 카드**:
- 번호: `w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold`
- 타이틀: `text-lg font-bold text-[var(--color-dark)]`
- 설명: `text-[var(--color-body)]`
- TIP: `bg-amber-50 border border-amber-200 rounded-lg p-3` + Lightbulb 아이콘

**FAQ 아코디언**:
- 각 항목: border-b로 구분, 클릭 시 토글
- 열린 상태: ChevronDown 아이콘, 내용 표시
- 닫힌 상태: ChevronRight 아이콘
- 상태: `useState<string | null>(null)` (단일 열기 모드)

**CTA 버튼**: `<Link href="/expert/upload">` — primary 스타일, 가이드 마지막에 배치

### 6.6 미팅 요청 (StudioMeeting)

```
┌──────────────────────────────────────────────────────┐
│  미팅 요청                                            │
│  ┌─────────────────────────────────────────────────┐ │
│  │ 주제 선택:                                       │ │
│  │ (●) 콘텐츠 전략  (○) 수익 개선                    │ │
│  │ (○) 강의 품질    (○) 기타                         │ │
│  │                                                  │ │
│  │ 희망 일자:                                        │ │
│  │ ┌───────────────────────────────────────┐        │ │
│  │ │ 2026-04-05                            │        │ │
│  │ └───────────────────────────────────────┘        │ │
│  │                                                  │ │
│  │ 요청 내용:                                        │ │
│  │ ┌───────────────────────────────────────┐        │ │
│  │ │                                       │        │ │
│  │ │ (textarea, max 500자)                 │        │ │
│  │ │                                       │        │ │
│  │ └───────────────────────────────────────┘        │ │
│  │ 0/500                                            │ │
│  │                               [미팅 요청하기]      │ │
│  └─────────────────────────────────────────────────┘ │
│                                                      │
│  요청 내역                                            │
│  ┌────────────────────────────────────────────────┐  │
│  │ 요청일    │ 주제       │ 희망일자  │ 상태      │  │
│  ├──────────┼──────────┼────────┼─────────┤  │
│  │ 2026.03.25│콘텐츠 전략 │04.05   │⚪검토중   │  │
│  │ 2026.03.20│수익 개선   │03.28   │🔵확정됨   │  │
│  │ 2026.03.10│강의 품질   │03.15   │🟢완료     │  │
│  │ ...                                            │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

**미팅 요청 상태 뱃지**:
| Status | Background | Text |
|--------|-----------|------|
| 검토중 | `bg-gray-100` | `text-gray-600` |
| 확정됨 | `bg-blue-50` | `text-blue-600` |
| 완료 | `bg-green-50` | `text-green-600` |

**폼 필드**:
- 주제: 4개 라디오 버튼 (MeetingTopic 타입)
- 희망일자: `<input type="date">` + min={today}
- 요청내용: `<textarea>` maxLength=500, 글자수 카운터
- 제출: `window.alert("미팅 요청이 등록되었습니다.")`, 새 항목을 meetingRequests 배열 앞에 추가 (mock)

---

## 7. Navigation Changes

### 7.1 LayoutContent (`src/components/layout/LayoutContent.tsx`)

```typescript
// hideSearchBar 조건에 /expert/center 추가
const hideSearchBar = isConsulting
  || pathname === "/about"
  || pathname === "/directions"
  || pathname === "/venue"
  || pathname === "/mypage"
  || pathname.startsWith("/notice")
  || pathname === "/resources"
  || pathname.startsWith("/expert/center");  // 추가
```

### 7.2 기존 링크 확인

- Header: 이미 "콘텐츠 업로드" 버튼이 `/expert/upload`로 링크됨 (expert role 한정) — 변경 불필요
- UserMenu: 이미 "전문가 스튜디오" 링크가 `/expert/center`로 설정됨 — 변경 불필요

---

## 8. Implementation Order

| Step | File | Task |
|------|------|------|
| 1 | `src/types/index.ts` | 전문가 스튜디오 관련 타입 추가 |
| 2 | `src/data/expertStudio.ts` | Mock 데이터 + 헬퍼 함수 |
| 3 | `src/app/expert/center/page.tsx` | 페이지 (auth guard + metadata + layout 렌더) |
| 4 | `src/components/expert/studio/ExpertStudioLayout.tsx` | 사이드바 + 모바일 탭 + 콘텐츠 라우팅 |
| 5 | `src/components/expert/studio/ExpertStudioSidebar.tsx` | 데스크톱 사이드바 |
| 6 | `src/components/expert/studio/dashboard/StudioDashboard.tsx` | 대시보드 탭 (KPI + 활동 + 차트) |
| 7 | `src/components/expert/studio/courses/StudioCourses.tsx` | 강의 관리 탭 |
| 8 | `src/components/expert/studio/qna/StudioQna.tsx` | 강의 질문 관리 탭 |
| 9 | `src/components/expert/studio/revenue/StudioRevenue.tsx` | 수익 관리 탭 |
| 10 | `src/components/expert/studio/guide/StudioGuide.tsx` | 전문가 가이드 탭 |
| 11 | `src/components/expert/studio/meeting/StudioMeeting.tsx` | 미팅 요청 탭 |
| 12 | `src/components/layout/LayoutContent.tsx` | searchBar 숨김 조건 추가 |

---

## 9. Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| < md (768px) | 사이드바 숨김, 모바일 탭바 표시, 카드 뷰, 테이블 → 카드 전환 |
| >= md | 사이드바 표시, 테이블 뷰 |

---

## 10. Acceptance Criteria

- [ ] `/expert/center` 접속 시 전문가 스튜디오 페이지 정상 표시 (expert 로그인 필수)
- [ ] 비로그인 또는 일반 유저는 `/expert`로 리다이렉트
- [ ] 6개 탭 모두 클릭 시 정상 렌더링, URL searchParams 업데이트
- [ ] 대시보드: KPI 카드 4개 + 최근활동 + 수익 차트 정상 표시
- [ ] 강의 관리: 상태 뱃지 정상, 편집 링크 동작, 삭제 확인 모달 동작
- [ ] 질문 관리: 강의별/상태별 필터 동작, 답변 등록 동작
- [ ] 수익 관리: 월별 테이블 + 정산 내역 + 강의별 수익 정상 표시
- [ ] 전문가 가이드: 단계별 가이드 + FAQ 아코디언 동작
- [ ] 미팅 요청: 폼 제출 후 목록에 추가, 상태 뱃지 정상 표시
- [ ] 모바일(375px) 및 데스크톱(1280px) 레이아웃 정상
- [ ] `next build` 에러 없음
- [ ] TypeScript 에러 없음

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-03-26 | Initial design | allen |
