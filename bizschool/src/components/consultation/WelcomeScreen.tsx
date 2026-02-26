import { MessageSquare } from "lucide-react";

export default function WelcomeScreen() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-light)]">
        <MessageSquare size={32} className="text-[var(--color-primary)]" />
      </div>
      <h1 className="mb-3 text-3xl font-bold text-[var(--color-dark)]">
        AI 전문가에게 물어보세요
      </h1>
      <p className="max-w-md text-lg text-[var(--color-muted)]">
        세무, 회계, 경리 관련 궁금한 점을
        <br />
        자유롭게 질문해 주세요.
      </p>
    </div>
  );
}
