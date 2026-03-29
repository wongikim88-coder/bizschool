# Design: 강의 상세정보 — 리치 텍스트 에디터 모드

## 개요

- **Feature**: course-detail-editor
- **Phase**: Design
- **작성일**: 2026-03-29
- **Plan 참조**: `docs/01-plan/features/course-detail-editor.plan.md`

## 컴포넌트 구조

```
app/expert/upload/page.tsx
  └─ Step 4: 수업 정보 입력
       └─ 강의 상세정보 섹션
            ├─ 모드 전환 탭 (간편 입력 / 에디터 모드)
            ├─ [간편 입력] textarea (as-is)
            └─ [에디터 모드] RichTextEditor (dynamic import)
                 ├─ EditorToolbar
                 └─ Tiptap EditorContent

components/lectures/LectureDetailContent.tsx
  └─ 강의 상세정보 섹션
       ├─ HTML 감지 → dangerouslySetInnerHTML + DOMPurify
       └─ 플레인 텍스트 → whitespace-pre-line (as-is)
```

## 상세 설계

### 1. 신규 컴포넌트

#### `components/expert/RichTextEditor.tsx`

```tsx
// Props
interface RichTextEditorProps {
  content: string;                    // HTML string
  onChange: (html: string) => void;   // HTML 변경 콜백
  placeholder?: string;
}

// Tiptap Extensions
const extensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
  }),
  Underline,
  TextStyle,
  Color,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Table.configure({ resizable: true }),
  TableRow,
  TableCell,
  TableHeader,
  Image.configure({ inline: true, allowBase64: false }),
  Link.configure({ openOnClick: false }),
  Placeholder.configure({ placeholder }),
];

// 구조
export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  return (
    <div className="rounded-lg border border-gray-300 focus-within:border-[var(--color-primary)] focus-within:ring-1 focus-within:ring-[var(--color-primary)]">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="rich-editor-content" />
    </div>
  );
}
```

- `dynamic(() => import(...), { ssr: false })` 로 로드
- 에디터 본문 최소 높이: 300px (CSS로 `.rich-editor-content .tiptap { min-height: 300px; }`)

#### `components/expert/EditorToolbar.tsx`

```tsx
interface EditorToolbarProps {
  editor: Editor | null;
}
```

**툴바 레이아웃 (1행)**:

```
┌──────────────────────────────────────────────────────────────┐
│ B  I  U  S │ H2 H3 │ 14▾ │ 🎨▾ │ ≡₁ ≡₂ ≡₃ │ ⊞ ⊟ │ 🖼 🔗 ── │
└──────────────────────────────────────────────────────────────┘
```

| 그룹 | 버튼 | Tiptap 커맨드 |
|------|------|--------------|
| 서식 | B, I, U, S | `toggleBold`, `toggleItalic`, `toggleUnderline`, `toggleStrike` |
| 제목 | H2, H3 | `toggleHeading({ level })` |
| 폰트 크기 | 드롭다운 (12~24) | `setFontSize` (TextStyle extension) |
| 색상 | 컬러 팔레트 팝오버 | `setColor(hex)` |
| 정렬 | 좌, 중, 우 | `setTextAlign('left'/'center'/'right')` |
| 리스트 | 순서/비순서 | `toggleBulletList`, `toggleOrderedList` |
| 표 | 삽입/삭제 | `insertTable({ rows, cols })` |
| 이미지 | 파일 선택 | `setImage({ src })` |
| 링크 | URL 입력 | `setLink({ href })` |
| 구분선 | — | `setHorizontalRule` |

**버튼 스타일**:
- 기본: `text-gray-600 hover:bg-gray-100 rounded p-1.5`
- 활성(isActive): `bg-[var(--color-primary-light)] text-[var(--color-primary)]`
- 그룹 간 구분: `border-r border-gray-200 pr-1 mr-1`

**컬러 팔레트** (8색):
```
#000000  #e03131  #2f9e44  #1971c2
#f08c00  #6741d9  #0c8599  #868e96
```

**폰트 크기 드롭다운**:
```
12px / 14px(기본) / 16px / 18px / 20px / 24px
```

**표 삽입 팝오버**:
```
┌────────────────────┐
│ 행: [3] 열: [3]    │
│ [삽입]             │
└────────────────────┘
```

### 2. 기존 파일 변경

#### `app/expert/upload/page.tsx` — 강의 상세정보 섹션

