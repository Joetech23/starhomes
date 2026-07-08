"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Product, Department } from "@/lib/products";
import ProductMediaManager from "./ProductMediaManager";

const DEPARTMENTS: Department[] = ["interiors", "wears", "gadgets"];
const STOCK = ["in_stock", "out_of_stock", "preorder"];

const input =
  "w-full rounded-[11px] border border-line-input bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none focus:border-brand";
const label = "mb-1.5 block text-[12px] font-bold uppercase tracking-[0.05em] text-muted-light";

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const editing = !!product;

  const [f, setF] = useState({
    department: (product?.department ?? "interiors") as Department,
    category: product?.category ?? "",
    name: product?.name ?? "",
    price: product?.price ?? 0,
    compare_at_price: product?.compareAtPrice ?? "",
    short_description: product?.shortDescription ?? "",
    description: product?.description ?? "",
    sizes: (product?.sizes ?? []).join(", "),
    colors: (product?.colors ?? []).join(", "),
    stock_status: product?.stockStatus ?? "in_stock",
    featured: product?.featured ?? false,
    status: product?.status ?? "draft",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const set = (k: keyof typeof f, v: unknown) => setF((s) => ({ ...s, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);

    const payload = {
      department: f.department,
      category: f.category.trim() || null,
      name: f.name.trim(),
      price: Number(f.price) || 0,
      compare_at_price: f.compare_at_price === "" ? null : Number(f.compare_at_price),
      short_description: f.short_description.trim() || null,
      description: f.description.trim() || null,
      sizes: f.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: f.colors.split(",").map((s) => s.trim()).filter(Boolean),
      stock_status: f.stock_status,
      featured: f.featured,
      status: f.status,
    };

    const supabase = createClient();
    if (editing) {
      const { error } = await supabase.from("products").update(payload).eq("id", product!.id);
      if (error) return (setErr(error.message), setSaving(false), undefined);
      router.refresh();
      setSaving(false);
    } else {
      const { data, error } = await supabase.from("products").insert(payload).select("id").single();
      if (error) return (setErr(error.message), setSaving(false), undefined);
      router.push(`/admin/products/${data.id}/edit`);
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <section className="rounded-[16px] border border-line bg-white p-5">
        <h2 className="m-0 mb-4 font-display text-[17px] font-extrabold text-ink-900">Product details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={label}>Name</label>
            <input required className={input} value={f.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <label className={label}>Department</label>
            <select className={input} value={f.department} onChange={(e) => set("department", e.target.value)}>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Category</label>
            <input className={input} placeholder="e.g. Furniture, Men, Footwear" value={f.category} onChange={(e) => set("category", e.target.value)} />
          </div>
          <div>
            <label className={label}>Price (₦)</label>
            <input type="number" className={input} value={f.price} onChange={(e) => set("price", e.target.value)} />
          </div>
          <div>
            <label className={label}>Compare-at price (₦, optional)</label>
            <input type="number" className={input} placeholder="Old price for a discount" value={f.compare_at_price} onChange={(e) => set("compare_at_price", e.target.value)} />
          </div>
          <div>
            <label className={label}>Stock</label>
            <select className={input} value={f.stock_status} onChange={(e) => set("stock_status", e.target.value)}>
              {STOCK.map((s) => (
                <option key={s} value={s}>{s.replace("_", " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Status</label>
            <select className={input} value={f.status} onChange={(e) => set("status", e.target.value)}>
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </div>
          <div>
            <label className={label}>Sizes (comma separated)</label>
            <input className={input} placeholder="S, M, L, XL" value={f.sizes} onChange={(e) => set("sizes", e.target.value)} />
          </div>
          <div>
            <label className={label}>Colours (comma separated)</label>
            <input className={input} placeholder="Black, Beige, Navy" value={f.colors} onChange={(e) => set("colors", e.target.value)} />
          </div>
          <label className="flex items-center gap-2.5 sm:col-span-2">
            <input type="checkbox" checked={f.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-brand" />
            <span className="text-[14px] font-semibold text-ink">Featured (shown on homepage rails)</span>
          </label>
          <div className="sm:col-span-2">
            <label className={label}>Short description (card / top of page)</label>
            <input className={input} value={f.short_description} onChange={(e) => set("short_description", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Full description</label>
            <textarea rows={4} className={input} value={f.description} onChange={(e) => set("description", e.target.value)} />
          </div>
        </div>
      </section>

      {err && <p className="m-0 text-[14px] font-semibold text-red-600">{err}</p>}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="rounded-full bg-brand px-7 py-3 text-[15px] font-bold text-white transition-colors hover:bg-brand-hover disabled:opacity-60">
          {saving ? "Saving…" : editing ? "Save changes" : "Create product"}
        </button>
        {!editing && <span className="text-[13px] text-muted-light">Add photos after creating.</span>}
      </div>

      {editing && <ProductMediaManager productId={product!.id} />}
    </form>
  );
}
