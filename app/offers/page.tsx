import type { Metadata } from "next"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { MobileNav } from "@/components/mobile-nav"
import { Tag, Clock, Percent, Gift, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Special Offers | Easy Grocery",
  description: "Discover amazing deals and discounts on fresh groceries at Easy Grocery Dubai.",
}

export default function OffersPage() {
  const offers = [
    {
      id: 1,
      title: "Fresh Fruits Bundle",
      description: "Get 20% off on all seasonal fruits",
      discount: "20% OFF",
      image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop",
      validTill: "31 Jan 2026",
      code: "FRUITS20",
    },
    {
      id: 2,
      title: "Dairy Delight",
      description: "Buy 2 Get 1 Free on all dairy products",
      discount: "B2G1",
      image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=300&fit=crop",
      validTill: "28 Jan 2026",
      code: "DAIRY321",
    },
    {
      id: 3,
      title: "Weekend Special",
      description: "Flat 15% off on orders above 200 AED",
      discount: "15% OFF",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
      validTill: "Every Weekend",
      code: "WEEKEND15",
    },
    {
      id: 4,
      title: "New User Offer",
      description: "Get 50 AED off on your first order",
      discount: "50 AED",
      image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop",
      validTill: "Limited Time",
      code: "WELCOME50",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader />

      <main className="pb-20 md:pb-8">
        {/* Hero */}
        <section className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white py-16">
          <div className="container px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full mb-6">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">Hot Deals</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Special Offers</h1>
            <p className="text-white/90 max-w-xl mx-auto text-lg">
              Save big on your grocery shopping with our exclusive deals and discounts
            </p>
          </div>
        </section>

        {/* Offers Grid */}
        <section className="py-12">
          <div className="container px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <Image src={offer.image || "/placeholder.svg"} alt={offer.title} fill className="object-cover" />
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {offer.discount}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                    <p className="text-gray-600 mb-4">{offer.description}</p>
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{offer.validTill}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{offer.code}</span>
                      </div>
                    </div>
                    <Button asChild className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700">
                      <Link href="/categories">Shop Now</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 bg-white">
          <div className="container px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Why Shop With Us</h2>
            <div className="grid sm:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {[
                { icon: Percent, title: "Best Prices", desc: "Guaranteed lowest prices on groceries" },
                { icon: Gift, title: "Rewards", desc: "Earn points on every purchase" },
                { icon: Tag, title: "Daily Deals", desc: "New offers added every day" },
              ].map((item, i) => (
                <div key={i} className="text-center p-6">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-7 w-7 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
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
