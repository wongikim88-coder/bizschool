# PDCA Report: Course Player Q&A Panel

## Feature Summary
- **Feature**: course-player-qna-panel
- **Phase**: Completed
- **Date**: 2026-03-22

## Plan
강의 플레이어(`/course/[id]`) 사이드바 Q&A 탭에 기능적인 Q&A 패널 구현:
- 질문 목록 보기 (검색 포함)
- 질문 상세 보기 (Q/A 블록)
- 질문 작성 (미저장 경고 모달 포함)

## Implementation Summary

### Files Created
| File | Description |
|------|-------------|
| `src/components/course/CourseQnaPanel.tsx` | Q&A 패널 메인 컴포넌트 (목록/상세/작성 3-view) |

### Files Modified
| File | Changes |
|------|---------|
| `src/data/course-detail.ts` | `courseQnas` mock 데이터 + `getCourseQnas()` 헬퍼 추가 |
| `src/components/course/CoursePlayerLayout.tsx` | Q&A placeholder 제거, CourseQnaPanel 적용, 레이아웃 구조 변경 |
| `src/components/course/CourseCurriculum.tsx` | 체크 아이콘 색상 brand blue 변경 |
| `src/app/course/[id]/page.tsx` | `getCourseQnas` import, qnas prop 전달 |

### Key Features Implemented
1. **Q&A 목록 뷰**: 제목+본문 통합 검색, 검색어 하이라이팅, 발췌 스니펫, 답변상태 배지
2. **Q&A 상세 뷰**: Q(검정)/A(brand blue) 블록, 답변대기 placeholder, "<- Q&A 목록" 버튼
3. **질문 작성 뷰**: 제목/내용 입력, 미저장 경고 모달, 취소/확인 버튼
4. **본문 검색**: 질문 content + 답변 content 검색, 매칭 소스(질문/답변) 라벨 표시

### UI/UX Refinements (Session)
| Change | Detail |
|--------|--------|
| 패널 너비 확대 | `w-[380px]` → `w-[460px]` |
| 하단 버튼 제거 | "이전/다음/봤어요" 삭제, 비디오 영역 확장 |
| 패널 높이 확장 | 사이드바가 헤더 포함 전체 화면 높이 사용 |
| 헤더 색상 | `bg-white` → `bg-[var(--color-light-bg)]` (회색) |
| 세로 구분선 제거 | 사이드바 `border-l` 제거 |
| 사이드바 헤더 테두리 제거 | `border-b` 제거 |
| 탭 순서 변경 | 커리큘럼 → 강의자료 → Q&A |
| Q&A 아이콘 | `MessageCircleQuestion` → `MessagesSquare` |
| 진도율 색상 | `--color-primary` → `--color-muted` (수강기한과 동일) |
| 진도율 점 삭제 | 초록 점 표시 제거 |
| Progress bar | 색상 brand blue, 두께 1.5배 (`h-1.5` → `h-2.5`) |
| 체크 아이콘 | `text-green-500` → `text-[var(--color-primary)]` |
| 강의자료/Q&A 탭 | 강의제목, 수강기한, 진도율, progress bar 숨김 |
| 배지 색상 | 답변완료: brand blue, 답변대기: 회색 |
| Q/A 블록 | Q: 검정, A: brand blue, A영역 배경 brand blue light |
| Q/A 본문 색상 | `--color-body` → `--color-dark` (검정) |
| 질문하기 버튼 | 초록 → brand blue, 전체 너비 채움 |
| 네비게이션 텍스트 | "질문 상세"/"질문 작성" → "Q&A 목록" (버튼화) |
| 강의 영상 라벨 | 하단 오버레이 삭제 |

## Quality
- Build: Pass (Next.js build 성공)
- TypeScript: No errors
- Desktop/Mobile: 양쪽 레이아웃 지원
