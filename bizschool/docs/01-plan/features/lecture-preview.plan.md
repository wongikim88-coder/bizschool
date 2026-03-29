# 강의 미리보기 기능 Planning Document

> **Summary**: 전문가 강의 업로드 페이지(`/expert/upload`)에서 입력 중인 내용을 강의 상세페이지 형태로 새 창에서 미리보기
>
> **Project**: BIZSCHOOL
> **Author**: AI
> **Date**: 2026-03-29
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

전문가가 `/expert/upload`에서 강의 정보를 입력하는 도중, "미리보기" 버튼을 클릭하면 실제 수강생이 보게 될 강의 상세페이지(`/lectures/lec-xxx`)와 동일한 레이아웃으로 현재까지 입력된 내용을 새 창에서 확인할 수 있도록 한다.

### 1.2 Background

- 현재 업로드 페이지에서는 입력 내용이 최종적으로 어떻게 보일지 확인할 방법이 없음
- 전문가가 강의 상세정보(HTML), 커리큘럼, 태그, 학습 포인트 등을 입력 후 발행하기 전에 시각적으로 검증할 수 있어야 함
- 기존 강의 상세페이지 컴포넌트(`LectureDetailContent`)를 재활용하여 구현

### 1.3 References

- 기존 강의 상세페이지: `/lectures/[id]` → `LectureDetailContent.tsx`
- 업로드 페이지: `/expert/upload` (Step 4: 수업 정보 입력)
- 데이터 타입: `LectureDetail` (types/index.ts)

---

## 2. Scope

### 2.1 In Scope

- [ ] 업로드 페이지 헤더에 "미리보기" 버튼 추가 (임시저장 버튼 왼쪽)
- [ ] 미리보기 전용 라우트 생성 (`/lectures/preview`)
- [ ] 업로드 폼 데이터 → `LectureDetail` 형식 변환 로직
- [ ] `sessionStorage`를 통한 데이터 전달
- [ ] `LectureDetailContent` 컴포넌트 재활용
- [ ] 미리보기 페이지 상단에 "미리보기 모드" 알림 배너
- [ ] 새 창(탭) 열기 방식

### 2.2 Out of Scope

- 미리보기 데이터의 서버 저장/API 연동
- 미리보기 페이지 내에서의 편집 기능
- 실제 수강신청/결제 동작 (미리보기에서 비활성화)
- 리뷰, FAQ Mock 데이터 생성 (빈 배열로 처리)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 헤더 "임시저장" 버튼 왼쪽에 "미리보기" 버튼 추가 | High | Pending |
| FR-02 | 미리보기 클릭 시 현재 폼 데이터를 `sessionStorage`에 저장 | High | Pending |
| FR-03 | 새 창(탭)에서 `/lectures/preview` 페이지 열기 | High | Pending |
| FR-04 | `/lectures/preview` 페이지에서 `sessionStorage` 데이터를 `LectureDetail` 형태로 변환 | High | Pending |
| FR-05 | 기존 `LectureDetailContent` 컴포넌트로 미리보기 렌더링 | High | Pending |
| FR-06 | 미리보기 상단에 "미리보기 모드" 배너 표시 | Medium | Pending |
| FR-07 | 아직 입력되지 않은 필드는 기본값/플레이스홀더로 표시 | Medium | Pending |
| FR-08 | 업로드 어느 Step에서든 미리보기 가능 (입력된 데이터만 반영) | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | 새 창 열림 후 500ms 이내 렌더링 | 체감 속도 확인 |
| UX | 미리보기 창 닫아도 업로드 페이지 상태 유지 | 수동 테스트 |
| Security | sessionStorage 데이터는 같은 탭에서만 접근 (보안 기본 보장) | — |

---

## 4. Technical Design Summary

### 4.1 데이터 전달 방식: `sessionStorage`

**선택 이유:**
- `localStorage`와 달리 탭 단위로 격리되어 다중 탭 충돌 없음
- URL에 데이터를 노출하지 않아 깔끔함
- 새 창(`window.open`)은 부모의 sessionStorage를 복제하므로 데이터 전달 가능
- 폼 데이터가 클 수 있으므로 URL query string은 부적합

**대안 검토:**
| 방식 | 장점 | 단점 | 선택 |
|------|------|------|:----:|
| sessionStorage | 탭 격리, 대용량 OK | 새 창 열기 필요 | ✅ |
| localStorage | 간단 | 탭 간 충돌 가능 | — |
| URL query params | 서버 불필요 | 데이터 크기 제한, URL 노출 | — |
| postMessage | 실시간 동기화 가능 | 구현 복잡도 높음 | — |

