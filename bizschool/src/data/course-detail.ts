import type { CourseSection, CourseMaterial } from "@/types";

// ── 강의 커리큘럼 (섹션 + 차시) ──

export const courseSections: Record<string, CourseSection[]> = {
  "mc-001": [
    {
      id: "sec-001-1",
      title: "섹션 1. 세무회계 기초 이론",
      totalDuration: "1시간 20분",
      lessons: [
        { id: "les-001-01", title: "1. 세무회계란?", duration: "12:30", isCompleted: true },
        { id: "les-001-02", title: "2. 세금의 종류와 체계", duration: "15:42", isCompleted: true },
        { id: "les-001-03", title: "3. 부가가치세 기초", duration: "18:20", isCompleted: true },
        { id: "les-001-04", title: "4. 소득세 개요", duration: "14:05", isCompleted: true },
        { id: "les-001-05", title: "5. 법인세 개요", duration: "19:33", isCompleted: true },
      ],
    },
    {
      id: "sec-001-2",
      title: "섹션 2. 부가가치세 실무",
      totalDuration: "1시간 45분",
      lessons: [
        { id: "les-001-06", title: "6. 매출세액 계산", duration: "16:10", isCompleted: true },
        { id: "les-001-07", title: "7. 매입세액 공제", duration: "20:15", isCompleted: true },
        { id: "les-001-08", title: "8. 부가세 신고서 작성", duration: "22:30", isCompleted: true },
        { id: "les-001-09", title: "9. 전자세금계산서 실무", duration: "18:45", isCompleted: true },
        { id: "les-001-10", title: "10. 수정신고와 경정청구", duration: "15:20", isCompleted: true },
      ],
    },
    {
      id: "sec-001-3",
      title: "섹션 3. 원천징수 실무",
      totalDuration: "1시간 30분",
      lessons: [
        { id: "les-001-11", title: "11. 원천징수 개념", duration: "12:00", isCompleted: true },
        { id: "les-001-12", title: "12. 근로소득 원천징수", duration: "18:30", isCompleted: true },
        { id: "les-001-13", title: "13. 사업소득 원천징수", duration: "14:20", isCompleted: true },
        { id: "les-001-14", title: "14. 기타소득 원천징수", duration: "16:45", isCompleted: true },
        { id: "les-001-15", title: "15. 퇴직소득 원천징수", duration: "13:10", isCompleted: true },
        { id: "les-001-16", title: "16. 원천징수이행상황신고서", duration: "15:25", isCompleted: true },
      ],
    },
    {
      id: "sec-001-4",
      title: "섹션 4. 종합소득세 신고",
      totalDuration: "1시간 35분",
      lessons: [
        { id: "les-001-17", title: "17. 종합소득세 체계", duration: "14:50", isCompleted: true },
        { id: "les-001-18", title: "18. 소득금액 계산", duration: "18:20", isCompleted: true },
        { id: "les-001-19", title: "19. 세액공제와 감면", duration: "16:40", isCompleted: false },
        { id: "les-001-20", title: "20. 종합소득세 신고서 작성", duration: "22:15", isCompleted: false },
      ],
    },
    {
      id: "sec-001-5",
      title: "섹션 5. 법인세 실무 기초",
      totalDuration: "1시간 10분",
      lessons: [
        { id: "les-001-21", title: "21. 법인세 과세표준", duration: "15:30", isCompleted: false },
        { id: "les-001-22", title: "22. 세무조정 기초", duration: "18:40", isCompleted: false },
        { id: "les-001-23", title: "23. 감가상각비 조정", duration: "20:10", isCompleted: false },
        { id: "les-001-24", title: "24. 법인세 신고 절차", duration: "16:00", isCompleted: false },
      ],
    },
  ],
  "mc-002": [
    {
      id: "sec-002-1",
      title: "섹션 1. 전략적 사고의 기본",
      totalDuration: "50분",
      lessons: [
        { id: "les-002-01", title: "1. 경영전략이란 무엇인가?", duration: "14:20", isCompleted: true },
        { id: "les-002-02", title: "2. 전략적 사고 프레임워크", duration: "18:30", isCompleted: true },
        { id: "les-002-03", title: "3. SWOT 분석 실전", duration: "17:10", isCompleted: true },
      ],
    },
    {
      id: "sec-002-2",
      title: "섹션 2. 경쟁우위 전략",
      totalDuration: "55분",
      lessons: [
        { id: "les-002-04", title: "4. 포터의 5 Forces", duration: "16:45", isCompleted: true },
        { id: "les-002-05", title: "5. 원가우위 vs 차별화", duration: "19:20", isCompleted: false },
        { id: "les-002-06", title: "6. 블루오션 전략", duration: "18:55", isCompleted: false },
      ],
    },
    {
      id: "sec-002-3",
      title: "섹션 3. 성장 전략",
      totalDuration: "1시간 5분",
      lessons: [
        { id: "les-002-07", title: "7. 사업 포트폴리오 관리", duration: "15:30", isCompleted: false },
        { id: "les-002-08", title: "8. M&A와 전략적 제휴", duration: "20:10", isCompleted: false },
        { id: "les-002-09", title: "9. 글로벌 전략", duration: "16:40", isCompleted: false },
        { id: "les-002-10", title: "10. 디지털 전환 전략", duration: "14:50", isCompleted: false },
      ],
    },
    {
      id: "sec-002-4",
      title: "섹션 4. 실행과 평가",
      totalDuration: "1시간 15분",
      lessons: [
        { id: "les-002-11", title: "11. 전략 실행 로드맵", duration: "17:20", isCompleted: false },
        { id: "les-002-12", title: "12. BSC와 KPI 설정", duration: "19:45", isCompleted: false },
        { id: "les-002-13", title: "13. 전략 성과 측정", duration: "15:30", isCompleted: false },
        { id: "les-002-14", title: "14. 조직문화와 전략", duration: "12:40", isCompleted: false },
        { id: "les-002-15", title: "15. 전략 리더십", duration: "14:10", isCompleted: false },
        { id: "les-002-16", title: "16. 종합 케이스 스터디", duration: "18:55", isCompleted: false },
      ],
    },
  ],
  "mc-003": [
    {
      id: "sec-003-1",
      title: "섹션 1. 인사관리 기초",
      totalDuration: "1시간",
      lessons: [
        { id: "les-003-01", title: "1. 인사관리의 이해", duration: "13:20", isCompleted: false },
        { id: "les-003-02", title: "2. 채용과 선발", duration: "15:40", isCompleted: false },
        { id: "les-003-03", title: "3. 인사평가 체계", duration: "17:00", isCompleted: false },
        { id: "les-003-04", title: "4. 보상과 복리후생", duration: "14:00", isCompleted: false },
      ],
    },
    {
      id: "sec-003-2",
      title: "섹션 2. 노무관리 기초",
      totalDuration: "1시간 20분",
      lessons: [
        { id: "les-003-05", title: "5. 근로기준법 핵심", duration: "18:30", isCompleted: false },
        { id: "les-003-06", title: "6. 근로계약서 작성", duration: "14:20", isCompleted: false },
        { id: "les-003-07", title: "7. 임금과 근로시간", duration: "16:50", isCompleted: false },
        { id: "les-003-08", title: "8. 연차유급휴가", duration: "13:40", isCompleted: false },
        { id: "les-003-09", title: "9. 퇴직급여 제도", duration: "16:40", isCompleted: false },
      ],
    },
    {
      id: "sec-003-3",
      title: "섹션 3. 4대 사회보험",
      totalDuration: "1시간 30분",
      lessons: [
        { id: "les-003-10", title: "10. 국민연금 실무", duration: "15:10", isCompleted: false },
        { id: "les-003-11", title: "11. 건강보험 실무", duration: "14:30", isCompleted: false },
        { id: "les-003-12", title: "12. 고용보험 실무", duration: "16:20", isCompleted: false },
        { id: "les-003-13", title: "13. 산재보험 실무", duration: "13:50", isCompleted: false },
        { id: "les-003-14", title: "14. 사회보험 통합 신고", duration: "17:10", isCompleted: false },
      ],
    },
    {
      id: "sec-003-4",
      title: "섹션 4. 징계와 해고",
      totalDuration: "1시간 15분",
      lessons: [
        { id: "les-003-15", title: "15. 징계 절차와 유의사항", duration: "16:00", isCompleted: false },
        { id: "les-003-16", title: "16. 해고의 종류와 요건", duration: "18:20", isCompleted: false },
        { id: "les-003-17", title: "17. 부당해고 구제신청", duration: "14:30", isCompleted: false },
        { id: "les-003-18", title: "18. 노동분쟁 예방", duration: "12:40", isCompleted: false },
      ],
    },
    {
      id: "sec-003-5",
      title: "섹션 5. 실무 사례와 정리",
      totalDuration: "50분",
      lessons: [
        { id: "les-003-19", title: "19. 인사노무 실무 사례 분석", duration: "18:50", isCompleted: false },
        { id: "les-003-20", title: "20. 자주 묻는 질문 정리", duration: "14:20", isCompleted: false },
        { id: "les-003-21", title: "21. 종합 정리와 마무리", duration: "16:50", isCompleted: false },
      ],
    },
  ],
  "mc-006": [
    {
      id: "sec-006-1",
      title: "섹션 1. 재무제표 기본 구조",
      totalDuration: "1시간 30분",
      lessons: [
        { id: "les-006-01", title: "1. 재무제표의 종류", duration: "14:00", isCompleted: true },
        { id: "les-006-02", title: "2. 재무상태표 구조", duration: "18:20", isCompleted: true },
        { id: "les-006-03", title: "3. 손익계산서 구조", duration: "16:40", isCompleted: true },
        { id: "les-006-04", title: "4. 현금흐름표 구조", duration: "19:30", isCompleted: true },
        { id: "les-006-05", title: "5. 주석사항 분석", duration: "12:50", isCompleted: true },
      ],
    },
  ],
  "mc-007": [
    {
      id: "sec-007-1",
      title: "섹션 1. 근로기준법 총론",
      totalDuration: "1시간 10분",
      lessons: [
        { id: "les-007-01", title: "1. 근로기준법의 목적과 적용범위", duration: "16:20", isCompleted: true },
        { id: "les-007-02", title: "2. 근로자와 사용자의 정의", duration: "14:30", isCompleted: true },
        { id: "les-007-03", title: "3. 근로조건의 기준", duration: "18:10", isCompleted: true },
        { id: "les-007-04", title: "4. 균등처우와 차별금지", duration: "13:40", isCompleted: true },
      ],
    },
  ],
};

