import type { Metadata } from "next"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { MobileNav } from "@/components/mobile-nav"

export const metadata: Metadata = {
  title: "Terms of Service | Easy Grocery",
  description: "Easy Grocery terms of service and conditions.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader />

      <main className="pb-20 md:pb-8">
        <div className="container px-4 py-12">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12">
            <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-6">Last updated: January 2026</p>

              <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using Easy Grocery, you accept and agree to be bound by these Terms of Service.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">2. Orders and Delivery</h2>
              <p className="text-gray-600 mb-4">
                All orders are subject to availability. We reserve the right to refuse or cancel any order for any
                reason. Delivery times are estimates and may vary based on demand and location.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">3. Pricing</h2>
              <p className="text-gray-600 mb-4">
                All prices are in UAE Dirhams (AED) and include applicable taxes. Prices are subject to change without
                notice.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">4. Returns and Refunds</h2>
              <p className="text-gray-600 mb-4">
                If you receive damaged or incorrect items, please contact us within 24 hours of delivery for a
                replacement or refund.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">5. Contact</h2>
              <p className="text-gray-600 mb-4">
                For any questions regarding these terms, please contact us at support@easygrocery.ae
              </p>
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
      <MobileNav />
    </div>
  )
}
