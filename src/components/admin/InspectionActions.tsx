"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const STATUSES = ["new", "contacted", "scheduled", "done", "cancelled"];

export default function InspectionActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function change(next: string) {
    setBusy(true);
    await createClient()
      .from("inspection_requests")
      .update({ status: next, handled: next !== "new" })
      .eq("id", id);
    setBusy(false);
    router.refresh();
  }

  return (
    <select
      value={status}
      disabled={busy}
      onChange={(e) => change(e.target.value)}
      className="rounded-[8px] border border-line-input bg-white px-2.5 py-1.5 text-[12.5px] font-semibold text-ink outline-none focus:border-brand disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
