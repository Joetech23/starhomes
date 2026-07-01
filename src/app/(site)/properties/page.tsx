import Link from "next/link";
import CategoryTabs from "@/components/CategoryTabs";
import PropertyCard from "@/components/PropertyCard";
import { FILTER_LABEL_PLURAL } from "@/lib/properties";
import { getByType } from "@/lib/queries";

const VALID = ["all", "sale", "rent", "land", "shortlet", "commercial"];

export const revalidate = 60;

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const raw = searchParams.type ?? "all";
  const filter = VALID.includes(raw) ? raw : "all";
  const list = await getByType(filter);
  const title = FILTER_LABEL_PLURAL[filter];
  const subtitle =
    `${list.length} ${list.length === 1 ? "property" : "properties"} available across Nigeria.`;

  return (
    <>
      {/* Listings header */}
      <section className="border-b border-[#EEF0E8] bg-[#F6F8F1]">
        <div className="container-site py-10 pb-[34px]">
          <Link
            href="/"
            className="mb-3.5 inline-block text-[13.5px] font-semibold text-muted transition-colors hover:text-brand"
          >
            ← Back to home
          </Link>
          <h1 className="m-0 mb-1.5 font-display text-[30px] font-extrabold tracking-[-0.02em] text-[#13160F] sm:text-[38px]">
            {title}
          </h1>
          <p className="m-0 text-[15.5px] text-muted">{subtitle}</p>
        </div>
      </section>

      <section className="container-site py-14 pb-16">
        <CategoryTabs active={filter} />

        {list.length > 0 ? (
          <div className="grid grid-cols-1 gap-[26px] sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-[15px] text-muted">
            No properties in this category yet — check back soon.
          </p>
        )}
      </section>
    </>
  );
}
