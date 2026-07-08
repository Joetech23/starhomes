"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ComingSoonSignup() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await createClient()
        .from("subscribers")
        .insert({ email: email.trim(), source: "gadgets_waitlist" });
    } catch {
      /* ignore */
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-[400px] rounded-[14px] border border-leaf-border bg-leaf-bg px-5 py-4 text-[14px] font-semibold text-brand-ink">
        You're on the waitlist 🎉 We'll email you when gadgets launch.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto flex max-w-[420px] flex-col gap-2.5 sm:flex-row">
      <input
        type="email"
        required
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-[12px] border border-line-input bg-white px-4 py-3 text-[14px] text-ink outline-none focus:border-brand"
      />
      <button
        type="submit"
        className="rounded-[12px] bg-brand px-6 py-3 text-[14.5px] font-bold text-white transition-colors hover:bg-brand-hover"
      >
        Notify me
      </button>
    </form>
  );
}
