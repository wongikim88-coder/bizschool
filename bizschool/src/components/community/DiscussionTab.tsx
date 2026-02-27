import { Pencil } from "lucide-react";
import PostCard from "./PostCard";
import CommunityPagination from "./CommunityPagination";
import { discussionPosts, POSTS_PER_PAGE } from "@/data/community";

interface DiscussionTabProps {
  page: number;
}

export default function DiscussionTab({ page }: DiscussionTabProps) {
  const totalPosts = discussionPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const paginatedPosts = discussionPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div>
      <div className="flex items-center justify-between py-3">
        <p className="text-sm text-[var(--color-muted)]">총 {totalPosts}개의 게시글</p>
        <button
          aria-label="새 글 작성"
          className="flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)]"
        >
          <Pencil size={14} />
          글쓰기
        </button>
      </div>
      <div className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
        {paginatedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <CommunityPagination currentPage={page} totalPages={totalPages} currentTab="discussion" />
    </div>
  );
}
