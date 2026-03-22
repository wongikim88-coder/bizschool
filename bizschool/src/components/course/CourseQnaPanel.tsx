"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ArrowLeft,
  Clock,
  CheckCircle,
  PenSquare,
  MessageCircleQuestion,
} from "lucide-react";
import type { CourseQna, QnaAnswerStatus } from "@/types";

type QnaView = "list" | "detail" | "write";

type SnippetSource = "title" | "content" | "answer";

interface SearchResult {
  qna: CourseQna;
  /** Where the match was found (first match wins in priority order) */
  source: SnippetSource | null;
  /** Extracted snippet text around the match */
  snippet: string | null;
}

interface CourseQnaPanelProps {
  courseId: string;
  initialQnas: CourseQna[];
}

/** Highlight all occurrences of `query` inside `text` (case-insensitive) */
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="rounded-sm bg-yellow-200 px-0.5 text-[var(--color-dark)]"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/** Extract a snippet of ~60 chars around the first occurrence of `query` in `text` */
function extractSnippet(text: string, query: string): string | null {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return null;
  const RADIUS = 30;
  const start = Math.max(0, idx - RADIUS);
  const end = Math.min(text.length, idx + query.length + RADIUS);
  let snippet = text.slice(start, end).replace(/\n/g, " ");
  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";
  return snippet;
}

/** Search across title, content, answer and return results with snippets */
function searchQnas(qnas: CourseQna[], query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return qnas.map((qna) => ({ qna, source: null, snippet: null }));

  const results: SearchResult[] = [];
  for (const qna of qnas) {
    const titleMatch = qna.title.toLowerCase().includes(q);
    const contentMatch = qna.content.toLowerCase().includes(q);
    const answerMatch = qna.answer?.content.toLowerCase().includes(q) ?? false;

    if (!titleMatch && !contentMatch && !answerMatch) continue;

    // Pick best snippet: prefer content body, then answer, then title
    let source: SnippetSource;
    let snippet: string | null;
    if (contentMatch) {
      source = "content";
      snippet = extractSnippet(qna.content, query.trim());
    } else if (answerMatch) {
      source = "answer";
      snippet = extractSnippet(qna.answer!.content, query.trim());
    } else {
      source = "title";
      snippet = null; // title is already shown, no extra snippet needed
    }

    results.push({ qna, source, snippet });
  }
  return results;
}

function StatusBadge({ status }: { status: QnaAnswerStatus }) {
  if (status === "답변대기") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
        <Clock size={11} />
        답변대기
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--color-primary-light)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-primary)]">
      <CheckCircle size={11} />
      답변완료
    </span>
  );
}

