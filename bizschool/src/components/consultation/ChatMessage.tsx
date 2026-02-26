"use client";

import { Bot, Copy, ThumbsUp, ThumbsDown, ShieldCheck } from "lucide-react";
import ExpertBadge from "./ExpertBadge";
import type { ChatMessage as ChatMessageType } from "@/types";

interface ChatMessageProps {
  message: ChatMessageType;
  onRequestVerification?: (messageId: string) => void;
}

export default function ChatMessage({
  message,
  onRequestVerification,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  if (isUser) {
    return (
      <div className="flex justify-end px-4 py-3">
        <div className="max-w-[80%] rounded-2xl bg-[var(--color-primary-light)] px-4 py-3 text-[15px] text-[var(--color-dark)]">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  const verification = message.expertVerification ?? { status: "none" as const };
  const isVerified = verification.status === "verified";
  const isPending = verification.status === "pending";

  return (
    <div className="group px-4 py-3">
      <div className="mx-auto max-w-[768px]">
        {/* Avatar + Name */}
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)]">
            <Bot size={18} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-[var(--color-dark)]">
            AI 전문가
          </span>
        </div>

        {/* Expert Badge */}
        <ExpertBadge verification={verification} />

        {/* Content */}
        <div className="prose-sm mb-3 text-[15px] leading-relaxed text-[var(--color-dark)]">
          {message.content.split("\n").map((line, i) => {
            if (line.startsWith("**") && line.endsWith("**")) {
              return (
                <p key={i} className="mt-3 mb-1 font-semibold">
                  {line.replace(/\*\*/g, "")}
                </p>
              );
            }
            if (line.startsWith("- ")) {
              return (
                <p key={i} className="ml-4">
                  {line}
                </p>
              );
            }
            if (line.startsWith("| ")) {
              return (
                <p key={i} className="font-mono text-xs">
                  {line}
                </p>
              );
            }
            if (line === "") {
              return <br key={i} />;
            }
            return <p key={i}>{line}</p>;
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 md:opacity-0 max-md:opacity-100">
          {!isVerified && !isPending && onRequestVerification && (
            <button
              onClick={() => onRequestVerification(message.id)}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--color-primary)] px-3 py-1.5 text-xs font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-light)]"
            >
              <ShieldCheck size={14} />
              전문가 검증 신청
            </button>
          )}
          {isPending && (
            <span className="flex items-center gap-1.5 rounded-lg border border-yellow-300 px-3 py-1.5 text-xs font-medium text-yellow-700">
              <ShieldCheck size={14} />
              검증 대기 중
            </span>
          )}
          {isVerified && (
            <span className="flex items-center gap-1.5 rounded-lg border border-green-300 px-3 py-1.5 text-xs font-medium text-green-700">
              <ShieldCheck size={14} />
              전문가 검증 완료
            </span>
          )}
          <button
            onClick={handleCopy}
            className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-gray-100"
            aria-label="복사"
          >
            <Copy size={14} />
          </button>
          <button
            className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-gray-100"
            aria-label="좋아요"
          >
            <ThumbsUp size={14} />
          </button>
          <button
            className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-gray-100"
            aria-label="싫어요"
          >
            <ThumbsDown size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
