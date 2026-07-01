"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EnquiryActions({
  id,
  handled,
}: {
  id: string;
  handled: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await createClient()
      .from("enquiries")
      .update({ handled: !handled })
      .eq("id", id);
    setBusy(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className={`rounded-[8px] border px-2.5 py-1.5 text-[12px] font-semibold transition-colors disabled:opacity-50 ${
        handled
          ? "border-line text-muted hover:border-ink hover:text-ink"
          : "border-brand text-brand hover:bg-brand hover:text-white"
      }`}
    >
      {handled ? "Mark unhandled" : "Mark handled"}
    </button>
  );
}
