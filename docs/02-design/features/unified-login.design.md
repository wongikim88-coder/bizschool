# 통합로그인 (Unified Social Login) Design Document

> **Feature**: unified-login
> **Plan Reference**: `docs/01-plan/features/unified-login.plan.md`
> **Date**: 2026-03-23
> **Status**: Draft

---

## 1. Component Architecture

### 1.1 Component Tree

```
app/layout.tsx (Server Component) ── 기존 수정 (AuthProvider 래핑)
├── contexts/AuthProvider.tsx (Client) ── 신규 (SessionProvider 래퍼)
│
app/login/page.tsx (Server Component) ── 신규
├── components/auth/LoginForm.tsx (Client) ── 신규
│   └── components/auth/SocialLoginButton.tsx ── 신규
│       └── 네이버 / 카카오 / 구글 버튼 (각 프로바이더별 색상 및 아이콘)
│
app/api/auth/[...nextauth]/route.ts ── 신규 (NextAuth API 핸들러)
│
lib/auth.ts ── 신규 (NextAuth 설정, 프로바이더, 콜백)
│
components/layout/Header.tsx (Client) ── 기존 수정
├── 비로그인: "로그인" 버튼
└── 로그인: components/auth/UserMenu.tsx (Client) ── 신규
    └── 프로필 이미지 + 이름 + 드롭다운 (마이페이지, 로그아웃)
│
components/auth/LoginRequiredModal.tsx (Client) ── 신규
└── 보호 페이지 접근 시 로그인 유도 모달
```

### 1.2 Component Responsibilities

| Component | Type | File | Responsibility |
|-----------|------|------|----------------|
| `app/layout.tsx` | Server | 기존 수정 | AuthProvider로 children 래핑 |
| `AuthProvider.tsx` | Client | 신규 | NextAuth SessionProvider 래퍼, `"use client"` 분리 |
| `lib/auth.ts` | Server | 신규 | NextAuth 설정 (프로바이더 3종, JWT 콜백, 세션 콜백) |
| `route.ts` | API | 신규 | NextAuth GET/POST 핸들러 export |
| `login/page.tsx` | Server | 신규 | 로그인 페이지 라우트, metadata |
| `LoginForm.tsx` | Client | 신규 | 소셜 로그인 버튼 3종 렌더링, signIn() 호출 |
| `SocialLoginButton.tsx` | - | 신규 | 개별 소셜 버튼 (아이콘 + 텍스트 + 브랜드 색상) |
| `Header.tsx` | Client | 기존 수정 | useSession()으로 로그인 상태 분기 |
| `UserMenu.tsx` | Client | 신규 | 로그인 사용자 드롭다운 메뉴 (마이페이지, 로그아웃) |
| `LoginRequiredModal.tsx` | Client | 신규 | 보호 페이지 접근 시 로그인 안내 + 로그인 버튼 |

### 1.3 신규 파일 목록

```
신규 생성:
├── src/lib/auth.ts                              # NextAuth 설정
├── src/app/api/auth/[...nextauth]/route.ts      # NextAuth API 핸들러
├── src/contexts/AuthProvider.tsx                 # SessionProvider 래퍼
├── src/app/login/page.tsx                        # 로그인 페이지
├── src/components/auth/LoginForm.tsx             # 소셜 로그인 폼
├── src/components/auth/SocialLoginButton.tsx     # 소셜 버튼 컴포넌트
├── src/components/auth/UserMenu.tsx              # 사용자 드롭다운 메뉴
├── src/components/auth/LoginRequiredModal.tsx    # 로그인 유도 모달
└── .env.local.example                           # 환경변수 템플릿

기존 수정:
├── src/app/layout.tsx                           # AuthProvider 래핑
├── src/components/layout/Header.tsx             # 로그인 상태 분기
├── src/components/layout/LayoutContent.tsx      # login 페이지 SearchBar 숨김
├── src/types/index.ts                           # AuthUser 타입 추가
└── src/data/mypage.ts                           # MockUser fallback 로직 (선택적)
```

---

## 2. Data Model

### 2.1 Type Definitions (`types/index.ts` 추가)

```typescript
// ── 인증 ──

export type SocialProvider = "naver" | "kakao" | "google";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  provider: SocialProvider;
}
```

