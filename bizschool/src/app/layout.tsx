import type { Metadata } from "next";
import { Squada_One, Noto_Sans_KR } from "next/font/google";
import Header from "@/components/layout/Header";
import SearchBar from "@/components/layout/SearchBar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const squadaOne = Squada_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-squada-one",
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BIZSCHOOL - 비즈니스 성장을 위한 온라인 교육 플랫폼",
  description:
    "전문가가 직접 전하는 실무 중심의 강의와 도서. BIZSCHOOL에서 비즈니스 역량을 키워보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${squadaOne.variable} ${notoSansKR.variable} antialiased`}>
        <Header />
        <SearchBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
