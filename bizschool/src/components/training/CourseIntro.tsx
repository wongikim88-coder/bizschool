import { Calculator, FileCheck, Building2, Landmark } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { trainingPrograms } from "@/data/training";

const programIcons: LucideIcon[] = [Calculator, FileCheck, Building2, Landmark];

export default function CourseIntro() {
  return (
    <section className="bg-[var(--color-light-bg)]">
      <div className="mx-auto max-w-[1200px] px-4 py-16 md:py-24">
        <h2 className="text-center text-xl font-bold text-[var(--color-dark)] md:text-2xl">
          과정소개
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-[var(--color-muted)] md:text-base">
          중소기업 근로자를 위한 실무 중심 교육과정
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {trainingPrograms.map((program, idx) => {
            const Icon = programIcons[idx];
            return (
              <div
                key={program.id}
                className="rounded-2xl border border-[var(--color-border)] bg-white p-6 transition-all hover:shadow-lg"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-light)]">
                  <Icon size={22} className="text-[var(--color-primary)]" />
                </div>
                <h3 className="mt-4 text-base font-bold text-[var(--color-dark)]">
                  {program.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {program.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
