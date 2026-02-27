import PostCard from "./PostCard";
import CommunityPagination from "./CommunityPagination";
import { consultationCases, POSTS_PER_PAGE } from "@/data/community";

interface CasesTabProps {
  page: number;
}

export default function CasesTab({ page }: CasesTabProps) {
  const totalPosts = consultationCases.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const paginatedPosts = consultationCases.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div>
      <p className="py-3 text-sm text-[var(--color-muted)]">총 {totalPosts}개의 상담사례</p>
      <div className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
        {paginatedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <CommunityPagination currentPage={page} totalPages={totalPages} currentTab="cases" />
    </div>
  );
}
