"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import type { MeetingRequest, MeetingTopic, MeetingRequestStatus } from "@/types";
import { meetingRequests as initialRequests } from "@/data/expertStudio";

const topics: MeetingTopic[] = ["콘텐츠 전략", "수익 개선", "강의 품질", "기타"];

const meetingStatusConfig: Record<
  MeetingRequestStatus,
  { bg: string; text: string }
> = {
  검토중: { bg: "bg-gray-100", text: "text-gray-600" },
  확정됨: { bg: "bg-blue-50", text: "text-blue-600" },
  완료: { bg: "bg-green-50", text: "text-green-600" },
};

export default function StudioMeeting() {
  const [requests, setRequests] = useState<MeetingRequest[]>(initialRequests);
  const [selectedTopic, setSelectedTopic] = useState<MeetingTopic>("콘텐츠 전략");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferredDate || !message.trim()) {
      window.alert("희망 일자와 요청 내용을 모두 입력해 주세요.");
      return;
    }

    const newRequest: MeetingRequest = {
      id: `m-${Date.now()}`,
      topic: selectedTopic,
      preferredDate,
      message: message.trim(),
      requestedAt: new Date().toISOString().split("T")[0],
      status: "검토중",
    };

    setRequests((prev) => [newRequest, ...prev]);
    setSelectedTopic("콘텐츠 전략");
    setPreferredDate("");
    setMessage("");
    window.alert("미팅 요청이 등록되었습니다.");
  };

  return (
    <div className="space-y-6">
      {/* Request Form */}
      <div className="rounded-xl border border-[var(--color-border)] bg-white p-5">
        <h2 className="mb-4 text-lg font-bold text-[var(--color-dark)]">
          미팅 요청
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Topic */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-dark)]">
              주제 선택
            </label>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setSelectedTopic(topic)}
                  className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                    selectedTopic === topic
                      ? "bg-[var(--color-primary)] font-medium text-white"
                      : "border border-[var(--color-border)] text-[var(--color-body)] hover:bg-[var(--color-light-bg)]"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-dark)]">
              희망 일자
            </label>
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              min={today}
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-body)] focus:border-[var(--color-primary)] focus:outline-none md:w-auto"
            />
          </div>

          {/* Message */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-dark)]">
              요청 내용
            </label>
            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value.slice(0, 500))
              }
              placeholder="상담하고 싶은 내용을 작성해 주세요..."
              rows={4}
              className="w-full resize-none rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-body)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none"
            />
            <p className="mt-1 text-right text-xs text-[var(--color-muted)]">
              {message.length}/500
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
            >
              <Send size={14} />
              미팅 요청하기
            </button>
          </div>
        </form>
      </div>

      {/* Request History */}
      <div className="rounded-xl border border-[var(--color-border)] bg-white">
        <div className="border-b border-[var(--color-border)] px-5 py-4">
          <h2 className="font-bold text-[var(--color-dark)]">요청 내역</h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-light-bg)]">
                <th className="px-5 py-3 text-left font-medium text-[var(--color-muted)]">
                  요청일
                </th>
                <th className="px-5 py-3 text-left font-medium text-[var(--color-muted)]">
                  주제
                </th>
                <th className="px-5 py-3 text-center font-medium text-[var(--color-muted)]">
                  희망일자
                </th>
                <th className="px-5 py-3 text-center font-medium text-[var(--color-muted)]">
                  상태
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => {
                const config = meetingStatusConfig[req.status];
                return (
                  <tr
                    key={req.id}
                    className="border-b border-[var(--color-border)] last:border-b-0"
                  >
                    <td className="px-5 py-3 text-[var(--color-body)]">
                      {req.requestedAt}
                    </td>
                    <td className="px-5 py-3 text-[var(--color-body)]">
                      {req.topic}
                    </td>
                    <td className="px-5 py-3 text-center text-[var(--color-muted)]">
                      {req.preferredDate}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
                      >
                        {req.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y divide-[var(--color-border)] md:hidden">
          {requests.map((req) => {
            const config = meetingStatusConfig[req.status];
            return (
              <div key={req.id} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[var(--color-dark)]">
                    {req.topic}
                  </p>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
                  >
                    {req.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  요청일: {req.requestedAt} · 희망: {req.preferredDate}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
