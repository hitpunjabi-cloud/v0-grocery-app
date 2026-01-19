import type { Metadata } from "next"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { MobileNav } from "@/components/mobile-nav"
import { Truck, Clock, Shield, Leaf, Users, Award } from "lucide-react"
import Image from "next/image"

export const metadata: Metadata = {
  title: "About Us | Easy Grocery",
  description:
    "Learn about Easy Grocery - Dubai's premier online grocery delivery service. Fresh produce, quality products, and fast delivery.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader />

      <main className="pb-20 md:pb-8">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white"></div>
            <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-white"></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-white"></div>
          </div>
          <div className="container px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Fresh Groceries, Delivered to Your Door</h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Easy Grocery is Dubai's trusted online grocery store, bringing fresh produce, quality products, and
                exceptional service directly to homes across the UAE.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  At Easy Grocery, we believe everyone deserves access to fresh, high-quality groceries without the
                  hassle of traditional shopping. Our mission is to make grocery shopping effortless, affordable, and
                  enjoyable for families across Dubai.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We partner with local farmers, trusted suppliers, and premium brands to ensure you receive only the
                  best products, delivered fresh to your doorstep.
                </p>
              </div>
              <div className="relative h-80 rounded-3xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop"
                  alt="Fresh groceries"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose Us</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {[
                { icon: Truck, title: "Fast Delivery", desc: "Same-day delivery across Dubai" },
                { icon: Leaf, title: "Fresh Products", desc: "Farm-fresh produce daily" },
                { icon: Shield, title: "Quality Assured", desc: "100% quality guarantee" },
                { icon: Clock, title: "24/7 Support", desc: "Always here to help you" },
              ].map((feature, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-emerald-600 text-white">
          <div className="container px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-7xl mx-auto">
              {[
                { value: "50K+", label: "Happy Customers" },
                { value: "5000+", label: "Products" },
                { value: "99%", label: "Satisfaction Rate" },
                { value: "30min", label: "Avg. Delivery" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We're committed to providing exceptional service while maintaining our core values.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[
                {
                  icon: Users,
                  title: "Customer First",
                  desc: "Your satisfaction is our top priority. We listen, adapt, and improve based on your feedback.",
                },
                {
                  icon: Leaf,
                  title: "Sustainability",
                  desc: "We're committed to eco-friendly practices and reducing our environmental footprint.",
                },
                {
                  icon: Award,
                  title: "Excellence",
                  desc: "We strive for excellence in everything we do, from product selection to delivery.",
                },
              ].map((value, i) => (
                <div key={i} className="text-center p-6">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.desc}</p>
                </div>
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
