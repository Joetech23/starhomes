import type { Metadata } from "next";
import { Manrope, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/site";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const OG_IMAGE = DEFAULT_OG_IMAGE;

const DEFAULT_TITLE =
  "Star Homes & Properties — Rent, Buy & Invest in Anambra & Nigeria";
const DEFAULT_DESCRIPTION =
  "Star Homes & Properties helps you rent, buy and invest with confidence in Awka, Anambra and across Nigeria — verified homes, land, shortlets and commercial space, transparent fees and CAC-registered trusted agents.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Star Homes & Properties",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: "Star Homes & Properties",
  keywords: [
    "houses for rent in Awka",
    "land for sale in Anambra",
    "Awka real estate",
    "Anambra property",
    "shortlet apartments Awka",
    "Star Homes and Properties",
    "property agent Awka Anambra",
    "houses for rent Nigeria",
    "land for sale Nigeria",
    "CAC registered real estate agency",
  ],
  authors: [{ name: "Star Homes & Properties" }],
  creator: "Star Homes & Properties",
  publisher: "Star Homes & Properties",
  category: "Real Estate",
  icons: {
    icon: "/logo-mark.png",
    shortcut: "/logo-mark.png",
    apple: "/logo-mark.png",
  },
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: "/",
    siteName: "Star Homes & Properties",
    type: "website",
    locale: "en_NG",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Star Homes & Properties" }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE],
  },
  verification: {
    // Add Google Search Console verification code here once available.
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${bricolage.variable}`}>
      <body className="font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
