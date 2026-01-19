import type { Metadata } from "next"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { MobileNav } from "@/components/mobile-nav"
import { HelpCircle, Package, Truck, CreditCard, RotateCcw, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Help & Support | Easy Grocery",
  description: "Get help with your Easy Grocery orders, deliveries, payments, and more.",
}

export default function HelpPage() {
  const topics = [
    { icon: Package, title: "Orders", desc: "Track, modify or cancel orders", href: "/orders" },
    { icon: Truck, title: "Delivery", desc: "Delivery times and tracking", href: "/faq" },
    { icon: CreditCard, title: "Payments", desc: "Payment methods and issues", href: "/faq" },
    { icon: RotateCcw, title: "Returns", desc: "Return and refund policy", href: "/returns" },
  ]

  const faqs = [
    { q: "How do I track my order?", a: "Go to My Orders section to see real-time tracking of your delivery." },
    { q: "What are the delivery hours?", a: "We deliver from 8 AM to 11 PM, 7 days a week across Dubai." },
    { q: "Can I change my delivery address?", a: "Yes, you can change the address before the order is dispatched." },
    { q: "What payment methods do you accept?", a: "We accept Cash on Delivery, Credit/Debit cards, and Apple Pay." },
    { q: "How do I apply a promo code?", a: "Enter your promo code at checkout before completing payment." },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader />

      <main className="pb-20 md:pb-8">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-16">
          <div className="container px-4 text-center">
            <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">How can we help?</h1>
            <p className="text-white/90 max-w-xl mx-auto">
              Find answers to common questions or get in touch with our support team
            </p>
          </div>
        </section>

        {/* Topics */}
        <section className="py-12">
          <div className="container px-4">
            <h2 className="text-xl font-bold mb-6">Browse by Topic</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
              {topics.map((topic, i) => (
                <Link
                  key={i}
                  href={topic.href}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <topic.icon className="h-6 w-6 text-blue-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{topic.title}</h3>
                  <p className="text-sm text-gray-600">{topic.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 bg-white">
          <div className="container px-4">
            <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-2xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-12">
          <div className="container px-4">
            <div className="bg-emerald-50 rounded-3xl p-8 text-center max-w-3xl mx-auto">
              <MessageCircle className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Still need help?</h2>
              <p className="text-gray-600 mb-6">Our support team is available 24/7</p>
              <Button asChild className="rounded-xl bg-emerald-600 hover:bg-emerald-700">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <StoreFooter />
      <MobileNav />
    </div>
  )
}
