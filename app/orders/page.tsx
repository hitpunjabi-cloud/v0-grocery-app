import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { OrdersPage } from "@/components/orders-page"
import type { Order } from "@/lib/types"

export default async function Orders() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/orders")
  }

  const { data } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const orders = (data as Order[]) || []

  return <OrdersPage orders={orders} isLoggedIn={true} />
}
