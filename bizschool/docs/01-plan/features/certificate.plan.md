# 수료증 페이지 Planning Document

> **Summary**: 마이페이지 "내 학습" 탭 내 "수료증" 서브탭에서 수강완료 강의 목록을 보여주고, PDF 수료증을 다운로드할 수 있는 기능 구현
>
> **Project**: BIZSCHOOL
> **Author**: Product Manager
> **Date**: 2026-03-21
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

"내 학습" 탭의 "수료증" 서브탭(현재 "준비 중인 기능입니다" placeholder)을 실제 기능으로 구현한다.
수강완료 상태가 된 모든 강의(온라인/현장/인재키움)를 목록으로 표시하고, 각 강의별 수료증을 PDF로 다운로드할 수 있게 한다.

### 1.2 Background

**현재 상태:**
- `MyLearningTab` 타입에 `"수료증"` 이미 포함됨
- `myLearningTabs` 배열에 `"수료증"` 탭 이미 등록됨
- `CoursesSection.tsx:132-138`에서 "준비 중인 기능입니다" placeholder 표시 중
- 수강완료 강의 데이터가 `mockMyCourses`(온라인)와 `mockMyOfflineCourses`(현장/인재키움)에 존재

**수강완료 강의 현황 (mock data 기준):**

| ID | 강의명 | 카테고리 |
|----|--------|----------|
| mc-004 | 노무관리 실무 과정 | 현장 강의 |
| mc-005 | 재경관리사 시험대비 특강 | 인재키움 프리미엄 훈련 |
| mc-006 | 재무제표 분석 실무 | 온라인 강의 |
| mc-007 | 근로기준법 핵심정리 | 온라인 강의 |
| ofc-002 | 노무관리 핵심실무 과정 | 현장 강의 |
| ofc-004 | 재경관리사 시험대비 특강 (3일) | 현장 강의 |
| ofc-006 | 디지털 전환 리더 양성과정 (5일) | 인재키움 프리미엄 훈련 |
| ofc-008 | HR 애널리틱스 실무 (주말반) | 인재키움 프리미엄 훈련 |
| ofc-009 | 스마트팩토리 구축 실무과정 (4일) | 인재키움 프리미엄 훈련 |

### 1.3 Related Documents

- 현재 컴포넌트: `src/components/mypage/CoursesSection.tsx` (line 132-138)
- 탭 컴포넌트: `src/components/mypage/my-learning/MyLearningTabs.tsx`
- 타입 정의: `src/types/index.ts` (`MyCourse`, `MyOfflineCourse`, `MyLearningTab`)
- 데이터: `src/data/mypage.ts` (`mockMyCourses`, `mockMyOfflineCourses`)

---

## 2. Scope

### 2.1 In Scope

- [x] 수강완료 강의 통합 목록 표시 (온라인 + 현장 + 인재키움)
- [x] 강의별 수료증 다운로드 버튼
- [x] PDF 수료증 생성 및 다운로드 (클라이언트 사이드)
- [x] 수료증 PDF 디자인 (수료자명, 강의명, 수료일, 발급번호 등)
- [x] 빈 상태 처리 (수강완료 강의가 없는 경우)

### 2.2 Out of Scope

- 서버 사이드 수료증 발급/검증 시스템
- 수료증 진위 확인 QR코드/URL
- 수료증 이메일 발송
- 수료증 재발급 이력 관리

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 수강완료 강의 목록 표시 (온라인 + 현장 + 인재키움 통합) | High | Pending |
| FR-02 | 각 강의 항목: 좌측 썸네일(소) + 강의명 + 우측 다운로드 아이콘 (인프런 수료증 리스트 스타일) | High | Pending |
| FR-03 | 헤더: 좌측 "전체 N", 우측 "수강 확인증 ⓘ" 표시 | High | Pending |
| FR-04 | 다운로드 버튼 클릭 시 PDF 수료증 생성 및 브라우저 다운로드 | High | Pending |
| FR-05 | PDF 수료증 포함 정보: 수료자명, 강의명, 수강기간, 발급일, 발급번호 | High | Pending |
| FR-06 | 수강완료 강의 없을 때 빈 상태 메시지 표시 | Medium | Pending |
| FR-07 | 강의명 검색 필터 | Low | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| 반응형 | 모바일/태블릿/데스크톱 정상 렌더링 | 브라우저 리사이즈 테스트 |
| 성능 | PDF 생성 3초 이내 완료 | 수동 테스트 |
| 일관성 | 기존 bizschool 디자인 변수/컬러 토큰 활용 | 코드 리뷰 |

