import { createClient } from "@/lib/supabase/server"
import { RiderDashboard } from "@/components/rider/rider-dashboard"

export default async function RiderPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  // Get orders assigned to this rider or available for pickup
  const { data: orders } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .in("status", ["confirmed", "preparing", "out_for_delivery"])
    .order("created_at", { ascending: false })

  return <RiderDashboard profile={profile} orders={orders || []} />
}
