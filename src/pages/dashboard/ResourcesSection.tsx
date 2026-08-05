import { ExternalLink, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FOUNDATION_RESOURCES } from "@/data/foundationResources";
import SectionHeader from "./SectionHeader";
import { useDashboardCtx } from "./DashboardLayout";

export default function ResourcesSection() {
  const { tier } = useDashboardCtx();
  const unlocked = tier.capabilities.resourceLibrary;

  return (
    <>
      <SectionHeader
        title="Foundation Resources"
        subtitle={unlocked ? "Included with your plan" : "DIY and above"}
        blurb="Vetted providers and walkthroughs for the structural pieces: virtual office, directory-listed phone, EIN, entity, banking, and bureau registration."
      />

      {!unlocked && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2 font-semibold text-secondary">
              <Lock className="h-4 w-4 text-primary" /> Unlock the resource library
            </div>
            <p className="text-sm text-muted-foreground">
              Tracking your plan is free and stays free. The DIY plan ($497) adds the provider directory and step-by-step
              walkthroughs for each foundation item below — so you're not guessing which virtual office or phone service
              actually gets you listed.
            </p>
            <Link to="/checkout?tier=self-paced">
              <Button className="rounded-full">Upgrade to DIY — $497</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {FOUNDATION_RESOURCES.map((r) => (
          <Card key={r.id} className="h-full">
            <CardContent className="p-4 space-y-2">
              <h2 className="font-semibold text-secondary">{r.title}</h2>
              <p className="text-sm text-muted-foreground">{r.blurb}</p>

              {unlocked ? (
                <>
                  <p className="text-xs text-muted-foreground leading-relaxed">{r.what}</p>
                  <ul className="space-y-1.5 pt-1">
                    {r.providers.map((p) => (
                      <li key={p.name}>
                        <a
                          href={p.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                        >
                          {p.name} <ExternalLink className="h-3 w-3" />
                        </a>
                        <p className="text-xs text-muted-foreground">{p.note}</p>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <Lock className="h-3 w-3" /> {r.providers.length} vetted providers + walkthrough
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Providers are listed for convenience. We're not compensated for these links, and this isn't legal or tax advice.
      </p>
    </>
  );
}