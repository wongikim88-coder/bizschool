# course-qna Design Document

> **Summary**: 마이페이지 > 내 학습 > "강의 Q&A" 탭 상세 설계
>
> **Project**: BIZSCHOOL
> **Author**: allen
> **Date**: 2026-03-21
> **Status**: Draft
> **Plan Reference**: `docs/01-plan/features/course-qna.plan.md`

---

## 1. Component Architecture

### 1.1 파일 구조

```
src/
├── types/index.ts                                    ← 타입 추가
├── data/mypage.ts                                    ← Mock 데이터 추가
├── components/mypage/
│   ├── CoursesSection.tsx                            ← "강의 Q&A" 탭 렌더링 연결
│   └── my-learning/
│       ├── QnaSection.tsx                            ← Q&A 메인 (list/detail/write 전환)
│       ├── QnaFilterBar.tsx                          ← 필터 + 검색 + 질문하기 버튼
│       ├── QnaCard.tsx                               ← 질문 카드 (목록 아이템)
│       ├── QnaDetail.tsx                             ← 질문 상세 + 답변 표시
│       └── QnaWriteForm.tsx                          ← 질문 작성 폼
```

### 1.2 컴포넌트 계층

```
CoursesSection (기존)
└── activeTab === "강의 Q&A" 일 때:
    └── QnaSection ("use client")
        ├── viewMode === "list":
        │   ├── QnaFilterBar
        │   ├── QnaCard[] (목록)
        │   └── 페이지네이션 (인라인)
        ├── viewMode === "detail":
        │   └── QnaDetail
        └── viewMode === "write":
            └── QnaWriteForm
```

---

## 2. Type Definitions

### 2.1 `src/types/index.ts`에 추가

```typescript
// ── 강의 Q&A ──

export type QnaAnswerStatus = "답변대기" | "답변완료";

export type QnaAnswerStatusFilter = "전체" | QnaAnswerStatus;

export type QnaCategoryFilter = "전체" | CourseCategory;

export interface CourseQna {
  id: string;
  courseId: string;
  courseTitle: string;
  courseCategory: CourseCategory;
  title: string;
  content: string;
  createdAt: string;
  answerStatus: QnaAnswerStatus;
  answer?: CourseQnaAnswer;
}

export interface CourseQnaAnswer {
  content: string;
  answeredAt: string;
  instructorName: string;
}
```

---

## 3. Component Design

### 3.1 QnaSection.tsx (메인 컨트롤러)

**역할**: 화면 모드(list/detail/write) 전환 및 상태 관리

```typescript
"use client";

interface State {
  viewMode: "list" | "detail" | "write";
  selectedQnaId: string | null;

  // 필터 상태
  categoryFilter: QnaCategoryFilter;          // "전체" | CourseCategory
  answerStatusFilter: QnaAnswerStatusFilter;   // "전체" | "답변대기" | "답변완료"
  searchKeyword: string;
  currentPage: number;
}
```

**기본 동작**:
- 초기 viewMode: `"list"`
- QnaCard 클릭 → `viewMode: "detail"`, `selectedQnaId` 설정
- "질문하기" 버튼 → `viewMode: "write"`
- "목록으로" → `viewMode: "list"`, 필터 상태 유지
- 질문 작성 후 submit → mockCourseQnas에 추가 (상태 관리), viewMode: "list"

**필터링 로직**:
```typescript
const filteredQnas = useMemo(() => {
  let result = allQnas;

  // 카테고리 필터
  if (categoryFilter !== "전체") {
    result = result.filter(q => q.courseCategory === categoryFilter);
  }

  // 답변 상태 필터
  if (answerStatusFilter !== "전체") {
    result = result.filter(q => q.answerStatus === answerStatusFilter);
  }

  // 키워드 검색 (제목 + 강의명)
  if (searchKeyword.trim()) {
    const kw = searchKeyword.trim().toLowerCase();
    result = result.filter(q =>
      q.title.toLowerCase().includes(kw) ||
      q.courseTitle.toLowerCase().includes(kw)
    );
  }

  return result;
}, [allQnas, categoryFilter, answerStatusFilter, searchKeyword]);
```

**페이지네이션**:
- `QNA_PER_PAGE = 10`
- 인라인 페이지네이션 (기존 MypagePagination 패턴 참고하되 URL 미사용, 상태 기반)

