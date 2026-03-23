# 도서 미리보기 기능 Planning Document

> **Summary**: 도서 목록에서 책 내용을 미리 볼 수 있는 뷰어 모달 기능 추가
>
> **Project**: BIZSCHOOL
> **Author**: AI
> **Date**: 2026-03-22
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

도서 목록(`/books`) 페이지에서 구매 결정을 돕기 위해 책의 목차와 샘플 페이지를 미리 볼 수 있는 기능을 제공한다.

### 1.2 Background

- 현재 도서 목록은 제목, 저자, 가격, 간단한 설명만 표시
- 사용자가 책 내용을 확인하려면 외부 사이트를 방문해야 함
- 교보문고 등 주요 온라인 서점에서 제공하는 "미리보기" 기능을 참고하여, 구매 전환율을 높이고 사용자 경험을 개선

### 1.3 References

- UI 참고: [교보문고 도서 상세](https://product.kyobobook.co.kr/detail/S000218967763)
- 교보문고 미리보기 UX 특징:
  - 도서 커버 영역 하단에 "미리보기" 버튼 배치
  - 클릭 시 오버레이 모달로 뷰어 표시
  - 목차 → 본문 샘플 페이지 순서로 구성
  - 페이지 넘김 (이전/다음), 페이지 번호 표시
  - 확대/축소 기능
  - 전체화면 지원
  - 닫기(X) 버튼

---

## 2. Scope

### 2.1 In Scope

- [ ] 도서 목록 카드에 "미리보기" 버튼 추가
- [ ] 미리보기 모달 뷰어 컴포넌트 개발
- [ ] 목차(TOC) 탭 표시
- [ ] 샘플 페이지 뷰어 (페이지 넘김)
- [ ] 확대/축소 기능
- [ ] 전체화면 모드
- [ ] 모바일 반응형 대응
- [ ] Book 타입에 미리보기 관련 필드 추가
- [ ] Mock 데이터 생성 (일부 도서에 미리보기 데이터 추가)

### 2.2 Out of Scope

- 실제 도서 PDF/이미지 파일 업로드 (Mock 데이터 사용)
- DRM(디지털 저작권 관리) 처리
- 서버 API 연동 (프론트엔드 Mock 데이터만)
- 도서 상세 페이지 (`/books/[id]`) 신규 생성

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | BookListCard에 "미리보기" 버튼 표시 (미리보기 데이터가 있는 도서만) | High | Pending |
| FR-02 | 미리보기 버튼 클릭 시 모달 뷰어 오픈 | High | Pending |
| FR-03 | 뷰어 상단에 도서 제목/저자 표시 | Medium | Pending |
| FR-04 | 목차(TOC) 탭: 챕터 목록 표시 | High | Pending |
| FR-05 | 미리보기 탭: 샘플 페이지를 이미지로 표시 | High | Pending |
| FR-06 | 페이지 넘김 (이전/다음 버튼 + 키보드 화살표) | High | Pending |
| FR-07 | 현재 페이지 / 전체 페이지 수 표시 | Medium | Pending |
| FR-08 | 확대/축대 컨트롤 (줌 인/아웃, 100% 리셋) | Medium | Pending |
| FR-09 | 전체화면 토글 | Low | Pending |
| FR-10 | ESC 키 또는 X 버튼으로 모달 닫기 | High | Pending |
| FR-11 | 모달 오픈 시 body 스크롤 잠금 | High | Pending |
| FR-12 | 모바일: 스와이프로 페이지 넘김 | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | 모달 오픈 시 300ms 이내 표시 | 체감 속도 확인 |
| Accessibility | 키보드 네비게이션 지원 (ESC, 좌/우 화살표) | 수동 테스트 |
| Responsive | 모바일(360px) ~ 데스크톱(1200px) 대응 | 브라우저 리사이즈 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] 미리보기 데이터가 있는 도서에 "미리보기" 버튼 표시
- [ ] 버튼 클릭 시 모달 뷰어 정상 오픈/클로즈
- [ ] 목차 탭과 미리보기 탭 전환 가능
- [ ] 페이지 넘김 (버튼 + 키보드) 동작
- [ ] 확대/축소 동작
- [ ] 모바일 반응형 정상 표시
- [ ] 빌드 에러 없음

### 4.2 Quality Criteria

