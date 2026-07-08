import { naira, wa } from "./site";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  qty: number;
}

/** Stable key for a product + chosen variant, so the same item merges. */
export function cartKey(i: Pick<CartItem, "productId" | "size" | "color">): string {
  return [i.productId, i.size ?? "", i.color ?? ""].join("|");
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.qty, 0);
}

/** Builds a WhatsApp checkout link with an itemised order. */
export function checkoutWhatsAppLink(items: CartItem[]): string {
  if (items.length === 0) return wa();
  const lines = items.map((i) => {
    const variant = [i.size, i.color].filter(Boolean).join(", ");
    const label = variant ? `${i.name} (${variant})` : i.name;
    return `• ${label} × ${i.qty} — ${naira(i.price * i.qty)}`;
  });
  const msg =
    "Hello Star Homes, I'd like to order:\n\n" +
    lines.join("\n") +
    `\n\nTotal: ${naira(cartTotal(items))}\n\nPlease confirm availability and delivery.`;
  return wa(msg);
}
