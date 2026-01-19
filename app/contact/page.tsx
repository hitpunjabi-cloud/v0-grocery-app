import type { Metadata } from "next"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { MobileNav } from "@/components/mobile-nav"
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export const metadata: Metadata = {
  title: "Contact Us | Easy Grocery",
  description: "Get in touch with Easy Grocery. We're here to help with your orders, questions, and feedback.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader />

      <main className="pb-20 md:pb-8">
        {/* Hero */}
        <section className="bg-gradient-to-br from-emerald-600 to-emerald-500 text-white py-16">
          <div className="container px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-white/90 max-w-xl mx-auto">
              Have questions or feedback? We'd love to hear from you. Our team is always ready to help.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
              {/* Contact Form */}
              <div className="bg-white p-8 rounded-3xl shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Your name" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" className="rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+971 50 123 4567" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Your message..." className="rounded-xl min-h-[150px]" />
                  </div>
                  <Button type="button" className="w-full rounded-xl h-12 bg-emerald-600 hover:bg-emerald-700">
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                  <p className="text-gray-600 mb-8">
                    Our customer support team is available around the clock to assist you with any inquiries.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    { icon: MapPin, title: "Address", content: "Downtown Dubai, UAE\nNear Dubai Mall" },
                    { icon: Phone, title: "Phone", content: "+971 50 123 4567\n+971 4 123 4567" },
                    { icon: Mail, title: "Email", content: "support@easygrocery.ae\ninfo@easygrocery.ae" },
                    { icon: Clock, title: "Working Hours", content: "Sunday - Saturday\n8:00 AM - 11:00 PM" },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                        <item.icon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-gray-600 whitespace-pre-line">{item.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* WhatsApp CTA */}
                <div className="bg-emerald-50 p-6 rounded-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-green-500 flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Chat on WhatsApp</h3>
                      <p className="text-sm text-gray-600">Quick response guaranteed</p>
                    </div>
                  </div>
                  <Button className="w-full rounded-xl bg-green-500 hover:bg-green-600">Start WhatsApp Chat</Button>
                </div>
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
