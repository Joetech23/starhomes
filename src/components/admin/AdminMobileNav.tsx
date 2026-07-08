"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "./SignOutButton";

const LINKS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/listings", label: "Listings" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/inspections", label: "Inspections" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/agents", label: "Agents" },
];

export default function AdminMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-line bg-white md:hidden">
      <div className="flex items-center justify-between px-5 py-3">
        <span className="font-display text-[15px] font-extrabold text-ink">
          STAR HOMES <span className="text-brand">ADMIN</span>
        </span>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink"
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

      {open && (
        <nav className="flex flex-col gap-1 border-t border-line px-3 py-3">
          {LINKS.map((l) => {
            const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-[10px] px-3 py-2.5 text-[14.5px] font-semibold transition-colors ${
                  active ? "bg-ink-900 text-white" : "text-[#3A3F32] hover:bg-cream"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <div className="mt-1 flex items-center gap-2 border-t border-line pt-3">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-[10px] border border-line px-3 py-2.5 text-center text-[14.5px] font-semibold text-muted"
            >
              View site
            </Link>
            <SignOutButton />
          </div>
        </nav>
      )}
    </div>
  );
}
