# Design: 전문가상담 AI 자동 답변

> **Feature**: expert-consultation-ai-response
> **Plan 참조**: `docs/01-plan/features/expert-consultation-ai-response.plan.md`
> **Version**: v1.0

---

## 1. 아키텍처 개요

```
┌─────────────────────────────────────────────────────────┐
│  Client (Browser)                                       │
│                                                         │
│  ExpertWriteForm                                        │
│    └─ handleSubmit()                                    │
│         ├─ 1. newConsultation 생성 (status: "pending")  │
│         ├─ 2. fetch("/api/expert-consultation/ai-answer")│
│         ├─ 3. 성공 → aiAnswer 추가, status: "ai-answered"│
│         └─ 4. 실패 → status: "pending" 유지             │
│                                                         │
│  ExpertDetail                                           │
│    ├─ [Q] 질문 카드                                     │
│    ├─ [AI] AI 답변 카드 (aiAnswer 존재 시)              │
│    └─ [A] 전문가 답변 카드 (answer 존재 시)             │
└──────────────┬──────────────────────────────────────────┘
               │ POST /api/expert-consultation/ai-answer
               ▼
┌─────────────────────────────────────────────────────────┐
│  Server (Next.js Route Handler)                         │
│                                                         │
│  api/expert-consultation/ai-answer/route.ts             │
│    ├─ 요청 검증 (category, title, content)              │
│    ├─ 카테고리별 시스템 프롬프트 매핑                    │
│    ├─ OpenAI API 호출 (gpt-4o-mini)                     │
│    └─ JSON 응답 반환                                    │
└──────────────┬──────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────┐
│  OpenAI API (외부)                                      │
│  POST https://api.openai.com/v1/chat/completions        │
│  Model: gpt-4o-mini                                     │
└─────────────────────────────────────────────────────────┘
```

## 2. 타입 설계

### 2-1. AiAnswer 인터페이스 (신규)

**파일**: `src/types/index.ts`

```typescript
export interface AiAnswer {
  content: string;
  answeredAt: string;
  model: string;       // "gpt-4o-mini"
}
```

### 2-2. ExpertConsultation 수정

```typescript
export interface ExpertConsultation {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  category: ExpertConsultationCategory;
  createdAt: string;
  viewCount: number;
  status: "pending" | "ai-answered" | "answered";  // ← "ai-answered" 추가
  answer?: ExpertAnswer;
  aiAnswer?: AiAnswer;  // ← 신규 필드
}
```

### 2-3. 상태 전이

```
pending ──(AI 답변 성공)──→ ai-answered ──(전문가 답변)──→ answered
pending ──(AI 답변 실패)──→ pending ──(전문가 답변)──→ answered
```

## 3. API Route 설계

### 3-1. 엔드포인트

**파일**: `src/app/api/expert-consultation/ai-answer/route.ts`

| 항목 | 값 |
|------|-----|
| Method | POST |
| Path | `/api/expert-consultation/ai-answer` |
| Content-Type | application/json |

### 3-2. Request Body

```typescript
interface AiAnswerRequest {
  category: ExpertConsultationCategory;  // "회계" | "세무" | "4대보험" | "인사·총무"
  title: string;
  content: string;
}
```

### 3-3. Response

**성공 (200)**:
```json
{
  "answer": "AI가 생성한 답변 내용...",
  "model": "gpt-4o-mini"
}
```

**실패 (500)**:
```json
{
  "error": "AI 답변 생성에 실패했습니다."
}
```

### 3-4. 시스템 프롬프트 매핑

```typescript
const SYSTEM_PROMPTS: Record<ExpertConsultationCategory, string> = {
  "회계": "당신은 비즈스쿨의 회계 분야 AI 상담 어시스턴트입니다. 공인회계사 수준의 전문적인 답변을 제공하세요.",
  "세무": "당신은 비즈스쿨의 세무 분야 AI 상담 어시스턴트입니다. 세무사 수준의 전문적인 답변을 제공하세요.",
  "4대보험": "당신은 비즈스쿨의 4대보험 분야 AI 상담 어시스턴트입니다. 공인노무사 수준의 전문적인 답변을 제공하세요.",
  "인사·총무": "당신은 비즈스쿨의 인사·총무 분야 AI 상담 어시스턴트입니다. 인사노무사 수준의 전문적인 답변을 제공하세요.",
};
```

