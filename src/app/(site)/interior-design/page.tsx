import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import EnquiryForm from "@/components/EnquiryForm";
import { wa, TEL_LINK, PHONE_DISPLAY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Interior Design — Star Homes & Properties",
  description:
    "Star Homes Interiors: space planning, furnishing, POP & lighting, renovation and full styling for homes, duplexes and shortlets across Anambra and Nigeria.",
};

const HERO =
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80";

const SERVICES = [
  {
    t: "Space planning & 3D concepts",
    d: "We map out how each room should flow and show you a realistic 3D preview before a single item is bought.",
  },
  {
    t: "Furniture & décor sourcing",
    d: "From sofas to soft furnishings, we source quality pieces that fit your taste and your budget.",
  },
  {
    t: "POP, lighting & finishing",
    d: "Ceilings, ambient lighting, wall finishes and the small details that make a space feel premium.",
  },
  {
    t: "Renovation & remodelling",
    d: "Upgrading an older property? We handle remodelling end-to-end with trusted artisans.",
  },
  {
    t: "Shortlet & Airbnb styling",
    d: "Guest-ready interiors designed to photograph beautifully and earn five-star reviews.",
  },
  {
    t: "Full home styling",
    d: "Move-in-ready styling for your whole home, coordinated to one cohesive look.",
  },
];

const GALLERY = [
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=800&q=80",
];

const STEPS = [
  ["01", "Consultation", "Tell us the space, your style and your budget — on-site or over WhatsApp."],
  ["02", "Concept & quote", "We share a mood-board, layout and a transparent, itemised quote."],
  ["03", "Execution", "Sourcing, installation and finishing — managed by our team from start to finish."],
  ["04", "Handover", "We hand over a styled, move-in-ready space, snag-free."],
];

const waLink = wa(
  "Hello Star Homes Interiors, I’d like a consultation about interior design for my space."
);

export default function InteriorDesignPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-ink-900">
        <div className="container-site grid grid-cols-1 items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="mb-5 inline-block rounded-full bg-brand/15 px-3.5 py-1.5 text-[12.5px] font-bold uppercase tracking-[0.12em] text-brand">
              Star Homes Interiors
            </span>
            <h1 className="m-0 mb-4 font-display text-[38px] font-extrabold leading-[1.05] tracking-[-0.02em] text-white sm:text-[52px]">
              Interiors that feel like{" "}
              <span className="text-brand">home.</span>
            </h1>
            <p className="m-0 mb-7 max-w-[500px] text-[17px] leading-[1.6] text-[#B7BCAD]">
              Beautiful, functional interior design for homes, duplexes,
              offices and shortlets — space planning, furnishing, finishing and
              styling, all handled by one trusted team.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-brand-hover"
              >
                <span className="h-2 w-2 rounded-full bg-[#bff09a]" /> Book a
                consultation
              </a>
              <a
                href={TEL_LINK}
                className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-white/40 px-6 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-white/10"
              >
                Call {PHONE_DISPLAY}
              </a>
            </div>
          </div>
          <div className="relative h-[300px] overflow-hidden rounded-[22px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] lg:h-[440px]">
            <Image
              src={HERO}
              alt="Interior design"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 620px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container-site py-16">
        <div className="mb-2.5 text-center text-[12.5px] font-bold uppercase tracking-[0.12em] text-brand">
          What we do
        </div>
        <h2 className="m-0 mb-10 text-center font-display text-[30px] font-extrabold tracking-[-0.02em] text-[#13160F] sm:text-[36px]">
          Design services, end to end
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.t}
              className="rounded-[18px] border border-line bg-white p-6 transition-shadow hover:shadow-card"
            >
              <h3 className="m-0 mb-2 font-display text-[18px] font-bold text-[#13160F]">
                {s.t}
              </h3>
              <p className="m-0 text-[14.5px] leading-[1.6] text-muted">
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-cream py-16">
        <div className="container-site">
          <h2 className="m-0 mb-8 text-center font-display text-[28px] font-extrabold tracking-[-0.02em] text-[#13160F] sm:text-[32px]">
            Recent looks
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {GALLERY.map((src, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] overflow-hidden rounded-[16px] border border-line"
              >
                <Image
                  src={src}
                  alt={`Interior look ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 380px"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="container-site py-16">
        <h2 className="m-0 mb-10 text-center font-display text-[28px] font-extrabold tracking-[-0.02em] text-[#13160F] sm:text-[32px]">
          How it works
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([n, t, d]) => (
            <div key={n}>
              <div className="mb-3 font-display text-[15px] font-extrabold text-brand">
                {n}
              </div>
              <h3 className="m-0 mb-2 font-display text-[18px] font-bold text-[#13160F]">
                {t}
              </h3>
              <p className="m-0 text-[14px] leading-[1.6] text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA + form */}
      <section className="container-site pb-20">
        <div className="grid grid-cols-1 gap-8 rounded-[24px] border border-line bg-white p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col justify-center">
            <h2 className="m-0 mb-3 font-display text-[28px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#13160F] sm:text-[34px]">
              Ready to transform your space?
            </h2>
            <p className="m-0 mb-6 max-w-[460px] text-[16px] leading-[1.6] text-muted">
              Send us a few details and our interior team will reach out to book
              your consultation. Prefer to chat now? Message us on WhatsApp.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-brand-hover"
              >
                <span className="h-2 w-2 rounded-full bg-[#bff09a]" /> Chat on
                WhatsApp
              </a>
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink px-6 py-3.5 text-[15px] font-bold text-ink transition-colors hover:bg-ink hover:text-white"
              >
                Browse properties
              </Link>
            </div>
          </div>
          <div>
            <EnquiryForm
              source="interior_design"
              heading="Request a consultation"
              subtext="Tell us about your space and we’ll get back to you about interior design."
            />
          </div>
        </div>
      </section>
    </div>
  );
}
