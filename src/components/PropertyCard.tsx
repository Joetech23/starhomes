import Link from "next/link";
import CardMedia from "./CardMedia";
import {
  type Listing,
  TYPE_LABEL,
  specsText,
  coverPhoto,
  priceText,
} from "@/lib/properties";

export default function PropertyCard({
  p,
  variant = "full",
}: {
  p: Listing;
  variant?: "full" | "compact";
}) {
  const imgHeight = variant === "compact" ? "h-[200px]" : "h-[228px]";
  const href = `/properties/${p.id}`;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-[18px] border border-line bg-white transition-all duration-[250ms] hover:-translate-y-[5px] hover:border-[#D6DACC] hover:shadow-card"
    >
      <div className="relative">
        <CardMedia
          cover={coverPhoto(p)}
          title={p.title}
          href={href}
          videos={p.videos}
          heightClass={imgHeight}
        />
        <span className="pointer-events-none absolute left-[14px] top-[14px] z-10 rounded-full bg-brand/95 px-3 py-1.5 text-[11.5px] font-bold tracking-[0.02em] text-white backdrop-blur-[4px]">
          {TYPE_LABEL[p.type]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-[9px] px-[18px] pb-[19px] pt-[17px]">
        <div className="flex items-baseline gap-[5px]">
          <span className="font-display text-[21px] font-extrabold tracking-[-0.01em] text-ink-900">
            {priceText(p)}
          </span>
          {p.unit && (
            <span className="text-[13px] font-semibold text-muted-light">
              {p.unit}
            </span>
          )}
        </div>
        <h3 className="m-0 text-[16.5px] font-bold leading-[1.3] text-[#1d2117]">
          {p.title}
        </h3>
        <div className="flex items-center gap-[7px] text-[13.5px] font-medium text-muted-soft">
          <span className="h-[5px] w-[5px] flex-none rounded-full bg-brand" />
          {p.location}
        </div>
        {variant === "full" && (
          <div className="mt-auto flex items-center justify-between border-t border-line-soft pt-[13px]">
            <span className="text-[12.5px] font-semibold text-muted-soft">
              {specsText(p)}
            </span>
            <span className="text-[13px] font-bold text-brand">View →</span>
          </div>
        )}
      </div>
    </Link>
  );
}
