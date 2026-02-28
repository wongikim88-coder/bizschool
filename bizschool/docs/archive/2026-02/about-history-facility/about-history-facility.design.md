# Design: about-history-facility

> About 페이지에 연혁(History) 및 강의장 소개(Facility) 섹션 추가

**Plan 참조**: `docs/01-plan/features/about-history-facility.plan.md`

---

## 1. 페이지 구조

현재 About 페이지 구성에 Section 4, 5를 추가한다.

```
Section 1: Hero           — bg-gradient (blue)
Section 2: Features       — bg-white
Section 3: Cycle          — bg-[var(--color-light-bg)]
Section 4: 연혁 (NEW)     — bg-white
Section 5: 강의장 (NEW)   — bg-[var(--color-light-bg)]
```

배경색은 흰색 ↔ 회색 교차 패턴을 유지한다.

---

## 2. 데이터 구조

### 2-1. 연혁 데이터 (`historyData`)

같은 연도의 항목을 그룹핑하여 연도별로 묶는다.

```typescript
interface HistoryGroup {
  year: number;
  items: string[];
}

const historyData: HistoryGroup[] = [
  {
    year: 2001,
    items: [
      "서울시 성동교육청에 기업부설 평생교육원 설립신고",
      "제1,2 교육장(멀티미디어실 70석) 개설",
      "더존 네오플러스 실무용 버전 설치",
      "12월부터 사업주 훈련 교육 실시",
    ],
  },
  {
    year: 2008,
    items: [
      "노동부 기관평가 재직자·실업자 모두 B등급",
      "노동부 직업능력시설 인정(세무회계분야)",
      "지방특강 개최(대전, 대구, 부산)",
      "수강지원금 과정 실시",
      "신입사원 위탁과정 및 자격증 과정 운영",
    ],
  },
  {
    year: 2009,
    items: [
      "제3교육장 개설(멀티미디어실 30석)",
      "휴게실 등 편의시설 확대",
      "국세청 공무원 대상 위탁교육 실시",
    ],
  },
  {
    year: 2010,
    items: [
      "제4강의장 개설(멀티미디어실 25석)",
      "더존 아이플러스 프로그램 설치 및 교육",
    ],
  },
  {
    year: 2011,
    items: [
      "노동부 기관평가 B등급(동부지역 내 최고점수)",
    ],
  },
];
```

### 2-2. 강의장 시설 정보 (`facilityFeatures`)

```typescript
interface FacilityFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const facilityFeatures: FacilityFeature[] = [
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

---

## 3. Section 4: 연혁 섹션 상세 디자인

### 레이아웃

```
┌─────────────────────────────────────────────┐
│              mx-auto max-w-[1200px]         │
│                                             │
│   h2: "비즈스쿨 연혁"        (center)       │
│   p:  subtitle               (center)       │
│                                             │
│   ┌─────────────────────────────────────┐   │
│   │          Timeline                   │   │
│   │                                     │   │
│   │  [2001]──●── item1                  │   │
│   │          │   item2                  │   │
│   │          │   item3                  │   │
│   │          │   item4                  │   │
│   │          │                          │   │
│   │  [2008]──●── item1                  │   │
│   │          │   item2                  │   │
│   │          │   ...                    │   │
│   │          │                          │   │
│   │  [2009]──●── item1                  │   │
│   │          │   ...                    │   │
│   │          │                          │   │
│   │  [2010]──●── ...                    │   │
│   │          │                          │   │
│   │  [2011]──●── ...                    │   │
│   └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### 타임라인 디자인 상세

- **중앙선**: `border-l-2 border-[var(--color-border)]` (좌측 기준)
- **연도 뱃지**: `bg-[var(--color-primary)] text-white rounded-full px-4 py-1 text-sm font-bold`
- **도트**: `w-3 h-3 rounded-full bg-[var(--color-primary)]` (라인 위 원형)
- **항목 텍스트**: `text-sm text-[var(--color-body)]`
- **항목 구분**: `li` 리스트, 간격 `space-y-2`

### 반응형

- **모바일 (< md)**: 좌측 정렬 타임라인, 연도 뱃지 상단
- **데스크탑 (md+)**: 좌측 연도 + 중앙선 + 우측 내용 (동일 좌측 정렬 유지)

### CSS 클래스 패턴

```
section: bg-white
  container: mx-auto max-w-[1200px] px-4 py-16 md:py-24
    h2: text-center text-2xl font-bold text-[var(--color-dark)] md:text-3xl
    p: mx-auto mt-3 max-w-xl text-center text-[var(--color-muted)]
    timeline-wrapper: mt-12 mx-auto max-w-2xl
      year-group: relative pl-8 pb-10 border-l-2 border-[var(--color-border)]
        dot: absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-[var(--color-primary)]
        year-badge: inline-block bg-[var(--color-primary)] text-white rounded-full px-3 py-0.5 text-sm font-bold mb-3
        items: space-y-2
          item: text-sm text-[var(--color-body)] leading-relaxed
```

