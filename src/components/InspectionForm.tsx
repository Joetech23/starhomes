"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { wa } from "@/lib/site";

const LOCATIONS = ["Awka", "Onitsha", "Nnewi", "Enugu", "Asaba", "Abuja", "Lagos", "Other"];
const PROPERTY_TYPES = [
  "Self Contained",
  "One Bedroom",
  "Two Bedroom",
  "Three Bedroom",
  "Duplex",
  "Shop",
  "Office",
  "Land",
];
const CONDITION = ["New / Brand new", "Renovated", "3 years+", "Standard / Luxury", "Any within budget"];
const FLOOR = ["Ground floor", "Upstairs", "No preference"];
const ENVIRONMENT = ["Quiet", "Family-friendly", "Estate", "Busy / Commercial", "No preference"];
const POWER = ["Band A (≈24h)", "Band B (≈18h)", "Not important"];
const SECURITY = ["Very important", "Important", "Not important"];
const MOVE_IN = ["Immediately", "Within 1 month", "Within 3 months", "Just browsing"];
const STAY = ["1 year", "2 years", "3+ years"];
const MARITAL = ["Single", "Married", "Other"];
const AGE = ["18–25", "26–35", "36–45", "46+"];
const EMPLOYMENT = ["Employed", "Self-employed", "Business owner", "Student"];
const HEARD = ["Instagram", "Facebook", "TikTok", "WhatsApp", "Referral", "Google", "Other"];
const INSPECTION_TYPE = ["Physical inspection", "Virtual / online inspection", "Not sure yet"];

const input =
  "w-full rounded-[11px] border border-line-input bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none focus:border-brand";
const label = "mb-1.5 block text-[13px] font-semibold text-ink";

