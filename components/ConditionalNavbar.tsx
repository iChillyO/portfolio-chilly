"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar"; // Make sure this path points to your real Navbar

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // If we are on the admin page, return NOTHING (null)
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  // Otherwise, show the Navbar as normal
  return <Navbar />;
}