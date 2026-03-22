# course-qna Planning Document

> **Summary**: 마이페이지 > 내 학습 > "강의 Q&A" 탭에 강의별 질문/답변 기능 구현
>
> **Project**: BIZSCHOOL
> **Version**: 0.1
> **Author**: allen
> **Date**: 2026-03-21
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

수강생이 "온라인 강의", "현장 강의", "인재키움 프리미엄 훈련" 강의에 대해 궁금한 점을 질문으로 남기면, 해당 강의를 담당하는 강사가 답변해주는 Q&A 시스템을 구현한다.

마이페이지 > 내 학습 > "강의 Q&A" 탭에 위치하며, 수강 중인(또는 수강했던) 강의에 대해서만 질문을 작성할 수 있다.

### 1.2 Background

- 현재 `MyLearningTab` 타입에 "강의 Q&A" 탭이 이미 정의되어 있으나, CoursesSection에서 "준비 중인 기능입니다."로 표시됨
- 커뮤니티 페이지에 "강의질문" 탭이 별도로 존재하지만, 이것은 공개 게시판 형태
- 강의 Q&A는 **개인 마이페이지 내에서** 자신의 수강 강의에 대한 1:1 질의응답 성격

### 1.3 Related Documents

- 타입 정의: `src/types/index.ts` (MyLearningTab, CourseCategory 등)
- 내 학습 섹션: `src/components/mypage/CoursesSection.tsx`
- 내 학습 탭: `src/components/mypage/my-learning/MyLearningTabs.tsx`
- Mock 데이터: `src/data/mypage.ts`
- 커뮤니티 강의질문 (참고): `src/components/community/QuestionsTab.tsx`

---

## 2. Scope

### 2.1 In Scope

- [x] "강의 Q&A" 탭 UI 구현 (질문 목록)
- [x] 질문 작성 폼 (강의 선택 + 제목 + 내용)
- [x] 질문 상세 보기 (질문 + 강사 답변)
- [x] 강의 카테고리별 필터 ("전체", "온라인 강의", "현장 강의", "인재키움 프리미엄 훈련")
- [x] 답변 상태 필터 ("전체", "답변대기", "답변완료")
- [x] 키워드 검색
- [x] 페이지네이션
- [x] Mock 데이터 기반 (정적 프론트엔드)

### 2.2 Out of Scope

- 백엔드 연동 (API, DB)
- 강사 측 답변 작성 인터페이스 (관리자 페이지)
- 파일 첨부 기능
- 질문 수정/삭제 기능
- 알림 기능 (답변 알림 등)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | "강의 Q&A" 탭 클릭 시 질문 목록 표시 | High | Pending |
| FR-02 | 질문 목록: 카테고리 뱃지, 강의명, 질문 제목, 작성일, 답변 상태 표시 | High | Pending |
| FR-03 | 강의 카테고리별 필터 (전체/온라인/현장/인재키움) | Medium | Pending |
| FR-04 | 답변 상태 필터 (전체/답변대기/답변완료) | Medium | Pending |
| FR-05 | 키워드 검색 (질문 제목 + 강의명 대상) | Medium | Pending |
| FR-06 | "질문하기" 버튼으로 질문 작성 폼 표시 | High | Pending |
| FR-07 | 질문 작성 폼: 강의 카테고리 선택 → 해당 카테고리의 수강 강의 선택 → 제목 + 내용 | High | Pending |
| FR-08 | 질문 클릭 시 상세 보기: 질문 내용 + 강사 답변(있을 경우) 표시 | High | Pending |
| FR-09 | 페이지네이션 (10개씩) | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| UX | 기존 마이페이지 1:1 문의와 유사한 UI 패턴 사용 | 시각 검증 |
| 일관성 | 기존 필터바, 목록, 상세 패턴 재활용 | 코드 검증 |

---

## 4. UI Structure

### 4.1 질문 목록 화면

