# resources-page Design Document

> **Summary**: 자료실 페이지 (`/resources`) 상세 설계. 근로자주도훈련 신청서, 교재 정오표, 교육자료 등을 다운로드할 수 있는 페이지.
>
> **Project**: BIZSCHOOL
> **Version**: 1.0
> **Author**: allen
> **Date**: 2026-03-22
> **Plan Reference**: `docs/01-plan/features/resources-page.plan.md` (v0.3)

---

## 1. Architecture Overview

### 1.1 Component Tree

```
/resources (page.tsx - Server Component)
├── Hero Section (inline)
├── ResourcePageContent (Client Component)
│   ├── ResourceCategoryTabs
│   ├── ResourceSearch
│   ├── ResourceTable (Desktop + Mobile)
│   └── ResourcePagination
```

### 1.2 Design Decision: 단일 Client Component 래퍼

공지사항 페이지는 Server Component에서 필터링 후 Client에 props 전달하는 구조이나, 자료실은 카테고리+검색+페이지네이션 3가지 필터가 조합되므로 **하나의 Client Component(`ResourcePageContent`)에서 URL searchParams를 관리**하는 방식을 채택한다.

- `page.tsx` (Server): metadata + Hero + `<ResourcePageContent />`에 전체 데이터 전달
- `ResourcePageContent` (Client): URL searchParams 읽기/쓰기, 필터링, 페이지네이션 처리

---

## 2. File Structure

### 2.1 신규 파일

| File | Type | Description |
|------|------|-------------|
| `src/app/resources/page.tsx` | Server Component | 메타데이터 + Hero + ResourcePageContent 렌더 |
| `src/components/resources/ResourcePageContent.tsx` | Client Component | 카테고리/검색/페이지 상태 관리 + 하위 컴포넌트 조합 |
| `src/data/resources.ts` | Data | Mock 데이터 (18건) + 헬퍼 함수 |

### 2.2 수정 파일

| File | Change |
|------|--------|
| `src/types/index.ts` | `Resource`, `ResourceCategory`, `ResourceFileType`, `ResourceCategoryFilter` 타입 추가 |
| `src/components/layout/Header.tsx` | `menuItems`에 `{ label: "자료실", href: "/resources" }` 추가 ("도서" 다음) |
| `src/components/layout/Footer.tsx` | `footerLinks` "고객지원" 그룹에 `{ label: "자료실", href: "/resources" }` 추가 |
| `src/components/layout/LayoutContent.tsx` | `hideSearchBar` 조건에 `/resources` 추가 |

---

## 3. Type Definitions

### 3.1 `src/types/index.ts` 추가 내용

```typescript
// ── 자료실 ──

export type ResourceCategory = "신청서·양식" | "정오표" | "교육자료" | "참고자료";

export type ResourceFileType = "PDF" | "XLSX" | "HWP" | "ZIP" | "PPTX";

export type ResourceCategoryFilter = "전체" | ResourceCategory;

export interface Resource {
  id: number;
  title: string;
  category: ResourceCategory;
  fileType: ResourceFileType;
  fileSize: string;
  fileName: string;
  fileUrl: string;
  createdAt: string;
}
```

---

## 4. Mock Data Design

### 4.1 `src/data/resources.ts`

