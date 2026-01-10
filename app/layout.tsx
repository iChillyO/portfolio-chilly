import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import ConditionalFooter from "@/components/ConditionalFooter";
import EdgeBlurs from "@/components/EdgeBlurs";

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
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${inter.variable} ${orbitron.variable} bg-deep-bg text-slate-800`} suppressHydrationWarning={true}>
        <Providers>
          <EdgeBlurs />
          {/* SWAP THIS: Use the Conditional one instead of the fixed one */}
          <ConditionalNavbar />

          {children}
          <ConditionalFooter />
        </Providers>
      </body>
    </html>
  );
}