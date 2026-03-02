import {
  ClipboardCheck,
  FileText,
  GraduationCap,
  Banknote,
  CheckCircle,
  Phone,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  step: number;
  title: string;
  parties: string;
  icon: LucideIcon;
  items: string[];
}

const steps: Step[] = [
  {
    step: 1,
    title: "교육 준비",
    parties: "기업 - 공단",
    icon: ClipboardCheck,
    items: [
      "고용24 기업회원 가입",
      "기업규모 및 우선지원대상 확인",
      "계좌 등록",
    ],
  },
  {
    step: 2,
    title: "교육 신청",
    parties: "기업 - 더존비즈스쿨",
    icon: FileText,
    items: [
      "우선지원 대상기업 확인",
      "재직근로자 대상 확인",
      "수강신청 및 교육비 납부",
    ],
  },
  {
    step: 3,
    title: "교육참여 및 수료",
    parties: "더존비즈스쿨 - 기업",
    icon: GraduationCap,
    items: [
      "교육훈련 참여",
      "수료 시 확인서/수료증 발송",
    ],
  },
  {
    step: 4,
    title: "지원금 신청",
    parties: "기업 - 공단",
    icon: Banknote,
    items: [
      "제출서류 준비",
      "고용24 통해 비용 신청",
      "사업주 납입 훈련비 90% 지급",
    ],
  },
];

const requiredDocs = [
  "훈련비 납입 영수증",
  "훈련 수료증",
];

const acceptedReceipts = [
  "전자계산서 (영수함으로 기재된 것)",
  "카드매출전표 + 카드 앞면 복사 사본 (사업주명 확인)",
  "현금영수증 (사업주나 법인번호로 발행)",
  "전자계산서(청구함) + 훈련기관 발행 수납확인서",
];

const checklistItems = [
  "고용24 기업회원으로 계좌등록",
  "사업주훈련 지원한도 금액 확인",
  "우선지원대상 대상기업 확인",
];

export default function ProgramGuide() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 md:py-24">
      {/* 프로그램 설명 */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary-light)] p-6 md:p-8">
        <h2 className="text-lg font-bold text-[var(--color-dark)] md:text-xl">
          중소기업 근로자 주도훈련이란?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-body)] md:text-base">
          근로자가 원하는 훈련과정에 참여할 수 있도록 기업이 훈련비를 지원하면,{" "}
          <span className="font-bold text-[var(--color-primary)]">
            사업주가 부담한 비용의 90%까지
          </span>{" "}
          정부에서 지원하는 제도입니다.
        </p>
        <p className="mt-2 text-xs text-[var(--color-muted)]">
          * 정부 예산 소진 시 조기 마감될 수 있습니다.
        </p>
      </div>

      {/* 4단계 프로세스 */}
      <div className="mt-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {steps.map((s, idx) => (
            <div key={s.step} className="relative h-full">
              {/* 데스크톱 화살표 (마지막 카드 제외) */}
              {idx < steps.length - 1 && (
                <div className="pointer-events-none absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 translate-x-1/2 md:block">
                  <ChevronRight size={20} className="text-[var(--color-muted)]" />
                </div>
              )}
              <div className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-white p-6">
                {/* 스텝 번호 */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white">
                  {s.step}
                </div>
                {/* 아이콘 + 제목 */}
                <div className="mt-4 flex items-center gap-2">
                  <s.icon size={20} className="text-[var(--color-primary)]" />
                  <h3 className="text-base font-bold text-[var(--color-dark)]">
                    {s.title}
                  </h3>
                </div>
                {/* 관계자 */}
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  {s.parties}
                </p>
                {/* 항목 리스트 */}
                <ul className="mt-4 space-y-2">
                  {s.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-[var(--color-body)]"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 필수 제출서류 */}
      <div className="mt-16">
        <h3 className="text-lg font-bold text-[var(--color-dark)]">
          필수 제출서류
        </h3>
        {/* 간소화 안내 */}
        <div className="mt-4 rounded-xl bg-blue-50 p-4">
          <p className="text-sm font-medium text-[var(--color-dark)]">
            2025년 12월 1일부터 간소화
          </p>
          <p className="mt-1 text-sm text-[var(--color-body)]">
            제출서류가 훈련비 납입 영수증과 훈련 수료증 2가지로 간소화되었습니다.
          </p>
        </div>
        <div className="mt-4 space-y-3">
          {requiredDocs.map((doc) => (
            <div
              key={doc}
              className="flex items-start gap-3 text-sm text-[var(--color-body)]"
            >
              <CheckCircle
                size={16}
                className="mt-0.5 shrink-0 text-emerald-500"
              />
              {doc}
            </div>
          ))}
        </div>
      </div>

      {/* 인정되는 훈련비 납입 영수증 */}
      <div className="mt-12">
        <h3 className="text-lg font-bold text-[var(--color-dark)]">
          인정되는 훈련비 납입 영수증
        </h3>
        <div className="mt-4 space-y-3">
          {acceptedReceipts.map((receipt, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 text-sm text-[var(--color-body)]"
            >
              <CheckCircle
                size={16}
                className="mt-0.5 shrink-0 text-emerald-500"
              />
              {receipt}
            </div>
          ))}
        </div>
      </div>

      {/* 비용 신청 및 지급 절차 */}
      <div className="mt-12">
        <h3 className="text-lg font-bold text-[var(--color-dark)]">
          비용 신청 및 지급 절차
        </h3>
        {/* 경로 안내 */}
        <div className="mt-4 rounded-xl bg-blue-50 p-4">
          <p className="text-sm font-medium text-[var(--color-dark)]">
            신청 경로
          </p>
          <p className="mt-2 text-sm text-[var(--color-body)]">
            고용24 로그인 → 마이페이지 → 재직자 훈련관리 → 사업주훈련 → 비용관리
            → 비용신청(사업주위탁)
          </p>
        </div>
        {/* 지급 정보 */}
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
            <p className="font-medium text-[var(--color-muted)]">지급액</p>
            <p className="mt-1 font-bold text-[var(--color-dark)]">
              사업주가 납입한 훈련비(납입영수액 기준)의{" "}
              <span className="text-[var(--color-primary)]">90%</span>
            </p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
            <p className="font-medium text-[var(--color-muted)]">지급방식</p>
            <p className="mt-1 font-bold text-[var(--color-dark)]">
              고용24 기업회원 등록 계좌로 지급
            </p>
            <p className="mt-0.5 text-xs text-[var(--color-muted)]">
              사전등록 필수
            </p>
          </div>
        </div>
      </div>

      {/* 교육신청 전 확인사항 */}
      <div className="mt-12">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h3 className="text-lg font-bold text-[var(--color-dark)]">
            교육신청 전 확인사항
          </h3>
          <ul className="mt-4 space-y-3">
            {checklistItems.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <CheckCircle
                  size={18}
                  className="shrink-0 text-amber-500"
                />
                <span className="text-sm font-medium text-[var(--color-dark)]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 문의 */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-6 py-3">
          <Phone size={16} className="text-[var(--color-primary)]" />
          <span className="text-sm text-[var(--color-muted)]">문의</span>
          <span className="text-base font-bold text-[var(--color-dark)]">
            02-456-9156
          </span>
        </div>
      </div>
    </section>
  );
}