```
┌─────────────────────────────────────────────────────────────┐
│ [온라인 강의] [현장 강의] [인재키움 프리미엄 훈련] [강의 Q&A] [수료증]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─ 필터 바 ─────────────────────────────────────────────┐   │
│ │ 강의유형: [전체 ▼]  상태: [전체 ▼]  [검색어 입력]      │   │
│ │                                      [질문하기] 버튼  │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                             │
│ 총 15개의 질문                                               │
│                                                             │
│ ┌─ 질문 카드 ───────────────────────────────────────────┐   │
│ │ [온라인] 세무회계 실무 기초                              │   │
│ │ 제4강 부가세 신고 관련 질문이 있습니다                    │   │
│ │ 2026.03.18  [답변완료]                                 │   │
│ └───────────────────────────────────────────────────────┘   │
│ ┌─ 질문 카드 ───────────────────────────────────────────┐   │
│ │ [현장] 세무실무 심화과정                                 │   │
│ │ 강의 자료 PDF 다운로드가 안됩니다                         │   │
│ │ 2026.03.20  [답변대기]                                 │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                             │
│ [< 1 2 >]                                                   │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 질문 상세 화면

```
┌─────────────────────────────────────────────────────────────┐
│ ← 목록으로                                                   │
│                                                             │
│ ┌─ 질문 ────────────────────────────────────────────────┐   │
│ │ [온라인] 세무회계 실무 기초                              │   │
│ │                                                       │   │
│ │ Q. 제4강 부가세 신고 관련 질문이 있습니다                 │   │
│ │                                                       │   │
│ │ 부가세 신고 시 매입세액 공제가 안되는 경우에 대해          │   │
│ │ 좀 더 자세한 설명이 필요합니다...                        │   │
│ │                                                       │   │
│ │ 작성일: 2026.03.18                                     │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌─ 답변 ────────────────────────────────────────────────┐   │
│ │ A. 김세무 강사                                         │   │
│ │                                                       │   │
│ │ 매입세액 공제가 안 되는 경우는 크게 세 가지입니다.        │   │
│ │ 1. 비영업용 소형승용차 관련 매입세액...                  │   │
│ │                                                       │   │
│ │ 답변일: 2026.03.19                                     │   │
│ └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 질문 작성 화면

```
┌─────────────────────────────────────────────────────────────┐
│ ← 목록으로                                                   │
│                                                             │
│ 강의 Q&A 작성                                                │
│                                                             │
│ 강의 카테고리 *                                               │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ [카테고리를 선택하세요 ▼]                                │   │
│ │  - 온라인 강의                                         │   │
│ │  - 현장 강의                                           │   │
│ │  - 인재키움 프리미엄 훈련                                │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                             │
│ 강의 선택 *  (선택한 카테고리의 수강 강의만 표시)               │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ [강의를 선택하세요 ▼]                                   │   │
│ │  - 세무회계 실무 기초                                   │   │
│ │  - 경영전략 핵심 노트                                   │   │
│ │  - ...                                                │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                             │
│ 제목 *                                                      │
│ ┌───────────────────────────────────────────────────────┐   │
│ │                                                       │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                             │
│ 내용 *                                                      │
│ ┌───────────────────────────────────────────────────────┐   │
│ │                                                       │   │
│ │                                                       │   │
│ │                                                       │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                             │
│                          [취소]  [등록하기]                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Data Model

### 5.1 Type Definitions (추가)

```typescript
// 강의 Q&A 답변 상태
export type QnaAnswerStatus = "답변대기" | "답변완료";

export type QnaAnswerStatusFilter = "전체" | QnaAnswerStatus;

// 강의 카테고리 필터 (기존 CourseCategory + "전체")
export type QnaCategoryFilter = "전체" | CourseCategory;

// 강의 Q&A 항목
export interface CourseQna {
  id: string;
  courseId: string;           // MyCourse.id 또는 MyOfflineCourse.id 참조
  courseTitle: string;
  courseCategory: CourseCategory;  // "온라인 강의" | "현장 강의" | "인재키움 프리미엄 훈련"
  title: string;
  content: string;
  createdAt: string;          // ISO date string
  answerStatus: QnaAnswerStatus;
  answer?: CourseQnaAnswer;
}

