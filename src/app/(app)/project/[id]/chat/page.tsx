import { ChatInterface } from "@/components/chat/chat-interface";
import { createClient } from "@/lib/supabase/server";

export default async function ProjectChatPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const projectId = params.id;

    // Fetch message history
    const { data: messages } = await supabase
        .from("chat_messages")
        .select("id, role, content")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

    return (
        <div className="flex flex-col h-full bg-black/20 p-6 rounded-2xl border border-white/5">
            <ChatInterface projectId={projectId} initialMessages={messages || []} />
        </div>
    );
}
