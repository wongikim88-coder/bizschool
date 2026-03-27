# Plan: 전문가상담 AI 자동 답변

## 1. 개요

- **Feature**: expert-consultation-ai-response
- **목표**: 고객이 전문가상담을 등록하면 ChatGPT(OpenAI API)를 활용하여 즉시 AI 답변을 자동 생성
- **배경**: 현재 상담 등록 후 전문가 답변까지 대기 시간이 발생. AI 즉시 답변으로 고객 만족도 향상

## 2. 현재 상태 분석

### 현재 플로우
```
고객 상담 등록 → status: "pending" → 전문가 수동 답변 → status: "answered"
```

### 관련 파일
| 파일 | 역할 |
|------|------|
| `src/types/index.ts` | ExpertConsultation, ExpertAnswer 타입 정의 |
| `src/components/mypage/expert-consultation/ExpertWriteForm.tsx` | 상담 등록 폼 (onSubmit 콜백) |
| `src/components/mypage/ExpertConsultationSection.tsx` | 상담 목록/상세/작성 관리 컨테이너 |
| `src/components/mypage/expert-consultation/ExpertDetail.tsx` | Q&A 상세 뷰 (답변 표시) |
| `src/data/expert-consultation.ts` | 목 데이터 (25건) |

### 현재 타입 구조
```typescript
interface ExpertConsultation {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  category: ExpertConsultationCategory; // "회계" | "세무" | "4대보험" | "인사·총무"
  createdAt: string;
  viewCount: number;
  status: "pending" | "answered";
  answer?: ExpertAnswer;  // 단일 답변
}

interface ExpertAnswer {
  id: string;
  expertName: string;
  expertTitle: string;
  content: string;
  answeredAt: string;
}
```

## 3. 목표 플로우

```
고객 상담 등록
  → ChatGPT API 호출 (로딩 표시)
  → AI 답변 자동 생성 & 표시
  → status: "ai-answered"
  → (추후) 전문가 수동 답변 추가 시 status: "answered"
```

## 4. 구현 계획

### 4-1. 타입 확장

**파일**: `src/types/index.ts`

```typescript
// status에 "ai-answered" 추가
status: "pending" | "ai-answered" | "answered";

// AI 답변 필드 추가
aiAnswer?: AiAnswer;

interface AiAnswer {
  content: string;
  answeredAt: string;
  model: string; // "gpt-4o-mini" 등
}
```

**설계 의도**: 기존 `answer`(전문가 답변)와 `aiAnswer`(AI 답변)를 분리하여 둘 다 표시 가능

### 4-2. API Route 생성

**파일**: `src/app/api/expert-consultation/ai-answer/route.ts`

- **Method**: POST
- **Input**: `{ category, title, content }`
- **Output**: `{ aiAnswer: string }`
- **LLM**: OpenAI ChatGPT (`gpt-4o-mini` 권장 - 비용 효율적)
- **시스템 프롬프트**: 카테고리별 전문가 역할 부여 (회계사, 세무사, 노무사 등)

```
시스템 프롬프트 예시:
"당신은 비즈스쿨의 {category} 분야 AI 상담 어시스턴트입니다.
고객의 질문에 대해 전문적이고 정확한 초기 답변을 제공하세요.
단, AI의 한계를 명시하고, 전문가 상세 답변이 곧 추가될 예정임을 안내하세요."
```

### 4-3. 환경 변수

**파일**: `.env.local`

```
OPENAI_API_KEY=sk-...
```

### 4-4. ExpertWriteForm 수정

**파일**: `src/components/mypage/expert-consultation/ExpertWriteForm.tsx`

변경 사항:
- `handleSubmit`에서 AI 답변 API 호출 추가
- 로딩 상태 표시 (스피너 + "AI가 답변을 준비하고 있습니다...")
- API 응답 받으면 `aiAnswer` 포함하여 `onSubmit` 콜백 호출
- API 실패 시에도 상담은 정상 등록 (status: "pending")

### 4-5. ExpertDetail UI 수정

**파일**: `src/components/mypage/expert-consultation/ExpertDetail.tsx`

변경 사항:
- AI 답변 섹션 추가 (전문가 답변과 시각적으로 구분)
- AI 답변: 보라색/그라데이션 카드 + "AI 답변" 뱃지 + 면책 고지
- 전문가 답변: 기존 디자인 유지
- 상태 뱃지: "AI 답변" (ai-answered), "답변완료" (answered)

```
[Q] 고객 질문
[AI] AI 즉시 답변 (면책 고지 포함)
[A]  전문가 답변 (있을 경우)
```

### 4-6. 상태 뱃지 & 필터 업데이트

**관련 파일**:
- `ExpertFilterBar.tsx` - "AI 답변" 필터 옵션 추가
- `ExpertCard.tsx` - "AI 답변" 상태 뱃지 추가
- `ExpertConsultationSection.tsx` - ai-answered 카운트 추가

## 5. 구현 순서

| 순서 | 작업 | 파일 |
|------|------|------|
| 1 | 타입 확장 (AiAnswer, status) | `types/index.ts` |
| 2 | 환경 변수 설정 | `.env.local` |
| 3 | AI 답변 API Route 생성 | `api/expert-consultation/ai-answer/route.ts` |
| 4 | ExpertWriteForm 수정 (API 호출 + 로딩) | `ExpertWriteForm.tsx` |
| 5 | ExpertDetail UI 수정 (AI 답변 표시) | `ExpertDetail.tsx` |
| 6 | 상태 뱃지 & 필터 업데이트 | `ExpertFilterBar.tsx`, `ExpertCard.tsx`, `ExpertConsultationSection.tsx` |

## 6. 기술 선택

| 항목 | 선택 | 이유 |
|------|------|------|
| LLM | OpenAI ChatGPT | 사용자 요구사항 (API 키 보유) |
| 모델 | `gpt-4o-mini` | 비용 효율 + 충분한 품질 |
| API 클라이언트 | `openai` npm 패키지 | 공식 SDK, 타입 지원 |
| API Route | Next.js App Router Route Handler | 서버사이드에서 API 키 안전하게 사용 |

## 7. 리스크 & 대응

| 리스크 | 대응 |
|--------|------|
| API 호출 실패 | 상담은 정상 등록 (pending), 에러 토스트 표시 |
| 응답 지연 (>10초) | 타임아웃 설정, 로딩 UI로 사용자 안내 |
| 부정확한 AI 답변 | 면책 고지 필수 표시: "AI 답변은 참고용이며, 전문가 답변이 곧 추가됩니다" |
| API 키 노출 | 서버사이드 Route Handler에서만 호출, .env.local 사용 |

## 8. 비기능 요구사항

- **응답 시간**: 5초 이내 AI 답변 생성
- **보안**: API 키는 서버사이드에서만 사용
- **에러 처리**: API 실패 시 graceful degradation
- **UX**: 로딩 중 사용자가 페이지를 이탈하지 않도록 적절한 피드백
