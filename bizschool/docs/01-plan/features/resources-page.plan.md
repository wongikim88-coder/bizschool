# resources-page Planning Document

> **Summary**: 근로자주도훈련 신청서, 교재 정오표 등 각종 서식·자료를 다운받을 수 있는 자료실 페이지(`/resources`) 구현. 푸터 고객지원 영역에 "자료실" 링크 추가.
>
> **Project**: BIZSCHOOL
> **Version**: 0.3
> **Author**: allen
> **Date**: 2026-03-22
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

근로자주도훈련 신청서, 교재 정오표, 강의교안 등 비즈스쿨에서 제공하는 각종 서식과 자료를 한 곳에서 검색하고 다운로드할 수 있는 "자료실" 페이지를 제공한다.

### 1.2 Background

현재 BIZSCHOOL은 세무회계, 재산제세, 공개교육, 근로자주도훈련 등 다양한 강의를 제공하고 있으나, 근로자주도훈련 신청서·교재 정오표 등 수강에 필요한 서류와 자료를 다운로드할 수 있는 전용 페이지가 없다. 수강생이 필요한 서식·자료를 한 곳에서 쉽게 찾고 다운로드할 수 있는 통합 자료실이 필요하다.

### 1.3 Related Documents

- 기존 공지사항 패턴: `src/app/notice/page.tsx`, `src/components/notice/NoticeTable.tsx`
- 공개교육 카테고리 탭: `src/components/education/CourseTable.tsx`
- 수료증 다운로드 패턴: `src/components/mypage/my-learning/certificate/CertificateRow.tsx`
- 타입 정의: `src/types/index.ts`
- 데이터 파일 패턴: `src/data/notice.ts`

---

## 2. Scope

### 2.1 In Scope

- [x] `/resources` 라우트 페이지 생성
- [x] Hero 섹션 (기존 blue gradient 패턴)
- [x] 카테고리 필터 탭 (전체 / 신청서·양식 / 정오표 / 교육자료 / 참고자료)
- [x] 검색 기능 (제목 키워드 검색)
- [x] 자료 목록 테이블 (데스크톱) / 카드 (모바일) — 공지사항 패턴 재활용
- [x] 파일 다운로드 버튼 (lucide Download 아이콘)
- [x] 페이지네이션
- [x] 헤더 네비게이션 추가 ("자료실" 메뉴)
- [x] 푸터 고객지원 그룹에 "자료실" 링크 추가

### 2.2 Out of Scope

- 자료 업로드/관리 어드민 기능 (백엔드 연동 없음, 정적 Mock 데이터)
- 자료별 접근 권한 제어 (수강생 전용 등) — 현재 인증 시스템 미구현
- 파일 미리보기(PDF Viewer 등)
- 자료 조회수 카운트 (정적 데이터이므로 의미 없음)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | `/resources` 페이지: Hero + 카테고리 탭 + 검색 + 테이블 + 페이지네이션 | High | Pending |
| FR-02 | 카테고리 필터: "전체", "신청서·양식", "정오표", "교육자료", "참고자료" 탭 클릭 시 필터링 | High | Pending |
| FR-03 | 키워드 검색: 자료 제목에서 검색, 결과 건수 표시 | Medium | Pending |
| FR-04 | 테이블 컬럼: 번호, 카테고리, 제목, 파일형식, 파일크기, 등록일, 다운로드 | High | Pending |
| FR-05 | 다운로드 버튼: `<a href download>` 또는 `window.open()` — Download 아이콘 사용 | High | Pending |
| FR-06 | 모바일 카드 뷰: 제목 + 카테고리 뱃지 + 파일정보 + 다운로드 버튼 | High | Pending |
| FR-07 | 페이지네이션: 10건/페이지, 공지사항과 동일한 페이지네이션 UI | Medium | Pending |
| FR-08 | 헤더 네비게이션에 "자료실" 메뉴 추가 | Medium | Pending |
| FR-09 | 푸터 "고객지원" 그룹에 "자료실" 링크 추가 | Low | Pending |
| FR-10 | "NEW" 뱃지: 등록일 7일 이내 자료에 표시 | Low | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| SEO | 메타데이터: title="자료실 \| BIZSCHOOL", description 포함 | 빌드 후 확인 |
| Responsive | md 브레이크포인트 기준 테이블↔카드 전환 | 화면 리사이즈 검증 |
| Consistency | 기존 공지사항 페이지와 동일한 UI 패턴 사용 | 시각 비교 |

---

## 4. Page Structure

