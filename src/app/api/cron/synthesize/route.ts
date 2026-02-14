import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/admin";
import { synthesizeProjectState } from "@/lib/ai/agents/synthesis-agent";
import { createNotification } from "@/lib/notifications";

export async function GET() {
    // In production, you would verify a CRON_SECRET header here.
    // const authHeader = req.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new Response('Unauthorized', { status: 401 });
    // }

    const supabase = createClient();

    // 1. Get all projects
    const { data: projects, error } = await supabase.from("projects").select("id, name, description, user_id");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const results = [];

    // 2. Iterate and synthesize
    for (const project of projects || []) {
        try {
            // Get current summary
            const currentSummary = project.description || "";

            // Synthesize new summary
            const newSummary = await synthesizeProjectState(project.id);

            // 3. Simple change detection (length check or string comparison)
            // A more robust way would be to ask the LLM if there are "significant updates".
            // For MVP, we just check if it's different and not empty.
            if (newSummary && newSummary !== currentSummary) {
                // Update project
                await supabase.from("projects").update({ description: newSummary }).eq("id", project.id);

                // Create notification
                await createNotification(
                    project.user_id,
                    project.id,
                    "Project Insights Updated",
                    `New insights for ${project.name} based on recent activity.`,
                    `/project/${project.id}/overview`
                );

                results.push({ projectId: project.id, status: "updated" });
            } else {
                results.push({ projectId: project.id, status: "unchanged" });
            }
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error(`Failed to synthesize project ${project.id}:`, err);
            results.push({ projectId: project.id, status: "error", error: err.message });
        }
    }

    return NextResponse.json({ success: true, results });
}
