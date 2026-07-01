"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface Media {
  id: string;
  url: string;
  storage_path: string | null;
  kind: "photo" | "document";
  caption: string | null;
  is_cover: boolean;
  sort_order: number;
}

const BUCKET = "listing-media";

export default function MediaManager({ listingId }: { listingId: string }) {
  const supabase = createClient();
  const [media, setMedia] = useState<Media[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const docInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("listing_media")
      .select("id, url, storage_path, kind, caption, is_cover, sort_order")
      .eq("listing_id", listingId)
      .order("sort_order", { ascending: true });
    setMedia((data as Media[]) ?? []);
  }, [supabase, listingId]);

  useEffect(() => {
    load();
  }, [load]);

  async function upload(files: FileList | null, kind: "photo" | "document") {
    if (!files || files.length === 0) return;
    setBusy(true);
    setErr(null);
    const existing = media.filter((m) => m.kind === kind).length;
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${listingId}/${kind}s/${Date.now()}-${safe}`;
        const up = await supabase.storage.from(BUCKET).upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (up.error) throw up.error;
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
        const isCover = kind === "photo" && existing === 0 && i === 0;
        const ins = await supabase.from("listing_media").insert({
          listing_id: listingId,
          storage_path: path,
          url: pub.publicUrl,
          kind,
          sort_order: existing + i,
          is_cover: isCover,
        });
        if (ins.error) throw ins.error;
      }
      await load();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (photoInput.current) photoInput.current.value = "";
      if (docInput.current) docInput.current.value = "";
    }
  }

  async function makeCover(item: Media) {
    setBusy(true);
    await supabase
      .from("listing_media")
      .update({ is_cover: false })
      .eq("listing_id", listingId)
      .eq("kind", "photo");
    await supabase.from("listing_media").update({ is_cover: true }).eq("id", item.id);
    await load();
    setBusy(false);
  }

  async function remove(item: Media) {
    if (!confirm("Remove this file?")) return;
    setBusy(true);
    if (item.storage_path) {
      await supabase.storage.from(BUCKET).remove([item.storage_path]);
    }
    await supabase.from("listing_media").delete().eq("id", item.id);
    await load();
    setBusy(false);
  }

  async function setCaption(item: Media, caption: string) {
    await supabase.from("listing_media").update({ caption }).eq("id", item.id);
    setMedia((m) => m.map((x) => (x.id === item.id ? { ...x, caption } : x)));
  }

  const photos = media.filter((m) => m.kind === "photo");
  const docs = media.filter((m) => m.kind === "document");

  return (
    <div className="flex flex-col gap-6">
      {/* Photos */}
      <section className="rounded-[16px] border border-line bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="m-0 font-display text-[17px] font-extrabold text-ink-900">
            Photos
          </h2>
          <button
            type="button"
            disabled={busy}
            onClick={() => photoInput.current?.click()}
            className="rounded-full border border-brand px-4 py-2 text-[13px] font-bold text-brand transition-colors hover:bg-brand hover:text-white disabled:opacity-50"
          >
            {busy ? "Uploading…" : "+ Upload photos"}
          </button>
          <input
            ref={photoInput}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => upload(e.target.files, "photo")}
          />
        </div>
        {photos.length === 0 ? (
          <p className="m-0 text-[13px] text-muted-light">No photos yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {photos.map((m) => (
              <div
                key={m.id}
                className="overflow-hidden rounded-[12px] border border-line"
              >
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
                    <button
                      type="button"
                      onClick={() => makeCover(m)}
                      className="text-[11px] font-bold text-brand"
                    >
                      Set cover
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(m)}
                    className="ml-auto text-[11px] font-bold text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Documents */}
      <section className="rounded-[16px] border border-line bg-white p-5">
        <div className="mb-1 flex items-center justify-between gap-3">
          <h2 className="m-0 font-display text-[17px] font-extrabold text-ink-900">
            Documentation
          </h2>
          <button
            type="button"
            disabled={busy}
            onClick={() => docInput.current?.click()}
            className="rounded-full border border-brand px-4 py-2 text-[13px] font-bold text-brand transition-colors hover:bg-brand hover:text-white disabled:opacity-50"
          >
            {busy ? "Uploading…" : "+ Upload documents"}
          </button>
          <input
            ref={docInput}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => upload(e.target.files, "document")}
          />
        </div>
        <p className="m-0 mb-4 text-[12.5px] text-muted">
          C of O, survey plans, deeds. These appear in the public Documentation
          gallery on the listing page.
        </p>
        {docs.length === 0 ? (
          <p className="m-0 text-[13px] text-muted-light">No documents yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {docs.map((m) => (
              <div
                key={m.id}
                className="flex gap-3 rounded-[12px] border border-line p-2"
              >
                <div className="relative h-[64px] w-[64px] flex-none overflow-hidden rounded-[8px] bg-cream">
                  <Image src={m.url} alt="" fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <input
                    placeholder="Caption (e.g. Certificate of Occupancy)"
                    defaultValue={m.caption ?? ""}
                    onBlur={(e) => setCaption(m, e.target.value)}
                    className="w-full rounded-[8px] border border-line-input px-2 py-1.5 text-[12.5px] outline-none focus:border-brand"
                  />
                  <div className="flex items-center gap-3">
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener"
                      className="text-[11.5px] font-bold text-brand"
                    >
                      View
                    </a>
                    <button
                      type="button"
                      onClick={() => remove(m)}
                      className="text-[11.5px] font-bold text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {err && <p className="m-0 text-[13px] font-semibold text-red-600">{err}</p>}
    </div>
  );
}
