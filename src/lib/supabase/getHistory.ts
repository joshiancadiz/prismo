import { createClient } from "@/utils/supabase/client";

export interface HistoryRecord {
    id: string;
    action: "enhance" | "paraphrase" | "translate";
    original_text: string;
    processed_text: string;
    language: string | null;
    created_at: string;
}

export async function getHistory(): Promise<HistoryRecord[]> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from("history")
        .select("id, action, original_text, processed_text, language, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Failed to fetch history:", error.message);
        return [];
    }

    return data as HistoryRecord[];
}

export async function getHistoryById(id: string): Promise<HistoryRecord | null> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from("history")
        .select("id, action, original_text, processed_text, language, created_at")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (error) {
        console.error("Failed to fetch history item:", error.message);
        return null;
    }

    return data as HistoryRecord;
}
