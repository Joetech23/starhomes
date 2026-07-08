"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type Product,
  coverPhoto,
  priceText,
  discountPct,
  DEPARTMENT_LABEL,
} from "@/lib/products";
import { naira } from "@/lib/site";
import { useCart } from "@/components/cart/CartProvider";

export default function ProductCard({ p }: { p: Product }) {
  const router = useRouter();
  const { add } = useCart();
  const href = `/shop/product/${p.id}`;
  const off = discountPct(p);
  const needsVariant = p.sizes.length > 0 || p.colors.length > 0;
  const soldOut = p.stockStatus === "out_of_stock";

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    if (needsVariant) {
      router.push(href);
      return;
    }
    add({
      productId: p.id,
      name: p.name,
      price: p.price,
      image: coverPhoto(p),
      qty: 1,
    });
  };

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-[16px] border border-line bg-white transition-all duration-200 hover:-translate-y-1 hover:border-[#D6DACC] hover:shadow-card"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-cream">
        <Image
          src={coverPhoto(p)}
          alt={p.name}
          fill
          sizes="(max-width: 640px) 50vw, 300px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {off && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-brand px-2 py-1 text-[10.5px] font-extrabold text-white">
            -{off}%
          </span>
        )}
        {soldOut && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-black/70 px-2 py-1 text-[10.5px] font-bold text-white">
            Sold out
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-muted-light">
          {p.category || DEPARTMENT_LABEL[p.department]}
        </span>
        <h3 className="m-0 line-clamp-2 text-[14px] font-bold leading-[1.3] text-[#1d2117]">
          {p.name}
        </h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-display text-[17px] font-extrabold text-ink-900">
            {priceText(p)}
          </span>
          {p.compareAtPrice && p.compareAtPrice > p.price && (
            <span className="text-[12.5px] font-semibold text-muted-light line-through">
              {naira(p.compareAtPrice)}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onAdd}
          disabled={soldOut}
          className="mt-2 rounded-full bg-ink py-2 text-[12.5px] font-bold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          {soldOut ? "Sold out" : needsVariant ? "Choose options" : "Add to cart"}
        </button>
      </div>
    </Link>
  );
}
