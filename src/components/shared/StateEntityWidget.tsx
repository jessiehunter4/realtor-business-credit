import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, MapPin } from "lucide-react";

/**
 * State-by-state quick guidance on holding a real estate license under an entity.
 *
 * IMPORTANT: This is plain-English summary only — not legal advice. The note explicitly
 * tells users to confirm with their state licensing board, attorney, and CPA.
 * Sources are linked directly to each state regulator.
 */

type Posture = "license-in-entity-restricted" | "entity-allowed" | "check-state";

interface StateNote {
  name: string;
  posture: Posture;
  summary: string;
  source: { label: string; url: string };
}

const NOTES: Record<string, StateNote> = {
  CA: {
    name: "California",
    posture: "license-in-entity-restricted",
    summary:
      "California generally does NOT allow a real estate license to be held by an LLC. A licensed broker may form a corporation that itself is licensed (a corporate broker license). Many CA agents instead operate a separate business entity for marketing, expenses, and tax purposes while their license stays under the broker.",
    source: { label: "CA DRE — Corporations & LLCs", url: "https://www.dre.ca.gov/Licensees/CorpLLC.html" },
  },
  NY: {
    name: "New York",
    posture: "license-in-entity-restricted",
    summary:
      "New York generally does not license LLCs as real estate brokers. Licensed brokers may form corporations or partnerships that hold a broker license. Salespersons typically affiliate with a licensed broker, and any business entity for tax/expense purposes is separate from the license.",
    source: { label: "NY DOS — Real Estate Licensing", url: "https://dos.ny.gov/real-estate-broker" },
  },
  FL: {
    name: "Florida",
    posture: "entity-allowed",
    summary:
      "Florida allows a sales associate or broker associate to register as a P.A., LLC, or PLLC for the purpose of receiving compensation. Brokers may form licensed brokerage entities. Confirm the registration steps with the Florida DBPR before relying on this.",
    source: { label: "FL DBPR — Real Estate", url: "https://www2.myfloridalicense.com/dbpr/real-estate/" },
  },
  TX: {
    name: "Texas",
    posture: "entity-allowed",
    summary:
      "Texas permits a Business Entity Broker License — a corporation, LLC, or LP can be licensed as a broker provided it has a designated broker. Sales agents themselves are not licensed in entity form but commonly use a separate entity for tax/expense purposes.",
    source: { label: "TREC — Business Entity License", url: "https://www.trec.texas.gov/become-licensed/business-entity-broker" },
  },
  GA: {
    name: "Georgia",
    posture: "entity-allowed",
    summary:
      "Georgia allows corporations, LLCs, and partnerships to be licensed as a real estate firm with a qualifying broker. Individual licensees typically operate under that licensed firm. A separate business entity for tax/expense purposes is common.",
    source: { label: "GREC — Licensing", url: "https://grec.state.ga.us/" },
  },
  AZ: {
    name: "Arizona",
    posture: "entity-allowed",
    summary:
      "Arizona permits professional LLCs (PLLCs) and entities to be licensed under specific rules with a designated broker. Confirm setup with the Arizona Department of Real Estate.",
    source: { label: "AZ DRE", url: "https://azre.gov/" },
  },
  CO: {
    name: "Colorado",
    posture: "entity-allowed",
    summary:
      "Colorado allows brokerage firms to be licensed as corporations, LLCs, or partnerships with an employing broker. Individual brokers can also receive commissions through an entity in many cases — confirm with DORA.",
    source: { label: "CO DORA — Real Estate", url: "https://dpo.colorado.gov/RealEstate" },
  },
  WA: {
    name: "Washington",
    posture: "entity-allowed",
    summary:
      "Washington licenses real estate firms (corporations, LLCs, partnerships) with a designated broker. A separate entity for tax/expense purposes is common for individual brokers.",
    source: { label: "WA DOL — Real Estate", url: "https://www.dol.wa.gov/business/realestate/" },
  },
  IL: {
    name: "Illinois",
    posture: "entity-allowed",
    summary:
      "Illinois allows LLCs and corporations to hold a broker license through IDFPR with a designated managing broker. Confirm requirements before relying on this.",
    source: { label: "IDFPR — Real Estate", url: "https://idfpr.illinois.gov/profs/realestate.html" },
  },
  NV: {
    name: "Nevada",
    posture: "entity-allowed",
    summary:
      "Nevada licenses brokerage entities and permits broker-salespersons and salespersons to receive commissions through a business entity if registered properly with the Real Estate Division.",
    source: { label: "NV Real Estate Division", url: "https://red.nv.gov/" },
  },
};

const STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
  "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
  "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming","District of Columbia",
];

const STATE_TO_CODE: Record<string, string> = {
  California: "CA", "New York": "NY", Florida: "FL", Texas: "TX", Georgia: "GA",
  Arizona: "AZ", Colorado: "CO", Washington: "WA", Illinois: "IL", Nevada: "NV",
};

const POSTURE_BADGE: Record<Posture, { label: string; className: string }> = {
  "license-in-entity-restricted": {
    label: "License in entity: restricted",
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
  "entity-allowed": {
    label: "Entity licensing allowed",
    className: "bg-primary/10 text-primary border-primary/30",
  },
  "check-state": {
    label: "Check with your state",
    className: "bg-muted text-muted-foreground border-border",
  },
};

interface Props {
  /** Optional initial state name (full, e.g. "California"). */
  initialState?: string;
  /** When false, the section header is hidden (use inside larger forms). */
  showHeader?: boolean;
}

const StateEntityWidget = ({ initialState, showHeader = true }: Props) => {
  const [state, setState] = useState<string>(initialState ?? "");

  const note = useMemo<StateNote | null>(() => {
    if (!state) return null;
    const code = STATE_TO_CODE[state];
    if (code && NOTES[code]) return NOTES[code];
    return {
      name: state,
      posture: "check-state",
      summary:
        "We don't yet have a curated note for this state. Most U.S. states allow licensed real estate firms (corporations, LLCs, or partnerships) to hold a broker license, but rules for individual licensees vary widely. Confirm with your state licensing board, your broker, and your attorney/CPA before forming or restructuring an entity.",
      source: {
        label: "ARELLO — find your state regulator",
        url: "https://www.arello.com/regulator-info/",
      },
    };
  }, [state]);

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary">
            <MapPin className="h-3.5 w-3.5" />
            State-specific entity guidance
          </div>
          <h3 className="text-xl font-semibold text-secondary">
            Can my real estate license be held under an LLC or corporation?
          </h3>
          <p className="text-sm text-muted-foreground">
            Choose your license state for a plain-English summary. This is education only — not
            legal or tax advice.
          </p>
        </div>
      )}

      <div className="max-w-sm space-y-2">
        <Label htmlFor="state-entity-select">My license state</Label>
        <Select value={state} onValueChange={setState}>
          <SelectTrigger id="state-entity-select">
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            {STATES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {note && (
        <Card className="border-border/60">
          <CardContent className="p-5 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-secondary">{note.name}</span>
              <span
                className={`inline-flex items-center text-[11px] uppercase tracking-wide font-medium border rounded-full px-2 py-0.5 ${POSTURE_BADGE[note.posture].className}`}
              >
                {POSTURE_BADGE[note.posture].label}
              </span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">{note.summary}</p>
            <a
              href={note.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              {note.source.label}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <p className="text-xs text-muted-foreground pt-2 border-t border-border/40">
              Always confirm with your state licensing board, your broker, and your attorney/CPA
              before forming or restructuring a business entity.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StateEntityWidget;