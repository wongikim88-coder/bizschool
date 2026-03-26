"use client";

import { Clock, CheckCircle } from "lucide-react";
import type { ExpertConsultation } from "@/types";

interface ExpertCardProps {
  consultation: ExpertConsultation;
  onClick: (id: string) => void;
}

function StatusBadge({ status }: { status: "pending" | "answered" }) {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
        <Clock size={12} />
        대기중
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-primary-light)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-primary)]">
      <CheckCircle size={12} />
      답변완료
    </span>
  );
}

/* Desktop table row */
export function ExpertTableRow({ consultation: c, onClick }: ExpertCardProps) {
  return (
    <tr
      onClick={() => onClick(c.id)}
      className="cursor-pointer border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-light-bg)]"
    >
      <td className="px-4 py-4 text-center text-sm text-[var(--color-body)]">
        {c.category}
      </td>
      <td className="truncate px-4 py-4 text-sm font-medium text-[var(--color-dark)]">
        {c.title}
      </td>
      <td className="px-4 py-4 text-center text-sm text-[var(--color-body)]">
        {c.createdAt}
      </td>
      <td className="px-4 py-4 text-center">
        <StatusBadge status={c.status} />
      </td>
    </tr>
  );
}

/* Mobile card */
export function ExpertMobileCard({ consultation: c, onClick }: ExpertCardProps) {
  return (
    <div
      onClick={() => onClick(c.id)}
      className="cursor-pointer rounded-xl border border-[var(--color-border)] bg-white p-4 transition-colors hover:border-[var(--color-primary)]/30"
    >
      <div className="flex items-center gap-2">
        <StatusBadge status={c.status} />
        <span className="text-xs text-[var(--color-muted)]">{c.category}</span>
      </div>
      <h4 className="mt-2 line-clamp-1 font-medium text-[var(--color-dark)]">
        {c.title}
      </h4>
      <p className="mt-1 text-sm text-[var(--color-muted)]">{c.createdAt}</p>
    </div>
  );
}