export default function CourseQnaPanel({
  courseId,
  initialQnas,
}: CourseQnaPanelProps) {
  const [qnas, setQnas] = useState<CourseQna[]>(initialQnas);
  const [view, setView] = useState<QnaView>("list");
  const [selectedQnaId, setSelectedQnaId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Write form state
  const [writeTitle, setWriteTitle] = useState("");
  const [writeContent, setWriteContent] = useState("");
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const searchResults = useMemo(
    () => searchQnas(qnas, searchQuery),
    [qnas, searchQuery]
  );

  const selectedQna = useMemo(
    () => qnas.find((q) => q.id === selectedQnaId) ?? null,
    [qnas, selectedQnaId]
  );

  const isDirty = writeTitle.trim().length > 0 || writeContent.trim().length > 0;

  const handleOpenDetail = (id: string) => {
    setSelectedQnaId(id);
    setView("detail");
  };

  const handleBackToList = () => {
    setSelectedQnaId(null);
    setView("list");
  };

  const handleOpenWrite = () => {
    setWriteTitle("");
    setWriteContent("");
    setView("write");
  };

  const handleCancelWrite = () => {
    if (isDirty) {
      setShowLeaveModal(true);
    } else {
      setView("list");
    }
  };

  const handleSubmitWrite = () => {
    if (!writeTitle.trim() || !writeContent.trim()) return;

    const newQna: CourseQna = {
      id: `cq-${Date.now()}`,
      courseId,
      courseTitle: "",
      courseCategory: "온라인 강의",
      title: writeTitle.trim(),
      content: writeContent.trim(),
      createdAt: new Date().toISOString().split("T")[0],
      answerStatus: "답변대기",
    };

    setQnas((prev) => [newQna, ...prev]);
    setWriteTitle("");
    setWriteContent("");
    setView("list");
  };

  // ── List View ──
  if (view === "list") {
    return (
      <div className="flex h-full flex-col">
        {/* Search */}
        <div className="shrink-0 px-4 pt-3 pb-2">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="제목 · 본문 검색"
              className="w-full rounded-lg border border-[var(--color-border)] py-2 pl-9 pr-3 text-sm text-[var(--color-body)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        {/* Question list */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <MessageCircleQuestion
                size={36}
                className="text-[var(--color-border)]"
              />
              <p className="mt-3 text-sm text-[var(--color-muted)]">
                {searchQuery.trim()
                  ? "검색 결과가 없습니다"
                  : "등록된 질문이 없습니다"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {searchResults.map(({ qna, source, snippet }) => {
                const q = searchQuery.trim();
                const isSearching = q.length > 0;
                const sourceLabel =
                  source === "content"
                    ? "질문"
                    : source === "answer"
                      ? "답변"
                      : null;

                return (
                  <button
                    key={qna.id}
                    onClick={() => handleOpenDetail(qna.id)}
                    className="block w-full px-4 py-3 text-left transition-colors hover:bg-[var(--color-light-bg)]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--color-dark)]">
                        {isSearching ? (
                          <HighlightText text={qna.title} query={q} />
                        ) : (
                          qna.title
                        )}
                      </h4>
                      <StatusBadge status={qna.answerStatus} />
                    </div>
                    {/* Content snippet when search matches body */}
                    {isSearching && snippet && (
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[var(--color-body)]">
                        {sourceLabel && (
                          <span className="mr-1 inline-block rounded bg-[var(--color-light-bg)] px-1 py-px text-[10px] font-medium text-[var(--color-muted)]">
                            {sourceLabel}
                          </span>
                        )}
                        <HighlightText text={snippet} query={q} />
                      </p>
                    )}
                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      {qna.createdAt}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Write button - sticky bottom */}
        <button
          onClick={handleOpenWrite}
          className="flex shrink-0 items-center justify-center gap-2 border-t border-[var(--color-border)] bg-[var(--color-primary)] py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)]"
        >
          <PenSquare size={16} />
          질문하기
        </button>
      </div>
    );
  }

  // ── Detail View ──
  if (view === "detail" && selectedQna) {
    return (
      <div className="flex h-full flex-col">
        {/* Back header */}
        <div className="flex shrink-0 items-center gap-2 border-b border-[var(--color-border)] px-4 py-2.5">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 rounded px-1 py-1 text-[var(--color-muted)] transition-colors hover:text-[var(--color-dark)]"
            aria-label="목록으로 돌아가기"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Q&A 목록</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4">
          {/* Title + status */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 flex-1 text-[15px] font-bold leading-snug text-[var(--color-dark)]">
              {selectedQna.title}
            </h3>
            <StatusBadge status={selectedQna.answerStatus} />
          </div>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            {selectedQna.createdAt}
          </p>

          {/* Q block */}
          <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-white p-4">
            <p className="text-sm font-bold text-[var(--color-dark)]">Q</p>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[var(--color-dark)]">
              {selectedQna.content}
            </p>
          </div>

          {/* A block */}
          {selectedQna.answerStatus === "답변완료" && selectedQna.answer ? (
            <div className="mt-3 rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary-light)] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-[var(--color-primary)]">A</p>
                <p className="text-[11px] text-[var(--color-muted)]">
                  {selectedQna.answer.instructorName} 강사 |{" "}
                  {selectedQna.answer.answeredAt}
                </p>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[var(--color-dark)]">
                {selectedQna.answer.content}
              </p>
            </div>
          ) : (
            <div className="mt-3 rounded-xl bg-[var(--color-light-bg)] p-4 text-center">
              <Clock size={20} className="mx-auto text-[var(--color-muted)]" />
              <p className="mt-1.5 text-xs text-[var(--color-muted)]">
                담당 강사가 답변을 준비 중입니다.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Write View ──
  const isValid = writeTitle.trim() !== "" && writeContent.trim() !== "";

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-[var(--color-border)] px-4 py-2.5">
        <button
          onClick={handleCancelWrite}
          className="flex items-center gap-2 rounded px-1 py-1 text-[var(--color-muted)] transition-colors hover:text-[var(--color-dark)]"
          aria-label="목록으로 돌아가기"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Q&A 목록</span>
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[var(--color-dark)]">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={writeTitle}
              onChange={(e) => setWriteTitle(e.target.value)}
              placeholder="제목에 핵심 내용을 요약해보세요."
              className="mt-1.5 w-full rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm text-[var(--color-body)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-dark)]">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={writeContent}
              onChange={(e) => setWriteContent(e.target.value)}
              placeholder="질문 내용을 상세히 입력해주세요"
              className="mt-1.5 min-h-[180px] w-full resize-none rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm text-[var(--color-body)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="flex shrink-0 gap-2 border-t border-[var(--color-border)] bg-white p-3">
        <button
          onClick={handleCancelWrite}
          className="flex-1 rounded-lg border border-[var(--color-border)] py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
        >
          취소
        </button>
        <button
          onClick={handleSubmitWrite}
          disabled={!isValid}
          className="flex-1 rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          확인
        </button>
      </div>

      {/* Leave confirmation modal */}
      {showLeaveModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowLeaveModal(false)}
        >
          <div
            className="mx-4 w-full max-w-xs rounded-lg bg-white p-6"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <p className="mb-2 text-center font-medium text-[var(--color-dark)]">
              작성 중인 내용이 저장되지 않습니다.
            </p>
            <p className="mb-6 text-center text-sm text-[var(--color-muted)]">
              Q&A 목록으로 돌아가시겠습니까?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 rounded-lg border border-[var(--color-border)] py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
              >
                계속 작성
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLeaveModal(false);
                  setWriteTitle("");
                  setWriteContent("");
                  setView("list");
                }}
                className="flex-1 rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
              >
                목록으로 이동
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
