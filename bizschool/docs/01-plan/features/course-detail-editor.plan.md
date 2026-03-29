# Plan: 강의 상세정보 — 리치 텍스트 에디터 모드

## 개요

- **Feature**: course-detail-editor
- **Phase**: Plan
- **작성일**: 2026-03-29

## 배경 및 목적

현재 Step 4 "강의 상세정보" 입력은 단순 `<textarea>`로 플레인 텍스트만 입력 가능하다.
강의 상세페이지(`/lectures/[id]`)에서도 `whitespace-pre-line`으로 텍스트만 표시한다.

전문가가 강의 내용을 풍부하게 표현할 수 있도록 **리치 텍스트 에디터 모드**를 추가한다.

## 핵심 기능

### F1. 두 가지 입력 모드

| 모드 | 설명 |
|------|------|
| 간편 입력 (기본) | 기존 textarea — 플레인 텍스트 입력 |
| 에디터 모드 | Tiptap 기반 WYSIWYG 에디터 |

- 모드 전환 탭/토글 UI 제공
- 간편 입력 → 에디터 전환 시: 기존 텍스트를 `<p>` 태그로 변환하여 에디터에 로드
- 에디터 → 간편 입력 전환 시: HTML 태그 제거 경고 후 플레인 텍스트로 변환

### F2. 에디터 툴바 기능

참고 이미지(네이버 블로그 에디터) 기반 + BIZSCHOOL 맥락 필수 기능:

| 기능 | 설명 |
|------|------|
| **텍스트 서식** | 굵게(B), 기울임(I), 밑줄(U), 취소선(S) |
| **제목** | H2, H3 헤딩 |
| **폰트 크기** | 12, 14, 16, 18, 20, 24px 선택 |
| **텍스트 색상** | 8색 컬러 팔레트 |
| **정렬** | 좌측, 가운데, 우측 정렬 |
| **리스트** | 순서 있는/없는 목록 |
| **링크** | URL 삽입 |
| **표** | 행/열 지정하여 테이블 삽입 |
| **이미지** | 파일 업로드 → 이미지 삽입 (인라인) |
| **구분선** | 가로 구분선 삽입 |

### F3. 이미지 업로드

- 에디터 내 이미지 삽입 시 파일 선택 다이얼로그
- `uploads/detail-images/` 경로에 저장 (또는 presigned URL)
- 삽입된 이미지 URL이 HTML에 `<img>` 태그로 포함
- 최대 파일 크기: 5MB, 형식: jpg, png, webp

### F4. 데이터 저장 형식

- **간편 입력 모드**: `string` (플레인 텍스트, as-is)
- **에디터 모드**: `string` (HTML 문자열)
- 기존 `detail: string` 타입 유지 — HTML 또는 플레인 텍스트 모두 string
- 에디터로 작성된 콘텐츠는 `<p>`, `<h2>`, `<table>` 등 HTML 태그 포함

### F5. 강의 상세페이지 렌더링

현재 (`LectureDetailContent.tsx:287-296`):
```tsx
<p className="whitespace-pre-line text-sm leading-relaxed">
  {lecture.detail}
</p>
```

변경 후:
- `detail` 값에 HTML 태그 포함 여부 판별 (`/<[a-z][\s\S]*>/i` 정규식)
- HTML인 경우: `dangerouslySetInnerHTML` + sanitize (DOMPurify)로 렌더링
- 플레인 텍스트인 경우: 기존 `whitespace-pre-line` 유지

## 기술 스펙

### 에디터 라이브러리: Tiptap

선택 이유:
- React/Next.js 친화적 (ProseMirror 기반)
- 확장 가능한 플러그인 구조 (Table, Image, Color 등)
- Headless → 커스텀 UI 자유도 높음
- 번들 크기 합리적 (~50KB gzipped core)