---

## 4. Section 5: 강의장 소개 섹션 상세 디자인

### 레이아웃

```
┌─────────────────────────────────────────────┐
│     bg-[var(--color-light-bg)]              │
│              mx-auto max-w-[1200px]         │
│                                             │
│   h2: "강의장 소개"          (center)       │
│   p:  subtitle               (center)       │
│                                             │
│   ┌──────────────┐  ┌──────────────┐        │
│   │   Image 1    │  │   Image 2    │        │
│   │  (강의장     │  │  (수업 중    │        │
│   │   전경)      │  │   모습)      │        │
│   └──────────────┘  └──────────────┘        │
│                                             │
│   ┌────┐ ┌────┐ ┌────┐ ┌────┐              │
│   │feat│ │feat│ │feat│ │feat│              │
│   │ 1  │ │ 2  │ │ 3  │ │ 4  │              │
│   └────┘ └────┘ └────┘ └────┘              │
└─────────────────────────────────────────────┘
```

### 이미지 영역

- **그리드**: `grid grid-cols-1 md:grid-cols-2 gap-4`
- **이미지 컨테이너**: `relative overflow-hidden rounded-2xl aspect-[16/9]`
- **Next.js Image**: `fill`, `className="object-cover"`, `sizes="(max-width:768px) 100vw, 50vw"`
- **이미지 경로**: `/images/about/bzschool_img_1.jpg`, `/images/about/bzschool_img_2.jpg`

### 시설 특징 그리드

- **그리드**: `grid grid-cols-2 md:grid-cols-4 gap-6 mt-10`
- **카드**: `text-center`
  - 아이콘: `mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)]`
  - 제목: `mt-3 text-sm font-bold text-[var(--color-dark)]`
  - 설명: `mt-1 text-xs text-[var(--color-muted)]`

### CSS 클래스 패턴

```
section: bg-[var(--color-light-bg)]
  container: mx-auto max-w-[1200px] px-4 py-16 md:py-24
    h2: text-center text-2xl font-bold text-[var(--color-dark)] md:text-3xl
    p: mx-auto mt-3 max-w-xl text-center text-[var(--color-muted)]
    image-grid: mt-12 grid grid-cols-1 md:grid-cols-2 gap-4
      image-container: relative overflow-hidden rounded-2xl aspect-[16/9]
        Image: fill, object-cover
    features-grid: mt-10 grid grid-cols-2 md:grid-cols-4 gap-6
      feature-card: text-center
        icon-wrapper: mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)]
        title: mt-3 text-sm font-bold text-[var(--color-dark)]
        description: mt-1 text-xs text-[var(--color-muted)]
```

---

## 5. 사용 아이콘 (lucide-react)

기존 import에 추가할 아이콘:

| 아이콘 | 용도 |
|--------|------|
| `Monitor` | 1인 1PC 환경 |
| `Laptop` | 더존 Smart A |
| `Calendar` | 연혁 섹션 제목 (선택) |

기존 재사용: `BookOpen`, `Users`

---

## 6. 이미지 파일

| 소스 파일 | 대상 경로 |
|-----------|-----------|
| `c:\Users\allen\Downloads\bzschool_img_1.jpg` | `public/images/about/bzschool_img_1.jpg` |
| `c:\Users\allen\Downloads\bzschool_img_2.jpg` | `public/images/about/bzschool_img_2.jpg` |

---

## 7. 수정 파일 목록

| 파일 | 작업 | 변경 내용 |
|------|------|-----------|
| `src/app/about/page.tsx` | 수정 | 연혁 데이터, 강의장 데이터 추가 + Section 4, 5 JSX 추가 |
| `public/images/about/bzschool_img_1.jpg` | 신규 | 강의장 이미지 1 |
| `public/images/about/bzschool_img_2.jpg` | 신규 | 강의장 이미지 2 |

---

## 8. 구현 순서

1. `public/images/about/` 디렉토리 생성 및 이미지 복사
2. `page.tsx` 상단에 `Image` import + 추가 lucide 아이콘 import
3. `historyData` 배열 정의
4. `facilityFeatures` 배열 정의
5. Section 4 (연혁) JSX 작성 — Cycle 섹션 아래
6. Section 5 (강의장) JSX 작성 — 연혁 섹션 아래
7. 반응형 확인 (모바일 / 데스크탑)

---

## 9. 디자인 토큰 (기존 재사용)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--color-primary` | `#155dfc` | 연도 뱃지, 아이콘 색 |
| `--color-primary-light` | `#eff6ff` | 아이콘 배경 |
| `--color-dark` | `#282c34` | 제목 텍스트 |
| `--color-body` | `#4a5565` | 본문 텍스트 |
| `--color-muted` | `#6a7282` | 서브 텍스트 |
| `--color-border` | `#e5e7eb` | 타임라인 선 |
| `--color-light-bg` | `#f8f9fa` | 강의장 섹션 배경 |
