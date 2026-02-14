import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";
// @ts-expect-error ReactMarkdown types might be missing
import ReactMarkdown from "react-markdown";

interface MessageBubbleProps {
    role: "user" | "assistant" | "system" | "data";
    content: string;
    className?: string;
}

export function MessageBubble({ role, content, className }: MessageBubbleProps) {
    const isUser = role === "user";

    return (
        <div
            className={cn(
                "flex w-full items-start gap-4 p-4 transition-all opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-300",
                isUser ? "flex-row-reverse" : "flex-row",
                className
            )}
        >
            <div
                className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border shadow-sm",
                    isUser
                        ? "bg-violet-600 border-violet-500 text-white"
                        : "bg-white/[0.05] border-white/10 text-emerald-400"
                )}
            >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div
                className={cn(
                    "flex max-w-[80%] flex-col gap-2 rounded-2xl px-5 py-4 text-sm shadow-md",
                    isUser
                        ? "bg-violet-600 text-white rounded-tr-sm"
                        : "bg-white/[0.05] border border-white/10 text-white/90 rounded-tl-sm backdrop-blur-md"
                )}
            >
                {isUser ? (
                    <div className="whitespace-pre-wrap">{content}</div>
                ) : (
                    <div className="prose prose-invert prose-sm max-w-none leading-relaxed">
                        <ReactMarkdown
                            components={{
                                a: ({ ...props }) => (
                                    <a {...props} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline" />
                                ),
                                code: ({ ...props }) => (
                                    <code {...props} className="bg-white/10 rounded px-1 py-0.5 text-white/80 font-mono text-xs" />
                                ),
                                pre: ({ ...props }) => (
                                    <pre {...props} className="bg-black/30 rounded-lg p-3 overflow-x-auto my-2 border border-white/10" />
                                ),
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
}
