import BannerManager from "@/components/admin/BannerManager";

export const dynamic = "force-dynamic";

export default function AdminBanners() {
  return (
    <div>
      <h1 className="m-0 mb-2 font-display text-[26px] font-extrabold text-ink-900">Banners</h1>
      <p className="m-0 mb-6 text-[14px] text-muted">
        Promo banners for the homepage hero carousel, the green promo strip, and the welcome pop-up.
      </p>
      <BannerManager />
    </div>
  );
}
