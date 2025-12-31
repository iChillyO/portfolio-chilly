import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
// import Navbar from "@/components/Navbar"; <--- DELETE THIS LINE
import ConditionalNavbar from "@/components/ConditionalNavbar"; // <--- ADD THIS LINE

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

export const metadata: Metadata = {
  title: "Chilly Portfolio",
  description: "Creative Developer Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${orbitron.variable} bg-deep-bg text-slate-800`} suppressHydrationWarning={true}>
        
        {/* SWAP THIS: Use the Conditional one instead of the fixed one */}
        <ConditionalNavbar />
        
        {children}
      </body>
    </html>
  );
}