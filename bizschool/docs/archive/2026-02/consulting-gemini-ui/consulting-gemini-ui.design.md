# Design: consulting-gemini-ui (v2)

> Plan 문서: `docs/01-plan/features/consulting-gemini-ui.plan.md`
> v2: 사용자 피드백 반영 (수직 사이드바 레이아웃, 모달 검색, Beta 라벨)

## 1. Architecture Overview

### 1.1 Component Structure (변경 후)

```
RootLayout (src/app/layout.tsx)
├── LayoutContent (src/components/layout/LayoutContent.tsx) ← Client Component
│   ├── Header
│   ├── SearchBar ← consulting 경로에서 숨김 (조건부 렌더링)
│   ├── <main>{children}</main>
│   └── Footer ← consulting 경로에서 숨김 (조건부 렌더링)

ConsultingPage (src/app/consulting/page.tsx)
├── IconRail (사이드바 닫힌 상태, 데스크톱 전용)
│   ├── ≡ 햄버거 토글 버튼
│   └── 📝 새 채팅 버튼
├── Sidebar (사이드바 열린 상태)
│   ├── Header (수직 레이아웃):
│   │   ├── Row 1: ≡ 햄버거
│   │   ├── Row 2: 📝 새 채팅 (아이콘 + 텍스트)
│   │   └── Row 3: 🔍 채팅 검색 (아이콘 + 텍스트)
│   └── SessionList
│       └── 날짜별 그룹화된 세션 목록
├── ChatColumn
│   ├── TopBar: "AI 전문가상담 Beta" (배경 구분 없음)
│   ├── ChatArea / WelcomeScreen
│   ├── ChatInput
│   └── SuggestChips
└── ChatSearchModal (모달, z-100)
    ├── SearchHeader: 검색 입력 + 닫기
    ├── SessionListView: 필터링된 세션 목록
    └── ChatDetailView: 메시지 미리보기 + "이 채팅으로 이동"
```

### 1.2 상태 설계

```typescript
// ConsultingPage 상태
const [sidebarOpen, setSidebarOpen] = useState(true);        // 사이드바 열림/닫힘
const [searchModalOpen, setSearchModalOpen] = useState(false); // 검색 모달
```

## 2. Detailed Design by FR

---

### 2.1 FR-01: 상단 검색창 제거

**파일**: `src/app/layout.tsx`, `src/components/layout/LayoutContent.tsx`

**방안**: LayoutContent Client Component 별도 파일로 분리, pathname 기반 조건부 렌더링

**변경 내용**:
- `LayoutContent` 클라이언트 컴포넌트를 `src/components/layout/LayoutContent.tsx`로 분리
- `usePathname()`으로 현재 경로 확인
- `/consulting` 경로일 때 `<SearchBar />`, `<Footer />` 렌더링 제외
- layout.tsx는 Server Component 유지 (metadata export)
- consulting 페이지 높이를 `calc(100vh - 64px)`로 변경 (Header 64px만 차감)

```tsx
// src/components/layout/LayoutContent.tsx
"use client";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import SearchBar from "@/components/layout/SearchBar";
import Footer from "@/components/layout/Footer";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isConsulting = pathname === "/consulting";
  return (
    <>
      <Header />
      {!isConsulting && (<Suspense><SearchBar /></Suspense>)}
      <main>{children}</main>
      {!isConsulting && <Footer />}
    </>
  );
}
```

---

### 2.2 FR-02: 사이드바 토글 아이콘 복구

**파일**: `src/app/consulting/page.tsx`, `src/components/consultation/Sidebar.tsx`

#### 2.2.1 아이콘 레일 (사이드바 닫힌 상태)

```
┌────┐
│ ≡  │  ← 햄버거 메뉴 (토글)
│ 📝 │  ← 새 채팅
└────┘
```

**구현 위치**: `consulting/page.tsx`에서 `sidebarOpen` 상태에 따라 조건부 렌더링

**스펙**:
- 너비: 52px
- 배경: white, 우측 border
- 아이콘 크기: 20px, 간격: gap-2
- 데스크톱에서만 표시 (`hidden md:flex`)

#### 2.2.2 사이드바 열린 상태 - 수직 헤더 레이아웃

**파일**: `src/components/consultation/Sidebar.tsx`

사이드바 헤더를 수직 레이아웃으로 구성합니다:

```
┌─────────────────────┐
│ ≡                    │  ← Row 1: 햄버거
│ 📝 새 채팅            │  ← Row 2: 새 채팅 (아이콘+텍스트)
│ 🔍 채팅 검색          │  ← Row 3: 채팅 검색 (아이콘+텍스트)
│─────────────────────│
│ 채팅 세션 목록        │
└─────────────────────┘
```

**Sidebar Props**:
```typescript
interface SidebarProps {
  sessions: ConsultationSession[];
  currentSessionId: string | null;
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onSearchOpen: () => void;  // 검색 모달 열기
}
```

#### 2.2.3 사이드바 CSS

데스크톱에서도 사이드바를 닫을 수 있도록 `md:translate-x-0` 제거:

```
${sidebarOpen
  ? "translate-x-0 md:static md:z-auto md:h-auto md:w-[260px]"
  : "-translate-x-full"
}
```

---

### 2.3 FR-03: 사이드바 열림 시 검색 버튼 표시

**파일**: `src/components/consultation/Sidebar.tsx`

**위치**: 사이드바 헤더 Row 3

**스펙**:
- 아이콘: `Search` (lucide-react) 16px + "채팅 검색" 텍스트 라벨
- 전체 너비 버튼, 좌측 정렬
- 텍스트 색상: `text-[var(--color-muted)]`
- 동작: 클릭 시 `onSearchOpen()` → 검색 모달 열기

---

### 2.4 FR-04: 채팅 내역 검색 (모달)

**파일**: `src/components/consultation/ChatSearchModal.tsx` (신규)

검색 UI를 사이드바 인라인이 아닌 **별도 모달**로 구현합니다.

#### 2.4.1 모달 레이아웃

```
┌──────────────────────────────────┐
│ [←] 🔍 [검색 입력...]    [✕] [✕] │  ← 검색 헤더
│──────────────────────────────────│
│ Session List View (기본)          │
│  💬 세션 제목 1      2월 27일      │
│     2개 메시지 · ...스니펫...      │
│  💬 세션 제목 2      2월 26일      │
│──────────────────────────────────│
│ Chat Detail View (세션 클릭 시)    │
│  💬 세션 제목     [이 채팅으로 이동] │
│  ┌────────────────────────────┐  │
│  │ 나: 질문 내용              │  │
│  │ AI 전문가: 답변 내용       │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

#### 2.4.2 ChatSearchModal Props

```typescript
interface ChatSearchModalProps {
  sessions: ConsultationSession[];
  isOpen: boolean;
  onClose: () => void;
  onSelectSession: (sessionId: string) => void;
}
```

#### 2.4.3 모달 내부 상태

```typescript
const [query, setQuery] = useState("");
const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
```

#### 2.4.4 검색 로직

모달 내부에서 `useMemo`로 필터링:

```typescript
const filteredSessions = useMemo(() => {
  if (!query.trim()) return sessions;
  const q = query.toLowerCase();
  return sessions.filter((s) =>
    s.title.toLowerCase().includes(q) ||
    s.messages.some((m) => m.content.toLowerCase().includes(q))
  );
}, [sessions, query]);
```

#### 2.4.5 두 가지 뷰

1. **Session List View** (기본): 세션 목록 + 메시지 수 + 검색 스니펫 + 날짜
2. **Chat Detail View** (세션 클릭 시): 세션 제목 바 + 메시지 미리보기 (MessagePreview)
   - 검색어 매칭 메시지: 노란색 배경 (`bg-yellow-50 ring-1 ring-yellow-200`)
   - 사용자 메시지: primary-light 배경
   - AI 메시지: light-bg 배경
   - "이 채팅으로 이동" 버튼

#### 2.4.6 키보드/UX

- Escape: 상세보기 → 목록, 목록 → 모달 닫기
- 모달 열릴 때 검색 입력 자동 포커스
- 배경 클릭으로 모달 닫기

#### 2.4.7 getSearchSnippet 유틸함수

```typescript
// data/consultation.ts
export function getSearchSnippet(content: string, query: string, contextLen = 30): string {
  const lower = content.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return content.slice(0, 60);
  const start = Math.max(0, idx - contextLen);
  const end = Math.min(content.length, idx + query.length + contextLen);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < content.length ? "..." : "";
  return prefix + content.slice(start, end) + suffix;
}
```

---

### 2.5 FR-05: "AI 전문가상담 Beta" 라벨

**파일**: `src/app/consulting/page.tsx`

**위치**: 채팅 컬럼 상단 (ChatArea 위)

**스펙**:
- 높이: h-12, shrink-0
- 배경/테두리 없음 (채팅 영역과 자연스럽게 이어짐)
- 텍스트: "AI 전문가상담" (text-sm, font-semibold, color-dark)
- "Beta" 배지: rounded-full, bg-primary, text-white, text-[10px], font-bold
- 모바일에서는 좌측에 ≡ 햄버거 버튼도 표시 (`md:hidden`)

---

## 3. File Changes Summary

### 3.1 수정 파일

| # | File | Changes |
|---|------|---------|
| 1 | `src/app/layout.tsx` | LayoutContent 래퍼 import, Server Component 유지 |
| 2 | `src/app/consulting/page.tsx` | Icon Rail, searchModalOpen 상태, ChatSearchModal, TopBar "AI 전문가상담 Beta" |
| 3 | `src/components/consultation/Sidebar.tsx` | 수직 헤더 (≡ → 새 채팅 → 채팅 검색), onSearchOpen prop |
| 4 | `src/data/consultation.ts` | `getSearchSnippet()` 유틸 함수 |

### 3.2 신규 파일

| # | File | Purpose |
|---|------|---------|
| 1 | `src/components/layout/LayoutContent.tsx` | Client Component 래퍼 (pathname 기반 조건부 렌더링) |
| 2 | `src/components/consultation/ChatSearchModal.tsx` | 채팅 검색 모달 (검색, 세션 목록, 메시지 미리보기) |

---

## 4. Implementation Order

```
Step 1: LayoutContent.tsx 신규 생성 + layout.tsx 수정
  ↓
