import type { Metadata } from "next"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { MobileNav } from "@/components/mobile-nav"
import { RotateCcw, CheckCircle, Clock, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Returns & Refunds | Easy Grocery",
  description: "Easy Grocery return and refund policy.",
}

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader />

      <main className="pb-20 md:pb-8">
        {/* Hero */}
        <section className="bg-gradient-to-br from-emerald-600 to-emerald-500 text-white py-16">
          <div className="container px-4 text-center">
            <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
              <RotateCcw className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Returns & Refunds</h1>
            <p className="text-white/90 max-w-xl mx-auto">We want you to be completely satisfied with your purchase</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Policy Cards */}
              <div className="bg-white rounded-3xl p-8">
                <h2 className="text-xl font-bold mb-6">Our Return Policy</h2>
                <div className="space-y-4">
                  {[
                    { icon: Clock, title: "24 Hour Window", desc: "Report issues within 24 hours of delivery" },
                    {
                      icon: CheckCircle,
                      title: "Quality Guarantee",
                      desc: "Full refund for damaged or incorrect items",
                    },
                    { icon: RotateCcw, title: "Easy Process", desc: "Simple 3-step return process" },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <item.icon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to Return */}
              <div className="bg-white rounded-3xl p-8">
                <h2 className="text-xl font-bold mb-6">How to Request a Return</h2>
                <ol className="space-y-4">
                  <li className="flex gap-4">
                    <span className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold">
                      1
                    </span>
                    <div>
                      <h3 className="font-semibold">Contact Support</h3>
                      <p className="text-sm text-gray-600">Call us or send a message within 24 hours</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold">
                      2
                    </span>
                    <div>
                      <h3 className="font-semibold">Share Details</h3>
                      <p className="text-sm text-gray-600">Provide order number and photos of the issue</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold">
                      3
                    </span>
                    <div>
                      <h3 className="font-semibold">Get Refund</h3>
                      <p className="text-sm text-gray-600">Receive replacement or refund within 48 hours</p>
                    </div>
                  </li>
                </ol>
              </div>

              {/* Contact */}
              <div className="bg-emerald-50 rounded-3xl p-8 text-center">
                <Phone className="h-10 w-10 text-emerald-600 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Need Help?</h2>
                <p className="text-gray-600 mb-4">Our support team is ready to assist you</p>
                <Button asChild className="rounded-xl bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <StoreFooter />
      <MobileNav />
    </div>
  )
}
