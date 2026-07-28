import { useEffect, useRef, useState } from "react";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskType,
} from "@heygen/streaming-avatar";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Play } from "lucide-react";

interface Props {
  greeting: string;
  avatarName?: string;
}

const DEFAULT_AVATAR = "Wayne_20240711";

const HeyGenAvatar = ({ greeting, avatarName = DEFAULT_AVATAR }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const avatarRef = useRef<StreamingAvatar | null>(null);
  const startedRef = useRef(false);
  const [status, setStatus] = useState<"loading" | "ready" | "needs-play" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    let cancelled = false;

    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("heygen-token");
        if (error || !data?.token) throw new Error(error?.message || "Missing token");
        if (cancelled) return;

        const avatar = new StreamingAvatar({ token: data.token });
        avatarRef.current = avatar;

        avatar.on(StreamingEvents.STREAM_READY, (event: any) => {
          if (!videoRef.current) return;
          videoRef.current.srcObject = event.detail;
          videoRef.current
            .play()
            .then(() => setStatus("ready"))
            .catch(() => setStatus("needs-play"));

          avatar
            .speak({ text: greeting, taskType: TaskType.REPEAT })
            .catch((e) => console.error("[HeyGen] speak error:", e));
        });

        await avatar.createStartAvatar({
          quality: AvatarQuality.Low,
          avatarName,
        });
      } catch (e: any) {
        console.error("[HeyGen] session error:", e);
        if (!cancelled) {
          setErrorMsg(e?.message || "Failed to start avatar");
          setStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
      avatarRef.current?.stopAvatar().catch(() => {});
      avatarRef.current = null;
    };
  }, [greeting, avatarName]);

  const handleManualPlay = async () => {
    try {
      await videoRef.current?.play();
      setStatus("ready");
    } catch (e) {
      console.error("[HeyGen] manual play failed:", e);
    }
  };

  if (status === "error") {
    return (
      <div className="rounded-2xl border border-border bg-white p-6 shadow-card max-w-2xl mx-auto text-center">
        <p className="text-secondary text-lg leading-relaxed whitespace-pre-line">{greeting}</p>
        <p className="mt-3 text-xs text-muted-foreground">
          Live avatar unavailable right now{errorMsg ? `: ${errorMsg}` : "."}
        </p>
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
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/90 text-white gap-3">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">Preparing your personal greeting…</p>
          </div>
        )}
        {status === "needs-play" && (
          <button
            onClick={handleManualPlay}
            className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/80 text-white gap-3 hover:bg-secondary/70 transition-colors"
          >
            <div className="rounded-full bg-primary p-4">
              <Play className="h-8 w-8 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-sm font-semibold">Play greeting</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default HeyGenAvatar;