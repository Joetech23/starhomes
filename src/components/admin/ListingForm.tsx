"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Listing, PropertyType } from "@/lib/properties";
import MediaManager from "./MediaManager";

type FeatureRow = { k: string; v: string };
type FeeRow = { label: string; amount: number; note: string };

const TYPES: PropertyType[] = ["rent", "sale", "land", "shortlet", "commercial"];

const input =
  "w-full rounded-[11px] border border-line-input bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none focus:border-brand";
const label = "mb-1.5 block text-[12px] font-bold uppercase tracking-[0.05em] text-muted-light";

export default function ListingForm({
  listing,
  agents,
}: {
  listing?: Listing;
  agents: { id: string; name: string }[];
}) {
  const router = useRouter();
  const editing = !!listing;

  const [f, setF] = useState({
    type: (listing?.type ?? "rent") as PropertyType,
    title: listing?.title ?? "",
    location: listing?.location ?? "",
    price: listing?.price ?? 0,
    unit: listing?.unit ?? "",
    status: listing?.status ?? "draft",
    featured: listing?.featured ?? false,
    description: listing?.description ?? "",
    total_label: listing?.totalLabel ?? "Total payable",
    agent_id: listing?.agentId ?? "",
    card_specs: (listing?.cardSpecs ?? []).join(", "),
    amenities: (listing?.amenities ?? []).join("\n"),
  });
  const [features, setFeatures] = useState<FeatureRow[]>(
    listing?.features?.length ? listing.features : [{ k: "", v: "" }]
  );
  const [fees, setFees] = useState<FeeRow[]>(
    listing?.fees?.length ? listing.fees : [{ label: "", amount: 0, note: "" }]
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const set = (k: keyof typeof f, v: unknown) => setF((s) => ({ ...s, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);

    const payload = {
      type: f.type,
      title: f.title.trim(),
      location: f.location.trim(),
      price: Number(f.price) || 0,
      unit: f.unit.trim(),
      status: f.status,
      featured: f.featured,
      description: f.description.trim() || null,
      total_label: f.total_label.trim() || "Total payable",
      agent_id: f.agent_id || null,
      card_specs: f.card_specs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      amenities: f.amenities
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      features: features.filter((x) => x.k.trim() || x.v.trim()),
      fees: fees
        .filter((x) => x.label.trim())
        .map((x) => ({ label: x.label, amount: Number(x.amount) || 0, note: x.note })),
    };

    const supabase = createClient();
    if (editing) {
      const { error } = await supabase
        .from("listings")
        .update(payload)
        .eq("id", listing!.id);
      if (error) {
        setErr(error.message);
        setSaving(false);
        return;
      }
      router.refresh();
      setSaving(false);
    } else {
      const { data, error } = await supabase
        .from("listings")
        .insert(payload)
        .select("id")
        .single();
      if (error) {
        setErr(error.message);
        setSaving(false);
        return;
      }
      router.push(`/admin/listings/${data.id}/edit`);
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {/* Basics */}
      <section className="rounded-[16px] border border-line bg-white p-5">
        <h2 className="m-0 mb-4 font-display text-[17px] font-extrabold text-ink-900">
          Basics
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={label}>Title</label>
            <input
              required
              className={input}
              value={f.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>
          <div>
            <label className={label}>Location</label>
            <input
              required
              className={input}
              value={f.location}
              onChange={(e) => set("location", e.target.value)}
            />
          </div>
          <div>
            <label className={label}>Type</label>
            <select
              className={input}
              value={f.type}
              onChange={(e) => set("type", e.target.value)}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Price (₦)</label>
            <input
              type="number"
              className={input}
              value={f.price}
              onChange={(e) => set("price", e.target.value)}
            />
          </div>
          <div>
            <label className={label}>Unit (e.g. /year, /night)</label>
            <input
              className={input}
              value={f.unit}
              onChange={(e) => set("unit", e.target.value)}
            />
          </div>
          <div>
            <label className={label}>Status</label>
            <select
              className={input}
              value={f.status}
              onChange={(e) => set("status", e.target.value)}
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </div>
          <div>
            <label className={label}>Agent</label>
            <select
              className={input}
              value={f.agent_id}
              onChange={(e) => set("agent_id", e.target.value)}
            >
              <option value="">— none —</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2.5 sm:col-span-2">
            <input
              type="checkbox"
              checked={f.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="h-4 w-4 accent-brand"
            />
            <span className="text-[14px] font-semibold text-ink">
              Featured on homepage
            </span>
          </label>
          <div className="sm:col-span-2">
            <label className={label}>Card specs (comma separated)</label>
            <input
              className={input}
              placeholder="3 Beds, 3 Baths, 180 sqm"
              value={f.card_specs}
              onChange={(e) => set("card_specs", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Description (optional)</label>
            <textarea
              rows={4}
              className={input}
              placeholder="Leave blank to auto-generate from type & location."
              value={f.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="rounded-[16px] border border-line bg-white p-5">
        <h2 className="m-0 mb-4 font-display text-[17px] font-extrabold text-ink-900">
          Key features
        </h2>
        <div className="flex flex-col gap-2.5">
          {features.map((row, i) => (
            <div key={i} className="flex gap-2.5">
              <input
                className={input}
                placeholder="Label (e.g. Bedrooms)"
                value={row.k}
                onChange={(e) => {
                  const next = [...features];
                  next[i] = { ...next[i], k: e.target.value };
                  setFeatures(next);
                }}
              />
              <input
                className={input}
                placeholder="Value (e.g. 3)"
                value={row.v}
                onChange={(e) => {
                  const next = [...features];
                  next[i] = { ...next[i], v: e.target.value };
                  setFeatures(next);
                }}
              />
              <button
                type="button"
                onClick={() => setFeatures(features.filter((_, j) => j !== i))}
                className="flex-none rounded-[10px] border border-line px-3 text-[13px] text-muted hover:border-red-500 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setFeatures([...features, { k: "", v: "" }])}
          className="mt-3 text-[13px] font-bold text-brand"
        >
          + Add feature
        </button>
      </section>

      {/* Fees */}
      <section className="rounded-[16px] border border-line bg-white p-5">
        <h2 className="m-0 mb-1 font-display text-[17px] font-extrabold text-ink-900">
          Cost breakdown
        </h2>
        <p className="m-0 mb-4 text-[12.5px] text-muted">
          Total ({f.total_label}):{" "}
          <strong className="text-ink">
            ₦
            {fees
              .reduce((s, x) => s + (Number(x.amount) || 0), 0)
              .toLocaleString("en-NG")}
          </strong>
        </p>
        <div className="flex flex-col gap-2.5">
          {fees.map((row, i) => (
            <div key={i} className="flex gap-2.5">
              <input
                className={`${input} flex-[2]`}
                placeholder="Label (e.g. Annual Rent)"
                value={row.label}
                onChange={(e) => {
                  const next = [...fees];
                  next[i] = { ...next[i], label: e.target.value };
                  setFees(next);
                }}
              />
              <input
                type="number"
                className={`${input} flex-1`}
                placeholder="Amount"
                value={row.amount}
                onChange={(e) => {
                  const next = [...fees];
                  next[i] = { ...next[i], amount: Number(e.target.value) };
                  setFees(next);
                }}
              />
              <input
                className={`${input} flex-1`}
                placeholder="Note"
                value={row.note}
                onChange={(e) => {
                  const next = [...fees];
                  next[i] = { ...next[i], note: e.target.value };
                  setFees(next);
                }}
              />
              <button
                type="button"
                onClick={() => setFees(fees.filter((_, j) => j !== i))}
                className="flex-none rounded-[10px] border border-line px-3 text-[13px] text-muted hover:border-red-500 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => setFees([...fees, { label: "", amount: 0, note: "" }])}
            className="text-[13px] font-bold text-brand"
          >
            + Add fee
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-muted-light">
              Total label:
            </span>
            <input
              className="rounded-[10px] border border-line-input px-2.5 py-1.5 text-[13px] outline-none focus:border-brand"
              value={f.total_label}
              onChange={(e) => set("total_label", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="rounded-[16px] border border-line bg-white p-5">
        <h2 className="m-0 mb-1 font-display text-[17px] font-extrabold text-ink-900">
          Amenities
        </h2>
        <p className="m-0 mb-3 text-[12.5px] text-muted">One per line.</p>
        <textarea
          rows={6}
          className={input}
          value={f.amenities}
          onChange={(e) => set("amenities", e.target.value)}
        />
      </section>

      {err && (
        <p className="m-0 text-[14px] font-semibold text-red-600">{err}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-brand px-7 py-3 text-[15px] font-bold text-white transition-colors hover:bg-brand-hover disabled:opacity-60"
        >
          {saving ? "Saving…" : editing ? "Save changes" : "Create listing"}
        </button>
        {!editing && (
          <span className="text-[13px] text-muted-light">
            You can add photos &amp; documents after creating.
          </span>
        )}
      </div>

      {/* Media — only once the listing exists */}
      {editing && <MediaManager listingId={listing!.id} />}
    </form>
  );
}
