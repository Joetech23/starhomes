import Image from "next/image";
import Link from "next/link";

const IMG =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80";

export default function InteriorDesignAd() {
  return (
    <section className="container-site py-16">
      <div className="grid grid-cols-1 items-stretch overflow-hidden rounded-[24px] border border-line bg-ink-900 lg:grid-cols-2">
        {/* copy */}
        <div className="flex flex-col justify-center gap-4 p-8 sm:p-12">
          <span className="w-fit rounded-full bg-brand/15 px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.12em] text-brand">
            Star Homes Interiors
          </span>
          <h2 className="m-0 font-display text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em] text-white sm:text-[38px]">
            Moved in? Let’s make it{" "}
            <span className="text-brand">feel like home.</span>
          </h2>
          <p className="m-0 max-w-[460px] text-[15.5px] leading-[1.6] text-[#B7BCAD]">
            Our interior design partner transforms empty spaces into warm,
            functional homes — space planning, furnishing, POP &amp; lighting,
            and full styling for apartments, duplexes and shortlets.
          </p>
          <ul className="m-0 flex flex-wrap gap-x-6 gap-y-2 p-0">
            {[
              "Space planning & 3D concepts",
              "Furniture & décor sourcing",
              "Renovation & finishing",
              "Shortlet & Airbnb styling",
            ].map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-[13.5px] font-semibold text-[#D9DCD0]"
              >
                <span className="text-brand">✓</span> {f}
              </li>
            ))}
          </ul>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              href="/interior-design"
              className="rounded-full bg-brand px-6 py-3 text-[15px] font-bold text-white transition-colors hover:bg-brand-hover"
            >
              Explore interior design →
            </Link>
          </div>
        </div>

        {/* image */}
        <div className="relative min-h-[280px] lg:min-h-full">
          <Image
            src={IMG}
            alt="Interior design by Star Homes"
            fill
            sizes="(max-width: 1024px) 100vw, 640px"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
