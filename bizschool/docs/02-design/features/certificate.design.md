# 수료증 페이지 Design Document

> **Summary**: 마이페이지 "내 학습 > 수료증" 탭에서 수강완료 강의 목록을 인프런 스타일 플랫 리스트로 표시하고, PDF 수료증을 다운로드하는 상세 설계
>
> **Project**: BIZSCHOOL
> **Author**: Frontend Architect
> **Date**: 2026-03-21
> **Status**: Draft
> **Plan Reference**: `docs/01-plan/features/certificate.plan.md`

---

## 1. Type Definitions

### 1.1 새로 추가하는 타입 (`src/types/index.ts`)

```typescript
// ── 수료증 ──

export interface CertificateCourse {
  id: string;
  title: string;
  category: "온라인 강의" | "현장 강의" | "인재키움 프리미엄 훈련";
  instructorName?: string;
  periodLabel: string;
  thumbnailUrl: string;
}
```

> 기존 타입 변경 없음. `CertificateCourse`는 `MyCourse`와 `MyOfflineCourse`에서 수강완료 강의만 추출하여 통합 표현하는 뷰 모델.

### 1.2 영향 범위

| 타입/값 | 사용 위치 | 조치 |
|---------|----------|------|
| `CertificateCourse` | 신규 certificate 컴포넌트들 | 추가 |
| `MyCourse` | 기존 유지 | 변경 없음 |
| `MyOfflineCourse` | 기존 유지 | 변경 없음 |
| `CoursesSection.tsx` | 수료증 placeholder 교체 | 수정 |

---

## 2. Data Integration

### 2.1 수강완료 강의 통합 함수

`CertificateSection` 컴포넌트 내부에서 `useMemo`로 두 데이터소스를 합친다.

```typescript
const completedCourses: CertificateCourse[] = useMemo(() => {
  // 온라인 강의 중 수강완료
  const onlineCourses: CertificateCourse[] = mockMyCourses
    .filter((c) => c.learningStatus === "수강완료")
    .map((c) => ({
      id: c.id,
      title: c.title,
      category: c.category,
      instructorName: c.instructorName,
      periodLabel: c.periodLabel,
      thumbnailUrl: c.thumbnailUrl,
    }));

  // 현장 + 인재키움 중 수강완료
  const offlineCourses: CertificateCourse[] = mockMyOfflineCourses
    .filter((c) => c.status === "수강완료")
    .map((c) => ({
      id: c.id,
      title: c.title,
      category: c.category,
      instructorName: c.instructorName,
      periodLabel: c.dateRangeLabel,
      thumbnailUrl: "/images/courses/course-1.jpg", // 오프라인은 기본 썸네일
    }));

  return [...onlineCourses, ...offlineCourses];
}, []);
```

### 2.2 대상 데이터 (9건)

| 소스 | ID | 강의명 | 카테고리 |
|------|-----|--------|----------|
| mockMyCourses | mc-004 | 노무관리 실무 과정 | 현장 강의 |
| mockMyCourses | mc-005 | 재경관리사 시험대비 특강 | 인재키움 프리미엄 훈련 |
| mockMyCourses | mc-006 | 재무제표 분석 실무 | 온라인 강의 |
| mockMyCourses | mc-007 | 근로기준법 핵심정리 | 온라인 강의 |
| mockMyOfflineCourses | ofc-002 | 노무관리 핵심실무 과정 | 현장 강의 |
| mockMyOfflineCourses | ofc-004 | 재경관리사 시험대비 특강 (3일) | 현장 강의 |
| mockMyOfflineCourses | ofc-006 | 디지털 전환 리더 양성과정 (5일) | 인재키움 프리미엄 훈련 |
| mockMyOfflineCourses | ofc-008 | HR 애널리틱스 실무 (주말반) | 인재키움 프리미엄 훈련 |
| mockMyOfflineCourses | ofc-009 | 스마트팩토리 구축 실무과정 (4일) | 인재키움 프리미엄 훈련 |

---

## 3. Component Design

### 3.1 파일 구조

```
src/components/mypage/
├── CoursesSection.tsx                  ← 수정 (line 132-138 교체)
└── my-learning/
    └── certificate/                    ← 새 폴더
        ├── CertificateSection.tsx      ← 수료증 탭 메인 컴포넌트
        ├── CertificateRow.tsx          ← 개별 강의 행
        ├── CertificateTemplate.tsx     ← PDF 수료증 HTML 템플릿 (숨김)
        └── generateCertificatePdf.ts   ← PDF 생성 유틸
```

