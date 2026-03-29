"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Table,
  ImageIcon,
  Link2,
  Minus,
  ChevronDown,
  Palette,
  Loader2,
  Code2,
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor | null;
  isHtmlMode?: boolean;
  onToggleHtmlMode?: () => void;
}

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px"];

const COLORS = [
  "#000000",
  "#e03131",
  "#2f9e44",
  "#1971c2",
  "#f08c00",
  "#6741d9",
  "#0c8599",
  "#868e96",
];

function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`cursor-pointer rounded p-1.5 transition-colors ${
        isActive
          ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
          : "text-gray-600 hover:bg-gray-100"
      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-6 w-px bg-gray-200" />;
}

export default function EditorToolbar({ editor, isHtmlMode = false, onToggleHtmlMode }: EditorToolbarProps) {
  const [showFontSize, setShowFontSize] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [linkUrl, setLinkUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const fontSizeRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close popover on outside click
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (fontSizeRef.current && !fontSizeRef.current.contains(e.target as Node))
      setShowFontSize(false);
    if (colorRef.current && !colorRef.current.contains(e.target as Node))
      setShowColor(false);
    if (tableRef.current && !tableRef.current.contains(e.target as Node))
      setShowTable(false);
    if (linkRef.current && !linkRef.current.contains(e.target as Node))
      setShowLink(false);
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  if (!editor) return null;

  const currentFontSize =
    (editor.getAttributes("textStyle").fontSize as string) || "14px";

  const handleImageUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("이미지 크기는 5MB 이하만 업로드할 수 있습니다.");
      return;
    }
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      alert("JPG, PNG, WebP 형식만 업로드할 수 있습니다.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/expert/upload-image", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      editor.chain().focus().setImage({ src: url }).run();
    } catch {
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleSetLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().unsetLink().run();
    } else {
      const href = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
      editor.chain().focus().setLink({ href, target: "_blank" }).run();
    }
    setLinkUrl("");
    setShowLink(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 px-2 py-1.5">
      {/* Text formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        disabled={isHtmlMode}
        title="굵게"
      >
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        disabled={isHtmlMode}
        title="기울임"
      >
        <Italic size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        disabled={isHtmlMode}
        title="밑줄"
      >
        <Underline size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        disabled={isHtmlMode}
        title="취소선"
      >
        <Strikethrough size={16} />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        disabled={isHtmlMode}
        title="제목 2"
      >
        <Heading2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
        disabled={isHtmlMode}
        title="제목 3"
      >
        <Heading3 size={16} />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Font size dropdown */}
      <div className="relative" ref={fontSizeRef}>
        <button
          type="button"
          disabled={isHtmlMode}
          onClick={() => {
            setShowFontSize(!showFontSize);
            setShowColor(false);
            setShowTable(false);
            setShowLink(false);
          }}
          className={`flex items-center gap-1 rounded px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 ${isHtmlMode ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
          title="폰트 크기"
        >
          {currentFontSize}
          <ChevronDown size={12} />
        </button>
        {showFontSize && (
          <div className="absolute left-0 top-full z-50 mt-1 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  editor.chain().focus().setFontSize(size).run();
                  setShowFontSize(false);
                }}
                className={`block w-full cursor-pointer px-4 py-1.5 text-left text-sm hover:bg-gray-100 ${
                  currentFontSize === size
                    ? "font-medium text-[var(--color-primary)]"
                    : "text-gray-700"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Color palette */}
      <div className="relative" ref={colorRef}>
        <button
          type="button"
          disabled={isHtmlMode}
          onClick={() => {
            setShowColor(!showColor);
            setShowFontSize(false);
            setShowTable(false);
            setShowLink(false);
          }}
          className={`flex items-center gap-1 rounded p-1.5 text-gray-600 hover:bg-gray-100 ${isHtmlMode ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
          title="텍스트 색상"
        >
          <Palette size={16} />
          <ChevronDown size={12} />
        </button>
        {showColor && (
          <div className="absolute left-0 top-full z-50 mt-1 grid grid-cols-4 gap-1.5 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  editor.chain().focus().setColor(color).run();
                  setShowColor(false);
                }}
                className="h-6 w-6 cursor-pointer rounded-full border border-gray-200 transition-transform hover:scale-110"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>

      <ToolbarDivider />

      {/* Alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
        disabled={isHtmlMode}
        title="좌측 정렬"
      >
        <AlignLeft size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
        disabled={isHtmlMode}
        title="가운데 정렬"
      >
        <AlignCenter size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
        disabled={isHtmlMode}
        title="우측 정렬"
      >
        <AlignRight size={16} />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        disabled={isHtmlMode}
        title="글머리 기호 목록"
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        disabled={isHtmlMode}
        title="번호 목록"
      >
        <ListOrdered size={16} />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Table */}
      <div className="relative" ref={tableRef}>
        <ToolbarButton
          onClick={() => {
            setShowTable(!showTable);
            setShowFontSize(false);
            setShowColor(false);
            setShowLink(false);
          }}
          disabled={isHtmlMode}
          title="표 삽입"
        >
          <Table size={16} />
        </ToolbarButton>
        {showTable && (
          <div className="absolute left-0 top-full z-50 mt-1 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <label>
                행:
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={tableRows}
                  onChange={(e) => setTableRows(Number(e.target.value))}
                  className="ml-1 w-12 rounded border border-gray-300 px-1.5 py-0.5 text-center text-sm"
                />
              </label>
              <label>
                열:
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={tableCols}
                  onChange={(e) => setTableCols(Number(e.target.value))}
                  className="ml-1 w-12 rounded border border-gray-300 px-1.5 py-0.5 text-center text-sm"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={() => {
                editor
                  .chain()
                  .focus()
                  .insertTable({
                    rows: tableRows,
                    cols: tableCols,
                    withHeaderRow: true,
                  })
                  .run();
                setShowTable(false);
              }}
              className="mt-2 w-full cursor-pointer rounded-md bg-[var(--color-primary)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)]"
            >
              삽입
            </button>
          </div>
        )}
      </div>

      {/* Image */}
      <ToolbarButton
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || isHtmlMode}
        title="이미지 삽입"
      >
        {uploading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <ImageIcon size={16} />
        )}
      </ToolbarButton>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
          e.target.value = "";
        }}
      />

      {/* Link */}
      <div className="relative" ref={linkRef}>
        <ToolbarButton
          onClick={() => {
            const existing = editor.getAttributes("link").href || "";
            setLinkUrl(existing);
            setShowLink(!showLink);
            setShowFontSize(false);
            setShowColor(false);
            setShowTable(false);
          }}
          isActive={editor.isActive("link")}
          disabled={isHtmlMode}
          title="링크 삽입"
        >
          <Link2 size={16} />
        </ToolbarButton>
        {showLink && (
          <div className="absolute right-0 top-full z-50 mt-1 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSetLink()}
                placeholder="https://example.com"
                className="w-52 rounded border border-gray-300 px-2 py-1 text-sm outline-none focus:border-[var(--color-primary)]"
              />
              <button
                type="button"
                onClick={handleSetLink}
                className="cursor-pointer rounded-md bg-[var(--color-primary)] px-3 py-1 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)]"
              >
                확인
              </button>
            </div>
          </div>
        )}
      </div>

      <ToolbarDivider />

      {/* Horizontal rule */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        disabled={isHtmlMode}
        title="구분선"
      >
        <Minus size={16} />
      </ToolbarButton>

      <ToolbarDivider />

      {/* HTML 모드 토글 */}
      {onToggleHtmlMode && (
        <ToolbarButton
          onClick={onToggleHtmlMode}
          isActive={isHtmlMode}
          title={isHtmlMode ? "비주얼 편집" : "HTML 편집"}
        >
          <Code2 size={16} />
        </ToolbarButton>
      )}
    </div>
  );
}