### 3.2 QnaFilterBar.tsx

**역할**: 카테고리 필터 + 답변 상태 필터 + 키워드 검색 + 질문하기 버튼

**레이아웃**:
```
┌─────────────────────────────────────────────────────────────────────┐
│ Row 1: 필터 + 질문하기                                               │
│ [전체] [답변대기] [답변완료]                         [질문하기] 버튼   │
├─────────────────────────────────────────────────────────────────────┤
│ Row 2: 카테고리 드롭다운 + 검색                                       │
│ 강의유형: [전체 ▼]              [검색어 입력 🔍]                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Props**:
```typescript
interface QnaFilterBarProps {
  categoryFilter: QnaCategoryFilter;
  onCategoryFilterChange: (filter: QnaCategoryFilter) => void;
  answerStatusFilter: QnaAnswerStatusFilter;
  onAnswerStatusFilterChange: (filter: QnaAnswerStatusFilter) => void;
  searchKeyword: string;
  onSearchKeywordChange: (value: string) => void;
  onWriteClick: () => void;
  totalCount: number;
  pendingCount: number;
  answeredCount: number;
}
```

**스타일 (기존 패턴 참고)**:
- 답변 상태 필터: `InquiryList`의 pill 버튼 패턴 (bg-primary 활성, bg-light-bg 비활성)
- 카테고리 드롭다운: `<select>` 스타일 (InquiryForm의 select 패턴)
- 검색: `CourseFilterBar`의 검색 입력 패턴 (Search 아이콘 + input)
- 질문하기 버튼: `InquiryList`의 "문의하기" 버튼 패턴 (bg-primary + Plus 아이콘)

### 3.3 QnaCard.tsx

**역할**: 질문 목록의 개별 항목 (테이블 행 데스크톱 / 카드 모바일)

**Props**:
```typescript
interface QnaCardProps {
  qna: CourseQna;
  onClick: (id: string) => void;
}
```

**Desktop (테이블 행)** - `InquiryList` 테이블 패턴:
```
| 카테고리 뱃지     | 강의명              | 질문 제목              | 작성일        | 상태       |
| [온라인]         | 세무회계 실무 기초   | 부가세 신고 관련 질문... | 2026.03.18   | [답변완료]  |
```

**테이블 colgroup**:
```html
<col className="w-[12%]" />   <!-- 카테고리 -->
<col className="w-[22%]" />   <!-- 강의명 -->
<col className="w-[33%]" />   <!-- 제목 -->
<col className="w-[16%]" />   <!-- 작성일 -->
<col className="w-[17%]" />   <!-- 상태 -->
```

**Mobile (카드)** - `InquiryList` 모바일 카드 패턴:
```
┌────────────────────────────────────┐
│ [답변완료] [온라인]                  │
│ 세무회계 실무 기초                   │
│ 부가세 신고 관련 질문이 있습니다      │
│ 2026.03.18                         │
└────────────────────────────────────┘
```

**카테고리 뱃지 색상**:
```typescript
const categoryBadgeStyle: Record<CourseCategory, string> = {
  "온라인 강의": "bg-blue-50 text-blue-600",
  "현장 강의": "bg-purple-50 text-purple-600",
  "인재키움 프리미엄 훈련": "bg-orange-50 text-orange-600",
};

