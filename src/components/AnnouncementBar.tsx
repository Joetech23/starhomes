"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "starhomes_announce_dismissed_v1";

export default function AnnouncementBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(localStorage.getItem(KEY) !== "1");
  }, []);

  if (!show) return null;

  return (
    <div className="relative bg-ink-900 text-white">
      <div className="container-site flex items-center justify-center gap-2 py-2 pr-8 text-center text-[12.5px] font-semibold">
        <span className="hidden sm:inline">🎉</span>
        <span>
          New: shop{" "}
          <Link href="/shop/interiors" className="underline decoration-brand underline-offset-2 hover:text-brand">
            Interiors
          </Link>{" "}
          &amp;{" "}
          <Link href="/shop/wears" className="underline decoration-brand underline-offset-2 hover:text-brand">
            Wears
          </Link>{" "}
          — plus verified property. Free delivery consult on WhatsApp.
        </span>
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          localStorage.setItem(KEY, "1");
          setShow(false);
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[16px] text-white/70 hover:text-white"
      >
        ×
      </button>
    </div>
  );
}
