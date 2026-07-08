import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return (
    <div>
      <Link href="/admin/products" className="mb-4 inline-block text-[13.5px] font-semibold text-muted hover:text-brand">
        ← Back to products
      </Link>
      <h1 className="m-0 mb-6 font-display text-[26px] font-extrabold text-ink-900">New product</h1>
      <ProductForm />
    </div>
  );
}
