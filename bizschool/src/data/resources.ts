import type { Resource, ResourceCategoryFilter } from "@/types";

export const RESOURCES_PER_PAGE = 10;

export const resources: Resource[] = [
  // 신청서·양식 (5건)
  {
    id: 1, title: "2026년 근로자주도훈련 수강신청서", category: "신청서·양식",
    content: "<p>2026년 근로자주도훈련 수강신청서 양식입니다.</p><p>본 신청서는 중소기업 근로자주도훈련 과정 수강 신청 시 제출하는 서류이며, 사업주 확인란에 직인을 날인하여 제출해 주시기 바랍니다.</p><p><strong>제출 방법:</strong> 작성 후 이메일(training@bizschool.co.kr) 또는 팩스(02-1234-5679)로 제출</p>",
    fileType: "PDF", fileSize: "1.2 MB", fileName: "근로자주도훈련_수강신청서_2026.pdf", fileUrl: "#", createdAt: "2026-03-20",
  },
  {
    id: 2, title: "근로자주도훈련 환급신청서", category: "신청서·양식",
    content: "<p>근로자주도훈련 과정 수료 후 훈련비 환급 신청 시 사용하는 양식입니다.</p><p>수료일로부터 30일 이내에 제출하셔야 하며, 수료증 사본을 함께 첨부해 주시기 바랍니다.</p>",
    fileType: "PDF", fileSize: "980 KB", fileName: "근로자주도훈련_환급신청서.pdf", fileUrl: "#", createdAt: "2026-03-15",
  },
  {
    id: 3, title: "위탁훈련 계약서 양식", category: "신청서·양식",
    content: "<p>기업과 비즈스쿨 간 위탁훈련 계약 체결 시 사용하는 표준 계약서 양식입니다.</p><p>계약 내용 확인 후 2부를 작성하여 양 기관이 각 1부씩 보관합니다.</p>",
    fileType: "HWP", fileSize: "245 KB", fileName: "위탁훈련_계약서.hwp", fileUrl: "#", createdAt: "2026-03-10",
  },
  {
    id: 4, title: "수강료 납부 확인서 양식", category: "신청서·양식",
    content: "<p>수강료 납부 사실을 확인하는 서류 양식입니다.</p><p>법인 카드 결제 또는 세금계산서 발행이 필요한 경우 본 양식을 작성하여 제출해 주세요.</p>",
    fileType: "PDF", fileSize: "156 KB", fileName: "수강료_납부확인서.pdf", fileUrl: "#", createdAt: "2026-02-28",
  },
  {
    id: 5, title: "교육훈련 수료보고서 양식", category: "신청서·양식",
    content: "<p>교육훈련 수료 후 사업주에게 보고하기 위한 수료보고서 양식입니다.</p><p>훈련 내용 요약, 학습 성과, 업무 적용 계획 등을 작성하여 제출하시면 됩니다.</p>",
    fileType: "HWP", fileSize: "312 KB", fileName: "교육훈련_수료보고서.hwp", fileUrl: "#", createdAt: "2026-02-20",
  },

  // 정오표 (4건)
  {
    id: 6, title: "2026 세무회계 실무 교재 정오표", category: "정오표",
    content: "<p>「2026 세무회계 실무」 교재의 정오표입니다.</p><p>1쇄 기준으로 발견된 오류를 정리하였으며, 수정 사항은 다음 쇄에 반영될 예정입니다. 학습 시 참고해 주시기 바랍니다.</p><p><strong>주요 수정 내용:</strong></p><ul><li>p.45 부가가치세 세율 표기 수정</li><li>p.112 사례 문제 답안 수정</li><li>p.203 법 조문 인용 오류 수정</li></ul>",
    fileType: "PDF", fileSize: "156 KB", fileName: "세무회계실무_정오표_2026.pdf", fileUrl: "#", createdAt: "2026-03-18",
  },
  {
    id: 7, title: "2026 재산제세 실무 교재 정오표", category: "정오표",
    content: "<p>「2026 재산제세 실무」 교재의 정오표입니다.</p><p>양도소득세, 상속세, 증여세 관련 일부 계산 사례의 오류가 수정되었습니다.</p>",
    fileType: "PDF", fileSize: "89 KB", fileName: "재산제세실무_정오표_2026.pdf", fileUrl: "#", createdAt: "2026-03-12",
  },
  {
    id: 8, title: "2026 법인세 실무 교재 정오표", category: "정오표",
    content: "<p>「2026 법인세 실무」 교재의 정오표입니다.</p><p>세액공제 한도 계산 관련 표기 오류 및 서식 번호 오기가 수정되었습니다.</p>",
    fileType: "PDF", fileSize: "124 KB", fileName: "법인세실무_정오표_2026.pdf", fileUrl: "#", createdAt: "2026-03-05",
  },
  {
    id: 9, title: "2026 원가관리회계 교재 정오표", category: "정오표",
    content: "<p>「2026 원가관리회계」 교재의 정오표입니다.</p><p>원가배분 사례 문제의 계산 과정 일부가 수정되었습니다.</p>",
    fileType: "PDF", fileSize: "67 KB", fileName: "원가관리회계_정오표_2026.pdf", fileUrl: "#", createdAt: "2026-02-25",
  },

  // 교육자료 (5건)
  {
    id: 10, title: "2026 세무회계 실무 강의교안", category: "교육자료",
    content: "<p>2026년 세무회계 실무 과정의 강의교안(PDF)입니다.</p><p>강의 수강 전 미리 출력하여 준비하시면 학습 효과를 높일 수 있습니다. 본 자료는 수강생 전용이며 무단 배포를 금합니다.</p>",
    fileType: "PDF", fileSize: "15.2 MB", fileName: "세무회계실무_교안_2026.pdf", fileUrl: "#", createdAt: "2026-03-16",
  },
  {
    id: 11, title: "전산세무 2급 실습파일 (엑셀)", category: "교육자료",
    content: "<p>전산세무 2급 실습에 필요한 엑셀 파일입니다.</p><p>강의 중 실습 시간에 사용되며, 사전에 다운로드하여 준비해 주시기 바랍니다.</p>",
    fileType: "XLSX", fileSize: "3.4 MB", fileName: "전산세무2급_실습파일.xlsx", fileUrl: "#", createdAt: "2026-03-08",
  },
  {
    id: 12, title: "2026 재산제세 강의교안", category: "교육자료",
    content: "<p>2026년 재산제세 과정의 강의교안(PDF)입니다.</p><p>양도소득세, 상속세, 증여세의 핵심 내용을 다루고 있습니다.</p>",
    fileType: "PDF", fileSize: "12.8 MB", fileName: "재산제세_교안_2026.pdf", fileUrl: "#", createdAt: "2026-02-27",
  },
  {
    id: 13, title: "부가가치세 신고 실습 자료", category: "교육자료",
    content: "<p>부가가치세 신고 실습에 필요한 자료 모음(ZIP)입니다.</p><p>전자신고 모의 환경 설정 파일과 실습용 거래 데이터가 포함되어 있습니다.</p>",
    fileType: "ZIP", fileSize: "8.5 MB", fileName: "부가세신고_실습자료.zip", fileUrl: "#", createdAt: "2026-02-18",
  },
  {
    id: 14, title: "원천징수 실무 강의교안", category: "교육자료",
    content: "<p>원천징수 실무 과정의 강의교안(PPTX)입니다.</p><p>근로소득, 사업소득, 기타소득의 원천징수 방법을 정리하였습니다.</p>",
    fileType: "PPTX", fileSize: "6.7 MB", fileName: "원천징수실무_교안.pptx", fileUrl: "#", createdAt: "2026-02-10",
  },

  // 참고자료 (4건)
  {
    id: 15, title: "2026년 세법 개정사항 요약", category: "참고자료",
    content: "<p>2026년 적용되는 주요 세법 개정사항을 요약 정리한 자료입니다.</p><p>소득세법, 법인세법, 부가가치세법, 조세특례제한법 등 실무에 영향을 미치는 핵심 개정 내용을 담고 있습니다.</p>",
    fileType: "PDF", fileSize: "2.1 MB", fileName: "2026_세법개정_요약.pdf", fileUrl: "#", createdAt: "2026-03-01",
  },
  {
    id: 16, title: "중소기업 세무 실무 가이드", category: "참고자료",
    content: "<p>중소기업 경리·회계 담당자를 위한 세무 실무 가이드입니다.</p><p>부가세 신고, 원천징수, 4대 보험 등 실무에서 자주 발생하는 업무를 체크리스트 형태로 정리하였습니다.</p>",
    fileType: "PDF", fileSize: "4.3 MB", fileName: "중소기업_세무실무가이드.pdf", fileUrl: "#", createdAt: "2026-02-15",
  },
  {
    id: 17, title: "자주 묻는 세무 Q&A 모음집", category: "참고자료",
    content: "<p>비즈스쿨 수강생들이 자주 질문하는 세무 관련 Q&A를 모은 자료입니다.</p><p>부가세 신고 기한, 간이과세자 기준, 연말정산 공제 항목 등 실무에서 바로 활용 가능한 내용입니다.</p>",
    fileType: "PDF", fileSize: "1.8 MB", fileName: "세무QA_모음집.pdf", fileUrl: "#", createdAt: "2026-02-05",
  },
  {
    id: 18, title: "근로자주도훈련 제도 안내 가이드", category: "참고자료",
    content: "<p>근로자주도훈련 제도의 개요, 신청 절차, 환급 방법 등을 안내하는 가이드입니다.</p><p>중소기업 사업주와 근로자가 알아야 할 핵심 내용을 Q&A 형태로 정리하였습니다.</p>",
    fileType: "PDF", fileSize: "3.2 MB", fileName: "근로자주도훈련_안내가이드.pdf", fileUrl: "#", createdAt: "2026-01-20",
  },
];

/** ID 내림차순 정렬 (최신순) */
export function getSortedResources(allResources: Resource[]): Resource[] {
  return [...allResources].sort((a, b) => b.id - a.id);
}

/** 카테고리 필터 */
export function filterByCategory(allResources: Resource[], category: ResourceCategoryFilter): Resource[] {
  if (category === "전체") return allResources;
  return allResources.filter((r) => r.category === category);
}

/** 제목 검색 필터 */
export function filterBySearch(allResources: Resource[], search: string): Resource[] {
  if (!search) return allResources;
  const query = search.toLowerCase();
  return allResources.filter((r) => r.title.toLowerCase().includes(query));
}
