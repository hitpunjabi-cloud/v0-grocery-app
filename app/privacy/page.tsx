import type { Metadata } from "next"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { MobileNav } from "@/components/mobile-nav"

export const metadata: Metadata = {
  title: "Privacy Policy | Easy Grocery",
  description: "Easy Grocery privacy policy and data protection information.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader />

      <main className="pb-20 md:pb-8">
        <div className="container px-4 py-12">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12">
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-6">Last updated: January 2026</p>

              <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                We collect information you provide directly to us, such as when you create an account, place an order,
                or contact us for support. This includes your name, email, phone number, and delivery address.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">
                We use the information we collect to process your orders, communicate with you about your orders and our
                services, and improve our services.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">3. Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We do not sell your personal information. We may share your information with delivery partners to
                fulfill your orders and with payment processors to complete transactions.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate security measures to protect your personal information from unauthorized
                access, alteration, or disclosure.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">5. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy, please contact us at privacy@easygrocery.ae
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
