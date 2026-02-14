import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@/lib/supabase/admin";

export async function createNotification(
    userId: string,
    projectId: string | null,
    title: string,
    body: string,
    actionUrl?: string
) {
    const supabase = createAdminClient();
    const { error } = await supabase.from("notifications").insert({
        user_id: userId,
        project_id: projectId,
        title,
        body,
        action_url: actionUrl,
        read: false,
    });

    if (error) {
        console.error("Failed to create notification:", error);
        throw error;
    }
}

export async function markAsRead(notificationId: string) {
    const supabase = createClient();
    const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

    if (error) {
        console.error("Failed to mark notification as read:", error);
        throw error;
    }
}

export async function markAllAsRead(userId: string) {
    const supabase = createClient();
    const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId);

    if (error) {
        console.error("Failed to mark all notifications as read:", error);
        throw error;
    }
}
