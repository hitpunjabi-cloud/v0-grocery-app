import { createClient } from "@/lib/supabase/server"
import { AdminCategoriesPage } from "@/components/admin/admin-categories-page"
import type { Category } from "@/lib/types"

export default async function AdminCategories() {
  const supabase = await createClient()

  const { data: categories } = await supabase.from("categories").select("*").order("display_order")

  return <AdminCategoriesPage categories={(categories as Category[]) || []} />
}