### 2.2 NextAuth 타입 확장 (`lib/auth.ts` 내부 또는 `types/next-auth.d.ts`)

```typescript
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      provider?: SocialProvider;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: SocialProvider;
  }
}
```

---

## 3. NextAuth Configuration (`lib/auth.ts`)

### 3.1 프로바이더 설정

```typescript
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

// 네이버 커스텀 프로바이더
const Naver = {
  id: "naver",
  name: "Naver",
  type: "oauth" as const,
  authorization: {
    url: "https://nid.naver.com/oauth2.0/authorize",
    params: { response_type: "code" },
  },
  token: "https://nid.naver.com/oauth2.0/token",
  userinfo: "https://openapi.naver.com/v1/nid/me",
  profile(profile: any) {
    return {
      id: profile.response.id,
      name: profile.response.name || profile.response.nickname,
      email: profile.response.email,
      image: profile.response.profile_image,
    };
  },
  clientId: process.env.NAVER_CLIENT_ID!,
  clientSecret: process.env.NAVER_CLIENT_SECRET!,
};

// 카카오 커스텀 프로바이더
const Kakao = {
  id: "kakao",
  name: "Kakao",
  type: "oauth" as const,
  authorization: {
    url: "https://kauth.kakao.com/oauth/authorize",
    params: { response_type: "code" },
  },
  token: "https://kauth.kakao.com/oauth/token",
  userinfo: "https://kapi.kakao.com/v2/user/me",
  profile(profile: any) {
    return {
      id: String(profile.id),
      name: profile.kakao_account?.profile?.nickname,
      email: profile.kakao_account?.email,
      image: profile.kakao_account?.profile?.thumbnail_image_url,
    };
  },
  clientId: process.env.KAKAO_CLIENT_ID!,
  clientSecret: process.env.KAKAO_CLIENT_SECRET!,
};

const config: NextAuthConfig = {
  providers: [
    Naver,
    Kakao,
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",    // 커스텀 로그인 페이지
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.provider = account.provider as SocialProvider;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.provider) {
        session.user.provider = token.provider as SocialProvider;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
```

### 3.2 API Route (`app/api/auth/[...nextauth]/route.ts`)

```typescript
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

### 3.3 AuthProvider (`contexts/AuthProvider.tsx`)

```typescript
"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

### 3.4 layout.tsx 수정

```typescript
// 변경: AuthProvider 래핑 추가
import AuthProvider from "@/contexts/AuthProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${squadaOne.variable} ${notoSansKR.variable} antialiased`}>
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

## 4. Page & Routing Design

### 4.1 login/page.tsx (로그인 페이지)

```typescript
import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "로그인 - BIZSCHOOL",
  description: "소셜 계정으로 BIZSCHOOL에 간편하게 로그인하세요.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}
```

### 4.2 LayoutContent.tsx 수정

```typescript
// hideSearchBar에 login 페이지 추가
const hideSearchBar = pathname === "/login" || pathname === "/about" || /* 기존 조건들... */;
```

---

## 5. UI Specification

### 5.1 LoginForm (로그인 폼)

```
┌────────────────────────────────────────────┐
│                                            │
│              BIZSCHOOL                     │  ← font-logo text-3xl
│                                            │
│    소셜 계정으로 간편하게 로그인하세요       │  ← text-[var(--color-muted)] text-sm
│                                            │
│   ┌──────────────────────────────────┐     │
│   │  [N]  네이버로 로그인             │     │  ← bg-[#03C75A] text-white
│   └──────────────────────────────────┘     │
│                                            │  ← gap-3
│   ┌──────────────────────────────────┐     │
│   │  [💬]  카카오로 로그인            │     │  ← bg-[#FEE500] text-[#191919]
│   └──────────────────────────────────┘     │
│                                            │
│   ┌──────────────────────────────────┐     │
│   │  [G]  Google로 로그인            │     │  ← bg-white border text-[#191919]
│   └──────────────────────────────────┘     │
│                                            │
│   로그인 시 서비스 이용약관과               │  ← text-xs text-[var(--color-muted)]
│   개인정보 처리방침에 동의합니다.           │
│                                            │
└────────────────────────────────────────────┘
```

