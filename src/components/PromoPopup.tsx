"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Banner } from "@/lib/products";

const KEY = "starhomes_promo_dismissed_v1";

export default function PromoPopup({ banner }: { banner: Banner | null }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(KEY) === "1") return;
    const t = setTimeout(() => setOpen(true), 6000); // gentle, after 6s
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    localStorage.setItem(KEY, "1");
    setOpen(false);
  };

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await createClient()
        .from("subscribers")
        .insert({ email: email.trim(), source: "promo_popup" });
    } catch {
      /* ignore */
    }
    setDone(true);
    localStorage.setItem(KEY, "1");
  }

  if (!open) return null;

  const title = banner?.title ?? "Welcome to Star Homes Marketplace 🎉";
  const subtitle =
    banner?.subtitle ??
    "Property, interiors & wears in one place. Join our list for new drops & offers.";
  const ctaHref = banner?.ctaHref ?? "/shop";
  const ctaLabel = banner?.ctaLabel ?? "Start shopping";

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={dismiss}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[420px] overflow-hidden rounded-[22px] bg-white shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)]"
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-[18px] text-ink hover:bg-black/20"
        >
          ×
        </button>

        <div className="bg-ink-900 px-7 pb-7 pt-9 text-center">
          <h2 className="m-0 mb-2 font-display text-[24px] font-extrabold leading-tight text-white">
            {title}
          </h2>
          <p className="m-0 text-[14px] leading-[1.55] text-[#B7BCAD]">{subtitle}</p>
        </div>

        <div className="p-6">
          {done ? (
            <div className="text-center">
              <div className="mb-1 font-display text-[18px] font-extrabold text-brand-ink">
                You're on the list! 🎉
              </div>
              <p className="m-0 mb-4 text-[13.5px] text-muted">
                We'll send new drops and offers your way.
              </p>
              <Link
                href={ctaHref}
                onClick={dismiss}
                className="inline-block rounded-full bg-brand px-6 py-3 text-[14px] font-bold text-white transition-colors hover:bg-brand-hover"
              >
                {ctaLabel}
              </Link>
            </div>
          ) : (
            <form onSubmit={subscribe} className="flex flex-col gap-2.5">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[12px] border border-line-input bg-white px-4 py-3 text-[14px] text-ink outline-none focus:border-brand"
              />
              <button
                type="submit"
                className="rounded-[12px] bg-brand py-3 text-[15px] font-bold text-white transition-colors hover:bg-brand-hover"
              >
                Notify me &amp; shop now
              </button>
              <Link
                href={ctaHref}
                onClick={dismiss}
                className="text-center text-[12.5px] font-semibold text-muted underline decoration-dotted underline-offset-2 hover:text-brand"
              >
                No thanks, just take me to the shop
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
