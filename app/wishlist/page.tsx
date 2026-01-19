import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { MobileNav } from "@/components/mobile-nav"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Wishlist | Easy Grocery",
  description: "Your saved items at Easy Grocery.",
}

export const dynamic = "force-dynamic"

export default async function WishlistPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/wishlist")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader />

      <main className="pb-20 md:pb-8">
        <div className="container px-4 py-12">
          <h1 className="text-2xl font-bold mb-8">My Wishlist</h1>

          {/* Empty State */}
          <div className="bg-white rounded-3xl p-12 text-center max-w-2xl mx-auto">
            <div className="h-20 w-20 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-pink-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">Save your favorite products here to buy them later</p>
            <Button asChild className="rounded-xl bg-emerald-600 hover:bg-emerald-700">
              <Link href="/categories">Browse Products</Link>
            </Button>
          </div>
        </div>
      </main>

      <StoreFooter />
      <MobileNav />
    </div>
  )
}
