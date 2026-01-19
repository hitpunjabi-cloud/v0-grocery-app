import { createClient } from "@/lib/supabase/server"
import { CategoriesPage } from "@/components/categories-page"

export const metadata = {
  title: "Categories | Easy Grocery",
  description: "Browse all grocery categories",
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function Page() {
  try {
    const supabase = await createClient()

    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    const { data: products, error: prodError } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (catError || prodError) {
      console.error("Database error:", catError || prodError)
    }

    return <CategoriesPage categories={categories || []} products={products || []} />
  } catch (error) {
    console.error("Failed to fetch data:", error)
    return <CategoriesPage categories={[]} products={[]} />
  }
}
