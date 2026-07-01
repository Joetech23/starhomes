import { WA_GENERAL, TEL_LINK, PHONE_DISPLAY } from "@/lib/site";

export default function CTASection() {
  return (
    <section className="container-site py-[60px]">
      <div className="flex flex-wrap items-center justify-between gap-10 rounded-[24px] bg-gradient-to-br from-brand to-brand-deep px-8 py-12 shadow-[0_30px_60px_-34px_rgba(91,154,36,0.7)] sm:px-14 sm:py-[52px]">
        <div className="max-w-[560px]">
          <h2 className="m-0 mb-3 font-display text-[26px] font-extrabold leading-[1.12] tracking-[-0.02em] text-white sm:text-[32px]">
            Can&apos;t find exactly what you&apos;re looking for?
          </h2>
          <p className="m-0 text-[16px] leading-[1.55] text-white/90">
            Tell us your budget and needs — we&apos;ll match you to the right
            home, land or shortlet, often before it&apos;s listed.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={WA_GENERAL}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-[9px] rounded-full bg-white px-[26px] py-[15px] text-[15px] font-bold text-brand-deep transition-colors hover:bg-[#f3f3f3]"
          >
            <span className="h-2 w-2 rounded-full bg-brand" /> Chat on WhatsApp
          </a>
          <a
            href={TEL_LINK}
            className="inline-flex items-center gap-[9px] rounded-full border-[1.5px] border-white/50 bg-white/15 px-[26px] py-[15px] text-[15px] font-bold text-white transition-colors hover:bg-white/25"
          >
            Call {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}
