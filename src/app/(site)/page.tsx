import Link from "next/link";
import Hero from "@/components/home/Hero";
import ValueProps from "@/components/home/ValueProps";
import CTASection from "@/components/home/CTASection";
import InteriorDesignAd from "@/components/home/InteriorDesignAd";
import PropertyCard from "@/components/PropertyCard";
import { getFeatured } from "@/lib/queries";

export const revalidate = 60;

export default async function HomePage() {
  const featured = await getFeatured();

  return (
    <>
      <Hero />

      {/* Featured properties */}
      <section className="container-site py-14 pb-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-2.5 text-[12.5px] font-bold uppercase tracking-[0.12em] text-brand">
              Featured Properties
            </div>
            <h2 className="m-0 font-display text-[28px] font-extrabold tracking-[-0.02em] text-[#13160F] sm:text-[34px]">
              Handpicked homes &amp; land
            </h2>
          </div>
          <p className="m-0 max-w-[340px] text-[15px] text-muted">
            A curated selection from our portfolio across Anambra and Nigeria at
            large.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-[26px] sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/properties"
            className="rounded-full border-[1.5px] border-ink bg-white px-[30px] py-3.5 text-[15px] font-bold text-ink transition-colors hover:bg-ink hover:text-white"
          >
            Browse all properties
          </Link>
        </div>
      </section>

      <ValueProps />
      <InteriorDesignAd />
      <CTASection />
    </>
  );
}
