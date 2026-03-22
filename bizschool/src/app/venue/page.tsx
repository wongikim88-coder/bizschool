import type { Metadata } from "next";
import Image from "next/image";
import {
  Monitor,
  Users,
  Laptop,
  BookOpen,
  MapPin,
  Phone,
  Printer,
  TrainFront,
  Bus,
} from "lucide-react";
import KakaoMap from "@/components/directions/KakaoMap";

export const metadata: Metadata = {
  title: "강의장 소개 및 찾아오시는 길 | BIZSCHOOL",
  description:
    "더존비즈스쿨 평생교육원 강의장 시설 안내와 찾아오시는 길. 주소, 교통편(2호선 구의역 1번출구), 지도 정보를 확인하세요.",
};

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

const CONTACT_INFO = {
  name: "더존비즈스쿨 평생교육원",
  address: "서울 광진구 자양로 142 청양빌딩 3층",
  phone: "02-456-9156",
  fax: "02-452-9762",
};

const TRANSPORT_INFO = {
  subway: {
    line: "2호선",
    station: "구의역",
    exit: "1번출구",
    walkTime: "도보 8분",
    distance: "200m 이내",
  },
  bus: {
    routes: ["302", "303", "320", "2221", "3215", "3216", "3220", "9403"],
    stop: "광진구청 앞",
    walkTime: "도보 5분",
  },
};

export default function VenuePage() {
  return (
    <div>
      {/* Section 1: Page Header */}
      <section className="mx-auto max-w-[1200px] px-4 pt-12 pb-8 md:pt-16 md:pb-10">
        <h1 className="text-2xl font-bold text-[var(--color-dark)] md:text-3xl">
          강의장 소개
        </h1>
        <p className="mt-3 text-base text-[var(--color-muted)] md:text-lg">
          더존비즈스쿨 평생교육원의 시설과 찾아오시는 길을 안내합니다.
        </p>
        <hr className="mt-6 border-t-2 border-[var(--color-border)]" />
      </section>

      {/* Section 2: Facilities */}
      <section id="facilities" className="bg-[var(--color-light-bg)]">
        <div className="mx-auto max-w-[1200px] px-4 py-16 md:py-24">
          <h2 className="text-center text-2xl font-bold text-[var(--color-dark)] md:text-3xl">
            강의장 시설 안내
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

      {/* Section 3: Directions */}
      <section id="directions" className="scroll-mt-20">
        <div className="mx-auto max-w-[1200px] px-4 py-16 md:py-24">
          <h2 className="text-center text-2xl font-bold text-[var(--color-dark)] md:text-3xl">
            찾아오시는 길
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[var(--color-muted)]">
            더존비즈스쿨 평생교육원의 위치와 교통편을 안내합니다.
          </p>

          <div className="mt-12 overflow-hidden rounded-2xl shadow-lg">
            <KakaoMap />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Basic Info Card */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-8">
              <h3 className="text-lg font-bold text-[var(--color-dark)]">
                기본 정보
              </h3>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-dark)]">
                      주소
                    </p>
                    <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                      {CONTACT_INFO.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-dark)]">
                      전화
                    </p>
                    <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                      {CONTACT_INFO.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                    <Printer size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-dark)]">
                      팩스
                    </p>
                    <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                      {CONTACT_INFO.fax}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transportation Card */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-8">
              <h3 className="text-lg font-bold text-[var(--color-dark)]">
                교통 안내
              </h3>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <TrainFront size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-dark)]">
                      지하철
                    </p>
                    <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                      {TRANSPORT_INFO.subway.line} {TRANSPORT_INFO.subway.station}{" "}
                      {TRANSPORT_INFO.subway.exit} {TRANSPORT_INFO.subway.walkTime}{" "}
                      ({TRANSPORT_INFO.subway.distance})
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Bus size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-dark)]">
                      버스
                    </p>
                    <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                      {TRANSPORT_INFO.bus.routes.join(", ")}
                    </p>
                    <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                      {TRANSPORT_INFO.bus.stop} 하차 후, {TRANSPORT_INFO.bus.walkTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