```
/resources 페이지 구성:

┌─────────────────────────────────────────────────────────┐
│  Hero Section (blue gradient)                           │
│  - h1: "자료실"                                         │
│  - subtitle: "신청서, 정오표, 교육자료 등                 │
│    필요한 자료를 다운로드하세요."                           │
├─────────────────────────────────────────────────────────┤
│  Content (max-w-[1200px])                               │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Category Tabs                                    │    │
│  │ [전체] [신청서·양식] [정오표] [교육자료] [참고자료]  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌────────────────────────────────────────┐             │
│  │ 🔍 검색어 입력...          총 N건      │             │
│  └────────────────────────────────────────┘             │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Desktop Table                                    │    │
│  │ ┌────┬──────┬──────────┬────┬────┬─────┬─────┐  │    │
│  │ │번호│카테고리│   제목   │형식│크기│등록일│ ↓  │  │    │
│  │ ├────┼──────┼──────────┼────┼────┼─────┼─────┤  │    │
│  │ │ 1  │교안  │ 세무회계…│PDF │2MB │03.20│ ⬇️  │  │    │
│  │ │ 2  │서식  │ 부가세…  │XLS │1MB │03.18│ ⬇️  │  │    │
│  │ │ ...│ ...  │  ...     │... │... │ ... │ ... │  │    │
│  │ └────┴──────┴──────────┴────┴────┴─────┴─────┘  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Mobile Cards (md:hidden)                         │    │
│  │ ┌───────────────────────────────────────────┐   │    │
│  │ │ [신청서·양식]  NEW                         │   │    │
│  │ │ 근로자주도훈련 수강신청서                    │   │    │
│  │ │ PDF · 1.2 MB · 2026.03.20      [⬇️ 다운]  │   │    │
│  │ └───────────────────────────────────────────┘   │    │
│  │ ┌───────────────────────────────────────────┐   │    │
│  │ │ [정오표]                                   │   │    │
│  │ │ 2026 세무회계 교재 정오표                    │   │    │
│  │ │ PDF · 156 KB · 2026.03.15      [⬇️ 다운]  │   │    │
│  │ └───────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │          ◀ 1  [2]  3  4  5 ▶                    │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## 5. Data Model

### 5.1 Resource Type

```typescript
// src/types/index.ts에 추가
export type ResourceCategory = "신청서·양식" | "정오표" | "교육자료" | "참고자료";

export type ResourceFileType = "PDF" | "XLSX" | "HWP" | "ZIP" | "PPTX";

export interface Resource {
  id: number;
  title: string;
  category: ResourceCategory;
  description?: string;
  fileType: ResourceFileType;
  fileSize: string;       // "2.3 MB", "156 KB"
  fileName: string;       // 다운로드 파일명: "세무회계실무_교안.pdf"
  fileUrl: string;        // "/files/tax-accounting.pdf" 또는 외부 URL
  createdAt: string;      // "2026-03-20"
  relatedCourseTitle?: string;  // 연관 강의명 (선택)
}
```

### 5.2 Filter Types

```typescript
export type ResourceCategoryFilter = "전체" | ResourceCategory;
```

### 5.3 Mock Data

`src/data/resources.ts`에 약 15~20건의 Mock 데이터를 생성한다.

카테고리별 분포:
- 신청서·양식: 5건 (근로자주도훈련 신청서, 수강신청서, 환급신청서, 위탁훈련계약서 등)
- 정오표: 4건 (세무회계 교재 정오표, 재산제세 교재 정오표, 법인세 교재 정오표 등)
- 교육자료: 5건 (세무회계 강의교안, 재산제세 강의교안, 전산세무 실습파일 등)
- 참고자료: 4건 (세법 개정 요약, 실무 가이드, 자주 묻는 세무 Q&A 등)

---

## 6. Navigation Changes

### 6.1 Header Menu

```
변경 전:
공개교육 | 근로자 주도훈련 | 강의 | 도서 | 전문가상담 | 커뮤니티

변경 후:
공개교육 | 근로자 주도훈련 | 강의 | 도서 | 자료실 | 전문가상담 | 커뮤니티
```

"도서"와 "전문가상담" 사이에 "자료실" 추가.

### 6.2 Footer Menu

```
변경 전:
고객지원
├── FAQ
├── 1:1 문의
└── 공지사항

