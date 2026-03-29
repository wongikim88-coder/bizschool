# Design: 강의 수업 정보 입력 (Step 4)

## 개요

- **Feature**: lecture-course-info
- **Phase**: Design
- **작성일**: 2026-03-27
- **참조 Plan**: `docs/01-plan/features/lecture-course-info.plan.md`

---

## 1. 상태 설계 (State)

### 1-1. 신규 추가 state (page.tsx)

```typescript
// 입력 모드
type InputMode = "ai" | "manual";
type AiStatus = "idle" | "loading" "done" | "error";

// 강의 기본정보
const [courseTitle, setCourseTitle] = useState("");
const [courseDescription, setCourseDescription] = useState("");

// 커리큘럼 (업로드 파일 기반)
interface LessonInfo {
  fileId: string;       // uploadedFiles[n].id
  fileName: string;     // uploadedFiles[n].name
  lessonTitle: string;  // 수업 제목 입력값
  aiGenerated: boolean; // AI가 채운 값 여부
}
const [lessons, setLessons] = useState<LessonInfo[]>([]);

// AI/수동 모드
const [inputMode, setInputMode] = useState<InputMode>("ai");
const [aiStatus, setAiStatus] = useState<AiStatus>("idle");

// 미리보기 패널
const [isPreviewOpen, setIsPreviewOpen] = useState(false);

// courseTitle AI 생성 여부
const [courseTitleAi, setCourseTitleAi] = useState(false);
const [courseDescAi, setCourseDescAi] = useState(false);
```

### 1-2. 파생값 (derived)

```typescript
// 유효성: 강의 제목 + 전체 수업 제목 모두 입력 완료
const isCourseInfoValid =
  courseTitle.trim() !== "" &&
  lessons.every((l) => l.lessonTitle.trim() !== "");

// 첫 번째 빈 수업 제목의 index
const firstEmptyLessonIndex = lessons.findIndex(
  (l) => l.lessonTitle.trim() === ""
);
```

### 1-3. Step 진입 시 lessons 초기화

```typescript
// Step 4 진입 시 uploadedFiles → lessons 동기화
useEffect(() => {
  if (currentStep === 4) {
    setLessons(
      uploadedFiles
        .filter((f) => f.status === "complete")
        .map((f) => ({
          fileId: f.id,
          fileName: f.name,
          lessonTitle: "",
          aiGenerated: false,
        }))
    );
  }
}, [currentStep]);
```

---

## 2. AI 자동 생성 로직 (Mock)

### 2-1. Mock 데이터 생성 함수

실제 AI API 연동 없이 1.5초 딜레이 후 Mock 결과 반환.

```typescript
const runAiGeneration = async () => {
  setAiStatus("loading");
  await new Promise((res) => setTimeout(res, 1500));

  // Mock: 파일명에서 제목 추출 (실제 AI 대체)
  const mockTitle = "세무 실무 마스터클래스";
  const mockDesc =
    "본 강의는 세무 분야의 핵심 실무 지식을 체계적으로 다루며, " +
    "실제 사례 중심으로 현장에서 바로 활용할 수 있는 내용을 제공합니다.";
  const mockLessonTitles = lessons.map((l, i) => {
    const name = l.fileName.replace(/\.[^.]+$/, "").replace(/[_-]/g, " ");
    return `수업 ${i + 1}: ${name}`;
  });

  setCourseTitle(mockTitle);
  setCourseTitleAi(true);
  setCourseDescription(mockDesc);
  setCourseDescAi(true);
  setLessons((prev) =>
    prev.map((l, i) => ({
      ...l,
      lessonTitle: mockLessonTitles[i] ?? "",
      aiGenerated: true,
    }))
  );
  setAiStatus("done");
};
```

### 2-2. 모드 전환 시 덮어쓰기 확인

```typescript
// AI 탭으로 돌아올 때 기존 입력이 있으면 확인
const handleSwitchToAi = () => {
  const hasInput =
    courseTitle !== "" ||
    courseDescription !== "" ||
    lessons.some((l) => l.lessonTitle !== "");

  if (hasInput && aiStatus === "done") {
    setShowOverwriteConfirm(true); // 별도 confirm modal
  } else {
    setInputMode("ai");
  }
};
```

---

## 3. 컴포넌트 구조 및 JSX 설계

### 3-1. Step 4 전체 렌더링 조건 수정

```tsx
// 기존: currentStep >= 3
// 수정:
{currentStep === 3 && ( /* 영상 업로드 */ )}
{currentStep === 4 && ( /* 수업 정보 입력 */ )}
```

### 3-2. 세그먼트 탭

