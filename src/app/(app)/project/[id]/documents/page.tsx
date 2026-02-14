"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Clock, CheckCircle, Loader2, FileText } from "lucide-react";

export default function ProjectDocumentsPage({ params }: { params: { id: string } }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [open, setOpen] = useState(false);

    // Gen Form
    const [topic, setTopic] = useState("");
    const [docType, setDocType] = useState("prd");

    const supabase = createClient();
    const projectId = params.id;

    const fetchDocuments = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase
            .from("documents")
            .select("*")
            .eq("project_id", projectId)
            .order("created_at", { ascending: false });

        if (data) setDocuments(data);
        setLoading(false);
    }, [projectId, supabase]);

    useEffect(() => {
        if (projectId) fetchDocuments();
    }, [projectId, fetchDocuments]);

    const handleGenerate = async () => {
        if (!topic) return;
        setIsGenerating(true);
        try {
            const res = await fetch("/api/ai/generate-doc", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectId, type: docType, topic }),
            });

            if (res.ok) {
                setOpen(false);
                setTopic("");
                fetchDocuments();
            }
        } catch (error) {
            console.error("Gen failed:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Generated Documents</h2>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Generate New
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Generate new document</DialogTitle>
                            <DialogDescription>
                                AI agents will use your project inputs to generate a drafted document.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="type">Document Type</Label>
                                <Select value={docType} onValueChange={setDocType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="prd">Product Requirement Doc (PRD)</SelectItem>
                                        <SelectItem value="spec">Technical Specification</SelectItem>
                                        <SelectItem value="checklist">Audit Checklist</SelectItem>
                                        <SelectItem value="other">Other / Custom</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="topic">Topic / Title</Label>
                                <Input
                                    id="topic"
                                    placeholder="e.g. Yield Optimization Strategy"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button onClick={handleGenerate} disabled={isGenerating || !topic}>
                                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Generate Draft
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-3 flex justify-center py-10 text-white/30">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : documents.length === 0 ? (
                    <div className="col-span-3 text-center py-10 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                        <FileText className="h-8 w-8 mx-auto text-white/20 mb-2" />
                        <p className="text-sm text-white/40">No documents yet.</p>
                    </div>
                ) : (
                    documents.map((doc) => (
                        <Card key={doc.id} className="group cursor-pointer hover:border-violet-500/30 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="px-2 py-1 rounded-md text-xs font-medium border bg-white/5 border-white/10 text-white/70 uppercase">
                                        {doc.doc_type}
                                    </div>
                                    {doc.status === "approved" ? (
                                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                        <Clock className="h-4 w-4 text-white/20" />
                                    )}
                                </div>
                                <h3 className="font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors line-clamp-2">
                                    {doc.title}
                                </h3>
                                <div className="flex items-center justify-between text-xs text-white/40">
                                    <span className="capitalize">{doc.status}</span>
                                    <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
