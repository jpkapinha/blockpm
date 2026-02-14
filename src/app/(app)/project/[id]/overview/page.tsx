"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, FileText, Sparkles, RefreshCw, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ProjectOverviewPage({ params }: { params: { id: string } }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [project, setProject] = useState<any>(null);
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    const supabase = createClient();
    const projectId = params.id;

    const fetchProject = useCallback(async () => {
        const { data } = await supabase.from("projects").select("*").eq("id", projectId).single();
        if (data) setProject(data);
    }, [projectId, supabase]);

    useEffect(() => {
        if (projectId) fetchProject();
    }, [projectId, fetchProject]);

    const handleSynthesize = async () => {
        setIsSynthesizing(true);
        try {
            const res = await fetch("/api/ai/synthesize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectId }),
            });

            if (res.ok) {
                const { summary } = await res.json();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setProject((prev: any) => (prev ? { ...prev, description: summary } : null));
            }
        } catch (error) {
            console.error("Synthesis failed:", error);
        } finally {
            setIsSynthesizing(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Inputs</CardTitle>
                        <Database className="h-4 w-4 text-violet-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-white/50">Stored contexts</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Documents</CardTitle>
                        <FileText className="h-4 w-4 text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-white/50">Generated assets</p>
                    </CardContent>
                </Card>
                {/* ... other cards ... */}
            </div>

            {/* Project Knowledge Summary */}
            <Card className="col-span-4 border-violet-500/20 bg-violet-500/[0.02]">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-violet-400" />
                            Project Knowledge Summary
                        </CardTitle>
                        <CardDescription>
                            AI-synthesized overview of the current project state.
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSynthesize}
                        disabled={isSynthesizing}
                        className="border-white/10 hover:bg-white/5"
                    >
                        {isSynthesizing ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        {isSynthesizing ? "Synthesizing..." : "Refresh Summary"}
                    </Button>
                </CardHeader>
                <CardContent>
                    {project?.description ? (
                        <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown>{project.description}</ReactMarkdown>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-white/40">
                            <p>No summary generated yet.</p>
                            <p className="text-xs mt-1">Upload inputs and click Refresh Summary.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
