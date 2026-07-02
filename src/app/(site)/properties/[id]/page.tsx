import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import EnquiryForm from "@/components/EnquiryForm";
import VideoTour from "@/components/VideoTour";
import {
  TYPE_LABEL,
  descFor,
  feeTotal,
  refOf,
  galleryPhotos,
  priceText,
} from "@/lib/properties";
import { getListing, getSimilar } from "@/lib/queries";
import { naira, wa, TEL_LINK, PHONE_DISPLAY, EMAIL } from "@/lib/site";

export const revalidate = 60;

const AVATAR_FALLBACK =
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&q=80";

export default async function PropertyDetail({
  params,
}: {
  params: { id: string };
}) {
  const p = await getListing(params.id);
  if (!p) notFound();

  const ref = refOf(p);
  const photos = galleryPhotos(p);
  const main = photos[0];
  const side = photos.slice(1, 3);
  const amenities = p.amenities;
  const paragraphs = p.description
    ? p.description.split("\n\n").filter(Boolean)
    : descFor(p);
  const total = feeTotal(p);
  const similar = await getSimilar(p);

  const agent = p.agent ?? {
    name: "Star Homes Team",
    title: "Property Consultant",
    phone: null,
    email: EMAIL,
    avatarUrl: AVATAR_FALLBACK,
    verified: true,
  };

  const enquireMsg = `Hello Star Homes, I’m interested in ${p.title} (Ref ${ref}) in ${p.location}, listed at ${naira(p.price)}${p.unit || ""}. Is it still available?`;
  const waLink = wa(enquireMsg);
  const mailLink = `mailto:${EMAIL}?subject=${encodeURIComponent(
    `Enquiry: ${p.title} (${ref})`
  )}&body=${encodeURIComponent(enquireMsg)}`;

  return (
    <section className="container-site py-[30px] pb-[70px]">
      <Link
        href="/properties"
        className="mb-5 inline-block text-[13.5px] font-semibold text-muted transition-colors hover:text-brand"
      >
        ← Back to properties
      </Link>

      {/* Gallery */}
      <div className="mb-9 grid gap-3 sm:h-[480px] sm:grid-cols-[2fr_1fr] sm:grid-rows-2">
        <div className="relative h-[260px] overflow-hidden rounded-[18px] sm:row-span-2 sm:h-full">
          {main && (
            <Image
              src={main.url}
              alt={`${p.title} — main photo`}
              fill
              priority
              sizes="(max-width: 640px) 100vw, 760px"
              className="object-cover"
            />
          )}
        </div>
        {side.map((m, i) => (
          <div
            key={m.id}
            className="relative hidden overflow-hidden rounded-[18px] sm:block"
          >
            <Image
              src={m.url}
              alt={`Photo ${i + 2}`}
              fill
              sizes="380px"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Interactive 9:16 video tour */}
      {p.videos.length > 0 && <VideoTour videos={p.videos} />}

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.65fr_1fr]">
        {/* Main column */}
        <div>
          <div className="mb-3.5 flex items-center gap-2.5">
            <span className="rounded-full bg-leaf-bg px-[13px] py-1.5 text-[12px] font-bold text-brand-ink">
              {TYPE_LABEL[p.type]}
            </span>
            <span className="text-[12.5px] font-semibold text-[#9AA08C]">
              Ref {ref}
            </span>
          </div>
          <h1 className="m-0 mb-3 font-display text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#13160F] sm:text-[36px]">
            {p.title}
          </h1>
          <div className="mb-[22px] flex items-center gap-2 text-[15.5px] font-medium text-[#6B7160]">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {p.location}
          </div>
          <div className="mb-[26px] flex items-baseline gap-[7px] border-b border-[#EAEDE3] pb-[26px]">
            <span className="font-display text-[32px] font-extrabold tracking-[-0.02em] text-brand sm:text-[38px]">
              {priceText(p)}
            </span>
            {p.unit && (
              <span className="text-[16px] font-semibold text-muted-light">
                {p.unit}
              </span>
            )}
          </div>

          {/* features */}
          {p.features.length > 0 && (
            <div className="mb-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(120px,1fr))]">
              {p.features.map((f) => (
                <div
                  key={f.k}
                  className="rounded-[13px] border border-[#EAEDE3] bg-[#F6F8F1] px-4 py-[15px]"
                >
                  <div className="font-display text-[19px] font-extrabold leading-[1.1] text-[#13160F]">
                    {f.v}
                  </div>
                  <div className="mt-1 text-[12.5px] font-semibold text-muted-light">
                    {f.k}
                  </div>
                </div>
              ))}
            </div>
          )}

          <h3 className="m-0 mb-3 font-display text-[20px] font-bold text-[#13160F]">
            About this property
          </h3>
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="m-0 mb-3.5 text-[15.5px] leading-[1.7] text-[#4F5547] last:mb-9"
            >
              {para}
            </p>
          ))}

          {amenities.length > 0 && (
            <>
              <h3 className="m-0 mb-4 font-display text-[20px] font-bold text-[#13160F]">
                Features &amp; amenities
              </h3>
              <div className="mb-[38px] grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {amenities.map((a) => (
                  <div
                    key={a}
                    className="flex items-center gap-[11px] text-[14.5px] font-medium text-[#3A3F32]"
                  >
                    <span className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-[7px] bg-leaf-bg text-[12px] font-extrabold text-brand">
                      ✓
                    </span>
                    {a}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Documentation gallery (public) */}
          {p.documents.length > 0 && (
            <div className="mb-[38px]">
              <div className="mb-1.5 flex items-center gap-2.5">
                <h3 className="m-0 font-display text-[20px] font-bold text-[#13160F]">
                  Documentation
                </h3>
                <span className="rounded-full bg-leaf-bg px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-brand-ink">
                  Verified
                </span>
              </div>
              <p className="m-0 mb-4 text-[14px] text-muted">
                Title and survey documents for this property — inspect before you
                commit.
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {p.documents.map((d) => (
                  <a
                    key={d.id}
                    href={d.url}
                    target="_blank"
                    rel="noopener"
                    className="group block overflow-hidden rounded-[14px] border border-line bg-white transition-colors hover:border-brand"
                  >
                    <div className="relative h-[200px] w-full bg-[#F6F8F1]">
                      <Image
                        src={d.url}
                        alt={d.caption ?? "Property document"}
                        fill
                        sizes="(max-width: 640px) 50vw, 280px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                      <span className="truncate text-[12.5px] font-semibold text-[#3A3F32]">
                        {d.caption ?? "Document"}
                      </span>
                      <span className="text-[12px] font-bold text-brand">
                        View →
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* cost breakdown */}
          {p.fees.length > 0 && (
            <div className="rounded-[20px] bg-ink-900 px-[30px] pb-[26px] pt-[30px] text-white">
              <div className="mb-1.5 flex items-center justify-between">
                <h3 className="m-0 font-display text-[20px] font-bold text-white">
                  Cost breakdown
                </h3>
                <span className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-brand">
                  All fees included
                </span>
              </div>
              <p className="m-0 mb-[18px] text-[13px] text-[#A7AC9C]">
                No hidden charges. Here is exactly what you pay.
              </p>
              <div>
                {p.fees.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between border-b border-white/10 py-[13px]"
                  >
                    <span className="text-[14.5px] font-medium text-[#D9DCD0]">
                      {row.label}{" "}
                      {row.note && (
                        <span className="text-[12px] font-semibold text-[#7d8473]">
                          {row.note}
                        </span>
                      )}
                    </span>
                    <span className="font-display text-[15px] font-bold text-white">
                      {naira(row.amount)}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between pb-1 pt-[18px]">
                  <span className="text-[15.5px] font-bold text-white">
                    {p.totalLabel}
                  </span>
                  <span className="font-display text-[24px] font-extrabold tracking-[-0.01em] text-brand">
                    {naira(total)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky sidebar */}
        <div className="lg:sticky lg:top-24">
          <div className="rounded-[20px] border border-line bg-white p-6 shadow-[0_26px_50px_-34px_rgba(22,26,18,0.3)]">
            <div className="mb-5 flex items-center gap-[13px] border-b border-line-soft pb-5">
              <div className="relative h-[54px] w-[54px] flex-none overflow-hidden rounded-full bg-[#F6F8F1]">
                <Image
                  src={agent.avatarUrl ?? AVATAR_FALLBACK}
                  alt={agent.name}
                  fill
                  sizes="54px"
                  className="object-cover"
                />
              </div>
              <div className="leading-[1.3]">
                <div className="text-[16px] font-extrabold text-ink">
                  {agent.name}
                </div>
                <div className="text-[12.5px] font-semibold text-muted-light">
                  {agent.title}
                </div>
                {agent.verified && (
                  <div className="mt-[5px] inline-flex items-center gap-[5px] text-[11.5px] font-bold text-brand">
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-leaf-bg text-[9px]">
                      ✓
                    </span>{" "}
                    Verified agent
                  </div>
                )}
              </div>
            </div>
            <div className="mb-4 text-[13px] leading-[1.5] text-[#6B7160]">
              Interested in <strong className="text-ink">{p.title}</strong>?
              Reach us directly — we usually reply within minutes.
            </div>
            <div className="flex flex-col gap-2.5">
              <a
                href={waLink}
                target="_blank"
                rel="noopener"
                className="flex items-center justify-center gap-2.5 rounded-[12px] bg-brand p-3.5 text-[15px] font-bold text-white shadow-[0_10px_22px_-10px_rgba(91,154,36,0.6)] transition-colors hover:bg-brand-hover"
              >
                <span className="h-2 w-2 rounded-full bg-[#bff09a]" /> WhatsApp us
              </a>
              <a
                href={TEL_LINK}
                className="flex items-center justify-center gap-2.5 rounded-[12px] bg-ink-900 p-3.5 text-[15px] font-bold text-white transition-colors hover:bg-black"
              >
                Call {PHONE_DISPLAY}
              </a>
              <a
                href={mailLink}
                className="flex items-center justify-center gap-2.5 rounded-[12px] border-[1.5px] border-line-input bg-white p-3.5 text-[15px] font-bold text-ink transition-colors hover:border-ink"
              >
                Send an email
              </a>
            </div>
            <div className="mt-[15px] text-center text-[12px] text-[#9AA08C]">
              Quote ref <strong className="text-[#6B7160]">{ref}</strong> when
              you reach out
            </div>
          </div>

          {/* Enquiry form */}
          <EnquiryForm listingId={p.id} listingTitle={p.title} propertyRef={ref} />
        </div>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <div className="mt-[60px]">
          <h2 className="m-0 mb-[22px] font-display text-[26px] font-extrabold tracking-[-0.02em] text-[#13160F]">
            Similar properties
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s) => (
              <PropertyCard key={s.id} p={s} variant="compact" />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
