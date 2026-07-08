"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DEPARTMENTS, PRODUCT_BUDGET_OPTIONS } from "@/lib/products";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

export default function ShopFilterBar({
  department,
  budget,
  sort,
  categories,
  category,
  q,
}: {
  department?: string;
  budget?: string;
  sort?: string;
  categories?: string[];
  category?: string;
  q?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const setParam = (key: string, value?: string) => {
    const p = new URLSearchParams(params.toString());
    if (value) p.set(key, value);
    else p.delete(key);
    // reset category when switching department
    if (key === "department") p.delete("category");
    const qs = p.toString();
    router.push(qs ? `/shop?${qs}` : "/shop");
  };

  const chip = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
      active
        ? "border-ink bg-ink text-white"
        : "border-line-input bg-white text-[#3A3F32] hover:border-[#D6DACC]"
    }`;

  return (
    <div className="flex flex-col gap-3">
      {/* Department chips */}
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setParam("department")} className={chip(!department)}>
          All
        </button>
        {DEPARTMENTS.filter((d) => !d.comingSoon).map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => setParam("department", d.key)}
            className={chip(department === d.key)}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Category chips (when a department is chosen) */}
      {categories && categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setParam("category")} className={chip(!category)}>
            All {DEPARTMENTS.find((d) => d.key === department)?.label ?? ""}
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setParam("category", c)}
              className={chip(category === c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Budget + sort */}
      <div className="flex flex-wrap items-center gap-3">
        {q && (
          <span className="rounded-full bg-leaf-bg px-3 py-1.5 text-[12.5px] font-bold text-brand-ink">
            Search: “{q}”
          </span>
        )}
        <select
          value={budget ?? ""}
          onChange={(e) => setParam("budget", e.target.value || undefined)}
          className="rounded-[10px] border border-line-input bg-white px-3 py-2 text-[13.5px] font-semibold text-ink outline-none focus:border-brand"
        >
          <option value="">Any price</option>
          {PRODUCT_BUDGET_OPTIONS.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
        <select
          value={sort ?? "newest"}
          onChange={(e) => setParam("sort", e.target.value === "newest" ? undefined : e.target.value)}
          className="rounded-[10px] border border-line-input bg-white px-3 py-2 text-[13.5px] font-semibold text-ink outline-none focus:border-brand"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
