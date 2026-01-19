import { ProductDetailPage } from "@/components/product-detail-page"

export const metadata = {
  title: "Product | Easy Grocery",
  description: "View product details at Easy Grocery Dubai",
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ProductDetailPage productId={id} />
}
