import { createClient } from "@/lib/supabase/server";
import InspectionActions from "@/components/admin/InspectionActions";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  created_at: string;
  full_name: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  preferred_location: string | null;
  property_type: string | null;
  exact_location: string | null;
  budget: string | null;
  inspection_type: string | null;
  move_in: string | null;
  inspection_date: string | null;
  inspection_time: string | null;
  status: string;
  details: Record<string, string> | null;
};

export default async function AdminInspections() {
  const supabase = createClient();
  const { data } = await supabase
    .from("inspection_requests")
    .select("*")
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as Row[];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 font-display text-[26px] font-extrabold text-ink-900">
          Inspection requests
        </h1>
        <span className="rounded-full bg-leaf-bg px-3 py-1.5 text-[12.5px] font-bold text-brand-ink">
          {rows.length} total
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {rows.length === 0 && (
          <div className="rounded-[16px] border border-line bg-white p-10 text-center text-[14px] text-muted-light">
            No inspection requests yet.
          </div>
        )}
        {rows.map((r) => (
          <div key={r.id} className="rounded-[16px] border border-line bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[16px] font-extrabold text-ink">
                    {r.full_name}
                  </span>
                  {r.status === "new" && (
                    <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                      NEW
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-[13px] text-muted-light">
                  {[r.phone, r.whatsapp && `WA ${r.whatsapp}`, r.email]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              </div>
              <InspectionActions id={r.id} status={r.status} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
              <Field k="Looking for" v={r.property_type} />
              <Field k="Location" v={r.preferred_location} />
              <Field k="Exact area" v={r.exact_location} />
              <Field k="Budget" v={r.budget} />
              <Field k="Move in" v={r.move_in} />
              <Field k="Inspection" v={r.inspection_type} />
              <Field
                k="Date / time"
                v={[r.inspection_date, r.inspection_time].filter(Boolean).join(" ")}
              />
              <Field k="Condition" v={r.details?.condition} />
              <Field k="Floor" v={r.details?.floor} />
              <Field k="Environment" v={r.details?.environment} />
              <Field k="Power" v={r.details?.power} />
              <Field k="Security" v={r.details?.security} />
              <Field k="Occupants" v={r.details?.occupants} />
              <Field k="Children" v={r.details?.children} />
              <Field k="Stay" v={r.details?.stay_duration} />
              <Field k="Occupation" v={r.details?.occupation} />
              <Field k="Employment" v={r.details?.employment} />
              <Field k="Marital" v={r.details?.marital_status} />
              <Field k="Age" v={r.details?.age_range} />
              <Field k="Heard via" v={r.details?.heard_about} />
            </div>

            <div className="mt-3 text-[11.5px] text-muted-light">
              {new Date(r.created_at).toLocaleString("en-NG")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ k, v }: { k: string; v?: string | null }) {
  if (!v) return null;
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-[0.04em] text-muted-light">
        {k}
      </div>
      <div className="text-[13.5px] font-semibold text-ink">{v}</div>
    </div>
  );
}
