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
      <div className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)]">
        {paginatedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <CommunityPagination currentPage={page} totalPages={totalPages} currentTab="discussion" />
    </div>
  );
}
