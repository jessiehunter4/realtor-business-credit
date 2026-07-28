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
  const hlsRef = useRef<any>(null);
  const startedRef = useRef(false);
  const [status, setStatus] = useState<AvatarStatus>("loading");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
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
          throw new Error(error.message || "Live avatar unavailable");
        }

        if (!data?.hls_url) {
          setErrorDetail(data?.error || "HeyGen did not return a video URL.");
          if (!cancelled) setStatus("fallback");
          return;
        }

        if (cancelled) return;

        const video = videoRef.current;
        if (!video) {
          setStatus("fallback");
          return;
        }

        const canPlayNativeHls =
          video.canPlayType("application/vnd.apple.mpegurl") !== "";

        if (canPlayNativeHls) {
          video.src = data.hls_url;
          video.addEventListener("loadeddata", () => {
            if (!cancelled) setStatus("ready");
          });
          video.addEventListener("error", () => {
            if (!cancelled) setStatus("fallback");
          });
          video
            .play()
            .then(() => setStatus("ready"))
            .catch(() => setStatus("needs-play"));
        } else {
          const Hls = (await import("hls.js")).default;
          if (cancelled) return;

          if (Hls.isSupported()) {
            const hls = new Hls({
              maxBufferLength: 30,
              maxMaxBufferLength: 60,
            });
            hlsRef.current = hls;
            hls.loadSource(data.hls_url);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              video
                .play()
                .then(() => setStatus("ready"))
                .catch(() => setStatus("needs-play"));
            });

            hls.on(Hls.Events.ERROR, (_event: any, dataError: any) => {
              console.warn("[HeyGen] HLS error:", dataError);
              if (dataError?.fatal && !cancelled) {
                setStatus("fallback");
              }
            });
          } else {
            video.src = data.hls_url;
            video
              .play()
              .then(() => setStatus("ready"))
              .catch(() => setStatus("needs-play"));
          }
        }
      } catch (e) {
        console.warn("[HeyGen] live avatar unavailable; showing video fallback.", e);
        if (!cancelled) {
          setErrorDetail(e instanceof Error ? e.message : "Unknown error");
          setStatus("fallback");
        }
      }
    })();

    return () => {
      cancelled = true;
      try {
        hlsRef.current?.destroy();
      } catch {
        // ignore
      }
      hlsRef.current = null;
    };
  }, [spokenGreeting, avatarName]);

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
          {errorDetail && (
            <p className="mt-2 text-xs text-muted-foreground">{errorDetail}</p>
          )}
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
            className="absolute inset-0 h-full w-full rounded-none flex flex-col items-center justify-center bg-secondary/80 text-secondary-foreground gap-3 hover:bg-secondary/70"
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
