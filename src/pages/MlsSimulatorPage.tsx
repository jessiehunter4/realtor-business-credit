import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Seo from "@/components/shared/Seo";
import { toast } from "@/hooks/use-toast";
import {
  buildGuideUrl,
  buildLeadSlug,
  buildSimulatedEmail,
  type SimulatedEmail,
} from "@/lib/mlsLeadSlug";
import { Check, Copy, ExternalLink, FlaskConical, Mail } from "lucide-react";

interface SimResult {
  firstName: string;
  lastName: string;
  email: string;
  slug: string;
  url: string;
  mail: SimulatedEmail;
  sent: boolean;
  at: string;
}

const FLOW = `MLS
  -> EveryCatch (CRM)
    -> Generate slug (buildLeadSlug)
      -> Store custom field (rbc_slug)
        -> Send email
          -> Visitor opens /guide/:slug`;

const MlsSimulatorPage = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("John Paul");
  const [lastName, setLastName] = useState("Eltanal");
  const [email, setEmail] = useState("john@example.com");
  const [result, setResult] = useState<SimResult | null>(null);
  const [history, setHistory] = useState<SimResult[]>([]);
  const [copied, setCopied] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = buildLeadSlug(firstName, lastName);
    if (!slug) {
      toast({
        title: "Missing name",
        description: "Enter both a first and last name to generate a slug.",
        variant: "destructive",
      });
      return;
    }
    const url = buildGuideUrl(slug);
    setCopied(false);
    setResult({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      slug,
      url,
      mail: buildSimulatedEmail({ firstName, email, url }),
      sent: false,
      at: new Date().toLocaleTimeString(),
    });
  };

  const handleSimulateSend = () => {
    if (!result) return;
    const sent = { ...result, sent: true, at: new Date().toLocaleTimeString() };
    setResult(sent);
    setHistory((prev) => [sent, ...prev].slice(0, 8));
    toast({ title: "Email successfully simulated!", description: `Delivered to ${sent.email}` });
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4">
      <Seo
        title="MLS Lead Simulator — Internal Testing"
        description="Internal tool for generating personalized guide URLs and previewing simulated lead emails."
        noindex
      />
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-xl border border-amber-400/60 bg-amber-50 px-4 py-3 text-sm text-amber-900 flex items-start gap-2">
          <FlaskConical className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>
            <strong>Testing tool</strong> — not part of the public funnel. Nothing is stored and no
            email is actually sent.
          </span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>MLS Lead Simulation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sim-first">First Name</Label>
                  <Input
                    id="sim-first"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John Paul"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sim-last">Last Name</Label>
                  <Input
                    id="sim-last"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Eltanal"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sim-email">Email Address</Label>
                <Input
                  id="sim-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <Button type="submit">Generate</Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Generated link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Slug</p>
                <p className="font-mono text-lg">{result.slug}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Guide URL</p>
                <p className="font-mono text-sm break-all">{result.url}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy URL"}
                </Button>
                <Button size="sm" onClick={handleSimulateSend}>
                  <Mail className="h-4 w-4" />
                  Simulate Send
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/guide/${result.slug}`)}
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Guide
                </Button>
              </div>

              {result.sent && (
                <>
                  <div className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-primary font-medium">
                    Email successfully simulated!
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">To: </span>
                      <span className="font-medium">{result.mail.to}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Subject: </span>
                      <span className="font-medium">{result.mail.subject}</span>
                    </div>
                    <pre className="whitespace-pre-wrap rounded-lg bg-muted p-4 font-mono text-xs leading-relaxed">
                      {result.mail.body}
                    </pre>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Session history</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {history.map((h, i) => (
                  <li
                    key={`${h.slug}-${i}`}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2 last:border-0 last:pb-0"
                  >
                    <span className="font-mono">{h.slug}</span>
                    <span className="text-muted-foreground">{h.email}</span>
                    <span className="text-xs text-muted-foreground">{h.at}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Future production flow</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre rounded-lg bg-muted p-4 font-mono text-xs leading-relaxed overflow-x-auto">
              {FLOW}
            </pre>
            <p className="mt-3 text-sm text-muted-foreground">
              Slug and email generation live in <code>src/lib/mlsLeadSlug.ts</code>. Swapping this
              simulator for the real workflow means calling the same helpers from the MLS import and
              handing the email off to EveryCatch.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MlsSimulatorPage;
