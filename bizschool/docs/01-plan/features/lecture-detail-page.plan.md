# Plan: 강의 상세페이지 (lecture-detail-page)

## 1. 개요

### 목적
전문가가 `/expert/upload`에서 입력한 강의 정보를 기반으로 수강생이 볼 수 있는 강의 상세페이지(랜딩 페이지)를 구현한다.
인프런 스타일의 강의 소개 페이지를 참고하여, 수강 전 사용자에게 강의 정보를 제공하고 수강신청으로 유도하는 페이지이다.

### 기존 시스템과의 관계
- **upload 페이지** (`/expert/upload`): 전문가가 입력하는 데이터 소스
- **course player** (`/course/[id]`): 수강 중인 사용자의 학습 플레이어 (별도)
- **이 페이지**: 수강 전 사용자에게 보여주는 강의 소개/상세 페이지

## 2. 핵심 데이터 (upload 페이지에서 수집되는 정보)

| 필드 | 타입 | 설명 |
|------|------|------|
| courseTitle | string | 강의 제목 (필수) |
| courseDescription | string | 강의 소개 (500자) |
| selectedCategories | {main, sub}[] | 카테고리 (최대 3개, 필수) |
| tags | string[] | 태그 |
| learningPoints | string[] | 강의를 들음으로써 얻게 되는 것들 |
| targetAudience | string[] | 강의를 추천할 대상 |
| courseDetail | string | 강의 상세정보 (2000자) |
| lessons | {lessonTitle, fileName}[] | 커리큘럼 (수업별 제목) |
| instructor | string | 강사명 (session에서 획득) |

## 3. 페이지 구조 (인프런 스타일 참고)

