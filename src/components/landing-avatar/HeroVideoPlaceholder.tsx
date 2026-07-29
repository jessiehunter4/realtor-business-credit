import { PlayCircle } from "lucide-react";

interface Props {
  /** Optional HeyGen embed URL. When provided, renders iframe instead of placeholder. */
  heygenEmbedUrl?: string;
  alt: string;
  className?: string;
}

/**
 * Large hero-sized video placeholder for HeyGen personalized greeting.
 * Swap-ready: pass `heygenEmbedUrl` to render the live embed.
 */
const HeroVideoPlaceholder = ({ heygenEmbedUrl, alt, className = "" }: Props) => {
  if (heygenEmbedUrl) {
    return (
      <div className={`relative aspect-video w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border shadow-card-hover ${className}`}>
        <iframe
          src={heygenEmbedUrl}
          title={alt}
          allow="autoplay; fullscreen; microphone; camera"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <figure className={`w-full ${className}`} aria-label={alt}>
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-hero-grad shadow-card-hover">
        <div className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full bg-background/85 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground backdrop-blur">
          Personalized video coming soon
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <PlayCircle
            className="h-20 w-20 sm:h-24 sm:w-24 text-primary drop-shadow-sm motion-safe:animate-pulse"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <p className="text-sm sm:text-base font-semibold text-secondary max-w-md">
            A personalized welcome from Jessie is coming here.
          </p>
        </div>
      </div>
    </figure>
  );
};

export default HeroVideoPlaceholder;