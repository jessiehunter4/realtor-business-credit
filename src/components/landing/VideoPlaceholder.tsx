import { useEffect, useState } from "react";
import { PlayCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import HeroVideo from "@/components/shared/HeroVideo";

interface Props {
  slotId: string;
  title: string;
  caption?: string;
  /** Optional Supabase `site-videos` bucket path. When present and file exists, plays it. */
  fallbackStoragePath?: string;
  /** Future HeyGen wiring — when set, render a HeyGen embed instead of the placeholder. */
  heygenVideoId?: string;
  className?: string;
}

/**
 * Reusable video slot. Renders one of three states:
 *  1. HeyGen embed (future — when `heygenVideoId` is provided)
 *  2. Uploaded video from Supabase Storage (when `fallbackStoragePath` exists in bucket)
 *  3. Branded "Video coming soon" placeholder
 *
 * Swapping to a real HeyGen embed later only requires changing this file.
 */
const VideoPlaceholder = ({
  slotId,
  title,
  caption,
  fallbackStoragePath,
  heygenVideoId,
  className = "",
}: Props) => {
  const [hasStorageVideo, setHasStorageVideo] = useState<boolean | null>(
    fallbackStoragePath ? null : false
  );

  useEffect(() => {
    if (!fallbackStoragePath) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase.storage
          .from("site-videos")
          .list("", { search: fallbackStoragePath });
        const exists = !!data?.some((f) => f.name === fallbackStoragePath);
        if (!cancelled) setHasStorageVideo(exists);
      } catch {
        if (!cancelled) setHasStorageVideo(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fallbackStoragePath]);

  // Future: HeyGen embed
  if (heygenVideoId) {
    return (
      <div
        className={`relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-secondary shadow-card-hover ${className}`}
        data-slot-id={slotId}
      >
        <iframe
          src={`https://app.heygen.com/embeds/${heygenVideoId}`}
          title={title}
          allow="autoplay; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  // Uploaded video from Supabase Storage
  if (fallbackStoragePath && hasStorageVideo) {
    return (
      <div
        className={`relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-secondary shadow-card-hover ${className}`}
        data-slot-id={slotId}
      >
        <HeroVideo storagePath={fallbackStoragePath} alt={title} />
      </div>
    );
  }

  // Branded placeholder
  return (
    <figure
      className={`w-full ${className}`}
      aria-label={`Video placeholder: ${title}`}
      data-slot-id={slotId}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-hero-grad shadow-card">
        <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground backdrop-blur">
            Video coming soon
          </span>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <PlayCircle
            className="h-16 w-16 text-primary drop-shadow-sm motion-safe:animate-pulse"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <p className="text-sm font-semibold text-secondary">{title}</p>
          {caption && (
            <p className="max-w-xs text-xs text-muted-foreground">{caption}</p>
          )}
        </div>
      </div>
    </figure>
  );
};

export default VideoPlaceholder;