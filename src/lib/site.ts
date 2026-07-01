// Central site / contact configuration for Star Homes & Properties.

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
