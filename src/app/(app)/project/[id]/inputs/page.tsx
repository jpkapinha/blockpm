"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileUpload } from "@/components/inputs/file-upload";
import { RichEditor } from "@/components/inputs/rich-editor";
import { IntegrationsManager } from "@/components/inputs/integrations-manager";
import { FileText, StickyNote, Database, Loader2, CheckCircle } from "lucide-react";

export default function ProjectInputsPage({ params }: { params: { id: string } }) {
    const [inputs, setInputs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const projectId = params.id;

    const fetchInputs = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("inputs")
            .select("*")
            .eq("project_id", projectId)
            .order("created_at", { ascending: false });

        if (!error && data) {
            // @ts-ignore
            setInputs(data);
        }
        setLoading(false);
    }, [projectId, supabase]);

    useEffect(() => {
        if (projectId) fetchInputs();
    }, [projectId, fetchInputs]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-white">Inputs & Memory</h2>
                    <p className="text-sm text-white/40">Manage data sources for the AI context.</p>
                </div>
            </div>

            <Tabs defaultValue="files" className="w-full">
                <TabsList className="bg-white/[0.03] border border-white/[0.06]">
                    <TabsTrigger value="files">Files & Notes</TabsTrigger>
                    <TabsTrigger value="integrations">Integrations</TabsTrigger>
                </TabsList>

                <TabsContent value="files" className="space-y-6 mt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Upload Zone */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Upload Documents</CardTitle>
                                <CardDescription>PDF, DOCX, TXT supported</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FileUpload projectId={projectId} onUploadComplete={fetchInputs} />
                            </CardContent>
                        </Card>

                        {/* Quick Note */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Quick Note</CardTitle>
                                <CardDescription>Jot down ideas or paste text</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RichEditor projectId={projectId} onSaveComplete={fetchInputs} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Inputs List */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">Processed Inputs</h3>
                        {loading ? (
                            <div className="flex items-center justify-center p-8 text-white/30">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        ) : inputs.length === 0 ? (
                            <div className="text-center p-8 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                                <Database className="h-8 w-8 mx-auto text-white/20 mb-2" />
                                <p className="text-sm text-white/40">No inputs yet. Upload a file or add a note.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {inputs.map((input) => (
                                    <div key={input.id} className="flex items-center justify-between p-3 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-md bg-white/[0.05] group-hover:bg-violet-500/10 group-hover:text-violet-300 transition-colors">
                                                {input.source_type === "upload" ? (
                                                    <FileText className="h-4 w-4 text-white/50" />
                                                ) : (
                                                    <StickyNote className="h-4 w-4 text-white/50" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">
                                                    {input.source_meta?.file_name || input.source_meta?.title || "Untitled Input"}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-white/40">
                                                    <span className="capitalize">{input.source_type}</span>
                                                    <span>•</span>
                                                    <span>{new Date(input.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {input.processed ? (
                                                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                                                    <CheckCircle className="h-3 w-3" />
                                                    Indexed
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                    Processing
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="integrations" className="mt-6">
                    <IntegrationsManager projectId={projectId} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
