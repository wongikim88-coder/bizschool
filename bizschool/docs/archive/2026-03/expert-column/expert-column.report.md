# Expert Column (전문가 컬럼) - 완료 보고서

## 개요

커뮤니티 페이지에 "전문가 컬럼" 탭을 추가하여, 전문가들이 작성한 칼럼/인사이트 글을 보여주는 섹션 구현. 기존 탭(강의질문, 상담사례, 소통공간) 패턴을 그대로 따름.

## 수정 파일 목록

### 신규 파일
| 파일 | 설명 |
|------|------|
| `src/components/community/ColumnTab.tsx` | 전문가 컬럼 탭 컴포넌트 (QuestionsTab 패턴) |

### 수정 파일
| 파일 | 변경 내용 |
|------|-----------|
| `src/types/index.ts` | `ExpertColumn` 인터페이스 추가, `CommunityTab`에 `"column"` 추가 |
| `src/data/community.ts` | `communityTabs`에 전문가 컬럼 추가, `expertColumns` mock 데이터 12개, `getShuffledFeed()`에 포함 |
| `src/components/community/CommunityTabs.tsx` | `PenLine` 아이콘, orange 색상 추가 |
| `src/components/community/PostCard.tsx` | `ExpertColumn` union 추가, 태그/스타일/렌더링 추가 |
| `src/app/community/page.tsx` | `validTabs`에 `"column"` 추가, `ColumnTab` 렌더링 |

## 추가 개선 작업

### 1. 전문가 이름 색상 변경
- `text-orange-600` → `text-slate-700` (한국 문화에서 붉은색 이름 금기 반영)

### 2. 카드 높이 통일 (compact → feed 구조)
- compact 변형을 feed 변형과 동일한 레이아웃 구조로 변경
- 카테고리 태그와 제목을 별도 줄로 분리
- 본문 미리보기 `line-clamp-2` 추가
- 패딩 `px-5 py-5`, 간격 `mt-2`, `mt-1.5`, `mt-3` 통일
- 본문 영역 `min-h-[2.5rem]` 추가 (1줄 본문도 2줄 높이 확보)

### 3. mock 데이터 보강
- 각 타입별 1~2개 content를 2줄 초과하도록 수정 (line-clamp-2 테스트)

### 4. UI 정리
- 소통공간 "글쓰기" 버튼 삭제
- 각 탭별 "총 n개의..." 텍스트 삭제

### 5. 주간 활동 TOP 10 사이드바 고정
- `sticky top-20` + `items-start` flex 적용
- 스크롤 시 헤더 아래 고정, 시작 높이 유지

### 6. "전체" 탭 아이콘 색상 변경
- `amber` → `slate` (전문가 컬럼 orange와 중복 해소)

### 7. 탭 전환 애니메이션 제거
- `CommunityTabs`에서 `transition-all` 제거 (카드 들림 효과 제거)

## 검증 결과

- TypeScript 컴파일: 통과
- `/community?tab=all`: 전문가 컬럼 게시물 혼합 노출 확인
- `/community?tab=column`: 전문가 컬럼 탭 단독 표시 확인
- 탭 아이콘/색상/테두리 정상 렌더링 확인
- 사이드바 sticky 동작 확인 (Playwright 스크린샷 검증)

## 날짜
- 작업일: 2026-03-26
