import { createClient } from "@/lib/supabase/server";
import { generateEmbedding } from "@/lib/ai/embeddings";

export interface RetrievedContext {
    content: string;
    similarity: number;
    sourceId: string;
}

export async function retrieveContext(
    projectId: string,
    query: string,
    threshold = 0.5,
    limit = 5
): Promise<RetrievedContext[]> {
    const supabase = createClient();

    // 1. Generate embedding for query
    const embedding = await generateEmbedding(query);

    // @ts-expect-error match_documents RPC might not be in types yet
    const { data: documents, error } = await supabase.rpc("match_documents", {
        query_embedding: embedding,
        match_threshold: threshold,
        match_count: limit,
        filter_project_id: projectId,
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    if (error) {
        console.error("Vector search failed:", error);
        throw new Error("Failed to retrieve context");
    }

    // 3. Format results
    if (!documents) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (documents as any[]).map((chunk: any) => ({
        content: chunk.content,
        similarity: chunk.similarity,
        sourceId: chunk.source_id,
    }));
}

export function formatContext(contexts: RetrievedContext[]): string {
    if (!contexts.length) return "No relevant context found.";

    return contexts
        .map((c, i) => `[Source ${i + 1}]:\n${c.content}`)
        .join("\n\n");
}
