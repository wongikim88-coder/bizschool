import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  MessageCircle,
  Users,
  ArrowRight,
  GraduationCap,
  Share2,
  TrendingUp,
  Monitor,
  Laptop,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    iconBg: "bg-[var(--color-primary-light)] text-[var(--color-primary)]",
    title: "전문가의 실무 노하우를 내 것으로",
    description:
      "세무사, 회계사 등 현직 전문가가 직접 만든 강의를 자유롭게 수강하세요. 업무에 바로 적용할 수 있는 실전 중심 커리큘럼입니다.",
    linkText: "강의 둘러보기",
    href: "/",
  },
  {
    icon: MessageCircle,
    iconBg: "bg-emerald-50 text-emerald-600",
    title: "궁금한 건 바로 물어보세요",
    description:
      "업무 중 막히는 부분, 판단이 어려운 사안을 AI 전문가상담으로 해결하세요. 전문가의 경험에 기반한 답변을 빠르게 받아볼 수 있습니다.",
    linkText: "상담 시작하기",
    href: "/consulting",
  },
  {
    icon: Users,
    iconBg: "bg-purple-50 text-purple-600",
    title: "함께 나누면 더 빨리 성장합니다",
    description:
      "업무 노하우를 공유하고, 동료들의 경험에서 배우세요. 질문, 사례 공유, 자유 토론으로 함께 성장하는 공간입니다.",
    linkText: "커뮤니티 가기",
    href: "/community",
  },
];

const historyData = [
  {
    year: 2011,
    items: [
      "노동부 기관평가 B등급(동부지역 내 최고점수)",
      "국세청 조사국 공무원 대상 위탁교육",
      "국세청 재산세국 공무원 대상 위탁교육",
      "대경정보산업 고등학교 학교 위탁교육",
      "기업체 출장 강의",
      "내일 배움카드제 교육과정 11개 과정 노동부승인(세무회계 6개, OA 2개, 쇼핑몰 3개)",
    ],
  },
  {
    year: 2010,
    items: [
      "국세청 조사국 공무원 대상 위탁교육",
      "직업능력개발계좌제 9개 과정 노동부 승인(세무회계 5개, OA 4개)",
      "세무회계, ERP 등 노동부지원 실업자 교육",
      "제4강의장(멀티미디어실 25석) 오픈",
      "더존 아이플러스 실무용 프로그램 설치 및 교육실시",
      "대경정보산업 고등학교 학교 위탁교육",
    ],
  },
  {
    year: 2009,
    items: [
      "세무회계, ERP 등 노동부지원 실업자 교육",
      "국세청 공무원 대상 위탁교육",
      "대동세무 고등학교 선생님, 학생 대상 위탁교육",
      "기업체 출장 강의",
      "대구, 부산 지방 특강(양도분야)",
    ],
  },
  {
    year: 2008,
    items: [
      "제3교육장(멀티미디어실 30석) 개설",
      "휴게실 등 편의시설 확대",
      "국세청 재산세국 공무원 대상 위탁교육",
      "대동세무 고등학교 선생님, 학생 대상 위탁교육",
      "기업체 출장 강의",
      "2008 노동부 기관평가 재직자, 실업자 모두 B등급",
      "노동부 직업능력시설 인정(세무회계분야)",
      "대전, 대구, 부산 지방특강(상속세 및 증여세)",
    ],
  },
  {
    year: 2007,
    items: [
      "수강지원금 과정 실시",
      "신입사원 위탁과정, 네오플러스 실무 및 자격증 과정 운영",
      "세무사 등 세무전문가 대상 양도소득세, 네오플러스 등 과정 운영",
    ],
  },
  {
    year: 2006,
    items: [
      "서울시 성동교육청에 기업부설 평생교육원 설립신고",
      "제1,2 교육장(멀티미디어실 70석) 개설",
      "더존 네오플러스 실무용 버전 설치",
      "12월부터 사업주 훈련 교육 실시",
    ],
  },
];