### 3.2 CertificateSection.tsx (메인 컨테이너)

**역할**: 수강완료 강의 통합 목록 + 헤더 + 빈 상태 처리

```typescript
"use client";

import { useMemo } from "react";
import type { CertificateCourse } from "@/types";
import { mockMyCourses, mockMyOfflineCourses, mockUser } from "@/data/mypage";
import CertificateRow from "./CertificateRow";

export default function CertificateSection() {
  const completedCourses = useMemo<CertificateCourse[]>(() => {
    /* 위 2.1 로직 */
  }, []);

  if (completedCourses.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-[var(--color-muted)]">
          수강완료한 강의가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="flex items-center justify-between py-3">
        <p className="text-sm text-[var(--color-body)]">
          전체{" "}
          <span className="font-semibold text-[var(--color-primary)]">
            {completedCourses.length}
          </span>
        </p>
        <p className="text-sm text-[var(--color-muted)]">
          수강 확인증 ⓘ
        </p>
      </div>

      {/* List */}
      <div className="divide-y divide-[var(--color-border)]">
        {completedCourses.map((course) => (
          <CertificateRow
            key={course.id}
            course={course}
            userName={mockUser.name}
          />
        ))}
      </div>
    </div>
  );
}
```

### 3.3 CertificateRow.tsx (개별 강의 행)

**역할**: 썸네일 + 강의명 + 다운로드 아이콘 (참고 이미지 스타일)

**Props**:
```typescript
interface CertificateRowProps {
  course: CertificateCourse;
  userName: string;
}
```

**UI 구현 사양**:

```
┌────────────────────────────────────────────────────────┐
│  ┌──────┐                                              │
│  │ 썸네 │   강의명 텍스트                          ↓    │
│  │  일  │                                              │
│  └──────┘                                              │
└────────────────────────────────────────────────────────┘
```

- 행 컨테이너: `flex items-center gap-4 py-4`
- 썸네일:
  - `w-[60px] h-[60px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100`
  - `<img>`: `w-full h-full object-cover`
  - 이미지 에러 시 회색 배경 유지
- 강의명:
  - `flex-1 text-sm font-medium text-[var(--color-dark)]`
  - `line-clamp-2` (2줄 초과 시 말줄임)
- 다운로드 버튼:
  - `flex-shrink-0 p-2 rounded-lg hover:bg-[var(--color-light-bg)] transition-colors`
  - 아이콘: `Download` (lucide-react, 20px), `text-[var(--color-muted)]`
  - 클릭 시 `generateCertificatePdf()` 호출
  - 생성 중 상태: 버튼 비활성화 + 아이콘을 `Loader2` (lucide, spin 애니메이션)로 교체
- 행 구분: 부모 `divide-y divide-[var(--color-border)]`로 처리

### 3.4 CertificateTemplate.tsx (PDF 수료증 HTML 템플릿)

**역할**: PDF 변환용 숨겨진 HTML 요소 렌더링

**Props**:
```typescript
interface CertificateTemplateProps {
  userName: string;
  courseTitle: string;
  periodLabel: string;
  issueDate: string;      // "2026년 03월 21일"
  issueNumber: string;    // "BIZS-2026-mc-006"
}
```

**UI 구현 사양 (A4 가로, 1122×793px, 96dpi 기준)**:

- 컨테이너:
  - `w-[1122px] h-[793px] bg-white p-16 flex flex-col items-center justify-center`
  - `absolute left-[-9999px] top-0` (화면 밖에 렌더링)
- 제목:
  - "수 료 증": `text-4xl font-bold tracking-[0.5em] text-[var(--color-dark)]`
  - "CERTIFICATE": `text-sm tracking-[0.3em] text-[var(--color-muted)] mt-1`
- 구분선: `w-full h-px bg-[var(--color-border)] my-8`
- 수료자:
  - "성명: {userName}": `text-2xl font-semibold text-[var(--color-dark)]`
- 본문:
  - "위 사람은 다음 교육과정을 수료하였기에": `text-base text-[var(--color-body)] mt-6`
  - "이 증서를 수여합니다.": `text-base text-[var(--color-body)] mt-1`
- 세부 정보 (좌측 정렬 블록):
  - `text-sm text-[var(--color-body)] space-y-2 mt-8 self-start ml-16`
  - "교육과정명: {courseTitle}"
  - "교육기간: {periodLabel}"
  - "발급일자: {issueDate}"
  - "발급번호: {issueNumber}"
