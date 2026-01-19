import { createClient } from "@/lib/supabase/server"
import { AdminCustomersPage } from "@/components/admin/admin-customers-page"

export default async function AdminCustomers() {
  const supabase = await createClient()

  const { data: customers } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "customer")
    .order("created_at", { ascending: false })

  return <AdminCustomersPage customers={customers || []} />
}
