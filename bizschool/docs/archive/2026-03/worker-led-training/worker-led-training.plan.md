# Plan: 근로자 주도훈련 페이지 (worker-led-training)

## 1. 개요

**Feature**: 근로자 주도훈련 (90% 환급) 페이지 신규 생성
**Route**: `/training`
**참조**:
- https://www.dzbizschool.net/new/index.php?page=sub&menu=biz0701 (프로그램 안내)
- https://www.dzbizschool.net/new/index.php?page=sub&menu=biz0702 (과정소개 및 교육일정)

## 2. 요구사항

### 핵심 요구사항
- 위 2개 URL의 콘텐츠를 **하나의 페이지**에 통합
- 기존 BIZSCHOOL 디자인 시스템(Tailwind CSS v4, CSS variables) 준수
- 반응형 레이아웃 (모바일/데스크톱)

### 페이지 구성 (상→하 순서)

#### Section 1: Hero Banner
- 제목: "근로자 주도훈련"
- 부제: "90% 환급" 강조, 프로그램 요약 설명
- 기존 Hero 스타일 재사용 (파란 그라데이션)

#### Section 2: 프로그램 안내 (biz0701 콘텐츠)
- **프로그램 설명**: "근로자가 원하는 훈련과정에 참여할 수 있도록 기업이 훈련비를 지원하면, 사업주가 부담한 비용의 90%까지 지원" 안내
- **4단계 프로세스**: 시각적 스텝 카드
  1. 교육 준비 단계 (기업-공단): 고용24 기업규모 확인, 계좌 등록
  2. 교육 신청 (기업-더존비즈스쿨): 우선지원 대상기업, 수강신청 및 교육비 납부
  3. 교육참여 및 수료 (더존비즈스쿨-기업): 교육훈련 참여, 수료 시 서류 발송
  4. 지원금 신청 (기업-공단): 제출서류로 고용24 통해 신청
- **필수 제출서류**: 4가지 항목 리스트 + 2025.12.1부터 간소화 안내
- **인정되는 훈련비 납입 영수증**: 4가지 유형
- **비용 신청 및 지급 절차**: 경로 안내, 지급액(90%), 지급방식
- **교육신청 전 확인사항**: 3가지 체크리스트

#### Section 3: 과정소개 및 교육일정 (biz0702 콘텐츠)
- **과정소개**: 4개 교육과정 카드형 소개
  - 건설업 세무회계 (실무상 과세쟁점 및 사례중심)
  - 부가가치세 신고실무 (세무조사 대비 무결점)
  - 양도세 실무업무 (중소기업 근로자 대상)
  - 법인세 신고실무 (세무조사 대비 무결점)
- **교육일정 테이블**: 기존 `/education` 페이지의 MonthSelector + CourseTable 패턴 재사용
  - 연도 선택 드롭다운
  - 월 탭 바
  - 과정 테이블 (데스크톱: 테이블, 모바일: 카드)

## 3. 기술 설계

### 파일 구조
```
src/
├── app/training/
│   └── page.tsx                          # 메인 페이지 (Server Component)
├── components/training/
│   ├── ProgramGuide.tsx                  # Section 2: 프로그램 안내 (4단계 프로세스 등)
│   ├── CourseIntro.tsx                   # Section 3 상단: 과정소개 카드
│   └── TrainingSchedule.tsx              # Section 3 하단: 교육일정 (Client Component)
├── data/
│   └── training.ts                       # 근로자 주도훈련 교육과정 Mock 데이터 + 과정소개 데이터
└── types/
    └── index.ts                          # TrainingCourse 타입 추가 (또는 EducationCourse 재사용)
```

### 핵심 구현 사항

1. **데이터**: `src/data/training.ts`에 근로자 주도훈련 전용 Mock 데이터 생성
   - EducationCourse 타입 재사용 (동일 구조)
   - 과정소개 데이터 (4개 과정 정보)

2. **MonthSelector 재사용**: 기존 컴포넌트에 `basePath` prop 추가하여 `/training` 경로 지원
   - 또는 TrainingSchedule 내부에서 별도 구현 (더 간단)

3. **CourseTable 재사용**: 기존 컴포넌트 그대로 활용 가능

4. **Header 메뉴 업데이트**: `근로자 주도훈련` 메뉴 항목 추가

### 디자인 패턴
- Hero: 기존 공개교육/기관소개 페이지와 동일한 블루 그라데이션
- 프로세스 스텝: numbered step cards (1→2→3→4 연결선 포함)
- 과정소개: 카드 그리드 (2x2)
- 교육일정: 기존 MonthSelector + CourseTable 패턴

## 4. 구현 순서

1. `src/data/training.ts` - Mock 데이터 생성
2. `src/types/index.ts` - 필요시 타입 추가
3. `src/components/training/ProgramGuide.tsx` - 프로그램 안내 섹션
4. `src/components/training/CourseIntro.tsx` - 과정소개 카드
5. `src/components/training/TrainingSchedule.tsx` - 교육일정 (Client Component)
6. `src/app/training/page.tsx` - 메인 페이지 조립
7. `src/components/layout/Header.tsx` - 메뉴에 "근로자 주도훈련" 추가

## 5. 범위 외 (Out of Scope)

- 실제 수강신청 기능 (버튼 UI만 제공)
- 고용24 연동
- 관리자 기능 (데이터 관리)
- 결제 기능

## 6. 참고사항

- Tailwind CSS v4: CSS custom properties는 `var()` 래퍼 필수 (`bg-[var(--color-dark)]`)
- 기존 `MonthSelector`, `CourseTable` 컴포넌트의 재사용성 극대화
- 문의: 02-456-9156 (페이지 하단 또는 프로그램 안내 섹션에 포함)
