# notice-page Planning Document

> **Summary**: 공지사항 게시판 페이지(`/notice`) 신규 생성 - 테이블 목록 + 검색 + 페이지네이션
>
> **Project**: BIZSCHOOL
> **Version**: 0.1
> **Author**: allen
> **Date**: 2026-03-22
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

고객지원 영역의 공지사항 페이지(`/notice`)를 신규 생성하여, 서비스 관련 공지/업데이트/이벤트 등을 게시판 형태로 제공한다.

### 1.2 Background

- Footer 고객지원 메뉴에 `/notice` 링크가 이미 존재하나 실제 페이지가 없음
- 더존비즈스쿨 원본 사이트(`dzbizschool.net`)의 공지사항 페이지를 참고하되, 프로젝트의 기존 게시판 패턴(education 테이블, community 리스트, InquiryList 테이블+카드)에 맞춰 제작
- 일반적인 한국 교육기관 공지사항: 번호/제목/작성자/작성일/조회수 테이블, 중요 공지 상단 고정, 검색, 페이지네이션

### 1.3 Related Documents

- Footer 링크: `src/components/layout/Footer.tsx` (line 35: `/notice`)
- 유사 패턴 참고: `src/app/education/page.tsx` (테이블 레이아웃 + Hero)
- 유사 패턴 참고: `src/app/community/page.tsx` (게시판 목록 + 페이지네이션)
- 페이지네이션 참고: `src/components/community/CommunityPagination.tsx`
- 타입 정의: `src/types/index.ts`

---

## 2. Scope

### 2.1 In Scope

- [x] `/notice` 라우트 페이지 생성
- [x] Hero 섹션 (공지사항 타이틀 + 설명)
- [x] 공지사항 테이블 목록 (데스크톱: 테이블 / 모바일: 카드)
- [x] 중요 공지 상단 고정 (배지 표시)
- [x] 검색 기능 (제목 키워드 검색)
- [x] 페이지네이션
- [x] 공지사항 상세 페이지 (`/notice/[id]`)
- [x] Mock 데이터 생성 (`src/data/notice.ts`)
- [x] 타입 정의 추가 (`src/types/index.ts`)

### 2.2 Out of Scope

- 공지사항 백엔드 API 연동 (정적 Mock 데이터 사용)
- 관리자 글 작성/수정/삭제 기능
- 파일 첨부 다운로드
- 카테고리 필터 (필요 시 추후 확장)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | `/notice` 페이지: Hero + 검색 + 테이블 목록 + 페이지네이션 | High | Pending |
| FR-02 | 테이블 컬럼: 번호, 제목, 작성자, 작성일, 조회수 | High | Pending |
| FR-03 | 중요 공지(`isImportant: true`)는 목록 상단 고정 + "중요" 배지 표시 | High | Pending |
| FR-04 | 검색: 제목 키워드로 필터링 (URL param: `?search=`) | Medium | Pending |
| FR-05 | 페이지네이션: 10개씩, URL param: `?page=N` | High | Pending |
| FR-06 | 상세 페이지 `/notice/[id]`: 제목/작성자/작성일/조회수/본문 표시 | High | Pending |
| FR-07 | 상세 페이지에서 목록으로 돌아가기 버튼 | Medium | Pending |
| FR-08 | 상세 페이지에서 이전글/다음글 네비게이션 | Low | Pending |
| FR-09 | 반응형: 데스크톱(테이블) / 모바일(카드) 듀얼 레이아웃 | High | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| SEO | 메타데이터: "공지사항 - BIZSCHOOL" | title/description 검증 |
| 반응형 | md 브레이크포인트 기준 테이블/카드 전환 | 시각 검증 |
| 접근성 | 테이블 thead 적절한 scope, 페이지네이션 aria-label | 코드 검증 |

---

## 4. Page Structure

### 4.1 목록 페이지 (`/notice`)

```
┌─────────────────────────────────────────────┐
│  Hero Section                               │
│  - h1: "공지사항"                             │
│  - subtitle: 비즈스쿨의 새로운 소식을 ...      │
├─────────────────────────────────────────────┤
│  검색 영역                                    │
│  - 검색 입력창 + 검색 버튼                      │
│  - 총 N개의 공지사항                           │
├─────────────────────────────────────────────┤
│  테이블 (Desktop)                             │
│  ┌──────┬──────────────┬──────┬──────┬─────┐ │
│  │ 번호 │     제목      │작성자│ 작성일│조회수│ │
│  ├──────┼──────────────┼──────┼──────┼─────┤ │
│  │ 중요 │ [중요] 공지1  │ 관리자│03.20│ 152 │ │
│  │ 중요 │ [중요] 공지2  │ 관리자│03.18│ 98  │ │
│  │  15  │ 일반 공지3    │ 관리자│03.15│ 45  │ │
│  │  14  │ 일반 공지4    │ 관리자│03.10│ 32  │ │
│  │ ...  │   ...        │ ...  │ ... │ ... │ │
│  └──────┴──────────────┴──────┴──────┴─────┘ │
├─────────────────────────────────────────────┤
│  카드 목록 (Mobile)                           │
│  ┌────────────────────────────────────────┐  │
│  │ [중요] 공지 제목                        │  │
│  │ 관리자 · 2026.03.20 · 조회 152        │  │
│  └────────────────────────────────────────┘  │
├─────────────────────────────────────────────┤
│  페이지네이션                                 │
│  < 1 [2] 3 4 5 >                            │
└─────────────────────────────────────────────┘
```

