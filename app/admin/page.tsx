import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const supabase = await createClient()

  // Fetch dashboard stats
  const [ordersResult, productsResult, customersResult, revenueResult] = await Promise.all([
    supabase.from("orders").select("id, status, total, created_at"),
    supabase.from("products").select("id, is_active"),
    supabase.from("profiles").select("id").eq("role", "customer"),
    supabase.from("orders").select("total").eq("status", "delivered"),
  ])

  const orders = ordersResult.data || []
  const products = productsResult.data || []
  const customers = customersResult.data || []
  const deliveredOrders = revenueResult.data || []

  // Calculate stats
  const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.total, 0)
  const pendingOrders = orders.filter((o) => o.status === "pending").length
  const todayOrders = orders.filter((o) => {
    const orderDate = new Date(o.created_at)
    const today = new Date()
    return orderDate.toDateString() === today.toDateString()
  })

  // Recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <AdminDashboard
      stats={{
        totalOrders: orders.length,
        pendingOrders,
        totalProducts: products.length,
        activeProducts: products.filter((p) => p.is_active).length,
        totalCustomers: customers.length,
        totalRevenue,
        todayOrders: todayOrders.length,
        todayRevenue: todayOrders.reduce((sum, o) => sum + o.total, 0),
      }}
      recentOrders={recentOrders || []}
    />
  )
}
