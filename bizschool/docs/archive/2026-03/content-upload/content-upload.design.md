# Design: 콘텐츠 업로드 (콘텐츠 유형 선택)

> **Feature**: content-upload
> **Plan**: [content-upload.plan.md](../../01-plan/features/content-upload.plan.md)
> **Created**: 2026-03-27
> **Status**: Design

---

## 1. 페이지 레이아웃

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│         반갑습니다. {사용자이름} 님!                     │
│         어떤 강의를 만들어볼까요?                        │
│                                                      │
│                 ┌─ 말풍선 배너 ──────────────────┐     │
│                 │ 영상 없이도 간단히 시작할 수 있어요! │     │
│                 └───────────────────────────────┘     │
│                                                      │
│  ┌──── 강의 카드 ──────────┐ ┌──── 컬럼 카드 ──────────┐│
│  │ 🎵 강의           (●)  │ │ 🧩 컬럼            (○) ││
│  │                        │ │                        ││
│  │ 원하는 시간에 자유롭게   │ │ 작지만 강력한 지식       ││
│  │ 학습하는 온라인 강의     │ │ 한 조각                 ││
│  │                        │ │                        ││
│  │ 영상, 글, 미션, 자동    │ │ 글, 이미지, PDF,        ││
│  │ 메세지 등을 통해 효과적인│ │ 템플릿 등 다양한 형태의  ││
│  │ 학습 커리큘럼을 만듭니다.│ │ 콘텐츠를 쉽게 만들고,   ││
│  │                        │ │ 필요한 사람에게 가치를   ││
│  │ #상시 수업  #영상 수업   │ │ 전달할 수 있어요.       ││
│  │                        │ │                        ││
│  │                        │ │ #템플릿 #에셋 #아티클    ││
│  └────────────────────────┘ └────────────────────────┘│
│                                                      │
│              ● ○ ○ ○ ○   (스텝 인디케이터)              │
│                                                      │
│              ┌──────────┐                             │
│              │   다음    │                             │
│              └──────────┘                             │
└──────────────────────────────────────────────────────┘
```

---

## 2. 컴포넌트 설계

### 2-1. ContentUploadPage (페이지)

**파일**: `src/app/expert/upload/page.tsx`
**타입**: Client Component (`"use client"` — useSession, useState)

```
State:
- selectedType: "lecture" | "column" (기본값: "lecture")

권한 체크:
- useSession()으로 session 확인
- status === "loading" → 로딩 UI
- status === "unauthenticated" || role !== "expert" → redirect("/")

구조:
- 인사말 헤더 (session.user.name 활용)
- 말풍선 배너
- ContentTypeCard 2개 그리드
- StepIndicator (currentStep=1, totalSteps=5)
- "다음" 버튼
```

### 2-2. ContentTypeCard (카드 컴포넌트)

**파일**: `src/components/expert/ContentTypeCard.tsx`
**타입**: Client Component (클릭 이벤트)

```
Props:
  type: "lecture" | "column"
  icon: ReactNode
  title: string
  subtitle: string
  description: string
  tags: string[]
  isSelected: boolean
  onSelect: () => void

구조:
┌──────────────────────────────────┐
│  [icon] {title}            (○)  │  ← 라디오 표시
│                                  │
│  {subtitle}                      │  ← 굵은 서브타이틀
│                                  │
│  {description}                   │  ← 회색 설명 텍스트
│                                  │
│  #{tag1}  #{tag2}  #{tag3}       │  ← 초록색 해시태그
└──────────────────────────────────┘

선택 상태:
- isSelected=true  → border-[var(--color-primary)], 라디오 filled(●)
- isSelected=false → border-gray-200, 라디오 empty(○)
```

---

## 3. 콘텐츠 유형 데이터

```ts
// page.tsx 내부 상수로 정의 (별도 data 파일 불필요)

