# 마이페이지 & 1:1 문의 Planning Document

> **Summary**: BIZSCHOOL 마이페이지 제작 및 1:1 문의 기능 구현
>
> **Project**: BIZSCHOOL
> **Feature**: mypage-inquiry
> **Version**: 0.1.0
> **Author**: Allen
> **Date**: 2026-03-14
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

BIZSCHOOL 플랫폼에 마이페이지를 신규 구축하고, 마이페이지 내에서 1:1 문의를 작성/조회할 수 있는 기능을 구현한다.
현재 프로젝트는 Starter 레벨(프론트엔드 중심, Mock 데이터)이므로 인증/백엔드 없이 UI 중심으로 구현한다.

### 1.2 Background

- 현재 Header에 "로그인" 링크(`/login`)가 있으나 미구현 상태
- 마이페이지, 회원 관련 페이지가 전혀 없는 상태
- 사용자가 1:1 문의를 작성하고 답변 상태를 확인할 수 있는 기능 요청
- 기존 프로젝트의 Mock 데이터 패턴(courses.ts, books.ts 등)을 따름

### 1.3 Related Documents

- 기존 Plan: `docs/archive/2026-02/bizschool-main/bizschool-main.plan.md`
- 프로젝트 타입 정의: `bizschool/src/types/index.ts`
- 헤더 컴포넌트: `bizschool/src/components/layout/Header.tsx`

---

## 2. Scope

### 2.1 In Scope

- [x] 마이페이지 라우트 (`/mypage`) 및 레이아웃
- [x] 마이페이지 사이드바 메뉴 (내 정보, 1:1 문의, 수강내역 등)
- [x] 1:1 문의 목록 조회 (테이블 + 모바일 카드)
- [x] 1:1 문의 작성 폼 (제목, 카테고리, 내용)
- [x] 1:1 문의 상세 조회 (질문 + 답변 표시)
- [x] Mock 데이터 (사용자 정보, 문의 내역)
- [x] 반응형 레이아웃 (Desktop/Tablet/Mobile)

### 2.2 Out of Scope

- 실제 로그인/회원가입 기능 (백엔드 연동)
- 문의 데이터 영속성 (서버 저장)
- 수강내역, 결제내역 등 다른 마이페이지 탭 상세 구현
- 이메일/SMS 알림 기능
- 파일 첨부 기능

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | **마이페이지 레이아웃**: 좌측 사이드바 + 우측 콘텐츠 영역 (Desktop), 상단 탭 메뉴 (Mobile) | High | Pending |
| FR-02 | **사이드바 메뉴**: 프로필 영역 + 메뉴 항목 (내 정보, 1:1 문의, 수강내역, 구매내역) | High | Pending |
| FR-03 | **프로필 영역**: 사용자 이름, 이메일, 프로필 아바타 표시 | Medium | Pending |
| FR-04 | **1:1 문의 목록**: 문의 번호, 카테고리, 제목, 작성일, 상태(대기중/답변완료) 표시 | High | Pending |
| FR-05 | **1:1 문의 목록 필터**: 전체/대기중/답변완료 필터 | Medium | Pending |
| FR-06 | **1:1 문의 작성**: 카테고리 선택, 제목 입력, 내용 입력 폼 | High | Pending |
| FR-07 | **1:1 문의 상세**: 문의 내용 + 답변 내용 표시 (아코디언 또는 별도 영역) | High | Pending |
| FR-08 | **헤더 연동**: 로그인 상태에서 "로그인" → "마이페이지" 링크로 변경 (Mock) | Medium | Pending |
| FR-09 | **페이지네이션**: 문의 목록 페이지네이션 | Low | Pending |
| FR-10 | **반응형**: Desktop(사이드바+콘텐츠) / Mobile(탭+콘텐츠) | High | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | LCP < 2.5s | Lighthouse |
| Accessibility | WCAG 2.1 AA 준수 | Lighthouse |
| 호환성 | Chrome, Safari, Firefox, Edge | 수동 테스트 |

---

## 4. UI/UX 상세 명세

### 4.1 마이페이지 레이아웃 (Desktop)

