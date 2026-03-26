import type { SocialProvider } from "@/types";

function NaverIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M13.5 10.5L6.3 0.8H0v18.4h6.5V9.5l7.2 9.7H20V0.8h-6.5v9.7z"
        fill="currentColor"
      />
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3C6.48 3 2 6.36 2 10.5c0 2.67 1.8 5.01 4.5 6.36-.15.54-.97 3.47-.99 3.69 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.7-2.43 4.28-2.84.6.09 1.24.14 1.88.14 5.52 0 10-3.36 10-7.5S17.52 3 12 3z"
        fill="currentColor"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

const providerConfig: Partial<Record<
  SocialProvider,
  { label: string; icon: () => React.ReactElement; className: string }
>> = {
  naver: {
    label: "네이버",
    icon: NaverIcon,
    className: "bg-[#03C75A] text-white hover:bg-[#02b351]",
  },
  kakao: {
    label: "카카오",
    icon: KakaoIcon,
    className: "bg-[#FEE500] text-[#191919] hover:bg-[#fdd800]",
  },
  google: {
    label: "Google",
    icon: GoogleIcon,
    className: "bg-white text-[#191919] border border-gray-300 hover:bg-gray-50",
  },
};

interface SocialLoginButtonProps {
  provider: SocialProvider;
  label?: string;
  onClick: () => void;
}

export default function SocialLoginButton({
  provider,
  label,
  onClick,
}: SocialLoginButtonProps) {
  const config = providerConfig[provider]!;
  const Icon = config.icon;

  if (label) {
    return (
      <button
        onClick={onClick}
        className={`flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg h-12 text-[15px] font-medium transition-colors ${config.className}`}
      >
        <Icon />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      title={`${config.label}로 계속하기`}
      className={`flex size-12 cursor-pointer items-center justify-center rounded-full transition-colors ${config.className}`}
    >
      <Icon />
    </button>
  );
}
