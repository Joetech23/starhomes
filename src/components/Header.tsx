"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WA_GENERAL, CAC_RN } from "@/lib/site";
import { useCart } from "@/components/cart/CartProvider";

const NAV: { label: string; href: string }[] = [
  { label: "Property", href: "/properties" },
  { label: "Interiors", href: "/shop/interiors" },
  { label: "Wears", href: "/shop/wears" },
  { label: "Gadgets", href: "/shop/gadgets" },
  { label: "Interior Design", href: "/interior-design" },
  { label: "Book Inspection", href: "/book-inspection" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();
  const { count, setOpen: setCartOpen } = useCart();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
    setOpen(false);
  };

  const CartButton = (
    <button
      type="button"
      onClick={() => setCartOpen(true)}
      aria-label="Open cart"
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink"
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-extrabold text-white">
          {count}
        </span>
      )}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-md">
      <div className="container-site flex h-[70px] items-center gap-4">
        <Link href="/" className="flex flex-none items-center gap-[10px]" onClick={() => setOpen(false)}>
          <Image
            src="/logo-mark.png"
            alt="Star Homes"
            width={48}
            height={46}
            style={{ width: "auto", height: "40px" }}
            priority
          />
          <span className="flex flex-col leading-none text-left">
            <span className="font-display text-[17px] font-extrabold tracking-[-0.01em] text-ink">
              STAR HOMES
            </span>
            <span className="mt-[3px] text-[9px] font-bold tracking-[0.24em] text-brand">
              MARKETPLACE
            </span>
          </span>
        </Link>

        <span
          title="Registered with the Corporate Affairs Commission (CAC), Nigeria"
          className="hidden flex-none items-center gap-1 whitespace-nowrap rounded-full border border-leaf-border bg-leaf-bg px-2 py-1 text-[10.5px] font-bold text-brand-ink xl:inline-flex"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          RN {CAC_RN}
        </span>

        {/* Desktop search */}
        <form onSubmit={submitSearch} className="ml-1 hidden max-w-[280px] flex-1 lg:flex">
          <div className="flex w-full items-center gap-2 rounded-full border border-line-input bg-cream px-3.5 py-2 focus-within:border-brand">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8A907E" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="w-full bg-transparent text-[13.5px] text-ink outline-none placeholder:text-muted-light"
            />
          </div>
        </form>

        <nav className="ml-auto hidden items-center gap-[18px] lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="whitespace-nowrap py-1.5 text-[14px] font-semibold text-[#3A3F32] transition-colors hover:text-brand"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2.5 lg:ml-3">
          <a
            href={WA_GENERAL}
            target="_blank"
            rel="noopener"
            className="hidden items-center gap-2 rounded-full bg-brand px-4 py-[9px] text-[13.5px] font-bold text-white shadow-pill transition-colors hover:bg-brand-hover xl:inline-flex"
          >
            <span className="h-[7px] w-[7px] rounded-full bg-[#bff09a]" />
            WhatsApp
          </a>
          {CartButton}
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
            <form onSubmit={submitSearch} className="mb-3">
              <div className="flex items-center gap-2 rounded-full border border-line-input bg-cream px-3.5 py-2.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8A907E" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search products…"
                  className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-muted-light"
                />
              </div>
            </form>
            <span className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-leaf-border bg-leaf-bg px-2.5 py-1 text-[11px] font-bold text-brand-ink">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              CAC RN: {CAC_RN}
            </span>
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
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
