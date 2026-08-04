export interface FoundationResource {
  id: string;
  title: string;
  blurb: string;
  what: string;
  providers: Array<{ name: string; note: string; href: string }>;
}

/** DIY-tier resource library for the foundation steps. */
export const FOUNDATION_RESOURCES: FoundationResource[] = [
  {
    id: "virtual-office",
    title: "Business virtual office address",
    blurb: "A real, non-P.O.-Box business address underwriters and data providers can verify.",
    what:
      "A commercial address you can list on filings, your D-U-N-S record, and credit applications. Most Realtors use a virtual office or coworking plan with mail handling.",
    providers: [
      { name: "Regus / Spaces virtual office", note: "Nationwide commercial addresses with mail handling", href: "https://www.regus.com/en-us/united-states/virtual-office" },
      { name: "Alliance Virtual Offices", note: "Address + live receptionist bundles", href: "https://www.alliancevirtualoffices.com/" },
      { name: "Local coworking space", note: "Often the cheapest verifiable option in your market", href: "https://www.coworker.com/" },
    ],
  },
  {
    id: "business-phone",
    title: "Business phone listed in directories",
    blurb: "A dedicated business line that shows up in 411/national directory listings.",
    what:
      "A separate number in the business name, listed publicly. Directory listing is the part most people skip — and it's the part lenders check.",
    providers: [
      { name: "RingCentral", note: "Business VoIP with directory listing support", href: "https://www.ringcentral.com/" },
      { name: "Grasshopper", note: "Simple single-line business number", href: "https://grasshopper.com/" },
      { name: "ListYourself.net", note: "Free national 411 directory listing", href: "https://www.listyourself.net/" },
    ],
  },
  {
    id: "ein",
    title: "EIN (Employer Identification Number)",
    blurb: "Your business tax ID — free, direct from the IRS, usually issued the same day.",
    what:
      "Apply directly with the IRS. Never pay a third party for an EIN. Use your exact legal entity name and business address so everything matches later.",
    providers: [
      { name: "IRS EIN application", note: "Free, online, issued immediately during business hours", href: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online" },
    ],
  },
  {
    id: "entity",
    title: "Entity formation & registered agent",
    blurb: "Form the entity your attorney/CPA recommends for your state and license.",
    what:
      "Real estate license rules vary by state — confirm with your broker, attorney, and CPA before filing. Keep the entity name identical everywhere it appears.",
    providers: [
      { name: "Your state's Secretary of State", note: "Always the cheapest route to file directly", href: "https://www.usa.gov/state-business" },
      { name: "Northwest Registered Agent", note: "Formation + registered agent service", href: "https://www.northwestregisteredagent.com/" },
    ],
  },
  {
    id: "banking-books",
    title: "Business bank account & bookkeeping",
    blurb: "A dedicated account in the entity's name, plus books that stay clean.",
    what:
      "Open the account with your EIN and formation docs. Route every commission and business expense through it — mixed accounts are the single biggest fundability killer.",
    providers: [
      { name: "Relay / Mercury / local business banking", note: "Business checking with sub-accounts", href: "https://relayfi.com/" },
      { name: "QuickBooks Online", note: "Standard for CPA-ready books", href: "https://quickbooks.intuit.com/" },
    ],
  },
  {
    id: "web-email",
    title: "Business domain, email & website",
    blurb: "A custom-domain email and a live site that matches your filings.",
    what:
      "Free email domains (gmail, yahoo) are a common decline reason. Your website should show the same name, address, and phone as your applications.",
    providers: [
      { name: "Google Workspace", note: "Custom-domain business email", href: "https://workspace.google.com/" },
      { name: "Namecheap / Cloudflare", note: "Domain registration", href: "https://www.namecheap.com/" },
    ],
  },
  {
    id: "bureaus",
    title: "Business credit bureau registration",
    blurb: "Get on file with D&B, Experian Business, and Equifax Small Business.",
    what:
      "Start with the free D-U-N-S request. Your file has to exist before any payment history can be scored.",
    providers: [
      { name: "Dun & Bradstreet D-U-N-S", note: "Free, allow up to 30 days", href: "https://www.dnb.com/duns-number/get-a-duns.html" },
      { name: "Experian Business", note: "Check whether a file already exists", href: "https://www.experian.com/small-business/business-credit" },
      { name: "Equifax Small Business", note: "Builds from reporting tradelines", href: "https://www.equifax.com/business/small-business/" },
    ],
  },
];