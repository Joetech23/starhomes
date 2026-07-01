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

export default function CategoryTabs({ active }: { active: string }) {
  const router = useRouter();

  return (
    <div className="mb-7 flex flex-wrap gap-[9px]">
      {CATS.map(([key, label]) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() =>
              router.push(key === "all" ? "/properties" : `/properties?type=${key}`)
            }
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
