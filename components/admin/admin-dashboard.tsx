"use client"

import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  ArrowUpRight,
  BarChart3,
  Activity,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import type { Order } from "@/lib/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface AdminDashboardProps {
  stats: {
    totalOrders: number
    pendingOrders: number
    totalProducts: number
    activeProducts: number
    totalCustomers: number
    totalRevenue: number
    todayOrders: number
    todayRevenue: number
  }
  recentOrders: Order[]
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  preparing: "bg-purple-100 text-purple-800 border-purple-200",
  out_for_delivery: "bg-orange-100 text-orange-800 border-orange-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
}

export function AdminDashboard({ stats, recentOrders }: AdminDashboardProps) {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 bg-white border-b border-gray-100 px-6">
        <SidebarTrigger className="-ml-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100" />
        <Separator orientation="vertical" className="mr-2 h-4 bg-gray-200" />
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, Admin</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
            <Activity className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Stats Grid - Modern cards with gradients */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">AED {stats.totalRevenue.toFixed(2)}</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs text-emerald-600 font-medium">
                    AED {stats.todayRevenue.toFixed(2)} today
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Orders</CardTitle>
                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                    {stats.pendingOrders} pending
                  </span>
                  <span className="text-xs text-gray-500">{stats.todayOrders} today</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Products</CardTitle>
                <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.totalProducts}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-emerald-600 font-medium">{stats.activeProducts} active</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Customers</CardTitle>
                <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</div>
                <p className="text-xs text-gray-500 mt-1">Registered users</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Recent Orders */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Quick Actions */}
            <Card className="bg-white border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Quick Actions</CardTitle>
                <CardDescription className="text-gray-500">Common admin tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <Link href="/admin/orders?status=pending">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 h-12 border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors bg-transparent"
                  >
                    <Clock className="h-4 w-4" />
                    Pending Orders
                    {stats.pendingOrders > 0 && (
                      <Badge className="ml-auto bg-yellow-100 text-yellow-700 border-yellow-200">
                        {stats.pendingOrders}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link href="/admin/products/new">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 h-12 border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors bg-transparent"
                  >
                    <Package className="h-4 w-4" />
                    Add Product
                  </Button>
                </Link>
                <Link href="/admin/categories">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 h-12 border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors bg-transparent"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Manage Categories
                  </Button>
                </Link>
                <Link href="/admin/customers">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 h-12 border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors bg-transparent"
                  >
                    <Users className="h-4 w-4" />
                    View Customers
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="bg-white border-gray-100 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900">Recent Orders</CardTitle>
                  <CardDescription className="text-gray-500">Latest orders from customers</CardDescription>
                </div>
                <Link href="/admin/orders">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  >
                    View All
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900">{order.order_number}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.created_at).toLocaleDateString("en-AE", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`${statusColors[order.status]} border`}>
                            {order.status.replace("_", " ")}
                          </Badge>
                          <span className="text-sm font-semibold text-gray-900">AED {order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
