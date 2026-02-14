"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slack, MessageCircle, AlertCircle, CheckCircle } from "lucide-react";

interface IntegrationsManagerProps {
    projectId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function IntegrationsManager({ projectId }: IntegrationsManagerProps) {
    // Mock implementations for now
    const [slackToken, setSlackToken] = useState("");
    const [slackChannel, setSlackChannel] = useState("");
    const [telegramToken, setTelegramToken] = useState("");
    const [telegramChatId, setTelegramChatId] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

    // TODO: Fetch existing integrations on mount

    const handleSave = async (provider: "slack" | "telegram") => {
        setIsSaving(true);
        setSaveStatus("idle");

        try {
            // TODO: Save to `integrations` table via API or Supabase client
            // Ideally should be a server action or API route to handle encryption later


            await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay

            setSaveStatus("success");
            setTimeout(() => setSaveStatus("idle"), 2000);
        } catch (error) {
            console.error("Failed to save integration:", error);
            setSaveStatus("error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Slack Integration */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#4A154B]/20">
                            <Slack className="h-5 w-5 text-[#E01E5A]" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Slack Integration</h3>
                            <p className="text-sm text-white/40">Connect a Slack bot to ingest channel history.</p>
                        </div>
                    </div>
                    <Switch />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Bot Token (Oauth Access Token)</Label>
                        <Input
                            type="password"
                            placeholder="xoxb-..."
                            value={slackToken}
                            onChange={e => setSlackToken(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Channel ID</Label>
                        <Input
                            placeholder="C12345678"
                            value={slackChannel}
                            onChange={e => setSlackChannel(e.target.value)}
                        />
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSave("slack")}
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save Configuration"}
                    </Button>
                </div>
            </div>

            {/* Telegram Integration */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#0088cc]/20">
                            <MessageCircle className="h-5 w-5 text-[#0088cc]" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Telegram Integration</h3>
                            <p className="text-sm text-white/40">Connect a Telegram bot to monitor group chats.</p>
                        </div>
                    </div>
                    <Switch />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Bot Token</Label>
                        <Input
                            type="password"
                            placeholder="123456:ABC-..."
                            value={telegramToken}
                            onChange={e => setTelegramToken(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Chat ID</Label>
                        <Input
                            placeholder="-100..."
                            value={telegramChatId}
                            onChange={e => setTelegramChatId(e.target.value)}
                        />
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSave("telegram")}
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save Configuration"}
                    </Button>
                </div>
            </div>

            {saveStatus === "success" && (
                <div className="fixed bottom-4 right-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in">
                    <CheckCircle className="h-4 w-4" />
                    Saved successfully
                </div>
            )}
            {saveStatus === "error" && (
                <div className="fixed bottom-4 right-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in">
                    <AlertCircle className="h-4 w-4" />
                    Failed to save
                </div>
            )}
        </div>
    );
}
