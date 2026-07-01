"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  async function signOut() {
    await createClient().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={signOut}
      className="rounded-[10px] border border-line px-3 py-2 text-[13px] font-semibold text-muted transition-colors hover:border-ink hover:text-ink"
    >
      Sign out
    </button>
  );
}
