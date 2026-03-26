import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { resources } from "@/data/resources";

interface ResourceDetailProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ResourceDetailProps): Promise<Metadata> {
  const { id } = await params;
  const resource = resources.find((r) => r.id === Number(id));
  return {
    title: resource
      ? `${resource.title} | 자료실 | BIZSCHOOL`
      : "자료실 | BIZSCHOOL",
    description: resource?.title,
  };
}

export default async function ResourceDetailPage({
  params,
}: ResourceDetailProps) {
  const { id } = await params;
  const resource = resources.find((r) => r.id === Number(id));

  if (!resource) notFound();

  const downloadHref =
    resource.fileUrl === "#"
      ? "javascript:alert('준비 중입니다.')"
      : resource.fileUrl;

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 md:py-12">
      {/* Header */}
      <div className="border-b border-[var(--color-border)] pb-6">
        <span className="mb-3 inline-block text-sm text-[var(--color-muted)]">
          {resource.category}
        </span>
        <h1 className="text-xl font-bold text-[var(--color-dark)] md:text-2xl">
          {resource.title}
        </h1>
        <div className="mt-3 flex items-center gap-3 text-sm text-[var(--color-muted)]">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-white">
              B
            </span>
            <span>관리자</span>
          </div>
          <span>·</span>
          <span>{resource.createdAt.replace(/-/g, ".")}</span>
        </div>
      </div>

      {/* Content */}
      <div
        className="mt-8 space-y-4 text-sm leading-relaxed text-[var(--color-body)] md:text-base [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:text-[var(--color-body)] [&_strong]:font-bold [&_strong]:text-[var(--color-dark)]"
        dangerouslySetInnerHTML={{ __html: resource.content }}
      />

      {/* 파일 정보 + 다운로드 */}
      <div className="mt-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-light-bg)] p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-[var(--color-dark)]">
              {resource.fileName}
            </p>
            <p className="text-xs text-[var(--color-muted)]">
              {resource.fileType} · {resource.fileSize}
            </p>
          </div>
          <a
            href={downloadHref}
            download={resource.fileUrl !== "#" ? resource.fileName : undefined}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
          >
            <Download size={16} />
            다운로드
          </a>
        </div>
      </div>

      {/* 목록 버튼 */}
      <div className="mt-8 flex justify-center">
        <Link
          href="/resources"
          className="rounded-lg border border-[var(--color-border)] px-8 py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
        >
          목록으로
        </Link>
      </div>
    </div>
  );
}
