# expert-consultation-routing Plan

> **Summary**: 전문가상담 결제 회원은 헤더 클릭 시 `/expert-consultation/dashboard`로 라우팅, 비결제 회원은 기존 홍보 페이지 유지
>
> **Project**: BIZSCHOOL
> **Version**: 1.0
> **Date**: 2026-03-26
> **Status**: Draft

---

## 1. 개요

### 1.1 목적

전문가상담 서비스를 결제한 회원이 헤더 "전문가상담" 메뉴를 클릭할 때, 홍보/세일즈 랜딩 페이지 대신 **전용 대시보드**(`/expert-consultation/dashboard`)로 이동시킨다.

### 1.2 배경

- 현재: 모든 사용자가 "전문가상담" 클릭 → `/expert-consultation` (홍보 페이지)
- 문제: 이미 결제한 회원에게 가격표, "왜 써야 하나요" 등의 세일즈 콘텐츠를 반복 노출하는 것은 UX 안티패턴
- `/community?tab=cases`로 보내는 방안도 검토했으나, "전문가상담" 클릭 → "커뮤니티" 도착은 네이밍 불일치로 혼란 유발

### 1.3 관련 파일

| 파일 | 역할 |
|------|------|
| `src/components/layout/Header.tsx` | 헤더 내비게이션 (menuItems 배열) |
| `src/app/expert-consultation/page.tsx` | 홍보 랜딩 페이지 (Server Component) |
| `src/app/expert-consultation/write/page.tsx` | 상담 등록 페이지 |
| `src/types/index.ts` | AuthUser, UserRole 등 타입 정의 |
| `src/types/next-auth.d.ts` | Session 타입 확장 |

---

## 2. 범위

### 2.1 In Scope

- [ ] `/expert-consultation/dashboard` 페이지 신규 생성 (결제 회원 전용 허브)
- [ ] `Header.tsx`에서 결제 회원 여부에 따라 "전문가상담" 링크 `href` 조건 분기
- [ ] 데스크톱/모바일 헤더 모두 적용
- [ ] Mock 사용자 데이터에 `hasPurchasedConsultation` 플래그 추가

### 2.2 Out of Scope

- 실제 백엔드 결제 검증 API
- 홍보 랜딩 페이지 내용 수정
- 마이페이지 내 상담 탭 (이미 `MypageTab`에 `"expert"` 존재, 별도 기능)

---

## 3. 요구사항

### 3.1 기능 요구사항

| ID | 요구사항 | 우선순위 |
|----|----------|----------|
| FR-01 | 비로그인/미결제 회원 → `/expert-consultation` (기존 동작 유지) | Must |
| FR-02 | 결제 완료 회원 → `/expert-consultation/dashboard` (대시보드) | Must |
| FR-03 | 데스크톱/모바일 헤더 동일 동작 | Must |
| FR-04 | 대시보드 페이지: 내 상담 내역 목록 표시 | Must |
| FR-05 | 대시보드 페이지: "새 상담 작성" CTA 버튼 | Must |
| FR-06 | 대시보드 페이지: 상담 상태(대기중/답변완료) 표시 | Should |
| FR-07 | 홍보 페이지는 URL 직접 접근 시 모든 사용자에게 표시 | Should |
| FR-08 | Mock 세션에 `hasPurchasedConsultation` 플래그 추가 | Must |

### 3.2 비기능 요구사항

| 항목 | 기준 |
|------|------|
| 성능 | 라우팅 판단에 추가 API 호출 없음 (세션 데이터 활용) |
| UX | 결제 회원은 1클릭으로 서비스 진입점 도달 |
| 일관성 | 데스크톱/모바일 동일 동작 |

---

## 4. 대시보드 페이지 구성

### 4.1 `/expert-consultation/dashboard` 레이아웃

```
┌─────────────────────────────────────────────┐
│  전문가상담                                  │
│  내 상담 관리                                │
├─────────────────────────────────────────────┤
│                                             │
│  [+ 새 상담 작성]  버튼                       │
│                                             │
│  ─── 내 상담 내역 ──────────────────────────  │
│                                             │
│  📋 회계 처리 기준 문의        대기중    3/25  │
│  📋 부가세 신고 관련 질문      답변완료  3/20  │
│  📋 4대보험 가입 기준 문의     답변완료  3/15  │
│                                             │
│  (페이지네이션)                               │
└─────────────────────────────────────────────┘
```

### 4.2 Dashboard 컴포넌트 구조

| 컴포넌트 | 역할 |
|----------|------|
| `app/expert-consultation/dashboard/page.tsx` | 페이지 엔트리 |
| `components/expert-consultation/MyConsultationList.tsx` | 내 상담 내역 리스트 |

---

## 5. 구현 방식

### 5.1 Header.tsx 라우팅 로직

```tsx
// 기존: 정적 href
{ label: "전문가상담", href: "/expert-consultation" }

// 변경: 세션 기반 조건부 href
const expertHref = session?.user?.hasPurchasedConsultation
  ? "/expert-consultation/dashboard"
  : "/expert-consultation";
```

- `<Link href={...}>` 방식 유지 (router.push 사용 안 함)
- 브라우저 기본 동작(우클릭 새 탭 열기, prefetch) 보존

### 5.2 타입 확장

```tsx
// next-auth.d.ts
interface Session {
  user: {
    provider?: SocialProvider;
    role?: UserRole;
    hasPurchasedConsultation?: boolean;  // 추가
  } & DefaultSession["user"];
}
```

---

## 6. 성공 기준

- [ ] 비로그인 사용자: 기존 동작 변화 없음
- [ ] 미결제 회원: 기존 동작 변화 없음
- [ ] 결제 회원: "전문가상담" 클릭 → `/expert-consultation/dashboard` 이동
- [ ] 대시보드에서 내 상담 내역 확인 가능
- [ ] 대시보드에서 "새 상담 작성" 클릭 → `/expert-consultation/write` 이동
- [ ] TypeScript 에러 없음, 빌드 성공

---

## 7. 구현 순서

1. `next-auth.d.ts` 타입 확장 (`hasPurchasedConsultation`)
2. Mock 세션 데이터에 플래그 추가
3. `/expert-consultation/dashboard/page.tsx` 생성
4. `MyConsultationList.tsx` 컴포넌트 생성
5. `Header.tsx` 조건부 href 적용

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-26 | 초안 작성 |
