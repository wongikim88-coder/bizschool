import type { Metadata } from "next";
import { rateTableProducts, NOTICE_TEXT } from "@/data/rate-table";
import RateTableProduct from "@/components/rate-table/RateTableProduct";

export const metadata: Metadata = {
  title: "조견표 신청 | BIZSCHOOL",
  description:
    "양도·상속·증여세 조견표, 지방세 세율 일람표를 수량별로 신청하세요. 회원 할인가 제공.",
};

export default function RateTablePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#155dfc] to-[#0d3b9e] px-8 py-16 text-center md:px-16 md:py-24 lg:py-28">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 right-20 h-40 w-40 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute left-1/3 top-0 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
            조견표 신청
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            세무 관련 조견표를 간편하게 신청하세요.
            <br />
            수량별 회원 할인가로 제공됩니다.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-[1200px] px-4 pb-16">
        {/* Notice Banner */}
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-sm font-medium text-amber-800">
            {NOTICE_TEXT}
          </p>
        </div>

        {/* Products */}
        <div className="mt-10">
          {rateTableProducts.map((product) => (
            <RateTableProduct
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              spec={product.spec}
              types={product.types}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
