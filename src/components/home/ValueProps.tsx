const PROPS = [
  {
    n: "01",
    title: "Transparent fees, no surprises",
    body: "Every rent breaks down agency, legal, caution and service charges upfront — so you know the full move-in cost before you commit.",
  },
  {
    n: "02",
    title: "Verified, inspected listings",
    body: "We physically inspect properties and confirm titles and documents, so you never waste a trip or risk a bad deal.",
  },
  {
    n: "03",
    title: "Local roots, national reach",
    body: "Deep on-the-ground knowledge across Anambra, with trusted partners handling property in Lagos, Abuja and beyond.",
  },
];

export default function ValueProps() {
  return (
    <section className="bg-ink-900 text-white">
      <div className="container-site py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {PROPS.map((p) => (
            <div key={p.n}>
              <div className="mb-4 font-display text-[15px] font-extrabold text-brand">
                {p.n}
              </div>
              <h3 className="m-0 mb-2.5 font-display text-[21px] font-bold text-white">
                {p.title}
              </h3>
              <p className="m-0 text-[14.5px] leading-[1.6] text-[#B7BCAD]">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
