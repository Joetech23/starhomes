import type { Metadata } from "next";
import { Manrope, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Star Homes & Properties — Rent, Buy & Invest in Nigeria",
  description:
    "Star Homes & Properties helps you rent, buy and invest with confidence — homes, land and serviced apartments across Anambra and Nigeria, with transparent fees and trusted agents.",
  icons: { icon: "/logo-mark.png" },
  openGraph: {
    title: "Star Homes & Properties",
    description:
      "Verified listings, trusted agents and transparent fees across Anambra and Nigeria at large.",
    type: "website",
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