**컨테이너 스타일**:
- `w-full max-w-[400px] text-center`
- 패딩: `py-12`

**로고**: `font-logo text-3xl text-[var(--color-dark)]`

**안내 텍스트**: `text-sm text-[var(--color-muted)] mt-2 mb-8`

**버튼 그룹**: `flex flex-col gap-3`

### 5.2 SocialLoginButton 상세

```typescript
interface SocialLoginButtonProps {
  provider: "naver" | "kakao" | "google";
  onClick: () => void;
}
```

| 프로바이더 | 배경색 | 텍스트색 | 호버 | 아이콘 |
|-----------|--------|---------|------|--------|
| 네이버 | `bg-[#03C75A]` | `text-white` | `hover:bg-[#02b351]` | SVG "N" 로고 (16x16) |
| 카카오 | `bg-[#FEE500]` | `text-[#191919]` | `hover:bg-[#fdd800]` | SVG 말풍선 로고 (18x18) |
| 구글 | `bg-white border border-gray-300` | `text-[#191919]` | `hover:bg-gray-50` | SVG "G" 로고 (18x18) |

**공통 버튼 스타일**:
```
flex items-center justify-center gap-3 w-full h-12 rounded-lg text-[15px] font-medium
transition-colors cursor-pointer
```

**아이콘 구현**: 각 프로바이더의 공식 SVG 로고를 인라인으로 포함 (외부 이미지 의존 없음)

### 5.3 Header 수정 - 로그인 상태 분기

**비로그인 상태** (기존 "마이페이지" 자리):
```
┌─────────────────────────────────────────────────────────────────┐
│ BIZSCHOOL    공개교육  근로자주도훈련  강의  도서  ...    [로그인] │
└─────────────────────────────────────────────────────────────────┘
```
- "로그인" 버튼: `<Link href="/login">` — `text-sm font-medium text-[var(--color-primary)]`
- 기존 "마이페이지" 링크 → 비로그인 시 "로그인"으로 교체

**로그인 상태**:
```
┌──────────────────────────────────────────────────────────────────────┐
│ BIZSCHOOL    공개교육  근로자주도훈련  강의  도서  ...   👤 김비즈 ▾  │
└──────────────────────────────────────────────────────────────────────┘
```
- UserMenu 컴포넌트로 렌더링

### 5.4 UserMenu (드롭다운 메뉴)

```
┌───────────────────┐
│ 👤 김비즈 ▾       │  ← 트리거 버튼
├───────────────────┤
│  ☺  마이페이지     │  ← Link /mypage
│  ↪  로그아웃       │  ← signOut() 호출
└───────────────────┘
```

**트리거 버튼**:
- 프로필 이미지 (있으면 `<img>` 20x20 rounded-full, 없으면 `<UserCircle>` 아이콘)
- 이름 표시: `text-sm font-medium text-[var(--color-dark)]`
- ChevronDown 아이콘: `size={14}`

**드롭다운 패널**:
- `absolute right-0 mt-2 w-48 rounded-lg border border-[var(--color-border)] bg-white shadow-lg py-1 z-50`
- 각 메뉴 항목: `block w-full px-4 py-2.5 text-sm text-left hover:bg-[var(--color-light-bg)]`

**상태 관리**: `useState<boolean>` — 클릭 토글 + 외부 클릭 닫기

### 5.5 LoginRequiredModal

```
┌──────────────────────────────────────────┐
│  (반투명 오버레이)                         │
│  ┌────────────────────────────────┐       │
│  │                                │       │
│  │    로그인이 필요합니다           │       │
│  │                                │       │
│  │  이 기능을 이용하려면           │       │
│  │  로그인이 필요합니다.           │       │
│  │                                │       │
│  │  [로그인하기]    [닫기]         │       │
│  │                                │       │
│  └────────────────────────────────┘       │
└──────────────────────────────────────────┘
```

**오버레이**: `fixed inset-0 bg-black/50 z-50 flex items-center justify-center`

**모달 패널**: `bg-white rounded-2xl p-8 max-w-[360px] w-full mx-4 text-center`

**제목**: `text-lg font-bold text-[var(--color-dark)] mb-2`

**설명**: `text-sm text-[var(--color-muted)] mb-6`

