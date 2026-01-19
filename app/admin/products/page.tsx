import { createClient } from "@/lib/supabase/server"
import { AdminProductsPage } from "@/components/admin/admin-products-page"
import type { Product, Category } from "@/lib/types"

export default async function AdminProducts() {
  const supabase = await createClient()

  const [productsResult, categoriesResult] = await Promise.all([
    supabase.from("products").select("*, category:categories(*)").order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("display_order"),
  ])

  return (
    <AdminProductsPage
      products={(productsResult.data as Product[]) || []}
      categories={(categoriesResult.data as Category[]) || []}
    />
  )
}
