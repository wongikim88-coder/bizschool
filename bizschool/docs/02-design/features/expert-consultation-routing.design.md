# Design: 전문가상담 결제회원 라우팅

> **Feature**: expert-consultation-routing
> **Plan**: [expert-consultation-routing.plan.md](../../01-plan/features/expert-consultation-routing.plan.md)
> **Created**: 2026-03-26
> **Status**: Design

---

## 1. 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────┐
│ Header.tsx                                                  │
│                                                             │
│ "전문가상담" 클릭                                             │
│   ├─ session?.user?.hasPurchasedConsultation === true        │
│   │   → /mypage?tab=expert                      │
│   └─ 그 외 (비로그인, 미결제)                                  │
│       → /expert-consultation (홍보 페이지, 기존 유지)          │
└─────────────────────────────────────────────────────────────┘
```

### 핵심 설계 결정

| 항목 | 결정 | 근거 |
|------|------|------|
| 라우팅 방식 | `<Link href={조건부}>` | 브라우저 기본 동작(우클릭, prefetch) 보존 |
| 리다이렉트 대상 | `/mypage?tab=expert` (기존 마이페이지 활용) | 별도 대시보드 페이지 없이 이미 완성된 상담 관리 UI 재활용 |
| 결제 상태 소스 | `session.user.hasPurchasedConsultation` | 기존 `session.user.role` 패턴과 동일 |

---

## 2. 변경 파일 목록

| # | 파일 | 변경 유형 | 설명 |
|---|------|----------|------|
| 1 | `src/types/next-auth.d.ts` | 수정 | `hasPurchasedConsultation` 필드 추가 |
| 2 | `src/lib/auth.ts` | 수정 | Mock 사용자에 플래그 추가, JWT/session 콜백 확장 |
| 3 | `src/app/mypage?tab=expert/page.tsx` | 신규 | 대시보드 페이지 엔트리 |
| 4 | `src/components/layout/Header.tsx` | 수정 | 조건부 href 적용 |

---

## 3. 상세 설계

### 3-1. 타입 확장 (`next-auth.d.ts`)

```typescript
declare module "next-auth" {
  interface Session {
    user: {
      provider?: SocialProvider;
      role?: UserRole;
      hasPurchasedConsultation?: boolean;  // 추가
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: SocialProvider;
    role?: UserRole;
    hasPurchasedConsultation?: boolean;  // 추가
  }
}
```

### 3-2. Mock 데이터 확장 (`auth.ts`)

```typescript
const MOCK_USERS = [
  {
    id: "test",
    password: "test",
    name: "테스트 사용자",
    email: "test@bizschool.com",
    image: undefined,
    role: "user" as UserRole,
    hasPurchasedConsultation: true,  // 결제 회원 Mock
  },
  {
    id: "expert",
    password: "expert",
    name: "김전문가",
    email: "expert@bizschool.com",
    image: undefined,
    role: "expert" as UserRole,
    hasPurchasedConsultation: false,
  },
];
```

JWT/session 콜백에 `hasPurchasedConsultation` 전달 추가:

```typescript
callbacks: {
  async jwt({ token, user }) {
    if (user && "hasPurchasedConsultation" in user) {
      token.hasPurchasedConsultation = (user as any).hasPurchasedConsultation;
    }
    return token;
  },
  async session({ session, token }) {
    if (token.hasPurchasedConsultation !== undefined) {
      session.user.hasPurchasedConsultation = token.hasPurchasedConsultation as boolean;
    }
    return session;
  },
}
```

### 3-3. Header.tsx 조건부 라우팅

> **v1.1 변경**: 별도 대시보드 페이지(`/expert-consultation/dashboard`) 대신 기존 `/mypage?tab=expert`로 리다이렉트.
> 마이페이지 expert 탭에 이미 동일한 상담 관리 UI가 완비되어 있으므로 중복 페이지 불필요.

**변경 위치**: `menuItems` 배열의 "전문가상담" 항목 렌더링 부분

**변경 방식**: 정적 `menuItems` 배열은 그대로 두고, 렌더링 시점에 `href`를 오버라이드

```typescript
// Header.tsx 내부 (데스크톱 nav + 모바일 nav 모두 적용)

// 조건부 href 계산
const getMenuHref = (item: MenuItem) => {
  if (item.href === "/expert-consultation" && session?.user?.hasPurchasedConsultation) {
    return "/mypage?tab=expert";
  }
  return item.href;
};
```

**적용 지점 (2곳)**:

1. **데스크톱 nav** (line ~150): `<Link href={item.href}>` → `<Link href={getMenuHref(item)}>`
2. **모바일 nav** (line ~264): `<Link href={item.href}>` → `<Link href={getMenuHref(item)}>`

---

## 4. 라우팅 매트릭스

| 사용자 상태 | 헤더 클릭 결과 | URL 직접 접근 |
|---|---|---|
| 비로그인 | `/expert-consultation` (홍보) | 정상 접근 |
| 로그인 + 미결제 | `/expert-consultation` (홍보) | 정상 접근 |
| 로그인 + 결제완료 | `/mypage?tab=expert` | 정상 접근 |
| 로그인 + 결제완료 | - | `/expert-consultation` URL 직접 입력 시에도 홍보 페이지 접근 가능 (차단 안 함) |

---

## 5. 구현 순서

```
Step 1: src/types/next-auth.d.ts 수정
   └─ hasPurchasedConsultation 필드 추가

Step 2: src/lib/auth.ts 수정
   ├─ MOCK_USERS에 hasPurchasedConsultation 추가
   └─ jwt/session 콜백 확장

Step 3: src/app/mypage?tab=expert/page.tsx 생성
   └─ ExpertConsultationSection import하여 페이지 구성

Step 4: src/components/layout/Header.tsx 수정
   ├─ getMenuHref 함수 추가
   ├─ 데스크톱 nav Link href 적용
   └─ 모바일 nav Link href 적용
```

---

## 6. 테스트 시나리오

| # | 시나리오 | 검증 방법 |
|---|----------|----------|
| T-1 | 비로그인 상태에서 "전문가상담" 클릭 → 홍보 페이지 | 로그아웃 후 헤더 클릭 |
| T-2 | `test/test`로 로그인 후 "전문가상담" 클릭 → `/mypage?tab=expert` | test 계정 로그인 후 확인 |
| T-3 | 대시보드에서 "상담 신청" 클릭 → 작성 폼 표시 | 버튼 클릭 |
| T-4 | 대시보드에서 상담 상세 클릭 → 상세 화면 표시 | 목록 항목 클릭 |
| T-5 | 모바일에서 동일 라우팅 동작 확인 | 반응형 뷰 확인 |
| T-6 | 결제 회원이 `/expert-consultation` URL 직접 입력 → 홍보 페이지 정상 접근 | URL 직접 입력 |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-26 | 초안 작성 |
| 1.1 | 2026-03-26 | 대시보드 페이지 제거 → `/mypage?tab=expert` 리다이렉트로 변경 |