**공통 시스템 프롬프트 (모든 카테고리에 추가)**:
```
답변 시 다음 규칙을 따르세요:
1. 핵심 내용을 먼저 간결하게 답변하세요.
2. 필요한 경우 관련 법령이나 규정을 언급하세요.
3. 실무에서 주의할 점을 안내하세요.
4. 답변 마지막에 "본 답변은 AI가 생성한 참고용 답변입니다. 보다 정확한 답변은 담당 전문가가 곧 제공해드리겠습니다."를 반드시 포함하세요.
5. 한국어로 답변하세요.
```

### 3-5. OpenAI API 호출 구현

```typescript
// openai npm 패키지 없이 fetch로 직접 호출 (의존성 최소화)
const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  },
  body: JSON.stringify({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `[${category}] ${title}\n\n${content}` },
    ],
    max_tokens: 1024,
    temperature: 0.7,
  }),
});
```

**설계 결정**: `openai` npm 패키지 대신 `fetch` 직접 호출
- 이유: 추가 의존성 없이 단일 API 호출만 필요
- Next.js 서버 환경에서 fetch 기본 지원

## 4. 컴포넌트 설계

### 4-1. ExpertWriteForm 수정

**파일**: `src/components/mypage/expert-consultation/ExpertWriteForm.tsx`

**변경 사항**:

```
기존 handleSubmit:
  1. newConsultation 생성 (status: "pending")
  2. onSubmit(newConsultation) 호출

변경 후 handleSubmit:
  1. isSubmitting = true (로딩 상태)
  2. newConsultation 생성 (status: "pending")
  3. fetch("/api/expert-consultation/ai-answer") 호출
  4-a. 성공: aiAnswer 추가 + status: "ai-answered"
  4-b. 실패: status: "pending" 유지
  5. onSubmit(newConsultation) 호출
  6. isSubmitting = false
```

**로딩 UI 스펙**:
- 전체 화면 오버레이 (반투명 배경)
- 중앙 카드: 스피너 아이콘 + "AI가 답변을 준비하고 있습니다..."
- 등록 버튼 disabled 처리

```
┌──────────────────────────────┐
│   ┌────────────────────┐     │
│   │    ⟳ (스피너)      │     │
│   │                    │     │
│   │  AI가 답변을       │     │
│   │  준비하고 있습니다...│     │
│   └────────────────────┘     │
└──────────────────────────────┘
```

### 4-2. ExpertDetail 수정

**파일**: `src/components/mypage/expert-consultation/ExpertDetail.tsx`

**레이아웃**:
```
┌─────────────────────────────────────────┐
│ [상태 뱃지: AI 답변 | 답변완료 | 대기중] │
│ 카테고리 / 제목 / 작성일                 │
├─────────────────────────────────────────┤
│ Q  고객 질문 내용                        │  ← 기존 (변경 없음)
│    (흰색 카드, border)                   │
├─────────────────────────────────────────┤
│ AI  AI 답변 내용                         │  ← 신규
│    (보라색 그라데이션 배경)               │
│    "AI 어시스턴트 · gpt-4o-mini"         │
│    면책 고지 텍스트                       │
├─────────────────────────────────────────┤
│ A  전문가 답변 내용                      │  ← 기존 (변경 없음)
│    (primary 컬러 배경)                   │
│    "박세무 세무사 | 2026.03.23"          │
├─────────────────────────────────────────┤
│          [← 상담 목록]                   │
└─────────────────────────────────────────┘
```

**AI 답변 카드 스타일**:
```css
/* AI 답변 카드 */
background: linear-gradient(135deg, rgba(139,92,246,0.05), rgba(99,102,241,0.05));
border: 1px solid rgba(139,92,246,0.2);
border-radius: 1rem;

/* AI 뱃지 */
color: #7c3aed;  /* violet-600 */

/* 면책 고지 */
color: var(--color-muted);
font-size: 12px;
margin-top: 12px;
border-top: 1px solid rgba(139,92,246,0.1);
padding-top: 12px;
```

### 4-3. ExpertCard 수정 (상태 뱃지)

**파일**: `src/components/mypage/expert-consultation/ExpertCard.tsx`

`StatusBadge` 컴포넌트에 "ai-answered" 상태 추가:

```typescript
function StatusBadge({ status }: { status: "pending" | "ai-answered" | "answered" }) {
  if (status === "pending") {
    // 기존: 회색 뱃지 "대기중"
  }
  if (status === "ai-answered") {
    // 신규: 보라색 뱃지 "AI 답변"
    // bg-violet-50, text-violet-600, Bot 아이콘
  }
  // "answered": 기존 primary 뱃지 "답변완료"
}
```

### 4-4. ExpertFilterBar 수정

**파일**: `src/components/mypage/expert-consultation/ExpertFilterBar.tsx`

