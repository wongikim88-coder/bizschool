# Plan: 전문가상담 (Expert Consultation) 이관

> **Feature**: expert-consultation
> **Created**: 2026-03-23
> **Status**: Draft
> **Source**: https://www.klkorea.net/sa_sub/sub_page.php?menu=c100000

---

## 1. 배경 및 목적

### 1.1 현황 분석

**원본 사이트 (klkorea.net)**
- PHP 기반 전문가상담 Q&A 게시판
- 상담 카테고리: 전체, 회계, 세무, 노무, 인사
- 기능: 질문 등록, 전문가 답변, 검색, 정렬(최신순/조회순), 페이지네이션
- 데이터 규모: 약 65,000+ 상담 (4,385페이지 × 15건)
- 사용자 기능: 새 상담 등록, MY상담목록, 질문+답변보기 필터

**현재 프로젝트 (BIZSCHOOL)**
- 커뮤니티 페이지(`/community`)에 "상담사례" 탭이 존재
- 현재 상담사례는 AI답변 + 전문가검증 형태의 **읽기 전용** 콘텐츠
- 사용자가 직접 질문을 등록하는 기능 없음
- 전문가가 직접 답변하는 구조 없음

### 1.2 이관 목적

- 사용자가 직접 전문가에게 상담 질문을 등록할 수 있는 기능 구현
- 전문가 답변 열람 및 상담 이력 관리 기능 제공
- BIZSCHOOL의 기존 커뮤니티 구조와 디자인 시스템에 맞게 통합

---

## 2. 범위 정의

### 2.1 이관 범위 (In Scope)

| # | 기능 | 설명 | 우선순위 |
|---|------|------|----------|
| F1 | 전문가상담 탭 추가 | 커뮤니티에 "전문가상담" 탭 신규 추가 | P0 |
| F2 | 상담 목록 페이지 | 카테고리 필터, 검색, 정렬, 페이지네이션 | P0 |
| F3 | 상담 상세 페이지 | 질문 내용 + 전문가 답변 표시 | P0 |
| F4 | 상담 등록 폼 | 카테고리 선택, 제목, 본문 입력 | P0 |
| F5 | 답변 상태 표시 | 답변완료/대기중 상태 뱃지 | P0 |
| F6 | MY상담 필터 | 내가 작성한 상담만 보기 | P1 |
| F7 | 카테고리별 필터링 | 회계/세무/노무/인사 카테고리 필터 | P0 |
| F8 | 검색 기능 | 제목+본문 키워드 검색 | P1 |
| F9 | 정렬 기능 | 최신순/조회순 토글 | P1 |

### 2.2 제외 범위 (Out of Scope)

- 실제 백엔드 API 연동 (Mock 데이터 기반)
- 로그인/인증 시스템 연동
- 전문가 관리자 답변 작성 기능
- 기존 klkorea.net 데이터 마이그레이션
- 추천하기/MY관심글 기능

---

## 3. 기술 전략

### 3.1 기존 구조 활용 방안

현재 커뮤니티 구조를 최대한 활용하되, 전문가상담만의 차별화 요소를 반영합니다.

```
현재 커뮤니티 탭 구조:
홈 | 강의질문 | 상담사례 | 소통공간

변경 후:
홈 | 강의질문 | 전문가상담 | 상담사례 | 소통공간
```

### 3.2 데이터 모델 (신규)

```typescript
// 전문가상담 게시글
interface ExpertConsultation {
  id: string;
  title: string;
  content: string;
  author: string;
  category: ExpertConsultationCategory;
  createdAt: string;
  viewCount: number;
  status: "pending" | "answered";
  answer?: ExpertAnswer;
}

// 전문가 답변
interface ExpertAnswer {
  id: string;
  expertName: string;
  expertTitle: string;     // 예: "세무사", "공인회계사"
  content: string;
  answeredAt: string;
}

// 상담 카테고리
type ExpertConsultationCategory = "회계" | "세무" | "노무" | "인사";
```

### 3.3 라우팅 전략

| 경로 | 설명 |
|------|------|
| `/community?tab=expert` | 전문가상담 목록 |
| `/community?tab=expert&category=세무` | 카테고리 필터 |
| `/community?tab=expert&search=부가세` | 검색 |
| `/community?tab=expert&sort=views` | 조회순 정렬 |
| `/community?tab=expert&page=2` | 페이지네이션 |
| `/community/expert/[id]` | 상담 상세 페이지 |
| `/community/expert/write` | 상담 등록 페이지 |

### 3.4 컴포넌트 구조

