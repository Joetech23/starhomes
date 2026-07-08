"use client";

import { useState } from "react";
import { type Product, coverPhoto } from "@/lib/products";
import { useCart } from "@/components/cart/CartProvider";
import { checkoutWhatsAppLink } from "@/lib/cart";
import { naira } from "@/lib/site";

export default function ProductBuyPanel({ product }: { product: Product }) {
  const { add } = useCart();
  const [size, setSize] = useState<string | undefined>(undefined);
  const [color, setColor] = useState<string | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState<string | null>(null);

  const soldOut = product.stockStatus === "out_of_stock";
  const needsSize = product.sizes.length > 0;
  const needsColor = product.colors.length > 0;

  const buildItem = () => ({
    productId: product.id,
    name: product.name,
    price: product.price,
    image: coverPhoto(product),
    size,
    color,
    qty,
  });

  const validate = () => {
    if (needsSize && !size) return "Please choose a size.";
    if (needsColor && !color) return "Please choose a colour.";
    return null;
  };

  const onAdd = () => {
    const v = validate();
    if (v) return setErr(v);
    setErr(null);
    add(buildItem());
  };

  // Pure — computed on every render with no side effects (safe for href).
  const buyHref = checkoutWhatsAppLink([buildItem()]);

  const onBuyClick = (e: React.MouseEvent) => {
    const v = validate();
    if (v) {
      e.preventDefault();
      setErr(v);
      return;
    }
    setErr(null);
  };

  const optBtn = (active: boolean) =>
    `min-w-[42px] rounded-[10px] border px-3 py-2 text-[13.5px] font-bold transition-colors ${
      active ? "border-ink bg-ink text-white" : "border-line-input bg-white text-ink hover:border-ink"
    }`;

  return (
    <div className="flex flex-col gap-5">
      {needsSize && (
        <div>
          <div className="mb-2 text-[12.5px] font-bold uppercase tracking-[0.05em] text-muted-light">
            Size
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button key={s} type="button" onClick={() => setSize(s)} className={optBtn(size === s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {needsColor && (
        <div>
          <div className="mb-2 text-[12.5px] font-bold uppercase tracking-[0.05em] text-muted-light">
            Colour
          </div>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button key={c} type="button" onClick={() => setColor(c)} className={optBtn(color === c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="mb-2 text-[12.5px] font-bold uppercase tracking-[0.05em] text-muted-light">
          Quantity
        </div>
        <div className="flex w-fit items-center gap-3 rounded-[12px] border border-line-input px-2 py-1.5">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[18px] font-bold text-ink hover:bg-cream"
          >
            −
          </button>
          <span className="w-8 text-center text-[15px] font-bold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[18px] font-bold text-ink hover:bg-cream"
          >
            +
          </button>
        </div>
      </div>

      {err && <p className="m-0 text-[13.5px] font-semibold text-red-600">{err}</p>}

      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={onAdd}
          disabled={soldOut}
          className="rounded-[12px] bg-ink py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          {soldOut ? "Sold out" : `Add to cart · ${naira(product.price * qty)}`}
        </button>
        <a
          href={buyHref}
          onClick={onBuyClick}
          target="_blank"
          rel="noopener"
          aria-disabled={soldOut}
          className={`flex items-center justify-center gap-2 rounded-[12px] py-3.5 text-[15px] font-bold text-white transition-colors ${
            soldOut ? "pointer-events-none bg-brand/50" : "bg-brand hover:bg-brand-hover"
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-[#bff09a]" /> Buy on WhatsApp
        </a>
      </div>
      <p className="m-0 text-[12px] text-muted-light">
        We confirm stock, price &amp; delivery on WhatsApp before payment.
      </p>
    </div>
  );
}
