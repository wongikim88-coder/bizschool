# book-preview Design Document

> **Summary**: 도서 목록 페이지에서 교보문고 스타일의 "미리보기" 모달 뷰어를 제공하는 기능 설계
>
> **Project**: BIZSCHOOL
> **Version**: 2.0 (교보문고 스타일 전면 재설계)
> **Author**: AI
> **Date**: 2026-03-22
> **Plan Reference**: `docs/01-plan/features/book-preview.plan.md` (v0.1)

---

## 1. Architecture Overview

### 1.1 Component Tree

```
/books (page.tsx - Server Component, 기존 유지)
├── BookBanner
├── BooksContent
│   ├── CategoryFilter
│   ├── BookListCard (기존)
│   │   └── BookPreviewButton (Client Component) ← NEW
│   │       └── BookPreviewModal (Client Component) ← NEW
│   │           ├── Header (제목/저자 + 닫기/전체화면)
│   │           ├── Tab Bar (목차 | 미리보기)
│   │           ├── BookPreviewToc ← NEW
│   │           ├── BookPreviewViewer ← NEW
│   │           └── Footer (줌 컨트롤 + 페이지 표시)
│   └── Pagination
```

### 1.2 Design Decision: Client Component 분리

현재 `BookListCard`는 Server Component (no "use client")로 동작한다. 미리보기 기능은 모달 상태 관리가 필요하므로, **별도의 Client Component (`BookPreviewButton`)로 분리**하여 BookListCard의 Server Component 특성을 유지한다.

- `BookPreviewButton`: "use client" — 버튼 렌더 + 모달 open/close 상태 관리
- `BookPreviewModal`: "use client" — 모달 UI 전체 (탭, 뷰어, 줌, 키보드 이벤트)

---

## 2. File Structure

### 2.1 신규 파일

| File | Type | Description |
|------|------|-------------|
| `src/components/books/BookPreviewButton.tsx` | Client Component | 미리보기 버튼 + 모달 open/close 상태 관리 |
| `src/components/books/BookPreviewModal.tsx` | Client Component | 모달 컨테이너 (헤더, 탭바, 뷰어 영역, 푸터) |
| `src/components/books/BookPreviewToc.tsx` | Component | 목차 탭 내용 |
| `src/components/books/BookPreviewViewer.tsx` | Component | 샘플 페이지 뷰어 (페이지 넘김, 줌) |

### 2.2 수정 파일

| File | Change |
|------|--------|
| `src/types/index.ts` | `BookPreview`, `BookPreviewPage`, `BookTocItem` 타입 추가; `Book` 인터페이스에 `preview?` 필드 추가 |
| `src/data/books.ts` | 일부 도서(6권)에 `preview` Mock 데이터 추가 |
| `src/components/books/BookListCard.tsx` | 커버 영역에 `BookPreviewButton` 삽입 |

---

## 3. Type Definitions

### 3.1 `src/types/index.ts` 추가 내용

```typescript
// ── 도서 미리보기 ──

export interface BookTocItem {
  chapter: string;       // "제1장" / "Part 1"
  title: string;         // 챕터 제목
  page: number;          // 페이지 번호
}

export interface BookPreviewPage {
  pageNumber: number;
  label?: string;        // "표지", "서문" 등 (선택)
}

export interface BookPreview {
  toc: BookTocItem[];
  totalPages: number;    // 미리보기 가능한 총 페이지 수
  pages: BookPreviewPage[];
}
```

### 3.2 `Book` 인터페이스 수정

```typescript
export interface Book {
  // ... 기존 필드 유지
  preview?: BookPreview;  // ← 추가
}
```

---

## 4. Component Specifications

### 4.1 BookPreviewButton

**파일**: `src/components/books/BookPreviewButton.tsx`

```
"use client"

Props:
  book: Book (preview 필드 포함)

State:
  isOpen: boolean (모달 open/close)

동작:
  - book.preview가 없으면 null 반환 (렌더링 안 함)
  - book.preview가 있으면 Eye 아이콘 + "미리보기" 텍스트 버튼 렌더
  - 클릭 시 isOpen = true → BookPreviewModal 렌더
  - BookPreviewModal의 onClose로 isOpen = false
```

**Desktop 위치**: BookListCard 커버 이미지 하단 오버레이
**Mobile 위치**: 모바일 버튼 그룹에 추가 (장바구니, 바로구매 옆)