---

## 4. UI Structure

### 4.1 수료증 탭 레이아웃 (참고: 인프런 수료증 페이지)

```
┌──────────────────────────────────────────────────────────────┐
│  온라인 강의  현장 강의  인재키움 프리미엄 훈련  강의 Q&A  [수료증]  │  ← 탭
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  전체 9                                        수강 확인증 ⓘ  │  ← 헤더
│                                                              │
│  ┌────┐                                                      │
│  │썸네│  노무관리 실무 과정                               ↓   │  ← 행 1
│  │일  │                                                      │
│  └────┘                                                      │
│  ─────────────────────────────────────────────────────────── │  ← 구분선
│  ┌────┐                                                      │
│  │썸네│  재경관리사 시험대비 특강                           ↓   │  ← 행 2
│  │일  │                                                      │
│  └────┘                                                      │
│  ─────────────────────────────────────────────────────────── │
│  ┌────┐                                                      │
│  │썸네│  재무제표 분석 실무                               ↓   │  ← 행 3
│  │일  │                                                      │
│  └────┘                                                      │
│  ...                                                         │
└──────────────────────────────────────────────────────────────┘
```

**UI 특징 (참고 이미지 기반):**
- 플랫 리스트 (카드 없음, 행 사이 얇은 구분선)
- 각 행: [썸네일 60×60] + [강의명 텍스트] + [다운로드 아이콘 ↓]
- 헤더: 좌측 "전체 N" (초록 숫자), 우측 "수강 확인증 ⓘ"
- 깔끔하고 미니멀한 디자인

### 4.2 수료증 PDF 레이아웃 (A4 가로)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                        수  료  증                                │
│                     CERTIFICATE                                 │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│                       성명: 김비즈                               │
│                                                                 │
│              위 사람은 다음 교육과정을 수료하였기에                   │
│              이 증서를 수여합니다.                                  │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│    교육과정명:  재무제표 분석 실무                                  │
│    교육기간:    2025.10.01 ~ 2025.12.31                          │
│    발급일자:    2026년 03월 21일                                   │
│    발급번호:    BIZS-2026-mc-006                                  │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│                       BIZSCHOOL                                 │
│                   더존비즈스쿨 평생교육원                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Data Model

### 5.1 수료증 대상 데이터 통합

온라인/현장/인재키움 강의 데이터를 통합된 형태로 변환하여 표시한다.

```typescript
interface CertificateCourse {
  id: string;
  title: string;
  category: "온라인 강의" | "현장 강의" | "인재키움 프리미엄 훈련";
  instructorName?: string;
  periodLabel: string;
  thumbnailUrl?: string;
}
```

**데이터 소스 매핑:**
- `mockMyCourses` → `learningStatus === "수강완료"` 필터
- `mockMyOfflineCourses` → `status === "수강완료"` 필터

### 5.2 PDF 생성에 필요한 정보

- `mockUser.name`: 수료자명
- `course.title`: 교육과정명
- `course.periodLabel`: 교육기간
- 현재 날짜: 발급일자
- `course.id`: 발급번호 생성 (`BIZS-2026-{id}`)

---

## 6. Technical Approach

### 6.1 PDF 생성 라이브러리

