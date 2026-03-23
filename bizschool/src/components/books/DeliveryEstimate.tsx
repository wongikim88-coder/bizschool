"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

function getEstimatedArrival(from: Date): Date {
  const dayOfWeek = from.getDay();
  const hour = from.getHours();
  const result = new Date(from);

  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    // 평일
    if (hour < 12) {
      // 정오 이전 → 당일 배송
      // result는 오늘 그대로
    } else if (dayOfWeek === 5) {
      // 금요일 정오 이후 → 월요일
      result.setDate(result.getDate() + 3);
    } else {
      // 월~목 정오 이후 → 내일
      result.setDate(result.getDate() + 1);
    }
  } else if (dayOfWeek === 6) {
    // 토요일 → 월요일
    result.setDate(result.getDate() + 2);
  } else {
    // 일요일 → 월요일
    result.setDate(result.getDate() + 1);
  }
  return result;
}

function getRelativeLabel(today: Date, target: Date): string {
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const targetDate = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const diffDays = Math.round(
    (targetDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays <= 0) return "오늘";
  if (diffDays === 1) return "내일";
  if (diffDays === 2) return "모레";
  return `${diffDays}일 후`;
}

export default function DeliveryEstimate() {
  const [isOpen, setIsOpen] = useState(false);

  const now = new Date();
  const arrival = getEstimatedArrival(now);
  const month = arrival.getMonth() + 1;
  const date = arrival.getDate();
  const day = DAY_NAMES[arrival.getDay()];
  const label = getRelativeLabel(now, arrival);

  return (
    <>
      <p className="mt-1.5 flex items-center gap-0.5 text-sm text-[var(--color-dark)]">
        {label}({month}/{date},{day}) 출고 예정
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center justify-center rounded-full text-[var(--color-muted)] transition-colors hover:text-[var(--color-dark)]"
          aria-label="출고 예정일 안내"
        >
          <Info size={16} />
        </button>
      </p>

      {/* 지역별 도착 예정일 모달 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setIsOpen(false)}>
          <div
            className="mx-4 max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--color-dark)]">출고 예정일 안내</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-light-bg)]"
                aria-label="닫기"
              >
                <X size={18} />
              </button>
            </div>

            {/* 배송 일정 */}
            <div className="mt-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-t border-[var(--color-border)]">
                    <th className="py-2 text-center font-medium text-[var(--color-muted)]">결제 완료 시간</th>
                    <th className="py-2 text-center font-medium text-[var(--color-muted)]">출고예정일</th>
                  </tr>
                </thead>
                <tbody className="text-[var(--color-body)]">
                  <tr><td colSpan={2} className="pt-4 pb-1 font-bold text-[var(--color-dark)]">평일</td></tr>
                  <tr>
                    <td className="py-1 pl-2">· 0시~12시</td>
                    <td className="py-1 pl-2">· 당일 출고</td>
                  </tr>
                  <tr>
                    <td className="py-1 pl-2">· 12시 이후</td>
                    <td className="py-1 pl-2">· 익일 출고</td>
                  </tr>
                  <tr><td colSpan={2} className="pt-4 pb-1 font-bold text-[var(--color-dark)]">토요일·일요일</td></tr>
                  <tr>
                    <td className="py-1 pl-2">· 전체</td>
                    <td className="py-1 pl-2">· 월요일 출고</td>
                  </tr>
                  <tr><td colSpan={2} className="pt-4 pb-1 font-bold text-[var(--color-dark)]">공휴일</td></tr>
                  <tr>
                    <td className="py-1 pl-2">· 전체</td>
                    <td className="py-1 pl-2">· 익영업일 출고</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 배송 유의사항 */}
            <div className="mt-6">
              <h4 className="text-sm font-bold text-[var(--color-dark)]">배송 유의사항</h4>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[var(--color-muted)]">
                <li>· 평일 정오(12시) 이전 결제 시 당일 출고, 정오 이후 결제 시 익일 출고됩니다. 주말 결제 시 월요일, 공휴일 결제 시 익영업일에 출고됩니다.</li>
                <li>· 주문 후 배송지를 변경하면, 변경된 주소에 따라 출고 예정일이 변경될 수 있습니다.</li>
                <li>· 기상악화, 교통상황 악화, 배송사 사정 등으로 배송이 지연될 수 있습니다.</li>
                <li>· 출고 예정일이 5일 이상인 상품(결제일 기준 7일 이내 미입고)은 출판사 및 유통사 사정으로 품절/절판될 수 있습니다. 이 경우 등록하신 연락수단(카카오톡, 이메일, 전화 등)으로 안내해 드립니다.</li>


                <li>· 제주도는 1일, 도서·산간 지역(울릉도, 섬 지역 등)은 1~2일 추가 소요될 수 있습니다.</li>
                <li>· 설, 추석 연휴 기간에는 배송이 지연될 수 있습니다.</li>
              </ul>
            </div>

            {/* 확인 버튼 */}
            <button
              onClick={() => setIsOpen(false)}
              className="mt-5 w-full rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
