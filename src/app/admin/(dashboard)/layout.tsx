import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin";
import AdminNav from "@/components/admin/AdminNav";
import AdminMobileNav from "@/components/admin/AdminMobileNav";
import SignOutButton from "@/components/admin/SignOutButton";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="sticky top-0 hidden h-screen w-[248px] flex-none flex-col border-r border-line bg-white p-5 md:flex">
        <Link href="/admin" className="mb-7 flex items-center gap-[10px]">
          <Image
            src="/logo-mark.png"
            alt="Star Homes"
            width={48}
            height={46}
            style={{ width: "auto", height: "36px" }}
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[15px] font-extrabold text-ink">
              STAR HOMES
            </span>
            <span className="mt-[3px] text-[8.5px] font-bold tracking-[0.24em] text-brand">
              ADMIN
            </span>
          </span>
        </Link>
        <AdminNav />
        <div className="mt-auto border-t border-line pt-4">
          <div className="mb-2 truncate text-[12px] text-muted-light">
            {admin.email}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-[10px] border border-line px-3 py-2 text-[13px] font-semibold text-muted transition-colors hover:border-ink hover:text-ink"
            >
              View site
            </Link>
            <SignOutButton />
          </div>
        </div>
      </aside>

      <div className="flex-1">
        {/* mobile top bar + nav */}
        <AdminMobileNav />
        <div className="mx-auto max-w-[1100px] p-5 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
