"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  ChefHat,
  Eye,
  MoreHorizontal,
  Search,
  Filter,
  UserPlus,
  Bike,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import type { Order, Profile } from "@/lib/types"

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmed", icon: Package, color: "bg-blue-100 text-blue-800" },
  preparing: { label: "Preparing", icon: ChefHat, color: "bg-purple-100 text-purple-800" },
  out_for_delivery: { label: "Out for Delivery", icon: Truck, color: "bg-orange-100 text-orange-800" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-100 text-red-800" },
}

type OrderStatus = keyof typeof statusConfig

interface AdminOrdersPageProps {
  orders: Order[]
}

export function AdminOrdersPage({ orders: initialOrders }: AdminOrdersPageProps) {
  const router = useRouter()
  const [orders, setOrders] = useState(initialOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [assignRiderOrder, setAssignRiderOrder] = useState<Order | null>(null)
  const [riders, setRiders] = useState<Profile[]>([])
  const [selectedRiderId, setSelectedRiderId] = useState<string>("")
  const [isAssigning, setIsAssigning] = useState(false)

  useEffect(() => {
    if (assignRiderOrder) {
      const fetchRiders = async () => {
        const supabase = createClient()
        const { data } = await supabase.from("profiles").select("*").eq("role", "rider").order("full_name")
        setRiders(data || [])
        setSelectedRiderId(assignRiderOrder.rider_id || "")
      }
      fetchRiders()
    }
  }, [assignRiderOrder])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.delivery_address as { area?: string })?.area?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId)

      if (error) {
        toast.error("Failed to update order status: " + error.message)
        return
      }

      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
      toast.success(`Order status updated to ${statusConfig[newStatus].label}`)
    } catch (err) {
      toast.error("An error occurred. Please try again.")
    }
  }

  const handleAssignRider = async () => {
    if (!assignRiderOrder) return

    setIsAssigning(true)
    
    try {
      const supabase = createClient()

      const updateData: { rider_id: string | null; status?: string } = {
        rider_id: selectedRiderId || null,
      }

      // Auto-update status to out_for_delivery when rider is assigned
      if (selectedRiderId && assignRiderOrder.status === "preparing") {
        updateData.status = "out_for_delivery"
      }

      const { error } = await supabase.from("orders").update(updateData).eq("id", assignRiderOrder.id)

      if (error) {
        toast.error("Failed to assign rider: " + error.message)
        setIsAssigning(false)
        return
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === assignRiderOrder.id
            ? { ...order, rider_id: selectedRiderId || undefined, status: updateData.status || order.status }
            : order,
        ),
      )

      toast.success(selectedRiderId ? "Rider assigned successfully" : "Rider unassigned")
      setAssignRiderOrder(null)
      setSelectedRiderId("")
      setIsAssigning(false)
      router.refresh()
    } catch (err) {
      toast.error("An error occurred. Please try again.")
      setIsAssigning(false)
    }
  }

  const getRiderName = (riderId?: string) => {
    if (!riderId) return null
    const rider = riders.find((r) => r.id === riderId)
    return rider?.full_name || "Unknown Rider"
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Orders</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rider</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const status = statusConfig[order.status as OrderStatus]
                    const StatusIcon = status?.icon || Package
                    const address = order.delivery_address as { area?: string; city?: string }
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.order_number}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">{order.customer_name || "Guest"}</p>
                            <p className="text-muted-foreground text-xs">{address?.area || "N/A"}</p>
                          </div>
                        </TableCell>
                        <TableCell>{order.items?.length || 0} items</TableCell>
                        <TableCell className="font-medium">AED {order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={status?.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {order.rider_id ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                  <Bike className="h-3 w-3" />
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">Assigned</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString("en-AE", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onSelect={() => setSelectedOrder(order)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => setAssignRiderOrder(order)}>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Assign Rider
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                              {Object.entries(statusConfig).map(([key, config]) => (
                                <DropdownMenuItem
                                  key={key}
                                  onSelect={() => updateOrderStatus(order.id, key as OrderStatus)}
                                  disabled={order.status === key}
                                >
                                  <config.icon className="h-4 w-4 mr-2" />
                                  {config.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order {selectedOrder?.order_number}</DialogTitle>
            <DialogDescription>
              Placed on{" "}
              {selectedOrder &&
                new Date(selectedOrder.created_at).toLocaleDateString("en-AE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="font-medium mb-2">Customer</h4>
                <div className="text-sm text-muted-foreground">
                  <p>{selectedOrder.customer_name || "Guest"}</p>
                  {selectedOrder.customer_email && <p>{selectedOrder.customer_email}</p>}
                  {selectedOrder.customer_phone && <p>{selectedOrder.customer_phone}</p>}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={statusConfig[selectedOrder.status as OrderStatus]?.color}>
                  {statusConfig[selectedOrder.status as OrderStatus]?.label}
                </Badge>
              </div>

              {/* Assigned Rider */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Assigned Rider</span>
                {selectedOrder.rider_id ? (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Bike className="h-3 w-3" />
                    Rider Assigned
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedOrder(null)
                      setAssignRiderOrder(selectedOrder)
                    }}
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    Assign
                  </Button>
                )}
              </div>

              {/* Items */}
              <div>
                <h4 className="font-medium mb-3">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.product_name}
                      </span>
                      <span className="font-medium">AED {item.total_price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>AED {selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>AED {selectedOrder.delivery_fee.toFixed(2)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Discount</span>
                    <span>-AED {selectedOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span className="text-primary">AED {selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h4 className="font-medium mb-2">Delivery Address</h4>
                <div className="text-sm text-muted-foreground">
                  {(() => {
                    const addr = selectedOrder.delivery_address as {
                      building?: string
                      street?: string
                      area?: string
                      city?: string
                      emirate?: string
                    }
                    return (
                      <>
                        <p>
                          {addr?.building && `${addr.building}, `}
                          {addr?.street}
                        </p>
                        <p>{addr?.area}</p>
                        <p>
                          {addr?.city}, {addr?.emirate}
                        </p>
                      </>
                    )
                  })()}
                </div>
              </div>

              {/* Payment */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Payment Method</span>
                <Badge variant="outline">{selectedOrder.payment_method === "cod" ? "Cash on Delivery" : "Card"}</Badge>
              </div>

              {selectedOrder.notes && (
                <div>
                  <h4 className="font-medium mb-2">Order Notes</h4>
                  <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!assignRiderOrder} onOpenChange={() => setAssignRiderOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Rider</DialogTitle>
            <DialogDescription>Assign a rider to deliver order {assignRiderOrder?.order_number}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Rider</Label>
              <Select value={selectedRiderId || "none"} onValueChange={setSelectedRiderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a rider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {riders.map((rider) => (
                    <SelectItem key={rider.id} value={rider.id}>
                      <div className="flex items-center gap-2">
                        <Bike className="h-4 w-4" />
                        {rider.full_name || "Unnamed Rider"}
                        {rider.phone && <span className="text-muted-foreground">({rider.phone})</span>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {riders.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No riders available. Add riders from the Riders page first.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignRiderOrder(null)}>
              Cancel
            </Button>
            <Button onClick={handleAssignRider} disabled={isAssigning}>
              {isAssigning ? "Assigning..." : "Assign Rider"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
