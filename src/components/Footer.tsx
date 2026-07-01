import Image from "next/image";
import Link from "next/link";
import {
  WA_GENERAL,
  TEL_LINK,
  MAIL_LINK,
  PHONE_DISPLAY,
  EMAIL,
  LOCATIONS_LINE,
} from "@/lib/site";

const EXPLORE = [
  { label: "For Sale", type: "sale" },
  { label: "For Rent", type: "rent" },
  { label: "Land & Plots", type: "land" },
  { label: "Shortlets", type: "shortlet" },
];

const COMPANY = ["About us", "List your property", "Property management", "FAQs"];

export default function Footer() {
  return (
    <footer className="border-t border-[#1f2418] bg-ink-950 text-white">
      <div className="container-site py-14 pb-[30px]">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
          <div>
            <div className="mb-4 flex items-center gap-[11px]">
              <Image
                src="/logo-mark-white.png"
                alt="Star Homes"
                width={48}
                height={46}
                style={{ width: "auto", height: "38px" }}
              />
              <span className="flex flex-col leading-none">
                <span className="font-display text-[17px] font-extrabold text-white">
                  STAR HOMES
                </span>
                <span className="mt-[3px] text-[9px] font-bold tracking-[0.24em] text-brand">
                  &amp; PROPERTIES
                </span>
              </span>
            </div>
            <p className="m-0 max-w-[300px] text-[14px] leading-[1.65] text-[#9aa08c]">
              Your trusted partner for renting, buying and investing in property
              across Anambra and Nigeria at large.
            </p>
          </div>

          <div>
            <div className="mb-4 text-[12px] font-bold uppercase tracking-[0.1em] text-[#6f7563]">
              Explore
            </div>
            <div className="flex flex-col gap-[11px]">
              {EXPLORE.map((e) => (
                <Link
                  key={e.type}
                  href={`/properties?type=${e.type}`}
                  className="text-left text-[14px] text-[#cfd3c6] transition-colors hover:text-brand"
                >
                  {e.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 text-[12px] font-bold uppercase tracking-[0.1em] text-[#6f7563]">
              Company
            </div>
            <div className="flex flex-col gap-[11px]">
              {COMPANY.map((c) => (
                <span key={c} className="text-[14px] text-[#cfd3c6]">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 text-[12px] font-bold uppercase tracking-[0.1em] text-[#6f7563]">
              Get in touch
            </div>
            <div className="flex flex-col gap-3">
              <a
                href={WA_GENERAL}
                target="_blank"
                rel="noopener"
                className="inline-flex w-fit items-center gap-[9px] rounded-full bg-brand px-[18px] py-[11px] text-[14px] font-bold text-white transition-colors hover:bg-brand-hover"
              >
                <span className="h-[7px] w-[7px] rounded-full bg-[#bff09a]" />
                WhatsApp
              </a>
              <a
                href={TEL_LINK}
                className="text-[14.5px] font-bold text-white transition-colors hover:text-brand"
              >
                {PHONE_DISPLAY}
              </a>
              <a
                href={MAIL_LINK}
                className="text-[14px] text-[#9aa08c] transition-colors hover:text-brand"
              >
                {EMAIL}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-11 flex flex-wrap items-center justify-between gap-4 border-t border-[#1f2418] pt-[22px]">
          <span className="text-[13px] text-[#6f7563]">
            © 2026 Star Homes &amp; Properties. All rights reserved.
          </span>
          <span className="text-[13px] text-[#6f7563]">{LOCATIONS_LINE}</span>
        </div>
      </div>
    </footer>
  );
}
