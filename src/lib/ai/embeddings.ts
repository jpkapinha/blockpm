import { OpenAIEmbeddings } from "@langchain/openai";

// Initialize embeddings model via OpenRouter (OpenAI-compatible)
// default model: text-embedding-3-small (cheap & good) or whatever OpenRouter provides
// For now, let's assume we use standard OpenAI embeddings available on OpenRouter
// or direct OpenAI if preferred. The instruction mentioned OpenRouter embeddings.
// OpenRouter supports various embedding models. Let's use `text-embedding-3-small` if available via OpenRouter,
// or fallback to a standard one.

// Using OpenRouter for embeddings might be tricky if they don't proxy embeddings cleanly.
// Let's assume standard OpenAI compatibility.
// If OpenRouter specific config is needed, we adjust basePath.

const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    // If using OpenRouter:
    configuration: {
        baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
    },
    // OpenRouter requires distinct header for some models, but standard OpenAI clients work
});

export async function generateEmbedding(text: string): Promise<number[]> {
    // Sanitize text
    const cleanText = text.replace(/\n/g, " ");
    return await embeddings.embedQuery(cleanText);
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
    const cleanTexts = texts.map((t) => t.replace(/\n/g, " "));
    return await embeddings.embedDocuments(cleanTexts);
}
