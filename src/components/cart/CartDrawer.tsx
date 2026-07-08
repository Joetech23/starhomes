"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { cartKey, checkoutWhatsAppLink } from "@/lib/cart";
import { naira } from "@/lib/site";

export default function CartDrawer() {
  const { items, total, open, setOpen, setQty, remove } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[90] bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      />
      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-[91] flex h-full w-[380px] max-w-[calc(100vw-2rem)] flex-col bg-white shadow-[0_0_60px_-15px_rgba(22,26,18,0.5)] transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="m-0 font-display text-[18px] font-extrabold text-ink-900">
            Your cart{" "}
            {items.length > 0 && (
              <span className="text-muted-light">({items.length})</span>
            )}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[20px] text-muted hover:bg-cream"
          >
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="text-[40px]">🛍️</div>
            <p className="m-0 text-[14px] text-muted">Your cart is empty.</p>
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="rounded-full bg-brand px-5 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-brand-hover"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {items.map((i) => {
                const key = cartKey(i);
                const variant = [i.size, i.color].filter(Boolean).join(" · ");
                return (
                  <div key={key} className="flex gap-3 rounded-[14px] border border-line p-2.5">
                    <div className="relative h-[70px] w-[70px] flex-none overflow-hidden rounded-[10px] bg-cream">
                      <Image src={i.image} alt={i.name} fill sizes="70px" className="object-cover" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <span className="line-clamp-2 text-[13.5px] font-bold text-ink">
                          {i.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => remove(key)}
                          aria-label="Remove"
                          className="flex-none text-[12px] font-bold text-muted-light hover:text-red-600"
                        >
                          ✕
                        </button>
                      </div>
                      {variant && (
                        <span className="text-[11.5px] text-muted-light">{variant}</span>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-1.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setQty(key, i.qty - 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-md border border-line text-[14px] font-bold text-ink hover:border-ink"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-[13px] font-bold">{i.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(key, i.qty + 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-md border border-line text-[14px] font-bold text-ink hover:border-ink"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-[13.5px] font-extrabold text-brand">
                          {naira(i.price * i.qty)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-line p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[14px] font-semibold text-muted">Subtotal</span>
                <span className="font-display text-[20px] font-extrabold text-ink-900">
                  {naira(total)}
                </span>
              </div>
              <a
                href={checkoutWhatsAppLink(items)}
                target="_blank"
                rel="noopener"
                className="flex items-center justify-center gap-2 rounded-[12px] bg-brand py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-brand-hover"
              >
                <span className="h-2 w-2 rounded-full bg-[#bff09a]" /> Checkout on WhatsApp
              </a>
              <p className="m-0 mt-2 text-center text-[11.5px] text-muted-light">
                We confirm stock, price &amp; delivery on WhatsApp before you pay.
              </p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
