// Domain types + display helpers for the Star Homes marketplace (non-property goods).
import { naira } from "./site";

export type Department = "interiors" | "wears" | "gadgets";

export interface ProductMedia {
  id: string;
  url: string;
  isCover: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  productNo: number;
  department: Department;
  category: string | null;
  name: string;
  price: number;
  compareAtPrice: number | null;
  shortDescription: string | null;
  description: string | null;
  sizes: string[];
  colors: string[];
  stockStatus: "in_stock" | "out_of_stock" | "preorder";
  featured: boolean;
  status: "draft" | "published";
  photos: ProductMedia[];
}

export interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  placement: "home_hero" | "home_strip" | "popup";
  sort: number;
}

export const DEPARTMENTS: {
  key: Department;
  label: string;
  href: string;
  comingSoon?: boolean;
  blurb: string;
  image: string;
}[] = [
  {
    key: "interiors",
    label: "Interiors",
    href: "/shop/interiors",
    blurb: "Furniture, lighting, décor & rugs",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
  },
  {
    key: "wears",
    label: "Wears",
    href: "/shop/wears",
    blurb: "Kaftans, Ankara, footwear & more",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
  },
  {
    key: "gadgets",
    label: "Gadgets",
    href: "/shop/gadgets",
    comingSoon: true,
    blurb: "Phones, audio & smart devices — soon",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80",
  },
];

export const DEPARTMENT_LABEL: Record<Department, string> = {
  interiors: "Interiors",
  wears: "Wears",
  gadgets: "Gadgets",
};

export const PRODUCT_BUDGET_RANGES: Record<string, [number, number | null]> = {
  u25: [1, 25_000],
  "25to100": [25_000, 100_000],
  "100to500": [100_000, 500_000],
  "500plus": [500_000, null],
};

export const PRODUCT_BUDGET_OPTIONS: { value: string; label: string }[] = [
  { value: "u25", label: "Under ₦25k" },
  { value: "25to100", label: "₦25k – ₦100k" },
  { value: "100to500", label: "₦100k – ₦500k" },
  { value: "500plus", label: "₦500k+" },
];

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80";

export function priceText(p: Pick<Product, "price">): string {
  return p.price > 0 ? naira(p.price) : "Price on request";
}

export function coverPhoto(p: Product): string {
  const cover = p.photos.find((m) => m.isCover) ?? p.photos[0];
  return cover?.url ?? PLACEHOLDER;
}

export function galleryPhotos(p: Product): ProductMedia[] {
  return [...p.photos].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function discountPct(p: Pick<Product, "price" | "compareAtPrice">): number | null {
  if (!p.compareAtPrice || p.compareAtPrice <= p.price) return null;
  return Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);
}

export const STOCK_LABEL: Record<Product["stockStatus"], string> = {
  in_stock: "In stock",
  out_of_stock: "Out of stock",
  preorder: "Pre-order",
};
