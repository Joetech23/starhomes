import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import EnquiryActions from "@/components/admin/EnquiryActions";

export const dynamic = "force-dynamic";

export default async function AdminEnquiries() {
  const supabase = createClient();
  const { data: enquiries } = await supabase
    .from("enquiries")
    .select("id, name, phone, email, message, source, handled, created_at, listing_id")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="m-0 mb-6 font-display text-[26px] font-extrabold text-ink-900">
        Enquiries
      </h1>
      <div className="flex flex-col gap-3">
        {(enquiries ?? []).length === 0 && (
          <div className="rounded-[16px] border border-line bg-white p-10 text-center text-[14px] text-muted-light">
            No enquiries yet.
          </div>
        )}
        {(enquiries ?? []).map((e) => (
          <div
            key={e.id}
            className="rounded-[16px] border border-line bg-white p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-extrabold text-ink">
                    {e.name}
                  </span>
                  {!e.handled && (
                    <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                      NEW
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-[12.5px] text-muted-light">
                  {[e.phone, e.email].filter(Boolean).join(" · ")}
                  {e.listing_id && (
                    <>
                      {" · "}
                      <Link
                        href={`/admin/listings/${e.listing_id}/edit`}
                        className="font-semibold text-brand"
                      >
                        view listing
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <EnquiryActions id={e.id} handled={e.handled} />
            </div>
            {e.message && (
              <p className="m-0 mt-3 text-[14px] leading-[1.55] text-[#4F5547]">
                {e.message}
              </p>
            )}
            <div className="mt-2 text-[11.5px] text-muted-light">
              {new Date(e.created_at).toLocaleString("en-NG")}
              {e.source ? ` · ${e.source}` : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
