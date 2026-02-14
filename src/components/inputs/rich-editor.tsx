"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface RichEditorProps {
    projectId: string;
    onSaveComplete?: () => void;
}

export function RichEditor({ projectId, onSaveComplete }: RichEditorProps) {
    const [isSaving, setIsSaving] = useState(false);
    const supabase = createClient();

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Write something ...",
            }),
        ],
        editorProps: {
            attributes: {
                class: "prose prose-invert max-w-none focus:outline-none min-h-[150px]",
            },
        },
    });

    const handleSave = async () => {
        if (!editor || isSaving) return;

        const content = editor.getHTML();
        const textContent = editor.getText();
        if (!textContent.trim()) return;

        setIsSaving(true);
        try {
            // 1. Save to DB
            const { data: input, error } = await supabase
                .from("inputs")
                .insert({
                    project_id: projectId,
                    source_type: "note",
                    raw_content: content,
                    source_meta: { title: "New Note" }, // Should add title input later
                    processed: false,
                })
                .select()
                .single();

            if (error) throw error;

            // 2. Trigger Ingestion
            const response = await fetch("/api/ingest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    projectId,
                    inputId: input.id,
                    sourceType: "note",
                    content: textContent,
                }),
            });

            if (!response.ok) throw new Error("Ingestion failed");

            editor.commands.clearContent();
            onSaveComplete?.();
        } catch (error) {
            console.error("Save failed:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="border-b border-white/10 p-2 flex gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={cn(editor?.isActive("bold") && "bg-white/10 text-white")}
                >
                    Bold
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={cn(editor?.isActive("italic") && "bg-white/10 text-white")}
                >
                    Italic
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={cn(editor?.isActive("bulletList") && "bg-white/10 text-white")}
                >
                    List
                </Button>
            </div>
            <div className="p-4">
                <EditorContent editor={editor} />
            </div>
            <div className="border-t border-white/10 p-2 flex justify-end">
                <Button size="sm" onClick={handleSave} disabled={isSaving || !editor?.getText().trim()}>
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Note
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