// 뱃지 라벨 (축약)
const categoryShortLabel: Record<CourseCategory, string> = {
  "온라인 강의": "온라인",
  "현장 강의": "현장",
  "인재키움 프리미엄 훈련": "인재키움",
};
```

**답변 상태 뱃지** - 기존 `InquiryList`의 `StatusBadge` 패턴 재활용:
- 답변대기: `bg-amber-50 text-amber-600` + Clock 아이콘
- 답변완료: `bg-emerald-50 text-emerald-600` + CheckCircle 아이콘

### 3.4 QnaDetail.tsx

**역할**: 질문 상세 + 강사 답변 표시

**Props**:
```typescript
interface QnaDetailProps {
  qna: CourseQna;
  onBack: () => void;
}
```

**레이아웃** - 기존 `InquiryDetail` 패턴:

```
┌─────────────────────────────────────────────────────────────┐
│ [← 목록으로]                                    [답변완료]   │
│                                                             │
│ [온라인] 세무회계 실무 기초                                    │
│ 카테고리 뱃지 + 강의명 (인라인)                                │
│                                                             │
│ 제4강 부가세 신고 관련 질문이 있습니다                          │
│ (h2, text-xl font-bold)                                     │
│                                                             │
│ 작성일: 2026.03.18                                           │
│                                                             │
│ ┌─ Q 카드 ──────────────────────────────────────────────┐   │
│ │ Q                                                     │   │
│ │ 부가세 신고 시 매입세액 공제가 안되는 경우에 대해          │   │
│ │ 좀 더 자세한 설명이 필요합니다...                        │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌─ A 카드 (답변완료인 경우) ─────────────────────────────┐   │
│ │ A                              김세무 강사 | 2026.03.19│   │
│ │ 매입세액 공제가 안 되는 경우는 크게 세 가지입니다.        │   │
│ │ 1. 비영업용 소형승용차 관련 매입세액...                  │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌─ 대기 카드 (답변대기인 경우) ──────────────────────────┐   │
│ │ 🕐 담당 강사가 답변을 준비 중입니다.                     │   │
│ │    빠른 시일 내에 답변 드리겠습니다.                      │   │
│ └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**스타일**:
- "← 목록으로" 버튼: `InquiryDetail` 패턴 동일 (ArrowLeft + text-sm text-muted)
- Q 카드: `rounded-2xl border border-[var(--color-border)] bg-white p-6`
- A 카드: `rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6`
- 대기 카드: `rounded-2xl bg-[var(--color-light-bg)] p-6 text-center`

### 3.5 QnaWriteForm.tsx

**역할**: 질문 작성 폼 (강의 카테고리 선택 → 강의 선택 → 제목 → 내용)

**Props**:
```typescript
interface QnaWriteFormProps {
  onSubmit: (qna: CourseQna) => void;
  onCancel: () => void;
}
```

**State**:
```typescript
const [selectedCategory, setSelectedCategory] = useState<CourseCategory | "">("");
const [selectedCourseId, setSelectedCourseId] = useState("");
const [title, setTitle] = useState("");
const [content, setContent] = useState("");
```

**강의 카테고리 → 강의 선택 연동**:
```typescript
import { mockMyCourses, mockMyOfflineCourses } from "@/data/mypage";

// 카테고리 선택 시 해당 강의 목록 필터링
const availableCourses = useMemo(() => {
  if (!selectedCategory) return [];

  if (selectedCategory === "온라인 강의") {
    return mockMyCourses
      .filter(c => c.category === "온라인 강의")
      .map(c => ({ id: c.id, title: c.title }));
  }

  return mockMyOfflineCourses
    .filter(c => c.category === selectedCategory)
    .map(c => ({ id: c.id, title: c.title }));
}, [selectedCategory]);

// 카테고리 변경 시 선택된 강의 초기화
useEffect(() => {
  setSelectedCourseId("");
}, [selectedCategory]);
```

**레이아웃** - 기존 `InquiryForm` 패턴:

```
┌─────────────────────────────────────────────────────────────┐
│ [← 목록으로]                                                 │
│                                                             │
│ 강의 Q&A 작성  (h2, text-xl font-bold)                       │
│                                                             │
│ 강의 카테고리 *                                               │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ <select> 카테고리를 선택해주세요                         │   │
│ │  - 온라인 강의                                         │   │
│ │  - 현장 강의                                           │   │
│ │  - 인재키움 프리미엄 훈련                                │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                             │
│ 강의 선택 *  (카테고리 미선택 시 disabled)                     │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ <select> 강의를 선택해주세요                             │   │
│ │  - (카테고리에 속한 수강 강의 목록)                       │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                             │
│ 제목 *                                                      │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ <input> 질문 제목을 입력해주세요                         │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                             │
│ 내용 *                                                      │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ <textarea> 질문 내용을 상세히 입력해주세요               │   │
│ │ min-h-[160px]                                         │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                             │
│                               [취소]  [등록하기]              │
└─────────────────────────────────────────────────────────────┘
```

