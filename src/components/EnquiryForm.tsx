"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function EnquiryForm({
  listingId,
  listingTitle,
  propertyRef,
  source = "listing_page",
  heading = "Request details",
  subtext = "Leave your details and we’ll get back to you about this property.",
}: {
  listingId?: string;
  listingTitle?: string;
  propertyRef?: string;
  source?: string;
  heading?: string;
  subtext?: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const supabase = createClient();
    const { error } = await supabase.from("enquiries").insert({
      listing_id: listingId ?? null,
      name: form.name,
      phone: form.phone || null,
      email: form.email || null,
      message:
        form.message ||
        (listingTitle
          ? `Enquiry about ${listingTitle} (Ref ${propertyRef}).`
          : "General enquiry."),
      source,
    });
    setState(error ? "error" : "done");
  }

  if (state === "done") {
    return (
      <div className="mt-4 rounded-[20px] border border-leaf-border bg-leaf-bg p-6 text-center">
        <div className="font-display text-[18px] font-extrabold text-brand-ink">
          Thanks — we’ve got it.
        </div>
        <p className="m-0 mt-1.5 text-[13.5px] text-[#4F5547]">
          Our team will reach out{listingTitle ? <> about <strong>{listingTitle}</strong></> : ""}{" "}
          shortly.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-[11px] border border-line-input bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none focus:border-brand";

  return (
    <form
      onSubmit={onSubmit}
      className="mt-4 rounded-[20px] border border-line bg-white p-6"
    >
      <h3 className="m-0 mb-1 font-display text-[17px] font-extrabold text-[#13160F]">
        {heading}
      </h3>
      <p className="m-0 mb-4 text-[12.5px] text-muted">{subtext}</p>
      <div className="flex flex-col gap-2.5">
        <input
          required
          placeholder="Your name"
          value={form.name}
          onChange={update("name")}
          className={inputCls}
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={update("phone")}
          className={inputCls}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={update("email")}
          className={inputCls}
        />
        <textarea
          placeholder="Message (optional)"
          value={form.message}
          onChange={update("message")}
          rows={3}
          className={inputCls}
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-[12px] bg-ink-900 py-3 text-[14.5px] font-bold text-white transition-colors hover:bg-black disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Send enquiry"}
        </button>
        {state === "error" && (
          <p className="m-0 text-center text-[12.5px] font-semibold text-red-600">
            Something went wrong. Please try WhatsApp or call instead.
          </p>
        )}
      </div>
    </form>
  );
}
