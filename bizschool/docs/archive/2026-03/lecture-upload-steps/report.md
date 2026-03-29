# Lecture Upload Steps - 완료 보고서

## 개요

- **Feature**: lecture-upload-steps
- **작업일**: 2026-03-27
- **상태**: Completed (Do)

## 구현 내용

### Step 2 — 강의 업로드 사전 안내 동의 페이지

**파일**: `src/app/expert/upload/page.tsx`

- 전체 동의 + 4개 필수 항목 동의 UI
- 항목 항상 펼쳐진 상태 (아코디언 없음)
- 모든 항목 동의 시에만 "다음" 버튼 활성화
- 이전/다음 스텝 전환 (`useState`로 관리)
- 스텝 인디케이터 (5단계 중 2번째)

**동의 항목**:
1. 콘텐츠 저작권 및 독창성 (필수)
2. 콘텐츠 품질 기준 (필수)
3. 수익 정산 및 운영 정책 (필수)
4. 강의 운영 책임 (필수)

### Step 3 — 영상 일괄 업로드 페이지

**파일**: `src/app/expert/upload/page.tsx`

- 드래그&드롭 + 클릭으로 파일 선택
- 허용 형식: `.mp4`, `.mkv`, `.m4v`, `.mov` (최대 5GB)
- 실시간 업로드 진행률 표시 (XMLHttpRequest)
- 파일 목록 테이블 (4컬럼: 체크박스 | 파일명 | 업로드일시 | 액션)
- 개별/전체 선택 체크박스
- 업로드 중 취소 / 완료 후 삭제 확인 모달
- 일괄 삭제 기능 + 확인 모달
- 10개 초과 시 스크롤
- 다운로드 아이콘 / 삭제 아이콘

### API 라우트

- `src/app/api/expert/upload/route.ts` — POST(업로드), GET(목록), DELETE(삭제)
- `src/app/api/expert/upload/[id]/route.ts` — GET(다운로드)
- 파일 저장 경로: `uploads/videos/` (`.gitignore` 처리)

### 설정 변경

- `next.config.mjs`: `serverActions.bodySizeLimit: "5gb"` 추가
- `.gitignore`: `/uploads/` 추가

## UI 조정 이력

- 전체 화면 오버레이 제거 → 헤더 표시되는 일반 레이아웃
- 드롭존 박스 형태로 변경
- 파일 목록 3컬럼 → 4컬럼 구조 (업로드일시 / 액션 분리)
- "선택 삭제" 헤더 행 우측 배치 (w-24 고정폭)
- 업로드일시 헤더 text-right + pr-[90px] 정렬
- 다운로드·삭제 아이콘 간격 gap-4
