"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Package, Clock, Truck, CheckCircle, XCircle, ChevronRight, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { CartSheet } from "@/components/cart-sheet"
import type { Order } from "@/lib/types"

interface OrdersPageProps {
  orders: Order[]
  isLoggedIn: boolean
}

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-500", textColor: "text-yellow-600" },
  confirmed: { label: "Confirmed", icon: Package, color: "bg-blue-500", textColor: "text-blue-600" },
  preparing: { label: "Preparing", icon: ChefHat, color: "bg-purple-500", textColor: "text-purple-600" },
  out_for_delivery: { label: "Out for Delivery", icon: Truck, color: "bg-orange-500", textColor: "text-orange-600" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "bg-green-500", textColor: "text-green-600" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-500", textColor: "text-red-600" },
}

export function OrdersPage({ orders, isLoggedIn }: OrdersPageProps) {
  const [cartOpen, setCartOpen] = useState(false)

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b">
          <div className="flex items-center gap-3 px-4 h-14">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-bold">My Orders</h1>
          </div>
        </header>

        <main className="flex flex-col items-center justify-center px-4 py-20">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">Sign in to view orders</h2>
          <p className="text-muted-foreground text-center mb-6">Track your orders and view order history</p>
          <Link href="/auth/login">
            <Button size="lg" className="rounded-xl">
              Sign In
            </Button>
          </Link>
        </main>

        <MobileNav onCartOpen={() => setCartOpen(true)} />
        <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b">
        <div className="flex items-center gap-3 px-4 h-14">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold">My Orders</h1>
        </div>
      </header>

      <main className="p-4">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">No orders yet</h2>
            <p className="text-muted-foreground text-center mb-6">Start shopping to see your orders here</p>
            <Link href="/">
              <Button size="lg" className="rounded-xl">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
              const StatusIcon = status.icon
              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block bg-card rounded-2xl border p-4 active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("en-AE", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${status.color}`}>
                      <StatusIcon className="h-3 w-3 text-white" />
                      <span className="text-xs font-medium text-white">{status.label}</span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="flex gap-2 mb-3">
                    {order.items?.slice(0, 4).map((item) => (
                      <div key={item.id} className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image
                          src={item.product_image || `/placeholder.svg?height=48&width=48&query=${item.product_name}`}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {order.items && order.items.length > 4 && (
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {order.items?.length} item{order.items && order.items.length !== 1 ? "s" : ""}
                      </p>
                      <p className="font-bold text-primary">AED {order.total.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>

      <MobileNav onCartOpen={() => setCartOpen(true)} />
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  )
}
