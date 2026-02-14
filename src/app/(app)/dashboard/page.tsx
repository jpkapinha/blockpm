"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/project-card";
import {
    Plus,
    Sparkles,
    FileText,
    MessageSquare,
    Activity,
} from "lucide-react";

// Mock data — will replace with Supabase queries
const mockProjects = [
    {
        id: "1",
        user_id: "1",
        name: "DeFi Yield Optimizer v2",
        description:
            "Auto-compounding yield aggregator with cross-chain bridge integration for maximum APY across L2s.",
        blockchain_focus: "ethereum",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "2",
        user_id: "1",
        name: "NFT Marketplace SDK",
        description:
            "White-label NFT marketplace with royalty enforcement and multi-chain support.",
        blockchain_focus: "solana",
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "3",
        user_id: "1",
        name: "Cross-chain Bridge Protocol",
        description:
            "Trustless bridge leveraging zero-knowledge proofs for secure asset transfers between EVM chains.",
        blockchain_focus: "multichain",
        created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
        updated_at: new Date().toISOString(),
    },
];

const stats = [
    {
        label: "Active Projects",
        value: "3",
        icon: Activity,
        color: "text-violet-400",
    },
    {
        label: "Documents Generated",
        value: "12",
        icon: FileText,
        color: "text-emerald-400",
    },
    {
        label: "AI Interactions",
        value: "47",
        icon: MessageSquare,
        color: "text-blue-400",
    },
    {
        label: "Insights Found",
        value: "8",
        icon: Sparkles,
        color: "text-amber-400",
    },
];

export default function DashboardPage() {
    const { data: session } = useSession();
    const firstName = session?.user?.name?.split(" ")[0] || "there";

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto relative z-10">
            {/* Welcome header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">
                    Welcome back, {firstName} 👋
                </h1>
                <p className="mt-1 text-sm text-white/40">
                    Here&apos;s what&apos;s happening across your blockchain projects.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className="glass rounded-xl p-4 transition-all duration-300 hover:bg-white/[0.04]"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] ${stat.color}`}
                            >
                                <stat.icon className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-white">{stat.value}</p>
                                <p className="text-xs text-white/30">{stat.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Projects section */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Your Projects</h2>
                <Button size="sm" className="gap-2">
                    <Plus className="h-3.5 w-3.5" />
                    New Project
                </Button>
            </div>

            {mockProjects.length === 0 ? (
                /* Empty state */
                <div className="glass rounded-2xl p-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/10">
                        <Plus className="h-8 w-8 text-violet-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        Create your first project
                    </h3>
                    <p className="text-sm text-white/40 max-w-md mx-auto mb-6">
                        Start by creating a project. Your AI agents will begin building
                        context from your Slack, Telegram, and uploaded documents.
                    </p>
                    <Button size="lg" className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Project
                    </Button>
                </div>
            ) : (
                /* Project grid */
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {mockProjects.map((project) => (
                        <ProjectCard key={project.id} {...project} />
                    ))}
                </div>
            )}

            {/* Recent Activity */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold text-white mb-4">
                    Recent Activity
                </h2>
                <div className="glass rounded-xl divide-y divide-white/[0.04]">
                    {[
                        {
                            text: "Synthesis Agent updated knowledge summary for DeFi Yield Optimizer",
                            time: "2 hours ago",
                            type: "synthesis",
                        },
                        {
                            text: "PRD draft generated for Cross-chain Bridge Protocol",
                            time: "5 hours ago",
                            type: "document",
                        },
                        {
                            text: "14 new Slack messages processed for NFT Marketplace SDK",
                            time: "8 hours ago",
                            type: "input",
                        },
                        {
                            text: "Security Considerations section auto-suggested for DeFi Yield Optimizer",
                            time: "1 day ago",
                            type: "suggestion",
                        },
                    ].map((activity, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 px-4 py-3 text-sm"
                        >
                            <div
                                className={`h-2 w-2 rounded-full shrink-0 ${activity.type === "synthesis"
                                        ? "bg-violet-400"
                                        : activity.type === "document"
                                            ? "bg-emerald-400"
                                            : activity.type === "input"
                                                ? "bg-blue-400"
                                                : "bg-amber-400"
                                    }`}
                            />
                            <span className="text-white/60 flex-1">{activity.text}</span>
                            <span className="text-white/20 text-xs shrink-0">
                                {activity.time}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
