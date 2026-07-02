"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/listings", label: "Listings" },
  { href: "/admin/inspections", label: "Inspections" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/agents", label: "Agents" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {LINKS.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-[10px] px-3 py-2.5 text-[14px] font-semibold transition-colors ${
              active
                ? "bg-ink-900 text-white"
                : "text-[#3A3F32] hover:bg-cream"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