// ── 강의 자료 ──

export const courseMaterials: Record<string, CourseMaterial[]> = {
  "mc-001": [
    {
      id: "mat-001-01",
      courseId: "mc-001",
      title: "세무회계 실무 기초 강의교안",
      fileType: "PDF",
      fileSize: "3.2 MB",
      fileName: "세무회계_실무기초_교안.pdf",
      fileUrl: "#",
      uploadedAt: "2026-01-15",
    },
    {
      id: "mat-001-02",
      courseId: "mc-001",
      title: "부가가치세 신고서 작성 실습 파일",
      fileType: "XLSX",
      fileSize: "1.5 MB",
      fileName: "부가세_신고서_실습.xlsx",
      fileUrl: "#",
      uploadedAt: "2026-01-15",
    },
    {
      id: "mat-001-03",
      courseId: "mc-001",
      title: "원천징수이행상황신고서 양식",
      fileType: "HWP",
      fileSize: "890 KB",
      fileName: "원천징수이행상황신고서_양식.hwp",
      fileUrl: "#",
      uploadedAt: "2026-01-20",
    },
    {
      id: "mat-001-04",
      courseId: "mc-001",
      title: "2026년 세법 개정 요약 자료",
      fileType: "PDF",
      fileSize: "1.8 MB",
      fileName: "2026_세법개정_요약.pdf",
      fileUrl: "#",
      uploadedAt: "2026-02-01",
    },
    {
      id: "mat-001-05",
      courseId: "mc-001",
      title: "종합소득세 실습 데이터",
      fileType: "XLSX",
      fileSize: "2.1 MB",
      fileName: "종합소득세_실습데이터.xlsx",
      fileUrl: "#",
      uploadedAt: "2026-02-10",
    },
  ],
  "mc-002": [
    {
      id: "mat-002-01",
      courseId: "mc-002",
      title: "경영전략 핵심 노트 강의교안",
      fileType: "PDF",
      fileSize: "4.5 MB",
      fileName: "경영전략_핵심노트_교안.pdf",
      fileUrl: "#",
      uploadedAt: "2026-01-10",
    },
    {
      id: "mat-002-02",
      courseId: "mc-002",
      title: "SWOT 분석 워크시트",
      fileType: "XLSX",
      fileSize: "520 KB",
      fileName: "SWOT_분석_워크시트.xlsx",
      fileUrl: "#",
      uploadedAt: "2026-01-10",
    },
    {
      id: "mat-002-03",
      courseId: "mc-002",
      title: "전략 케이스 스터디 자료집",
      fileType: "PDF",
      fileSize: "6.2 MB",
      fileName: "전략_케이스스터디_자료집.pdf",
      fileUrl: "#",
      uploadedAt: "2026-01-15",
    },
  ],
  "mc-003": [
    {
      id: "mat-003-01",
      courseId: "mc-003",
      title: "인사노무관리 입문 강의교안",
      fileType: "PDF",
      fileSize: "2.8 MB",
      fileName: "인사노무관리_입문_교안.pdf",
      fileUrl: "#",
      uploadedAt: "2026-02-01",
    },
    {
      id: "mat-003-02",
      courseId: "mc-003",
      title: "표준 근로계약서 템플릿",
      fileType: "HWP",
      fileSize: "340 KB",
      fileName: "표준_근로계약서_템플릿.hwp",
      fileUrl: "#",
      uploadedAt: "2026-02-01",
    },
    {
      id: "mat-003-03",
      courseId: "mc-003",
      title: "4대보험 취득·상실 신고서 양식",
      fileType: "ZIP",
      fileSize: "1.2 MB",
      fileName: "4대보험_신고서양식_모음.zip",
      fileUrl: "#",
      uploadedAt: "2026-02-05",
    },
    {
      id: "mat-003-04",
      courseId: "mc-003",
      title: "연차유급휴가 계산 시트",
      fileType: "XLSX",
      fileSize: "180 KB",
      fileName: "연차유급휴가_계산시트.xlsx",
      fileUrl: "#",
      uploadedAt: "2026-02-10",
    },
  ],
  "mc-006": [
    {
      id: "mat-006-01",
      courseId: "mc-006",
      title: "재무제표 분석 실무 교안",
      fileType: "PDF",
      fileSize: "5.1 MB",
      fileName: "재무제표분석_실무_교안.pdf",
      fileUrl: "#",
      uploadedAt: "2025-09-20",
    },
    {
      id: "mat-006-02",
      courseId: "mc-006",
      title: "재무비율 분석 실습 파일",
      fileType: "XLSX",
      fileSize: "3.4 MB",
      fileName: "재무비율_분석_실습.xlsx",
      fileUrl: "#",
      uploadedAt: "2025-09-20",
    },
  ],
  "mc-007": [
    {
      id: "mat-007-01",
      courseId: "mc-007",
      title: "근로기준법 핵심정리 교안",
      fileType: "PDF",
      fileSize: "2.5 MB",
      fileName: "근로기준법_핵심정리_교안.pdf",
      fileUrl: "#",
      uploadedAt: "2025-08-01",
    },
  ],
};

/** 강의 ID로 커리큘럼 조회 */
export function getCourseSections(courseId: string): CourseSection[] {
  return courseSections[courseId] ?? [];
}

/** 강의 ID로 강의자료 조회 */
export function getCourseMaterials(courseId: string): CourseMaterial[] {
  return courseMaterials[courseId] ?? [];
}