const facilityFeatures = [
  {
    icon: Monitor,
    title: "1인 1PC 환경",
    description: "인터넷 연결 가능한 PC 및 노트북 비치",
  },
  {
    icon: Users,
    title: "40석 규모",
    description: "총 40석 규모의 독립 강의장 운영",
  },
  {
    icon: Laptop,
    title: "더존 Smart A",
    description: "실무용 버전 프로그램 설치 완비",
  },
  {
    icon: BookOpen,
    title: "실무 교육",
    description: "이론 + 실습 통합 멀티미디어 교육",
  },
];

const cycleItems = [
  {
    icon: GraduationCap,
    title: "배움",
    subtitle: "전문가 강의로 배움",
    description: "현직 전문가의 실무 강의를 통해 지식과 노하우를 습득합니다.",
    position: "top",
  },
  {
    icon: Share2,
    title: "나눔",
    subtitle: "커뮤니티에서 나눔",
    description: "배운 것을 실무에 적용하고, 경험을 동료들과 공유합니다.",
    position: "bottom-right",
  },
  {
    icon: TrendingUp,
    title: "성장",
    subtitle: "함께 성장",
    description: "서로의 피드백을 통해 모두가 함께 성장하는 선순환을 만듭니다.",
    position: "bottom-left",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Section 1: Hero (full-width) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#155dfc] to-[#0d3b9e] px-8 py-16 text-center md:px-16 md:py-24 lg:py-28">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 right-20 h-40 w-40 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute left-1/3 top-0 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
            비즈니스 성장을 위한 온라인 교육 플랫폼
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            전문가가 직접 전하는 실무 중심의 강의와 도서로
            <br />
            당신의 커리어를 한 단계 업그레이드하세요.
          </p>
        </div>
      </section>

      {/* Section 2: Features */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 md:py-24">
        <h2 className="text-center text-2xl font-bold text-[var(--color-dark)] md:text-3xl">
          비즈스쿨이 제공하는 핵심 서비스
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[var(--color-muted)]">
          전문가의 노하우부터 AI 상담, 커뮤니티까지 — 업무 성장에 필요한 모든 것
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-[var(--color-border)] bg-white p-8 transition-all hover:border-[var(--color-primary)]/30 hover:shadow-lg"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconBg}`}
              >
                <feature.icon size={24} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-[var(--color-dark)]">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                {feature.description}
              </p>
              <Link
                href={feature.href}
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)]"
              >
                {feature.linkText}
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Cycle (circular diagram) */}
      <section className="bg-[var(--color-light-bg)]">
        <div className="mx-auto max-w-[1200px] px-4 py-16 md:py-24">
          <h2 className="text-center text-2xl font-bold text-[var(--color-dark)] md:text-3xl">
            배우고, 나누고, 함께 성장합니다.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-[var(--color-muted)]">
            비즈스쿨은 모두가 함께 성장하는 오픈러닝 생태계를 지향합니다.
          </p>

          {/* Circular Diagram */}
          <div className="mt-12 flex justify-center">
            <div className="relative h-[420px] w-[420px] md:h-[480px] md:w-[480px]">
              {/* Outer circle ring */}
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-[var(--color-primary)]/15" />

              {/* Rotating arrows (SVG) */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 480 480"
                fill="none"
              >
                {/* Arrow arc: top → bottom-right */}
                <path
                  d="M 270 68 A 180 180 0 0 1 408 340"
                  stroke="var(--color-primary)"
                  strokeWidth="2"
                  strokeOpacity="0.25"
                  fill="none"
                />
                <polygon
                  points="408,340 409,322 423,330"
                  fill="var(--color-primary)"
                  fillOpacity="0.3"
                />

                {/* Arrow arc: bottom-right → bottom-left */}
                <path
                  d="M 370 380 A 180 180 0 0 1 110 380"
                  stroke="var(--color-primary)"
                  strokeWidth="2"
                  strokeOpacity="0.25"
                  fill="none"
                />
                <polygon
                  points="110,380 127,386 115,398"
                  fill="var(--color-primary)"
                  fillOpacity="0.3"
                />

                {/* Arrow arc: bottom-left → top */}
                <path
                  d="M 72 340 A 180 180 0 0 1 210 68"
                  stroke="var(--color-primary)"
                  strokeWidth="2"
                  strokeOpacity="0.25"
                  fill="none"
                />
                <polygon
                  points="210,68 195,78 193,62"
                  fill="var(--color-primary)"
                  fillOpacity="0.3"
                />
              </svg>


              {/* Node: 배움 (top center) */}
              <div className="absolute left-1/2 top-0 -translate-x-1/2">
                <div className="flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-[var(--color-primary)]/20">
                    <GraduationCap size={28} className="text-[var(--color-primary)]" />
                  </div>
                  <h3 className="mt-3 text-base font-bold text-[var(--color-dark)]">
                    배움
                  </h3>
                  <p className="mt-1 max-w-[160px] text-center text-xs leading-relaxed text-[var(--color-muted)]">
                    전문가 강의로
                    <br />
                    지식과 노하우 습득
                  </p>
                </div>
              </div>

              {/* Node: 나눔 (bottom-right) */}
              <div className="absolute bottom-4 right-0 md:bottom-6 md:right-2">
                <div className="flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-emerald-500/20">
                    <Share2 size={28} className="text-emerald-600" />
                  </div>
                  <h3 className="mt-3 text-base font-bold text-[var(--color-dark)]">
                    나눔
                  </h3>
                  <p className="mt-1 max-w-[160px] text-center text-xs leading-relaxed text-[var(--color-muted)]">
                    커뮤니티에서
                    <br />
                    경험과 노하우 공유
                  </p>
                </div>
              </div>

              {/* Node: 성장 (bottom-left) */}
              <div className="absolute bottom-4 left-0 md:bottom-6 md:left-2">
                <div className="flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-purple-500/20">
                    <TrendingUp size={28} className="text-purple-600" />
                  </div>
                  <h3 className="mt-3 text-base font-bold text-[var(--color-dark)]">
                    성장
                  </h3>
                  <p className="mt-1 max-w-[160px] text-center text-xs leading-relaxed text-[var(--color-muted)]">
                    피드백을 통해
                    <br />
                    함께 성장하는 생태계
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: 연혁 */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 md:py-24">
        <h2 className="text-center text-2xl font-bold text-[var(--color-dark)] md:text-3xl">
          비즈스쿨 연혁
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[var(--color-muted)]">
          2006년 설립 이후 꾸준히 성장해온 비즈스쿨의 발자취
        </p>

        <div className="mt-12 mx-auto max-w-2xl">
          {historyData.map((group, groupIdx) => (
            <div
              key={group.year}
              className={`relative pl-8 border-l-2 border-[var(--color-border)] ${
                groupIdx === historyData.length - 1 ? "pb-0" : "pb-10"
              }`}
            >
              <div className="absolute -left-[7px] top-0 h-3 w-3 rounded-full bg-[var(--color-primary)]" />
              <span className="inline-block rounded-full bg-[var(--color-primary)] px-3 py-0.5 text-sm font-bold text-white mb-3">
                {group.year}
              </span>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="text-sm leading-relaxed text-[var(--color-body)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: 강의장 소개 */}
      <section className="bg-[var(--color-light-bg)]">
        <div className="mx-auto max-w-[1200px] px-4 py-16 md:py-24">
          <h2 className="text-center text-2xl font-bold text-[var(--color-dark)] md:text-3xl">
            강의장 소개
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[var(--color-muted)]">
            실무 교육에 최적화된 멀티미디어 강의 환경
          </p>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
              <Image
                src="/images/about/bzschool_img_3.jpg"
                alt="비즈스쿨 강의장"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
              <Image
                src="/images/about/bzschool_img_4.jpg"
                alt="비즈스쿨 강의장"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {facilityFeatures.map((feat) => (
              <div key={feat.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                  <feat.icon size={24} />
                </div>
                <h3 className="mt-3 text-sm font-bold text-[var(--color-dark)]">
                  {feat.title}
                </h3>
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
