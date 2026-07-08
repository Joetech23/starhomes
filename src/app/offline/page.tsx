import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "You're offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <Image src="/logo-mark.png" alt="Star Homes" width={64} height={62} style={{ width: "auto", height: "56px" }} />
      <h1 className="mt-6 font-display text-[28px] font-extrabold text-ink-900">You're offline</h1>
      <p className="mt-2 max-w-[360px] text-[15px] leading-[1.6] text-muted">
        We couldn't reach the internet. Check your connection and try again — some pages you've
        already visited may still work.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-brand px-6 py-3 text-[15px] font-bold text-white transition-colors hover:bg-brand-hover"
      >
        Retry home
      </Link>
    </div>
  );
}
