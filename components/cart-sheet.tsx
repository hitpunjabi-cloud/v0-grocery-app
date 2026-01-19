"use client"

import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, Truck, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCart } from "@/components/cart-provider"

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DELIVERY_FEE = 10

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart()

  const freeDeliveryThreshold = 100
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal)
  const isFreeDelivery = subtotal >= freeDeliveryThreshold
  const deliveryFee = isFreeDelivery ? 0 : DELIVERY_FEE
  const total = subtotal + deliveryFee

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md bg-white border-l border-l-gray-100">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-lg text-gray-900">
              <ShoppingBag className="h-5 w-5 text-emerald-600" />
              Your Cart
              {items.length > 0 && <span className="text-sm font-normal text-gray-500">({items.length} items)</span>}
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full -mr-2 hover:bg-gray-100"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center p-6 bg-gray-50">
            <div className="rounded-full bg-white p-8 shadow-sm">
              <ShoppingBag className="h-12 w-12 text-gray-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1 text-gray-900">Your cart is empty</h3>
              <p className="text-sm text-gray-500">Add items to get started</p>
            </div>
            <Button
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => onOpenChange(false)}
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Free Delivery Progress */}
            {remainingForFreeDelivery > 0 && (
              <div className="mx-6 mt-4 rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-emerald-600" />
                  <p className="text-sm font-medium text-gray-700">
                    Add <span className="text-emerald-600 font-bold">AED {remainingForFreeDelivery.toFixed(2)}</span>{" "}
                    for free delivery
                  </p>
                </div>
                <div className="h-2 rounded-full bg-white overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {isFreeDelivery && (
              <div className="mx-6 mt-4 rounded-2xl bg-emerald-100 border border-emerald-200 px-4 py-3 flex items-center gap-2">
                <Truck className="h-4 w-4 text-emerald-600" />
                <p className="text-sm font-medium text-emerald-700">You've unlocked free delivery!</p>
              </div>
            )}

            {/* Cart Items */}
            <ScrollArea className="flex-1 px-6 bg-gray-50">
              <div className="space-y-4 py-4">
                {items.map((item) => {
                  const price = item.product.sale_price ?? item.product.price
                  return (
                    <div
                      key={item.product.id}
                      className="flex gap-4 p-3 rounded-2xl bg-white shadow-sm border border-gray-100"
                    >
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        <Image
                          src={
                            item.product.image_url ||
                            `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(item.product.name) || "/placeholder.svg"}`
                          }
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div>
                          <h4 className="font-semibold leading-tight line-clamp-1 text-sm text-gray-900">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">{item.product.weight || item.product.unit}</p>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-xl p-0.5">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 rounded-lg hover:bg-gray-100"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3 text-gray-600" />
                            </Button>
                            <span className="w-6 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 rounded-lg hover:bg-gray-100"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3 text-gray-600" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-emerald-600">AED {(price * item.quantity).toFixed(2)}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                              onClick={() => removeItem(item.product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="border-t border-gray-100 bg-white p-6 space-y-4 safe-bottom">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">AED {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span className={`font-medium ${isFreeDelivery ? "text-emerald-600" : "text-gray-900"}`}>
                    {isFreeDelivery ? "FREE" : `AED ${DELIVERY_FEE.toFixed(2)}`}
                  </span>
                </div>
                <div className="h-px bg-gray-100 my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-emerald-600">AED {total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link href="/checkout" className="w-full" onClick={() => onOpenChange(false)}>
                  <Button className="w-full h-12 rounded-xl text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25">
                    Proceed to Checkout
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full text-gray-500 hover:text-red-600 hover:bg-red-50"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
