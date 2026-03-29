"use client";

import { useState, useImperativeHandle, forwardRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExt from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import { Table as TableExt } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import ImageExt from "@tiptap/extension-image";
import LinkExt from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import DOMPurify from "dompurify";
import { FontSize } from "@/lib/tiptap/FontSize";
import EditorToolbar from "./EditorToolbar";

export interface RichTextEditorHandle {
  setContent: (html: string) => void;
}

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    "p","h1","h2","h3","h4","h5","h6","strong","em","u","s",
    "ul","ol","li","table","thead","tbody","tr","th","td",
    "img","a","hr","br","blockquote","pre","code","span","div",
  ],
  ALLOWED_ATTR: ["href","target","src","alt","style","class","colspan","rowspan"],
};

const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(function RichTextEditor({
  content,
  onChange,
  placeholder = "내용을 입력해주세요.",
}, ref) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlSource, setHtmlSource] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      UnderlineExt,
      TextStyle,
      Color,
      FontSize,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TableExt.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      ImageExt.configure({ inline: true, allowBase64: false }),
      LinkExt.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

  useImperativeHandle(ref, () => ({
    setContent: (html: string) => {
      if (editor) {
        editor.commands.setContent(html);
        if (isHtmlMode) {
          setHtmlSource(html);
        }
      }
    },
  }), [editor, isHtmlMode]);

  const handleToggleHtmlMode = () => {
    if (!editor) return;

    if (isHtmlMode) {
      // HTML → WYSIWYG: sanitize 후 에디터에 반영
      const safe = DOMPurify.sanitize(htmlSource, SANITIZE_CONFIG);
      editor.commands.setContent(safe);
      onChange(editor.getHTML());
      setIsHtmlMode(false);
    } else {
      // WYSIWYG → HTML: 현재 에디터 내용을 textarea에 표시
      setHtmlSource(editor.getHTML());
      setIsHtmlMode(true);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 focus-within:border-[var(--color-primary)] focus-within:ring-1 focus-within:ring-[var(--color-primary)]">
      <EditorToolbar
        editor={editor}
        isHtmlMode={isHtmlMode}
        onToggleHtmlMode={handleToggleHtmlMode}
      />
      {isHtmlMode ? (
        <textarea
          value={htmlSource}
          onChange={(e) => setHtmlSource(e.target.value)}
          spellCheck={false}
          className="rich-editor-content w-full resize-none overflow-y-auto bg-gray-50 px-4 py-3 font-mono text-sm text-[var(--color-dark)] outline-none"
          style={{ minHeight: 600, maxHeight: 600 }}
        />
      ) : (
        <EditorContent editor={editor} className="rich-editor-content" />
      )}
    </div>
  );
});

export default RichTextEditor;
