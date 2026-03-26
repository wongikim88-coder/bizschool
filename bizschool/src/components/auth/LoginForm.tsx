"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import type { SocialProvider } from "@/types";
import SocialLoginButton from "@/components/auth/SocialLoginButton";

interface LoginFormProps {
  isSignup?: boolean;
}

export default function LoginForm({ isSignup = false }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = (provider: SocialProvider) => {
    signIn(provider, { callbackUrl: "/" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      } else {
        window.location.href = "/";
      }
    } catch {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-[var(--color-border)] px-4 py-3 text-[15px] text-[var(--color-dark)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none";

  return (
    <div className="w-full max-w-[400px] py-12 text-center">
      <Link href="/" className="inline-block font-logo text-3xl text-[var(--color-dark)] hover:opacity-80">
        BIZSCHOOL
      </Link>

      <div className="mb-8" />

      {/* 회원가입 버튼 (회원가입 모드만) */}
      {isSignup && (
        <button
          onClick={() => alert("회원가입 기능은 준비 중입니다.")}
          className="mb-6 w-full cursor-pointer rounded-lg bg-[var(--color-dark)] py-3 text-[15px] font-medium text-white transition-colors hover:bg-[var(--color-dark-deep)]"
        >
          회원가입
        </button>
      )}

      {/* 아이디/비밀번호 폼 (로그인 모드만) */}
      {!isSignup && (
        <>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <input
              type="text"
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-4 accent-[var(--color-dark)]"
              />
              <span className="text-sm text-[var(--color-muted)]">로그인 유지</span>
            </label>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer rounded-lg bg-[var(--color-dark)] py-3 text-[15px] font-medium text-white transition-colors hover:bg-[var(--color-dark-deep)] disabled:opacity-50"
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[var(--color-muted)]">
            <Link href="#" className="hover:text-[var(--color-dark)]">아이디 찾기</Link>
            <span>|</span>
            <Link href="#" className="hover:text-[var(--color-dark)]">비밀번호 찾기</Link>
            <span>|</span>
            <Link href="/login?mode=signup" className="hover:text-[var(--color-dark)]">회원가입</Link>
          </div>
        </>
      )}

      {/* 구분선 */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--color-border)]" />
        <span className="text-xs text-[var(--color-muted)]">{isSignup ? "SNS 간편가입" : "SNS 간편로그인"}</span>
        <div className="h-px flex-1 bg-[var(--color-border)]" />
      </div>

      {/* 소셜 로그인 */}
      {isSignup ? (
        <div className="flex flex-col gap-3">
          <SocialLoginButton
            provider="naver"
            label="네이버로 시작하기"
            onClick={() => handleSocialLogin("naver")}
          />
          <SocialLoginButton
            provider="kakao"
            label="카카오로 시작하기"
            onClick={() => handleSocialLogin("kakao")}
          />
          <SocialLoginButton
            provider="google"
            label="Google로 시작하기"
            onClick={() => handleSocialLogin("google")}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center gap-4">
          <SocialLoginButton
            provider="naver"
            onClick={() => handleSocialLogin("naver")}
          />
          <SocialLoginButton
            provider="kakao"
            onClick={() => handleSocialLogin("kakao")}
          />
          <SocialLoginButton
            provider="google"
            onClick={() => handleSocialLogin("google")}
          />
        </div>
      )}

      {isSignup && (
        <>
          <p className="mt-4 text-sm text-[var(--color-muted)]">
            이미 회원이신가요?{" "}
            <Link href="/login" className="font-medium text-[var(--color-primary)] hover:underline">
              로그인
            </Link>
          </p>
        </>
      )}

      <p className="mt-8 text-xs text-[var(--color-muted)]">
        Copyright &copy; 2016 더존비즈스쿨. All Rights Reserved.
      </p>
    </div>
  );
}
