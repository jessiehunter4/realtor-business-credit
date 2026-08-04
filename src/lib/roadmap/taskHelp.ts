import type { TaskHelp } from "./types";

/**
 * Plain-English help content for the dashboard "?" bubbles.
 * Keyed by CatalogTask.key. Educational only — not legal or tax advice.
 */
export const TASK_HELP: Record<string, TaskHelp> = {
  entity_formed: {
    what:
      "Deciding how your real estate business is legally organized — sole proprietor, LLC, S-Corp, or corporation — and getting it registered with your state.",
    why:
      "Business credit is issued to a business, not a person. Until there is an entity with its own name and registration, there is nothing for a vendor or bureau to build a file on.",
    doneLooksLike:
      "You have state filing paperwork in hand with an exact legal name you can use consistently on every application.",
    mistakes: [
      "Picking a structure off a forum post instead of asking your attorney and CPA — every state treats real estate licensees differently.",
      "Using slightly different versions of the business name across filings, bank, and applications.",
    ],
  },
  ein_obtained: {
    what:
      "Your Employer Identification Number — the business version of a Social Security Number, issued free by the IRS.",
    why:
      "Bank accounts, vendor accounts, and EIN-tied credit cards all key off this number. It is what lets activity be tracked to the business instead of to you personally.",
    doneLooksLike:
      "You have your EIN confirmation letter saved somewhere you can find it in 10 seconds.",
    mistakes: [
      "Paying a third-party service — the IRS issues EINs for free online in about 15 minutes.",
      "Applying before the entity name is final, which forces a correction later.",
    ],
  },
  business_bank_account: {
    what:
      "A checking account opened in the business's name under its EIN, with all commission income and business spending flowing through it.",
    why:
      "Mixed personal and business money is the fastest way to look unfundable. Underwriters want to see business deposits and business expenses in one clean place.",
    doneLooksLike:
      "Commissions deposit here, business bills pay from here, and personal spending never touches it.",
    mistakes: [
      "Keeping a 'mostly business' personal account and calling it separated.",
      "Transferring commissions straight to personal and paying business costs from there.",
    ],
  },
  accounting_software: {
    what:
      "Bookkeeping software — QuickBooks, Xero, or Wave — connected to the business account and categorizing income and expenses.",
    why:
      "Clean books shorten underwriting, prove the business is really operating, and make tax season far less painful.",
    doneLooksLike:
      "The last 90 days are categorized and you can produce a profit-and-loss statement on request.",
    mistakes: [
      "Buying the software and never connecting the bank feed.",
      "Waiting until tax time and reconstructing a year from memory.",
    ],
  },
  business_address: {
    what:
      "A real, deliverable street address for the business — a physical office or a proper virtual office, not a P.O. box.",
    why:
      "Data providers and many card issuers verify the address. A P.O. box or a mismatch is a quiet, common reason applications stall.",
    doneLooksLike:
      "The same address appears on your filings, bank account, website, and directory listings.",
    mistakes: [
      "Using a mailbox-store address formatted as a suite number without checking it verifies.",
      "Updating the address in one place and forgetting the others.",
    ],
  },
  business_phone_listed: {
    what:
      "A dedicated business phone number that is findable in 411 and on your Google Business Profile.",
    why:
      "Verification services literally look your number up. A listed business line is one of the cheapest credibility wins available.",
    doneLooksLike:
      "Searching your business name returns your business number, and it rings somewhere you actually answer.",
    mistakes: [
      "Using your personal cell as the business number on applications.",
      "Getting the number but never submitting the directory listing.",
    ],
  },
  business_email_domain: {
    what:
      "Email on your own domain — you@yourbrand.com — instead of a free Gmail or Yahoo address.",
    why:
      "A free email address on a funding application signals hobby rather than business. A domain email signals the opposite for a few dollars a month.",
    doneLooksLike:
      "Your domain email is the contact address on your filings, bank, website, and every application.",
    mistakes: [
      "Using your brokerage's email — it disappears the day you change brokerages.",
      "Setting it up but continuing to apply with the old Gmail.",
    ],
  },
  business_website: {
    what:
      "A simple site on a domain you own, describing your business, services, address, and phone.",
    why:
      "Underwriters and vendors look you up. A site you control — not just a brokerage profile page — confirms the business is real and matches your application.",
    doneLooksLike:
      "A live site on your own domain whose name, address, and phone match your applications exactly.",
    mistakes: [
      "Linking a brokerage profile page you don't control.",
      "Leaving contact details on the site that contradict your filings.",
    ],
  },
  duns_registered: {
    what:
      "A free nine-digit identifier from Dun & Bradstreet that anchors your business credit file.",
    why:
      "D&B is the primary business credit bureau. Without a D-U-N-S Number, most vendor reporting has nowhere to land.",
    doneLooksLike:
      "You have your D-U-N-S Number and your business profile shows the correct name, address, and phone.",
    mistakes: [
      "Paying for expedited service you rarely need — the standard request is free.",
      "Letting an auto-created file sit with an old address or a misspelled name.",
    ],
  },
  experian_profile: {
    what:
      "Your business file at Experian Business, which is created automatically once reporting activity exists.",
    why:
      "Several issuers pull Experian Business specifically. Wrong data here can hurt you even when your payment history is perfect.",
    doneLooksLike:
      "You've checked the profile and confirmed the name, address, phone, and industry code are correct.",
    mistakes: [
      "Assuming no file exists because you never opened one.",
      "Ignoring an outdated address that no longer matches your applications.",
    ],
  },
  equifax_profile: {
    what: "Your business file with Equifax Small Business, the third major business bureau.",
    why:
      "Some lenders and card issuers pull here and nowhere else. A missing or wrong file can cost you an approval you had earned.",
    doneLooksLike: "You've verified the profile exists and the business details are accurate.",
    mistakes: [
      "Checking D&B only and assuming the other bureaus match.",
      "Skipping it because it feels redundant.",
    ],
  },
  vendor_tradelines_3: {
    what:
      "Starter vendor accounts — net-30 supply accounts and similar — that report your payments to the business bureaus.",
    why:
      "Three reporting accounts paid early for 60–90 days is what turns an empty bureau file into a scoreable one. This is the core of building business credit.",
    doneLooksLike:
      "Three or more accounts are open, used for real business purchases, and showing up on your bureau reports.",
    mistakes: [
      "Opening accounts with vendors that don't report — always confirm first.",
      "Paying on the due date instead of early; early payment is what builds the strongest scores.",
      "Opening the accounts and never using them.",
    ],
  },
  expenses_off_personal: {
    what:
      "Moving marketing, lead-gen, staging, tech, and other recurring business charges off your personal cards and onto business accounts.",
    why:
      "Business spend on personal cards drives your personal utilization up and your FICO down — which then limits the business funding you qualify for.",
    doneLooksLike:
      "Your last 90 days of business charges run through business accounts, with no new business spend on personal cards.",
    mistakes: [
      "Moving the one-off purchases but leaving the recurring subscriptions behind.",
      "Switching cards without updating the payment method on autopay vendors.",
    ],
  },
  starter_business_card: {
    what:
      "Your first credit card issued to the business under its EIN, typically in the $2,000–$7,500 range.",
    why:
      "Starter cards season the profile. Six months of on-time history here is what makes higher-limit products realistic later.",
    doneLooksLike:
      "One or two EIN-tied cards are open, used regularly for business spend, and paid on time every month.",
    mistakes: [
      "Applying for several cards in the same week — clustered inquiries hurt.",
      "Choosing a card that doesn't report to the business bureaus, so the history builds nothing.",
    ],
  },
  utilization_under_30: {
    what: "Paying down or shifting balances so each personal card sits below 30% of its limit.",
    why:
      "Most business credit decisions still look at your personal profile. Lower utilization means better approvals, better limits, and better terms.",
    doneLooksLike: "Every personal card reports under 30%, and stays there month to month.",
    mistakes: [
      "Averaging across cards — issuers look at each card individually.",
      "Paying down right before applying but after the statement date, so the high balance is what reports.",
    ],
  },
  higher_limit_card_or_loc: {
    what:
      "A higher-limit business card or a business line of credit you can draw on and repay as cash flow allows.",
    why:
      "This is the goal: money available between closings, before a marketing push, or when an opportunity shows up — without touching personal credit.",
    doneLooksLike:
      "You have approved capacity that covers your business overhead through a slow month.",
    mistakes: [
      "Applying before the profile is seasoned and collecting avoidable declines.",
      "Treating a line of credit as income instead of a bridge with a repayment plan.",
    ],
  },
};