### 4.2 폼 데이터 → LectureDetail 매핑

```
Upload Form State          →  LectureDetail
─────────────────────────────────────────────
courseTitle                 →  title
courseDescription           →  description
selectedCategories         →  categories
tags                       →  tags
learningPoints             →  learningPoints
targetAudience             →  targetAudience
courseDetail (HTML)         →  detail
lessons[].title + duration →  curriculum
instructorInfo             →  instructor
price                      →  price
```

- `reviews`, `faqs`: 빈 배열 `[]`
- `rating`, `reviewCount`, `studentCount`: 기본값 (`0`)
- `id`: `"preview"` (고정)
- `level`, `totalDuration`, `lessonCount`: 폼 데이터에서 계산

### 4.3 컴포넌트 구조

```
src/
├── app/lectures/preview/
│   └── page.tsx               ← NEW: 미리보기 전용 클라이언트 페이지
├── app/expert/upload/
│   └── page.tsx               ← MODIFY: 헤더에 미리보기 버튼 추가
│                                         + buildPreviewData() 함수 추가
└── components/lectures/
    └── LectureDetailContent.tsx  ← 기존 컴포넌트 재활용 (변경 최소화)
```

### 4.4 미리보기 버튼 위치

```
┌─────────────────────────────────────────────────────────┐
│ [BIZSCHOOL]     3/5 · 수업 정보 입력     [미리보기] [임시저장] [X] │
└─────────────────────────────────────────────────────────┘
```

- 아이콘: `Eye` (lucide-react)
- 스타일: 기존 임시저장 버튼과 동일한 border 스타일

---

## 5. Success Criteria

### 5.1 Definition of Done

- [ ] 헤더에 "미리보기" 버튼 표시
- [ ] 클릭 시 새 창에서 강의 상세 레이아웃으로 현재 입력 데이터 표시
- [ ] 강의 제목, 설명, 상세정보(HTML), 커리큘럼, 태그 등 모두 반영
- [ ] 미리보기 상단에 "미리보기 모드" 배너 표시
- [ ] 업로드 페이지 상태는 미리보기 후에도 유지
- [ ] 빌드 에러 없음

### 5.2 Quality Criteria

- [ ] Zero lint errors
- [ ] 빌드 성공
- [ ] 기존 `/lectures/[id]` 페이지에 영향 없음
- [ ] sessionStorage 데이터 정리 (미리보기 창 닫기 시)

---

## 6. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| sessionStorage 데이터 크기 제한 (5MB) | Low | Low | courseDetail HTML이 대부분이며 5MB 미만 |
| LectureDetailContent에 필수 필드 누락 시 에러 | Medium | Medium | buildPreviewData()에서 모든 필드에 기본값 보장 |
| 팝업 차단으로 새 창 열리지 않음 | Medium | Low | 사용자 클릭 이벤트 핸들러 내에서 window.open 호출 (브라우저 허용) |

---

## 7. Architecture Considerations

### 7.1 Project Level

| Level | Selected |
|-------|:--------:|
| **Starter** | ✅ |

### 7.2 Key Architectural Decisions

| Decision | Selected | Rationale |
|----------|----------|-----------|
| Framework | Next.js (App Router) | 기존 프로젝트 유지 |
| Data passing | sessionStorage | 탭 격리, 대용량 지원 |
| Rendering | Client Component | sessionStorage 접근 필요 |
| Component reuse | LectureDetailContent 재활용 | 일관된 UI, 중복 코드 방지 |

---

## 8. Implementation Order

1. 업로드 페이지에 `buildPreviewData()` 함수 추가 (폼 → LectureDetail 변환)
2. 헤더에 "미리보기" 버튼 추가 + 클릭 핸들러 (sessionStorage 저장 + window.open)
3. `/lectures/preview/page.tsx` 생성 (sessionStorage 읽기 + LectureDetailContent 렌더링)
4. 미리보기 모드 배너 추가
5. 엣지케이스 처리 (빈 필드 기본값, sessionStorage 없을 때 안내)

---

## 9. Next Steps

1. [ ] Design 문서 작성 (`lecture-preview.design.md`)
2. [ ] 구현
3. [ ] 테스트 및 Gap 분석

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-29 | Initial draft | AI |
