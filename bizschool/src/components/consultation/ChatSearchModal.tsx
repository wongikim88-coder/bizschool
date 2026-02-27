"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { X, Search, MessageSquare, Bot } from "lucide-react";
import { getSearchSnippet } from "@/data/consultation";
import type { ConsultationSession, ChatMessage } from "@/types";

interface ChatSearchModalProps {
  sessions: ConsultationSession[];
  isOpen: boolean;
  onClose: () => void;
  onSelectSession: (sessionId: string) => void;
}

export default function ChatSearchModal({
  sessions,
  isOpen,
  onClose,
  onSelectSession,
}: ChatSearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedSessionId(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    if (!query.trim()) return sessions;
    const q = query.toLowerCase();
    return sessions.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  }, [sessions, query]);

  // Selected session messages
  const selectedSession = selectedSessionId
    ? sessions.find((s) => s.id === selectedSessionId)
    : null;

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedSessionId) {
          setSelectedSessionId(null);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, selectedSessionId, onClose]);

  if (!isOpen) return null;

  const handleSessionClick = (sessionId: string) => {
    setSelectedSessionId(sessionId);
  };

  const handleGoToSession = (sessionId: string) => {
    onSelectSession(sessionId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 flex max-h-[70vh] w-full max-w-[640px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl mx-4">
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3">
          {selectedSessionId && (
            <button
              onClick={() => setSelectedSessionId(null)}
              className="shrink-0 rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-gray-100"
              aria-label="뒤로"
            >
              <MessageSquare size={18} />
            </button>
          )}
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-[var(--color-light-bg)] px-3 py-2.5">
            <Search
              size={18}
              className="shrink-0 text-[var(--color-muted)]"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedSessionId(null);
              }}
              placeholder="채팅 내역 검색..."
              className="min-w-0 flex-1 bg-transparent text-sm text-[var(--color-dark)] outline-none placeholder:text-[var(--color-muted)]"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setSelectedSessionId(null);
                }}
                className="shrink-0 text-[var(--color-muted)] hover:text-[var(--color-dark)]"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-gray-100"
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {selectedSession ? (
            /* Chat Detail View */
            <div>
              {/* Session title bar */}
              <div className="sticky top-0 flex items-center justify-between border-b border-[var(--color-border)] bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <MessageSquare
                    size={14}
                    className="text-[var(--color-primary)]"
                  />
                  <span className="text-sm font-semibold text-[var(--color-dark)]">
                    {selectedSession.title}
                  </span>
                </div>
                <button
                  onClick={() => handleGoToSession(selectedSession.id)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-light)]"
                >
                  이 채팅으로 이동
                </button>
              </div>

              {/* Messages */}
              <div className="px-4 py-3">
                {selectedSession.messages.map((msg) => (
                  <MessagePreview
                    key={msg.id}
                    message={msg}
                    query={query}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Session List View */
            <div className="py-2">
              {sessions.length === 0 ? (
                <div className="px-4 py-12 text-center text-sm text-[var(--color-muted)]">
                  대화 기록이 없습니다.
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="px-4 py-12 text-center text-sm text-[var(--color-muted)]">
                  &quot;{query}&quot;에 대한 검색 결과가 없습니다.
                </div>
              ) : (
                filteredSessions.map((s) => {
                  const matchedMessage = query
                    ? s.messages.find((m) =>
                        m.content
                          .toLowerCase()
                          .includes(query.toLowerCase())
                      )
                    : null;

                  return (
                    <button
                      key={s.id}
                      onClick={() => handleSessionClick(s.id)}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-light-bg)]"
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)]">
                        <MessageSquare
                          size={14}
                          className="text-[var(--color-primary)]"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[var(--color-dark)]">
                          {s.title}
                        </p>
                        <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                          {s.messages.length}개 메시지
                          {matchedMessage && (
                            <span className="ml-2 text-[var(--color-primary)]">
                              &middot;{" "}
                              {getSearchSnippet(
                                matchedMessage.content,
                                query,
                                20
                              )}
                            </span>
                          )}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-[var(--color-muted)]">
                        {new Date(s.updatedAt).toLocaleDateString("ko-KR", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Message Preview (inside modal) ─── */

function MessagePreview({
  message,
  query,
}: {
  message: ChatMessage;
  query: string;
}) {
  const isUser = message.role === "user";
  const isMatch =
    query &&
    message.content.toLowerCase().includes(query.toLowerCase());

  return (
    <div
      className={`mb-3 rounded-xl px-3 py-2.5 ${
        isMatch
          ? "bg-yellow-50 ring-1 ring-yellow-200"
          : isUser
            ? "bg-[var(--color-primary-light)]"
            : "bg-[var(--color-light-bg)]"
      }`}
    >
      <div className="mb-1 flex items-center gap-1.5">
        {isUser ? (
          <span className="text-xs font-medium text-[var(--color-primary)]">
            나
          </span>
        ) : (
          <>
            <Bot size={12} className="text-[var(--color-muted)]" />
            <span className="text-xs font-medium text-[var(--color-muted)]">
              AI 전문가
            </span>
          </>
        )}
      </div>
      <p className="line-clamp-3 text-sm leading-relaxed text-[var(--color-dark)]">
        {message.content}
      </p>
    </div>
  );
}
