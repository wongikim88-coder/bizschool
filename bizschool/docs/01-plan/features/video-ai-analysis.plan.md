# Plan: 영상 AI 분석 — 수업 정보 자동 생성

## 개요

- **Feature**: video-ai-analysis
- **Phase**: Plan
- **작성일**: 2026-03-28

## 배경 및 목적

현재 Step 4 (수업 정보 입력)의 "AI 자동 생성" 기능은 Mock 데이터를 반환한다.
이를 실제 AI 파이프라인으로 교체하여:
- 업로드된 영상의 음성을 텍스트로 변환 (Whisper API)
- 변환된 텍스트를 Claude가 분석하여 강의 제목 / 강의 설명 / 수업 제목 자동 생성

## 파이프라인 구조

```
[업로드된 영상 파일]
        ↓
1. 음성 추출 (ffmpeg — 서버사이드)
        ↓
2. 음성 → 텍스트 (OpenAI Whisper API)
        ↓
3. 전사본 → Claude API (분석 및 제목/설명 생성)
        ↓
4. 결과 반환 → Step 4 폼 자동 입력
```

## 핵심 기능

### F1. 음성 추출 API
- 영상 파일 경로를 받아 ffmpeg으로 `.mp3` 음성 파일 추출
- 저장 위치: `uploads/audio/{videoId}.mp3`
- 처리 방식: 서버사이드 (Next.js API Route)

### F2. Whisper 음성 전사
- OpenAI Whisper API (`whisper-1` 모델) 호출
- 한국어 힌트(`language: "ko"`) 전달
- 전사본 결과를 임시 저장 또는 메모리에서 바로 다음 단계로 전달

### F3. Claude 분석 및 콘텐츠 생성
- 전사본을 Claude API에 전달
- Prompt: 전사본을 분석하여 강의 제목(1개), 강의 소개(200자 내외), 수업 제목(1개) 생성
- 응답 형식: JSON (`{ courseTitle, courseDescription, lessonTitle }`)

### F4. 비동기 처리 구조
- 분석 소요 시간: 영상 1개당 약 1~2분
- 영상 여러 개는 **병렬 처리** (Promise.all)
- 클라이언트는 polling 방식으로 상태 확인:
  - `"pending"` → 분석 중 (스피너 표시)
  - `"done"` → 완료 (결과 자동 입력)
  - `"error"` → 실패 (수동 입력 안내)

### F5. 비용 및 제한
- Whisper: 영상 1분당 약 $0.006 (30분 영상 = $0.18)
- Claude Sonnet: 전사본 분석 1회당 약 $0.04
- 영상 1개당 총 약 $0.22 (₩300)
- 파일 크기 제한: ffmpeg 변환 후 25MB 이하 (Whisper API 제한) → 긴 영상은 분할 처리 필요

## 기술 스펙

### 신규 API 라우트
- `POST /api/expert/analyze` — 분석 작업 시작 (영상 ID 배열 수신)
- `GET /api/expert/analyze/[jobId]` — 분석 상태 polling

### 필요 패키지
```bash
npm install openai fluent-ffmpeg @ffmpeg-installer/ffmpeg
```

### 환경 변수 추가
```
OPENAI_API_KEY=sk-...
```

### 분석 작업 상태 관리
- 간단한 in-memory Map 또는 파일 기반 상태 저장 (`uploads/jobs/{jobId}.json`)
- Vercel 배포 시: Upstash Redis 또는 Vercel KV로 대체 필요

## UI 변경 (Step 4)

### 현재 (Mock)
```
[AI로 자동 생성] 클릭 → 1.5초 후 Mock 데이터 입력
```

### 변경 후
```
[AI로 자동 생성] 클릭
    → POST /api/expert/analyze (영상 ID 배열 전송)
    → jobId 수신
    → 2초 간격으로 GET /api/expert/analyze/{jobId} polling
    → status: "pending" → 스피너 유지
    → status: "done" → 결과 폼에 자동 입력
    → status: "error" → 에러 메시지 + 수동 입력 유도
```

### 진행 상태 표시 개선
```
┌──────────────────────────────────────────┐
│  AI가 영상을 분석하고 있습니다...          │
│                                          │
│  lecture_01.mp4  ✓ 완료                  │
│  lecture_02.mp4  ⟳ 전사 중... (45%)      │
│  lecture_03.mp4  ○ 대기 중               │
└──────────────────────────────────────────┘
```

## 검증 시나리오

1. 영상 1개 업로드 → AI 자동 생성 → 실제 강의 내용 기반 제목/설명 생성 확인
2. 영상 3개 업로드 → 병렬 처리 → 각 영상별 수업 제목 생성 확인
3. 긴 영상(30분 이상) → 25MB 분할 처리 동작 확인
4. 네트워크 오류 → "error" 상태 → 수동 입력 폴백 확인
5. 비용 로그 확인 (토큰 수, Whisper 처리 시간)

## 구현 우선순위

| 단계 | 내용 | 난이도 |
|------|------|--------|
| 1 | ffmpeg 음성 추출 API | 낮음 |
| 2 | Whisper API 연동 | 낮음 |
| 3 | Claude 분석 API | 낮음 |
| 4 | 비동기 Job 상태 관리 | 중간 |
| 5 | 클라이언트 polling UI | 낮음 |
| 6 | 25MB 초과 영상 분할 처리 | 높음 |

단계 1~5 완료 후 단계 6은 별도 Phase로 처리 가능.

## 제약사항 및 리스크

| 항목 | 내용 |
|------|------|
| Whisper 25MB 제한 | 긴 영상은 분할 필요 (1시간+ 강의 대상) |
| Vercel 서버리스 타임아웃 | 기본 10초 제한 → Vercel Pro 300초 or 별도 Worker 필요 |
| 한국어 전사 품질 | 전문 용어(세무, 회계) 오타 가능 → 사용자 검토 필수 |
| 비용 관리 | 분당 과금 → 무분별한 재분석 방지 UI 필요 |