```
src/
├── app/community/
│   ├── page.tsx                    # 탭에 "expert" 추가
│   └── expert/
│       ├── [id]/page.tsx           # 상담 상세 페이지
│       └── write/page.tsx          # 상담 등록 페이지
├── components/community/
│   ├── ExpertTab.tsx               # 전문가상담 탭 컨텐츠
│   ├── ExpertPostCard.tsx          # 상담 카드 (목록용)
│   ├── ExpertDetailView.tsx        # 상담 상세 뷰
│   ├── ExpertWriteForm.tsx         # 상담 등록 폼
│   ├── ExpertCategoryFilter.tsx    # 카테고리 필터 바
│   └── ExpertSearchBar.tsx         # 검색 + 정렬 바
├── data/
│   └── expert-consultation.ts      # Mock 상담 데이터
└── types/
    └── index.ts                    # 타입 추가
```

---

## 4. 구현 계획

### Phase 1: 기반 구축 (타입 + 데이터 + 탭 연결)
1. `types/index.ts`에 ExpertConsultation 관련 타입 추가
2. `data/expert-consultation.ts` Mock 데이터 생성 (20~30건)
3. CommunityTab 타입에 `"expert"` 추가
4. `communityTabs` 배열에 "전문가상담" 탭 추가
5. `community/page.tsx`에 ExpertTab 렌더링 연결

### Phase 2: 목록 페이지 (ExpertTab)
1. `ExpertTab.tsx` - 메인 목록 컴포넌트
2. `ExpertCategoryFilter.tsx` - 카테고리 필터 버튼 바
3. `ExpertSearchBar.tsx` - 검색 입력 + 정렬 토글
4. `ExpertPostCard.tsx` - 상담 카드 컴포넌트
5. 기존 `CommunityPagination` 재사용

### Phase 3: 상세 페이지
1. `/community/expert/[id]/page.tsx` - 상세 라우트
2. `ExpertDetailView.tsx` - 질문 + 답변 뷰
3. 목록으로 돌아가기 네비게이션

### Phase 4: 등록 페이지
1. `/community/expert/write/page.tsx` - 등록 라우트
2. `ExpertWriteForm.tsx` - 카테고리 선택, 제목, 본문 입력 폼
3. 등록 후 목록으로 리다이렉트

---

## 5. UI 참고 사항

### 5.1 원본 사이트 UI 요소 → BIZSCHOOL 매핑

| 원본 (klkorea.net) | BIZSCHOOL 적용 |
|---------------------|----------------|
| 게시판 테이블 형태 (번호/제목/분야/작성자/날짜) | PostCard 스타일의 카드 목록 (기존 패턴 유지) |
| 텍스트 기반 카테고리 필터 | 버튼 그룹 필터 (전체/회계/세무/노무/인사) |
| jQuery 검색 함수 | Next.js searchParams 기반 검색 |
| PHP 페이지네이션 | 기존 CommunityPagination 컴포넌트 재사용 |
| 상태: 텍스트 표시 | 뱃지: 답변완료(emerald) / 대기중(amber) |

### 5.2 디자인 원칙
- BIZSCHOOL 기존 디자인 시스템(CSS variables, Tailwind) 준수
- 기존 PostCard 패턴 참고하되, 전문가상담 전용 카드 신규 개발
- 모바일 반응형 필수

---

## 6. 리스크 및 고려사항

| 리스크 | 영향 | 대응 |
|--------|------|------|
| 기존 CommunityTab 타입 변경 | 홈탭 피드 등 영향 | 홈탭 셔플 함수에 expert 타입 포함 여부 결정 필요 |
| 상세 페이지 별도 라우트 | 커뮤니티 탭 상태 유지 | 뒤로가기 시 탭 상태 복원 로직 |
| 5개 탭으로 증가 | 모바일에서 가로 스크롤 증가 | 기존 overflow-x-auto 스타일 유지 |

---

## 7. 성공 기준

- [ ] 커뮤니티 "전문가상담" 탭이 정상 표시되고 클릭 시 목록이 렌더링됨
- [ ] 카테고리 필터링(전체/회계/세무/노무/인사)이 동작함
- [ ] 검색 및 정렬(최신순/조회순)이 동작함
- [ ] 상담 상세 페이지에서 질문과 답변이 올바르게 표시됨
- [ ] 상담 등록 폼에서 입력 후 목록에 반영됨
- [ ] 페이지네이션이 정상 동작함
- [ ] 모바일/데스크톱 반응형 레이아웃 정상 동작
