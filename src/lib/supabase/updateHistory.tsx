// src/lib/history/saveHistory.ts
import { createClient } from "@/utils/supabase/client";

interface SaveHistoryParams {
    userId: string;
    originalText: string;
    processedText: string;
    action: "enhance" | "paraphrase" | "translate";
    language?: string;
}

export async function saveHistory({
    userId,
    originalText,
    processedText,
    action,
    language,
}: SaveHistoryParams) {
    const supabase = createClient();

    const { error } = await supabase.from("history").insert({
        user_id: userId,
        original_text: originalText,
        processed_text: processedText,
        action,
        language: language ?? null,
    });

    if (error) {
        console.error("Failed to save history:", error.message);
        return false;
    }

    return true;
}