**스타일**: `InquiryForm`과 동일한 패턴
- label: `text-sm font-medium text-[var(--color-dark)]`
- 필수 표시: `<span className="text-[var(--color-red)]">*</span>`
- select/input: `mt-1.5 w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm ...`
- 취소 버튼: `border border-[var(--color-border)] ... text-[var(--color-body)]`
- 등록 버튼: `bg-[var(--color-primary)] ... text-white disabled:opacity-50`

**Validation**:
```typescript
const isValid = selectedCategory !== "" &&
  selectedCourseId !== "" &&
  title.trim() !== "" &&
  content.trim() !== "";
```

**Submit 처리**:
```typescript
const handleSubmit = () => {
  if (!isValid) return;

  // 선택된 강의 정보 조회
  const courseInfo = selectedCategory === "온라인 강의"
    ? mockMyCourses.find(c => c.id === selectedCourseId)
    : mockMyOfflineCourses.find(c => c.id === selectedCourseId);

  const newQna: CourseQna = {
    id: `qna-${Date.now()}`,
    courseId: selectedCourseId,
    courseTitle: courseInfo?.title || "",
    courseCategory: selectedCategory as CourseCategory,
    title: title.trim(),
    content: content.trim(),
    createdAt: new Date().toISOString().split("T")[0],
    answerStatus: "답변대기",
  };

  onSubmit(newQna);
};
```

---

## 4. CoursesSection Integration

### 4.1 `CoursesSection.tsx` 변경

**변경 전** (line 127-134):
```tsx
{/* 강의 Q&A / 수료증 */}
{!isOnlineTab && !isOfflineTab && (
  <div className="py-20 text-center">
    <p className="text-sm text-[var(--color-muted)]">
      준비 중인 기능입니다.
    </p>
  </div>
)}
```

**변경 후**:
```tsx
{/* 강의 Q&A */}
{activeTab === "강의 Q&A" && <QnaSection />}

{/* 수료증 */}
{activeTab === "수료증" && (
  <div className="py-20 text-center">
    <p className="text-sm text-[var(--color-muted)]">
      준비 중인 기능입니다.
    </p>
  </div>
)}
```

**import 추가**:
```typescript
import QnaSection from "./my-learning/QnaSection";
```

---

## 5. Mock Data

### 5.1 `src/data/mypage.ts`에 추가

