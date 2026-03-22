# venue-page Design Document

> **Summary**: /about의 강의장 소개 섹션과 /directions를 통합한 `/venue` 페이지 상세 설계
>
> **Project**: BIZSCHOOL
> **Author**: allen
> **Date**: 2026-03-20
> **Status**: Draft
> **Plan Reference**: `docs/01-plan/features/venue-page.plan.md`

---

## 1. Page Structure

### 1.1 `/venue` 페이지 레이아웃

```
┌─────────────────────────────────────────────────────┐
│  Section 1: 페이지 헤더                               │
│  ┌───────────────────────────────────────────────┐   │
│  │ h1: "강의장 소개"                               │   │
│  │ subtitle: 더존비즈스쿨 평생교육원의 시설과        │   │
│  │          오시는 길을 안내합니다.                  │   │
│  │ hr (구분선)                                     │   │
│  └───────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│  Section 2: 강의장 시설 안내 (id="facilities")        │
│  ┌─────────────────┬─────────────────┐              │
│  │  강의장 사진 1    │  강의장 사진 2    │  grid 2col  │
│  │  (16:10)         │  (16:10)         │              │
│  └─────────────────┴─────────────────┘              │
│  ┌────┬────┬────┬────┐                              │
│  │1인  │40석 │Smart│실무 │  시설 특징 4카드           │
│  │1PC  │규모  │A    │교육  │  grid 4col (md) / 2col  │
│  └────┴────┴────┴────┘                              │
├─────────────────────────────────────────────────────┤
│  Section 3: 오시는 길 (id="directions")              │
│  scroll-mt-20 (고정 헤더 64px 오프셋)                 │
│  ┌───────────────────────────────────────────────┐   │
│  │ h2: "오시는 길"                                 │   │
│  │ subtitle: 위치와 교통편을 안내합니다.              │   │
│  └───────────────────────────────────────────────┘   │
│  ┌───────────────────────────────────────────────┐   │
│  │              KakaoMap (full-width)              │   │
│  │              h-[400px] / md:h-[480px]           │   │
│  └───────────────────────────────────────────────┘   │
│  ┌──────────────────┬──────────────────┐            │
│  │  기본 정보 카드    │  교통 안내 카드    │ grid 2col │
│  │  - 주소           │  - 지하철          │           │
│  │  - 전화           │  - 버스            │           │
│  │  - 팩스           │                    │           │
│  └──────────────────┴──────────────────┘            │
└─────────────────────────────────────────────────────┘
```

---

## 2. Data Constants

### 2.1 시설 데이터 (from `/about` page)

`/venue/page.tsx`에 인라인으로 정의:

```typescript
import { Monitor, Users, Laptop, BookOpen } from "lucide-react";

const facilityFeatures = [
  {
    icon: Monitor,
    title: "1인 1PC 환경",
    description: "인터넷 연결 가능한 PC 및 노트북 비치",
  },
  {
    icon: Users,
    title: "40석 규모",
    description: "총 40석 규모의 독립 강의장 운영",
  },
  {
    icon: Laptop,
    title: "더존 Smart A",
    description: "실무용 버전 프로그램 설치 완비",
  },
  {
    icon: BookOpen,
    title: "실무 교육",
    description: "이론 + 실습 통합 멀티미디어 교육",
  },
];
```

### 2.2 연락처/교통 데이터 (from `/directions` page)

`/venue/page.tsx`에 인라인으로 정의:

```typescript
const CONTACT_INFO = {
  name: "더존비즈스쿨 평생교육원",
  address: "서울 광진구 자양로 142 청양빌딩 3층",
  phone: "02-456-9156",
  fax: "02-452-9762",
};

const TRANSPORT_INFO = {
  subway: {
    line: "2호선",
    station: "구의역",
    exit: "1번출구",
    walkTime: "도보 8분",
    distance: "200m 이내",
  },
  bus: {
    routes: ["302", "303", "320", "2221", "3215", "3216", "3220", "9403"],
    stop: "광진구청 앞",
    walkTime: "도보 5분",
  },
};
```

---

## 3. Component Design

### 3.1 파일 구조

```
src/
├── app/
│   ├── about/page.tsx              ← Section 5 제거
│   ├── directions/page.tsx         ← 삭제
│   └── venue/page.tsx              ← 신규 생성
├── components/
│   └── directions/
│       └── KakaoMap.tsx            ← 기존 그대로 유지
└── next.config.mjs                 ← 리다이렉트 추가
```