**로그인하기 버튼**: `bg-[var(--color-primary)] text-white rounded-lg px-6 py-2.5 font-medium`
- 클릭 시: `router.push("/login")` (현재 URL을 callbackUrl로 전달)

**닫기 버튼**: `border border-[var(--color-border)] text-[var(--color-body)] rounded-lg px-6 py-2.5`

---

## 6. State Management

### 6.1 인증 상태 플로우

```
NextAuth SessionProvider (전역)
  ↓
useSession() hook
  ↓ { data: session, status }
각 컴포넌트에서 접근
```

**status 값**:
| status | 의미 | 사용 |
|--------|------|------|
| `"loading"` | 세션 확인 중 | 스켈레톤 또는 빈 상태 표시 |
| `"authenticated"` | 로그인됨 | 사용자 정보 표시, 보호 기능 허용 |
| `"unauthenticated"` | 비로그인 | 로그인 버튼 표시, 보호 기능 차단 |

### 6.2 Header 세션 사용

```typescript
"use client";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header>
      {/* ...기존 네비게이션... */}
      <div className="hidden items-center gap-6 md:flex">
        {/* 기존 조견표, 전문가지원 링크 유지 */}
        {status === "authenticated" && session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <Link href="/login" className="...">
            <LogIn size={18} />
            <span>로그인</span>
          </Link>
        )}
      </div>
    </header>
  );
}
```

### 6.3 UserMenu 상태 관리

```typescript
"use client";
import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";

export default function UserMenu({ user }: { user: Session["user"] }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지하여 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button onClick={() => setIsOpen(!isOpen)}>
        {/* 프로필 이미지 + 이름 + ChevronDown */}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 ...">
          <Link href="/mypage">마이페이지</Link>
          <button onClick={() => signOut({ callbackUrl: "/" })}>로그아웃</button>
        </div>
      )}
    </div>
  );
}
```

### 6.4 LoginForm signIn 호출

```typescript
"use client";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const handleSocialLogin = (provider: "naver" | "kakao" | "google") => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="w-full max-w-[400px] text-center">
      {/* 로고, 안내 텍스트 */}
      <div className="flex flex-col gap-3">
        <SocialLoginButton provider="naver" onClick={() => handleSocialLogin("naver")} />
        <SocialLoginButton provider="kakao" onClick={() => handleSocialLogin("kakao")} />
        <SocialLoginButton provider="google" onClick={() => handleSocialLogin("google")} />
      </div>
      {/* 동의 문구 */}
    </div>
  );
}
```

### 6.5 보호 라우트 패턴

서버 사이드에서 세션 체크하는 패턴:

```typescript
// app/mypage/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MypagePage({ searchParams }) {
  const session = await auth();

  // 비로그인 시 로그인 페이지로 리다이렉트
  if (!session) {
    redirect("/login?callbackUrl=/mypage");
  }

  // 기존 마이페이지 로직...
  // session.user를 MockUser 대신 사용 가능
}
```

클라이언트 사이드 보호 (모달 방식):

```typescript
// 전문가상담 등록 버튼 클릭 시
const { data: session } = useSession();
const [showLoginModal, setShowLoginModal] = useState(false);

const handleWriteClick = () => {
  if (!session) {
    setShowLoginModal(true);
    return;
  }
  router.push("/community/expert/write");
};
```

---

## 7. SVG Icon Specifications

### 7.1 네이버 N 로고

```typescript
// 16x16, 녹색 바탕에 흰색 N
const NaverIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M13.5 10.5L6.3 0.8H0v18.4h6.5V9.5l7.2 9.7H20V0.8h-6.5v9.7z" fill="currentColor" />
  </svg>
);
```

### 7.2 카카오 말풍선 로고

```typescript
// 18x18, 노란 바탕에 검정 말풍선
const KakaoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3C6.48 3 2 6.36 2 10.5c0 2.67 1.8 5.01 4.5 6.36-.15.54-.97 3.47-.99 3.69 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.7-2.43 4.28-2.84.6.09 1.24.14 1.88.14 5.52 0 10-3.36 10-7.5S17.52 3 12 3z"
      fill="currentColor"
    />
  </svg>
);
```

### 7.3 구글 G 로고

```typescript
// 18x18, 멀티컬러 G
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);
```

---

