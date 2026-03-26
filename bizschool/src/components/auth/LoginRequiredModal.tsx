"use client";

import { useRouter } from "next/navigation";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  callbackUrl?: string;
}

export default function LoginRequiredModal({
  isOpen,
  onClose,
  callbackUrl,
}: LoginRequiredModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogin = () => {
    const url = callbackUrl
      ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/login";
    router.push(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-[360px] rounded-2xl bg-white p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-2 text-lg font-bold text-[var(--color-dark)]">
          로그인이 필요합니다
        </h2>
        <p className="mb-6 text-sm text-[var(--color-muted)]">
          이 기능을 이용하려면
          <br />
          로그인이 필요합니다.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-lg border border-[var(--color-border)] px-6 py-2.5 text-sm text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
          >
            닫기
          </button>
          <button
            onClick={handleLogin}
            className="flex-1 cursor-pointer rounded-lg bg-[var(--color-primary)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)]"
          >
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
}