### 4.2 BookPreviewModal

**파일**: `src/components/books/BookPreviewModal.tsx`

```
Props:
  book: Book
  onClose: () => void

State:
  activeTab: "toc" | "preview" (기본값: "toc")
  currentPage: number (기본값: 1)
  zoomLevel: number (기본값: 100, 단위: %)
  isFullscreen: boolean (기본값: false)

구조:
┌─────────────────────────────────────────────────────────┐
│ Header                                                  │
│  [X 닫기]  {book.title} — {book.author}   [전체화면 ⛶] │
├─────────────────────────────────────────────────────────┤
│ Tab Bar                                                 │
│  [목차]  [미리보기]                                      │
├─────────────────────────────────────────────────────────┤
│ Content Area (flex-1, overflow-auto)                    │
│                                                         │
│  activeTab === "toc"                                    │
│    → <BookPreviewToc toc={book.preview.toc} />          │
│                                                         │
│  activeTab === "preview"                                │
│    → <BookPreviewViewer                                 │
│         pages={book.preview.pages}                      │
│         currentPage={currentPage}                       │
│         zoomLevel={zoomLevel}                           │
│         onPageChange={setCurrentPage}                   │
│       />                                                │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ Footer (activeTab === "preview" 일 때만 표시)            │
│  [-] {zoomLevel}% [+]     {currentPage}/{totalPages}    │
└─────────────────────────────────────────────────────────┘
```

**키보드 이벤트** (useEffect):
- `Escape` → onClose()
- `ArrowLeft` → 이전 페이지 (activeTab === "preview" 일 때)
- `ArrowRight` → 다음 페이지 (activeTab === "preview" 일 때)

**Body 스크롤 잠금** (useEffect):
- 모달 마운트 시 `document.body.style.overflow = "hidden"`
- 언마운트 시 복원

**전체화면**:
- `isFullscreen` 토글 시 모달 크기 변경
- 일반: `max-w-4xl max-h-[90vh]`
- 전체화면: `w-screen h-screen max-w-none max-h-none`

### 4.3 BookPreviewToc

**파일**: `src/components/books/BookPreviewToc.tsx`

```
Props:
  toc: BookTocItem[]

레이아웃:
┌─────────────────────────────────────────┐
│  목차                                    │
├─────────────────────────────────────────┤
│  제1장  경영 전략의 기초        ····· 3  │
│  제2장  시장 분석과 기회 발견    ····· 25 │
│  제3장  마케팅 전략 수립         ····· 47 │
│  제4장  재무 관리의 핵심         ····· 89 │
│  제5장  조직 관리와 리더십      ····· 121 │
│  ...                                    │
└─────────────────────────────────────────┘

각 항목:
  - flex justify-between
  - 왼쪽: "{chapter}  {title}"
  - 가운데: 점선 (border-dotted flex-1)
  - 오른쪽: "{page}"
  - hover 시 배경색 하이라이트
```

### 4.4 BookPreviewViewer

**파일**: `src/components/books/BookPreviewViewer.tsx`

```
Props:
  pages: BookPreviewPage[]
  currentPage: number
  zoomLevel: number
  onPageChange: (page: number) => void

레이아웃:
┌─────────────────────────────────────────────────────────┐
│                                                         │
│         ┌──────────────────────────┐                    │
│   [◀]   │                          │   [▶]             │
│         │   페이지 콘텐츠 영역       │                    │
│         │   (Mock: gradient +       │                    │
│         │    페이지 번호 텍스트)     │                    │
│         │                          │                    │
│         └──────────────────────────┘                    │
│                                                         │
└─────────────────────────────────────────────────────────┘

페이지 콘텐츠 (Mock):
  - 실제 이미지 대신 gradient placeholder 사용
  - 페이지 중앙에 "P.{pageNumber}" 텍스트
  - label이 있으면 함께 표시 ("표지", "서문" 등)
  - transform: scale({zoomLevel/100})로 줌 적용

이전/다음 버튼:
  - ChevronLeft / ChevronRight (lucide-react)
  - 첫 페이지에서 이전 버튼 비활성화 (opacity-30, disabled)
  - 마지막 페이지에서 다음 버튼 비활성화

모바일 스와이프:
  - onTouchStart/onTouchEnd로 스와이프 감지
  - 좌 스와이프 → 다음 페이지
  - 우 스와이프 → 이전 페이지
  - 최소 swipe 거리: 50px
```

