"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Send } from "lucide-react";
import type { StudioQuestion, StudioQnaStatus } from "@/types";
import { studioQuestions as initialQuestions, expertCourses, getRelativeTime } from "@/data/expertStudio";

export default function StudioQna() {
  const [questions, setQuestions] = useState<StudioQuestion[]>(initialQuestions);
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | StudioQnaStatus>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const publishedCourses = expertCourses.filter((c) => c.status === "published");

  const filtered = questions
    .filter((q) => courseFilter === "all" || q.courseId === courseFilter)
    .filter((q) => statusFilter === "all" || q.status === statusFilter)
    .sort((a, b) => {
      if (a.status === "unanswered" && b.status === "answered") return -1;
      if (a.status === "answered" && b.status === "unanswered") return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const unansweredCount = questions.filter((q) => q.status === "unanswered").length;
  const answeredCount = questions.filter((q) => q.status === "answered").length;

  const handleReply = (questionId: string) => {
    if (!replyText.trim()) return;
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              status: "answered" as StudioQnaStatus,
              answer: {
                content: replyText,
                answeredAt: new Date().toISOString(),
              },
            }
          : q
      )
    );
    setReplyText("");
    setExpandedId(null);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-body)]"
        >
          <option value="all">전체 강의</option>
          {publishedCourses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | StudioQnaStatus)}
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-body)]"
        >
          <option value="all">전체 상태</option>
          <option value="unanswered">미답변</option>
          <option value="answered">답변완료</option>
        </select>
        <span className="text-sm text-[var(--color-muted)]">
          미답변 {unansweredCount}건 · 답변완료 {answeredCount}건
        </span>
      </div>

      {/* Question List */}
      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[var(--color-muted)]">해당 조건의 질문이 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {filtered.map((q) => {
              const isExpanded = expandedId === q.id;
              return (
                <div key={q.id}>
                  {/* Question Row */}
                  <button
                    onClick={() => {
                      setExpandedId(isExpanded ? null : q.id);
                      setReplyText("");
                    }}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-light-bg)]"
                  >
                    <div className="mt-1 shrink-0">
                      {isExpanded ? (
                        <ChevronDown size={16} className="text-[var(--color-muted)]" />
                      ) : (
                        <ChevronRight size={16} className="text-[var(--color-muted)]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            q.status === "unanswered"
                              ? "bg-red-50 text-red-500"
                              : "bg-green-50 text-green-600"
                          }`}
                        >
                          {q.status === "unanswered" ? "미답변" : "답변완료"}
                        </span>
                        <span className="text-xs text-[var(--color-muted)]">
                          {q.courseTitle}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-[var(--color-dark)]">
                        {q.title}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                        {q.studentName} · {getRelativeTime(q.createdAt)}
                      </p>
                    </div>
                  </button>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="border-t border-[var(--color-border)] bg-[var(--color-light-bg)] px-4 py-4">
                      {/* Question Content */}
                      <div className="mb-4 rounded-lg bg-white p-4">
                        <p className="text-sm font-medium text-[var(--color-dark)]">
                          Q. {q.title}
                        </p>
                        <p className="mt-2 text-sm text-[var(--color-body)]">
                          {q.content}
                        </p>
                        <p className="mt-2 text-xs text-[var(--color-muted)]">
                          {q.studentName} ·{" "}
                          {new Date(q.createdAt).toLocaleDateString("ko-KR")}
                        </p>
                      </div>

                      {/* Existing Answer */}
                      {q.answer && (
                        <div className="mb-4 rounded-lg border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-4">
                          <p className="mb-1 text-xs font-medium text-[var(--color-primary)]">
                            내 답변
                          </p>
                          <p className="text-sm text-[var(--color-body)]">
                            {q.answer.content}
                          </p>
                          <p className="mt-2 text-xs text-[var(--color-muted)]">
                            {new Date(q.answer.answeredAt).toLocaleDateString(
                              "ko-KR"
                            )}
                          </p>
                        </div>
                      )}

                      {/* Reply Form (only for unanswered) */}
                      {q.status === "unanswered" && (
                        <div>
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="답변을 작성해 주세요..."
                            rows={3}
                            className="w-full resize-none rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-body)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none"
                          />
                          <div className="mt-2 flex justify-end">
                            <button
                              onClick={() => handleReply(q.id)}
                              disabled={!replyText.trim()}
                              className="flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
                            >
                              <Send size={14} />
                              답변 등록
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
