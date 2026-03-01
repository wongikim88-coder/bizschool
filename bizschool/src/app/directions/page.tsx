import type { Metadata } from "next";
import { MapPin, Phone, Printer, TrainFront, Bus } from "lucide-react";
import KakaoMap from "@/components/directions/KakaoMap";

export const metadata: Metadata = {
  title: "찾아오시는 길 | BIZSCHOOL",
  description:
    "더존비즈스쿨 평생교육원 오시는 길 안내. 주소, 전화, 교통편, 지도 정보.",
};

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

export default function DirectionsPage() {
  return (
    <div>
      {/* Title + Map Section */}
      <section className="mx-auto max-w-[1200px] px-4 pt-12 pb-16 md:pt-16 md:pb-24">
        <div className="mb-8 md:mb-10">
          <h1 className="text-2xl font-bold text-[var(--color-dark)] md:text-3xl">
            찾아오시는 길
          </h1>
          <p className="mt-3 text-base text-[var(--color-muted)] md:text-lg">
            더존비즈스쿨 평생교육원의 위치와 교통편을 안내합니다.
          </p>
          <hr className="mt-6 border-t-2 border-[var(--color-border)]" />
        </div>

        <div className="overflow-hidden rounded-2xl shadow-lg">
          <KakaoMap />
        </div>
      </section>

      {/* Info Section */}
      <section className="mx-auto max-w-[1200px] px-4 pb-16 md:pb-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* 기본 정보 카드 */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-8">
            <h2 className="text-lg font-bold text-[var(--color-dark)]">
              기본 정보
            </h2>

            <div className="mt-6 space-y-5">
              {/* 주소 */}
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

              {/* 전화 */}
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

              {/* 팩스 */}
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

          {/* 교통 안내 카드 */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-8">
            <h2 className="text-lg font-bold text-[var(--color-dark)]">
              교통 안내
            </h2>

            <div className="mt-6 space-y-5">
              {/* 지하철 */}
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

              {/* 버스 */}
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
      </section>
    </div>
  );
}
