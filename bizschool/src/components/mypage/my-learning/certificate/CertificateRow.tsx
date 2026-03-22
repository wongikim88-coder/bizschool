"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import type { CertificateCourse } from "@/types";
import { generateCertificatePdf } from "./generateCertificatePdf";

interface CertificateRowProps {
  course: CertificateCourse;
  userName: string;
}

export default function CertificateRow({ course, userName }: CertificateRowProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generateCertificatePdf({
        userName,
        courseTitle: course.title,
        periodLabel: course.periodLabel,
        courseId: course.id,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex items-center gap-4 py-4">
      {/* Thumbnail */}
      <div className="h-[60px] w-[60px] flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {/* Title */}
      <p className="flex-1 text-sm font-medium leading-snug text-[var(--color-dark)] line-clamp-2">
        {course.title}
      </p>

      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="flex-shrink-0 cursor-pointer rounded-lg p-2 transition-colors hover:bg-[var(--color-light-bg)] disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`${course.title} 수료증 다운로드`}
      >
        {isGenerating ? (
          <Loader2 size={20} className="animate-spin text-[var(--color-muted)]" />
        ) : (
          <Download size={20} className="text-[var(--color-muted)]" />
        )}
      </button>
    </div>
  );
}
