"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Database,
    FileText,
    MessageSquare,
    Map,
} from "lucide-react";

const tabs = [
    { slug: "overview", label: "Overview", icon: LayoutDashboard },
    { slug: "inputs", label: "Inputs & Memory", icon: Database },
    { slug: "documents", label: "Documents", icon: FileText },
    { slug: "chat", label: "Chat", icon: MessageSquare },
    { slug: "roadmap", label: "Roadmap", icon: Map },
];

export default function ProjectLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const params = useParams();
    const projectId = params.id as string;

    return (
        <div className="relative z-10">
            {/* Project header */}
            <div className="border-b border-white/[0.06] bg-[#0a0a0f]/50 backdrop-blur-sm sticky top-0 z-20">
                <div className="px-6 lg:px-8 py-4">
                    <h1 className="text-lg font-semibold text-white">
                        DeFi Yield Optimizer v2
                    </h1>
                    <p className="text-sm text-white/30 mt-0.5">Ethereum · Created Feb 14, 2026</p>
                </div>

                {/* Tabs */}
                <div className="px-6 lg:px-8 flex gap-1 -mb-px overflow-x-auto">
                    {tabs.map((tab) => {
                        const href = `/project/${projectId}/${tab.slug}`;
                        const isActive = pathname === href;

                        return (
                            <Link
                                key={tab.slug}
                                href={href}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap",
                                    isActive
                                        ? "border-violet-500 text-violet-300"
                                        : "border-transparent text-white/40 hover:text-white/60 hover:border-white/10"
                                )}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Tab content */}
            <div className="p-6 lg:p-8">{children}</div>
        </div>
    );
}
