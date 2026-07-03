import type { Metadata } from "next";
import Link from "next/link";
import CategoryTabs from "@/components/CategoryTabs";
import PropertyCard from "@/components/PropertyCard";
import { FILTER_LABEL_PLURAL, LOCATIONS, BUDGET_OPTIONS } from "@/lib/properties";
import { getFiltered, BUDGET_RANGES } from "@/lib/queries";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

const VALID = ["all", "sale", "rent", "land", "shortlet", "commercial"];

export const revalidate = 60;

type SearchParams = { type?: string; location?: string; budget?: string };

export function generateMetadata({ searchParams }: { searchParams: SearchParams }): Metadata {
  const raw = searchParams.type ?? "all";
  const filter = VALID.includes(raw) ? raw : "all";
  const typeLabel = FILTER_LABEL_PLURAL[filter];
  const locLabel = LOCATIONS.find((l) => l.keyword === searchParams.location)?.label;
  const title = locLabel
    ? `${typeLabel} in ${locLabel} — Star Homes & Properties`
    : `${typeLabel} — Star Homes & Properties`;
  const description = `Browse verified ${typeLabel.toLowerCase()}${
    locLabel ? ` in ${locLabel}` : " across Anambra and Nigeria"
  } — transparent fees, trusted agents, and homes you can inspect before you commit.`;
  const url = searchParams.type ? `/properties?type=${filter}` : "/properties";
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Star Homes & Properties" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = searchParams.type ?? "all";
  const filter = VALID.includes(raw) ? raw : "all";
  const location = searchParams.location && LOCATIONS.some((l) => l.keyword === searchParams.location)
    ? searchParams.location
    : undefined;
  const budget = searchParams.budget && BUDGET_RANGES[searchParams.budget] ? searchParams.budget : undefined;

  const list = await getFiltered({ type: filter, location, budget });
  const title = FILTER_LABEL_PLURAL[filter];

  const locLabel = LOCATIONS.find((l) => l.keyword === location)?.label;
  const budgetLabel = BUDGET_OPTIONS.find((b) => b.value === budget)?.label;
  const activeFilters = [locLabel, budgetLabel].filter(Boolean);

  const subtitle = activeFilters.length
    ? `${list.length} ${list.length === 1 ? "property" : "properties"} in ${activeFilters.join(", ")}.`
    : `${list.length} ${list.length === 1 ? "property" : "properties"} available across Nigeria.`;

  const hasFilters = Boolean(location || budget);

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
        <CategoryTabs active={filter} location={location} budget={budget} />

        {hasFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {locLabel && (
              <span className="rounded-full bg-leaf-bg px-3 py-1.5 text-[12.5px] font-bold text-brand-ink">
                📍 {locLabel}
              </span>
            )}
            {budgetLabel && (
              <span className="rounded-full bg-leaf-bg px-3 py-1.5 text-[12.5px] font-bold text-brand-ink">
                {budgetLabel}
              </span>
            )}
            <Link
              href={filter === "all" ? "/properties" : `/properties?type=${filter}`}
              className="text-[12.5px] font-bold text-muted underline decoration-dotted underline-offset-2 hover:text-brand"
            >
              Clear filters
            </Link>
          </div>
        )}

        {list.length > 0 ? (
          <div className="grid grid-cols-1 gap-[26px] sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="m-0 mb-3 text-[15px] text-muted">
              {hasFilters
                ? "No properties match those filters yet."
                : "No properties in this category yet — check back soon."}
            </p>
            {hasFilters && (
              <Link
                href={filter === "all" ? "/properties" : `/properties?type=${filter}`}
                className="text-[14px] font-bold text-brand"
              >
                Clear filters and see all {title.toLowerCase()} →
              </Link>
            )}
          </div>
        )}
      </section>
    </>
  );
}
