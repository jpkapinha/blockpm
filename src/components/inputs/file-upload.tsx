"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Upload, File, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface FileUploadProps {
    projectId: string;
    onUploadComplete?: () => void;
}

interface UploadingFile {
    file: File;
    progress: number;
    error?: string;
}

export function FileUpload({ projectId, onUploadComplete }: FileUploadProps) {
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
    const supabase = createClient();

    const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
        // Handle rejections (optional: show toast)
        if (fileRejections.length > 0) {
            console.error("Files rejected:", fileRejections);
        }

        // Prepare files for upload
        const newUploads = acceptedFiles.map(file => ({
            file,
            progress: 0,
        }));

        setUploadingFiles(prev => [...prev, ...newUploads]);

        // Process each file
        for (const { file } of newUploads) {
            try {
                // 1. Upload to Supabase Storage
                const filePath = `${projectId}/${Date.now()}-${file.name}`;

                const { error: uploadError } = await supabase.storage
                    .from("project-files")
                    .upload(filePath, file, {
                        cacheControl: "3600",
                        upsert: false,
                    });

                if (uploadError) throw uploadError;

                // Update progress to 50% (storage done)
                setUploadingFiles(prev =>
                    prev.map(u => u.file === file ? { ...u, progress: 50 } : u)
                );

                // 2. Trigger Ingestion API
                const response = await fetch("/api/ingest", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        projectId,
                        sourceType: "upload",
                        storagePath: filePath,
                        fileName: file.name,
                        mimeType: file.type,
                    }),
                });

                if (!response.ok) throw new Error("Ingestion failed");

                // Update progress to 100% (ingestion done)
                setUploadingFiles(prev =>
                    prev.map(u => u.file === file ? { ...u, progress: 100 } : u)
                );

                // Remove from list after delay
                setTimeout(() => {
                    setUploadingFiles(prev => prev.filter(u => u.file !== file));
                    onUploadComplete?.();
                }, 2000);

            } catch (error) {
                console.error("Upload error:", error);
                setUploadingFiles(prev =>
                    prev.map(u => u.file === file ? { ...u, error: "Upload failed" } : u)
                );
            }
        }
    }, [projectId, supabase, onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "text/plain": [".txt", ".md"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        },
        maxSize: 10 * 1024 * 1024, // 10MB
    });

    return (
        <div className="w-full space-y-4">
            <div
                {...getRootProps()}
                className={cn(
                    "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] p-8 text-center transition-all hover:bg-white/[0.04] hover:border-violet-500/30 cursor-pointer",
                    isDragActive && "border-violet-500 bg-violet-500/5"
                )}
            >
                <input {...getInputProps()} />
                <div className="mb-4 rounded-full bg-white/5 p-3">
                    <Upload className="h-6 w-6 text-white/50" />
                </div>
                <p className="mb-2 text-sm font-medium text-white">
                    {isDragActive ? "Drop files here" : "Drag & drop files or click to upload"}
                </p>
                <p className="text-xs text-white/40">
                    Supported: PDF, DOCX, TXT (Max 10MB)
                </p>
            </div>

            {/* Upload Progress List */}
            {uploadingFiles.length > 0 && (
                <div className="space-y-2">
                    {uploadingFiles.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded bg-white/5 text-white/50">
                                <File className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-medium text-white truncate">{item.file.name}</p>
                                    {item.error ? (
                                        <span className="text-xs text-red-400 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" /> Failed
                                        </span>
                                    ) : item.progress === 100 ? (
                                        <span className="text-xs text-emerald-400">Complete</span>
                                    ) : (
                                        <span className="text-xs text-white/40">{item.progress}%</span>
                                    )}
                                </div>
                                {item.error ? (
                                    <p className="text-xs text-red-400/70">{item.error}</p>
                                ) : (
                                    <Progress value={item.progress} className="h-1 bg-white/10" />
                                )}
                            </div>
                            {item.error && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-white/30 hover:text-white"
                                    onClick={() => setUploadingFiles(prev => prev.filter(u => u !== item))}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
