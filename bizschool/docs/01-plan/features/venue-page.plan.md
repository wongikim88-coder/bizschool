# venue-page Planning Document

> **Summary**: /about의 강의장 소개 섹션과 /directions 페이지를 통합한 `/venue` 페이지 신규 생성
>
> **Project**: BIZSCHOOL
> **Version**: 0.1
> **Author**: allen
> **Date**: 2026-03-20
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

강의장 시설 정보와 찾아오시는 길을 하나의 페이지(`/venue`)로 통합하여, 수강확정된 학생이 "강의실 안내" 버튼 하나로 시설 정보 + 오시는 길을 한 번에 확인할 수 있도록 한다.

### 1.2 Background

현재 강의장 관련 정보가 두 곳에 분산되어 있다:
- `/about` 페이지 Section 5: 강의장 사진 2장 + 시설 특징 4카드 (1인 1PC, 40석, Smart A, 실무 교육)
- `/directions` 페이지: 카카오맵 + 주소/전화/팩스 + 교통안내 (지하철/버스)

마이페이지 > 내 학습 > 현장 강의/인재키움 프리미엄 훈련에서 "수강확정" 상태의 강의에 "강의실 안내" 버튼이 있으나 현재 동작하지 않음 (console.log만 출력). 이 버튼을 `/venue` 페이지로 연결하여 학생이 강의장 정보를 쉽게 확인할 수 있도록 한다.

### 1.3 Related Documents

- 기존 about 페이지: `src/app/about/page.tsx` (Section 5: 강의장 소개)
- 기존 directions 페이지: `src/app/directions/page.tsx`
- Footer 메뉴: `src/components/layout/Footer.tsx`
- 오프라인 강의 카드: `src/components/mypage/my-learning/OfflineCourseCard.tsx`
- KakaoMap 컴포넌트: `src/components/directions/KakaoMap.tsx`

---

## 2. Scope

### 2.1 In Scope

- [x] `/venue` 라우트 페이지 생성
- [x] 강의장 시설 안내 섹션 (기존 /about Section 5에서 추출)
- [x] 오시는 길 섹션 (기존 /directions 콘텐츠 통합)
- [x] 앵커 네비게이션: `/venue#directions`로 오시는 길 섹션 직접 이동
- [x] 푸터 메뉴 변경: "강의장 소개" + "찾아오시는 길" 두 항목 유지 (같은 페이지 다른 위치)
- [x] `/directions` → `/venue#directions` 308 리다이렉트 설정
- [x] /about 페이지에서 Section 5 제거 (중복 방지)
- [x] "강의실 안내" 버튼을 `/venue` 링크로 변경 (새 탭)

### 2.2 Out of Scope

- 강의장 정보 백엔드 연동 (정적 데이터 사용)
- KakaoMap 컴포넌트 수정 (기존 그대로 재사용)
- 헤더 네비게이션 변경

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | `/venue` 페이지: 강의장 시설 섹션 + 오시는 길 섹션 통합 표시 | High | Pending |
| FR-02 | 시설 섹션: 강의장 사진 2장 + 시설 특징 4카드 (from /about) | High | Pending |
| FR-03 | 오시는 길 섹션: 카카오맵 + 기본정보 카드 + 교통안내 카드 (from /directions) | High | Pending |
| FR-04 | 앵커: `id="directions"`로 오시는 길 섹션 직접 이동 지원 | High | Pending |
| FR-05 | 푸터: "강의장 소개" → `/venue`, "찾아오시는 길" → `/venue#directions` | High | Pending |
| FR-06 | 리다이렉트: `/directions` → `/venue#directions` (308 permanent) | Medium | Pending |
| FR-07 | /about 페이지 Section 5 제거 | Medium | Pending |
| FR-08 | OfflineCourseCard "강의실 안내" 버튼 → `<Link href="/venue" target="_blank">` | High | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| SEO | 통합 메타데이터: "강의장 소개 및 찾아오시는 길" 양쪽 검색 의도 커버 | title/description 검증 |
| UX | "찾아오시는 길" 라벨이 푸터에 반드시 존재 (한국 교육기관 표준) | 시각 검증 |
| Scroll | 고정 헤더 높이만큼 scroll-margin-top 적용 | 앵커 이동 시 확인 |

---

## 4. Page Structure

