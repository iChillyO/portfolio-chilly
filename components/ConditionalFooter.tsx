"use client";
import { usePathname } from "next/navigation";

export default function ConditionalFooter() {
    const pathname = usePathname();

    // The footer info is now integrated directly into the home page.
    // We return null here to avoid double footers or extra scrolling.
    return null;
}