Step 2: data/consultation.ts 에 getSearchSnippet 유틸 추가
  ↓
Step 3: ChatSearchModal.tsx 신규 생성
  ↓
Step 4: consulting/page.tsx 수정
  - Icon Rail, searchModalOpen 상태, TopBar, ChatSearchModal 렌더링
  ↓
Step 5: Sidebar.tsx 수정
  - 수직 헤더 (≡ → 새 채팅 → 채팅 검색)
  - onSearchOpen prop 연결
```

---

## 5. Responsive Behavior

### Desktop (md+)

| State | Left Area | Main Area |
|-------|-----------|-----------|
| Sidebar Open | Sidebar (260px, static) | TopBar + ChatArea + ChatInput + SuggestChips |
| Sidebar Closed | Icon Rail (52px, static) | TopBar + ChatArea + ChatInput + SuggestChips |

### Mobile (<md)

| State | Left Area | Main Area |
|-------|-----------|-----------|
| Sidebar Open | Sidebar (280px, fixed, overlay) | 전체 |
| Sidebar Closed | 없음 (TopBar의 ≡로 열기) | TopBar + ChatArea + ChatInput + SuggestChips |

- 모바일에서는 Icon Rail 미표시 (`hidden md:flex`)
- 모바일에서는 TopBar의 ≡ 버튼으로 사이드바 열기

---

## 6. Animation & Transitions

| Element | Property | Duration | Easing |
|---------|----------|----------|--------|
| Sidebar slide | transform (translate-x) | 200ms | ease |

---

## 7. Acceptance Criteria Mapping

| Plan AC | Design Component | Verification |
|---------|-----------------|-------------|
| 상단 검색창 숨김 | LayoutContent 조건부 렌더링 | `/consulting` 접근 시 SearchBar 미렌더링 확인 |
| ≡ 아이콘 토글 | Icon Rail + Sidebar 헤더 ≡ | 데스크톱/모바일 모두 토글 동작 확인 |
| 아이콘 레일 표시 | page.tsx Icon Rail | 사이드바 닫힌 상태에서 ≡, 📝 아이콘 확인 |
| 채팅 검색 버튼 | Sidebar 헤더 Row 3 🔍 + "채팅 검색" | 사이드바 열린 상태에서 버튼 확인 |
| 채팅 검색 모달 | ChatSearchModal | 검색, 필터링, 세션 상세, "이 채팅으로 이동" 확인 |
| AI 전문가상담 Beta | TopBar in ChatColumn | 배경 구분 없이 표시 확인 |
| 기존 기능 유지 | 변경 없음 | 채팅, 전문가 검증, SuggestChips 정상 동작 |
| 부드러운 애니메이션 | transition 200ms | 사이드바 열기/닫기 전환 부드럽게 |
