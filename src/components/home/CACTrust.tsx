import { BUSINESS_NAME, CAC_RN } from "@/lib/site";

export default function CACTrust() {
  return (
    <section className="border-y border-line bg-white">
      <div className="container-site flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-6 sm:justify-between">
        <div className="flex items-center gap-3.5">
          <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-leaf-bg text-brand-ink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l8 4v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6l8-4z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </span>
          <div className="leading-tight">
            <div className="text-[14px] font-extrabold text-ink">
              Registered with the CAC
            </div>
            <div className="text-[12.5px] text-muted">
              Corporate Affairs Commission, Nigeria
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px] text-ink">
          <span className="text-muted">Business:</span>
          <span className="font-bold">{BUSINESS_NAME}</span>
          <span className="mx-1 hidden text-muted sm:inline">·</span>
          <span className="text-muted">RN:</span>
          <span className="font-mono font-bold tracking-wide">{CAC_RN}</span>
        </div>
      </div>
    </section>
  );
}
