import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";
import StepVideoPlaceholder from "@/components/intake/StepVideoPlaceholder";

interface CTA {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
}

interface Props {
  stepNumber: number;
  title: string;
  description: string;
  icon?: LucideIcon;
  videoTitle: string;
  videoDescription?: string;
  heygenEmbedUrl?: string;
  ctas: CTA[];
  id?: string;
}

const StepCard = ({
  stepNumber,
  title,
  description,
  icon: Icon,
  videoTitle,
  videoDescription,
  heygenEmbedUrl,
  ctas,
  id,
}: Props) => {
  return (
    <article
      id={id}
      className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-card scroll-mt-24"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
          {stepNumber}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-primary" aria-hidden="true" />}
            <h3 className="text-xl sm:text-2xl font-bold text-secondary leading-tight">{title}</h3>
          </div>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {heygenEmbedUrl ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border">
          <iframe
            src={heygenEmbedUrl}
            title={videoTitle}
            allow="autoplay; fullscreen"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full"
          />
        </div>
      ) : (
        <StepVideoPlaceholder
          stepNumber={stepNumber}
          title={videoTitle}
          description={videoDescription}
        />
      )}

      <div className="mt-auto flex flex-col sm:flex-row gap-2">
        {ctas.map((cta, i) => {
          const isPrimary = (cta.variant ?? (i === 0 ? "primary" : "secondary")) === "primary";
          const base =
            "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 py-3 text-sm font-semibold transition-all";
          const styles = isPrimary
            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-card hover:shadow-card-hover"
            : "border border-border bg-background text-secondary hover:bg-muted";
          return (
            <Link
              key={cta.href}
              to={cta.href}
              data-analytics-id={`avatar-step-${stepNumber}-cta`}
              className={`${base} ${styles} flex-1`}
            >
              {cta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          );
        })}
      </div>
    </article>
  );
};

export default StepCard;