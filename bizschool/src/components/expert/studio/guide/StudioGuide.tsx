"use client";

import { useState } from "react";
import Link from "next/link";
import { Lightbulb, ChevronDown, ChevronRight, Rocket } from "lucide-react";
import { guideSteps, guideFaqs } from "@/data/expertStudio";

export default function StudioGuide() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      {/* Step Guide */}
      <div>
        <h2 className="mb-6 text-lg font-bold text-[var(--color-dark)]">
          강의 제작 가이드
        </h2>
        <div className="space-y-4">
          {guideSteps.map((item) => (
            <div
              key={item.step}
              className="rounded-xl border border-[var(--color-border)] bg-white p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white">
                  {item.step}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-[var(--color-dark)]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-[var(--color-body)]">
                    {item.description}
                  </p>
                  {item.tip && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <Lightbulb
                        size={16}
                        className="mt-0.5 shrink-0 text-amber-500"
                      />
                      <p className="text-xs text-amber-700">{item.tip}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-6 text-center">
          <Link
            href="/expert/upload"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-white transition-colors hover:opacity-90"
          >
            <Rocket size={16} />
            지금 시작하기
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-[var(--color-dark)]">
          자주 묻는 질문
        </h2>
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
          {guideFaqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="border-b border-[var(--color-border)] last:border-b-0"
              >
                <button
                  onClick={() =>
                    setOpenFaqIndex(isOpen ? null : index)
                  }
                  className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-[var(--color-light-bg)]"
                >
                  {isOpen ? (
                    <ChevronDown
                      size={16}
                      className="shrink-0 text-[var(--color-primary)]"
                    />
                  ) : (
                    <ChevronRight
                      size={16}
                      className="shrink-0 text-[var(--color-muted)]"
                    />
                  )}
                  <span
                    className={`text-sm ${
                      isOpen
                        ? "font-medium text-[var(--color-primary)]"
                        : "text-[var(--color-dark)]"
                    }`}
                  >
                    {faq.question}
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-[var(--color-border)] bg-[var(--color-light-bg)] px-5 py-4">
                    <p className="text-sm text-[var(--color-body)]">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
