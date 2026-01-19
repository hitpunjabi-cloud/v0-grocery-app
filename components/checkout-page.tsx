"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"
import { ArrowLeft, CreditCard, Banknote, MapPin, Phone, Mail, UserIcon, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useCart } from "@/components/cart-provider"
import { createClient } from "@/lib/supabase/client"
import type { Profile, Address } from "@/lib/types"

interface CheckoutPageProps {
  user: User | null
  profile: Profile | null
  savedAddresses: Address[]
}

const DELIVERY_FEE = 10
const FREE_DELIVERY_THRESHOLD = 100

export function CheckoutPage({ user, profile, savedAddresses }: CheckoutPageProps) {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")

  const [selectedAddressId, setSelectedAddressId] = useState<string | "new">(
    savedAddresses.find((a) => a.is_default)?.id || "new",
  )

  const [formData, setFormData] = useState({
    fullName: profile?.full_name || "",
    email: user?.email || "",
    phone: profile?.phone || "",
    street: "",
    building: "",
    apartment: "",
    area: "",
    city: "Dubai",
    emirate: "Dubai",
    landmark: "",
    notes: "",
    paymentMethod: "cod" as "cod" | "card",
  })

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const total = subtotal + deliveryFee

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setIsSubmitting(true)
    
    const timeoutId = setTimeout(() => {
      setIsSubmitting(false)
      toast.error("Request timed out. Please try again.")
    }, 30000)

    try {
      const supabase = createClient()

      // Build delivery address
      let deliveryAddress: Address
      if (selectedAddressId !== "new" && savedAddresses.length > 0) {
        deliveryAddress = savedAddresses.find((a) => a.id === selectedAddressId)!
      } else {
        deliveryAddress = {
          id: crypto.randomUUID(),
          user_id: user?.id || "",
          label: "Delivery Address",
          street: formData.street,
          building: formData.building,
          apartment: formData.apartment,
          area: formData.area,
          city: formData.city,
          emirate: formData.emirate,
          landmark: formData.landmark,
          is_default: false,
          created_at: new Date().toISOString(),
        }
      }

      // Generate order number
      const orderNum = `EG${Date.now().toString(36).toUpperCase()}`

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNum,
          user_id: user?.id || null,
          status: "pending",
          subtotal,
          delivery_fee: deliveryFee,
          discount: 0,
          total,
          delivery_address: deliveryAddress,
          payment_method: formData.paymentMethod,
          payment_status: formData.paymentMethod === "cod" ? "pending" : "pending",
          notes: formData.notes || null,
          customer_name: formData.fullName,
          customer_email: formData.email,
          customer_phone: formData.phone,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.image_url,
        quantity: item.quantity,
        unit_price: item.product.sale_price || item.product.price,
        total_price: (item.product.sale_price || item.product.price) * item.quantity,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      // Save address if user is logged in and using new address
      if (user && selectedAddressId === "new" && formData.street) {
        await supabase.from("addresses").insert({
          user_id: user.id,
          label: "Home",
          street: formData.street,
          building: formData.building,
          apartment: formData.apartment,
          area: formData.area,
          city: formData.city,
          emirate: formData.emirate,
          landmark: formData.landmark,
          is_default: savedAddresses.length === 0,
        })
      }

      clearTimeout(timeoutId)
      clearCart()
      setOrderNumber(orderNum)
      setOrderPlaced(true)
      toast.success("Order placed successfully!")
    } catch (error) {
      clearTimeout(timeoutId)
      console.error("Checkout error:", error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-2xl px-4 py-16">
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Order Confirmed!</h1>
            <p className="text-muted-foreground">Thank you for your order. We{"'"}ll start preparing it right away.</p>
            <div className="bg-card rounded-lg border p-6 text-left">
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="text-2xl font-bold text-primary">{orderNumber}</p>
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground">
                You will receive an email confirmation shortly. Track your order status in your account.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
              <Link href="/orders">
                <Button>Track Order</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-2xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some items to checkout</p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card">
        <div className="container flex h-16 items-center gap-4 px-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Checkout</h1>
        </div>
      </header>

      <main className="container px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-primary" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+971 50 123 4567"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="email@example.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {savedAddresses.length > 0 && (
                    <div className="space-y-3">
                      <Label>Saved Addresses</Label>
                      <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId} className="grid gap-3">
                        {savedAddresses.map((address) => (
                          <div
                            key={address.id}
                            className="flex items-start space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-secondary/50"
                          >
                            <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                            <label htmlFor={address.id} className="flex-1 cursor-pointer">
                              <p className="font-medium">{address.label}</p>
                              <p className="text-sm text-muted-foreground">
                                {address.building && `${address.building}, `}
                                {address.street}, {address.area}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {address.city}, {address.emirate}
                              </p>
                            </label>
                          </div>
                        ))}
                        <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-secondary/50">
                          <RadioGroupItem value="new" id="new-address" />
                          <label htmlFor="new-address" className="cursor-pointer font-medium">
                            Add new address
                          </label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {(selectedAddressId === "new" || savedAddresses.length === 0) && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="street">Street Address *</Label>
                        <Input
                          id="street"
                          name="street"
                          value={formData.street}
                          onChange={handleInputChange}
                          required={selectedAddressId === "new"}
                          placeholder="Street name and number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="building">Building Name/Number</Label>
                        <Input
                          id="building"
                          name="building"
                          value={formData.building}
                          onChange={handleInputChange}
                          placeholder="Building name or number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apartment">Apartment/Villa</Label>
                        <Input
                          id="apartment"
                          name="apartment"
                          value={formData.apartment}
                          onChange={handleInputChange}
                          placeholder="Apartment or villa number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="area">Area *</Label>
                        <Input
                          id="area"
                          name="area"
                          value={formData.area}
                          onChange={handleInputChange}
                          required={selectedAddressId === "new"}
                          placeholder="e.g., JBR, Downtown"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" value={formData.city} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="landmark">Landmark (Optional)</Label>
                        <Input
                          id="landmark"
                          name="landmark"
                          value={formData.landmark}
                          onChange={handleInputChange}
                          placeholder="Nearby landmark for easier delivery"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, paymentMethod: value as "cod" | "card" }))
                    }
                    className="grid gap-3 sm:grid-cols-2"
                  >
                    <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-secondary/50">
                      <RadioGroupItem value="cod" id="cod" />
                      <label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Banknote className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-sm text-muted-foreground">Pay when you receive</p>
                        </div>
                      </label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-secondary/50 opacity-50">
                      <RadioGroupItem value="card" id="card" disabled />
                      <label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Card Payment</p>
                          <p className="text-sm text-muted-foreground">Coming soon</p>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Notes (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any special instructions for your order or delivery..."
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="max-h-64 overflow-y-auto space-y-3">
                    {items.map((item) => {
                      const price = item.product.sale_price || item.product.price
                      return (
                        <div key={item.product.id} className="flex gap-3">
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                            <Image
                              src={
                                item.product.image_url ||
                                `/placeholder.svg?height=64&width=64&query=${encodeURIComponent(item.product.name) || "/placeholder.svg"}`
                              }
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm line-clamp-2">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} x AED {price.toFixed(2)}
                            </p>
                          </div>
                          <p className="font-medium text-sm">AED {(price * item.quantity).toFixed(2)}</p>
                        </div>
                      )
                    })}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>AED {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className={deliveryFee === 0 ? "text-primary font-medium" : ""}>
                        {deliveryFee === 0 ? "FREE" : `AED ${deliveryFee.toFixed(2)}`}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base font-semibold">
                      <span>Total</span>
                      <span className="text-primary">AED {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      `Place Order - AED ${total.toFixed(2)}`
                    )}
                  </Button>

                  {!user && (
                    <p className="text-xs text-center text-muted-foreground">
                      <Link href="/auth/login" className="text-primary hover:underline">
                        Sign in
                      </Link>{" "}
                      to save your addresses and track orders
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
