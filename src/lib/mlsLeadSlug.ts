/**
 * Personalized guide slug generation for MLS leads.
 *
 * Today this runs locally from the simulator page. Later the same helpers can
 * be called from the real pipeline:
 *   MLS -> EveryCatch -> buildLeadSlug -> store custom field -> send email
 */

export interface SimulatedEmail {
  to: string;
  subject: string;
  body: string;
}

/** Collapse whitespace and trim. */
const clean = (value: string) => value.replace(/\s+/g, " ").trim();

/**
 * Initials of every first-name token + "." + last name.
 * "John Paul" + "Eltanal" -> "JP.Eltanal"
 */
export function buildLeadSlug(firstName: string, lastName: string): string {
  const first = clean(firstName);
  const last = clean(lastName);
  if (!first || !last) return "";

  const initials = first
    .split(" ")
    .map((token) => token.replace(/[^a-zA-Z]/g, "").charAt(0).toUpperCase())
    .filter(Boolean)
    .join("");

  const surname = last.replace(/[^a-zA-Z'’-]/g, "");
  if (!initials || !surname) return "";

  return `${initials}.${surname}`;
}

/** Absolute personalized guide URL on the current origin. */
export function buildGuideUrl(slug: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/guide/${slug}`;
}

/** Email that the real workflow would send. Pure — swap the sender, keep this. */
export function buildSimulatedEmail(params: {
  firstName: string;
  email: string;
  url: string;
}): SimulatedEmail {
  const greetingName = clean(params.firstName) || "there";
  return {
    to: clean(params.email),
    subject: "Your Personalized Business Credit Guide",
    body: [
      `Hi ${greetingName},`,
      "",
      "Your personalized guide is ready.",
      "",
      "Click below to begin:",
      "",
      params.url,
      "",
      "— Jessie Hunter, RE Pro Business Credit",
    ].join("\n"),
  };
}
