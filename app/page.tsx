import { createClient } from "@/lib/supabase/server"
import { StoreHomePage } from "@/components/store-home-page"
import type { Category, Product } from "@/lib/types"

export default async function HomePage() {
  const supabase = await createClient()

  const [categoriesResult, productsResult, featuredResult] = await Promise.all([
    supabase.from("categories").select("*").eq("is_active", true).order("display_order"),
    supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("is_active", true)
      .eq("is_featured", true)
      .limit(8),
  ])

  const categories = (categoriesResult.data as Category[]) || []
  const products = (productsResult.data as Product[]) || []
  const featuredProducts = (featuredResult.data as Product[]) || []

  return <StoreHomePage categories={categories} products={products} featuredProducts={featuredProducts} />
}
