import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createClient } from "@/lib/supabase/server";

const synthesisModel = new ChatOpenAI({
    modelName: "gpt-4o-mini", // Cost-effective model for synthesis
    temperature: 0.3,
    configuration: {
        baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
    },
});

const SYNTHESIS_PROMPT = `
You are an expert Production Manager for blockchain projects. Your task is to synthesize the current state of a project based on its recent inputs and documents.

Existing Summary:
{current_summary}

Recent Inputs:
{recent_inputs}

Instructions:
1. Update the "Existing Summary" with new information from "Recent Inputs".
2. Keep the summary structured with the following sections:
   - 🎯 Project Goal
   - 🚧 Current Status & Blockers
   - 🛠 Technical Architecture
   - 📝 Key Requirements
   - 📅 Roadmap Highlights
3. Use bullet points for readability.
4. If "Recent Inputs" contradicts "Existing Summary", prioritize the new information (but mention the change).
5. Be concise but comprehensive.

New Project Summary:
`;

export async function synthesizeProjectState(projectId: string) {
    const supabase = createClient();

    // 1. Fetch current project summary
    const { data: project } = await supabase
        .from("projects")
        .select("description, id") // We might need a flexible 'metadata' field in future, using description for now? No, description is short.
        // Let's check schema. We might need to store this in a specific place. 
        // The schema had 'settings' jsonb, or we can use a new table 'project_state'.
        // For MVP, let's store it in a new column 'knowledge_summary' or just overwrite 'description' if it's long text.
        // Let's assume we use 'description' for now, or just return it to UI.
        // Actually, Phase 1 schema didn't have 'knowledge_summary'.
        // I will store it in a new table 'project_knowledge' or just return it for now.
        // Let's create a 'project_knowledge' table in the migration or just use a JSONB field.
        // Let's check 001_initial_schema.sql.
        .eq("id", projectId)
        .single();

    // 2. Fetch recent unprocessed inputs (or all inputs for full resynthesis)
    // For MVP: Fetch last 5 inputs or inputs from last 24h
    const { data: inputs } = await supabase
        .from("inputs")
        .select("raw_content, created_at, source_meta")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(5);

    if (!inputs || inputs.length === 0) {
        return "No inputs available to synthesize.";
    }

    const inputsText = inputs.map(i =>
        `Source: ${i.source_meta?.file_name || 'Note'} (${new Date(i.created_at).toLocaleDateString()})\n${i.raw_content.substring(0, 1000)}...`
    ).join("\n\n");

    const prompt = PromptTemplate.fromTemplate(SYNTHESIS_PROMPT);
    const chain = RunnableSequence.from([prompt, synthesisModel, new StringOutputParser()]);

    const summary = await chain.invoke({
        current_summary: project?.description || "No summary yet.",
        recent_inputs: inputsText,
    });

    return summary;
}