### 3.2 `/venue/page.tsx` (Server Component)

**역할**: 강의장 시설 + 오시는 길 통합 페이지

**Metadata**:
```typescript
export const metadata: Metadata = {
  title: "강의장 소개 및 찾아오시는 길 | BIZSCHOOL",
  description:
    "더존비즈스쿨 평생교육원 강의장 시설 안내와 오시는 길. 주소, 교통편(2호선 구의역 1번출구), 지도 정보를 확인하세요.",
};
```

**구현 사양**:

#### Section 1: 페이지 헤더
- 컨테이너: `mx-auto max-w-[1200px] px-4 pt-12 pb-8 md:pt-16 md:pb-10`
- h1: `text-2xl font-bold text-[var(--color-dark)] md:text-3xl` → "강의장 소개"
- subtitle: `mt-3 text-base text-[var(--color-muted)] md:text-lg` → "더존비즈스쿨 평생교육원의 시설과 오시는 길을 안내합니다."
- hr: `mt-6 border-t-2 border-[var(--color-border)]`

#### Section 2: 강의장 시설 안내 (`id="facilities"`)
- 배경: `bg-[var(--color-light-bg)]`
- 내부 컨테이너: `mx-auto max-w-[1200px] px-4 py-16 md:py-24`
- h2: `text-center text-2xl font-bold text-[var(--color-dark)] md:text-3xl` → "강의장 시설 안내"
- subtitle: `mx-auto mt-3 max-w-xl text-center text-[var(--color-muted)]` → "실무 교육에 최적화된 멀티미디어 강의 환경"
- 이미지 그리드: `mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2`
  - 각 이미지: `relative aspect-[16/10] overflow-hidden rounded-2xl`
  - `<Image src="/images/about/bzschool_img_3.jpg" alt="비즈스쿨 강의장" fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />`
  - `<Image src="/images/about/bzschool_img_4.jpg" alt="비즈스쿨 강의장" fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />`
- 시설 특징 그리드: `mt-10 grid grid-cols-2 gap-6 md:grid-cols-4`
  - 각 카드: `text-center`
  - 아이콘: `mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)]`, size={24}
  - 제목: `mt-3 text-sm font-bold text-[var(--color-dark)]`
  - 설명: `mt-1 text-xs text-[var(--color-muted)]`

#### Section 3: 오시는 길 (`id="directions"`)
- **앵커 스크롤**: `id="directions" className="scroll-mt-20"` (고정 헤더 h-16 = 64px → scroll-mt-20 = 80px)
- 컨테이너: `mx-auto max-w-[1200px] px-4 py-16 md:py-24`
- h2: `text-center text-2xl font-bold text-[var(--color-dark)] md:text-3xl` → "오시는 길"
- subtitle: `mx-auto mt-3 max-w-xl text-center text-[var(--color-muted)]` → "더존비즈스쿨 평생교육원의 위치와 교통편을 안내합니다."
- 카카오맵: `mt-12 overflow-hidden rounded-2xl shadow-lg` → `<KakaoMap />`
- 정보 카드 그리드: `mt-10 grid grid-cols-1 gap-8 md:grid-cols-2`
  - **기본 정보 카드**: 기존 `/directions` 그대로 복사
    - `rounded-2xl border border-[var(--color-border)] bg-white p-8`
    - h3: `text-lg font-bold text-[var(--color-dark)]` → "기본 정보"
    - 주소/전화/팩스 각 항목: `flex items-start gap-4`
    - 아이콘 배경: `flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)]`
    - 라벨: `text-sm font-medium text-[var(--color-dark)]`
    - 값: `mt-0.5 text-sm text-[var(--color-muted)]`
  - **교통 안내 카드**: 기존 `/directions` 그대로 복사
    - 동일 카드 스타일
    - 지하철: 아이콘 `TrainFront`, 배경 `bg-emerald-50 text-emerald-600`
    - 버스: 아이콘 `Bus`, 배경 `bg-blue-50 text-blue-600`

---

## 4. Footer Changes

### 4.1 `footerLinks` 배열 변경 (`Footer.tsx`)