---

## 5. UI/UX Design

### 5.1 미리보기 버튼 배치 (BookListCard 수정)

**Desktop (md 이상)**:

```
┌──────────┐  Title                     [장바구니]
│  Book    │  Author | Publisher | Date  [바로구매]
│  Cover   │  Price
│          │  Description...
│ [미리보기]│
└──────────┘
```

- 커버 이미지 하단에 반투명 오버레이로 배치
- `absolute bottom-0 left-0 right-0`
- 배경: `bg-black/60` 텍스트: `text-white`
- 아이콘: `Eye` (lucide-react, size=14)
- 크기: 커버 너비에 맞춤, `py-1.5`

**Mobile (md 미만)**:

```
[미리보기] [장바구니] [바로구매]
```

- 기존 모바일 버튼 그룹 맨 앞에 추가
- 스타일: `bg-gray-600 text-white` (기존 버튼과 구분)

### 5.2 모달 디자인 세부

**오버레이**: `fixed inset-0 z-50 bg-black/50 backdrop-blur-sm`

**모달 박스**:
- 일반 모드: `max-w-4xl w-full max-h-[90vh] mx-auto mt-[5vh] rounded-2xl bg-white shadow-2xl`
- 전체화면: `w-screen h-screen rounded-none`
- 내부: `flex flex-col h-full`

**Header**:
- 높이: `h-14`
- 좌측: X 닫기 버튼 (`X` icon)
- 중앙: `{title} — {author}` (truncate)
- 우측: 전체화면 토글 (`Maximize2` / `Minimize2` icon)
- 하단 경계: `border-b`

**Tab Bar**:
- 높이: `h-12`
- 2개 탭: "목차" / "미리보기"
- 활성 탭: `border-b-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold`
- 비활성 탭: `text-[var(--color-muted)]`

**Content Area**:
- `flex-1 overflow-auto`
- 목차: `p-6` 내 목록
- 미리보기: 페이지 중앙 배치 + 좌우 네비 버튼

**Footer** (미리보기 탭에서만):
- 높이: `h-12`
- 좌측: 줌 컨트롤 `[-] 100% [+]`
  - `-` / `+` 버튼: `Minus` / `Plus` (lucide-react)
  - 줌 범위: 50% ~ 200%, 25% 단위 증감
  - 표시: `{zoomLevel}%`
- 우측: `{currentPage} / {totalPages}`
- 상단 경계: `border-t`

### 5.3 반응형 브레이크포인트

| 요소 | Mobile (< 768px) | Desktop (>= 768px) |
|------|-------------------|---------------------|
| 모달 크기 | `w-full h-full` (전체화면 고정) | `max-w-4xl max-h-[90vh]` |
| 모달 라운드 | `rounded-none` | `rounded-2xl` |
| 미리보기 버튼 | 버튼 그룹에 포함 | 커버 하단 오버레이 |
| 페이지 넘김 | 스와이프 + 작은 버튼 | 큰 좌/우 화살표 버튼 |
| 전체화면 버튼 | 숨김 (이미 전체화면) | 표시 |
| 페이지 콘텐츠 | `w-full aspect-[3/4]` | `w-[500px] aspect-[3/4]` |

---

## 6. Mock Data Design

### 6.1 미리보기 데이터 구조

6권의 도서에 미리보기 데이터 추가 (allBooks 중 b1, b2, b4, b7, b10, b15):

```typescript
preview: {
  toc: [
    { chapter: "제1장", title: "경영 전략의 기초", page: 3 },
    { chapter: "제2장", title: "시장 분석과 기회 발견", page: 25 },
    // ... 5~8개 챕터
  ],
  totalPages: 15,
  pages: [
    { pageNumber: 1, label: "표지" },
    { pageNumber: 2, label: "서문" },
    { pageNumber: 3 },
    // ... 12~18페이지
  ],
}
```

### 6.2 Mock 페이지 렌더링

실제 이미지가 없으므로, 각 페이지를 gradient placeholder로 표현:

```
┌─────────────────────┐
│  ░░░░░░░░░░░░░░░░  │  ← gradient bg
│  ░░░░░░░░░░░░░░░░  │
│                     │
│      P. 3           │  ← 페이지 번호
│                     │
│  ░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░  │
└─────────────────────┘
```

- 배경: `bg-gradient-to-b from-amber-50 to-orange-50`
- 테두리: `border border-gray-200 shadow-md`
- 가로줄 장식: 여러 개의 `bg-gray-200` 줄로 텍스트 시뮬레이션
- 중앙 텍스트: `text-gray-400 text-lg`
- label이 있으면 상단에 작은 텍스트로 표시

---

## 7. State Management

### 7.1 상태 흐름도

```
BookPreviewButton
  └─ isOpen: boolean
       │
       └──▶ BookPreviewModal
              ├─ activeTab: "toc" | "preview"
              ├─ currentPage: number
              ├─ zoomLevel: number (50~200, step 25)
              └─ isFullscreen: boolean
```

### 7.2 상태 초기화

모달이 열릴 때마다 상태 초기화:
- `activeTab` → `"toc"`
- `currentPage` → `1`
- `zoomLevel` → `100`
- `isFullscreen` → `false`

---

## 8. Event Handling

### 8.1 키보드 이벤트

| Key | Action | Condition |
|-----|--------|-----------|
| `Escape` | 모달 닫기 | 항상 |
| `ArrowLeft` | 이전 페이지 | activeTab === "preview" && currentPage > 1 |
| `ArrowRight` | 다음 페이지 | activeTab === "preview" && currentPage < totalPages |

### 8.2 터치 이벤트 (모바일 스와이프)

```
onTouchStart: touchStartX 저장
onTouchEnd:
  diff = touchEndX - touchStartX
  if (diff > 50) → 이전 페이지 (우 스와이프)
  if (diff < -50) → 다음 페이지 (좌 스와이프)
```

적용 범위: BookPreviewViewer의 콘텐츠 영역에만 적용

### 8.3 줌 컨트롤

| Action | Result |
|--------|--------|
| [-] 클릭 | zoomLevel = max(50, zoomLevel - 25) |
| [+] 클릭 | zoomLevel = min(200, zoomLevel + 25) |
| 줌 레벨 표시 | `{zoomLevel}%` 텍스트 |

---

## 9. Accessibility

- 모달 오픈 시 `role="dialog"` + `aria-modal="true"` + `aria-label`
- 닫기 버튼에 `aria-label="미리보기 닫기"`
- 탭에 `role="tablist"` / `role="tab"` / `aria-selected`
- 페이지 넘김 버튼에 `aria-label="이전 페이지"` / `"다음 페이지"`
- 비활성 버튼에 `aria-disabled="true"`
- 포커스 트랩: 모달 내부에서만 Tab 순환

---

## 10. Implementation Order

1. [ ] **타입 정의**: `BookTocItem`, `BookPreviewPage`, `BookPreview` 타입 + `Book.preview` 필드 추가
2. [ ] **Mock 데이터**: `books.ts`에 6권의 도서에 preview 데이터 추가
3. [ ] **BookPreviewToc**: 목차 표시 컴포넌트 (가장 단순)
4. [ ] **BookPreviewViewer**: 페이지 뷰어 컴포넌트 (줌, 페이지 넘김, 스와이프)
5. [ ] **BookPreviewModal**: 모달 컨테이너 (헤더, 탭, 푸터, 키보드 이벤트, 스크롤 잠금)
6. [ ] **BookPreviewButton**: 버튼 + 모달 open/close
7. [ ] **BookListCard 수정**: 커버 영역에 BookPreviewButton 삽입

---

## 11. Coding Convention Reference

### 11.1 이 기능에 적용되는 컨벤션

| Item | Convention |
|------|-----------|
| 컴포넌트 네이밍 | PascalCase: `BookPreviewModal.tsx` |
| export 방식 | `export default function ComponentName()` |
| 스타일링 | Tailwind CSS + CSS Variables (`var(--color-*)`) |
| 아이콘 | lucide-react: `Eye`, `X`, `ChevronLeft`, `ChevronRight`, `Minus`, `Plus`, `Maximize2`, `Minimize2` |
| 타입 import | `import type { Book } from "@/types"` |
| 클라이언트 컴포넌트 | 파일 최상단 `"use client"` |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-22 | Initial draft | AI |
