import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { notices, getSortedNotices } from "@/data/notice";

interface NoticeDetailProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: NoticeDetailProps): Promise<Metadata> {
  const { id } = await params;
  const notice = notices.find((n) => n.id === Number(id));
  return {
    title: notice ? `${notice.title} | BIZSCHOOL` : "공지사항 | BIZSCHOOL",
    description: notice?.title,
  };
}

export default async function NoticeDetailPage({ params }: NoticeDetailProps) {
  const { id } = await params;
  const notice = notices.find((n) => n.id === Number(id));

  if (!notice) notFound();

  // 이전글/다음글 계산 (정렬된 목록 기준)
  const sorted = getSortedNotices(notices);
  const currentIndex = sorted.findIndex((n) => n.id === notice.id);
  const prevNotice = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  const nextNotice =
    currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 md:py-12">
      {/* Header */}
      <div className="border-b border-[var(--color-border)] pb-6">
        {notice.isImportant && (
          <span className="mb-3 inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-500">
            중요
          </span>
        )}
        <h1 className="text-xl font-bold text-[var(--color-dark)] md:text-2xl">
          {notice.title}
        </h1>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          {notice.createdAt.replace(/-/g, ".")}
        </p>
      </div>

      {/* Content */}
      <div
        className="mt-8 space-y-4 text-sm leading-relaxed text-[var(--color-body)] md:text-base [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_strong]:font-bold [&_strong]:text-[var(--color-dark)]"
        dangerouslySetInnerHTML={{ __html: notice.content }}
      />

      {/* Prev/Next Navigation */}
      {(prevNotice || nextNotice) && (
        <div className="mt-10 divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
          {prevNotice && (
            <Link
              href={`/notice/${prevNotice.id}`}
              className="flex items-center gap-3 px-5 py-4 text-sm transition-colors hover:bg-[var(--color-light-bg)]"
            >
              <span className="shrink-0 text-xs font-medium text-[var(--color-muted)]">
                △ 이전글
              </span>
              <span className="truncate text-[var(--color-body)]">
                {prevNotice.title}
              </span>
            </Link>
          )}
          {nextNotice && (
            <Link
              href={`/notice/${nextNotice.id}`}
              className="flex items-center gap-3 px-5 py-4 text-sm transition-colors hover:bg-[var(--color-light-bg)]"
            >
              <span className="shrink-0 text-xs font-medium text-[var(--color-muted)]">
                ▽ 다음글
              </span>
              <span className="truncate text-[var(--color-body)]">
                {nextNotice.title}
              </span>
            </Link>
          )}
        </div>
      )}

      {/* 목록 버튼 */}
      <div className="mt-6 flex justify-center">
        <Link
          href="/notice"
          className="rounded-lg border border-[var(--color-border)] px-8 py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
        >
          목록으로
        </Link>
      </div>
    </div>
  );
}
