import { supabase } from "@/integrations/supabase/client";
import {
  DEFAULT_GUIDE_SLUG,
  normalizeCompleted,
  type GuideProgress,
  type GuideSlug,
} from "./guideProgress";

/**
 * Server-backed copy of the reader's guide progress so a signed-in reader can
 * resume on any device. Every call is best-effort: failures never surface to
 * the reader, the local store stays authoritative for rendering.
 */

export const fetchRemoteProgress = async (
  userId: string,
  slug: GuideSlug = DEFAULT_GUIDE_SLUG,
): Promise<GuideProgress | null> => {
  try {
    const { data, error } = await supabase
      .from("guide_progress")
      .select("last_section_id, completed, updated_at")
      .eq("user_id", userId)
      .eq("guide_slug", slug)
      .maybeSingle();
    if (error || !data) return null;
    return {
      completed: normalizeCompleted(Array.isArray(data.completed) ? data.completed : []),
      lastSectionId: data.last_section_id ?? null,
      updatedAt: data.updated_at ? new Date(data.updated_at).getTime() : 0,
    };
  } catch {
    return null;
  }
};

export const upsertRemoteProgress = async (
  userId: string,
  progress: GuideProgress,
  slug: GuideSlug = DEFAULT_GUIDE_SLUG,
): Promise<void> => {
  try {
    await supabase.from("guide_progress").upsert(
      {
        user_id: userId,
        guide_slug: slug,
        last_section_id: progress.lastSectionId,
        completed: progress.completed,
        updated_at: new Date(progress.updatedAt || Date.now()).toISOString(),
      },
      { onConflict: "user_id,guide_slug" },
    );
  } catch {
    // best-effort only
  }
};