```tsx
{/* Segmented Control */}
<div className="flex rounded-xl bg-gray-100 p-1">
  {(["ai", "manual"] as InputMode[]).map((mode) => (
    <button
      key={mode}
      type="button"
      onClick={() => mode === "ai" ? handleSwitchToAi() : setInputMode("manual")}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-all ${
        inputMode === mode
          ? "bg-white text-[var(--color-dark)] shadow-sm"
          : "text-[var(--color-muted)] hover:text-[var(--color-dark)]"
      }`}
    >
      {mode === "ai" && <Sparkles size={14} />}
      {mode === "ai" ? "AI 자동 생성" : "직접 입력"}
    </button>
  ))}
</div>
```

### 3-3. AI 생성 유도 배너 (AI 탭, aiStatus === "idle")

```tsx
{inputMode === "ai" && aiStatus === "idle" && (
  <div className="rounded-xl border border-dashed border-[var(--color-primary)]/40 bg-[#f0fdf7] px-6 py-5 text-center">
    <Sparkles size={20} className="mx-auto text-[var(--color-primary)]" />
    <p className="mt-2 text-sm text-[var(--color-dark)]">
      AI가 업로드된 영상을 분석하여 자동으로 입력합니다.
    </p>
    <button
      type="button"
      onClick={runAiGeneration}
      className="mt-3 rounded-lg bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white hover:opacity-90"
    >
      AI로 자동 생성
    </button>
  </div>
)}
```

### 3-4. AI 로딩 상태 (스켈레톤)

```tsx
{inputMode === "ai" && aiStatus === "loading" && (
  <div className="space-y-4 animate-pulse">
    <div className="h-10 rounded-lg bg-gray-200" />  {/* 제목 skeleton */}
    <div className="h-24 rounded-lg bg-gray-200" />  {/* 설명 skeleton */}
    {lessons.map((_, i) => (
      <div key={i} className="h-12 rounded-lg bg-gray-200" />
    ))}
  </div>
)}
```

### 3-5. AI 생성됨 배지

```tsx
// 인라인 컴포넌트
function AiBadge() {
  return (
    <span className="rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
      AI 생성됨
    </span>
  );
}
```

### 3-6. 강의 제목 입력 필드

```tsx
<div>
  <div className="mb-1.5 flex items-center gap-2">
    <label className="text-sm font-medium text-[var(--color-dark)]">
      강의 제목 <span className="text-red-400">*</span>
    </label>
    {courseTitleAi && <AiBadge />}
  </div>
  <input
    type="text"
    value={courseTitle}
    onChange={(e) => {
      setCourseTitle(e.target.value);
      setCourseTitleAi(false); // 수정 시 배지 제거
    }}
    placeholder="강의 제목을 입력해주세요."
    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-[var(--color-dark)] outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
  />
</div>
```

### 3-7. 강의 소개 textarea

```tsx
<div>
  <div className="mb-1.5 flex items-center gap-2">
    <label className="text-sm font-medium text-[var(--color-dark)]">
      강의 소개 <span className="text-red-400">*</span>
    </label>
    {courseDescAi && <AiBadge />}
  </div>
  <textarea
    value={courseDescription}
    onChange={(e) => {
      if (e.target.value.length <= 500) {
        setCourseDescription(e.target.value);
        setCourseDescAi(false);
      }
    }}
    rows={4}
    placeholder="강의 소개를 입력해주세요."
    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-[var(--color-dark)] outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
  />
  <p className="mt-1 text-right text-xs text-[var(--color-muted)]">
    {courseDescription.length} / 500자
  </p>
