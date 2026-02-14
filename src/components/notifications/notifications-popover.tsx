"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Notification {
    id: string;
    title: string;
    body: string | null;
    read: boolean;
    create_at: string;
    action_url: string | null;
}

export function NotificationsPopover() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const supabase = useMemo(() => createClient(), []);
    const router = useRouter();

    useEffect(() => {
        const fetchNotifications = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from("notifications")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(10);

            if (data) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setNotifications(data as any[]);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setUnreadCount(data.filter((n: any) => !n.read).length);
            }
        };

        fetchNotifications();

        // Subscribe to realtime changes
        const channel = supabase
            .channel("notifications-changes")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "notifications",
                },
                (payload) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    setNotifications((prev) => [payload.new as any, ...prev]);
                    setUnreadCount((prev) => prev + 1);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const handleMarkAsRead = async (id: string) => {
        await supabase.from("notifications").update({ read: true }).eq("id", id);
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const handleNotificationClick = async (n: Notification) => {
        if (!n.read) {
            await handleMarkAsRead(n.id);
        }
        setIsOpen(false);
        if (n.action_url) {
            router.push(n.action_url);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-white/70 hover:text-white hover:bg-white/10">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-black" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-black/90 border-white/10 text-white backdrop-blur-xl" align="end">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                        <span className="text-xs text-white/50">{unreadCount} unread</span>
                    )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-sm text-white/40">
                            No notifications
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={cn(
                                    "p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors",
                                    !notification.read ? "bg-white/[0.02]" : ""
                                )}
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <h5 className={cn("text-sm font-medium", !notification.read ? "text-white" : "text-white/70")}>
                                        {notification.title}
                                    </h5>
                                    {!notification.read && (
                                        <span className="h-2 w-2 mt-1.5 rounded-full bg-violet-500 shrink-0" />
                                    )}
                                </div>
                                {notification.body && (
                                    <p className="text-xs text-white/50 mt-1 line-clamp-2">
                                        {notification.body}
                                    </p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
