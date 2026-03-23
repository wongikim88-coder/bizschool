import { Suspense } from "react";
import type { Metadata } from "next";
import { resources } from "@/data/resources";
import ResourcePageContent from "@/components/resources/ResourcePageContent";

export const metadata: Metadata = {
  title: "자료실 | BIZSCHOOL",
  description:
    "근로자주도훈련 신청서, 교재 정오표, 강의교안 등 필요한 자료를 다운로드하세요.",
};

export default function ResourcesPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#155dfc] to-[#0d3b9e] px-8 py-16 text-center md:px-16 md:py-24 lg:py-28">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 right-20 h-40 w-40 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute left-1/3 top-0 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
            자료실
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            신청서, 정오표, 교육자료 등
            <br />
            필요한 자료를 다운로드하세요.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-[1200px] px-4 pb-16">
        <Suspense>
          <ResourcePageContent resources={resources} />
        </Suspense>
      </div>
    </div>
  );
}
