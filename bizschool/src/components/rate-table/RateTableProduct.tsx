"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { MEMBER_NOTE, type ProductType } from "@/data/rate-table";
import ImageLightbox from "./ImageLightbox";

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR") + "원";
}

function TypeSection({
  productId,
  productType,
  productName,
}: {
  productId: string;
  productType: ProductType;
  productName: string;
}) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isMember, setIsMember] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const selected = productType.prices[selectedIdx];
  const radioName = `qty-${productId}-${productType.type}`;

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Type header */}
      <div className="mb-4">
        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
          {productType.label}
        </span>
        <p className="mt-2 text-sm text-gray-500">{productType.description}</p>
      </div>

      {/* Product image (clickable) */}
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="group relative mb-5 w-full cursor-pointer overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-md"
        aria-label={`${productType.label} 이미지 확대 보기`}
      >
        <img
          src={productType.image}
          alt={`${productType.label} 미리보기`}
          className="h-auto w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
          <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 opacity-0 shadow transition-opacity group-hover:opacity-100">
            <Search size={14} />
            확대 보기
          </span>
        </div>
      </button>

      {/* Price table */}
      <table className="mb-5 w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2 text-left font-medium">수량</th>
            <th className="py-2 text-right font-medium">회원가</th>
            <th className="py-2 text-right font-medium">비회원가</th>
          </tr>
        </thead>
        <tbody>
          {productType.prices.map((option, idx) => (
            <tr
              key={option.quantity}
              className={`cursor-pointer border-b border-gray-100 transition-colors ${
                idx === selectedIdx ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedIdx(idx)}
            >
              <td className="py-3">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name={radioName}
                    checked={idx === selectedIdx}
                    onChange={() => setSelectedIdx(idx)}
                    className="h-4 w-4 accent-blue-600"
                  />
                  <span className="font-medium text-gray-800">
                    {option.quantity}
                  </span>
                </label>
              </td>
              <td className="py-3 text-right font-semibold text-blue-700">
                {formatPrice(option.memberPrice)}
              </td>
              <td className="py-3 text-right text-gray-500">
                {formatPrice(option.nonMemberPrice)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Selected summary + CTA */}
      <div className="mt-auto rounded-xl bg-gray-50 p-4">
        {/* Member / Non-member toggle */}
        <div className="mb-3 flex overflow-hidden rounded-lg border border-gray-200 text-sm">
          <button
            type="button"
            className={`flex-1 py-2 font-medium transition-colors ${
              isMember
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
            onClick={() => setIsMember(true)}
          >
            회원
          </button>
          <button
            type="button"
            className={`flex-1 py-2 font-medium transition-colors ${
              !isMember
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
            onClick={() => setIsMember(false)}
          >
            비회원
          </button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            선택:{" "}
            <strong className="text-gray-800">{selected.quantity}</strong>
          </span>
          <div className="text-right">
            <p className="text-xs text-gray-400">
              {isMember ? "회원가" : "비회원가"}
            </p>
            <p
              className={`text-lg font-bold ${isMember ? "text-blue-700" : "text-gray-700"}`}
            >
              {formatPrice(
                isMember ? selected.memberPrice : selected.nonMemberPrice,
              )}
            </p>
          </div>
        </div>
        <button className="mt-3 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800">
          신청하기
        </button>
      </div>

      <ImageLightbox
        src={productType.image}
        alt={`${productName} - ${productType.label}`}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}

interface RateTableProductProps {
  id: string;
  name: string;
  description: string;
  spec: string;
  types: ProductType[];
}

export default function RateTableProduct({
  id,
  name,
  description,
  spec,
  types,
}: RateTableProductProps) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold text-gray-900 md:text-2xl">{name}</h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        {description}
      </p>
      <p className="mt-1 text-xs text-gray-400">규격: {spec}</p>
      <p className="mt-1 text-xs text-gray-400">
        회원 기준: {MEMBER_NOTE}
      </p>

      <div className="mt-6 grid items-stretch gap-6 md:grid-cols-2">
        {types.map((t) => (
          <TypeSection
            key={t.type}
            productId={id}
            productType={t}
            productName={name}
          />
        ))}
      </div>
    </section>
  );
}
