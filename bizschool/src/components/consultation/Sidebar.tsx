"use client";

import { X, SquarePen, MessageSquare } from "lucide-react";
import { groupSessionsByDate } from "@/data/consultation";
import type { ConsultationSession } from "@/types";

interface SidebarProps {
  sessions: ConsultationSession[];
  currentSessionId: string | null;
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
}

export default function Sidebar({
  sessions,
  currentSessionId,
  isOpen,
  onToggle,
  onNewChat,
  onSelectSession,
}: SidebarProps) {
  const grouped = groupSessionsByDate(sessions);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed left-0 top-14 z-50 flex h-[calc(100vh-56px)] w-[280px] flex-col border-r border-[var(--color-border)] bg-white transition-transform duration-200
          md:static md:z-auto md:h-auto md:w-[260px] md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full md:hidden"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-3 py-3">
          <button
            onClick={onNewChat}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-dark)] transition-colors hover:bg-gray-100"
          >
            <SquarePen size={16} />
            새 채팅
          </button>
          <button
            onClick={onToggle}
            className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-gray-100 md:hidden"
            aria-label="사이드바 닫기"
          >
            <X size={18} />
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {sessions.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-[var(--color-muted)]">
              대화 기록이 없습니다.
              <br />
              새 채팅을 시작해 보세요.
            </div>
          ) : (
            Object.entries(grouped).map(([dateLabel, groupSessions]) => (
              <div key={dateLabel} className="mb-3">
                <p className="mb-1 px-3 text-xs font-medium text-[var(--color-muted)]">
                  {dateLabel}
                </p>
                {groupSessions.map((s) => {
                  const isActive = s.id === currentSessionId;
                  return (
                    <button
                      key={s.id}
                      onClick={() => onSelectSession(s.id)}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        isActive
                          ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                          : "text-[var(--color-dark)] hover:bg-gray-50"
                      }`}
                    >
                      <MessageSquare size={14} className="shrink-0 opacity-60" />
                      <span className="truncate">{s.title}</span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