export default function InspectionForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [f, setF] = useState({
    full_name: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    preferred_location: "",
    property_type: "",
    exact_location: "",
    budget: "",
    inspection_type: "",
    move_in: "",
    inspection_date: "",
    inspection_time: "",
    condition: "",
    floor: "",
    environment: "",
    power: "",
    security: "",
    occupants: "",
    children: "",
    marital_status: "",
    age_range: "",
    employment: "",
    occupation: "",
    stay_duration: "",
    heard_about: "",
  });

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const supabase = createClient();
    const { error } = await supabase.from("inspection_requests").insert({
      full_name: f.full_name,
      phone: f.phone || null,
      whatsapp: f.whatsapp || null,
      email: f.email || null,
      address: f.address || null,
      preferred_location: f.preferred_location || null,
      property_type: f.property_type || null,
      exact_location: f.exact_location || null,
      budget: f.budget || null,
      inspection_type: f.inspection_type || null,
      move_in: f.move_in || null,
      inspection_date: f.inspection_date || null,
      inspection_time: f.inspection_time || null,
      details: {
        condition: f.condition,
        floor: f.floor,
        environment: f.environment,
        power: f.power,
        security: f.security,
        occupants: f.occupants,
        children: f.children,
        marital_status: f.marital_status,
        age_range: f.age_range,
        employment: f.employment,
        occupation: f.occupation,
        stay_duration: f.stay_duration,
        heard_about: f.heard_about,
      },
    });
    setState(error ? "error" : "done");
    if (!error && typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (state === "done") {
    const waLink = wa(
      `Hello Star Homes, I just submitted a property inspection request (${f.full_name}, looking for ${f.property_type || "a property"} in ${f.preferred_location || "Anambra"}).`
    );
    return (
      <div className="rounded-[20px] border border-leaf-border bg-leaf-bg p-8 text-center">
        <div className="mb-2 font-display text-[24px] font-extrabold text-brand-ink">
          Request received 🎉
        </div>
        <p className="m-0 mx-auto mb-5 max-w-[440px] text-[14.5px] leading-[1.6] text-[#3F5427]">
          Thank you, {f.full_name.split(" ")[0] || "there"}. Our team will
          contact you shortly to confirm your inspection and share matching
          properties.
        </p>
        <a
          href={waLink}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-[15px] font-bold text-white transition-colors hover:bg-brand-hover"
        >
          <span className="h-2 w-2 rounded-full bg-[#bff09a]" /> Continue on
          WhatsApp
        </a>
      </div>
    );
  }

  const Select = ({
    name,
    options,
    required,
  }: {
    name: keyof typeof f;
    options: string[];
    required?: boolean;
  }) => (
    <select
      required={required}
      value={f[name]}
      onChange={set(name)}
      className={`${input} cursor-pointer`}
    >
      <option value="">Select…</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="rounded-[18px] border border-line bg-white p-5 sm:p-6">
      <h2 className="m-0 mb-4 font-display text-[17px] font-extrabold text-ink-900">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Section title="Your details">
        <div className="sm:col-span-2">
          <label className={label}>Full name *</label>
          <input required className={input} value={f.full_name} onChange={set("full_name")} />
        </div>
        <div>
          <label className={label}>Phone (call) *</label>
          <input required className={input} value={f.phone} onChange={set("phone")} />
        </div>
        <div>
          <label className={label}>WhatsApp number</label>
          <input className={input} value={f.whatsapp} onChange={set("whatsapp")} />
        </div>
        <div>
          <label className={label}>Email</label>
          <input type="email" className={input} value={f.email} onChange={set("email")} />
        </div>
        <div>
          <label className={label}>Your address / city</label>
          <input className={input} value={f.address} onChange={set("address")} />
        </div>
      </Section>

      <Section title="What you're looking for">
        <div>
          <label className={label}>Preferred location *</label>
          <Select name="preferred_location" options={LOCATIONS} required />
        </div>
        <div>
          <label className={label}>Property type *</label>
          <Select name="property_type" options={PROPERTY_TYPES} required />
        </div>
        <div>
          <label className={label}>Exact area you want</label>
          <input
            className={input}
            placeholder="e.g. Regina axis, Amansea…"
            value={f.exact_location}
            onChange={set("exact_location")}
          />
        </div>
        <div>
          <label className={label}>Budget *</label>
          <input
            required
            className={input}
            placeholder="e.g. ₦1m per year"
            value={f.budget}
            onChange={set("budget")}
          />
        </div>
        <div>
          <label className={label}>Property condition</label>
          <Select name="condition" options={CONDITION} />
        </div>
        <div>
          <label className={label}>Preferred floor</label>
          <Select name="floor" options={FLOOR} />
        </div>
        <div>
          <label className={label}>Environment</label>
          <Select name="environment" options={ENVIRONMENT} />
        </div>
        <div>
          <label className={label}>Power supply</label>
          <Select name="power" options={POWER} />
        </div>
        <div>
          <label className={label}>Security</label>
          <Select name="security" options={SECURITY} />
        </div>
        <div>
          <label className={label}>Number of occupants</label>
          <input className={input} value={f.occupants} onChange={set("occupants")} />
        </div>
        <div>
          <label className={label}>Do you have children?</label>
          <Select name="children" options={["Yes", "No"]} />
        </div>
        <div>
          <label className={label}>How long will you stay?</label>
          <Select name="stay_duration" options={STAY} />
        </div>
      </Section>

      <Section title="A bit about you">
        <div>
          <label className={label}>Marital status</label>
          <Select name="marital_status" options={MARITAL} />
        </div>
        <div>
          <label className={label}>Age range</label>
          <Select name="age_range" options={AGE} />
        </div>
        <div>
          <label className={label}>Employment status</label>
          <Select name="employment" options={EMPLOYMENT} />
        </div>
        <div>
          <label className={label}>Occupation / business</label>
          <input className={input} value={f.occupation} onChange={set("occupation")} />
        </div>
        <div>
          <label className={label}>How did you hear about us?</label>
          <Select name="heard_about" options={HEARD} />
        </div>
      </Section>

      <Section title="Inspection preference">
        <div>
          <label className={label}>Inspection type</label>
          <Select name="inspection_type" options={INSPECTION_TYPE} />
        </div>
        <div>
          <label className={label}>When do you want to move in?</label>
          <Select name="move_in" options={MOVE_IN} />
        </div>
        <div>
          <label className={label}>Preferred inspection date</label>
          <input type="date" className={input} value={f.inspection_date} onChange={set("inspection_date")} />
        </div>
        <div>
          <label className={label}>Preferred time</label>
          <input type="time" className={input} value={f.inspection_time} onChange={set("inspection_time")} />
        </div>
      </Section>

      {state === "error" && (
        <p className="m-0 text-[14px] font-semibold text-red-600">
          Something went wrong submitting your request. Please try again or message us on WhatsApp.
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="w-fit rounded-full bg-brand px-8 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-brand-hover disabled:opacity-60"
      >
        {state === "sending" ? "Submitting…" : "Submit inspection request"}
      </button>
    </form>
  );
}
