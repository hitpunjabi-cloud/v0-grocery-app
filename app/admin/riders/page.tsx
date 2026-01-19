import { createClient } from "@/lib/supabase/server"
import { AdminRidersPage } from "@/components/admin/admin-riders-page"

export default async function RidersPage() {
  const supabase = await createClient()

  const { data: riders } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "rider")
    .order("created_at", { ascending: false })

  const { data: orders } = await supabase.from("orders").select("rider_id").not("rider_id", "is", null)

  // Count orders per rider
  const orderCounts: Record<string, number> = {}
  orders?.forEach((order) => {
    if (order.rider_id) {
      orderCounts[order.rider_id] = (orderCounts[order.rider_id] || 0) + 1
    }
  })

  const ridersWithCounts =
    riders?.map((rider) => ({
      ...rider,
      order_count: orderCounts[rider.id] || 0,
    })) || []

  return <AdminRidersPage riders={ridersWithCounts} />
}
