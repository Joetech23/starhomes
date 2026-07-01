import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ListingForm from "@/components/admin/ListingForm";

export const dynamic = "force-dynamic";

export default async function NewListingPage() {
  const supabase = createClient();
  const { data: agents } = await supabase
    .from("agents")
    .select("id, name")
    .order("name");

  return (
    <div>
      <Link
        href="/admin/listings"
        className="mb-4 inline-block text-[13.5px] font-semibold text-muted hover:text-brand"
      >
        ← Back to listings
      </Link>
      <h1 className="m-0 mb-6 font-display text-[26px] font-extrabold text-ink-900">
        New listing
      </h1>
      <ListingForm agents={agents ?? []} />
    </div>
  );
}
