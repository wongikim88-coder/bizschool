# Plan: 통합로그인 (Unified Social Login)

> **Feature**: unified-login
> **Created**: 2026-03-23
> **Status**: Draft

---

## 1. 배경 및 목적

### 1.1 현황 분석

**현재 프로젝트 (BIZSCHOOL)**
- Next.js 16 + React 19 + Tailwind CSS v4 기반 교육 플랫폼
- **인증/로그인 시스템 전무** - 로그인, 회원가입 페이지 없음
- 마이페이지에서 `MockUser` 사용 (하드코딩된 사용자 정보)
- 전문가상담 등록, 1:1 문의 등 사용자 식별이 필요한 기능이 Mock 기반으로 동작

### 1.2 구현 목적

- 소셜로그인(네이버, 카카오, 구글)을 통한 간편 로그인 기능 제공
- 로그인 상태에 따라 UI 분기 (헤더, 마이페이지 등)
- 향후 백엔드 연동을 고려한 인증 구조 설계
- 사용자 경험 중심의 통합 로그인 페이지 제공

---

## 2. 범위 정의

### 2.1 구현 범위 (In Scope)

| # | 기능 | 설명 | 우선순위 |
|---|------|------|----------|
| F1 | 로그인 페이지 | 소셜 로그인 버튼 3종 (네이버/카카오/구글) | P0 |
| F2 | 소셜 로그인 플로우 | OAuth 2.0 기반 소셜 로그인 처리 | P0 |
| F3 | 로그인 상태 관리 | 클라이언트 사이드 인증 상태 관리 (Context) | P0 |
| F4 | 헤더 UI 분기 | 비로그인: "로그인" 버튼 / 로그인: 사용자 정보 표시 | P0 |
| F5 | 로그아웃 기능 | 세션 종료 및 상태 초기화 | P0 |
| F6 | OAuth 콜백 처리 | 각 소셜 프로바이더 콜백 라우트 | P0 |
| F7 | 로그인 유도 모달 | 비로그인 시 보호 페이지 접근 시 안내 | P1 |
| F8 | 마이페이지 연동 | MockUser → 실제 로그인 사용자 정보 연동 | P1 |

### 2.2 제외 범위 (Out of Scope)

- 이메일/비밀번호 회원가입 및 로그인
- 비밀번호 찾기/변경
- 관리자 인증 시스템
- 회원 탈퇴 기능
- 실제 백엔드 서버 구축 (Next.js API Routes로 처리)
- JWT refresh token rotation (초기 버전)

---

## 3. 기술 전략

### 3.1 소셜 로그인 프로바이더