**추가 state**:
```tsx
type DetailMode = "simple" | "editor";
const [detailMode, setDetailMode] = useState<DetailMode>("simple");
```

**모드 전환 UI**:
```tsx
{/* 모드 전환 탭 */}
<div className="mb-2 flex gap-1 rounded-lg bg-gray-100 p-1">
  <button
    onClick={() => setDetailMode("simple")}
    className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
      detailMode === "simple"
        ? "bg-white text-[var(--color-dark)] shadow-sm"
        : "text-[var(--color-muted)] hover:text-[var(--color-dark)]"
    }`}
  >
    간편 입력
  </button>
  <button
    onClick={() => setDetailMode("editor")}
    className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
      detailMode === "editor"
        ? "bg-white text-[var(--color-dark)] shadow-sm"
        : "text-[var(--color-muted)] hover:text-[var(--color-dark)]"
    }`}
  >
    에디터 모드
  </button>
</div>

{/* 모드별 입력 */}
{detailMode === "simple" ? (
  <textarea ... />  {/* 기존 코드 유지 */}
) : (
  <RichTextEditor
    content={courseDetail}
    onChange={(html) => setCourseDetail(html)}
    placeholder="수강생이 알아야 할 강의의 상세 내용을 입력해주세요."
  />
)}
```

**모드 전환 시 데이터 변환**:
- `simple → editor`: 플레인 텍스트를 `\n` 기준으로 `<p>` 태그로 래핑
  ```tsx
  const textToHtml = (text: string) =>
    text.split("\n").filter(Boolean).map(line => `<p>${line}</p>`).join("") || "<p></p>";
  ```
- `editor → simple`: HTML을 플레인 텍스트로 변환 (태그 제거)
  ```tsx
  const htmlToText = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };
  ```
- `editor → simple` 전환 시 서식 손실 경고 confirm 표시

**Dynamic import**:
```tsx
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(
  () => import("@/components/expert/RichTextEditor"),
  { ssr: false, loading: () => <div className="h-[300px] animate-pulse rounded-lg bg-gray-100" /> }
);
```

#### `components/lectures/LectureDetailContent.tsx` — 렌더링

**변경 전** (L287-296):
```tsx
<p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-[var(--color-body)]">
  {lecture.detail}
</p>
```

**변경 후**:
```tsx
import DOMPurify from "dompurify";

const isHtml = (str: string) => /<[a-z][\s\S]*>/i.test(str);

// 렌더링 부분
{isHtml(lecture.detail) ? (
  <div
    className="prose prose-sm mt-4 max-w-none text-[var(--color-body)]"
    dangerouslySetInnerHTML={{
      __html: DOMPurify.sanitize(lecture.detail, {
        ALLOWED_TAGS: [
          "p", "h2", "h3", "strong", "em", "u", "s",
          "table", "thead", "tbody", "tr", "td", "th",
          "img", "a", "ul", "ol", "li", "br", "hr", "span",
        ],
        ALLOWED_ATTR: [
          "href", "src", "alt", "style", "colspan", "rowspan", "class", "target",
        ],
      }),
    }}
  />
) : (
  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-[var(--color-body)]">
    {lecture.detail}
  </p>
)}
```

**`prose` 스타일 오버라이드** (`globals.css` 추가):
```css
/* Rich editor content styles */
.rich-editor-content .tiptap {
  min-height: 300px;
  padding: 16px;
  outline: none;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-dark);
}

.rich-editor-content .tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: var(--color-muted);
  pointer-events: none;
  height: 0;
}

.rich-editor-content .tiptap table {
  border-collapse: collapse;
  width: 100%;
}

.rich-editor-content .tiptap td,
.rich-editor-content .tiptap th {
  border: 1px solid var(--color-border);
  padding: 8px 12px;
  min-width: 80px;
}

.rich-editor-content .tiptap th {
  background-color: #f9fafb;
  font-weight: 600;
}

.rich-editor-content .tiptap img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

/* 상세페이지 prose 오버라이드 */
.prose table {
  border-collapse: collapse;
  width: 100%;
}

.prose td,
.prose th {
  border: 1px solid var(--color-border);
  padding: 8px 12px;
}

.prose th {
  background-color: #f9fafb;
  font-weight: 600;
}

.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 8px 0;
}
```

### 3. 이미지 업로드 API

#### `app/api/expert/upload-image/route.ts`

