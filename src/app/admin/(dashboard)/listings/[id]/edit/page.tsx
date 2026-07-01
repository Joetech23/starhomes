import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getListing } from "@/lib/queries";
import { refOf } from "@/lib/properties";
import ListingForm from "@/components/admin/ListingForm";

export const dynamic = "force-dynamic";

export default async function EditListingPage({
  params,
}: {
  params: { id: string };
}) {
  const listing = await getListing(params.id);
  if (!listing) notFound();

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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 font-display text-[26px] font-extrabold text-ink-900">
          Edit · {refOf(listing)}
        </h1>
        <Link
          href={`/properties/${listing.id}`}
          target="_blank"
          className="text-[13px] font-bold text-brand"
        >
          View public page →
        </Link>
      </div>
      <ListingForm listing={listing} agents={agents ?? []} />
    </div>
  );
}
