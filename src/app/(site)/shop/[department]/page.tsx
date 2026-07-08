import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ComingSoonSignup from "@/components/shop/ComingSoonSignup";
import { getProducts, getProductCategories } from "@/lib/queries";
import { DEPARTMENT_LABEL, PRODUCT_BUDGET_RANGES, type Department } from "@/lib/products";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

export const revalidate = 60;

const KNOWN: Department[] = ["interiors", "wears", "gadgets"];

type Params = { department: string };
type SearchParams = { category?: string; budget?: string; sort?: string };

export function generateMetadata({ params }: { params: Params }): Metadata {
  const d = params.department as Department;
  if (!KNOWN.includes(d)) return { title: "Not found" };
  const label = DEPARTMENT_LABEL[d];
  const title =
    d === "gadgets"
      ? "Gadgets — Coming Soon | Star Homes"
      : `${label} — Buy Online | Star Homes`;
  const description =
    d === "gadgets"
      ? "Phones, audio and smart devices are coming soon to Star Homes. Join the list to be notified first."
      : `Shop ${label.toLowerCase()} at Star Homes — quality products delivered across Anambra and Nigeria.`;
  return {
    title,
    description,
    alternates: { canonical: `/shop/${d}` },
    openGraph: {
      title,
      description,
      url: `/shop/${d}`,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: `Star Homes ${label}` }],
    },
  };
}

export default async function DepartmentPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const d = params.department as Department;
  if (!KNOWN.includes(d)) notFound();

  if (d === "gadgets") {
    return (
      <section className="container-site py-16 text-center">
        <div className="mx-auto max-w-[560px]">
          <div className="relative mx-auto mb-8 h-[220px] w-full max-w-[420px] overflow-hidden rounded-[22px]">
            <Image
              src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=80"
              alt="Gadgets coming soon"
              fill
              sizes="420px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/95 px-4 py-2 text-[13px] font-extrabold text-ink">
              Coming soon
            </span>
          </div>
          <h1 className="m-0 mb-3 font-display text-[32px] font-extrabold tracking-[-0.02em] text-[#13160F] sm:text-[40px]">
            Gadgets are on the way ⚡
          </h1>
          <p className="m-0 mb-7 text-[16px] leading-[1.6] text-muted">
            Phones, audio, chargers and smart devices are launching soon on Star Homes. Drop your
            email and we'll let you know the moment they land.
          </p>
          <ComingSoonSignup />
          <div className="mt-8">
            <Link href="/shop" className="text-[14px] font-bold text-brand">
              ← Meanwhile, shop Interiors &amp; Wears
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const budget = searchParams.budget && PRODUCT_BUDGET_RANGES[searchParams.budget]
    ? searchParams.budget
    : undefined;
  const category = searchParams.category || undefined;
  const [products, categories] = await Promise.all([
    getProducts({ department: d, category, budget, sort: searchParams.sort }),
    getProductCategories(d),
  ]);
  const label = DEPARTMENT_LABEL[d];

  return (
    <>
      <section className="border-b border-[#EEF0E8] bg-[#F6F8F1]">
        <div className="container-site py-10 pb-8">
          <Link href="/shop" className="mb-3 inline-block text-[13.5px] font-semibold text-muted hover:text-brand">
            ← All departments
          </Link>
          <h1 className="m-0 mb-1.5 font-display text-[30px] font-extrabold tracking-[-0.02em] text-[#13160F] sm:text-[38px]">
            {label}
          </h1>
          <p className="m-0 text-[15.5px] text-muted">
            {products.length} {products.length === 1 ? "product" : "products"} available.
          </p>
        </div>
      </section>

      <section className="container-site py-8 pb-16">
        {categories.length > 0 && (
          <div className="mb-7 flex flex-wrap gap-2">
            <Link
              href={`/shop/${d}`}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold ${
                !category ? "border-ink bg-ink text-white" : "border-line-input bg-white text-[#3A3F32] hover:border-[#D6DACC]"
              }`}
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c}
                href={`/shop/${d}?category=${encodeURIComponent(c)}`}
                className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold ${
                  category === c ? "border-ink bg-ink text-white" : "border-line-input bg-white text-[#3A3F32] hover:border-[#D6DACC]"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>
        )}

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-[15px] text-muted">
            No products here yet — check back soon.
          </p>
        )}
      </section>
    </>
  );
}
