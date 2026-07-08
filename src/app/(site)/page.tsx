import Link from "next/link";
import CACTrust from "@/components/home/CACTrust";
import BannerCarousel from "@/components/home/BannerCarousel";
import DepartmentTiles from "@/components/home/DepartmentTiles";
import ProductRail from "@/components/home/ProductRail";
import HomeStripBanner from "@/components/home/HomeStripBanner";
import InteriorDesignAd from "@/components/home/InteriorDesignAd";
import PropertyCard from "@/components/PropertyCard";
import SearchBar from "@/components/SearchBar";
import { getFeatured, getFeaturedProducts, getBanners } from "@/lib/queries";

export const revalidate = 60;

export default async function HomePage() {
  const [heroBanners, featured, interiors, wears, stripBanners] = await Promise.all([
    getBanners("home_hero"),
    getFeatured(),
    getFeaturedProducts("interiors", 4),
    getFeaturedProducts("wears", 4),
    getBanners("home_strip"),
  ]);

  return (
    <>
      {/* Hero: banner carousel + quick property search */}
      <section className="container-site pb-4 pt-6">
        <BannerCarousel banners={heroBanners} />
        <div className="mx-auto -mt-8 max-w-[880px] px-2">
          <SearchBar />
        </div>
      </section>

      <DepartmentTiles />

      <CACTrust />

      {/* Interiors rail */}
      <ProductRail title="Interiors — freshly stocked" href="/shop/interiors" products={interiors} />

      {/* Featured property */}
      {featured.length > 0 && (
        <section className="container-site py-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <div className="mb-1.5 text-[12px] font-bold uppercase tracking-[0.12em] text-brand">
                Featured Properties
              </div>
              <h2 className="m-0 font-display text-[24px] font-extrabold tracking-[-0.02em] text-[#13160F] sm:text-[30px]">
                Handpicked homes &amp; land
              </h2>
            </div>
            <Link href="/properties" className="whitespace-nowrap text-[14px] font-bold text-brand">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-[26px] sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}

      <HomeStripBanner banner={stripBanners[0] ?? null} />

      {/* Wears rail */}
      <ProductRail title="Wears — new season" href="/shop/wears" products={wears} />

      <InteriorDesignAd />
    </>
  );
}