- [ ] Zero lint errors
- [ ] 빌드 성공
- [ ] 기존 도서 목록 기능에 영향 없음

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 모달 내 이미지 렌더링 성능 | Medium | Low | 이미지 placeholder/gradient로 Mock, lazy loading |
| 모바일 스와이프 제스처 충돌 | Low | Medium | touch event 영역 제한, stopPropagation |
| 모달 z-index 충돌 (Header 등) | Low | Medium | z-index 계층 확인 후 적절한 값 설정 |

---

## 6. Architecture Considerations

### 6.1 Project Level

| Level | Selected |
|-------|:--------:|
| **Starter** | ✅ |

현재 프로젝트가 Starter 레벨 (components/, data/, types/ 구조)이므로 동일하게 유지.

### 6.2 Key Architectural Decisions

| Decision | Selected | Rationale |
|----------|----------|-----------|
| Framework | Next.js (App Router) | 기존 프로젝트 유지 |
| Styling | Tailwind CSS + CSS Variables | 기존 패턴 준수 |
| State | React useState/useCallback | 모달 내부 상태만 관리, 간단한 로컬 상태로 충분 |
| Icons | lucide-react | 기존 프로젝트에서 사용 중 |

### 6.3 Component Structure

```
src/
├── components/books/
│   ├── BookListCard.tsx          ← 미리보기 버튼 추가
│   ├── BookPreviewModal.tsx      ← NEW: 미리보기 모달 (메인 컨테이너)
│   ├── BookPreviewToc.tsx        ← NEW: 목차 탭 컴포넌트
│   └── BookPreviewViewer.tsx     ← NEW: 페이지 뷰어 컴포넌트
├── types/
│   └── index.ts                  ← BookPreview 관련 타입 추가
└── data/
    └── books.ts                  ← 미리보기 Mock 데이터 추가
```

---

## 7. Convention Prerequisites

### 7.1 Existing Conventions (준수)

- 컴포넌트: PascalCase, `export default function`
- 스타일: Tailwind + CSS Variables (`var(--color-*)`)
- 아이콘: lucide-react
- 타입: `@/types`에서 export
- 데이터: `@/data`에서 Mock 데이터 관리

### 7.2 New Conventions for This Feature

| Category | Convention |
|----------|-----------|
| 모달 파일명 | `{Feature}Modal.tsx` 패턴 |
| 서브 컴포넌트 | `{Feature}{SubComponent}.tsx` 패턴 |
| 미리보기 데이터 | `Book` 타입에 optional `preview` 필드 추가 |

---

## 8. UI Reference (교보문고 스타일)

### 8.1 미리보기 버튼

- 도서 커버 영역 하단 또는 버튼 그룹에 배치
- 아이콘: `Eye` (lucide-react)
- 텍스트: "미리보기"
- 미리보기 데이터가 없는 도서에는 버튼 미표시

### 8.2 미리보기 모달 레이아웃

```
┌─────────────────────────────────────────────────────┐
│  [X] 도서명 - 저자                     [전체화면]   │
├─────────────────────────────────────────────────────┤
│  [ 목차 ]  [ 미리보기 ]                ← 탭 전환    │
├─────────────────────────────────────────────────────┤
│                                                     │
│          ┌─────────────────────┐                    │
│    [◀]   │                     │   [▶]              │
│          │   샘플 페이지 이미지  │                    │
│          │   (또는 목차 내용)    │                    │
│          │                     │                    │
│          └─────────────────────┘                    │
│                                                     │
├─────────────────────────────────────────────────────┤
│  [-] [100%] [+]        3 / 15 페이지                │
└─────────────────────────────────────────────────────┘
```

### 8.3 목차 탭

```
┌─────────────────────────────────────┐
│  목차                               │
├─────────────────────────────────────┤
│  제1장  경영 전략의 기초       ... 3 │
│  제2장  시장 분석              ... 25│
│  제3장  마케팅 전략            ... 47│
│  제4장  재무 관리              ... 89│
│  ...                                │
└─────────────────────────────────────┘
```

---

## 9. Next Steps

1. [ ] Design 문서 작성 (`book-preview.design.md`)
2. [ ] 타입 정의 및 Mock 데이터 생성
3. [ ] 컴포넌트 구현
4. [ ] 테스트 및 Gap 분석

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-22 | Initial draft | AI |
