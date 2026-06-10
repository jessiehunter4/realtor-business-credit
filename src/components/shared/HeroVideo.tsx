import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  /** Storage path inside the site-videos bucket */
  storagePath?: string;
  /** Storage path for captions (WebVTT) inside the site-videos bucket */
  captionsPath?: string;
  /** Poster image shown before play / when no video uploaded yet */
  poster: string;
  /** Accessible label */
  alt: string;
  className?: string;
}

const HeroVideo = ({
  storagePath = "hero-jessie.mp4",
  captionsPath = "hero-jessie.vtt",
  poster,
  alt,
  className = "",
}: Props) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [captionsUrl, setCaptionsUrl] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // List the bucket to see if the file exists (avoids 404 console noise)
        const { data: files } = await supabase.storage
          .from("site-videos")
          .list("", { search: storagePath });

        const exists = files?.some((f) => f.name === storagePath);
        if (!exists) {
          if (!cancelled) setChecked(true);
          return;
        }

        const { data, error } = await supabase.storage
          .from("site-videos")
          .createSignedUrl(storagePath, 60 * 60); // 1 hour

        if (!cancelled) {
          if (!error && data?.signedUrl) setVideoUrl(data.signedUrl);
        }

        // Check for captions (optional)
        const { data: capFiles } = await supabase.storage
          .from("site-videos")
          .list("", { search: captionsPath });
        const capExists = capFiles?.some((f) => f.name === captionsPath);
        if (capExists) {
          const { data: capData } = await supabase.storage
            .from("site-videos")
            .createSignedUrl(captionsPath, 60 * 60);
          if (!cancelled && capData?.signedUrl) setCaptionsUrl(capData.signedUrl);
        }

        if (!cancelled) setChecked(true);
      } catch {
        if (!cancelled) setChecked(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [storagePath, captionsPath]);

  if (!checked) {
    // Show poster while we check; avoids flicker
    return (
      <img
        src={poster}
        alt={alt}
        className={className}
        width={1408}
        height={896}
      />
    );
  }

  if (!videoUrl) {
    return (
      <img
        src={poster}
        alt={alt}
        className={className}
        width={1408}
        height={896}
      />
    );
  }

  return (
    <video
      key={videoUrl}
      src={videoUrl}
      controls
      playsInline
      preload="metadata"
      className={className}
      aria-label={alt}
      crossOrigin="anonymous"
    >
      {captionsUrl && (
        <track
          kind="subtitles"
          src={captionsUrl}
          srcLang="en"
          label="English"
          default
        />
      )}
      Your browser does not support the video tag.
    </video>
  );
};

export default HeroVideo;