클라이언트 사이드 PDF 생성을 위해 `jspdf` 라이브러리 사용.
- 한글 폰트 지원 필요 → Base64 인코딩된 한글 폰트 번들링 또는 `html2canvas` + `jspdf` 조합
- 추천: `@react-pdf/renderer`는 SSR 의존성이 있으므로, `jspdf` + `html2canvas` 조합이 적합

```
npm install jspdf html2canvas
```

### 6.2 PDF 생성 플로우

1. 사용자가 "수료증 다운로드" 버튼 클릭
2. 숨겨진 DOM 요소에 수료증 HTML 렌더링
3. `html2canvas`로 DOM → Canvas 변환
4. `jspdf`로 Canvas → PDF 변환
5. 브라우저에서 PDF 자동 다운로드

---

## 7. Component Architecture

### 7.1 컴포넌트 트리

```
CoursesSection.tsx (기존 파일 수정)
└── CertificateSection              (수료증 탭 콘텐츠) ← NEW
    ├── CertificateList             (수강완료 강의 목록)
    │   └── CertificateCard         (개별 강의 카드 + 다운로드 버튼)
    └── CertificateTemplate         (PDF 생성용 숨겨진 템플릿)
```

### 7.2 파일 구조

```
src/components/mypage/
├── CoursesSection.tsx              (수정: CertificateSection import)
├── my-learning/
│   ├── certificate/                (새 폴더)
│   │   ├── CertificateSection.tsx  (수료증 탭 메인 컴포넌트)
│   │   ├── CertificateCard.tsx     (개별 강의 카드)
│   │   └── CertificateTemplate.tsx (PDF 수료증 템플릿)
│   │   └── generateCertificatePdf.ts (PDF 생성 유틸리티)
```

---

## 8. Implementation Order

| Step | Task | Dependencies | Estimated Effort |
|------|------|-------------|-----------------|
| 1 | `jspdf`, `html2canvas` 패키지 설치 | 없음 | S |
| 2 | `CertificateCourse` 타입 정의 (types/index.ts) | 없음 | S |
| 3 | `CertificateCard` 컴포넌트 구현 (강의 정보 + 다운로드 버튼) | Step 2 | M |
| 4 | `CertificateTemplate` 컴포넌트 구현 (PDF용 HTML 템플릿) | Step 2 | M |
| 5 | `generateCertificatePdf.ts` 유틸 구현 (html2canvas + jspdf) | Step 1, 4 | M |
| 6 | `CertificateSection` 컴포넌트 구현 (목록 + 빈 상태) | Step 3, 5 | M |
| 7 | `CoursesSection.tsx` 수정 (placeholder → CertificateSection) | Step 6 | S |
| 8 | 반응형 테스트 및 미세 조정 | Step 7 | S |

---

## 9. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 한글 폰트 PDF 렌더링 이슈 | High | Medium | `html2canvas` 방식으로 HTML → 이미지 → PDF 변환하여 폰트 문제 우회 |
| PDF 파일 크기가 클 수 있음 | Low | Medium | 이미지 품질 조정 (JPEG quality 0.8) |
| `html2canvas`의 CSS 호환성 한계 | Medium | Low | 수료증 템플릿을 단순한 CSS로 작성 |
| 모바일에서 PDF 다운로드 동작 차이 | Low | Medium | `window.open()` fallback 처리 |

---

## 10. Success Criteria

### 10.1 Definition of Done

- [ ] "수료증" 탭 클릭 시 수강완료 강의 목록이 표시됨
- [ ] 온라인/현장/인재키움 모든 카테고리의 수강완료 강의가 통합 표시됨
- [ ] 각 강의에 "수료증 다운로드" 버튼이 있음
- [ ] 다운로드 버튼 클릭 시 PDF 파일이 정상적으로 다운로드됨
- [ ] PDF에 수료자명, 강의명, 수강기간, 발급일, 발급번호가 포함됨
- [ ] 수강완료 강의가 없을 때 빈 상태 메시지 표시
- [ ] 모바일/데스크톱 반응형 정상 동작

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-21 | Initial draft | Product Manager |
