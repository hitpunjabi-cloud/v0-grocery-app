"use client"

import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  MapPin,
  CreditCard,
  Phone,
  ChefHat,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MobileNav } from "@/components/mobile-nav"
import { CartSheet } from "@/components/cart-sheet"
import { toast } from "sonner"
import { useState } from "react"
import type { Order } from "@/lib/types"

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "bg-yellow-500",
    textColor: "text-yellow-600",
    bgLight: "bg-yellow-50",
  },
  confirmed: {
    label: "Confirmed",
    icon: Package,
    color: "bg-blue-500",
    textColor: "text-blue-600",
    bgLight: "bg-blue-50",
  },
  preparing: {
    label: "Preparing",
    icon: ChefHat,
    color: "bg-purple-500",
    textColor: "text-purple-600",
    bgLight: "bg-purple-50",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    icon: Truck,
    color: "bg-orange-500",
    textColor: "text-orange-600",
    bgLight: "bg-orange-50",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "bg-green-500",
    textColor: "text-green-600",
    bgLight: "bg-green-50",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-red-500",
    textColor: "text-red-600",
    bgLight: "bg-red-50",
  },
}

interface OrderDetailPageProps {
  order: Order
}

export function OrderDetailPage({ order }: OrderDetailPageProps) {
  const [cartOpen, setCartOpen] = useState(false)
  const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
  const StatusIcon = status.icon
  const address = order.delivery_address as {
    building?: string
    street?: string
    area?: string
    city?: string
    emirate?: string
  }

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.order_number)
    toast.success("Order number copied")
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b">
        <div className="flex items-center gap-3 px-4 h-14">
          <Link href="/orders">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Order Details</h1>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Order Status Card */}
        <Card className="overflow-hidden">
          <div className={`p-4 ${status.bgLight}`}>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${status.color}`}>
                <StatusIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className={`font-bold text-lg ${status.textColor}`}>{status.label}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString("en-AE", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-mono font-bold">{order.order_number}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={copyOrderNumber}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Order Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {Object.entries(statusConfig)
                .slice(0, 5)
                .map(([key, config], index) => {
                  const isActive = Object.keys(statusConfig).indexOf(order.status) >= index
                  const Icon = config.icon
                  return (
                    <div key={key} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isActive ? config.color : "bg-muted"
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-muted-foreground"}`} />
                      </div>
                      <p
                        className={`text-[10px] mt-1 text-center ${isActive ? "font-medium" : "text-muted-foreground"}`}
                      >
                        {config.label.split(" ")[0]}
                      </p>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Items ({order.items?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-muted shrink-0">
                  <Image
                    src={item.product_image || `/placeholder.svg?height=64&width=64&query=${item.product_name}`}
                    alt={item.product_name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.product_name}</p>
                  <p className="text-sm text-muted-foreground">
                    AED {item.unit_price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-primary">AED {item.total_price.toFixed(2)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{address?.building}</p>
            <p className="text-sm text-muted-foreground">{address?.street}</p>
            <p className="text-sm text-muted-foreground">
              {address?.area}, {address?.city}
            </p>
            <p className="text-sm text-muted-foreground">{address?.emirate}</p>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>AED {order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span>AED {order.delivery_fee.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-AED {order.discount.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">AED {order.total.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 mt-3 p-3 bg-muted/50 rounded-xl">
              <Badge variant="outline">{order.payment_method === "cod" ? "Cash on Delivery" : "Card Payment"}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {order.notes && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Order Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Support */}
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-3">Need help with your order?</p>
            <Button variant="outline" className="w-full gap-2 bg-transparent">
              <Phone className="h-4 w-4" />
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>

      <MobileNav onCartOpen={() => setCartOpen(true)} />
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  )
}
