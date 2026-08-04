export default function SectionHeader({
  title,
  subtitle,
  blurb,
}: {
  title: string;
  subtitle?: string;
  blurb?: string;
}) {
  return (
    <header className="space-y-1">
      <div className="flex flex-wrap items-baseline gap-x-3">
        <h1 className="text-2xl font-bold text-secondary">{title}</h1>
        {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
      </div>
      {blurb && <p className="text-sm text-muted-foreground">{blurb}</p>}
    </header>
  );
}