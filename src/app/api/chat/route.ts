import { streamText } from "ai";
import { createClient } from "@/lib/supabase/admin";
import { retrieveContext, formatContext } from "@/lib/ai/retrieval";

// Configure OpenRouter as a custom OpenAI provider instance
import { createOpenAI } from "@ai-sdk/openai";

const openrouter = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
    const { messages, projectId } = await req.json();

    if (!projectId) {
        return new Response("Missing projectId", { status: 400 });
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    const query = lastMessage.content;

    // Retrieve context
    let contextString = "";
    try {
        const contextItems = await retrieveContext(projectId, query);
        contextString = formatContext(contextItems);
    } catch (error) {
        console.warn("Context retrieval failed:", error);
    }

    // System prompt
    const systemPrompt = `
    You are an expert AI assistant for a blockchain project.
    Your goal is to help the user manage their project, generate documents, and answer technical questions.
    
    Context from project files and notes:
    ${contextString}
    
    Instructions:
    1. Answer the user's question based on the context provided.
    2. If the answer is not in the context, use your general knowledge but mention that it's not in the project files.
    3. Be concise, professional, and helpful.
    4. Use markdown for formatting (code blocks, lists, bold text).
  `;

    // Start streaming
    const result = await streamText({
        model: openrouter("gpt-4o-mini"), // Use a cost-effective model for chat
        messages: messages,
        system: systemPrompt,
        onFinish: async ({ text }) => {
            // Save messages to DB
            const supabase = createClient();

            // Save User Message
            await supabase.from("chat_messages").insert({
                project_id: projectId,
                role: "user",
                content: query,
            });

            // Save Assistant Message
            await supabase.from("chat_messages").insert({
                project_id: projectId,
                role: "assistant", // 'assistant' matches standard roles, but DB schema uses 'role' text column
                content: text,
            });
        },
    });

    return result.toTextStreamResponse();
}
