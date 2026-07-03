import type { Metadata } from "next";
import InspectionForm from "@/components/InspectionForm";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a Property Inspection — Star Homes & Properties",
  description:
    "Register your property preferences and book an inspection with Star Homes & Properties across Awka, Anambra and Nigeria at large.",
  alternates: { canonical: "/book-inspection" },
  openGraph: {
    title: "Book a Property Inspection — Star Homes & Properties",
    description:
      "Tell us what you're looking for and we'll match you to the right home, land or shortlet — then arrange an inspection.",
    url: "/book-inspection",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Star Homes & Properties" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function BookInspectionPage() {
  return (
    <div className="bg-cream">
      <section className="container-site py-12 sm:py-16">
        <div className="mx-auto max-w-[820px]">
          <div className="mb-8 text-center">
            <span className="mb-4 inline-block rounded-full bg-leaf-bg px-3.5 py-1.5 text-[12.5px] font-bold uppercase tracking-[0.1em] text-brand-ink">
              Property registration
            </span>
            <h1 className="m-0 mb-3 font-display text-[32px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#13160F] sm:text-[42px]">
              Tell us what you’re looking for
            </h1>
            <p className="m-0 mx-auto max-w-[560px] text-[16px] leading-[1.6] text-muted">
              Fill this in and our team will match you to the right home, land or
              shortlet and arrange an inspection. It only takes a couple of
              minutes.
            </p>
          </div>
          <InspectionForm />
        </div>
      </section>
    </div>
  );
}