### 4.2 상세 페이지 (`/notice/[id]`)

```
┌─────────────────────────────────────────────┐
│  컨테이너 (max-w-[1200px])                    │
├─────────────────────────────────────────────┤
│  상단 정보                                    │
│  - [중요] 배지 (해당 시)                       │
│  - 제목 (h1)                                 │
│  - 작성자 · 작성일 · 조회수                    │
├─────────────────────────────────────────────┤
│  본문 영역                                    │
│  - HTML 본문 콘텐츠                           │
├─────────────────────────────────────────────┤
│  이전글 / 다음글 네비게이션                     │
├─────────────────────────────────────────────┤
│  [목록으로] 버튼                               │
└─────────────────────────────────────────────┘
```

---

## 5. Data Structure

### 5.1 Type Definition (추가: `src/types/index.ts`)

```typescript
// 공지사항
export interface Notice {
  id: number;
  title: string;
  content: string;        // HTML 본문
  author: string;
  createdAt: string;      // "2026-03-20" 형식
  views: number;
  isImportant: boolean;   // 중요 공지 여부 (상단 고정)
}
```

### 5.2 Mock Data (`src/data/notice.ts`)

```typescript
export const NOTICES_PER_PAGE = 10;
export const notices: Notice[] = [
  // 중요 공지 2~3건 + 일반 공지 15~20건
];
```

---

## 6. Implementation Plan

### 6.1 File Changes

| Action | File | Description |
|--------|------|-------------|
| Edit | `src/types/index.ts` | `Notice` 타입 추가 |
| Create | `src/data/notice.ts` | Mock 데이터 + 상수 |
| Create | `src/app/notice/page.tsx` | 목록 페이지 (Server Component) |
| Create | `src/app/notice/[id]/page.tsx` | 상세 페이지 (Server Component) |
| Create | `src/components/notice/NoticeTable.tsx` | 테이블+카드 듀얼 레이아웃 (Client) |
| Create | `src/components/notice/NoticeSearch.tsx` | 검색 입력 컴포넌트 (Client) |
| Create | `src/components/notice/NoticePagination.tsx` | 페이지네이션 (Client) |

### 6.2 Reused Patterns

- Hero 섹션: `/education` 페이지 패턴 재사용
- 테이블 레이아웃: `CourseTable` + `InquiryList` 패턴 (desktop table + mobile card)
- 페이지네이션: `CommunityPagination` 동일 로직 (max 5페이지, 슬라이딩 윈도우)
- URL params: Next.js 15 async `searchParams` 패턴
- CSS 변수: `var(--color-primary)`, `var(--color-muted)`, `var(--color-border)` 등 기존 토큰 사용

---

## 7. Success Criteria

### 7.1 Definition of Done

- [ ] `/notice` 페이지에서 공지사항 목록 테이블 표시
- [ ] 중요 공지가 상단에 고정되고 "중요" 배지 표시
- [ ] 검색 시 제목 키워드로 필터링 동작
- [ ] 페이지네이션 정상 동작 (10개씩)
- [ ] `/notice/[id]` 상세 페이지에서 본문 표시
- [ ] 상세 페이지에서 목록으로 돌아가기 동작
- [ ] 데스크톱/모바일 반응형 레이아웃 정상
- [ ] Footer "공지사항" 링크 → `/notice` 연결 확인
- [ ] 빌드 에러 없음

---

## 8. Architecture Considerations

### 8.1 Project Level Selection

| Level | Characteristics | Selected |
|-------|-----------------|:--------:|
| **Starter** | 정적 Mock 데이터, 백엔드 불필요 | **O** |

### 8.2 Key Architectural Decisions

| Decision | Selected | Rationale |
|----------|----------|-----------|
| 라우트 | `/notice`, `/notice/[id]` | 목록+상세 분리, 기존 URL 패턴 일관 |
| 컴포넌트 구조 | page.tsx(Server) + 클라이언트 컴포넌트 분리 | 검색/페이지네이션은 URL params 기반 Client |
| 데이터 | `src/data/notice.ts` Mock | 기존 community, education 패턴과 동일 |
| 중요 공지 처리 | `isImportant` flag + 정렬 시 상단 배치 | 별도 API 없이 프론트엔드 정렬 |

---

## 9. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Mock 데이터 부족으로 페이지네이션 테스트 어려움 | Low | Medium | 최소 20건 이상 Mock 데이터 생성 |
| 상세 페이지 본문 HTML 렌더링 보안 | Medium | Low | dangerouslySetInnerHTML 사용 시 sanitize 고려 |

---

## 10. Next Steps

1. [ ] Design 문서 작성 (`notice-page.design.md`)
2. [ ] 구현 시작
3. [ ] Gap Analysis

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-22 | Initial draft | allen |
