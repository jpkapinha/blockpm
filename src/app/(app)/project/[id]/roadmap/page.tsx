"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";

export default function ProjectRoadmapPage() {
    const milestones = [
        {
            title: "Phase 1: Foundation",
            status: "completed",
            items: [
                "Smart Contract Architecture Design",
                "Tokenomics Whitepaper",
                "Initial Security Review"
            ]
        },
        {
            title: "Phase 2: MVP Development",
            status: "in-progress",
            items: [
                "Core Vault Implementation",
                "Frontend Integration",
                "Internal Audit"
            ]
        },
        {
            title: "Phase 3: Public Testnet",
            status: "upcoming",
            items: [
                "Sepolia Deployment",
                "Bug Bounty Program",
                "Community Feedback Loop"
            ]
        },
    ];

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Project Roadmap</h2>
            </div>

            <div className="relative border-l border-white/10 ml-3 space-y-8 pl-8 py-2">
                {milestones.map((milestone, i) => (
                    <div key={i} className="relative">
                        {/* Timeline dot */}
                        <div className={`absolute -left-[39px] top-1 h-5 w-5 rounded-full border-2 ${milestone.status === "completed"
                                ? "bg-violet-600 border-violet-600"
                                : milestone.status === "in-progress"
                                    ? "bg-[#0a0a0f] border-violet-500"
                                    : "bg-[#0a0a0f] border-white/20"
                            } flex items-center justify-center`}>
                            {milestone.status === "completed" && <CheckCircle2 className="h-3 w-3 text-white" />}
                            {milestone.status === "in-progress" && <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />}
                        </div>

                        <Card className={`${milestone.status === "upcoming" ? "opacity-60" : ""
                            }`}>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">{milestone.title}</CardTitle>
                                <CardDescription className="capitalize">{milestone.status.replace("-", " ")}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {milestone.items.map((item, j) => (
                                        <li key={j} className="flex items-start gap-2 text-sm text-white/70">
                                            <Circle className="h-2 w-2 mt-1.5 fill-current opacity-50 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}
