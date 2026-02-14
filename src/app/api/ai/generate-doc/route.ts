import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/admin";
import { generateDocument } from "@/lib/ai/agents/document-agent";

export async function POST(req: NextRequest) {
    try {
        const { projectId, type, topic } = await req.json();
        if (!projectId || !topic) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

        const supabase = createClient();

        // Fetch project metadata
        const { data: project } = await supabase.from("projects").select("blockchain_focus").eq("id", projectId).single();
        const blockchainFocus = project?.blockchain_focus || "Ethereum";

        const content = await generateDocument(projectId, type, topic, blockchainFocus);

        // Save to DB
        const { data: doc, error } = await supabase.from("documents").insert({
            project_id: projectId,
            title: topic,
            doc_type: type,
            content: content,
            status: "draft",
            created_by: "ai_agent",
        }).select().single();

        if (error) throw error;

        return NextResponse.json({ document: doc });
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.error("Doc gen error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
