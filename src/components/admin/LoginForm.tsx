"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErr(error.message);
      setLoading(false);
      return;
    }
    router.push(params.get("redirect") || "/admin");
    router.refresh();
  }

  const inputCls =
    "w-full rounded-[11px] border border-line-input bg-white px-3.5 py-2.5 text-[14.5px] text-ink outline-none focus:border-brand";

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5">
      <div className="w-full max-w-[400px] rounded-[20px] border border-line bg-white p-8 shadow-card">
        <div className="mb-6 flex items-center gap-[11px]">
          <Image
            src="/logo-mark.png"
            alt="Star Homes"
            width={48}
            height={46}
            style={{ width: "auto", height: "40px" }}
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[17px] font-extrabold text-ink">
              STAR HOMES
            </span>
            <span className="mt-[3px] text-[9px] font-bold tracking-[0.24em] text-brand">
              ADMIN
            </span>
          </span>
        </div>
        <h1 className="m-0 mb-1 font-display text-[22px] font-extrabold text-ink-900">
          Sign in
        </h1>
        <p className="m-0 mb-6 text-[13.5px] text-muted">
          Manage your listings, documents and enquiries.
        </p>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
          />
          {err && (
            <p className="m-0 text-[13px] font-semibold text-red-600">{err}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 rounded-[12px] bg-brand py-3 text-[15px] font-bold text-white transition-colors hover:bg-brand-hover disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
