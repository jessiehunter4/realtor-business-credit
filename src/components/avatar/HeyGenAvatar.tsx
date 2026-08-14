import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Sparkles } from "lucide-react";
import HeroVideo from "@/components/shared/HeroVideo";

interface Props {
  greeting: string;
  fallbackMessage?: string;
  avatarName?: string;
}

type AvatarStatus = "loading" | "ready" | "needs-play" | "fallback";

const HeyGenAvatar = ({
  greeting,
  fallbackMessage,
  avatarName,
}: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);
  const [status, setStatus] = useState<AvatarStatus>("loading");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const spokenGreeting = useMemo(() => greeting.trim(), [greeting]);


  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    let cancelled = false;

    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("heygen-token", {
          body: {
            greeting: spokenGreeting,
            avatar_id: avatarName,
          },
        });

        if (error) {
          throw new Error(error.message || "Avatar video unavailable");
        }

        if (!data?.video_url) {
          if (!cancelled) setStatus("fallback");
          return;
        }

        if (cancelled) return;

        setVideoUrl(data.video_url);
      } catch (e) {
        console.warn("[HeyGen] avatar video unavailable; showing fallback.", e);
        if (!cancelled) setStatus("fallback");
      }

    })();

    return () => {
      cancelled = true;
    };
  }, [spokenGreeting, avatarName]);

  useEffect(() => {
    if (!videoUrl) return;
    const video = videoRef.current;
    if (!video) return;

    video.src = videoUrl;
    video.load();

    const handleLoaded = () => setStatus("ready");
    const handleError = () => setStatus("fallback");

    video.addEventListener("loadeddata", handleLoaded);
    video.addEventListener("error", handleError);

    const playPromise = video.play();
    playPromise.catch(() => setStatus("needs-play"));

    return () => {
      video.removeEventListener("loadeddata", handleLoaded);
      video.removeEventListener("error", handleError);
    };
  }, [videoUrl]);

  const handleManualPlay = async () => {
    try {
      await videoRef.current?.play();
      setStatus("ready");
    } catch (e) {
      console.warn("[HeyGen] manual play unavailable:", e);
    }
  };

  if (status === "fallback") {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-secondary shadow-card-hover border border-border">
          <HeroVideo alt="Personal welcome from RE Pro Business Credit" />
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Personal welcome</p>
          <p className="mt-2 text-secondary text-base leading-relaxed whitespace-pre-line">
            {fallbackMessage || spokenGreeting}
          </p>
        </div>
      </div>

    );
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-secondary shadow-card-hover border border-border">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={false}
          controls
          className="w-full h-full object-cover"
        />
        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/90 text-secondary-foreground gap-3">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">Preparing your personal greeting…</p>
          </div>
        )}
        {status === "needs-play" && (
          <Button
            type="button"
            onClick={handleManualPlay}
            variant="secondary"
            className="absolute inset-0 h-full w-full rounded-none flex flex-col items-center justify-center bg-secondary/80 text-secondary-foreground gap-3 hover:bg-success-green/90 hover:text-white active:bg-success-green-hover"
          >
            <div className="rounded-full bg-primary p-4">
              <Play className="h-8 w-8 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-sm font-semibold">Play greeting</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default HeyGenAvatar;