```typescript
import type { Resource, ResourceCategory } from "@/types";

export const RESOURCES_PER_PAGE = 10;

export const resources: Resource[] = [
  // 신청서·양식 (5건)
  { id: 1, title: "2026년 근로자주도훈련 수강신청서", category: "신청서·양식", fileType: "PDF", fileSize: "1.2 MB", fileName: "근로자주도훈련_수강신청서_2026.pdf", fileUrl: "#", createdAt: "2026-03-20" },
  { id: 2, title: "근로자주도훈련 환급신청서", category: "신청서·양식", fileType: "PDF", fileSize: "980 KB", fileName: "근로자주도훈련_환급신청서.pdf", fileUrl: "#", createdAt: "2026-03-15" },
  { id: 3, title: "위탁훈련 계약서 양식", category: "신청서·양식", fileType: "HWP", fileSize: "245 KB", fileName: "위탁훈련_계약서.hwp", fileUrl: "#", createdAt: "2026-03-10" },
  { id: 4, title: "수강료 납부 확인서 양식", category: "신청서·양식", fileType: "PDF", fileSize: "156 KB", fileName: "수강료_납부확인서.pdf", fileUrl: "#", createdAt: "2026-02-28" },
  { id: 5, title: "교육훈련 수료보고서 양식", category: "신청서·양식", fileType: "HWP", fileSize: "312 KB", fileName: "교육훈련_수료보고서.hwp", fileUrl: "#", createdAt: "2026-02-20" },

  // 정오표 (4건)
  { id: 6, title: "2026 세무회계 실무 교재 정오표", category: "정오표", fileType: "PDF", fileSize: "156 KB", fileName: "세무회계실무_정오표_2026.pdf", fileUrl: "#", createdAt: "2026-03-18" },
  { id: 7, title: "2026 재산제세 실무 교재 정오표", category: "정오표", fileType: "PDF", fileSize: "89 KB", fileName: "재산제세실무_정오표_2026.pdf", fileUrl: "#", createdAt: "2026-03-12" },
  { id: 8, title: "2026 법인세 실무 교재 정오표", category: "정오표", fileType: "PDF", fileSize: "124 KB", fileName: "법인세실무_정오표_2026.pdf", fileUrl: "#", createdAt: "2026-03-05" },
  { id: 9, title: "2026 원가관리회계 교재 정오표", category: "정오표", fileType: "PDF", fileSize: "67 KB", fileName: "원가관리회계_정오표_2026.pdf", fileUrl: "#", createdAt: "2026-02-25" },

  // 교육자료 (5건)
  { id: 10, title: "2026 세무회계 실무 강의교안", category: "교육자료", fileType: "PDF", fileSize: "15.2 MB", fileName: "세무회계실무_교안_2026.pdf", fileUrl: "#", createdAt: "2026-03-16" },
  { id: 11, title: "전산세무 2급 실습파일 (엑셀)", category: "교육자료", fileType: "XLSX", fileSize: "3.4 MB", fileName: "전산세무2급_실습파일.xlsx", fileUrl: "#", createdAt: "2026-03-08" },
  { id: 12, title: "2026 재산제세 강의교안", category: "교육자료", fileType: "PDF", fileSize: "12.8 MB", fileName: "재산제세_교안_2026.pdf", fileUrl: "#", createdAt: "2026-02-27" },
  { id: 13, title: "부가가치세 신고 실습 자료", category: "교육자료", fileType: "ZIP", fileSize: "8.5 MB", fileName: "부가세신고_실습자료.zip", fileUrl: "#", createdAt: "2026-02-18" },
  { id: 14, title: "원천징수 실무 강의교안", category: "교육자료", fileType: "PPTX", fileSize: "6.7 MB", fileName: "원천징수실무_교안.pptx", fileUrl: "#", createdAt: "2026-02-10" },

  // 참고자료 (4건)
  { id: 15, title: "2026년 세법 개정사항 요약", category: "참고자료", fileType: "PDF", fileSize: "2.1 MB", fileName: "2026_세법개정_요약.pdf", fileUrl: "#", createdAt: "2026-03-01" },
  { id: 16, title: "중소기업 세무 실무 가이드", category: "참고자료", fileType: "PDF", fileSize: "4.3 MB", fileName: "중소기업_세무실무가이드.pdf", fileUrl: "#", createdAt: "2026-02-15" },
  { id: 17, title: "자주 묻는 세무 Q&A 모음집", category: "참고자료", fileType: "PDF", fileSize: "1.8 MB", fileName: "세무QA_모음집.pdf", fileUrl: "#", createdAt: "2026-02-05" },
  { id: 18, title: "근로자주도훈련 제도 안내 가이드", category: "참고자료", fileType: "PDF", fileSize: "3.2 MB", fileName: "근로자주도훈련_안내가이드.pdf", fileUrl: "#", createdAt: "2026-01-20" },
];

/** ID 내림차순 정렬 (최신순) */
export function getSortedResources(allResources: Resource[]): Resource[] {
  return [...allResources].sort((a, b) => b.id - a.id);
}

/** 카테고리 필터 */
export function filterByCategory(allResources: Resource[], category: ResourceCategoryFilter): Resource[] {
  if (category === "전체") return allResources;
  return allResources.filter((r) => r.category === category);
}

/** 제목 검색 필터 */
export function filterBySearch(allResources: Resource[], search: string): Resource[] {
  if (!search) return allResources;
  const query = search.toLowerCase();
  return allResources.filter((r) => r.title.toLowerCase().includes(query));
}
```

---

## 5. Component Specifications

### 5.1 `src/app/resources/page.tsx` (Server Component)

