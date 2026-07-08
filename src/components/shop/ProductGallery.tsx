"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductMedia } from "@/lib/products";

export default function ProductGallery({
  photos,
  name,
}: {
  photos: ProductMedia[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const main = photos[active] ?? photos[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-[18px] border border-line bg-cream">
        {main && (
          <Image
            src={main.url}
            alt={name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-cover"
          />
        )}
      </div>
      {photos.length > 1 && (
        <div className="flex flex-wrap gap-2.5">
          {photos.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 flex-none overflow-hidden rounded-[10px] border-2 transition-colors ${
                i === active ? "border-brand" : "border-line hover:border-[#D6DACC]"
              }`}
            >
              <Image src={m.url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
