import { Check, X } from "lucide-react";

const IS = ["Educational", "Planning-focused", "Coaching-supported"];
const IS_NOT = ["Legal advice", "Tax advice", "Investment advice"];

const WhatThisIs = () => (
  <section className="container mx-auto px-4 py-12 md:py-16">
    <div className="max-w-4xl mx-auto rounded-3xl border border-border bg-card p-6 md:p-10 shadow-card">
      <h2 className="text-2xl md:text-3xl font-bold text-secondary text-center tracking-tight">
        What this program is — and what it isn't
      </h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-success-green/30 bg-success-green/5 p-5">
          <p className="text-sm font-bold uppercase tracking-wide text-success-green">This program is</p>
          <ul className="mt-3 space-y-2.5">
            {IS.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-base font-medium text-secondary">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success-green text-white">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
          <p className="text-sm font-bold uppercase tracking-wide text-destructive">
            This program is not
          </p>
          <ul className="mt-3 space-y-2.5">
            {IS_NOT.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-base font-medium text-secondary">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white">
                  <X className="h-4 w-4" aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Always consult your broker, attorney, and tax professional for your specific situation.
      </p>
    </div>
  </section>
);

export default WhatThisIs;