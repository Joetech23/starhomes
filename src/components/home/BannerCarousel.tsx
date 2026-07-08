"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/lib/products";

export default function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [i, setI] = useState(0);
  const n = banners.length;

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 5000);
    return () => clearInterval(t);
  }, [n]);

  if (n === 0) return null;

  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-[22px] sm:h-[380px] lg:h-[440px]">
      {banners.map((b, idx) => (
        <div
          key={b.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === i ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {b.imageUrl && (
            <Image
              src={b.imageUrl}
              alt={b.title ?? "Star Homes"}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center gap-4 p-7 sm:p-12">
            <div className="max-w-[520px]">
              {b.title && (
                <h2 className="m-0 mb-3 font-display text-[28px] font-extrabold leading-[1.08] tracking-[-0.02em] text-white sm:text-[40px]">
                  {b.title}
                </h2>
              )}
              {b.subtitle && (
                <p className="m-0 mb-5 text-[15px] leading-[1.5] text-white/85 sm:text-[17px]">
                  {b.subtitle}
                </p>
              )}
              {b.ctaHref && b.ctaLabel && (
                <Link
                  href={b.ctaHref}
                  className="inline-block rounded-full bg-brand px-6 py-3 text-[15px] font-bold text-white transition-colors hover:bg-brand-hover"
                >
                  {b.ctaLabel} →
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {n > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {banners.map((b, idx) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-7 bg-white" : "w-3 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
