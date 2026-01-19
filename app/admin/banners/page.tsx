import { createClient } from "@/lib/supabase/server"
import { AdminBannersPage } from "@/components/admin/admin-banners-page"

export default async function BannersPage() {
  const supabase = await createClient()

  const { data: banners } = await supabase.from("banners").select("*").order("display_order", { ascending: true })

  return <AdminBannersPage banners={banners || []} />
}
