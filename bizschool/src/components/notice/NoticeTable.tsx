import Link from "next/link";
import type { Notice } from "@/types";

interface NoticeTableProps {
  notices: Notice[];
}

function formatDate(dateStr: string) {
  return dateStr.replace(/-/g, ".");
}

export default function NoticeTable({ notices }: NoticeTableProps) {
  if (notices.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-medium text-[var(--color-muted)]">
          등록된 공지사항이 없습니다
        </p>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          새로운 소식이 등록되면 이곳에 표시됩니다
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop: 테이블 */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-fixed text-sm">
          <colgroup>
            <col className="w-[15%]" />
            <col className="w-[60%]" />
            <col className="w-[25%]" />
          </colgroup>
          <thead>
            <tr className="bg-[var(--color-light-bg)]">
              <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                번호
              </th>
              <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                제목
              </th>
              <th className="px-4 py-3 text-center font-medium text-[var(--color-muted)]">
                작성일
              </th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice) => (
              <tr
                key={notice.id}
                className="border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-light-bg)]"
              >
                <td className="px-4 py-4 text-center">
                  {notice.isImportant ? (
                    <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-500">
                      중요
                    </span>
                  ) : (
                    <span className="text-[var(--color-muted)]">{notice.id}</span>
                  )}
                </td>
                <td className="py-4 pl-24 pr-4">
                  <Link
                    href={`/notice/${notice.id}`}
                    className={`hover:underline ${
                      notice.isImportant
                        ? "font-bold text-[var(--color-dark)]"
                        : "text-[var(--color-body)]"
                    }`}
                  >
                    {notice.title}
                  </Link>
                </td>
                <td className="px-4 py-4 text-center text-[var(--color-body)]">
                  {formatDate(notice.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: 카드 */}
      <div className="space-y-3 md:hidden">
        {notices.map((notice) => (
          <Link
            key={notice.id}
            href={`/notice/${notice.id}`}
            className="block rounded-xl border border-[var(--color-border)] bg-white p-4 transition-colors hover:bg-[var(--color-light-bg)]"
          >
            <div
              className={
                notice.isImportant
                  ? "font-bold text-[var(--color-dark)]"
                  : "font-medium text-[var(--color-dark)]"
              }
            >
              {notice.isImportant && (
                <span className="mr-1.5 inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-500">
                  중요
                </span>
              )}
              {notice.title}
            </div>
            <p className="mt-2 text-xs text-[var(--color-muted)]">
              {formatDate(notice.createdAt)}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