```typescript
// 변경 전:
{
  title: "더존비즈스쿨",
  links: [
    { label: "비즈스쿨 소개", href: "/about" },
    { label: "찾아오시는 길", href: "/directions" },
  ],
},

// 변경 후:
{
  title: "더존비즈스쿨",
  links: [
    { label: "비즈스쿨 소개", href: "/about" },
    { label: "강의장 소개", href: "/venue" },
    { label: "찾아오시는 길", href: "/venue#directions" },
  ],
},
```

---

## 5. OfflineCourseCard Changes

### 5.1 "강의실 안내" 버튼 → Link (`OfflineCourseCard.tsx`)

**변경 전** (line 204-210):
```tsx
<button
  disabled={course.status === "출석완료"}
  className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)] disabled:cursor-not-allowed disabled:opacity-50"
>
  {getCtaLabel(course.status)}
</button>
```

**변경 후**:
```tsx
{course.status === "수강확정" ? (
  <Link
    href="/venue"
    target="_blank"
    rel="noopener noreferrer"
    className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
  >
    강의실 안내
  </Link>
) : (
  <button
    disabled={course.status === "출석완료"}
    className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)] disabled:cursor-not-allowed disabled:opacity-50"
  >
    {getCtaLabel(course.status)}
  </button>
)}
```

- `import Link from "next/link"` 추가 필요
- `target="_blank"` + `rel="noopener noreferrer"`: 마이페이지 상태 보존을 위해 새 탭에서 열기

---

## 6. Redirect Configuration

### 6.1 `next.config.mjs`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/directions",
        destination: "/venue#directions",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

- `permanent: true` → HTTP 308 (SEO 보존, 크롤러에게 영구 이동 통보)
- 기존 `/directions` 북마크/외부 링크 자동 처리

---

## 7. `/about` Page Changes

### 7.1 Section 5 제거 (`about/page.tsx`)

**제거 대상** (line 374-421):
- `{/* Section 5: 강의장 소개 */}` 전체 섹션 삭제
- `facilityFeatures` 상수 배열 삭제 (line 110-131)
- 미사용 import 정리: `Monitor`, `Laptop` (다른 곳에서 사용하지 않는 경우)

**제거 후**: /about 페이지는 Section 1~4 (Hero, Features, Cycle, 연혁)만 유지

---

## 8. `/directions` Page Deletion

### 8.1 파일 삭제

- `src/app/directions/page.tsx` 삭제
- `src/components/directions/KakaoMap.tsx`는 유지 (venue 페이지에서 사용)
- `src/app/directions/` 디렉토리 삭제

---

## 9. Implementation Order

| Step | Task | Files | FR |
|------|------|-------|----|
| 1 | `/venue/page.tsx` 생성 | `src/app/venue/page.tsx` | FR-01, FR-02, FR-03, FR-04 |
| 2 | Footer 메뉴 변경 | `src/components/layout/Footer.tsx` | FR-05 |
| 3 | OfflineCourseCard 버튼 변경 | `src/components/mypage/my-learning/OfflineCourseCard.tsx` | FR-08 |
| 4 | `/about` Section 5 제거 | `src/app/about/page.tsx` | FR-07 |
| 5 | `/directions` 페이지 삭제 | `src/app/directions/page.tsx` | - |
| 6 | 리다이렉트 설정 | `next.config.mjs` | FR-06 |

---

## 10. Acceptance Criteria

| ID | Criteria | Verification |
|----|----------|-------------|
| AC-01 | `/venue` 페이지에 강의장 사진 2장 + 시설 특징 4카드 표시 | Visual |
| AC-02 | `/venue` 페이지에 카카오맵 + 기본정보 + 교통안내 표시 | Visual |
| AC-03 | `/venue#directions` 접속 시 오시는 길 섹션으로 스크롤 (헤더에 가리지 않음) | Functional |
| AC-04 | 푸터 "강의장 소개" → `/venue`, "찾아오시는 길" → `/venue#directions` | Navigation |
| AC-05 | `/directions` 접속 시 `/venue#directions`로 리다이렉트 | Redirect |
| AC-06 | `/about` 페이지에서 강의장 소개 섹션이 제거됨 | Visual |
| AC-07 | 마이페이지 "강의실 안내" 버튼 클릭 시 `/venue` 새 탭 열림 | Functional |
| AC-08 | 빌드 에러 없음 | `npm run build` |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-20 | Initial draft | allen |