- 기관명:
  - "BIZSCHOOL": `text-xl font-bold text-[var(--color-primary)] mt-8`
  - "더존비즈스쿨 평생교육원": `text-sm text-[var(--color-muted)] mt-1`

### 3.5 generateCertificatePdf.ts (PDF 생성 유틸)

**역할**: html2canvas + jspdf로 PDF 생성 및 다운로드

```typescript
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CertificateData {
  userName: string;
  courseTitle: string;
  periodLabel: string;
  courseId: string;
}

export async function generateCertificatePdf(data: CertificateData): Promise<void> {
  // 1. 발급 정보 생성
  const now = new Date();
  const issueDate = `${now.getFullYear()}년 ${String(now.getMonth() + 1).padStart(2, "0")}월 ${String(now.getDate()).padStart(2, "0")}일`;
  const issueNumber = `BIZS-${now.getFullYear()}-${data.courseId}`;

  // 2. 임시 DOM 생성 (CertificateTemplate과 동일한 HTML)
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.innerHTML = buildCertificateHtml({
    ...data,
    issueDate,
    issueNumber,
  });
  document.body.appendChild(container);

  try {
    // 3. html2canvas로 캡처
    const canvas = await html2canvas(container.firstElementChild as HTMLElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    // 4. jsPDF로 PDF 생성 (A4 가로)
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

    // 5. 다운로드
    const fileName = `수료증_${data.courseTitle.replace(/[^가-힣a-zA-Z0-9]/g, "_")}.pdf`;
    pdf.save(fileName);
  } finally {
    document.body.removeChild(container);
  }
}

function buildCertificateHtml(data: {
  userName: string;
  courseTitle: string;
  periodLabel: string;
  issueDate: string;
  issueNumber: string;
}): string {
  return `
    <div style="width:1122px;height:793px;background:#fff;padding:64px;
                display:flex;flex-direction:column;align-items:center;justify-content:center;
                font-family:'Malgun Gothic','맑은 고딕',sans-serif;">
      <div style="font-size:36px;font-weight:bold;letter-spacing:0.5em;color:#1a1a1a;">
        수 료 증
      </div>
      <div style="font-size:14px;letter-spacing:0.3em;color:#888;margin-top:4px;">
        CERTIFICATE
      </div>
      <div style="width:100%;height:1px;background:#e5e5e5;margin:40px 0;"></div>
      <div style="font-size:28px;font-weight:600;color:#1a1a1a;">
        성명: ${data.userName}
      </div>
      <div style="font-size:16px;color:#555;margin-top:24px;">
        위 사람은 다음 교육과정을 수료하였기에
      </div>
      <div style="font-size:16px;color:#555;margin-top:4px;">
        이 증서를 수여합니다.
      </div>
      <div style="width:100%;height:1px;background:#e5e5e5;margin:40px 0;"></div>
      <div style="align-self:flex-start;margin-left:120px;font-size:15px;color:#555;line-height:2;">
        <div>교육과정명: &nbsp; ${data.courseTitle}</div>
        <div>교육기간: &nbsp;&nbsp;&nbsp;&nbsp; ${data.periodLabel}</div>
        <div>발급일자: &nbsp;&nbsp;&nbsp;&nbsp; ${data.issueDate}</div>
        <div>발급번호: &nbsp;&nbsp;&nbsp;&nbsp; ${data.issueNumber}</div>
      </div>
      <div style="width:100%;height:1px;background:#e5e5e5;margin:40px 0;"></div>
      <div style="font-size:22px;font-weight:bold;color:#00c471;">BIZSCHOOL</div>
      <div style="font-size:14px;color:#888;margin-top:4px;">더존비즈스쿨 평생교육원</div>
    </div>
  `;
}
```

---

## 4. CoursesSection.tsx 수정 사항

현재 `line 131-138`의 placeholder를 `CertificateSection`으로 교체:

```typescript
// 기존 (삭제)
{activeTab === "수료증" && (
  <div className="py-20 text-center">
    <p className="text-sm text-[var(--color-muted)]">
      준비 중인 기능입니다.
    </p>
  </div>
)}

// 변경 후
{activeTab === "수료증" && <CertificateSection />}
```

상단에 import 추가:
```typescript
import CertificateSection from "./my-learning/certificate/CertificateSection";
```

---

## 5. External Dependencies

### 5.1 신규 패키지