```
/venue 페이지 구성:

┌─────────────────────────────────────────────┐
│  Section 1: 페이지 헤더                       │
│  - h1: "강의장 소개"                          │
│  - subtitle: 실무 교육에 최적화된 강의 환경     │
├─────────────────────────────────────────────┤
│  Section 2: 강의장 시설 안내 (#facilities)     │
│  - 강의장 사진 2장 (grid 2col)                │
│  - 시설 특징 4카드 (1인1PC/40석/SmartA/실무)   │
├─────────────────────────────────────────────┤
│  Section 3: 오시는 길 (#directions)           │
│  - 카카오맵 (full-width)                      │
│  - 기본 정보 카드 (주소/전화/팩스)              │
│  - 교통 안내 카드 (지하철/버스)                 │
└─────────────────────────────────────────────┘
```

---

## 5. Navigation Changes

### 5.1 Footer Menu

```
변경 전:
더존비즈스쿨
├── 비즈스쿨 소개     → /about
└── 찾아오시는 길     → /directions

변경 후:
더존비즈스쿨
├── 비즈스쿨 소개     → /about
├── 강의장 소개       → /venue
└── 찾아오시는 길     → /venue#directions
```

### 5.2 MyPage "강의실 안내" 버튼

- 대상: OfflineCourseCard에서 `status === "수강확정"`일 때 표시되는 버튼
- 변경: `<button>` → `<Link href="/venue" target="_blank">`
- 새 탭에서 열어 마이페이지 상태 보존

### 5.3 Redirect

- `/directions` → `/venue#directions` (HTTP 308 Permanent)
- `next.config.mjs`에서 설정

---

## 6. Implementation Plan

### 6.1 File Changes

| Action | File | Description |
|--------|------|-------------|
| Create | `src/app/venue/page.tsx` | 통합 페이지 (시설 + 오시는 길) |
| Edit | `src/app/about/page.tsx` | Section 5 (강의장 소개) 제거 |
| Edit | `src/components/layout/Footer.tsx` | 푸터 메뉴 항목 변경 |
| Edit | `src/components/mypage/my-learning/OfflineCourseCard.tsx` | 강의실 안내 버튼 → Link |
| Edit | `next.config.mjs` | /directions → /venue#directions 리다이렉트 |
| Delete | `src/app/directions/page.tsx` | /venue로 통합되어 불필요 |

### 6.2 Reused Components

- `KakaoMap` (`src/components/directions/KakaoMap.tsx`) - 그대로 재사용
- `CONTACT_INFO`, `TRANSPORT_INFO` 상수 - venue 페이지로 이동

---

## 7. Success Criteria

### 7.1 Definition of Done

- [ ] `/venue` 페이지에서 강의장 시설 + 오시는 길 모두 표시
- [ ] `/venue#directions` 앵커로 오시는 길 섹션 직접 이동
- [ ] 푸터에 "강의장 소개"와 "찾아오시는 길" 두 메뉴 모두 존재
- [ ] `/directions` 접속 시 `/venue#directions`로 리다이렉트
- [ ] /about 페이지에서 강의장 소개 섹션 제거됨
- [ ] 마이페이지 "강의실 안내" 버튼 → `/venue`로 새 탭 이동
- [ ] 빌드 에러 없음

---

## 8. Architecture Considerations

### 8.1 Project Level Selection

| Level | Characteristics | Selected |
|-------|-----------------|:--------:|
| **Starter** | 정적 페이지 통합, 백엔드 불필요 | **O** |

### 8.2 Key Architectural Decisions

| Decision | Selected | Rationale |
|----------|----------|-----------|
| 라우트 | `/venue` | 짧고 명확, 기존 영문 URL 패턴과 일관 |
| 컴포넌트 구조 | 단일 page.tsx에 인라인 | 기존 /about, /directions와 동일한 패턴 |
| KakaoMap 위치 | `src/components/directions/` 유지 | 이동 불필요, import 경로만 변경 없음 |
| 리다이렉트 | next.config.mjs permanent redirect | SEO 보존 + 기존 북마크 호환 |

---

## 9. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 앵커 스크롤 시 고정 헤더에 가림 | Medium | High | scroll-margin-top 적용 |
| /directions 외부 링크 깨짐 | Medium | Low | 308 리다이렉트로 보존 |
| "찾아오시는 길" 라벨 누락으로 사용자 혼란 | High | Low | 푸터에 별도 항목으로 유지 |

---

## 10. Next Steps

1. [ ] Design 문서 작성 (`venue-page.design.md`)
2. [ ] 구현 시작
3. [ ] Gap Analysis

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-20 | Initial draft | allen |
