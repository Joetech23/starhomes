import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import ShopFilterBar from "@/components/shop/ShopFilterBar";
import { getProducts, getProductCategories } from "@/lib/queries";
import { DEPARTMENT_LABEL, PRODUCT_BUDGET_RANGES } from "@/lib/products";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

export const revalidate = 60;

const VALID_DEPT = ["interiors", "wears"];

type SearchParams = {
  department?: string;
  category?: string;
  budget?: string;
  sort?: string;
  q?: string;
};

export function generateMetadata({ searchParams }: { searchParams: SearchParams }): Metadata {
  const dept = searchParams.department && VALID_DEPT.includes(searchParams.department)
    ? DEPARTMENT_LABEL[searchParams.department as "interiors" | "wears"]
    : null;
  const title = dept ? `Shop ${dept} — Star Homes` : "Shop — Interiors & Wears | Star Homes";
  const description = dept
    ? `Buy ${dept.toLowerCase()} online at Star Homes — delivered across Anambra and Nigeria.`
    : "Shop home interiors, furniture and fashion wears at Star Homes — quality products, delivered across Nigeria.";
  return {
    title,
    description,
    alternates: { canonical: "/shop" },
    openGraph: {
      title,
      description,
      url: "/shop",
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Star Homes Marketplace" }],
    },
  };
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const department = searchParams.department && VALID_DEPT.includes(searchParams.department)
    ? searchParams.department
    : undefined;
  const budget = searchParams.budget && PRODUCT_BUDGET_RANGES[searchParams.budget]
    ? searchParams.budget
    : undefined;
  const sort = searchParams.sort;
  const q = searchParams.q?.trim() || undefined;
  const category = searchParams.category || undefined;

  const [products, categories] = await Promise.all([
    getProducts({ department, category, budget, sort, q }),
    department ? getProductCategories(department) : Promise.resolve([]),
  ]);

  return (
    <>
      <section className="border-b border-[#EEF0E8] bg-[#F6F8F1]">
        <div className="container-site py-10 pb-8">
          <h1 className="m-0 mb-1.5 font-display text-[30px] font-extrabold tracking-[-0.02em] text-[#13160F] sm:text-[38px]">
            {department ? `Shop ${DEPARTMENT_LABEL[department as "interiors" | "wears"]}` : "Shop the marketplace"}
          </h1>
          <p className="m-0 text-[15.5px] text-muted">
            {products.length} {products.length === 1 ? "product" : "products"} available.
          </p>
        </div>
      </section>

      <section className="container-site py-8 pb-16">
        <div className="mb-7">
          <ShopFilterBar
            department={department}
            budget={budget}
            sort={sort}
            categories={categories}
            category={category}
            q={q}
          />
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-[15px] text-muted">
            No products match your filters yet — try clearing them or check back soon.
          </p>
        )}
      </section>
    </>
  );
}
