"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Boxes,
  Sparkles,
  FileText,
  MessageSquare,
  Shield,
  Zap,
  ArrowRight,
  Github,
} from "lucide-react";

const features = [
  {
    icon: Boxes,
    title: "Multi-chain Intelligence",
    description:
      "Built-in knowledge of Ethereum, Solana, Polygon and more. Auto-suggests security reviews, gas optimization, and audit checklists.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Synthesis",
    description:
      "Agents continuously monitor Slack, Telegram, and uploaded docs to build a living knowledge base for every project.",
  },
  {
    icon: FileText,
    title: "Auto-Generate PRDs",
    description:
      "One click to generate PRDs, technical architecture, smart contract specs, backlogs, and QA plans — all editable.",
  },
  {
    icon: MessageSquare,
    title: "Conversational Agents",
    description:
      "Chat naturally with your project. Ask \"What's next?\" or \"Draft a cross-chain bridge spec\" and watch it happen.",
  },
  {
    icon: Shield,
    title: "PM Has the Last Word",
    description:
      "Nothing auto-publishes. Every agent output requires explicit approval. Full audit trail of every decision.",
  },
  {
    icon: Zap,
    title: "Proactive Insights",
    description:
      "Periodic cron jobs surface new themes from your inputs. Get notified when something needs your attention.",
  },
];

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%)",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)",
            animation: "float 10s ease-in-out infinite 2s",
          }}
        />
        <div
          className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(168, 85, 247, 0.5) 0%, transparent 70%)",
            animation: "float 6s ease-in-out infinite 4s",
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <Boxes className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">BlockPM</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            window.open("https://github.com", "_blank")
          }
        >
          <Github className="h-4 w-4" />
          <span className="hidden sm:inline">GitHub</span>
        </Button>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-16 pb-24 lg:pt-28">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
          <Sparkles className="h-3.5 w-3.5" />
          AI-native product management for web3
        </div>

        {/* Title */}
        <h1 className="max-w-4xl text-center text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
          Ship blockchain products{" "}
          <span className="gradient-text">10x faster</span>{" "}
          with AI agents
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-center text-lg text-white/50 leading-relaxed">
          BlockPM synthesizes your Slack messages, Telegram chats, and
          documents into actionable PRDs, specs, and roadmaps — so you can
          focus on shipping, not note-taking.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="gap-2 px-8 text-base font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            Learn more
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Demo image placeholder */}
        <div className="mt-16 w-full max-w-5xl">
          <div className="glass rounded-2xl p-1">
            <div className="rounded-xl bg-gradient-to-b from-white/[0.04] to-transparent p-8 min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center gap-3 rounded-xl bg-violet-600/10 border border-violet-500/20 px-6 py-4">
                  <div className="h-3 w-3 rounded-full bg-violet-500 animate-pulse" />
                  <span className="text-sm text-violet-300 font-medium">
                    AI agents monitoring 3 Slack channels, 2 Telegram groups...
                  </span>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4 max-w-lg mx-auto">
                  {["PRD Generated", "14 New Insights", "Backlog Updated"].map(
                    (label, i) => (
                      <div
                        key={i}
                        className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 text-xs text-white/50"
                      >
                        {label}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 w-full max-w-6xl">
          <h2 className="text-center text-2xl font-semibold text-white mb-12">
            Everything a blockchain PM needs
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={i}
                className="glass glass-hover rounded-xl p-6 transition-all duration-300 group"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600/15 text-violet-400 group-hover:bg-violet-600/25 transition-colors duration-300">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/40">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 text-center text-sm text-white/20">
          <p>
            Built for the on-chain future · BlockPM Assistant ©{" "}
            {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  );
}