</div>
```

### 3-8. 커리큘럼 카드 목록

```tsx
{/* Curriculum list */}
<div className="space-y-2">
  {lessons.map((lesson, idx) => (
    <div
      key={lesson.fileId}
      className="rounded-xl border border-gray-200 bg-white px-4 py-3"
    >
      {/* 카드 헤더 */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-[var(--color-muted)]">
          {idx + 1}
        </span>
        <span className="flex-1 truncate text-xs text-[var(--color-muted)]">
          {lesson.fileName}
        </span>
        {lesson.aiGenerated && lesson.lessonTitle !== "" && <AiBadge />}
        {lesson.lessonTitle.trim() === "" && (
          <span className="text-xs text-gray-400">미입력</span>
        )}
      </div>
      {/* 수업 제목 input */}
      <input
        type="text"
        value={lesson.lessonTitle}
        onChange={(e) => {
          setLessons((prev) =>
            prev.map((l, i) =>
              i === idx
                ? { ...l, lessonTitle: e.target.value, aiGenerated: false }
                : l
            )
          );
        }}
        placeholder="수업 제목을 입력해주세요."
        className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[var(--color-dark)] outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
      />
    </div>
  ))}
</div>
```

### 3-9. refs 목록 (빈 필드 포커스용)

```typescript
const lessonInputRefs = useRef<(HTMLInputElement | null)[]>([]);
const courseTitleRef = useRef<HTMLInputElement>(null);

// 다음 버튼 클릭 핸들러
const handleStep4Next = () => {
  if (courseTitle.trim() === "") {
    courseTitleRef.current?.focus();
    courseTitleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  if (firstEmptyLessonIndex >= 0) {
    lessonInputRefs.current[firstEmptyLessonIndex]?.focus();
    lessonInputRefs.current[firstEmptyLessonIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    return;
  }
  // 유효 → 다음 step (no-op: step 5 미구현)
};
```

---

## 4. 미리보기 패널 설계

### 4-1. FAB 버튼

```tsx
{currentStep === 4 && (
  <button
    type="button"
    onClick={() => setIsPreviewOpen((v) => !v)}
    className={`fixed bottom-8 right-8 z-40 flex h-14 w-14 flex-col items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 ${
      isPreviewOpen
        ? "bg-[var(--color-primary)] text-white"
        : "border border-gray-200 bg-white text-[var(--color-dark)]"
    }`}
  >
    <Eye size={20} />
    <span className="mt-0.5 text-[10px] font-medium">미리보기</span>
  </button>
)}
```

### 4-2. 투명 백드롭

```tsx
{isPreviewOpen && (
  <div
    className="fixed inset-0 z-40"
    onClick={() => setIsPreviewOpen(false)}
  />
)}
```

### 4-3. 슬라이드 패널

```tsx
<div
  className={`fixed right-0 top-0 z-50 h-full w-[380px] overflow-y-auto border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
    isPreviewOpen ? "translate-x-0" : "translate-x-full"
  }`}
>
  {/* 패널 헤더 */}
  <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
    <div>
      <p className="text-sm font-semibold text-[var(--color-dark)]">미리보기</p>
      <p className="text-xs text-[var(--color-muted)]">수강생에게 보이는 화면</p>
    </div>
    <button
      type="button"
      onClick={() => setIsPreviewOpen(false)}
      className="text-gray-400 hover:text-gray-600"
    >
      <X size={18} />
    </button>
  </div>

  {/* 패널 콘텐츠 */}
  <div className="px-5 py-4">
    {/* 썸네일 플레이스홀더 */}
    <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-gray-100">
      <Camera size={24} className="text-gray-400" />
    </div>

    {/* 강의 제목 */}
    <p className={`mt-4 text-base font-bold ${
      courseTitle ? "text-[var(--color-dark)]" : "italic text-gray-400"
    }`}>
      {courseTitle || "강의 제목을 입력해주세요."}
    </p>

    {/* 강사명 */}
    <p className="mt-1 text-xs text-[var(--color-muted)]">
      {session?.user?.name ?? "강사명"}
    </p>

    {/* 구분선 */}
    <div className="my-4 border-t border-gray-100" />

    {/* 강의 소개 */}
    <p className="mb-1 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">
      강의 소개
    </p>
    <p className={`text-sm leading-relaxed ${
      courseDescription ? "text-[var(--color-dark)]" : "italic text-gray-400"
    }`}>
      {courseDescription || "강의 소개를 입력해주세요."}
    </p>

    {/* 구분선 */}
    <div className="my-4 border-t border-gray-100" />

    {/* 커리큘럼 */}
    <p className="mb-2 text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">
      커리큘럼
    </p>
    <ol className="space-y-1.5">
      {lessons.map((l, i) => (
        <li key={l.fileId} className="flex items-start gap-2 text-sm">
          <span className="shrink-0 text-[var(--color-muted)]">{i + 1}</span>
          <span className={l.lessonTitle ? "text-[var(--color-dark)]" : "italic text-gray-400"}>
            {l.lessonTitle || "수업 제목 미입력"}
          </span>
        </li>
      ))}
    </ol>
  </div>
</div>
```

---

## 5. 다음 버튼 조건 수정

```tsx
// 기존 disabled 조건에 Step 4 추가
disabled={
  (currentStep === 2 && !allAgreed) ||
  (currentStep === 4 && !isCourseInfoValid)
}

// onClick에 step 4 핸들러 추가
onClick={() => {
  if (currentStep === 4) {
    handleStep4Next();
    return;
  }
  if (currentStep < TOTAL_STEPS) setCurrentStep((s) => s + 1);
}}
```

---

## 6. import 추가 목록

```typescript
import { Sparkles, Eye, Camera } from "lucide-react";
// 기존 import에 추가
```

---

## 7. 구현 순서

1. `useState` 신규 상태 추가 (courseTitle, courseDescription, lessons, inputMode, aiStatus, isPreviewOpen, courseTitleAi, courseDescAi)
2. `useEffect` — Step 4 진입 시 lessons 초기화
3. `runAiGeneration` Mock 함수 작성
4. `handleSwitchToAi` / `handleStep4Next` 함수 작성
5. `lessonInputRefs`, `courseTitleRef` ref 추가
6. `currentStep >= 3` → `currentStep === 3` 수정
7. Step 4 JSX 블록 작성 (세그먼트 탭 → AI 배너/로딩 → 폼 → 커리큘럼)
8. FAB + 백드롭 + 슬라이드 패널 JSX 추가
9. 다음 버튼 `disabled` 조건 및 `onClick` 수정
10. import 추가 (Sparkles, Eye, Camera)
