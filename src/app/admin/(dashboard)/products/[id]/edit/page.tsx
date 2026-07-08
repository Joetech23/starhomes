import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/queries";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/products" className="mb-4 inline-block text-[13.5px] font-semibold text-muted hover:text-brand">
        ← Back to products
      </Link>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 font-display text-[26px] font-extrabold text-ink-900">
          Edit · {product.name}
        </h1>
        <Link href={`/shop/product/${product.id}`} target="_blank" className="text-[13px] font-bold text-brand">
          View public page →
        </Link>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
