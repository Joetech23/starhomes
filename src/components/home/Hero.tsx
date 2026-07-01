import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import { FALLBACK_HERO } from "@/lib/properties";

const TICKS = ["Verified listings", "Trusted agents", "Transparent fees"];

export default function Hero() {
  return (
    <section className="border-b border-[#EEF0E8] bg-gradient-to-b from-[#F6F8F1] to-white">
      <div className="container-site grid grid-cols-1 items-center gap-12 py-16 pb-[72px] lg:grid-cols-[1.04fr_0.96fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-leaf-border bg-leaf-bg px-3.5 py-[7px] text-[12.5px] font-bold text-brand-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Anambra &amp; nationwide · Verified listings
          </div>
          <h1 className="m-0 mb-5 font-display text-[42px] font-extrabold leading-[1.04] tracking-[-0.025em] text-[#13160F] sm:text-[57px] sm:leading-[1.02]">
            Find a home you&apos;ll be
            <br />
            <span className="text-brand">proud to own.</span>
          </h1>
          <p className="m-0 mb-[30px] max-w-[478px] text-[18px] leading-[1.6] text-muted">
            Star Homes &amp; Properties helps you rent, buy and invest with
            confidence — homes, land and serviced apartments with transparent
            fees and trusted agents.
          </p>

          <SearchBar />

          <div className="mt-[22px] flex flex-wrap gap-[26px]">
            {TICKS.map((t) => (
              <span
                key={t}
                className="flex items-center gap-2 text-[13.5px] font-semibold text-muted"
              >
                <span className="font-extrabold text-brand">✓</span> {t}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative h-[400px] w-full overflow-hidden rounded-[22px] shadow-hero sm:h-[528px]">
            <Image
              src={FALLBACK_HERO}
              alt="Featured property"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-[22px] left-[22px] flex items-center gap-[13px] rounded-[14px] bg-white/95 px-[17px] py-[13px] shadow-[0_10px_30px_-10px_rgba(22,26,18,0.3)] backdrop-blur-[6px]">
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[11px] bg-leaf-bg">
              <Image
                src="/logo-mark.png"
                alt=""
                width={48}
                height={46}
                style={{ width: "auto", height: "26px" }}
              />
            </div>
            <div className="leading-[1.2]">
              <div className="text-[12px] font-semibold text-muted-light">
                Now leasing
              </div>
              <div className="font-display text-[15px] font-extrabold text-ink">
                From ₦1.2M / year
              </div>
            </div>
          </div>
          <div className="absolute right-5 top-5 rounded-[12px] bg-brand px-[15px] py-[11px] leading-[1.1] text-white shadow-[0_10px_26px_-8px_rgba(91,154,36,0.6)]">
            <div className="font-display text-[21px] font-extrabold">120+</div>
            <div className="text-[11px] font-semibold opacity-90">
              active listings
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