const CONTENT_TYPES = [
  {
    type: "lecture" as const,
    title: "강의",
    subtitle: "원하는 시간에 자유롭게 학습하는 온라인 강의",
    description:
      "영상, 글, 미션, 자동 메세지 등을 통해 효과적인 학습 커리큘럼을 만듭니다.",
    tags: ["상시 수업", "영상 수업"],
  },
  {
    type: "column" as const,
    title: "컬럼",
    subtitle: "작지만 강력한 지식 한 조각",
    description:
      "클립은 글, 이미지, PDF, 템플릿 등 다양한 형태의 콘텐츠를 쉽게 만들고, 필요한 사람에게 가치를 전달할 수 있어요.",
    tags: ["템플릿", "에셋", "아티클"],
  },
];
```

---

## 4. UI 상세 명세

### 4-1. 인사말 영역

```
- 제목: "반갑습니다. {session.user.name} 님!"
  - text-2xl ~ text-3xl, font-bold, text-center
- 부제: "어떤 강의를 만들어볼까요?"
  - text-base, text-[var(--color-muted)], text-center
- 상하 패딩: pt-16 pb-4
```

### 4-2. 말풍선 배너

```
- 텍스트: "영상 없이도 간단히 시작할 수 있어요!"
- 스타일: 배경 dark(--color-dark), 텍스트 white, rounded-full
- 위치: 카드 그리드 우측 상단 위 (flex justify-end)
- px-4 py-2, text-sm
- 말풍선 꼬리: CSS pseudo-element 또는 생략 가능
```

### 4-3. 카드 스타일

```
- 기본: border border-gray-200 rounded-2xl p-6 cursor-pointer
- 선택: border-2 border-[var(--color-primary)]
- hover: shadow-md transition
- 아이콘: 32x32 영역, 색상 아이콘 (Lucide 또는 커스텀)
  - 강의: Video 또는 Play 아이콘 (배경 민트/초록)
  - 컬럼: FileText 또는 Puzzle 아이콘 (배경 민트/초록)
- 라디오:
  - 미선택: w-6 h-6 rounded-full border-2 border-gray-300
  - 선택: w-6 h-6 rounded-full bg-[var(--color-primary)] + 내부 흰색 체크
- 태그: text-[var(--color-primary)] text-sm font-medium
```

### 4-4. 스텝 인디케이터

```
- 5개 도트 (w-2.5 h-2.5 rounded-full)
- 활성(1번): bg-[var(--color-primary)]
- 비활성(2~5): bg-gray-300
- gap-2, flex justify-center
```

### 4-5. "다음" 버튼

```
- 텍스트: "다음"
- 스타일: bg-[var(--color-primary)] text-white rounded-lg px-12 py-3
- 위치: 스텝 인디케이터 아래, text-center
- 클릭: 현재 no-op (향후 확장)
```

---

## 5. 반응형 설계

| 뷰포트 | 카드 그리드 | 카드 크기 |
|--------|-----------|----------|
| 모바일 (<768px) | 1열 (`grid-cols-1`) | 전체 너비 |
| 데스크톱 (≥768px) | 2열 (`grid-cols-2`) | 균등 분배 |

전체 컨테이너: `max-w-3xl mx-auto px-4`

---

## 6. 접근 권한 흐름

```
사용자 접근 → useSession()
  ├── status === "loading" → 스켈레톤 또는 빈 화면
  ├── status === "unauthenticated" → router.replace("/login")
  ├── role !== "expert" → router.replace("/")
  └── role === "expert" → 페이지 렌더링
```

---

## 7. 구현 순서

| 순서 | 작업 | 파일 | 의존성 |
|------|------|------|--------|
| 1 | ContentTypeCard 컴포넌트 생성 | `src/components/expert/ContentTypeCard.tsx` | 없음 |
| 2 | /expert/upload 페이지 생성 | `src/app/expert/upload/page.tsx` | ContentTypeCard |

---

## 8. 스타일 가이드

- **색상**: 기존 CSS 변수 활용 (`--color-primary`, `--color-dark`, `--color-muted`)
- **카드 라운드**: `rounded-2xl` (참조 이미지와 동일)
- **태그 색상**: `text-[var(--color-primary)]` (초록/민트)
- **전체 배경**: `bg-white` 또는 `bg-[var(--color-light-bg)]`
- **폰트**: 제목 bold, 설명 regular, 태그 medium