```tsx
// POST /api/expert/upload-image
// 요청: FormData { file: File }
// 응답: { url: string }

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  // 검증
  // 1. 파일 존재 여부
  // 2. MIME 타입: image/jpeg, image/png, image/webp
  // 3. 파일 크기: <= 5MB
  // 4. 확장자: .jpg, .jpeg, .png, .webp

  // 저장
  const uuid = crypto.randomUUID();
  const ext = file.name.split(".").pop();
  const filename = `${uuid}.${ext}`;
  const savePath = `public/uploads/detail-images/${filename}`;

  // Buffer 쓰기
  const bytes = await file.arrayBuffer();
  await fs.writeFile(savePath, Buffer.from(bytes));

  return NextResponse.json({ url: `/uploads/detail-images/${filename}` });
}
```

**에디터에서 이미지 삽입 흐름**:
1. 툴바 이미지 버튼 클릭
2. `<input type="file" accept="image/*">` 다이얼로그 열림
3. 파일 선택 → `POST /api/expert/upload-image` 호출
4. 응답의 `url`로 `editor.chain().setImage({ src: url }).run()`
5. 업로드 중 버튼 비활성 + 스피너

### 4. 폰트 크기 커스텀 Extension

Tiptap의 `TextStyle`은 기본적으로 `font-size`를 지원하지 않으므로 커스텀 extension 필요:

```tsx
// lib/tiptap/FontSize.ts
import { Extension } from "@tiptap/core";

export const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        fontSize: {
          default: null,
          parseHTML: (el) => el.style.fontSize?.replace(/['"]+/g, ""),
          renderHTML: (attrs) => {
            if (!attrs.fontSize) return {};
            return { style: `font-size: ${attrs.fontSize}` };
          },
        },
      },
    }];
  },
  addCommands() {
    return {
      setFontSize: (size: string) => ({ chain }) =>
        chain().setMark("textStyle", { fontSize: size }).run(),
      unsetFontSize: () => ({ chain }) =>
        chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});
```

## 필요 패키지

```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-color @tiptap/extension-text-style @tiptap/extension-table @tiptap/extension-table-row @tiptap/extension-table-cell @tiptap/extension-table-header @tiptap/extension-image @tiptap/extension-link @tiptap/extension-text-align @tiptap/extension-underline @tiptap/extension-placeholder dompurify
npm install -D @types/dompurify
```

## 구현 순서

| # | 작업 | 파일 | 의존성 |
|---|------|------|--------|
| 1 | 패키지 설치 | `package.json` | 없음 |
| 2 | FontSize 커스텀 extension | `lib/tiptap/FontSize.ts` | #1 |
| 3 | EditorToolbar 컴포넌트 | `components/expert/EditorToolbar.tsx` | #1 |
| 4 | RichTextEditor 컴포넌트 | `components/expert/RichTextEditor.tsx` | #2, #3 |
| 5 | 에디터 CSS 추가 | `globals.css` | #4 |
| 6 | upload/page.tsx 모드 전환 연동 | `app/expert/upload/page.tsx` | #4 |
| 7 | 이미지 업로드 API | `app/api/expert/upload-image/route.ts` | 없음 |
| 8 | 상세페이지 HTML 렌더링 | `components/lectures/LectureDetailContent.tsx` | #1 (dompurify) |

## 검증 체크리스트

- [ ] 간편 입력 모드에서 텍스트 입력 후 상세페이지 표시 (기존 동작 유지)
- [ ] 에디터 모드에서 서식(B/I/U/S) 적용 후 상세페이지 HTML 렌더링
- [ ] 에디터에서 H2/H3 제목 적용 확인
- [ ] 폰트 크기 변경 (12~24px) 확인
- [ ] 텍스트 색상 변경 (8색) 확인
- [ ] 좌/중/우 정렬 확인
- [ ] 순서/비순서 리스트 확인
- [ ] 표 삽입 (행/열) 후 상세페이지 표시
- [ ] 이미지 업로드 후 에디터 삽입 + 상세페이지 표시
- [ ] 링크 삽입 후 상세페이지 클릭 동작
- [ ] 구분선 삽입 확인
- [ ] 모드 전환 (simple → editor → simple) 데이터 보존/변환
- [ ] editor → simple 전환 시 서식 손실 경고
- [ ] XSS 공격 코드 DOMPurify 차단
- [ ] 이미지 업로드 5MB 초과 에러 처리
- [ ] SSR 비활성 (dynamic import) 정상 동작