## 8. Environment Variables

### 8.1 `.env.local.example`

```env
# ─── NextAuth.js ───
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# ─── Naver OAuth ───
# https://developers.naver.com > 내 애플리케이션
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=

# ─── Kakao OAuth ───
# https://developers.kakao.com > 내 애플리케이션
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=

# ─── Google OAuth ───
# https://console.cloud.google.com > APIs & Services > Credentials
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 8.2 Callback URLs (각 프로바이더 개발자 콘솔에 등록)

| 프로바이더 | 개발 환경 Callback URL |
|-----------|----------------------|
| 네이버 | `http://localhost:3000/api/auth/callback/naver` |
| 카카오 | `http://localhost:3000/api/auth/callback/kakao` |
| 구글 | `http://localhost:3000/api/auth/callback/google` |

---

## 9. Implementation Order

| 순서 | 작업 | 파일 | 의존성 |
|------|------|------|--------|
| 1 | next-auth 패키지 설치 | `package.json` | 없음 |
| 2 | 타입 정의 추가 | `types/index.ts`, `types/next-auth.d.ts` | 1 |
| 3 | NextAuth 설정 | `lib/auth.ts` | 1 |
| 4 | API 라우트 생성 | `app/api/auth/[...nextauth]/route.ts` | 3 |
| 5 | AuthProvider 생성 | `contexts/AuthProvider.tsx` | 1 |
| 6 | layout.tsx 수정 | `app/layout.tsx` | 5 |
| 7 | 환경변수 템플릿 | `.env.local.example`, `.env.local` | 없음 |
| 8 | SocialLoginButton 구현 | `components/auth/SocialLoginButton.tsx` | 2 |
| 9 | LoginForm 구현 | `components/auth/LoginForm.tsx` | 8 |
| 10 | 로그인 페이지 구현 | `app/login/page.tsx` | 9 |
| 11 | LayoutContent 수정 | `components/layout/LayoutContent.tsx` | 10 |
| 12 | UserMenu 구현 | `components/auth/UserMenu.tsx` | 2 |
| 13 | Header 수정 | `components/layout/Header.tsx` | 12 |
| 14 | LoginRequiredModal 구현 | `components/auth/LoginRequiredModal.tsx` | 2 |
| 15 | 보호 라우트 적용 | `app/mypage/page.tsx` 등 | 3, 14 |

---

## 10. Responsive Design

### 10.1 LoginForm 반응형

| Breakpoint | 변화 |
|------------|------|
| Mobile (<640px) | 버튼 전체 너비, 패딩 `px-4`, 컨테이너 `max-w-[400px]` |
| Desktop (640px~) | 동일 (로그인 폼은 항상 중앙 정렬, 최대 400px) |

### 10.2 Header 반응형

| Breakpoint | 비로그인 | 로그인 |
|------------|---------|--------|
| Mobile (<768px) | 모바일 메뉴에 "로그인" 링크 | 모바일 메뉴에 사용자 이름 + 로그아웃 |
| Desktop (768px~) | 우측 "로그인" 버튼 | 우측 UserMenu 드롭다운 |

### 10.3 LoginRequiredModal 반응형

- 항상 중앙 정렬, `max-w-[360px] mx-4`
- 모바일에서도 동일 레이아웃

---

## 11. Edge Cases

| 케이스 | 대응 |
|--------|------|
| 소셜 로그인 실패 (API Key 미설정) | NextAuth 에러 페이지 → 커스텀 에러 처리 (추후) |
| 세션 만료 후 보호 페이지 접근 | 서버: redirect("/login"), 클라이언트: LoginRequiredModal |
| 이미 로그인 상태에서 /login 접근 | 홈으로 리다이렉트 |
| 프로필 이미지 없는 소셜 계정 | UserCircle 기본 아이콘 표시 |
| 네이버/카카오 이메일 미동의 | email undefined → null 허용 |
| 동일 이메일 다른 프로바이더 | 별도 계정으로 처리 (계정 연동 Out of Scope) |
| 쿠키 비활성화 | NextAuth 세션 동작 불가 → 로그인 실패 (별도 안내 없음) |
| 모바일 메뉴 열린 상태에서 로그인/로그아웃 | 메뉴 닫기 후 상태 반영 |
