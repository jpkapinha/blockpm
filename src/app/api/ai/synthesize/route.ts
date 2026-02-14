import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/admin";
import { synthesizeProjectState } from "@/lib/ai/agents/synthesis-agent";

export async function POST(req: NextRequest) {
    try {
        const { projectId } = await req.json();
        if (!projectId) return NextResponse.json({ error: "Missing projectId" }, { status: 400 });

        const summary = await synthesizeProjectState(projectId);

        // Save to DB (optional, but good for caching)
        // For now we just return it, and let frontend or another call save it.
        // Actually, let's save it to 'projects.description' or 'projects.metadata' if possible.
        // Since we don't have 'metadata' column yet, let's just return it.
        // The agent logic has the summary.

        // Wait, the client might want to save it. 
        // Let's update the project description directly here?
        // "Update the 'Existing Summary'..."
        const supabase = createClient();
        await supabase.from("projects").update({ description: summary }).eq("id", projectId);

        return NextResponse.json({ summary });
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.error("Synthesis error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


