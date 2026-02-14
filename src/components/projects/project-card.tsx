"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
    id: string;
    name: string;
    description?: string | null;
    blockchain_focus?: string | null;
    created_at: string;
}

const blockchainColors: Record<string, string> = {
    ethereum: "from-blue-500/20 to-indigo-500/20 border-blue-500/20",
    solana: "from-purple-500/20 to-fuchsia-500/20 border-purple-500/20",
    polygon: "from-violet-500/20 to-purple-500/20 border-violet-500/20",
    avalanche: "from-red-500/20 to-rose-500/20 border-red-500/20",
    arbitrum: "from-blue-500/20 to-cyan-500/20 border-blue-500/20",
    optimism: "from-red-500/20 to-orange-500/20 border-red-500/20",
    base: "from-blue-500/20 to-sky-500/20 border-blue-500/20",
    bnb: "from-yellow-500/20 to-amber-500/20 border-yellow-500/20",
    multichain: "from-violet-500/20 to-cyan-500/20 border-violet-500/20",
};

const blockchainIcons: Record<string, string> = {
    ethereum: "Ξ",
    solana: "◎",
    polygon: "⬡",
    avalanche: "▲",
    arbitrum: "🔵",
    optimism: "🔴",
    base: "🔵",
    bnb: "◆",
    multichain: "◈",
};

export function ProjectCard({
    id,
    name,
    description,
    blockchain_focus,
    created_at,
}: ProjectCardProps) {
    const chain = blockchain_focus?.toLowerCase() || "multichain";
    const gradient = blockchainColors[chain] || blockchainColors.multichain;
    const icon = blockchainIcons[chain] || "◈";

    return (
        <Link href={`/project/${id}/overview`}>
            <div
                className={cn(
                    "group relative rounded-xl border bg-gradient-to-br p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/5 cursor-pointer",
                    gradient
                )}
            >
                {/* Chain icon */}
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-2xl">{icon}</span>
                    <span className="text-xs text-white/30 capitalize">
                        {blockchain_focus || "Multi-chain"}
                    </span>
                </div>

                {/* Project name */}
                <h3 className="text-base font-semibold text-white group-hover:text-violet-200 transition-colors">
                    {name}
                </h3>

                {/* Description */}
                {description && (
                    <p className="mt-2 text-sm text-white/40 line-clamp-2">
                        {description}
                    </p>
                )}

                {/* Created date */}
                <p className="mt-4 text-xs text-white/20">
                    Created{" "}
                    {new Date(created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </p>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500/0 to-violet-500/0 group-hover:from-violet-500/5 group-hover:to-transparent transition-all duration-500" />
            </div>
        </Link>
    );
}
