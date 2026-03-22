"use client";

import { Download, FileText, FileSpreadsheet, FileArchive, Presentation } from "lucide-react";
import type { CourseMaterial } from "@/types";

interface CourseMaterialListProps {
  materials: CourseMaterial[];
}

const fileTypeConfig: Record<
  CourseMaterial["fileType"],
  { icon: typeof FileText; color: string; bg: string }
> = {
  PDF: { icon: FileText, color: "text-red-500", bg: "bg-red-50" },
  XLSX: { icon: FileSpreadsheet, color: "text-green-600", bg: "bg-green-50" },
  HWP: { icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
  PPTX: { icon: Presentation, color: "text-orange-500", bg: "bg-orange-50" },
  ZIP: { icon: FileArchive, color: "text-purple-500", bg: "bg-purple-50" },
};

function formatDate(dateStr: string) {
  return dateStr.replace(/-/g, ".");
}

export default function CourseMaterialList({ materials }: CourseMaterialListProps) {
  if (materials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FileText size={40} className="text-[var(--color-border)]" />
        <p className="mt-3 text-sm font-medium text-[var(--color-muted)]">
          등록된 강의자료가 없습니다
        </p>
      </div>
    );
  }

  const handleDownload = (material: CourseMaterial) => {
    if (material.fileUrl === "#") {
      alert(`"${material.fileName}" 파일은 준비 중입니다.`);
      return;
    }
    window.open(material.fileUrl, "_blank");
  };

  return (
    <div className="px-4 py-3">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-[var(--color-muted)]">
          총 {materials.length}개 파일
        </span>
      </div>

      <div className="space-y-2">
        {materials.map((material) => {
          const config = fileTypeConfig[material.fileType];
          const Icon = config.icon;

          return (
            <div
              key={material.id}
              className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-white p-3 transition-colors hover:bg-[var(--color-light-bg)]"
            >
              {/* File icon + type */}
              <div className={`flex shrink-0 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 ${config.bg}`}>
                <Icon size={20} className={config.color} />
                <span className={`text-[10px] font-bold leading-none ${config.color}`}>
                  {material.fileType}
                </span>
              </div>

              {/* File info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--color-dark)]">
                  {material.title}
                </p>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                  <span>{material.fileSize}</span>
                  <span>·</span>
                  <span>{formatDate(material.uploadedAt)}</span>
                </div>
              </div>

              {/* Download button */}
              <button
                onClick={() => handleDownload(material)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
                aria-label={`${material.fileName} 다운로드`}
              >
                <Download size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
