"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface Agent {
  id: string;
  name: string;
  title: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  verified: boolean;
}

const empty = {
  name: "",
  title: "",
  phone: "",
  email: "",
  avatar_url: "",
  verified: true,
};

const input =
  "w-full rounded-[11px] border border-line-input bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none focus:border-brand";

export default function AgentManager() {
  const supabase = createClient();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("agents")
      .select("id, name, title, phone, email, avatar_url, verified")
      .order("name");
    setAgents((data as Agent[]) ?? []);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setBusy(true);
    await supabase.from("agents").insert({
      name: form.name.trim(),
      title: form.title.trim() || null,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      avatar_url: form.avatar_url.trim() || null,
      verified: form.verified,
    });
    setForm(empty);
    await load();
    setBusy(false);
  }

  async function remove(id: string) {
    if (!confirm("Delete this agent?")) return;
    await supabase.from("agents").delete().eq("id", id);
    await load();
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-3">
        {agents.length === 0 && (
          <div className="rounded-[16px] border border-line bg-white p-8 text-center text-[14px] text-muted-light">
            No agents yet.
          </div>
        )}
        {agents.map((a) => (
          <div
            key={a.id}
            className="flex items-center gap-3 rounded-[16px] border border-line bg-white p-4"
          >
            <div className="relative h-[46px] w-[46px] flex-none overflow-hidden rounded-full bg-cream">
              {a.avatar_url && (
                <Image src={a.avatar_url} alt={a.name} fill sizes="46px" className="object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-extrabold text-ink">{a.name}</span>
                {a.verified && <span className="text-[12px] text-brand">✓</span>}
              </div>
              <div className="truncate text-[12.5px] text-muted-light">
                {[a.title, a.phone, a.email].filter(Boolean).join(" · ")}
              </div>
            </div>
            <button
              type="button"
              onClick={() => remove(a.id)}
              className="flex-none rounded-[8px] border border-line px-2.5 py-1.5 text-[12px] font-semibold text-muted hover:border-red-500 hover:text-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <form
        onSubmit={add}
        className="h-fit rounded-[16px] border border-line bg-white p-5"
      >
        <h2 className="m-0 mb-4 font-display text-[16px] font-extrabold text-ink-900">
          Add agent
        </h2>
        <div className="flex flex-col gap-2.5">
          <input
            required
            placeholder="Name"
            className={input}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Title (e.g. Senior Property Consultant)"
            className={input}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            placeholder="Phone"
            className={input}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            placeholder="Email"
            className={input}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            placeholder="Avatar image URL"
            className={input}
            value={form.avatar_url}
            onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
          />
          <label className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={form.verified}
              onChange={(e) => setForm({ ...form, verified: e.target.checked })}
              className="h-4 w-4 accent-brand"
            />
            <span className="text-[14px] font-semibold text-ink">Verified</span>
          </label>
          <button
            type="submit"
            disabled={busy}
            className="mt-1 rounded-[12px] bg-brand py-3 text-[14.5px] font-bold text-white transition-colors hover:bg-brand-hover disabled:opacity-60"
          >
            {busy ? "Adding…" : "Add agent"}
          </button>
        </div>
      </form>
    </div>
  );
}
