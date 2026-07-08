import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/products";

export default function ProductRail({
  title,
  href,
  products,
}: {
  title: string;
  href: string;
  products: Product[];
}) {
  if (products.length === 0) return null;
  return (
    <section className="container-site py-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 className="m-0 font-display text-[24px] font-extrabold tracking-[-0.02em] text-[#13160F] sm:text-[30px]">
          {title}
        </h2>
        <Link href={href} className="whitespace-nowrap text-[14px] font-bold text-brand">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