```typescript
export const QNA_PER_PAGE = 10;

export const mockCourseQnas: CourseQna[] = [
  {
    id: "qna-001",
    courseId: "mc-001",
    courseTitle: "세무회계 실무 기초",
    courseCategory: "온라인 강의",
    title: "제4강 부가세 신고 관련 질문이 있습니다",
    content: "부가세 신고 시 매입세액 공제가 안 되는 경우에 대해 좀 더 자세한 설명이 필요합니다. 강의에서 3가지 경우를 말씀하셨는데, 비영업용 소형승용차 외에 나머지 두 가지가 기억이 나지 않습니다.",
    createdAt: "2026-03-18",
    answerStatus: "답변완료",
    answer: {
      content: "매입세액 공제가 안 되는 경우는 크게 세 가지입니다.\n\n1. 비영업용 소형승용차 관련 매입세액\n2. 접대비 관련 매입세액\n3. 면세사업 관련 매입세액\n\n각 항목에 대한 자세한 내용은 제5강에서 추가로 다루게 됩니다. 참고로 교안 42페이지에 정리표가 있으니 확인해 보시기 바랍니다.",
      answeredAt: "2026-03-19",
      instructorName: "김세무",
    },
  },
  {
    id: "qna-002",
    courseId: "ofc-001",
    courseTitle: "세무실무 심화과정 (2일 집중반)",
    courseCategory: "현장 강의",
    title: "강의 자료 PDF 다운로드가 안됩니다",
    content: "현장 강의 수강 전에 미리 교안을 받아 예습하고 싶은데, PDF 다운로드 링크가 작동하지 않습니다. 확인 부탁드립니다.",
    createdAt: "2026-03-20",
    answerStatus: "답변대기",
  },
  {
    id: "qna-003",
    courseId: "mc-002",
    courseTitle: "경영전략 핵심 노트: 전략적 사고를 위한 MBA 에센셜",
    courseCategory: "온라인 강의",
    title: "SWOT 분석 사례에서 궁금한 점이 있습니다",
    content: "제2강에서 삼성전자의 SWOT 분석 사례를 다루셨는데, Threats 항목에서 언급하신 '기술 패러다임 전환'이 구체적으로 어떤 것을 의미하는지 궁금합니다.",
    createdAt: "2026-03-17",
    answerStatus: "답변완료",
    answer: {
      content: "'기술 패러다임 전환'은 기존 반도체 중심의 사업 구조에서 AI, 클라우드 등 소프트웨어 중심으로의 전환을 의미합니다. 하드웨어 제조 강점이 소프트웨어 경쟁에서는 약점이 될 수 있다는 분석입니다.\n\n관련 자료로 교안 28페이지의 참고문헌을 확인해 보시면 도움이 될 것입니다.",
      answeredAt: "2026-03-18",
      instructorName: "이전략",
    },
  },
  {
    id: "qna-004",
    courseId: "ofc-005",
    courseTitle: "ESG 경영전략 실무자 양성과정",
    courseCategory: "인재키움 프리미엄 훈련",
    title: "ESG 공시 기준 관련 질문",
    content: "ESG 공시 기준이 국내와 해외에서 다른 것으로 알고 있는데, 강의에서 다루는 기준은 어떤 것인지 미리 알고 싶습니다. TCFD와 ISSB 기준 중 어느 것에 초점을 맞추나요?",
    createdAt: "2026-03-19",
    answerStatus: "답변완료",
    answer: {
      content: "본 과정에서는 ISSB(International Sustainability Standards Board) 기준을 중심으로 다루되, TCFD 권고안과의 비교도 함께 진행합니다. 국내 기준인 KSSB도 간략히 소개할 예정입니다.\n\n수업 첫째 날 오전에 각 기준의 개요와 차이점을 정리하는 시간이 있으니 참고해 주세요.",
      answeredAt: "2026-03-20",
      instructorName: "한경영",
    },
  },
  {
    id: "qna-005",
    courseId: "mc-001",
    courseTitle: "세무회계 실무 기초",
    courseCategory: "온라인 강의",
    title: "원천징수 세율 계산 방법이 헷갈립니다",
    content: "제8강에서 원천징수 세율을 계산하는 부분이 이해가 잘 안됩니다. 특히 일용직 근로자와 정규직 근로자의 원천징수 계산 방식의 차이를 좀 더 쉽게 설명해 주실 수 있나요?",
    createdAt: "2026-03-15",
    answerStatus: "답변완료",
    answer: {
      content: "원천징수 계산의 핵심 차이점을 정리해 드립니다.\n\n- 정규직: 간이세액표 기준 원천징수 (월급여 기준)\n- 일용직: 일급 15만원 초과분 × 6% (원천징수세율)\n\n교안 67페이지의 비교표를 참고하시고, 제9강에서 실습 예제를 통해 다시 다룰 예정입니다.",
      answeredAt: "2026-03-16",
      instructorName: "김세무",
    },
  },
  {
    id: "qna-006",
    courseId: "ofc-011",
    courseTitle: "중소기업 회계실무 집중과정 (3일)",
    courseCategory: "현장 강의",
    title: "둘째 날 실습에서 사용하는 프로그램 버전이 궁금합니다",
    content: "회계 실습 시 사용하는 더존 Smart A 프로그램 버전이 궁금합니다. 사전에 미리 설치하고 가야 하나요?",
    createdAt: "2026-03-19",
    answerStatus: "답변완료",
    answer: {
      content: "강의장에 1인 1PC 환경이 갖춰져 있어 별도 설치는 필요 없습니다. Smart A 최신 버전(2026.03)이 설치되어 있으며, 실습에 필요한 샘플 데이터도 미리 세팅해 두겠습니다.",
      answeredAt: "2026-03-19",
      instructorName: "조회계",
    },
  },
  {
    id: "qna-007",
    courseId: "ofc-010",
    courseTitle: "AI 활용 경영분석 실무과정 (5일)",
    courseCategory: "인재키움 프리미엄 훈련",
    title: "Python 기초 지식이 없어도 수강 가능한가요?",
    content: "AI 활용 경영분석 과정에 관심이 있는데, Python 프로그래밍 경험이 전혀 없습니다. 기초 없이도 따라갈 수 있는 수준인가요?",
    createdAt: "2026-03-16",
    answerStatus: "답변완료",
    answer: {
      content: "본 과정은 프로그래밍 비전공자를 대상으로 설계되었습니다. 첫째 날에 Python 기초와 데이터 분석 라이브러리(pandas) 사용법을 다루며, 이후 실습도 단계별로 진행합니다.\n\n다만, 엑셀 활용 능력(피벗테이블, VLOOKUP 수준)은 있으시면 좋습니다.",
      answeredAt: "2026-03-17",
      instructorName: "이지능",
    },
  },
  {
    id: "qna-008",
    courseId: "mc-003",
    courseTitle: "인사노무관리 입문",
    courseCategory: "온라인 강의",
    title: "수강 시작 전 미리 준비할 것이 있나요?",
    content: "인사노무관리 입문 강의를 곧 시작하려고 합니다. 수강 전에 미리 읽어두면 좋은 자료나 준비사항이 있을까요?",
    createdAt: "2026-03-14",
    answerStatus: "답변대기",
  },
  {
    id: "qna-009",
    courseId: "ofc-003",
    courseTitle: "경영전략 워크숍 (1일)",
    courseCategory: "현장 강의",
    title: "워크숍에서 팀 프로젝트가 있나요?",
    content: "1일 워크숍인데 팀별 프로젝트나 발표가 포함되어 있는지 궁금합니다. 있다면 사전에 팀을 구성해야 하나요?",
    createdAt: "2026-03-20",
    answerStatus: "답변대기",
  },
  {
    id: "qna-010",
    courseId: "ofc-007",
    courseTitle: "중소기업 인사노무 실무자 과정",
    courseCategory: "인재키움 프리미엄 훈련",
    title: "훈련 수료 기준이 어떻게 되나요?",
    content: "인재키움 프리미엄 훈련의 수료 기준(출석률 등)이 어떻게 되는지 알고 싶습니다. 3일 중 1일을 빠지면 수료가 안 되나요?",
    createdAt: "2026-03-21",
    answerStatus: "답변대기",
  },
  {
    id: "qna-011",
    courseId: "mc-002",
    courseTitle: "경영전략 핵심 노트: 전략적 사고를 위한 MBA 에센셜",
    courseCategory: "온라인 강의",
    title: "포터의 5 Forces 모델 적용 범위",
    content: "포터의 5 Forces 모델이 IT/스타트업 업종에도 유효한지 궁금합니다. 전통 제조업 중심의 프레임워크라는 비판이 있는 것으로 아는데, 강사님의 견해가 궁금합니다.",
    createdAt: "2026-03-12",
    answerStatus: "답변완료",
    answer: {
      content: "좋은 질문입니다. 5 Forces 모델은 기본 프레임워크로서 여전히 유효하지만, 디지털 경제에서는 '네트워크 효과'와 '플랫폼 경쟁'이라는 추가 관점이 필요합니다.\n\n제4강에서 이 부분을 디지털 전환 관점에서 보완하여 다룰 예정이니 참고해 주세요.",
      answeredAt: "2026-03-13",
      instructorName: "이전략",
    },
  },
  {
    id: "qna-012",
    courseId: "mc-001",
    courseTitle: "세무회계 실무 기초",
    courseCategory: "온라인 강의",
    title: "종합소득세 신고 시 필요한 서류 목록",
    content: "제12강 종합소득세 파트에서 신고 시 필요한 서류를 간략히 언급하셨는데, 전체 목록을 알 수 있을까요?",
    createdAt: "2026-03-10",
    answerStatus: "답변완료",
    answer: {
      content: "종합소득세 신고 시 필요한 주요 서류입니다.\n\n1. 소득금액증명원\n2. 원천징수영수증\n3. 의료비/교육비 납입증명서\n4. 기부금 영수증\n5. 연금저축 납입증명서\n\n교안 89페이지에 체크리스트가 있으니 활용하세요.",
      answeredAt: "2026-03-11",
      instructorName: "김세무",
    },
  },
  {
    id: "qna-013",
    courseId: "ofc-001",
    courseTitle: "세무실무 심화과정 (2일 집중반)",
    courseCategory: "현장 강의",
    title: "주차 가능한가요?",
    content: "자가용으로 통학할 예정인데, 건물에 주차가 가능한지 궁금합니다. 주차비가 별도로 있나요?",
    createdAt: "2026-03-21",
    answerStatus: "답변대기",
  },
  {
    id: "qna-014",
    courseId: "ofc-005",
    courseTitle: "ESG 경영전략 실무자 양성과정",
    courseCategory: "인재키움 프리미엄 훈련",
    title: "교재가 별도로 제공되나요?",
    content: "ESG 경영전략 과정에서 사용하는 교재가 별도로 제공되는지, 아니면 PDF 교안만 배포되는지 알고 싶습니다.",
    createdAt: "2026-03-18",
    answerStatus: "답변완료",
    answer: {
      content: "본 과정은 인쇄 교재와 PDF 교안을 모두 제공합니다. 인쇄 교재는 수업 당일 강의장에서 배포되며, PDF 교안은 수업 1주일 전에 이메일로 사전 배포됩니다.",
      answeredAt: "2026-03-18",
      instructorName: "한경영",
    },
  },
  {
    id: "qna-015",
    courseId: "mc-001",
    courseTitle: "세무회계 실무 기초",
    courseCategory: "온라인 강의",
    title: "강의 영상 배속 재생이 가능한가요?",
    content: "복습 목적으로 강의를 빠르게 다시 보고 싶은데, 1.5배속이나 2배속 재생 기능이 지원되나요?",
    createdAt: "2026-03-08",
    answerStatus: "답변완료",
    answer: {
      content: "네, 강의 플레이어에서 0.5x ~ 2.0x 배속 재생이 가능합니다. 영상 하단의 설정(톱니바퀴) 아이콘을 클릭하시면 배속 옵션을 선택할 수 있습니다.",
      answeredAt: "2026-03-09",
      instructorName: "김세무",
    },
  },
];
```

