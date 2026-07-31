import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  /** Storage path inside the site-videos bucket */
  storagePath?: string;
  /** Storage path for captions (WebVTT) inside the site-videos bucket */
  captionsPath?: string;
  /** Optional poster image shown before play / when no video uploaded yet */
  poster?: string;
  /** Accessible label */
  alt: string;
  className?: string;
}

const HeroVideo = ({
  storagePath = "public/hero-jessie.mp4",
  captionsPath = "public/hero-jessie.vtt",
  poster,
  alt,
  className = "",
}: Props) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [captionsUrl, setCaptionsUrl] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const splitPath = (p: string) => {
      const idx = p.lastIndexOf("/");
      return idx === -1
        ? { folder: "", file: p }
        : { folder: p.slice(0, idx), file: p.slice(idx + 1) };
    };
    (async () => {
      try {
        const video = splitPath(storagePath);
        const captions = splitPath(captionsPath);
        // List the bucket to see if the file exists (avoids 404 console noise)
        const { data: files } = await supabase.storage
          .from("site-videos")
          .list(video.folder, { search: video.file });

        const exists = files?.some((f) => f.name === video.file);
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
          .list(captions.folder, { search: captions.file });
        const capExists = capFiles?.some((f) => f.name === captions.file);
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

  if (!checked || !videoUrl) {
    if (poster) {
      return (
        <img
          src={poster}
          alt={alt}
          className={`${className} w-full h-full object-cover`}
          width={1408}
          height={896}
        />
      );
    }
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${className} w-full h-full bg-secondary`}
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
      className={`${className} w-full h-full object-cover`}
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