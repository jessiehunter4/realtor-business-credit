import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  /** Storage path inside the site-videos bucket */
  storagePath?: string;
  /** Poster image shown before play / when no video uploaded yet */
  poster: string;
  /** Accessible label */
  alt: string;
  className?: string;
}

const HeroVideo = ({
  storagePath = "hero-jessie.mp4",
  poster,
  alt,
  className = "",
}: Props) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
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
          setChecked(true);
        }
      } catch {
        if (!cancelled) setChecked(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [storagePath]);

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
      poster={poster}
      controls
      playsInline
      preload="metadata"
      className={className}
      aria-label={alt}
    >
      Your browser does not support the video tag.
    </video>
  );
};

export default HeroVideo;