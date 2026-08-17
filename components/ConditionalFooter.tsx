"use client";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Don't show footer on home page (has its own integrated footer) or dashboard
  if (pathname === "/" || pathname.startsWith("/dashboard")) {
    return null;
  }

  return <Footer />;
}
