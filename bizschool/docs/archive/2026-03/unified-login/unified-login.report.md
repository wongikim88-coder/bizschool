# Unified Login - Completion Report

## Feature Overview
- **Feature**: unified-login (통합로그인)
- **Phase**: Do (Implementation Complete)
- **Date**: 2026-03-26

## Summary

BIZSCHOOL 통합로그인 시스템 구현. 소셜 로그인(네이버, 카카오, 구글)과 사이트 자체 로그인/회원가입 UI를 포함.

## Implementation Details

### Pages
- `/login` - 로그인 페이지 (헤더/푸터 없는 전체 화면)
- `/login?mode=signup` - 회원가입 페이지 (query parameter 분기)

### Login Page (`/login`)
- BIZSCHOOL 로고 (홈 링크)
- 아이디/비밀번호 입력 폼
- "로그인 유지" 체크박스
- 로그인 버튼 (--color-dark)
- 아이디 찾기 | 비밀번호 찾기 | 회원가입 링크
- "SNS 간편로그인" 구분선
- 원형 소셜 로그인 버튼 (네이버, 카카오, Google)
- Copyright

### Signup Page (`/login?mode=signup`)
- BIZSCHOOL 로고 (홈 링크)
- 회원가입 버튼 (사이트 자체 회원가입용, 준비 중)
- "SNS 간편가입" 구분선
- 사각형 소셜 가입 버튼 ("네이버로 시작하기", "카카오로 시작하기", "Google로 시작하기")
- "이미 회원이신가요? 로그인" 링크
- Copyright

### Header Modifications
- 비로그인: 로그인 버튼(--color-dark 채움) + 회원가입 버튼(아웃라인)
- 로그인: UserMenu 드롭다운 (마이페이지, 로그아웃)
- 모바일 메뉴 동일 분기 처리

### Auth Infrastructure
- NextAuth.js v5 (Auth.js) with JWT session strategy
- Naver OAuth (custom provider)
- Kakao OAuth (custom provider)
- Google OAuth (built-in provider)
- SessionProvider / useSession() for client-side auth state
- LoginRequiredModal for protected routes

## Files Created/Modified

### New Files
- `src/lib/auth.ts` - NextAuth 설정
- `src/app/api/auth/[...nextauth]/route.ts` - API route
- `src/contexts/AuthProvider.tsx` - SessionProvider wrapper
- `src/app/login/page.tsx` - 로그인/회원가입 페이지
- `src/components/auth/LoginForm.tsx` - 로그인/회원가입 폼
- `src/components/auth/SocialLoginButton.tsx` - 소셜 로그인 버튼 (원형/사각형)
- `src/components/auth/UserMenu.tsx` - 로그인 상태 드롭다운
- `src/components/auth/LoginRequiredModal.tsx` - 로그인 필요 모달
- `src/types/next-auth.d.ts` - NextAuth 타입 확장
- `.env.local.example` - 환경변수 템플릿

### Modified Files
- `src/app/layout.tsx` - AuthProvider 추가
- `src/components/layout/LayoutContent.tsx` - 로그인 페이지 헤더/푸터 제거
- `src/components/layout/Header.tsx` - 로그인 상태 분기, 로그인/회원가입 버튼
- `src/types/index.ts` - SocialProvider, AuthUser 타입 추가
- `package.json` - next-auth 의존성 추가

## Design Decisions
- 로그인/회원가입 페이지를 query parameter(`?mode=signup`)로 분기
- 로그인 페이지: 원형 소셜 버튼 (간결), 회원가입 페이지: 사각형 소셜 버튼 (명시적)
- 로그인 버튼: --color-dark, 헤더 로그인 버튼과 동일
- 아이디/비밀번호 로그인: UI만 구현 (백엔드 미연결, "준비 중" alert)
- 로그인 페이지 헤더/푸터 제거하여 전체 화면 레이아웃
- 상단 고정 레이아웃 (pt-[15vh])으로 로그인/회원가입 로고 위치 통일
