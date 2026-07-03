"use client";

import { useRouter } from "next/navigation";

const CATS: [string, string][] = [
  ["all", "All"],
  ["sale", "For Sale"],
  ["rent", "For Rent"],
  ["land", "Land"],
  ["shortlet", "Shortlets"],
  ["commercial", "Commercial"],
];

export default function CategoryTabs({
  active,
  location,
  budget,
}: {
  active: string;
  location?: string;
  budget?: string;
}) {
  const router = useRouter();

  const hrefFor = (key: string) => {
    const params = new URLSearchParams();
    if (key !== "all") params.set("type", key);
    if (location) params.set("location", location);
    if (budget) params.set("budget", budget);
    const qs = params.toString();
    return qs ? `/properties?${qs}` : "/properties";
  };

  return (
    <div className="mb-7 flex flex-wrap gap-[9px]">
      {CATS.map(([key, label]) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => router.push(hrefFor(key))}
            className={`rounded-full border px-[17px] py-[9px] text-[13.5px] font-semibold transition-colors ${
              isActive
                ? "border-ink bg-ink text-white"
                : "border-line-input bg-white text-[#3A3F32] hover:border-[#D6DACC]"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
