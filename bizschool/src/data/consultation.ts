export const SUGGEST_CHIPS = [
  { label: "세무 상담", query: "개인사업자 종합소득세 신고 방법이 궁금합니다" },
  { label: "회계 질문", query: "복식부기와 간편장부의 차이점을 알려주세요" },
  { label: "경리 문의", query: "급여 원천징수 계산 방법을 알려주세요" },
  { label: "세금 계산", query: "부가가치세 매입세액 공제 조건이 궁금합니다" },
];

const MOCK_RESPONSES: Record<string, string> = {
  종합소득세: `종합소득세는 개인이 1년간 경제활동으로 얻은 소득에 대해 납부하는 세금입니다.

**1. 과세 대상 소득**
- 사업소득, 근로소득, 이자소득, 배당소득, 연금소득, 기타소득

**2. 신고 기간**
- 매년 5월 1일 ~ 5월 31일 (성실신고확인 대상자는 6월 30일까지)

**3. 개인사업자 신고 방법**
- 홈택스(www.hometax.go.kr) 전자신고
- 세무대리인을 통한 신고
- 세무서 방문 신고

**4. 필요 서류**
- 사업장현황신고서, 총수입금액 및 필요경비명세서
- 세금계산서 합계표, 매입처별 세금계산서 합계표
- 기부금명세서 (해당 시)

추가로 궁금한 점이 있으시면 편하게 질문해 주세요!`,

  복식부기: `복식부기와 간편장부는 사업자의 장부기장 방식입니다.

**복식부기**
- 모든 거래를 차변(왼쪽)과 대변(오른쪽)으로 이중 기록
- 재무상태표, 손익계산서 작성 가능
- 직전 연도 수입금액이 기준금액 이상인 사업자 의무

**간편장부**
- 가계부처럼 단순하게 수입/지출만 기록
- 소규모 사업자 대상 (업종별 기준금액 미만)
- 간편장부 소득금액 계산서 작성

**기준금액 (업종별)**
| 업종 | 기준금액 |
|------|---------|
| 농업, 도소매업 등 | 3억원 |
| 제조업, 음식업 등 | 1.5억원 |
| 부동산임대업, 서비스업 등 | 7,500만원 |

간편장부 대상자가 복식부기로 기장하면 기장세액공제(20%)를 받을 수 있습니다.`,

  원천징수: `원천징수는 소득을 지급하는 자(원천징수의무자)가 소득자의 세금을 미리 공제하여 납부하는 제도입니다.

**급여 원천징수 계산 방법**

1. **월급여액 확인** - 비과세소득(식대 20만원 등) 제외
2. **근로소득 간이세액표 조회** - 국세청 간이세액표 기준
3. **부양가족 수 반영** - 공제대상 가족 수에 따라 세액 결정
4. **소득세 + 지방소득세(10%)** 공제

**예시) 월 급여 300만원, 부양가족 1명**
- 소득세: 약 54,680원
- 지방소득세: 약 5,468원
- 총 원천징수액: 약 60,148원

**원천징수 신고/납부**
- 매월 10일까지 전월분 신고·납부
- 반기납부 승인 시 7월 10일, 1월 10일

궁금한 점이 더 있으시면 말씀해 주세요!`,

  부가가치세: `부가가치세 매입세액 공제를 받기 위해서는 다음 조건을 충족해야 합니다.

**매입세액 공제 요건**
1. 사업과 직접 관련된 지출일 것
2. 적격 세금계산서를 수취할 것
3. 매입처별 세금계산서 합계표를 제출할 것

**공제 불가 항목**
- 비영업용 소형승용차 관련 매입세액
- 접대비 관련 매입세액
- 면세사업 관련 매입세액
- 사업과 무관한 지출

**신고 기간**
| 구분 | 과세기간 | 신고·납부기한 |
|------|---------|-------------|
| 1기 확정 | 1.1~6.30 | 7월 25일 |
| 2기 확정 | 7.1~12.31 | 다음해 1월 25일 |

**절세 팁**: 사업용 신용카드를 등록하면 세금계산서 없이도 매입세액 공제가 가능합니다.`,
};

const DEFAULT_RESPONSE = `안녕하세요! 세무/회계/경리 관련 궁금하신 점에 대해 답변드리겠습니다.

질문해 주신 내용을 분석했습니다. 보다 정확한 답변을 위해 몇 가지 안내드립니다:

1. **세무 관련**: 종합소득세, 부가가치세, 원천징수 등 세금 신고·납부 전반
2. **회계 관련**: 복식부기, 재무제표 작성, 회계처리 기준
3. **경리 관련**: 급여 관리, 4대보험, 전표 처리, 자금 관리

더 구체적인 질문을 주시면 상세한 답변을 드릴 수 있습니다.
궁금한 점이 있으시면 편하게 말씀해 주세요!`;

export function getMockResponse(query: string): string {
  const keywords = Object.keys(MOCK_RESPONSES);
  const matched = keywords.find((kw) => query.includes(kw));
  return matched ? MOCK_RESPONSES[matched] : DEFAULT_RESPONSE;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function getSessionTitle(firstMessage: string): string {
  return firstMessage.length > 20
    ? firstMessage.slice(0, 20) + "..."
    : firstMessage;
}

export function groupSessionsByDate<
  T extends { createdAt: string },
>(sessions: T[]): Record<string, T[]> {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  const groups: Record<string, T[]> = {};

  for (const session of sessions) {
    const dateStr = new Date(session.createdAt).toDateString();
    let label: string;
    if (dateStr === today) label = "오늘";
    else if (dateStr === yesterday) label = "어제";
    else
      label = new Date(session.createdAt).toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
      });

    if (!groups[label]) groups[label] = [];
    groups[label].push(session);
  }

  return groups;
}
