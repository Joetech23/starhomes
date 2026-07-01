"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TEL_LINK, PHONE_DISPLAY, WA_GENERAL } from "@/lib/site";

const NAV = [
  { label: "Sale", type: "sale" },
  { label: "Rent", type: "rent" },
  { label: "Land", type: "land" },
  { label: "Shortlets", type: "shortlet" },
  { label: "Commercial", type: "commercial" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-md">
      <div className="container-site flex h-[74px] items-center gap-7">
        <Link
          href="/"
          className="flex items-center gap-[11px]"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo-mark.png"
            alt="Star Homes"
            width={48}
            height={46}
            style={{ width: "auto", height: "42px" }}
            priority
          />
          <span className="flex flex-col leading-none text-left">
            <span className="font-display text-[18px] font-extrabold tracking-[-0.01em] text-ink">
              STAR HOMES
            </span>
            <span className="mt-[3px] text-[9.5px] font-bold tracking-[0.24em] text-brand">
              &amp; PROPERTIES
            </span>
          </span>
        </Link>

        <nav className="ml-3.5 hidden gap-[26px] lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.type}
              href={`/properties?type=${n.type}`}
              className="py-1.5 text-[14.5px] font-semibold text-[#3A3F32] transition-colors hover:text-brand"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3.5">
          <a
            href={TEL_LINK}
            className="hidden items-center gap-[7px] text-[14px] font-bold text-ink xl:inline-flex"
          >
            {PHONE_DISPLAY}
          </a>
          <a
            href={WA_GENERAL}
            target="_blank"
            rel="noopener"
            className="hidden items-center gap-2 rounded-full bg-brand px-5 py-[11px] text-[14px] font-bold text-white shadow-pill transition-colors hover:bg-brand-hover sm:inline-flex"
          >
            <span className="h-[7px] w-[7px] rounded-full bg-[#bff09a] shadow-[0_0_0_3px_rgba(191,240,154,0.35)]" />
            Chat on WhatsApp
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              {open ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-white lg:hidden">
          <nav className="container-site flex flex-col py-3">
            {NAV.map((n) => (
              <Link
                key={n.type}
                href={`/properties?type=${n.type}`}
                onClick={() => setOpen(false)}
                className="border-b border-line-soft py-3 text-[15px] font-semibold text-[#3A3F32]"
              >
                {n.label}
              </Link>
            ))}
            <a
              href={WA_GENERAL}
              target="_blank"
              rel="noopener"
              className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-brand px-5 py-[11px] text-[14px] font-bold text-white shadow-pill"
            >
              <span className="h-[7px] w-[7px] rounded-full bg-[#bff09a]" />
              Chat on WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
