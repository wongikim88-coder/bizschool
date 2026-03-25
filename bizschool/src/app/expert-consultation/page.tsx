import type { Metadata } from "next";
import { Calculator, FileText, Users, Briefcase, ArrowRight, CheckCircle, Shield, Clock } from "lucide-react";
import PricingCard from "@/components/expert-consultation/PricingCard";
import HeroStats from "@/components/expert-consultation/HeroStats";

export const metadata: Metadata = {
  title: "전문가상담 - BIZSCHOOL",
  description: "회계, 세무, 4대보험, 인사·총무 전문가에게 1:1 맞춤 상담을 받아보세요.",
};

const categories = [
  {
    icon: Calculator,
    title: "회계",
    description: "재무제표 분석, 회계처리 기준, 원가관리 등 회계 전반에 대한 전문 상담",
  },
  {
    icon: FileText,
    title: "세무",
    description: "법인세, 부가세, 종합소득세 등 세무 신고 및 절세 전략 상담",
  },
  {
    icon: Users,
    title: "4대보험",
    description: "국민연금, 건강보험, 고용보험, 산재보험 등 4대보험 관련 전문 상담",
  },
  {
    icon: Briefcase,
    title: "인사·총무",
    description: "채용, 평가, 보상체계, 총무 업무 등 인사·총무 전반에 대한 전문 상담",
  },
];

const features = [
  {
    icon: Shield,
    title: "1:1 프리미엄 상담",
    description: "전문가가 고객님의 상황에 맞는 맞춤 솔루션을 제공합니다.",
  },
  {
    icon: CheckCircle,
    title: "검증된 전문가",
    description: "해당 분야 경력 10년 이상의 전문가가 직접 답변합니다.",
  },
  {
    icon: Clock,
    title: "신속한 답변",
    description: "영업일 기준 1~2일 이내에 전문가 답변을 받아보실 수 있습니다.",
  },
];

export default function ExpertConsultationPage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#101828] via-[#1e2839] to-[#155dfc] px-6 pb-10 pt-14 text-center sm:px-12 sm:pb-14 sm:pt-20">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#155dfc]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#2b7fff]/15 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

        {/* Heading */}
        <h1 className="relative text-3xl font-bold leading-snug text-white sm:text-4xl">
          전문가에게 1:1로 상담받으세요
        </h1>

        {/* Description */}
        <p className="relative mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
          회계, 세무, 4대보험, 인사·총무 분야 전문가가<br className="sm:hidden" /> 맞춤 답변을 드립니다.
        </p>

        {/* Category chips */}
        <div className="relative mt-7 flex flex-wrap justify-center gap-2">
          {["회계", "세무", "4대보험", "인사·총무"].map((label) => (
            <span
              key={label}
              className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm"
            >
              {label}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="relative mx-auto mt-16 max-w-[600px]">
          <HeroStats />
        </div>
      </div>

      <div className="mx-auto max-w-[960px] px-4 py-10">
      {/* 상담 분야 */}
      <div>
        <h2 className="text-center text-xl font-bold text-[var(--color-dark)] sm:text-2xl">상담 분야</h2>
        <p className="mt-2 text-center text-sm text-[var(--color-muted)]">각 분야 전문가가 맞춤 솔루션을 제공합니다</p>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {categories.map((cat, i) => (
            <div
              key={cat.title}
              className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--color-primary)]/30"
            >
              {/* Hover gradient overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[#2b7fff] shadow-md shadow-[var(--color-primary)]/20">
                  <cat.icon size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[var(--color-dark)]">{cat.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-body)]">
                    {cat.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 서비스 특징 */}
      <div className="mt-20 rounded-2xl bg-[var(--color-light-bg)] px-6 py-12 sm:px-10">
        <h2 className="text-center text-xl font-bold text-[var(--color-dark)] sm:text-2xl">서비스 특징</h2>
        <p className="mt-2 text-center text-sm text-[var(--color-muted)]">전문가상담만의 차별화된 서비스를 경험하세요</p>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className="flex flex-col items-center rounded-2xl bg-white p-7 text-center shadow-sm"
            >
              <span className="text-5xl font-black leading-none text-[var(--color-primary)]/15">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-[15px] font-bold text-[var(--color-dark)]">{feat.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-body)]">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 이용 안내 */}
      <div className="mt-20">
        <h2 className="text-center text-xl font-bold text-[var(--color-dark)] sm:text-2xl">이용 안내</h2>
        <div className="relative mt-10 grid grid-cols-1 gap-[70px] sm:grid-cols-3">
          {/* 연결선 (데스크톱) */}
          <div className="pointer-events-none absolute left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] top-8 hidden h-0.5 bg-gradient-to-r from-[var(--color-primary)]/20 via-[var(--color-primary)]/40 to-[var(--color-primary)]/20 sm:block" />

          {([
            { step: "1", title: "상담 분야 선택", desc: <>회계, 세무, 4대보험, 인사·총무 중<br />원하는 분야를 선택합니다.</> },
            { step: "2", title: "질문 내용 작성", desc: "궁금한 내용을 구체적으로 작성하여 등록합니다." },
            { step: "3", title: "전문가 답변 확인", desc: <>영업일 1~2일 이내<br />전문가의 맞춤 답변을 확인합니다.</> },
          ] as const).map((item) => (
            <div key={item.step} className="relative flex flex-col items-center text-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary-light)]">
                <span className="text-sm font-bold leading-tight text-[var(--color-primary)]">Step</span>
                <span className="ml-0.5 text-xl font-black text-[var(--color-primary)]">{item.step}</span>
              </div>
              <h3 className="mt-4 text-[15px] font-bold text-[var(--color-dark)]">{item.title}</h3>
              <p className="mt-1.5 whitespace-nowrap text-sm leading-relaxed text-[var(--color-body)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 요금 안내 */}
      <div className="mt-20">
        <h2 className="text-center text-xl font-bold text-[var(--color-dark)] sm:text-2xl">요금 안내</h2>
        <p className="mt-2 text-center text-sm text-[var(--color-muted)]">합리적인 가격으로 전문가 상담을 이용하세요</p>

        <PricingCard />
      </div>
      </div>
    </div>
  );
}