### 3.1 상단 히어로 영역 (Dark Background)
```
┌─────────────────────────────────────────────────────────┐
│  [카테고리 breadcrumb: 세무 > 법인세]                       │
│                                                          │
│  강의 제목 (h1, 큰 텍스트, 흰색)                            │
│  강의 소개 (1~2줄 요약, 회색)                               │
│                                                          │
│  ★ 4.8 (234) · 수강생 1,200명 · 강사: 김세무               │
│  #세금신고  #연말정산  #법인세                               │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Sticky 탭 네비게이션
```
[강의소개] [커리큘럼] [리뷰] [수강전 FAQ]
```

### 3.3 본문 영역 (2-column: 콘텐츠 + 사이드바)

#### 좌측: 메인 콘텐츠
- **강의를 들음으로써 얻게 되는 것들** (체크 아이콘 리스트)
- **이런 분들께 추천해요** (화살표/사람 아이콘 리스트)
- **강의 상세정보** (본문 텍스트)
- **커리큘럼** (아코디언 형태, 수업 목록)
- **리뷰** (별점 요약 + 리뷰 목록)
- **수강전 FAQ** (아코디언)

#### 우측: Sticky 사이드바 (데스크톱)
```
┌─────────────────────┐
│  썸네일/미리보기       │
│                      │
│  ₩55,000             │
│  [수강신청하기] 버튼    │
│                      │
│  · 총 24개 수업        │
│  · 수강 기한: 무제한    │
│  · 수료증 발급         │
│  · 평생 소장           │
│                      │
│  [찜하기] [공유하기]    │
└─────────────────────┘
```

### 3.4 모바일: 하단 Sticky Bar
```
[가격 표시] [수강신청하기]
```

## 4. 라우트 및 파일 구조

- **라우트**: `/lectures/[id]`
  - `/course/[id]`는 이미 수강 플레이어로 사용 중
  - lectures가 수강 전 상세페이지로 적합

### 생성할 파일
```
src/app/lectures/[id]/page.tsx          # 서버 컴포넌트 (메타데이터)
src/components/lectures/LectureDetailContent.tsx  # 클라이언트 컴포넌트 (탭, 인터랙션)
src/data/lectures.ts                    # Mock 데이터 (upload 데이터 기반)
src/types/index.ts                      # LectureDetail 타입 추가
```

## 5. Mock 데이터 구조

```typescript
interface LectureDetail {
  id: string;
  title: string;                  // courseTitle
  description: string;            // courseDescription
  categories: { main: string; sub: string }[];
  tags: string[];
  learningPoints: string[];
  targetAudience: string[];
  detail: string;                 // courseDetail
  curriculum: {
    title: string;                // lessonTitle
    duration: string;             // mock duration
  }[];
  instructor: {
    name: string;
    bio: string;
    profileImage?: string;
  };
  price: number;
  originalPrice?: number;
  discountRate?: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
  totalDuration: string;          // 총 수업 시간
  lessonCount: number;            // 총 수업 수
  level: "입문" | "초급" | "중급" | "고급";
  updatedAt: string;
  reviews: {
    reviewer: string;
    rating: number;
    date: string;
    content: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}
```

## 6. UI/UX 세부 사항

### 6.1 히어로 영역
- 배경: `var(--color-dark-navy)` (#101828) 또는 그래디언트
- 텍스트: 흰색 계열
- 카테고리를 breadcrumb 형태로 표시
- 기본 통계 (평점, 수강생 수) 표시

### 6.2 탭 네비게이션
- sticky top (스크롤 시 상단 고정)
- 클릭 시 해당 섹션으로 smooth scroll
- IntersectionObserver로 활성 탭 자동 전환

### 6.3 사이드바
- 데스크톱에서만 표시, `position: sticky`
- 가격, 수강신청 버튼, 강의 요약 정보
- 찜하기, 공유하기 버튼

### 6.4 모바일 대응
- 사이드바 숨김 → 하단 Sticky Bar
- 탭 네비게이션 스크롤 가능
- 히어로 영역 축소

### 6.5 색상/스타일
- 기존 프로젝트 CSS 변수 활용 (globals.css)
- Tailwind CSS 클래스 사용 (프로젝트 패턴 준수)
- lucide-react 아이콘 사용

## 7. 구현 범위

### In-Scope (이번 구현)
- [x] 강의 상세페이지 라우트 및 레이아웃
- [x] 히어로 영역 (강의 제목, 카테고리, 메타 정보)
- [x] 탭 네비게이션 (강의소개, 커리큘럼, 리뷰, FAQ)
- [x] 강의소개 탭 내용 (learningPoints, targetAudience, detail)
- [x] 커리큘럼 섹션 (수업 목록)
- [x] 리뷰 섹션 (별점 요약 + 목록)
- [x] 수강전 FAQ 섹션
- [x] 우측 사이드바 (가격, 수강신청, 요약 정보)
- [x] 모바일 반응형 (하단 Sticky Bar)
- [x] Mock 데이터 (upload 페이지 필드 기반 2~3개 강의)

### Out-of-Scope (향후)
- 실제 API 연동 (upload → DB → 상세페이지)
- 수강신청/결제 기능
- 찜하기/공유하기 기능 (UI만 구현)
- 강사 프로필 페이지 연동
- 검색/필터에서의 강의 목록 연결

## 8. 구현 순서

1. `src/types/index.ts`에 `LectureDetail` 타입 추가
2. `src/data/lectures.ts`에 Mock 데이터 생성 (upload 필드 기반)
3. `src/app/lectures/[id]/page.tsx` 서버 컴포넌트 생성
4. `src/components/lectures/LectureDetailContent.tsx` 클라이언트 컴포넌트 구현
   - 히어로 영역
   - 탭 네비게이션 + IntersectionObserver
   - 강의소개 섹션
   - 커리큘럼 섹션
   - 리뷰 섹션
   - FAQ 섹션
   - 사이드바
   - 모바일 Sticky Bar

## 9. 참고

- **인프런 강의 상세페이지**: 전체적인 레이아웃, 탭 구조, 사이드바 패턴 참고
- **기존 books/[id] 상세페이지**: 프로젝트 내 상세페이지 구현 패턴 참고
- **기존 CourseCard 컴포넌트**: 강의 카드 디자인 요소 활용
