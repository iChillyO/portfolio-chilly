"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Work Queue", path: "/work-queue" },
    { name: "Pricing", path: "/pricing" },
    { name: "Protocols", path: "/commotions" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 pt-4 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-8 py-3 bg-black/10 backdrop-blur-md rounded-full">
          
          {/* LEFT: Logo (Now Clickable) */}
          <div className="flex items-center gap-2 justify-start">
             <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
               <span className="text-white font-black text-lg tracking-widest uppercase italic">
                 Sharaf Hazem
               </span>
             </Link>
          </div>

          {/* MIDDLE: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 justify-center">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`
                    text-xs font-bold tracking-widest uppercase transition-all duration-300
                    ${isActive 
                      ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" 
                      : "text-blue-200/60 hover:text-white"}
                  `}
                >
                  {item.name}
                </Link>
              );
            })}
             {/* Admin Link (Hidden shortcut for you) */}
             <Link href="/admin" className="text-xs font-bold tracking-[0.2em] uppercase text-gray-600 hover:text-red-500 transition-colors ml-4 opacity-50 hover:opacity-100">
                {/* // ADMIN */}
             </Link>
          </nav>

          {/* RIGHT: Mobile Menu / Placeholder */}
          <div className="flex justify-end md:hidden text-cyan-400 text-xl">
            ☰
          </div>
          {/* Empty div for desktop to balance the grid */}
          <div className="hidden md:block"></div>
        </div>
      </div>
    </header>
  );
}