"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_href: string | null;
  placement: string;
  active: boolean;
  sort: number;
}

const empty = {
  title: "",
  subtitle: "",
  image_url: "",
  cta_label: "",
  cta_href: "",
  placement: "home_hero",
  active: true,
  sort: 0,
};

const PLACEMENTS = ["home_hero", "home_strip", "popup"];
const input =
  "w-full rounded-[11px] border border-line-input bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none focus:border-brand";

export default function BannerManager() {
  const supabase = createClient();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("banners")
      .select("id, title, subtitle, image_url, cta_label, cta_href, placement, active, sort")
      .order("placement")
      .order("sort");
    setBanners((data as Banner[]) ?? []);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await supabase.from("banners").insert({
      title: form.title.trim() || null,
      subtitle: form.subtitle.trim() || null,
      image_url: form.image_url.trim() || null,
      cta_label: form.cta_label.trim() || null,
      cta_href: form.cta_href.trim() || null,
      placement: form.placement,
      active: form.active,
      sort: Number(form.sort) || 0,
    });
    setForm(empty);
    await load();
    setBusy(false);
  }

  async function toggleActive(b: Banner) {
    await supabase.from("banners").update({ active: !b.active }).eq("id", b.id);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this banner?")) return;
    await supabase.from("banners").delete().eq("id", id);
    load();
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
      <div className="flex flex-col gap-3">
        {banners.length === 0 && (
          <div className="rounded-[16px] border border-line bg-white p-8 text-center text-[14px] text-muted-light">
            No banners yet.
          </div>
        )}
        {banners.map((b) => (
          <div key={b.id} className="flex gap-3 rounded-[16px] border border-line bg-white p-3">
            <div className="relative h-[64px] w-[96px] flex-none overflow-hidden rounded-[10px] bg-cream">
              {b.image_url && <Image src={b.image_url} alt="" fill sizes="96px" className="object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-[14px] font-bold text-ink">{b.title || "(no title)"}</span>
                <span className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-bold text-muted">{b.placement}</span>
                {!b.active && <span className="rounded-full bg-[#F1F1ED] px-2 py-0.5 text-[10px] font-bold text-muted">hidden</span>}
              </div>
              <div className="truncate text-[12.5px] text-muted-light">{b.subtitle}</div>
              <div className="mt-1.5 flex gap-3">
                <button onClick={() => toggleActive(b)} className="text-[11.5px] font-bold text-brand">
                  {b.active ? "Hide" : "Show"}
                </button>
                <button onClick={() => remove(b.id)} className="text-[11.5px] font-bold text-red-600">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={add} className="h-fit rounded-[16px] border border-line bg-white p-5">
        <h2 className="m-0 mb-4 font-display text-[16px] font-extrabold text-ink-900">Add banner</h2>
        <div className="flex flex-col gap-2.5">
          <select className={input} value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value })}>
            {PLACEMENTS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <input placeholder="Title" className={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input placeholder="Subtitle" className={input} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          <input placeholder="Image URL (for hero)" className={input} value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <input placeholder="CTA label (e.g. Shop now)" className={input} value={form.cta_label} onChange={(e) => setForm({ ...form, cta_label: e.target.value })} />
          <input placeholder="CTA link (e.g. /shop/wears)" className={input} value={form.cta_href} onChange={(e) => setForm({ ...form, cta_href: e.target.value })} />
          <input type="number" placeholder="Sort (0 first)" className={input} value={form.sort} onChange={(e) => setForm({ ...form, sort: Number(e.target.value) })} />
          <label className="flex items-center gap-2.5">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 accent-brand" />
            <span className="text-[14px] font-semibold text-ink">Active</span>
          </label>
          <button type="submit" disabled={busy} className="mt-1 rounded-[12px] bg-brand py-3 text-[14.5px] font-bold text-white transition-colors hover:bg-brand-hover disabled:opacity-60">
            {busy ? "Adding…" : "Add banner"}
          </button>
        </div>
        <p className="m-0 mt-3 text-[11.5px] text-muted-light">
          Placements: <b>home_hero</b> (rotating top carousel), <b>home_strip</b> (green promo bar),
          <b> popup</b> (welcome modal — first one used).
        </p>
      </form>
    </div>
  );
}
