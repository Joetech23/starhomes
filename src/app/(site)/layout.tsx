import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import AnnouncementBar from "@/components/AnnouncementBar";
import PromoPopup from "@/components/PromoPopup";
import { CartProvider } from "@/components/cart/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import { SITE_URL, PHONE, EMAIL, BUSINESS_NAME, CAC_RN } from "@/lib/site";
import { getBanners } from "@/lib/queries";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["RealEstateAgent", "Store"],
  name: BUSINESS_NAME,
  alternateName: "Star Homes & Properties",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-mark.png`,
  image: `${SITE_URL}/logo-mark.png`,
  telephone: `+${PHONE}`,
  email: EMAIL,
  description:
    "Marketplace for property, home interiors and fashion wears in Awka, Anambra and across Nigeria.",
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
  department: [
    { "@type": "Store", name: "Star Homes Property" },
    { "@type": "Store", name: "Star Homes Interiors" },
    { "@type": "Store", name: "Star Homes Wears" },
  ],
  sameAs: [],
};

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const popupBanners = await getBanners("popup");

  return (
    <CartProvider>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <AnnouncementBar />
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      <ChatWidget />
      <PromoPopup banner={popupBanners[0] ?? null} />
    </CartProvider>
  );
}