변경 후:
고객지원
├── FAQ
├── 1:1 문의
├── 공지사항
└── 자료실
```

---

## 7. Implementation Plan

### 7.1 File Changes

| Action | File | Description |
|--------|------|-------------|
| Create | `src/types/index.ts` | Resource, ResourceCategory 등 타입 추가 |
| Create | `src/data/resources.ts` | Mock 데이터 + 정렬/필터 헬퍼 함수 |
| Create | `src/app/resources/page.tsx` | 자료실 메인 페이지 (Server Component) |
| Create | `src/components/resources/ResourceCategoryTabs.tsx` | 카테고리 필터 탭 (Client) |
| Create | `src/components/resources/ResourceTable.tsx` | 데스크톱 테이블 + 모바일 카드 (Client) |
| Create | `src/components/resources/ResourceSearch.tsx` | 검색 입력 + 결과 건수 (Client) |
| Create | `src/components/resources/ResourcePagination.tsx` | 페이지네이션 (Client) |
| Edit | `src/components/layout/Header.tsx` | menuItems에 "자료실" 추가 |
| Edit | `src/components/layout/Footer.tsx` | 고객지원 링크에 "자료실" 추가 |
| Edit | `src/components/layout/LayoutContent.tsx` | `/resources` searchBar 숨김 처리 |

### 7.2 Implementation Order

1. 타입 정의 (`types/index.ts`)
2. Mock 데이터 + 헬퍼 함수 (`data/resources.ts`)
3. 페이지 컴포넌트 (`app/resources/page.tsx`)
4. UI 컴포넌트 (Table, Tabs, Search, Pagination)
5. 네비게이션 변경 (Header, Footer, LayoutContent)

### 7.3 Key Design Decisions

| Decision | Selected | Rationale |
|----------|----------|-----------|
| URL 경로 | `/resources` | 영문, 기존 URL 패턴과 일관 |
| 페이지 패턴 | Hero + Content (Pattern A) | 공지사항, 공개교육과 동일 |
| 상태 관리 | URL searchParams (category, search, page) | Server Component + 브라우저 히스토리 지원 |
| 다운로드 방식 | `<a href download>` | 단순, 별도 JS 불필요 |
| 페이지당 건수 | 10건 | 공지사항과 동일 |

---

## 8. UI Component Details

### 8.1 카테고리 탭 (ResourceCategoryTabs)

- 수평 탭 바, 기존 education MonthSelector 스타일 참고
- 활성 탭: `bg-[var(--color-primary)] text-white rounded-lg`
- 비활성 탭: `text-[var(--color-muted)] hover:text-[var(--color-body)]`
- 탭 클릭 시 URL searchParams 업데이트 (category=강의교안)

### 8.2 테이블 (ResourceTable)

**Desktop (md 이상):**

| 컬럼 | 너비 | 정렬 |
|------|------|------|
| 번호 | 8% | 중앙 |
| 카테고리 | 12% | 중앙 |
| 제목 | 38% | 좌측 |
| 파일형식 | 10% | 중앙 |
| 파일크기 | 10% | 중앙 |
| 등록일 | 12% | 중앙 |
| 다운로드 | 10% | 중앙 |

- 카테고리: 컬러 뱃지 (신청서·양식=blue, 정오표=orange, 교육자료=green, 참고자료=gray)
- 다운로드: Download 아이콘 버튼 (lucide-react)
- NEW 뱃지: 7일 이내 등록 자료에 제목 옆 빨간 뱃지

**Mobile (md 미만):**

- 카드 형태: rounded-xl border, p-4
- 상단: 카테고리 뱃지 + NEW 뱃지
- 중간: 제목 (font-medium)
- 하단: 파일 정보 (PDF · 2.3 MB · 2026.03.20) + 다운로드 버튼

### 8.3 검색 (ResourceSearch)

- 공지사항 검색과 동일 패턴
- 좌측 Search 아이콘 + 입력 필드
- 우측 "총 N건" 텍스트

### 8.4 페이지네이션 (ResourcePagination)

- 공지사항 페이지네이션 컴포넌트 패턴 그대로 재현
- ChevronLeft/Right + 원형 숫자 버튼

---

## 9. Success Criteria

### 9.1 Definition of Done

- [ ] `/resources` 페이지에서 자료 목록이 정상 표시됨
- [ ] 카테고리 탭 클릭 시 해당 카테고리 자료만 필터링됨
- [ ] 검색어 입력 시 제목 기준으로 필터링됨
- [ ] 다운로드 버튼 클릭 시 파일 다운로드 동작 (Mock 환경에서는 # 또는 alert)
- [ ] 모바일에서 카드 뷰로 정상 전환됨
- [ ] 페이지네이션이 정상 동작함
- [ ] 헤더/푸터에 "자료실" 링크가 추가됨
- [ ] 빌드 에러 없음

---

## 10. Architecture Considerations

### 10.1 Project Level Selection

| Level | Characteristics | Selected |
|-------|-----------------|:--------:|
| **Starter** | 정적 페이지, Mock 데이터, 백엔드 불필요 | **O** |

### 10.2 URL SearchParams 설계

```
/resources                           → 전체, 1페이지
/resources?category=신청서·양식        → 신청서·양식 필터
/resources?search=세무                → 검색
/resources?category=정오표&page=2     → 카테고리 + 페이지
```

Server Component에서 `searchParams`를 받아 데이터를 필터링/페이지네이션 후 Client Component에 props로 전달.

---

## 11. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 실제 파일 없이 다운로드 버튼만 존재 | Low | High | fileUrl을 "#"으로 설정, 클릭 시 toast 알림 또는 alert |
| 헤더 메뉴 항목 증가로 좁은 화면에서 깨짐 | Medium | Medium | md 이하에서 모바일 메뉴(햄버거)로 대응 — 기존 구조 활용 |
| 카테고리/검색/페이지 조합 시 빈 결과 | Low | Low | "검색 결과가 없습니다" 빈 상태 UI 제공 |

---

## 12. Next Steps

1. [ ] Design 문서 작성 (`resources-page.design.md`)
2. [ ] 구현 시작
3. [ ] Gap Analysis

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-22 | Initial draft | allen |
| 0.3 | 2026-03-22 | 카테고리 변경: 신청서·양식, 정오표, 교육자료, 참고자료 | allen |
