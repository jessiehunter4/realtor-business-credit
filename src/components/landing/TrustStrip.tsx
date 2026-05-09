import { Award, MapPin, ShieldCheck, GraduationCap } from "lucide-react";

const items = [
  { icon: Award, label: "14+ years brokering" },
  { icon: MapPin, label: "Licensed CA & GA" },
  { icon: ShieldCheck, label: "Certified Credit Suite Partner" },
  { icon: GraduationCap, label: "Educational — not legal/tax advice" },
];

const TrustStrip = () => (
  <div className="bg-secondary/95 border-y border-primary/20 text-secondary-foreground">
    <div className="container mx-auto px-4 py-3">
      <ul className="flex flex-wrap justify-center md:justify-between items-center gap-x-6 gap-y-2 text-xs md:text-sm">
        {items.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2 text-secondary-foreground/85">
            <Icon className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="font-medium">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default TrustStrip;