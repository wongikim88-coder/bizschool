"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import SearchBar from "@/components/layout/SearchBar";
import Footer from "@/components/layout/Footer";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isConsulting = pathname === "/consulting";
  const hideSearchBar = isConsulting || pathname === "/about" || pathname === "/directions";

  return (
    <>
      <Header />
      {!hideSearchBar && (
        <Suspense>
          <SearchBar />
        </Suspense>
      )}
      <main>{children}</main>
      {!isConsulting && <Footer />}
    </>
  );
}
