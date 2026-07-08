import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminSubscribers() {
  const supabase = createClient();
  const { data } = await supabase
    .from("subscribers")
    .select("id, email, source, created_at")
    .order("created_at", { ascending: false });
  const rows = data ?? [];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 font-display text-[26px] font-extrabold text-ink-900">Subscribers</h1>
        <span className="rounded-full bg-leaf-bg px-3 py-1.5 text-[12.5px] font-bold text-brand-ink">
          {rows.length} total
        </span>
      </div>

      <div className="overflow-hidden rounded-[16px] border border-line bg-white">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-cream text-[12px] uppercase tracking-[0.04em] text-muted-light">
              <th className="px-4 py-3 font-bold">Email</th>
              <th className="hidden px-4 py-3 font-bold sm:table-cell">Source</th>
              <th className="px-4 py-3 font-bold">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-b border-line-soft last:border-0">
                <td className="px-4 py-3 text-[13.5px] font-semibold text-ink">{s.email}</td>
                <td className="hidden px-4 py-3 text-[13px] text-muted sm:table-cell">{s.source || "—"}</td>
                <td className="px-4 py-3 text-[12.5px] text-muted-light">
                  {new Date(s.created_at).toLocaleDateString("en-NG")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="m-0 px-4 py-10 text-center text-[14px] text-muted-light">
            No subscribers yet — captured from the welcome pop-up and gadgets waitlist.
          </p>
        )}
      </div>
    </div>
  );
}