**변경 사항**:
- `ExpertStatusFilter` 타입에 `"ai-answered"` 추가
- 필터 버튼: `전체 | 대기중 | AI 답변 | 답변완료`
- props에 `aiAnsweredCount` 추가

```typescript
export type ExpertStatusFilter = "all" | "pending" | "ai-answered" | "answered";

const statusFilters = [
  { key: "all", label: "전체" },
  { key: "pending", label: "대기중" },
  { key: "ai-answered", label: "AI 답변" },
  { key: "answered", label: "답변완료" },
];
```

### 4-5. ExpertConsultationSection 수정

**파일**: `src/components/mypage/ExpertConsultationSection.tsx`

**변경 사항**:
- `aiAnsweredCount` 계산 추가
- `ExpertFilterBar`에 `aiAnsweredCount` prop 전달
- 필터 로직에 `"ai-answered"` 케이스 추가

## 5. 환경 변수

**파일**: `.env.local` (프로젝트 루트)

```
OPENAI_API_KEY=sk-...
```

**참조**: `src/app/api/expert-consultation/ai-answer/route.ts`에서 `process.env.OPENAI_API_KEY`로 접근

## 6. 에러 처리 설계

| 시나리오 | 처리 방식 |
|----------|-----------|
| OPENAI_API_KEY 미설정 | 500 에러 반환, 콘솔 경고 |
| OpenAI API 네트워크 에러 | 500 에러, 상담은 pending으로 등록 |
| OpenAI API 타임아웃 (>15초) | AbortController로 취소, pending 등록 |
| 빈 응답 | 500 에러, pending 등록 |
| 클라이언트 fetch 실패 | console.error, pending으로 onSubmit |

**타임아웃 설정**: 15초 (AbortController 사용)

## 7. 목 데이터 업데이트

**파일**: `src/data/expert-consultation.ts`

기존 25건 중 일부에 `aiAnswer` 필드 추가하여 UI 테스트 지원:

```typescript
{
  id: "ec-1",
  // ...기존 필드
  status: "answered",  // 전문가 답변도 있는 경우
  aiAnswer: {
    content: "부가세 예정신고를 누락한 경우...(AI 답변 내용)",
    answeredAt: "2026.03.23",
    model: "gpt-4o-mini",
  },
  answer: { /* 기존 전문가 답변 */ },
}
```

## 8. 구현 순서 (상세)

| 순서 | 작업 | 파일 | 난이도 |
|------|------|------|--------|
| 1 | `AiAnswer` 타입 추가, `ExpertConsultation` status/aiAnswer 확장 | `src/types/index.ts` | 낮음 |
| 2 | `.env.local`에 `OPENAI_API_KEY` 추가 | `.env.local` | 낮음 |
| 3 | AI 답변 API Route 생성 (fetch + OpenAI) | `src/app/api/expert-consultation/ai-answer/route.ts` | 중간 |
| 4 | `ExpertWriteForm` 수정: API 호출 + 로딩 오버레이 | `src/components/mypage/expert-consultation/ExpertWriteForm.tsx` | 중간 |
| 5 | `ExpertDetail` 수정: AI 답변 카드 섹션 추가 | `src/components/mypage/expert-consultation/ExpertDetail.tsx` | 중간 |
| 6 | `ExpertCard` StatusBadge에 "ai-answered" 추가 | `src/components/mypage/expert-consultation/ExpertCard.tsx` | 낮음 |
| 7 | `ExpertFilterBar` 필터에 "AI 답변" 추가 | `src/components/mypage/expert-consultation/ExpertFilterBar.tsx` | 낮음 |
| 8 | `ExpertConsultationSection` 필터/카운트 로직 확장 | `src/components/mypage/ExpertConsultationSection.tsx` | 낮음 |
| 9 | 목 데이터에 `aiAnswer` 샘플 추가 | `src/data/expert-consultation.ts` | 낮음 |

## 9. 검증 기준

| 항목 | 기준 |
|------|------|
| AI 답변 생성 | 상담 등록 시 ChatGPT API 호출되어 답변 생성됨 |
| 로딩 UI | API 호출 중 스피너 + 안내 메시지 표시 |
| 에러 처리 | API 실패 시 상담은 "pending"으로 정상 등록 |
| AI 답변 표시 | ExpertDetail에서 보라색 AI 답변 카드 표시 |
| 면책 고지 | AI 답변 하단에 참고용 안내 문구 표시 |
| 상태 뱃지 | "대기중" / "AI 답변" / "답변완료" 3종 정상 표시 |
| 필터 | "AI 답변" 필터 선택 시 해당 건만 노출 |
| 보안 | API 키가 클라이언트에 노출되지 않음 |