```
┌─────────────────────────────────────────────────────────────────┐
│ [Header - 기존 헤더]                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 마이페이지                                                       │
│                                                                 │
│ ┌──────────────┐  ┌──────────────────────────────────────────┐  │
│ │ ┌──────────┐ │  │                                          │  │
│ │ │  아바타    │ │  │  1:1 문의                                │  │
│ │ │  이름     │ │  │                                          │  │
│ │ │  이메일   │ │  │  [전체] [대기중] [답변완료]    [문의하기]   │  │
│ │ └──────────┘ │  │                                          │  │
│ │              │  │  ┌────┬──────┬──────────┬────────┬─────┐ │  │
│ │ ○ 내 정보    │  │  │ No │ 카테고리│  제목      │  작성일  │ 상태 │ │  │
│ │ ● 1:1 문의   │  │  ├────┼──────┼──────────┼────────┼─────┤ │  │
│ │ ○ 수강내역   │  │  │ 5  │ 강의   │ 강의 환불..│ 03-14  │ 대기 │ │  │
│ │ ○ 구매내역   │  │  │ 4  │ 결제   │ 결제 오류..│ 03-12  │ 완료 │ │  │
│ │              │  │  │ 3  │ 기타   │ 수료증 발..│ 03-10  │ 완료 │ │  │
│ │              │  │  └────┴──────┴──────────┴────────┴─────┘ │  │
│ │              │  │                                          │  │
│ │              │  │  [< 1 2 3 >]                             │  │
│ └──────────────┘  └──────────────────────────────────────────┘  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [Footer - 기존 푸터]                                             │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 마이페이지 레이아웃 (Mobile)

```
┌─────────────────────────┐
│ [Header]                │
├─────────────────────────┤
│                         │
│ ┌───────────────────┐   │
│ │ 아바타  이름       │   │
│ │        이메일      │   │
│ └───────────────────┘   │
│                         │
│ [내정보][1:1문의][수강][구매] │
│                         │
│ 1:1 문의                │
│ [전체][대기중][답변완료]  │
│                         │
│ ┌───────────────────┐   │
│ │ [대기중] 강의       │   │
│ │ 강의 환불 문의입니.. │   │
│ │ 2026-03-14         │   │
│ └───────────────────┘   │
│ ┌───────────────────┐   │
│ │ [답변완료] 결제     │   │
│ │ 결제 오류 문의..    │   │
│ └───────────────────┘   │
│                         │
│ [Footer]                │
└─────────────────────────┘
```

### 4.3 1:1 문의 작성 폼

```
┌──────────────────────────────────────────┐
│                                          │
│  1:1 문의하기                             │
│                                          │
│  카테고리 *                               │
│  ┌──────────────────────────────────┐    │
│  │ 카테고리를 선택해주세요       ▼    │    │
│  └──────────────────────────────────┘    │
│  (강의 / 도서 / 결제 / 기술문제 / 기타)    │
│                                          │
│  제목 *                                   │
│  ┌──────────────────────────────────┐    │
│  │ 문의 제목을 입력해주세요          │    │
│  └──────────────────────────────────┘    │
│                                          │
│  내용 *                                   │
│  ┌──────────────────────────────────┐    │
│  │                                  │    │
│  │  문의 내용을 상세히 입력해주세요    │    │
│  │                                  │    │
│  │                                  │    │
│  └──────────────────────────────────┘    │
│                                          │
│           [취소]  [문의 등록]              │
│                                          │
└──────────────────────────────────────────┘
```

### 4.4 1:1 문의 상세

```
┌──────────────────────────────────────────┐
│                                          │
│  ← 목록으로                [대기중/답변완료] │
│                                          │
│  강의 환불 문의입니다                       │
│  카테고리: 강의  |  작성일: 2026-03-14      │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ Q. 문의 내용                      │    │
│  │                                  │    │
│  │ 안녕하세요. 수강 중인 강의를       │    │
│  │ 환불하고 싶은데 절차가 어떻게      │    │
│  │ 되나요?                           │    │
│  └──────────────────────────────────┘    │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ A. 답변 (2026-03-15)             │    │
│  │                                  │    │
│  │ 안녕하세요. BIZSCHOOL입니다.      │    │
│  │ 환불은 수강 시작 후 7일 이내...    │    │
│  └──────────────────────────────────┘    │
│                                          │
└──────────────────────────────────────────┘
```

### 4.5 색상 및 스타일 가이드

| 요소 | 스타일 | 비고 |
|------|--------|------|
| 상태 뱃지 - 대기중 | `bg-amber-50 text-amber-600` | 기존 Badge 패턴 활용 |
| 상태 뱃지 - 답변완료 | `bg-emerald-50 text-emerald-600` | 기존 green variant |
| 사이드바 활성 메뉴 | `bg-[var(--color-primary)]/10 text-[var(--color-primary)]` | 기존 active 패턴 |
| 문의하기 버튼 | `bg-[var(--color-primary)] text-white` | 기존 Primary 버튼 |
| 카드/테이블 | `rounded-2xl border border-[var(--color-border)]` | 기존 카드 패턴 |

---

## 5. Data Model (Mock)

### 5.1 사용자 정보

```typescript
interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;         // 없으면 이니셜 아바타
  joinDate: string;
}
```

### 5.2 1:1 문의

```typescript
interface Inquiry {
  id: number;
  category: "강의" | "도서" | "결제" | "기술문제" | "기타";
  title: string;
  content: string;
  status: "pending" | "answered";
  createdAt: string;
  answer?: {
    content: string;
    answeredAt: string;
    answeredBy: string;
  };
}
```

### 5.3 마이페이지 탭

```typescript
type MypageTab = "profile" | "inquiry" | "courses" | "purchases";
```

---

## 6. Success Criteria

### 6.1 Definition of Done

- [ ] `/mypage` 라우트 접근 시 마이페이지 정상 렌더링
- [ ] 사이드바(Desktop) / 탭 메뉴(Mobile) 정상 동작
- [ ] 1:1 문의 목록 표시 (Desktop: 테이블, Mobile: 카드)
- [ ] 문의 상태 필터 (전체/대기중/답변완료) 정상 동작
- [ ] 1:1 문의 작성 폼 정상 동작 (Mock - 목록에 추가)
- [ ] 1:1 문의 상세 조회 정상 표시
- [ ] 반응형: Desktop/Tablet/Mobile 정상 동작
- [ ] 기존 프로젝트 스타일 일관성 유지

### 6.2 Quality Criteria

- [ ] Zero 콘솔 에러
- [ ] 기존 색상 변수(CSS Variables) 일관 사용
- [ ] 기존 컴포넌트 패턴 준수 (PascalCase, lucide-react 아이콘)

---

## 7. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Mock 데이터 상태 초기화 | Low | High | 브라우저 리로드 시 초기화 안내 |
| 사이드바 레이아웃 충돌 | Medium | Low | 마이페이지 전용 레이아웃 사용 |
| 모바일 탭 메뉴 과다 | Medium | Medium | 스크롤 가능한 탭 또는 4개 제한 |

---

## 8. Architecture Considerations

### 8.1 Project Level

| Level | Selected |
|-------|:--------:|
| **Starter** | **O** |
| Dynamic | |
| Enterprise | |

> Starter 레벨 유지: 백엔드 없이 Mock 데이터로 UI 구현

### 8.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| 라우팅 | `/mypage` 단일 / `/mypage/[tab]` | `/mypage` 단일 + searchParams | 기존 community 페이지 패턴(`?tab=`) 준수 |
| 상태 관리 | useState / URL state | **URL searchParams + useState** | 탭은 URL, 폼 상태는 useState |
| 문의 작성 | 모달 / 별도 페이지 | **인라인 토글** | 같은 페이지 내 목록↔작성 전환 |
| 문의 상세 | 모달 / 별도 페이지 | **인라인 확장** | 클릭 시 상세 내용 확장 표시 |

### 8.3 Folder Structure (신규 파일)

```
src/
├── app/
│   └── mypage/
│       └── page.tsx              # 마이페이지 (searchParams: tab, filter, view)
├── components/
│   └── mypage/
│       ├── MypageSidebar.tsx     # 사이드바 (프로필 + 메뉴)
│       ├── MypageContent.tsx     # 콘텐츠 래퍼 (탭별 분기)
│       ├── InquiryList.tsx       # 1:1 문의 목록
│       ├── InquiryForm.tsx       # 1:1 문의 작성 폼
│       ├── InquiryDetail.tsx     # 1:1 문의 상세
│       └── ProfileSection.tsx    # 내 정보 섹션 (추후 확장)
├── data/
│   └── mypage.ts                 # Mock 사용자 + 문의 데이터
└── types/
    └── index.ts                  # MockUser, Inquiry 타입 추가
```

---

## 9. Implementation Order

1. **타입 정의** - `types/index.ts`에 MockUser, Inquiry 타입 추가
2. **Mock 데이터** - `data/mypage.ts` 생성 (사용자 정보 + 문의 5~8건)
3. **마이페이지 라우트** - `app/mypage/page.tsx` 생성
4. **사이드바** - `MypageSidebar.tsx` (프로필 + 메뉴)
5. **콘텐츠 래퍼** - `MypageContent.tsx` (탭별 분기)
6. **문의 목록** - `InquiryList.tsx` (테이블/카드 + 필터)
7. **문의 상세** - `InquiryDetail.tsx` (질문 + 답변)
8. **문의 작성** - `InquiryForm.tsx` (카테고리, 제목, 내용)
9. **헤더 연동** - Header.tsx에 마이페이지 링크 추가

---

## 10. Next Steps

1. [ ] Design 문서 작성 (`mypage-inquiry.design.md`)
2. [ ] 타입 및 Mock 데이터 구현
3. [ ] 컴포넌트별 구현 시작
4. [ ] Gap 분석 및 검증

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-14 | Initial draft - 마이페이지 + 1:1 문의 요구사항 정의 | Allen |
