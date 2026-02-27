"use client";

import { useState, useCallback } from "react";
import { Menu, SquarePen } from "lucide-react";
import Sidebar from "@/components/consultation/Sidebar";
import ChatArea from "@/components/consultation/ChatArea";
import ChatInput from "@/components/consultation/ChatInput";
import SuggestChips from "@/components/consultation/SuggestChips";
import ChatSearchModal from "@/components/consultation/ChatSearchModal";
import {
  getMockResponse,
  generateId,
  getSessionTitle,
} from "@/data/consultation";
import type { ConsultationSession, ChatMessage } from "@/types";

export default function ConsultingPage() {
  const [sessions, setSessions] = useState<ConsultationSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const messages = currentSession?.messages ?? [];

  const handleSendMessage = useCallback(
    (content: string) => {
      const now = new Date().toISOString();
      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content,
        createdAt: now,
      };

      let sessionId = currentSessionId;

      if (!sessionId) {
        const newSession: ConsultationSession = {
          id: generateId(),
          title: getSessionTitle(content),
          createdAt: now,
          updatedAt: now,
          messages: [userMessage],
        };
        setSessions((prev) => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
        sessionId = newSession.id;
      } else {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? { ...s, messages: [...s.messages, userMessage], updatedAt: now }
              : s
          )
        );
      }

      setIsLoading(true);
      const capturedSessionId = sessionId;
      setTimeout(() => {
        const aiMessage: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content: getMockResponse(content),
          createdAt: new Date().toISOString(),
          expertVerification: { status: "none" },
        };

        setSessions((prev) =>
          prev.map((s) =>
            s.id === capturedSessionId
              ? {
                  ...s,
                  messages: [...s.messages, aiMessage],
                  updatedAt: aiMessage.createdAt,
                }
              : s
          )
        );
        setIsLoading(false);
      }, 1500);
    },
    [currentSessionId]
  );

  const handleNewChat = useCallback(() => {
    setCurrentSessionId(null);
  }, []);

  const handleSelectSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
    setSidebarOpen(false); // mobile: close sidebar
  }, []);

  const handleRequestVerification = useCallback(
    (messageId: string) => {
      if (!currentSessionId) return;

      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId
            ? {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === messageId
                    ? { ...m, expertVerification: { status: "pending" as const } }
                    : m
                ),
              }
            : s
        )
      );

      setTimeout(() => {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === currentSessionId
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === messageId
                      ? {
                          ...m,
                          expertVerification: {
                            status: "verified" as const,
                            expertName: "김세무 세무사",
                            verifiedAt: new Date().toISOString(),
                            comment: "AI 답변이 정확합니다.",
                          },
                        }
                      : m
                  ),
                }
              : s
          )
        );
      }, 2000);
    },
    [currentSessionId]
  );

  const handleSuggestChipClick = useCallback(
    (query: string) => {
      handleSendMessage(query);
    },
    [handleSendMessage]
  );

  return (
    <div
      className="flex bg-[var(--color-light-bg)]"
      style={{ height: "calc(100vh - 64px)" }}
    >
      {/* Icon Rail - desktop only, when sidebar closed */}
      {!sidebarOpen && (
        <div
          className="hidden shrink-0 flex-col items-center gap-2 border-r border-[var(--color-border)] bg-white py-3 md:flex"
          style={{ width: "52px" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-[var(--color-dark)] transition-colors hover:bg-gray-100"
            aria-label="메뉴 열기"
          >
            <Menu size={20} />
          </button>
          <button
            onClick={handleNewChat}
            className="rounded-lg p-2 text-[var(--color-dark)] transition-colors hover:bg-gray-100"
            aria-label="새 채팅"
          >
            <SquarePen size={20} />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onSearchOpen={() => setSearchModalOpen(true)}
      />

      {/* Chat Column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex h-12 shrink-0 items-center gap-3 px-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 text-[var(--color-dark)] transition-colors hover:bg-gray-100 md:hidden"
            aria-label="메뉴"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-[var(--color-dark)]">
            AI 전문가상담{" "}
            <span className="rounded-full bg-[var(--color-primary)] px-1.5 py-0.5 text-[10px] font-bold text-white">
              Beta
            </span>
          </span>
        </div>

        <ChatArea
          messages={messages}
          isLoading={isLoading}
          onRequestVerification={handleRequestVerification}
        />
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        <SuggestChips onChipClick={handleSuggestChipClick} />
      </div>

      {/* Chat Search Modal */}
      <ChatSearchModal
        sessions={sessions}
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectSession={handleSelectSession}
      />
    </div>
  );
}
