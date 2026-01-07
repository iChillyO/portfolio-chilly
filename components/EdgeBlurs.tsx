"use client";
import { usePathname } from "next/navigation";

export default function EdgeBlurs() {
    const pathname = usePathname();

    // Only show on Home page as per user request
    if (pathname !== "/") return null;

    return (
        <>
            {/* --- BLURRY HEADER EFFECT (Top) --- */}
            <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-[40] backdrop-blur-[2px]"></div>

            {/* --- BLURRY FOOTER EFFECT (Bottom) --- */}
            <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-[40] backdrop-blur-[2px]"></div>
        </>
    );
}
