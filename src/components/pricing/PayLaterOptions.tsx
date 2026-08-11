import { CreditCard, CalendarClock, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const options = [
  {
    name: "Klarna",
    icon: CalendarClock,
    blurb: "Split into interest-free installments",
    how: [
      "Choose Klarna on the secure Stripe checkout page.",
      "Sign in or create a Klarna account (takes about a minute).",
      "Pick a plan — commonly 4 interest-free payments every 2 weeks, or a longer monthly plan.",
      "Klarna pays us in full, so your enrollment starts right away.",
    ],
  },
  {
    name: "Affirm",
    icon: CreditCard,
    blurb: "Pay monthly over 3–12 months",
    how: [
      "Choose Affirm on the secure Stripe checkout page.",
      "Enter a few details for a quick eligibility check (no impact to your credit score to check).",
      "See your monthly payment options and terms before you commit.",
      "Confirm and your enrollment is activated immediately.",
    ],
  },
];

export default function PayLaterOptions() {
  return (
    <TooltipProvider delayDuration={100}>
      <div className="mt-8 rounded-2xl border border-border bg-white shadow-card p-5 md:p-6">
        <p className="text-center text-sm font-semibold text-secondary">
          Pay later options available at checkout
        </p>
        <p className="mt-1 text-center text-xs text-secondary/65">
          Card, debit, Klarna, and Affirm are all accepted. Hover an option to see how it works.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {options.map(({ name, icon: Icon, blurb, how }) => (
            <Tooltip key={name}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl border border-border bg-white p-4 text-left transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <span className="h-9 w-9 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-secondary">
                      {name}
                      <Info className="h-3.5 w-3.5 text-secondary/50" />
                    </span>
                    <span className="block text-xs text-secondary/65">{blurb}</span>
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="mb-1 font-semibold">How {name} works</p>
                <ol className="list-decimal space-y-1 pl-4 text-xs leading-snug">
                  {how.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <p className="mt-4 text-center text-[11px] text-secondary/55">
          Klarna and Affirm availability, terms, and approval are determined by those providers at
          checkout and may depend on your location and purchase amount.
        </p>
      </div>
    </TooltipProvider>
  );
}