"use client";

import { useState, useCallback } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/consultation/Sidebar";
import ChatArea from "@/components/consultation/ChatArea";
import ChatInput from "@/components/consultation/ChatInput";
import SuggestChips from "@/components/consultation/SuggestChips";
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
        // Create new session
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
        // Add to existing session
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? { ...s, messages: [...s.messages, userMessage], updatedAt: now }
              : s
          )
        );
      }

      // Mock AI response
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

      // Set to pending
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

      // Simulate verification completion after 2s
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
    <div className="flex bg-[var(--color-light-bg)]" style={{ height: "calc(100vh - 120px)" }}>
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
      />

      {/* Chat Column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile-only top bar */}
        <div className="flex h-12 shrink-0 items-center gap-3 border-b border-[var(--color-border)] bg-white px-4 md:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 text-[var(--color-dark)] transition-colors hover:bg-gray-100"
            aria-label="메뉴"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-medium text-[var(--color-primary)]">
            AI 전문가 상담
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
    </div>
  );
}