### 필요 패키지

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-color @tiptap/extension-text-style @tiptap/extension-table @tiptap/extension-table-row @tiptap/extension-table-cell @tiptap/extension-table-header @tiptap/extension-image @tiptap/extension-link @tiptap/extension-text-align @tiptap/extension-underline @tiptap/extension-placeholder @tiptap/extension-heading dompurify
```

### 신규 컴포넌트

| 파일 | 역할 |
|------|------|
| `components/expert/RichTextEditor.tsx` | Tiptap 에디터 래퍼 (툴바 + 에디터 영역) |
| `components/expert/EditorToolbar.tsx` | 툴바 버튼 그룹 |

### 변경 파일

| 파일 | 변경 내용 |
|------|-----------|
| `app/expert/upload/page.tsx` | 모드 전환 UI + RichTextEditor 연동 |
| `components/lectures/LectureDetailContent.tsx` | HTML 렌더링 지원 |
| `types/index.ts` | (변경 없음 — `detail: string` 유지) |

### 이미지 업로드 API

- `POST /api/expert/upload-image` — 에디터 이미지 업로드
- 요청: `multipart/form-data` (file)
- 응답: `{ url: string }` — 업로드된 이미지 URL
- 저장: `public/uploads/detail-images/{uuid}.{ext}`

## UI 구성

### 모드 전환 탭

```
┌──────────────────────────────────────────┐
│  강의 상세정보                             │
│                                          │
│  [간편 입력]  [에디터 모드]   ← 탭 전환     │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ (간편 입력 시) textarea           │    │
│  │ (에디터 모드 시) Tiptap 에디터    │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

### 에디터 모드 레이아웃

```
┌──────────────────────────────────────────┐
│ 본문 v │ 나눔고딕 v │ 15 v │              │
│ B  I  U  S │ H2  H3 │ ≡ ≡ ≡ │           │
│ 리스트 │ 표 │ 이미지 │ 링크 │ 색상 │ ── │  │
├──────────────────────────────────────────┤
│                                          │
│  에디터 본문 영역                          │
│  (최소 높이 300px)                        │
│                                          │
│                                          │
└──────────────────────────────────────────┘
```

## 보안 고려사항

- **XSS 방지**: DOMPurify로 HTML sanitize 후 렌더링
- **이미지 업로드**: 파일 확장자 + MIME 타입 이중 검증
- **파일 크기 제한**: 5MB (서버사이드 검증)
- **허용 HTML 태그**: `p, h2, h3, strong, em, u, s, table, tr, td, th, thead, tbody, img, a, ul, ol, li, br, hr, span`
- **허용 속성**: `href, src, alt, style(color, text-align, font-size), colspan, rowspan, class`

## 검증 시나리오

1. 간편 입력 모드에서 텍스트 입력 → 상세페이지에 기존처럼 표시
2. 에디터 모드에서 서식 적용 (굵기, 색상, 제목) → 상세페이지에 HTML 렌더링
3. 에디터에서 표 삽입 → 상세페이지에 표 표시
4. 에디터에서 이미지 삽입 → 상세페이지에 이미지 표시
5. 모드 전환 시 데이터 보존/변환 확인
6. XSS 공격 코드 입력 → DOMPurify로 차단 확인

## 구현 우선순위

| 단계 | 내용 | 난이도 |
|------|------|--------|
| 1 | Tiptap 패키지 설치 + RichTextEditor 기본 구현 | 낮음 |
| 2 | 툴바 (텍스트 서식, 제목, 정렬, 리스트) | 낮음 |
| 3 | 모드 전환 UI (탭) + page.tsx 연동 | 낮음 |
| 4 | 표 삽입 기능 | 중간 |
| 5 | 이미지 업로드 API + 에디터 이미지 삽입 | 중간 |
| 6 | 상세페이지 HTML 렌더링 + DOMPurify | 낮음 |
| 7 | 텍스트 색상, 폰트 크기 | 낮음 |

## 제약사항 및 리스크

| 항목 | 내용 |
|------|------|
| Tiptap 번들 크기 | 확장 기능 많으면 50-80KB 추가 — dynamic import로 최적화 |
| 이미지 저장 | public 폴더 직접 저장 시 Vercel 배포 불가 — 추후 외부 스토리지 필요 |
| SSR 호환 | Tiptap은 클라이언트 전용 — `dynamic(() => import(...), { ssr: false })` 필요 |
| 모바일 에디터 UX | 모바일에서 툴바 공간 부족 — 반응형 툴바 또는 간편 입력 기본 전환 |
