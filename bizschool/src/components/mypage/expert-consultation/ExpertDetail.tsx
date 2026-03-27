"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Bot,
  Eye,
  MessageCircle,
  User,
  Shield,
  ChevronDown,
  ChevronUp,
  FileText,
  HelpCircle,
  Scale,
  BookOpen,
} from "lucide-react";
import type { ExpertConsultation, ExpertAnswer, ExpertReply, AiAnswer, AiCitedBook, Book } from "@/types";
import { allBooks } from "@/data/books";
import BookPreviewModal from "@/components/books/BookPreviewModal";

interface ExpertDetailProps {
  consultation: ExpertConsultation;
  onBack: () => void;
}

function StatusBadge({ status }: { status: ExpertConsultation["status"] }) {
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

function AvatarIcon({ name, isExpert }: { name: string; isExpert?: boolean }) {
  const bgColor = isExpert ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]" : "bg-gray-100 text-gray-500";
  return (
    <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${bgColor}`}>
      <User size={18} />
    </div>
  );
}

function ExpertBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 rounded bg-[var(--color-primary-light)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--color-primary)]">
      <Shield size={10} />
      전문가
    </span>
  );
}

/* ── AI References (citations, related questions, related laws) ── */
function AiReferences({ aiAnswer, onBookPreview }: { aiAnswer: AiAnswer; onBookPreview: (book: AiCitedBook) => void }) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const hasCitations = aiAnswer.citations && aiAnswer.citations.length > 0;
  const hasBooks = aiAnswer.citedBooks && aiAnswer.citedBooks.length > 0;
  const hasQuestions = aiAnswer.relatedQuestions && aiAnswer.relatedQuestions.length > 0;
  const hasLaws = aiAnswer.relatedLaws && aiAnswer.relatedLaws.length > 0;

  if (!hasCitations && !hasBooks && !hasQuestions && !hasLaws) return null;

  return (
    <div className="mt-4 space-y-4">
      {/* 인용 문서 */}
      {hasCitations && (
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-light-bg)]">
          <button
            onClick={() => toggle("citations")}
            className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm font-bold text-[var(--color-dark)] transition-colors hover:bg-gray-50"
          >
            {openSections.citations ? <ChevronUp size={16} className="flex-shrink-0 text-[var(--color-muted)]" /> : <ChevronDown size={16} className="flex-shrink-0 text-[var(--color-muted)]" />}
            <FileText size={15} className="flex-shrink-0 text-[var(--color-primary)]" />
            인용 문서 ({aiAnswer.citations!.length}건)
          </button>
          {openSections.citations && (
            <div className="border-t border-[var(--color-border)] px-4 py-3">
              <ol className="space-y-1.5">
                {aiAnswer.citations!.map((c, i) => (
                  <li key={i} className="text-sm text-[var(--color-body)]">
                    <span className="mr-1.5 text-[var(--color-primary)]">[{i + 1}]</span>
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] underline hover:opacity-80">
                        {c.title}
                      </a>
                    ) : (
                      <span>{c.title}</span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* 인용 도서 */}
      {hasBooks && (
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-light-bg)]">
          <button
            onClick={() => toggle("books")}
            className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm font-bold text-[var(--color-dark)] transition-colors hover:bg-gray-50"
          >
            {openSections.books ? <ChevronUp size={16} className="flex-shrink-0 text-[var(--color-muted)]" /> : <ChevronDown size={16} className="flex-shrink-0 text-[var(--color-muted)]" />}
            <BookOpen size={15} className="flex-shrink-0 text-[var(--color-primary)]" />
            인용 도서 ({aiAnswer.citedBooks!.length}건)
          </button>
          {openSections.books && (
            <div className="border-t border-[var(--color-border)] px-4 py-3 space-y-3">
              {aiAnswer.citedBooks!.map((book, i) => (
                <div key={i} className="flex gap-3">
                  <a href={`/books/${book.bookId}`} className="flex-shrink-0">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="h-20 w-14 rounded border border-[var(--color-border)] object-cover transition-opacity hover:opacity-80"
                    />
                  </a>
                  <div className="flex-1 min-w-0">
                    <a href={`/books/${book.bookId}`} className="text-sm font-medium text-[var(--color-dark)] hover:text-[var(--color-primary)] transition-colors">
                      {book.title}
                    </a>
                    <p className="mt-0.5 text-xs text-[var(--color-muted)]">{book.author}</p>
                    <p className="mt-1 text-xs text-[var(--color-body)]">
                      p.{book.pageFrom}~{book.pageTo} | {book.excerpt}
                    </p>
                    <button
                      onClick={() => onBookPreview(book)}
                      className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-primary)] hover:underline"
                    >
                      <FileText size={11} />
                      발췌 미리보기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 관련 질문 */}
      {hasQuestions && (
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-light-bg)]">
          <button
            onClick={() => toggle("questions")}
            className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm font-bold text-[var(--color-dark)] transition-colors hover:bg-gray-50"
          >
            {openSections.questions ? <ChevronUp size={16} className="flex-shrink-0 text-[var(--color-muted)]" /> : <ChevronDown size={16} className="flex-shrink-0 text-[var(--color-muted)]" />}
            <HelpCircle size={15} className="flex-shrink-0 text-[var(--color-primary)]" />
            관련 질문 ({aiAnswer.relatedQuestions!.length}건)
          </button>
          {openSections.questions && (
            <div className="border-t border-[var(--color-border)] px-4 py-3">
              <ul className="space-y-1.5">
                {aiAnswer.relatedQuestions!.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-body)]">
                    <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[var(--color-dark)]" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 관련 법령 */}
      {hasLaws && (
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-light-bg)]">
          <button
            onClick={() => toggle("laws")}
            className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm font-bold text-[var(--color-dark)] transition-colors hover:bg-gray-50"
          >
            {openSections.laws ? <ChevronUp size={16} className="flex-shrink-0 text-[var(--color-muted)]" /> : <ChevronDown size={16} className="flex-shrink-0 text-[var(--color-muted)]" />}
            <Scale size={15} className="flex-shrink-0 text-[var(--color-primary)]" />
            관련 법령 ({aiAnswer.relatedLaws!.length}건)
          </button>
          {openSections.laws && (
            <div className="border-t border-[var(--color-border)] px-4 py-3">
              <ul className="space-y-1.5">
                {aiAnswer.relatedLaws!.map((law, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-body)]">
                    <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[var(--color-dark)]" />
                    {law}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Reply item ── */
function ReplyItem({ reply }: { reply: ExpertReply }) {
  return (
    <div className="flex gap-3 border-t border-gray-100 pt-3">
      <AvatarIcon name={reply.authorName} isExpert={reply.isExpert} />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--color-dark)]">
            {reply.authorName}
          </span>
          {reply.isExpert && <ExpertBadge />}
          <span className="text-xs text-[var(--color-muted)]">
            {reply.repliedAt}
          </span>
        </div>
        <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-[var(--color-body)]">
          {reply.content}
        </p>
      </div>
    </div>
  );
}

/* ── Answer card ── */
function AnswerCard({
  answer,
  onAddReply,
}: {
  answer: ExpertAnswer;
  onAddReply: (answerId: string, content: string) => void;
}) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(true);

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    onAddReply(answer.id, replyText.trim());
    setReplyText("");
    setShowReplyInput(false);
  };

  const replyCount = answer.replies?.length ?? 0;

  return (
    <div className="border-b border-[var(--color-border)] pb-5">
      {/* Answer header */}
      <div className="flex gap-3">
        <AvatarIcon name={answer.expertName} isExpert />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[var(--color-dark)]">
              {answer.expertName}
            </span>
            <ExpertBadge />
          </div>
          <p className="mt-0.5 text-xs text-[var(--color-muted)]">
            {answer.answeredAt}
          </p>
        </div>
      </div>

      {/* Answer content */}
      <div className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-[var(--color-dark)]">
        {answer.content}
      </div>

      {/* Action buttons */}
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={() => setShowReplyInput(!showReplyInput)}
          className="flex items-center gap-1 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)]"
        >
          <MessageCircle size={14} />
          답글
        </button>
        {replyCount > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)]"
          >
            {showReplies ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            답글 {replyCount}개
          </button>
        )}
      </div>

      {/* Replies */}
      {showReplies && replyCount > 0 && (
        <div className="ml-6 mt-3 space-y-3 border-l-2 border-gray-100 pl-4">
          {answer.replies!.map((r) => (
            <ReplyItem key={r.id} reply={r} />
          ))}
        </div>
      )}

      {/* Reply input */}
      {showReplyInput && (
        <div className="mt-3 ml-6 flex gap-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmitReply()}
            placeholder="답글을 입력하세요..."
            className="flex-1 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none"
          />
          <button
            onClick={handleSubmitReply}
            disabled={!replyText.trim()}
            className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
          >
            등록
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Main component ── */
export default function ExpertDetail({
  consultation: initialData,
  onBack,
}: ExpertDetailProps) {
  const [consultation, setConsultation] = useState(initialData);
  const [newAnswer, setNewAnswer] = useState("");
  const [previewBook, setPreviewBook] = useState<{ book: Book; pageRange: { from: number; to: number } } | null>(null);

  const handleBookPreview = (cited: AiCitedBook) => {
    const book = allBooks.find((b) => b.id === cited.bookId);
    if (book?.preview) {
      setPreviewBook({ book, pageRange: { from: cited.pageFrom, to: cited.pageTo } });
    }
  };

  const allAnswers = consultation.answers ?? [];
  const answerCount = allAnswers.length + (consultation.aiAnswer ? 1 : 0);

  // Merge AI + expert answers into unified list sorted by latest first
  type UnifiedAnswer = { type: "ai"; sortKey: string } | { type: "expert"; answer: ExpertAnswer; sortKey: string };
  const unifiedAnswers: UnifiedAnswer[] = [];

  if (consultation.aiAnswer) {
    const aiSortKey = `${consultation.aiAnswer.answeredAt} ${consultation.aiAnswer.answeredTime ?? "00:00"}`;
    unifiedAnswers.push({ type: "ai", sortKey: aiSortKey });
  }
  for (const a of allAnswers) {
    unifiedAnswers.push({ type: "expert", answer: a, sortKey: a.answeredAt });
  }
  unifiedAnswers.sort((a, b) => b.sortKey.localeCompare(a.sortKey));

  const handleAddReply = (answerId: string, content: string) => {
    setConsultation((prev) => {
      const newReply: ExpertReply = {
        id: `er-${Date.now()}`,
        authorName: "김비즈",
        isExpert: false,
        content,
        repliedAt: new Date().toLocaleString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }).replace(/\. /g, ".").replace(/\./g, "."),
      };

      const updatedAnswers = (prev.answers ?? []).map((a) =>
        a.id === answerId
          ? { ...a, replies: [...(a.replies ?? []), newReply] }
          : a
      );

      return { ...prev, answers: updatedAnswers };
    });
  };

  const handleSubmitAnswer = () => {
    if (!newAnswer.trim()) return;

    const answer: ExpertAnswer = {
      id: `ea-${Date.now()}`,
      expertName: "김비즈",
      expertTitle: "회원",
      content: newAnswer.trim(),
      answeredAt: new Date().toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).replace(/\. /g, ".").replace(/\./g, "."),
    };

    setConsultation((prev) => ({
      ...prev,
      answers: [...(prev.answers ?? []), answer],
    }));
    setNewAnswer("");
  };

  return (
    <div>
      {/* ── Title ── */}
      <h2 className="text-xl font-bold text-[var(--color-dark)]">
        {consultation.title}
      </h2>

      {/* ── Meta: badge + date + time + author + views ── */}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[var(--color-muted)]">
        <StatusBadge status={consultation.status} />
        <span>
          {consultation.createdAt}
          {consultation.createdTime && ` ${consultation.createdTime}`} 작성
        </span>
        <span className="inline-flex items-center gap-1">
          <Eye size={14} />
          {consultation.viewCount}
        </span>
      </div>

      {/* ── Separator ── */}
      <hr className="my-5 border-[var(--color-border)]" />

      {/* ── Question body with author info ── */}
      <div className="flex gap-3">
        <AvatarIcon name={consultation.author} />
        <div className="flex-1">
          <span className="text-sm font-medium text-[var(--color-dark)]">
            {consultation.author}
          </span>
          <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-[var(--color-dark)]">
            {consultation.content}
          </p>
        </div>
      </div>

      {/* ── Separator ── */}
      <hr className="my-6 border-[var(--color-border)]" />

      {/* ── Answers header ── */}
      <h3 className="text-base font-bold text-[var(--color-dark)]">
        답변 {answerCount}
      </h3>

      {/* ── Write answer ── */}
      <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-white p-4">
        <textarea
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder={`${consultation.author}님, 답변을 작성해보세요.`}
          className="min-h-[80px] w-full resize-none text-sm text-[var(--color-dark)] placeholder:text-[var(--color-muted)] focus:outline-none"
        />
        <div className="flex justify-end">
          <button
            onClick={handleSubmitAnswer}
            disabled={!newAnswer.trim()}
            className="rounded-lg bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            답변 등록
          </button>
        </div>
      </div>

      {/* ── Answers (AI + Expert merged, sorted by latest) ── */}
      <div className="mt-5 space-y-5">
        {unifiedAnswers.map((item, idx) =>
          item.type === "ai" && consultation.aiAnswer ? (
            <div key="ai-answer">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                  <Bot size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--color-dark)]">
                      비즈스쿨 AI 어시스턴트
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                    {consultation.aiAnswer.answeredAt}
                    {consultation.aiAnswer.answeredTime && ` ${consultation.aiAnswer.answeredTime}`}
                  </p>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-[var(--color-dark)]">
                {consultation.aiAnswer.content}
              </p>
              <AiReferences aiAnswer={consultation.aiAnswer} onBookPreview={handleBookPreview} />
              <hr className="mt-4 border-[var(--color-border)]" />
            </div>
          ) : item.type === "expert" ? (
            <AnswerCard key={item.answer.id} answer={item.answer} onAddReply={handleAddReply} />
          ) : null
        )}
      </div>

      {/* ── Waiting message ── */}
      {answerCount === 0 && (
        <div className="mt-6 rounded-2xl bg-[var(--color-light-bg)] p-6 text-center">
          <Clock size={24} className="mx-auto text-[var(--color-muted)]" />
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            담당 전문가가 답변을 준비 중입니다. 빠른 시일 내에 답변
            드리겠습니다.
          </p>
        </div>
      )}

      {/* ── Back button ── */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={onBack}
          className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-6 py-2.5 text-sm font-medium text-[var(--color-body)] transition-colors hover:bg-[var(--color-light-bg)]"
        >
          <ArrowLeft size={16} />
          상담 목록
        </button>
      </div>

      {/* ── Book Preview Modal ── */}
      {previewBook && (
        <BookPreviewModal
          book={previewBook.book}
          onClose={() => setPreviewBook(null)}
          pageRange={previewBook.pageRange}
        />
      )}
    </div>
  );
}