```typescript
import type { Metadata } from "next";
import { resources } from "@/data/resources";
import ResourcePageContent from "@/components/resources/ResourcePageContent";

export const metadata: Metadata = {
  title: "자료실 | BIZSCHOOL",
  description: "근로자주도훈련 신청서, 교재 정오표, 강의교안 등 필요한 자료를 다운로드하세요.",
};

export default function ResourcesPage() {
  return (
    <div>
      {/* Hero Section — 기존 패턴 (notice, training과 동일) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#155dfc] to-[#0d3b9e] px-8 py-16 text-center md:px-16 md:py-24 lg:py-28">
        {/* 장식 원 3개 */}
        <div className="relative z-10 mx-auto max-w-3xl">
          <h1>자료실</h1>
          <p>신청서, 정오표, 교육자료 등 필요한 자료를 다운로드하세요.</p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-[1200px] px-4 pb-16">
        <ResourcePageContent resources={resources} />
      </div>
    </div>
  );
}
```

### 5.2 `src/components/resources/ResourcePageContent.tsx` (Client Component)

**역할**: URL searchParams 기반 상태 관리 + 필터링 + 페이지네이션 + 하위 UI 렌더링

```typescript
"use client";

interface ResourcePageContentProps {
  resources: Resource[];
}

// URL searchParams: ?category=정오표&search=세무&page=2
// useSearchParams()로 읽고, router.push()로 업데이트

// 렌더 구조:
// 1. 카테고리 탭 (5개: 전체, 신청서·양식, 정오표, 교육자료, 참고자료)
// 2. 검색 바 + 결과 건수
// 3. 테이블 (Desktop md이상) / 카드 (Mobile md미만)
// 4. 페이지네이션
```

**상태 관리 흐름**:
```
URL searchParams
  → category, search, page 파싱
  → resources 필터링 (category → search → sort)
  → 페이지네이션 slice
  → 렌더링
```

### 5.3 UI 세부 설계

#### 5.3.1 카테고리 탭

```
┌───────────────────────────────────────────────────────────┐
│ [전체]  [신청서·양식]  [정오표]  [교육자료]  [참고자료]       │
└───────────────────────────────────────────────────────────┘
```

- 컨테이너: `flex flex-wrap gap-2 mt-8`
- 활성 탭: `bg-[var(--color-primary)] text-white rounded-lg px-4 py-2 text-sm font-medium`
- 비활성 탭: `bg-[var(--color-light-bg)] text-[var(--color-muted)] rounded-lg px-4 py-2 text-sm hover:text-[var(--color-body)]`
- 탭 클릭 시: `router.push(/resources?category={value}&page=1)` (검색어 유지)

#### 5.3.2 검색 바

```
┌──────────────────────────────────────────────────────────┐
│ 🔍 자료 검색...                              [검색]      │
│ 총 18개의 자료                                            │
└──────────────────────────────────────────────────────────┘
```

- 기존 `NoticeSearch` 패턴 동일
- form submit 시 `router.push(/resources?category={현재}&search={keyword}&page=1)`
- 검색 결과: "검색결과 N건 [초기화]" / 기본: "총 N개의 자료"

#### 5.3.3 Desktop 테이블 (md 이상)

```html
<table className="w-full table-fixed text-sm">
  <colgroup>
    <col className="w-[8%]" />   <!-- 번호 -->
    <col className="w-[14%]" />  <!-- 카테고리 -->
    <col className="w-[36%]" />  <!-- 제목 -->
    <col className="w-[10%]" />  <!-- 파일형식 -->
    <col className="w-[10%]" />  <!-- 파일크기 -->
    <col className="w-[12%]" />  <!-- 등록일 -->
    <col className="w-[10%]" />  <!-- 다운로드 -->
  </colgroup>
</table>
```

**카테고리 뱃지 색상**:

| Category | Background | Text |
|----------|-----------|------|
| 신청서·양식 | `bg-blue-50` | `text-blue-600` |
| 정오표 | `bg-orange-50` | `text-orange-600` |
| 교육자료 | `bg-green-50` | `text-green-600` |
| 참고자료 | `bg-gray-100` | `text-gray-600` |

**NEW 뱃지**: 등록일 기준 7일 이내 → `<span className="ml-1.5 inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-500">NEW</span>`

**다운로드 버튼**: `<a>` 태그, `href={resource.fileUrl}`, `download={resource.fileName}`, fileUrl이 "#"이면 `onClick`에서 `alert("준비 중입니다.")` 후 `e.preventDefault()`

#### 5.3.4 Mobile 카드 (md 미만)

```
┌────────────────────────────────────────────────┐
│ [신청서·양식]  NEW                               │
│ 근로자주도훈련 수강신청서                          │
│ PDF · 1.2 MB · 2026.03.20        [⬇ 다운로드]   │
└────────────────────────────────────────────────┘
```

