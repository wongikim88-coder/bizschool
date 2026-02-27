# book-search-reset Planning Document

> **Summary**: 도서 페이지 검색 후 기본 화면으로 자연스럽게 복귀하는 UX 개선
>
> **Project**: BIZSCHOOL
> **Version**: 1.0
> **Author**: Claude
> **Date**: 2026-02-27
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

도서 페이지에서 키워드 검색 후, 검색을 해제하고 전체 도서 목록(기본 화면)으로 돌아가는 자연스러운 UX를 제공한다.

### 1.2 Background

**현재 문제점:**
- 도서 페이지(`/books`)에서 "에릭"으로 검색하면 URL이 `/books?search=에릭&page=1`로 변경됨
- 검색 결과 상태: `전체(1) / 총 1권 · "에릭" 검색 결과`
- **기본 화면으로 돌아가려면 페이지를 나갔다 다시 들어와야 함** (다른 메뉴 클릭 → 다시 도서 클릭)
- 검색어 해제 UI가 전혀 없어 사용자 경험이 단절됨

**현재 코드 상의 원인:**
1. `SearchBar` (layout): X 버튼이 input value만 초기화, URL `?search=` 파라미터는 유지
2. `CategoryFilter`: 카테고리 전환 시 기존 `searchParams`를 그대로 보존 (search 포함)
3. 결과 영역: "에릭" 검색 결과 텍스트만 표시, 해제 수단 없음

### 1.3 Related Documents

- Archived: `docs/archive/2026-02/book-search-tabs/` (검색+탭 기능 구현)

---

## 2. Scope

### 2.1 In Scope

- [x] 검색 활성 상태에서 검색어 해제(초기화) UI 추가
- [x] SearchBar와 URL 검색 파라미터 양방향 동기화
- [x] "전체" 카테고리 탭 클릭 시 검색 초기화 동작

### 2.2 Out of Scope

- 검색 자동완성 / 추천 기능
- 검색 히스토리 저장
- 검색 결과 정렬 옵션

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 검색 결과 영역에 검색어 칩(chip) + X 버튼 표시 | High | Pending |
| FR-02 | 검색어 칩 X 클릭 시 `?search=` 파라미터 제거, 기본 화면 복귀 | High | Pending |
| FR-03 | SearchBar에 현재 URL의 검색어 반영 (양방향 동기화) | High | Pending |
| FR-04 | SearchBar X 버튼 클릭 시 URL 파라미터도 함께 제거 | High | Pending |
| FR-05 | "전체" 카테고리 탭 클릭 시 검색어도 함께 초기화 | Medium | Pending |
| FR-06 | 검색어 칩에 현재 검색어 텍스트 명확히 표시 | Low | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | 검색 초기화 시 즉시 반영 (router.push) | 수동 확인 |
| Accessibility | 칩 X 버튼에 aria-label 제공 | 코드 리뷰 |
| UX | 페이지 이동 없이 검색 해제 가능 | 수동 테스트 |

---

## 4. UX Solution: 3가지 초기화 경로

사용자에게 검색 해제를 위한 **3가지 자연스러운 경로**를 제공:

### 경로 1: 검색어 칩(Chip) — 가장 직관적

```
현재:  총 1권 · "에릭" 검색 결과

개선:  총 1권 · [ 에릭  ✕ ] 검색 결과
                  ↑ 클릭하면 검색 해제
```

- 검색 활성 상태에서만 표시
- 칩 스타일: `rounded-full`, `bg-primary/10`, `border-primary`
- X 클릭 → `/books` (파라미터 없는 기본 URL)로 이동

### 경로 2: SearchBar 동기화 — 자연스러운 일관성

```
현재:  SearchBar 빈 상태 (검색했는데 입력창은 비어있음)

개선:  SearchBar에 "에릭" 표시 + X 클릭 시 URL도 초기화
```

- `/books?search=에릭` 접속 시 SearchBar input에 "에릭" 자동 반영
- SearchBar X 버튼 클릭 → input 초기화 + URL `?search=` 제거
- 빈 상태에서 Enter → 검색어 없으므로 `?search=` 제거 (이미 구현됨)

### 경로 3: "전체" 탭 클릭 — 멘탈 모델 일치

```
현재:  "전체" 탭 클릭 → 카테고리만 리셋, 검색어 유지

개선:  "전체" 탭 클릭 → 카테고리 + 검색어 모두 리셋
```

- "전체"는 "모든 도서 보기"를 의미 → 검색어도 함께 초기화가 자연스러움
- 다른 카테고리 탭은 검색어를 유지 (카테고리 내 검색 결과 확인용)

---

## 5. Success Criteria

### 5.1 Definition of Done

- [x] 검색 결과 영역에 제거 가능한 검색어 칩 표시
- [x] SearchBar가 URL 검색어와 동기화
- [x] "전체" 탭 클릭 시 검색어 초기화
- [x] 3가지 경로 모두로 기본 화면 복귀 가능

### 5.2 Quality Criteria

- [x] Tailwind CSS v4 var() 규칙 준수
- [x] 기존 검색 동작 유지 (regression 없음)
- [x] aria-label 등 접근성 확보

---

## 6. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| SearchBar 동기화 시 무한 리렌더 | Medium | Low | useEffect 의존성 정확히 관리 |
| "전체" 탭 동작 변경으로 기존 UX 혼란 | Low | Low | "전체"만 검색 초기화, 다른 탭은 유지 |

---

## 7. Architecture Considerations

### 7.1 Project Level

| Level | Selected |
|-------|:--------:|
| **Starter** | ✅ |

### 7.2 수정 대상 파일 (3개)

| File | Changes |
|------|---------|
| `src/app/books/page.tsx` | 검색어 칩 UI 추가 (결과 카운트 영역) |
| `src/components/layout/SearchBar.tsx` | URL search 파라미터 동기화 + X 클릭 시 URL 초기화 |
| `src/components/books/CategoryFilter.tsx` | "전체" 탭 클릭 시 search 파라미터 제거 |

---

## 8. Next Steps

1. [ ] Write design document (`book-search-reset.design.md`)
2. [ ] Implementation
3. [ ] Visual verification on dev server

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-27 | Initial draft | Claude |