| 프로바이더 | OAuth 방식 | 개발자 콘솔 |
|-----------|-----------|-------------|
| **네이버** | OAuth 2.0 | [Naver Developers](https://developers.naver.com) |
| **카카오** | OAuth 2.0 | [Kakao Developers](https://developers.kakao.com) |
| **구글** | OAuth 2.0 / OpenID Connect | [Google Cloud Console](https://console.cloud.google.com) |

### 3.2 인증 라이브러리 선택

**NextAuth.js (Auth.js) v5** 사용

선정 이유:
- Next.js App Router 네이티브 지원
- 네이버/카카오/구글 프로바이더 내장 또는 커스텀 지원
- 세션 관리 (JWT / Database) 기본 제공
- Server Component & Client Component 양쪽에서 세션 접근 가능

```
설치 패키지:
next-auth@beta (v5)
```

### 3.3 인증 플로우

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐
│  로그인 페이지  │───▶│ 소셜 프로바이더  │───▶│  콜백 URL 처리   │
│  /login       │    │ (네이버/카카오/ │    │  /api/auth/     │
│               │    │  구글)         │    │  callback/...   │
└─────────────┘    └──────────────┘    └────────────────┘
                                              │
                                              ▼
                                       ┌────────────────┐
                                       │  세션 생성       │
                                       │  (JWT 토큰)     │
                                       │  → 홈으로 리다이렉트│
                                       └────────────────┘
```

1. 사용자가 `/login` 페이지에서 소셜 로그인 버튼 클릭
2. NextAuth가 해당 프로바이더의 OAuth 인증 페이지로 리다이렉트
3. 사용자가 소셜 계정으로 인증
4. 프로바이더가 콜백 URL로 인증 코드 전달
5. NextAuth가 코드를 토큰으로 교환 → 사용자 정보 획득
6. JWT 기반 세션 생성 → 쿠키 저장
7. 원래 페이지 또는 홈으로 리다이렉트

### 3.4 데이터 모델

```typescript
// 통합 사용자 정보 (소셜 로그인에서 제공되는 정보 기반)
interface User {
  id: string;                    // 고유 ID (provider_providerId 형태)
  name: string;                  // 표시 이름
  email: string;                 // 이메일
  image?: string;                // 프로필 이미지 URL
  provider: "naver" | "kakao" | "google";
  providerAccountId: string;     // 소셜 프로바이더의 사용자 ID
}

// 세션 정보
interface Session {
  user: User;
  expires: string;               // 세션 만료 시간
}
```

### 3.5 라우팅 전략

| 경로 | 설명 | 접근 권한 |
|------|------|----------|
| `/login` | 통합 로그인 페이지 | Public |
| `/api/auth/[...nextauth]` | NextAuth API 라우트 (콜백 등) | System |
| `/mypage` | 마이페이지 | Protected (로그인 필요) |
| `/community/expert/write` | 전문가상담 등록 | Protected |

### 3.6 컴포넌트 구조

```
src/
├── app/
│   ├── login/
│   │   └── page.tsx                  # 통합 로그인 페이지
│   └── api/auth/
│       └── [...nextauth]/
│           └── route.ts              # NextAuth API 핸들러
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx             # 소셜 로그인 버튼 그룹
│   │   ├── SocialLoginButton.tsx     # 개별 소셜 로그인 버튼
│   │   ├── LoginRequiredModal.tsx    # 로그인 유도 모달
│   │   └── UserMenu.tsx             # 로그인 후 헤더 사용자 메뉴
│   └── layout/
│       └── Header.tsx                # 기존 헤더 수정 (로그인 상태 분기)
├── lib/
│   └── auth.ts                       # NextAuth 설정 (프로바이더, 콜백)
├── contexts/
│   └── AuthProvider.tsx              # NextAuth SessionProvider 래퍼
└── types/
    └── index.ts                      # User, Session 관련 타입 추가
```

---

## 4. 구현 계획

### Phase 1: NextAuth 설정 및 기반 구축
1. `next-auth@beta` 패키지 설치
2. `lib/auth.ts` - NextAuth 설정 파일 생성
   - Google 프로바이더 설정
   - Kakao 커스텀 프로바이더 설정
   - Naver 커스텀 프로바이더 설정
   - JWT 세션 전략 설정
   - 콜백 함수 정의 (jwt, session)
3. `app/api/auth/[...nextauth]/route.ts` - API 라우트 생성
4. `contexts/AuthProvider.tsx` - SessionProvider 래퍼
5. `app/layout.tsx` - AuthProvider 적용
6. `.env.local` - 환경변수 템플릿 준비 (Client ID, Secret)

### Phase 2: 로그인 페이지 UI
1. `app/login/page.tsx` - 로그인 페이지 라우트
2. `components/auth/LoginForm.tsx` - 로그인 폼 컴포넌트
   - BIZSCHOOL 로고
   - "소셜 계정으로 간편 로그인" 안내 텍스트
   - 네이버 로그인 버튼 (네이버 녹색 #03C75A)
   - 카카오 로그인 버튼 (카카오 노란색 #FEE500)
   - 구글 로그인 버튼 (흰색 배경 + 구글 로고)
3. `components/auth/SocialLoginButton.tsx` - 재사용 가능한 소셜 버튼

### Phase 3: 헤더 및 레이아웃 연동
1. `components/layout/Header.tsx` 수정
   - 비로그인: 기존 "마이페이지" → "로그인" 버튼
   - 로그인: 사용자 프로필 이미지 + 이름 + 드롭다운 메뉴
2. `components/auth/UserMenu.tsx` - 사용자 드롭다운 메뉴
   - 마이페이지 링크
   - 로그아웃 버튼
3. 모바일 메뉴에도 로그인 상태 반영

### Phase 4: 보호 라우트 및 로그인 유도
1. `components/auth/LoginRequiredModal.tsx` - 로그인 유도 모달
2. 보호가 필요한 페이지에 세션 체크 로직 적용
   - `/mypage` - 로그인 필수
   - `/community/expert/write` - 로그인 필수
3. 마이페이지 MockUser → 세션 사용자 정보 연동

---

## 5. UI 참고 사항

### 5.1 로그인 페이지 레이아웃

```
┌──────────────────────────────────┐
│            BIZSCHOOL             │
│                                  │
│   소셜 계정으로 간편하게 로그인하세요   │
│                                  │
│  ┌────────────────────────────┐  │
│  │  🟢  네이버로 로그인          │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │  🟡  카카오로 로그인          │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │  ⬜  Google로 로그인         │  │
│  └────────────────────────────┘  │
│                                  │
│  로그인 시 서비스 이용약관과         │
│  개인정보 처리방침에 동의합니다.     │
└──────────────────────────────────┘
```

### 5.2 각 소셜 버튼 디자인 가이드

| 프로바이더 | 배경색 | 텍스트색 | 로고 |
|-----------|--------|---------|------|
| 네이버 | `#03C75A` | `#FFFFFF` | 네이버 N 로고 |
| 카카오 | `#FEE500` | `#000000` | 카카오톡 말풍선 로고 |
| 구글 | `#FFFFFF` (border) | `#000000` | 구글 G 로고 |

### 5.3 디자인 원칙
- BIZSCHOOL 기존 디자인 시스템(CSS variables, Tailwind) 준수
- 각 소셜 로그인 공식 브랜드 가이드라인 준수
- 모바일 반응형 필수 (버튼 전체 너비)
- 로그인 페이지 중앙 정렬, 최대 너비 400px

---

## 6. 환경 설정 (필수 사전 준비)

### 6.1 소셜 로그인 개발자 등록

구현 전 각 프로바이더에서 앱 등록 및 Client ID/Secret 발급이 필요합니다.

**네이버 개발자센터**
- 애플리케이션 등록 → 로그인 API 선택
- Callback URL: `http://localhost:3000/api/auth/callback/naver`
- 필수 제공 정보: 이름, 이메일, 프로필 이미지

**카카오 개발자센터**
- 애플리케이션 등록 → 카카오 로그인 활성화
- Redirect URI: `http://localhost:3000/api/auth/callback/kakao`
- 동의항목: 닉네임, 이메일, 프로필 이미지

**Google Cloud Console**
- OAuth 2.0 클라이언트 ID 생성
- 승인된 리디렉션 URI: `http://localhost:3000/api/auth/callback/google`
- 범위: openid, email, profile

### 6.2 환경변수 (.env.local)

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<random-secret>

# Naver
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=

# Kakao
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=

# Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## 7. 리스크 및 고려사항

| 리스크 | 영향 | 대응 |
|--------|------|------|
| 소셜 로그인 API Key 미발급 | 실제 로그인 불가 | Mock 모드 지원 - 환경변수 없으면 개발용 테스트 계정으로 동작 |
| 네이버/카카오 커스텀 프로바이더 필요 | NextAuth에 한국 프로바이더 공식 미포함 가능 | Custom OAuth Provider로 직접 구현 |
| 기존 MockUser 의존 코드 변경 | 마이페이지 등 기존 기능 영향 | 세션 없으면 MockUser fallback 유지 |
| 쿠키 기반 세션 → 프라이버시 | 개인정보 처리 고려 | 동의 문구 표시, 필수 정보만 저장 |
| 콜백 URL 불일치 | 로그인 실패 | 개발/프로덕션 환경별 URL 분리 관리 |

---

## 8. 성공 기준

- [ ] `/login` 페이지에서 네이버/카카오/구글 로그인 버튼이 표시됨
- [ ] 각 소셜 로그인 버튼 클릭 시 해당 프로바이더 인증 페이지로 이동
- [ ] 인증 완료 후 BIZSCHOOL로 리다이렉트되고 로그인 상태가 됨
- [ ] 헤더에 로그인/비로그인 상태가 올바르게 표시됨
- [ ] 로그아웃 시 세션이 종료되고 비로그인 상태로 전환됨
- [ ] 보호 페이지 접근 시 로그인 유도 모달이 표시됨
- [ ] 모바일/데스크톱 반응형 레이아웃 정상 동작
- [ ] 페이지 새로고침 후에도 로그인 상태 유지
