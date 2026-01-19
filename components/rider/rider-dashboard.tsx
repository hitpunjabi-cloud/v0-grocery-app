"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  MapPin,
  Phone,
  Navigation,
  LogOut,
  Home,
  RefreshCw,
  ChevronRight,
  Bike,
  TrendingUp,
  Star,
  Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import type { Order, Profile } from "@/lib/types"

const statusConfig = {
  confirmed: { label: "Ready for Pickup", icon: Package, color: "bg-blue-500", lightColor: "bg-blue-50 text-blue-600" },
  preparing: { label: "Preparing", icon: Clock, color: "bg-amber-500", lightColor: "bg-amber-50 text-amber-600" },
  out_for_delivery: { label: "Out for Delivery", icon: Truck, color: "bg-orange-500", lightColor: "bg-orange-50 text-orange-600" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "bg-emerald-500", lightColor: "bg-emerald-50 text-emerald-600" },
}

interface RiderDashboardProps {
  profile: Profile | null
  orders: Order[]
}

export function RiderDashboard({ profile, orders: initialOrders }: RiderDashboardProps) {
  const router = useRouter()
  const [orders, setOrders] = useState(initialOrders)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("available")

  const availableOrders = orders.filter((o) => o.status === "confirmed" || o.status === "preparing")
  const myDeliveries = orders.filter((o) => o.status === "out_for_delivery")

  const refreshOrders = async () => {
    setIsRefreshing(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from("orders")
        .select("*, items:order_items(*)")
        .in("status", ["confirmed", "preparing", "out_for_delivery"])
        .order("created_at", { ascending: false })

      if (data) {
        setOrders(data)
        toast.success("Orders refreshed")
      }
    } catch (error) {
      toast.error("Failed to refresh orders")
    } finally {
      setIsRefreshing(false)
    }
  }

  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const acceptOrder = async (orderId: string) => {
    if (isProcessing) return
    setIsProcessing(orderId)
    
    try {
      const supabase = createClient()
      const { error } = await supabase.from("orders").update({ status: "out_for_delivery" }).eq("id", orderId)

      if (error) {
        toast.error("Failed to accept order: " + error.message)
        return
      }

      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: "out_for_delivery" } : order)))
      toast.success("Order accepted! Navigate to pickup location.")
      setActiveTab("deliveries")
    } catch (err) {
      toast.error("An error occurred")
    } finally {
      setIsProcessing(null)
    }
  }

  const markDelivered = async (orderId: string) => {
    if (isProcessing) return
    setIsProcessing(orderId)
    
    try {
      const supabase = createClient()
      const { error } = await supabase.from("orders").update({ status: "delivered" }).eq("id", orderId)

      if (error) {
        toast.error("Failed to mark as delivered: " + error.message)
        return
      }

      setOrders((prev) => prev.filter((order) => order.id !== orderId))
      toast.success("Order marked as delivered!")
    } catch (err) {
      toast.error("An error occurred")
    } finally {
      setIsProcessing(null)
    }
  }

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      
      toast.success("Signed out successfully", {
        description: "You have been logged out of rider panel.",
      })
      
      // Force full page navigation to clear all state
      window.location.href = "/auth/login"
    } catch (error) {
      console.error("Sign out error:", error)
      toast.error("Sign out failed. Please try again.")
    }
  }

  const openMaps = (address: { area?: string; city?: string; street?: string }) => {
    const query = encodeURIComponent(`${address.street || ""} ${address.area || ""} ${address.city || "Dubai"}`)
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Gradient Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJ2Mmgydi0yem0tMiAwaDJ2MmgtMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        
        <div className="relative z-10 px-4 pt-6 pb-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                <Bike className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Easy Grocery</h1>
                <p className="text-sm text-white/80">Rider Dashboard</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={refreshOrders}
              disabled={isRefreshing}
              className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-0"
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>

          {/* Welcome Message */}
          <div className="mb-6">
            <p className="text-white/80 text-sm">Welcome back,</p>
            <p className="text-white text-lg font-semibold">{profile?.full_name || "Rider"}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="h-10 w-10 rounded-full bg-white/30 flex items-center justify-center">
                  <Package className="h-5 w-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{availableOrders.length}</p>
              <p className="text-xs text-white/70">Available</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="h-10 w-10 rounded-full bg-white/30 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{myDeliveries.length}</p>
              <p className="text-xs text-white/70">Active</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="h-10 w-10 rounded-full bg-white/30 flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">4.9</p>
              <p className="text-xs text-white/70">Rating</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="flex">
          <button
            onClick={() => setActiveTab("available")}
            className={`flex-1 py-4 text-sm font-medium transition-all relative ${
              activeTab === "available" 
                ? "text-emerald-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Package className="h-4 w-4" />
              Available
              {availableOrders.length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === "available" 
                    ? "bg-emerald-100 text-emerald-600" 
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {availableOrders.length}
                </span>
              )}
            </div>
            {activeTab === "available" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("deliveries")}
            className={`flex-1 py-4 text-sm font-medium transition-all relative ${
              activeTab === "deliveries" 
                ? "text-emerald-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Truck className="h-4 w-4" />
              My Deliveries
              {myDeliveries.length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === "deliveries" 
                    ? "bg-emerald-100 text-emerald-600" 
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {myDeliveries.length}
                </span>
              )}
            </div>
            {activeTab === "deliveries" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-4 pb-24 space-y-4">
        {activeTab === "available" && (
          <>
            {availableOrders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Package className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No available orders</h3>
                <p className="text-gray-500 text-sm mb-4">New orders will appear here automatically</p>
                <Button 
                  onClick={refreshOrders} 
                  variant="outline" 
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            ) : (
              availableOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onAccept={() => acceptOrder(order.id)}
                  onOpenMaps={openMaps}
                  type="available"
                  isProcessing={isProcessing === order.id}
                />
              ))
            )}
          </>
        )}

        {activeTab === "deliveries" && (
          <>
            {myDeliveries.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Truck className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No active deliveries</h3>
                <p className="text-gray-500 text-sm mb-4">Accept orders from the Available tab to start delivering</p>
                <Button 
                  onClick={() => setActiveTab("available")} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  View Available Orders
                </Button>
              </div>
            ) : (
              myDeliveries.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onDeliver={() => markDelivered(order.id)}
                  onOpenMaps={openMaps}
                  type="delivery"
                  isProcessing={isProcessing === order.id}
                />
              ))
            )}
          </>
        )}
      </main>

      {/* Modern Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => setActiveTab("available")}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
              activeTab === "available" 
                ? "text-emerald-600 bg-emerald-50" 
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Package className="h-5 w-5" />
            <span className="text-xs font-medium">Orders</span>
          </button>
          <button
            onClick={() => setActiveTab("deliveries")}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
              activeTab === "deliveries" 
                ? "text-emerald-600 bg-emerald-50" 
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Truck className="h-5 w-5" />
            <span className="text-xs font-medium">Deliveries</span>
          </button>
          <Link 
            href="/" 
            className="flex flex-col items-center gap-1 px-6 py-2 rounded-xl text-gray-400 hover:text-gray-600 transition-all"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs font-medium">Store</span>
          </Link>
          <button 
            onClick={handleSignOut} 
            className="flex flex-col items-center gap-1 px-6 py-2 rounded-xl text-gray-400 hover:text-red-500 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-xs font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

interface OrderCardProps {
  order: Order
  onAccept?: () => void
  onDeliver?: () => void
  onOpenMaps: (address: { area?: string; city?: string; street?: string }) => void
  type: "available" | "delivery"
  isProcessing?: boolean
}

function OrderCard({ order, onAccept, onDeliver, onOpenMaps, type, isProcessing }: OrderCardProps) {
  const address = order.delivery_address as {
    building?: string
    street?: string
    area?: string
    city?: string
    phone?: string
  }
  const status = statusConfig[order.status as keyof typeof statusConfig]
  const StatusIcon = status?.icon || Package

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Order Header */}
      <div className="p-4 border-b border-gray-50">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl ${status?.lightColor || 'bg-gray-100'} flex items-center justify-center`}>
              <StatusIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{order.order_number}</h3>
              <p className="text-xs text-gray-500">
                {new Date(order.created_at).toLocaleTimeString("en-AE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                · {order.items?.length || 0} items
              </p>
            </div>
          </div>
          <Badge className={`${status?.color} text-white text-xs px-3 py-1 rounded-full`}>
            {status?.label}
          </Badge>
        </div>
      </div>

      {/* Order Content */}
      <div className="p-4 space-y-3">
        {/* Delivery Address */}
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <MapPin className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 text-sm">{address?.area || "Dubai"}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {address?.building && `${address.building}, `}
              {address?.street}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="shrink-0 h-10 w-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600" 
            onClick={() => onOpenMaps(address)}
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>

        {/* Customer Phone */}
        {order.customer_phone && (
          <a 
            href={`tel:${order.customer_phone}`} 
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Phone className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Customer Phone</p>
              <p className="font-medium text-gray-800">{order.customer_phone}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </a>
        )}

        {/* Order Total */}
        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span className="text-sm text-gray-600">Order Total</span>
          </div>
          <span className="text-lg font-bold text-emerald-600">AED {order.total.toFixed(2)}</span>
        </div>

        {/* Action Button */}
        {type === "available" && onAccept && (
          <Button 
            onClick={onAccept} 
            disabled={isProcessing}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold gap-2 shadow-lg shadow-emerald-200 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Truck className="h-5 w-5" />
                Accept & Start Delivery
              </>
            )}
          </Button>
        )}
        {type === "delivery" && onDeliver && (
          <Button 
            onClick={onDeliver}
            disabled={isProcessing}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold gap-2 shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                Mark as Delivered
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
