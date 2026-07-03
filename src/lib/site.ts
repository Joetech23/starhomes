// Central site / contact configuration for Star Homes & Properties.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://starhomes-eta.vercel.app"
).replace(/\/$/, "");

export const PHONE = "2349060971584";
export const PHONE_DISPLAY = "+234 906 097 1584";
export const EMAIL = "starhomesproperties@gmail.com";

export const TEL_LINK = `tel:+${PHONE}`;
export const MAIL_LINK = `mailto:${EMAIL}`;

/** Format a number as Nigerian Naira, e.g. 2500000 -> "₦2,500,000". */
export function naira(n: number): string {
  return "₦" + Number(n).toLocaleString("en-NG");
}

/** Build a WhatsApp click-to-chat link, optionally pre-filled with a message. */
export function wa(text?: string): string {
  return "https://wa.me/" + PHONE + (text ? "?text=" + encodeURIComponent(text) : "");
}

export const WA_GENERAL = wa(
  "Hello Star Homes, I’d like to enquire about a property."
);

export const LOCATIONS_LINE = "Anambra · Lagos · Abuja · Enugu";

// Registered business details (CAC — Corporate Affairs Commission, Nigeria)
export const BUSINESS_NAME = "Star Homes and Properties";
export const CAC_RN = "8283791-162";

// Default OpenGraph/Twitter share image (1200x630). Next.js does not deep-merge
// `openGraph` across metadata objects — any page that sets its own `openGraph`
// must include an `images` entry (this one, or its own) or the share image drops.
export const DEFAULT_OG_IMAGE =
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&h=630&q=80";
