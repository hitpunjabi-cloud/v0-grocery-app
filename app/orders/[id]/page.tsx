import { createClient } from "@/lib/supabase/server"
import { OrderDetailPage } from "@/components/order-detail-page"
import { notFound, redirect } from "next/navigation"

export const metadata = {
  title: "Order Details | Easy Grocery",
  description: "View your order details",
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?redirect=/orders/${id}`)
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("id", id)
    .eq("user_id", user.id) // Ensure user owns this order
    .single()

  if (!order) {
    notFound()
  }

  return <OrderDetailPage order={order} />
}