| Package | Version | Purpose | Size |
|---------|---------|---------|------|
| `jspdf` | ^2.5 | PDF 문서 생성 | ~300KB |
| `html2canvas` | ^1.4 | HTML → Canvas 캡처 | ~40KB |

설치 명령:
```bash
npm install jspdf html2canvas
```

### 5.2 기존 의존성 활용

| Package | Usage |
|---------|-------|
| `lucide-react` | `Download`, `Loader2` 아이콘 |

---

## 6. Styling Conventions

### 6.1 기존 디자인 토큰 활용

| Token | Usage |
|-------|-------|
| `--color-primary` | 헤더 숫자 색상, PDF "BIZSCHOOL" 텍스트 |
| `--color-dark` | 강의명, PDF 제목/성명 |
| `--color-body` | PDF 본문 텍스트 |
| `--color-muted` | "수강 확인증", 다운로드 아이콘, PDF 부제 |
| `--color-border` | 행 구분선, PDF 구분선 |
| `--color-light-bg` | 다운로드 버튼 hover 배경 |

### 6.2 아이콘 (lucide-react)

| Icon | Usage |
|------|-------|
| `Download` | 각 행 우측 다운로드 버튼 (20px) |
| `Loader2` | PDF 생성 중 로딩 아이콘 (20px, animate-spin) |

---

## 7. State Management

### 7.1 상태 흐름도

```
CoursesSection (기존)
├── activeTab: MyLearningTab     → MyLearningTabs
│   └── "수료증" 선택 시:
│       └── CertificateSection (상태 독립)
│           ├── completedCourses: CertificateCourse[] (derived, useMemo)
│           └── CertificateRow[]
│               └── isGenerating: boolean (각 행 로컬 상태)
```

### 7.2 CertificateRow 내부 상태

```typescript
const [isGenerating, setIsGenerating] = useState(false);

const handleDownload = async () => {
  setIsGenerating(true);
  try {
    await generateCertificatePdf({
      userName,
      courseTitle: course.title,
      periodLabel: course.periodLabel,
      courseId: course.id,
    });
  } finally {
    setIsGenerating(false);
  }
};
```

---

## 8. Implementation Order

| Step | Task | Files | FR Coverage |
|------|------|-------|------------|
| 1 | `jspdf`, `html2canvas` 패키지 설치 | `package.json` | - |
| 2 | `CertificateCourse` 타입 추가 | `types/index.ts` | - |
| 3 | `generateCertificatePdf.ts` 유틸 구현 | `certificate/generateCertificatePdf.ts` | FR-04, FR-05 |
| 4 | `CertificateRow.tsx` 구현 | `certificate/CertificateRow.tsx` | FR-02 |
| 5 | `CertificateSection.tsx` 구현 | `certificate/CertificateSection.tsx` | FR-01, FR-03, FR-06 |
| 6 | `CoursesSection.tsx` 수정 | `CoursesSection.tsx` | 전체 조합 |

---

## 9. Responsive Design

| Breakpoint | 행 레이아웃 | 썸네일 | 강의명 |
|------------|-----------|--------|--------|
| < 640px (mobile) | `flex items-center gap-3 py-3` | `w-[48px] h-[48px]` | `text-sm line-clamp-1` |
| >= 640px (sm+) | `flex items-center gap-4 py-4` | `w-[60px] h-[60px]` | `text-sm line-clamp-2` |

---

## 10. Acceptance Criteria

| ID | Criteria | Verification |
|----|----------|-------------|
| AC-01 | "수료증" 탭 클릭 시 수강완료 강의 목록 표시 | Visual |
| AC-02 | 헤더에 "전체 9" (초록 숫자) + "수강 확인증 ⓘ" 표시 | Visual |
| AC-03 | 각 행에 썸네일(60×60) + 강의명 + 다운로드 아이콘(↓) | Visual |
| AC-04 | 행 사이 얇은 구분선 | Visual |
| AC-05 | 다운로드 아이콘 클릭 시 PDF 생성 + 자동 다운로드 | Functional |
| AC-06 | PDF 생성 중 로딩 스피너 표시 | Visual |
| AC-07 | PDF에 수료자명/강의명/기간/발급일/발급번호 포함 | Content |
| AC-08 | 수강완료 강의 없을 시 빈 상태 메시지 | Visual |
| AC-09 | 모바일(< 640px)에서 정상 렌더링 | Responsive |
| AC-10 | 온라인/현장/인재키움 3개 소스 통합 표시 (9건) | Functional |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-21 | Initial draft | Frontend Architect |
