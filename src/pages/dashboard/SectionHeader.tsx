import { Badge } from "@/components/ui/badge";

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
      <div className="flex flex-wrap items-baseline gap-x-4">
        <h1 className="text-2xl font-bold text-secondary">{title}</h1>
        {subtitle && <Badge variant="secondary" className="text-[10px]">{subtitle}</Badge>}
      </div>
      {blurb && <p className="text-sm text-muted-foreground">{blurb}</p>}
    </header>
  );
}