import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlockPM Assistant — AI-Native PM for Blockchain",
  description:
    "The AI-native agentic assistant for blockchain Product Managers. Synthesize inputs, generate PRDs, and ship faster.",
  keywords: [
    "blockchain",
    "product manager",
    "AI assistant",
    "PRD",
    "DeFi",
    "smart contracts",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} antialiased noise-overlay`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
