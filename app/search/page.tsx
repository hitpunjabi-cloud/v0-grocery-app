import { createClient } from "@/lib/supabase/server"
import { SearchPage } from "@/components/search-page"

export const metadata = {
  title: "Search | Easy Grocery",
  description: "Search for products",
}

export const dynamic = "force-dynamic"

export default async function Page() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_active", true)
    .order("name", { ascending: true })

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  return <SearchPage products={products || []} categories={categories || []} />
}
