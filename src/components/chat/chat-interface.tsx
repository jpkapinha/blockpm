"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";
import { MessageBubble } from "./message-bubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Loader2, MessageSquare } from "lucide-react";

interface ChatInterfaceProps {
    projectId: string;
    initialMessages?: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function ChatInterface({ projectId, initialMessages = [] }: ChatInterfaceProps) {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: "/api/chat",
        body: { projectId },
        initialMessages,
    } as any) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto pr-4 mb-4 space-y-4 min-h-0" ref={scrollRef}>
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-white/30 space-y-4">
                        <div className="p-4 bg-white/5 rounded-full">
                            <MessageSquare className="h-8 w-8" />
                        </div>
                        <p className="text-sm">Start a conversation about your project.</p>
                    </div>
                ) : (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    messages.map((m: any) => (
                        <MessageBubble
                            key={m.id}
                            role={m.role}
                            content={m.content}
                        />
                    ))
                )}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white/[0.05] border border-white/10 rounded-lg p-4 flex items-center gap-2 text-sm text-white/50">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Thinking...
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <Card className="p-4 border-white/10 bg-white/5 mt-auto">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask about project status, requirements, or documents..."
                        className="flex-1 bg-black/20 border-white/10 focus-visible:ring-violet-500/50"
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </Card>
        </div>
    );
}
