import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { SITE_URL, PHONE, EMAIL, BUSINESS_NAME, CAC_RN } from "@/lib/site";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: BUSINESS_NAME,
  alternateName: "Star Homes & Properties",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-mark.png`,
  image: `${SITE_URL}/logo-mark.png`,
  telephone: `+${PHONE}`,
  email: EMAIL,
  identifier: {
    "@type": "PropertyValue",
    name: "CAC Registration Number (RN)",
    value: CAC_RN,
  },
  areaServed: [
    { "@type": "State", name: "Anambra" },
    { "@type": "Country", name: "Nigeria" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Awka",
    addressRegion: "Anambra",
    addressCountry: "NG",
  },
  sameAs: [],
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Header />
      <main>{children}</main>
      <Footer />
      <ChatWidget />
    </>
  );
}
