import { Link } from "react-router-dom";
import { ArrowRight, LucideIcon } from "lucide-react";
import VideoPlaceholder from "./VideoPlaceholder";

interface Props {
  number: number;
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel: string;
  ctaTo: string;
  ctaAnalyticsId: string;
  videoTitle: string;
  videoCaption?: string;
  videoStoragePath?: string;
  /** When true, video renders on the right on desktop; otherwise on the left. */
  reversed?: boolean;
}

const StepCard = ({
  number,
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaTo,
  ctaAnalyticsId,
  videoTitle,
  videoCaption,
  videoStoragePath,
  reversed = false,
}: Props) => {
  const numberLabel = String(number).padStart(2, "0");
  return (
    <li className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* Video */}
      <div className={`relative ${reversed ? "lg:order-2" : "lg:order-1"}`}>
        <div className="absolute -inset-3 bg-accent-grad rounded-3xl blur-2xl opacity-30 pointer-events-none" />
        <div className="relative">
          <VideoPlaceholder
            slotId={`step-${number}`}
            title={videoTitle}
            caption={videoCaption}
            fallbackStoragePath={videoStoragePath}
          />
        </div>
      </div>

      {/* Text */}
      <div className={`${reversed ? "lg:order-1" : "lg:order-2"}`}>
        <div className="flex items-center gap-3 text-primary">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
            {numberLabel}
          </span>
          <Icon className="h-5 w-5" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-wide">Step {number}</span>
        </div>
        <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-secondary tracking-tight text-balance">
          {title}
        </h3>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed text-pretty">
          {description}
        </p>
        <Link
          to={ctaTo}
          data-analytics-id={ctaAnalyticsId}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-card hover:shadow-card-hover hover:bg-primary/90 transition-all"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </li>
  );
};

export default StepCard;