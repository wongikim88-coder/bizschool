"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import ChatMessage from "./ChatMessage";
import WelcomeScreen from "./WelcomeScreen";
import type { ChatMessage as ChatMessageType } from "@/types";

interface ChatAreaProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  onRequestVerification: (messageId: string) => void;
}

export default function ChatArea({
  messages,
  isLoading,
  onRequestVerification,
}: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return <WelcomeScreen />;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="py-4">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onRequestVerification={
              msg.role === "assistant" ? onRequestVerification : undefined
            }
          />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 px-4 py-3">
            <div className="mx-auto flex max-w-[768px] items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)]">
                <Loader2 size={18} className="animate-spin text-white" />
              </div>
              <span className="text-sm text-[var(--color-muted)]">
                답변을 생성하고 있습니다...
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
