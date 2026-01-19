import type { Metadata } from "next"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { MobileNav } from "@/components/mobile-nav"
import { HelpCircle, ChevronDown } from "lucide-react"

export const metadata: Metadata = {
  title: "FAQs | Easy Grocery",
  description: "Frequently asked questions about Easy Grocery services.",
}

export default function FAQPage() {
  const faqs = [
    {
      q: "What are your delivery hours?",
      a: "We deliver from 8 AM to 11 PM, 7 days a week across Dubai and surrounding areas.",
    },
    {
      q: "What is the minimum order amount?",
      a: "The minimum order amount is 50 AED. Orders above 100 AED qualify for free delivery.",
    },
    {
      q: "How can I track my order?",
      a: "Once your order is confirmed, you can track it in real-time from the My Orders section in your account.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept Cash on Delivery (COD), Credit/Debit cards, Apple Pay, and Google Pay.",
    },
    {
      q: "Can I schedule a delivery for a specific time?",
      a: "Yes, you can select your preferred delivery slot during checkout based on availability.",
    },
    {
      q: "What if an item is out of stock?",
      a: "We will contact you to offer a suitable replacement or a refund for the unavailable item.",
    },
    {
      q: "How do I apply a promo code?",
      a: "Enter your promo code in the designated field at checkout before completing your payment.",
    },
    {
      q: "What is your return policy?",
      a: "We accept returns for damaged or incorrect items within 24 hours of delivery. Please contact support with photos.",
    },
    {
      q: "Do you deliver to all areas in Dubai?",
      a: "Yes, we deliver to all areas within Dubai. Delivery to some remote areas may have additional charges.",
    },
    {
      q: "How do I contact customer support?",
      a: "You can reach us via phone at +971 50 123 4567, WhatsApp, or through the Contact Us page.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader />

      <main className="pb-20 md:pb-8">
        {/* Hero */}
        <section className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white py-16">
          <div className="container px-4 text-center">
            <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-white/90 max-w-xl mx-auto">Find quick answers to common questions about our services</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="bg-white rounded-2xl group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                    <ChevronDown className="h-5 w-5 text-gray-400 shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-6 pb-6 pt-0 text-gray-600">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <StoreFooter />
      <MobileNav />
    </div>
  )
}
