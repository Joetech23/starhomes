import Image from "next/image";
import Link from "next/link";
import { DEPARTMENTS } from "@/lib/products";

const PROPERTY_TILE = {
  key: "property",
  label: "Property",
  href: "/properties",
  blurb: "Rent, buy, land & shortlets",
  image:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
};

export default function DepartmentTiles() {
  const tiles = [PROPERTY_TILE, ...DEPARTMENTS];
  return (
    <section className="container-site py-12">
      <h2 className="m-0 mb-6 text-center font-display text-[26px] font-extrabold tracking-[-0.02em] text-[#13160F] sm:text-[32px]">
        Shop by department
      </h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((t) => {
          const comingSoon =
            "comingSoon" in t && (t as { comingSoon?: boolean }).comingSoon === true;
          return (
            <Link
              key={t.key}
              href={t.href}
              className="group relative flex h-[180px] flex-col justify-end overflow-hidden rounded-[18px] border border-line sm:h-[220px]"
            >
              <Image
                src={t.image}
                alt={t.label}
                fill
                sizes="(max-width: 640px) 50vw, 300px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              {comingSoon && (
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10.5px] font-extrabold text-ink">
                  Coming soon
                </span>
              )}
              <div className="relative p-4">
                <h3 className="m-0 font-display text-[19px] font-extrabold text-white">
                  {t.label}
                </h3>
                <p className="m-0 text-[12.5px] text-white/80">{t.blurb}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
