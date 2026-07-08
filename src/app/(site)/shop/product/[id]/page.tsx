import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductBuyPanel from "@/components/shop/ProductBuyPanel";
import ProductGallery from "@/components/shop/ProductGallery";
import {
  coverPhoto,
  galleryPhotos,
  priceText,
  discountPct,
  DEPARTMENT_LABEL,
  STOCK_LABEL,
} from "@/lib/products";
import { getProduct, getRelatedProducts } from "@/lib/queries";
import { naira, SITE_URL } from "@/lib/site";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const p = await getProduct(params.id);
  if (!p) return { title: "Product not found" };
  const title = `${p.name} — ${priceText(p)}`;
  const rawDesc = p.shortDescription ?? p.description ?? `${p.name} available at Star Homes.`;
  const description = rawDesc.length > 155 ? rawDesc.slice(0, 152).trimEnd() + "…" : rawDesc;
  const cover = coverPhoto(p);
  const url = `/shop/product/${p.id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: cover, width: 1200, height: 1200, alt: p.name }],
    },
    twitter: { card: "summary_large_image", title, description, images: [cover] },
  };
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const p = await getProduct(params.id);
  if (!p || p.status !== "published") notFound();

  const photos = galleryPhotos(p);
  const off = discountPct(p);
  const related = await getRelatedProducts(p, 4);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description ?? p.shortDescription ?? p.name,
    image: photos.map((m) => m.url),
    category: p.category ?? DEPARTMENT_LABEL[p.department],
    brand: { "@type": "Brand", name: "Star Homes & Properties" },
    ...(p.price > 0 && {
      offers: {
        "@type": "Offer",
        price: p.price,
        priceCurrency: "NGN",
        availability:
          p.stockStatus === "out_of_stock"
            ? "https://schema.org/OutOfStock"
            : p.stockStatus === "preorder"
              ? "https://schema.org/PreOrder"
              : "https://schema.org/InStock",
        url: `${SITE_URL}/shop/product/${p.id}`,
      },
    }),
  };

  return (
    <section className="container-site py-8 pb-16">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="mb-5 flex items-center gap-1.5 text-[13px] text-muted-light">
        <Link href="/shop" className="hover:text-brand">Shop</Link>
        <span>/</span>
        <Link href={`/shop/${p.department}`} className="hover:text-brand">
          {DEPARTMENT_LABEL[p.department]}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        {/* Gallery */}
        <ProductGallery photos={photos} name={p.name} />

        {/* Info + buy */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-leaf-bg px-2.5 py-1 text-[11.5px] font-bold text-brand-ink">
              {p.category || DEPARTMENT_LABEL[p.department]}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-[11.5px] font-bold ${
                p.stockStatus === "out_of_stock"
                  ? "bg-[#F1F1ED] text-muted"
                  : "bg-leaf-bg text-brand-ink"
              }`}
            >
              {STOCK_LABEL[p.stockStatus]}
            </span>
          </div>

          <h1 className="m-0 mb-3 font-display text-[26px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#13160F] sm:text-[32px]">
            {p.name}
          </h1>

          <div className="mb-5 flex items-baseline gap-3 border-b border-[#EAEDE3] pb-5">
            <span className="font-display text-[30px] font-extrabold tracking-[-0.02em] text-brand">
              {priceText(p)}
            </span>
            {p.compareAtPrice && p.compareAtPrice > p.price && (
              <>
                <span className="text-[16px] font-semibold text-muted-light line-through">
                  {naira(p.compareAtPrice)}
                </span>
                {off && (
                  <span className="rounded-full bg-brand px-2 py-0.5 text-[12px] font-extrabold text-white">
                    Save {off}%
                  </span>
                )}
              </>
            )}
          </div>

          {p.shortDescription && (
            <p className="m-0 mb-6 text-[15px] leading-[1.6] text-[#4F5547]">
              {p.shortDescription}
            </p>
          )}

          <ProductBuyPanel product={p} />

          {p.description && (
            <div className="mt-8 border-t border-line pt-6">
              <h2 className="m-0 mb-2.5 font-display text-[18px] font-bold text-[#13160F]">
                Details
              </h2>
              <p className="m-0 whitespace-pre-wrap text-[14.5px] leading-[1.7] text-[#4F5547]">
                {p.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="m-0 mb-6 font-display text-[24px] font-extrabold tracking-[-0.02em] text-[#13160F]">
            You may also like
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.id} p={r} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