// 강사 답변
export interface CourseQnaAnswer {
  content: string;
  answeredAt: string;
  instructorName: string;
}
```

### 5.2 Mock Data

- 15~20개의 질문 Mock 데이터 작성
- 온라인/현장/인재키움 카테고리 골고루 분배
- 답변대기/답변완료 상태 혼합
- 기존 mockMyCourses, mockMyOfflineCourses의 강의를 참조

---

## 6. Implementation Plan

### 6.1 File Changes

| Action | File | Description |
|--------|------|-------------|
| Edit | `src/types/index.ts` | QnaAnswerStatus, CourseQna, CourseQnaAnswer 타입 추가 |
| Edit | `src/data/mypage.ts` | mockCourseQnas Mock 데이터 추가 |
| Create | `src/components/mypage/my-learning/QnaFilterBar.tsx` | 카테고리/상태 필터 + 검색 + 질문하기 버튼 |
| Create | `src/components/mypage/my-learning/QnaList.tsx` | 질문 목록 컴포넌트 |
| Create | `src/components/mypage/my-learning/QnaCard.tsx` | 질문 카드 (목록 아이템) |
| Create | `src/components/mypage/my-learning/QnaDetail.tsx` | 질문 상세 + 답변 표시 |
| Create | `src/components/mypage/my-learning/QnaWriteForm.tsx` | 질문 작성 폼 |
| Edit | `src/components/mypage/CoursesSection.tsx` | "강의 Q&A" 탭 렌더링 연결 |

### 6.2 Reused Patterns

- 필터바: 기존 `CourseFilterBar`, `OfflineCourseFilterBar`와 동일한 UI 패턴
- 목록 + 상세: 기존 1:1 문의 (`InquirySection`)의 목록/상세 전환 패턴 참고
- 질문 작성: 기존 1:1 문의 작성 폼 패턴 참고
- 페이지네이션: 기존 구매내역 페이지네이션 패턴 재활용
- 뱃지: 기존 `Badge` 컴포넌트 스타일 활용

---

## 7. Success Criteria

### 7.1 Definition of Done

- [ ] "강의 Q&A" 탭 클릭 시 질문 목록이 표시됨
- [ ] 카테고리, 답변 상태, 키워드 필터가 정상 작동
- [ ] "질문하기" 클릭 시 작성 폼 표시, 강의 선택 가능
- [ ] 질문 클릭 시 상세 내용 + 강사 답변 표시
- [ ] "목록으로" 버튼으로 목록 화면 복귀
- [ ] 페이지네이션 정상 작동
- [ ] 빌드 에러 없음

---

## 8. Architecture Considerations

### 8.1 Project Level Selection

| Level | Characteristics | Selected |
|-------|-----------------|:--------:|
| **Starter** | 정적 Mock 데이터 기반 UI, 백엔드 불필요 | **O** |

### 8.2 Key Architectural Decisions

| Decision | Selected | Rationale |
|----------|----------|-----------|
| Q&A 위치 | 마이페이지 > 내 학습 탭 내부 | 기존 MyLearningTab 타입에 이미 정의됨 |
| 상태 관리 | useState (Client Component) | 기존 CoursesSection 패턴과 동일 |
| 화면 전환 | 상태 기반 (list/detail/write) | 기존 1:1 문의 InquirySection 패턴 참고 |
| 컴포넌트 위치 | `src/components/mypage/my-learning/` | 내 학습 관련 컴포넌트 그룹 |

---

## 9. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 질문 작성 후 목록에 즉시 반영 안 됨 | Low | High | Mock 데이터 기반이므로 상태로 관리 (추후 백엔드 연동 시 API 호출) |
| 강의 목록이 길어질 때 선택 UX | Medium | Medium | 드롭다운에 카테고리별 그룹핑 적용 |

---

## 10. Next Steps

1. [ ] Design 문서 작성 (`course-qna.design.md`)
2. [ ] 구현 시작
3. [ ] Gap Analysis

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-21 | Initial draft | allen |
