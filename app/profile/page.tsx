import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfilePage } from "@/components/profile-page"

export const dynamic = "force-dynamic"

export default async function Profile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/profile")
  }

  return <ProfilePage />
}
