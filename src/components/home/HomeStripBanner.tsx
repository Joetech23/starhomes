import Link from "next/link";
import type { Banner } from "@/lib/products";

export default function HomeStripBanner({ banner }: { banner: Banner | null }) {
  if (!banner) return null;
  return (
    <section className="container-site py-6">
      <div className="flex flex-col items-center justify-between gap-4 rounded-[20px] bg-gradient-to-r from-brand to-brand-deep px-6 py-7 text-center sm:flex-row sm:text-left">
        <div>
          {banner.title && (
            <h3 className="m-0 mb-1 font-display text-[20px] font-extrabold leading-tight text-white sm:text-[24px]">
              {banner.title}
            </h3>
          )}
          {banner.subtitle && (
            <p className="m-0 text-[14px] text-white/90">{banner.subtitle}</p>
          )}
        </div>
        {banner.ctaHref && banner.ctaLabel && (
          <Link
            href={banner.ctaHref}
            className="flex-none rounded-full bg-white px-6 py-3 text-[14.5px] font-bold text-brand-ink transition-colors hover:bg-white/90"
          >
            {banner.ctaLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
