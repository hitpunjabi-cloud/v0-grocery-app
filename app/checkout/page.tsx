import { createClient } from "@/lib/supabase/server"
import { CheckoutPage } from "@/components/checkout-page"

export default async function Checkout() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user profile and addresses if logged in
  let profile = null
  let addresses: unknown[] = []

  if (user) {
    const [profileResult, addressesResult] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("addresses").select("*").eq("user_id", user.id).order("is_default", { ascending: false }),
    ])
    profile = profileResult.data
    addresses = addressesResult.data || []
  }

  return <CheckoutPage user={user} profile={profile} savedAddresses={addresses} />
}
