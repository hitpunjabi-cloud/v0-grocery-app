import { createClient } from "@/lib/supabase/server"
import { AdminOrdersPage } from "@/components/admin/admin-orders-page"
import type { Order } from "@/lib/types"

export default async function AdminOrders() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .order("created_at", { ascending: false })

  return <AdminOrdersPage orders={(orders as Order[]) || []} />
}
