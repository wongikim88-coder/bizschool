import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "로그인 - BIZSCHOOL",
  description: "소셜 계정으로 BIZSCHOOL에 간편하게 로그인하세요.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;
  const isSignup = params.mode === "signup";

  return (
    <div className="flex min-h-screen justify-center px-4 pt-[15vh]">
      <LoginForm isSignup={isSignup} />
    </div>
  );
}
