import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { naira } from "@/lib/site";
import ProductRowActions from "@/components/admin/ProductRowActions";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, product_no, name, department, category, price, status, featured, stock_status")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 font-display text-[26px] font-extrabold text-ink-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-brand px-5 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-brand-hover"
        >
          + New product
        </Link>
      </div>

      <div className="overflow-hidden rounded-[16px] border border-line bg-white">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-cream text-[12px] uppercase tracking-[0.04em] text-muted-light">
              <th className="px-4 py-3 font-bold">Product</th>
              <th className="hidden px-4 py-3 font-bold sm:table-cell">Dept</th>
              <th className="hidden px-4 py-3 font-bold md:table-cell">Price</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((p) => (
              <tr key={p.id} className="border-b border-line-soft last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${p.id}/edit`} className="text-[14px] font-semibold text-ink hover:text-brand">
                    {p.name}
                  </Link>
                  <div className="text-[12px] text-muted-light">
                    {p.category || "—"}
                    {p.featured && <span className="ml-1.5 text-brand">★ featured</span>}
                    {p.stock_status !== "in_stock" && (
                      <span className="ml-1.5 text-muted">· {p.stock_status.replace("_", " ")}</span>
                    )}
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-[13px] capitalize text-muted sm:table-cell">
                  {p.department}
                </td>
                <td className="hidden px-4 py-3 text-[13px] font-semibold text-ink md:table-cell">
                  {p.price > 0 ? naira(Number(p.price)) : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      p.status === "published" ? "bg-leaf-bg text-brand-ink" : "bg-[#F1F1ED] text-muted"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <ProductRowActions id={p.id} status={p.status} featured={p.featured} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(products ?? []).length === 0 && (
          <p className="m-0 px-4 py-10 text-center text-[14px] text-muted-light">
            No products yet. Create your first one.
          </p>
        )}
      </div>
    </div>
  );
}