- 카드: `rounded-xl border border-[var(--color-border)] bg-white p-4`
- 상단: 카테고리 뱃지 + NEW 뱃지 (7일 이내)
- 중간: 제목 `font-medium text-[var(--color-dark)]`
- 하단: `flex items-center justify-between`
  - 좌: `text-xs text-[var(--color-muted)]` 파일정보 (PDF · 1.2 MB · 2026.03.20)
  - 우: 다운로드 버튼 (Download 아이콘 + "다운로드" 텍스트)

#### 5.3.5 페이지네이션

- 기존 `NoticePagination` 패턴 재현 (인라인 구현)
- `goToPage` 시 현재 category, search를 URL에 유지하면서 page만 변경
- `maxVisible = 5`, ChevronLeft/Right

#### 5.3.6 빈 상태

검색/필터 결과 0건일 때:
```
┌────────────────────────────────────────────┐
│                                            │
│     등록된 자료가 없습니다                    │
│     다른 카테고리나 검색어로 시도해 보세요      │
│                                            │
└────────────────────────────────────────────┘
```

---

## 6. Navigation Changes

### 6.1 Header (`src/components/layout/Header.tsx`)

```typescript
// 변경 전
const menuItems: MenuItem[] = [
  { label: "공개교육", href: "/education" },
  { label: "근로자 주도훈련", href: "/training" },
  { label: "강의", href: "/" },
  { label: "도서", href: "/books" },
  { label: "전문가상담", href: "/consulting" },
  { label: "커뮤니티", href: "/community" },
];

// 변경 후
const menuItems: MenuItem[] = [
  { label: "공개교육", href: "/education" },
  { label: "근로자 주도훈련", href: "/training" },
  { label: "강의", href: "/" },
  { label: "도서", href: "/books" },
  { label: "자료실", href: "/resources" },    // 추가
  { label: "전문가상담", href: "/consulting" },
  { label: "커뮤니티", href: "/community" },
];
```

### 6.2 Footer (`src/components/layout/Footer.tsx`)

```typescript
// "고객지원" 그룹에 추가
{
  title: "고객지원",
  links: [
    { label: "FAQ", href: "/faq" },
    { label: "1:1 문의", href: "/contact" },
    { label: "공지사항", href: "/notice" },
    { label: "자료실", href: "/resources" },  // 추가
  ],
},
```

### 6.3 LayoutContent (`src/components/layout/LayoutContent.tsx`)

```typescript
// hideSearchBar 조건에 /resources 추가
const hideSearchBar = isConsulting
  || pathname === "/about"
  || pathname === "/directions"
  || pathname === "/venue"
  || pathname === "/mypage"
  || pathname.startsWith("/notice")
  || pathname === "/resources";   // 추가
```

---

## 7. Implementation Order

| Step | File | Task |
|------|------|------|
| 1 | `src/types/index.ts` | Resource 관련 타입 추가 |
| 2 | `src/data/resources.ts` | Mock 데이터 + 헬퍼 함수 |
| 3 | `src/app/resources/page.tsx` | 페이지 (Hero + Content) |
| 4 | `src/components/resources/ResourcePageContent.tsx` | 통합 Client Component (탭+검색+테이블+페이지네이션) |
| 5 | `src/components/layout/Header.tsx` | "자료실" 메뉴 추가 |
| 6 | `src/components/layout/Footer.tsx` | 고객지원에 "자료실" 추가 |
| 7 | `src/components/layout/LayoutContent.tsx` | searchBar 숨김 조건 추가 |

---

## 8. isNew Helper

```typescript
/** 등록일 기준 7일 이내인지 판별 */
function isNew(createdAt: string): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
}
```

---

## 9. Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| < md (768px) | 카드 뷰 + 탭 flex-wrap |
| >= md | 테이블 뷰 + 탭 한 줄 |

---

## 10. Acceptance Criteria

- [ ] `/resources` 접속 시 Hero + 카테고리 탭 + 검색 + 테이블/카드 + 페이지네이션 정상 표시
- [ ] 카테고리 탭 클릭 시 URL 업데이트 + 필터링 동작
- [ ] 검색어 입력 후 제출 시 제목 기준 필터링 + 결과 건수 표시
- [ ] 다운로드 버튼 클릭 시 `alert("준비 중입니다.")` 표시 (fileUrl="#")
- [ ] 모바일(md 미만)에서 카드 뷰 정상 전환
- [ ] 페이지네이션 정상 동작 (카테고리/검색 유지)
- [ ] 7일 이내 자료에 NEW 뱃지 표시
- [ ] 빈 결과 시 빈 상태 UI 표시
- [ ] 헤더 메뉴에 "자료실" 표시 + 클릭 시 `/resources` 이동
- [ ] 푸터 고객지원에 "자료실" 표시 + 클릭 시 `/resources` 이동
- [ ] `next build` 에러 없음

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-03-22 | Initial design | allen |
