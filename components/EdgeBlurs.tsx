"use client";
import { usePathname } from "next/navigation";

export default function EdgeBlurs() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-16 bg-gradient-to-b from-deep-bg to-transparent pointer-events-none z-[40]" />
      <div className="fixed bottom-0 left-0 w-full h-16 bg-gradient-to-t from-deep-bg to-transparent pointer-events-none z-[40]" />
    </>
  );
}