---

## 6. Implementation Order

| Step | Task | Files | FR |
|------|------|-------|----|
| 1 | 타입 정의 추가 | `src/types/index.ts` | - |
| 2 | Mock 데이터 추가 | `src/data/mypage.ts` | - |
| 3 | QnaFilterBar 컴포넌트 | `src/components/mypage/my-learning/QnaFilterBar.tsx` | FR-03, FR-04, FR-05, FR-06 |
| 4 | QnaCard 컴포넌트 | `src/components/mypage/my-learning/QnaCard.tsx` | FR-02 |
| 5 | QnaDetail 컴포넌트 | `src/components/mypage/my-learning/QnaDetail.tsx` | FR-08 |
| 6 | QnaWriteForm 컴포넌트 | `src/components/mypage/my-learning/QnaWriteForm.tsx` | FR-07 |
| 7 | QnaSection 메인 컴포넌트 | `src/components/mypage/my-learning/QnaSection.tsx` | FR-01, FR-09 |
| 8 | CoursesSection 연결 | `src/components/mypage/CoursesSection.tsx` | FR-01 |

---

## 7. Acceptance Criteria

| ID | Criteria | Verification |
|----|----------|-------------|
| AC-01 | "강의 Q&A" 탭 클릭 시 질문 목록 15건 표시 | Visual |
| AC-02 | 카테고리 필터 (전체/온라인/현장/인재키움) 정상 동작 | Functional |
| AC-03 | 답변 상태 필터 (전체/답변대기/답변완료) 정상 동작 | Functional |
| AC-04 | 키워드 검색 (제목 + 강의명) 정상 동작 | Functional |
| AC-05 | 질문 카드 클릭 → 상세 화면 전환 | Functional |
| AC-06 | 상세 화면: Q 카드 + A 카드 (답변완료) 또는 대기 카드 (답변대기) | Visual |
| AC-07 | "질문하기" → 작성 폼: 카테고리 선택 → 강의 목록 연동 | Functional |
| AC-08 | 작성 폼: 모든 필드 입력 시 등록 버튼 활성화 | Functional |
| AC-09 | 등록 후 목록에 새 질문 추가, 목록 화면 복귀 | Functional |
| AC-10 | "목록으로" 클릭 시 필터 상태 유지 | Functional |
| AC-11 | 페이지네이션 (10개씩) 정상 동작 | Functional |
| AC-12 | 데스크톱 테이블 / 모바일 카드 반응형 동작 | Responsive |
| AC-13 | 빌드 에러 없음 | `npm run build` |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-21 | Initial draft | allen |
