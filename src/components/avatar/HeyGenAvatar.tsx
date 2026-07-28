import { useEffect, useMemo, useRef, useState } from "react";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskType,
} from "@heygen/streaming-avatar";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Sparkles } from "lucide-react";
import HeroVideo from "@/components/shared/HeroVideo";

interface Props {
  greeting: string;
  avatarName?: string;
}

const DEFAULT_AVATAR = "Wayne_20240711";
type AvatarStatus = "loading" | "ready" | "needs-play" | "fallback";
type StreamReadyEvent = { detail?: MediaStream };

const HeyGenAvatar = ({ greeting, avatarName = DEFAULT_AVATAR }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const avatarRef = useRef<StreamingAvatar | null>(null);
  const startedRef = useRef(false);
  const [status, setStatus] = useState<AvatarStatus>("loading");
  const spokenGreeting = useMemo(() => greeting.trim(), [greeting]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    let cancelled = false;

    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("heygen-token");
        if (error) {
          throw new Error(error.message || "Live avatar unavailable");
        }
        if (!data?.token) {
          if (!cancelled) setStatus("fallback");
          return;
        }
        if (cancelled) return;

        const avatar = new StreamingAvatar({ token: data.token });
        avatarRef.current = avatar;

        avatar.on(StreamingEvents.STREAM_READY, (event: StreamReadyEvent) => {
          if (!videoRef.current || !event.detail) return;
          videoRef.current.srcObject = event.detail;
          videoRef.current
            .play()
            .then(() => setStatus("ready"))
            .catch(() => setStatus("needs-play"));

          avatar
            .speak({ text: spokenGreeting, taskType: TaskType.REPEAT })
            .catch((e) => console.warn("[HeyGen] speak unavailable:", e));
        });

        await avatar.createStartAvatar({
          quality: AvatarQuality.Low,
          avatarName,
        });
      } catch (e) {
        console.info("[HeyGen] live avatar unavailable; showing text greeting instead.", e);
        if (!cancelled) {
          setStatus("fallback");
        }
      }
    })();

    return () => {
      cancelled = true;
      avatarRef.current?.stopAvatar().catch(() => {});
      avatarRef.current = null;
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
          <HeroVideo alt="Personal welcome from Jessie Hunter" />
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Personal welcome</p>
          <p className="mt-2 text-secondary text-base leading-relaxed whitespace-pre-line">{spokenGreeting}</p>
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