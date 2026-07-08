"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface Media {
  id: string;
  url: string;
  storage_path: string | null;
  is_cover: boolean;
  sort_order: number;
}

const BUCKET = "listing-media";

export default function ProductMediaManager({ productId }: { productId: string }) {
  const supabase = createClient();
  const [media, setMedia] = useState<Media[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("product_media")
      .select("id, url, storage_path, is_cover, sort_order")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true });
    setMedia((data as Media[]) ?? []);
  }, [supabase, productId]);

  useEffect(() => {
    load();
  }, [load]);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setErr(null);
    const existing = media.length;
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `products/${productId}/${Date.now()}-${safe}`;
        const up = await supabase.storage.from(BUCKET).upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (up.error) throw up.error;
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
        const ins = await supabase.from("product_media").insert({
          product_id: productId,
          storage_path: path,
          url: pub.publicUrl,
          kind: "photo",
          sort_order: existing + i,
          is_cover: existing === 0 && i === 0,
        });
        if (ins.error) throw ins.error;
      }
      await load();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  async function makeCover(item: Media) {
    setBusy(true);
    await supabase.from("product_media").update({ is_cover: false }).eq("product_id", productId);
    await supabase.from("product_media").update({ is_cover: true }).eq("id", item.id);
    await load();
    setBusy(false);
  }

  async function remove(item: Media) {
    if (!confirm("Remove this photo?")) return;
    setBusy(true);
    if (item.storage_path) await supabase.storage.from(BUCKET).remove([item.storage_path]);
    await supabase.from("product_media").delete().eq("id", item.id);
    await load();
    setBusy(false);
  }

  async function addByUrl() {
    const url = prompt("Paste an image URL");
    if (!url) return;
    setBusy(true);
    await supabase.from("product_media").insert({
      product_id: productId,
      url: url.trim(),
      kind: "photo",
      sort_order: media.length,
      is_cover: media.length === 0,
    });
    await load();
    setBusy(false);
  }

  return (
    <section className="rounded-[16px] border border-line bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="m-0 font-display text-[17px] font-extrabold text-ink-900">Photos</h2>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={addByUrl}
            className="rounded-full border border-line px-4 py-2 text-[13px] font-bold text-muted transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
          >
            Add by URL
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => input.current?.click()}
            className="rounded-full border border-brand px-4 py-2 text-[13px] font-bold text-brand transition-colors hover:bg-brand hover:text-white disabled:opacity-50"
          >
            {busy ? "Uploading…" : "+ Upload photos"}
          </button>
        </div>
        <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
      </div>

      {media.length === 0 ? (
        <p className="m-0 text-[13px] text-muted-light">No photos yet. Upload at least one.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {media.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-[12px] border border-line">
              <div className="relative h-[110px] w-full bg-cream">
                <Image src={m.url} alt="" fill sizes="200px" className="object-cover" />
                {m.is_cover && (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                    Cover
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1 p-1.5">
                {!m.is_cover && (
                  <button type="button" onClick={() => makeCover(m)} className="text-[11px] font-bold text-brand">
                    Set cover
                  </button>
                )}
                <button type="button" onClick={() => remove(m)} className="ml-auto text-[11px] font-bold text-red-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {err && <p className="m-0 mt-3 text-[13px] font-semibold text-red-600">{err}</p>}
    </section>
  );
}
