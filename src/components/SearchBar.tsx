"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LOCATIONS, BUDGET_OPTIONS } from "@/lib/properties";

const labelCls =
  "text-[11px] font-bold uppercase tracking-[0.06em] text-muted-light pl-0.5";
const selectCls =
  "rounded-[11px] border border-line-input bg-white px-3 py-[11px] text-[14.5px] font-semibold text-ink outline-none cursor-pointer";

export default function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [type, setType] = useState("all");
  const [budget, setBudget] = useState("");

  const onSearch = () => {
    const params = new URLSearchParams();
    if (type !== "all") params.set("type", type);
    if (location) params.set("location", location);
    if (budget) params.set("budget", budget);
    const qs = params.toString();
    router.push(qs ? `/properties?${qs}` : "/properties");
  };

  return (
    <div className="grid grid-cols-1 items-end gap-[10px] rounded-[18px] border border-line bg-white p-3.5 shadow-search sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_auto]">
      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>Location</span>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={selectCls}
        >
          <option value="">Anywhere</option>
          {LOCATIONS.map((l) => (
            <option key={l.keyword} value={l.keyword}>
              {l.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>Type</span>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={selectCls}
        >
          <option value="all">All types</option>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
          <option value="land">Land</option>
          <option value="shortlet">Shortlet</option>
          <option value="commercial">Commercial</option>
        </select>
      </label>
      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>Budget</span>
        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className={selectCls}
        >
          <option value="">Any price</option>
          {BUDGET_OPTIONS.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        onClick={onSearch}
        className="h-11 whitespace-nowrap rounded-[11px] bg-ink px-[22px] py-[13px] text-[14.5px] font-bold text-white transition-colors hover:bg-black"
      >
        Search
      </button>
    </div>
  );
}
