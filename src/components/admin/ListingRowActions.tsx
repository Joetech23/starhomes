"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ListingRowActions({
  id,
  status,
  featured,
}: {
  id: string;
  status: string;
  featured: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function run(fn: () => PromiseLike<unknown>) {
    setBusy(true);
    await fn();
    setBusy(false);
    router.refresh();
  }

  const supabase = createClient();

  const togglePublish = () =>
    run(() =>
      supabase
        .from("listings")
        .update({ status: status === "published" ? "draft" : "published" })
        .eq("id", id)
    );

  const toggleFeatured = () =>
    run(() =>
      supabase.from("listings").update({ featured: !featured }).eq("id", id)
    );

  const remove = () => {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    run(() => supabase.from("listings").delete().eq("id", id));
  };

  const btn =
    "rounded-[8px] border border-line px-2.5 py-1.5 text-[12px] font-semibold transition-colors disabled:opacity-50";

  return (
    <div className="flex items-center justify-end gap-1.5">
      <button onClick={toggleFeatured} disabled={busy} className={`${btn} hover:border-brand hover:text-brand`}>
        {featured ? "Unfeature" : "Feature"}
      </button>
      <button onClick={togglePublish} disabled={busy} className={`${btn} hover:border-ink hover:text-ink`}>
        {status === "published" ? "Unpublish" : "Publish"}
      </button>
      <button onClick={remove} disabled={busy} className={`${btn} hover:border-red-500 hover:text-red-600`}>
        Delete
      </button>
    </div>
  );
}
