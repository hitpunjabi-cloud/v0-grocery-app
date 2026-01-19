"use client"

import Image from "next/image"
import Link from "next/link"
import { X, Plus, Minus, ShoppingBag, Heart, Share2, Check, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useCart } from "@/components/cart-provider"
import type { Product } from "@/lib/types"
import { useState } from "react"
import { toast } from "sonner"

interface ProductQuickViewProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductQuickView({ product, open, onOpenChange }: ProductQuickViewProps) {
  const { items, addItem, updateQuantity } = useCart()
  const [isWishlisted, setIsWishlisted] = useState(false)

  if (!product) return null

  const cartItem = items.find((item) => item.product.id === product.id)
  const quantity = cartItem?.quantity ?? 0

  const hasDiscount = product.sale_price && product.sale_price < product.price
  const displayPrice = product.sale_price ?? product.price
  const discountPercent = hasDiscount ? Math.round(((product.price - product.sale_price!) / product.price) * 100) : 0
  const savings = hasDiscount ? product.price - product.sale_price! : 0

  const handleAddToCart = () => {
    addItem(product)
    toast.success("Added to cart", {
      description: `${product.name} has been added to your cart`,
    })
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/product/${product.id}`
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: `Check out ${product.name} at Easy Grocery!`,
        url: url,
      })
    } else {
      navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-3xl">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>

        {/* Image Section */}
        <div className="relative aspect-square bg-muted/30">
          {hasDiscount && (
            <Badge className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm px-3 py-1.5 rounded-full">
              {discountPercent}% OFF
            </Badge>
          )}
          <Image
            src={
              product.image_url ||
              `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(product.name + " grocery") || "/placeholder.svg"}`
            }
            alt={product.name}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 md:hidden p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Details Section */}
        <div className="p-5 space-y-4">
          {product.category && (
            <Badge variant="secondary" className="rounded-full">
              {product.category.name}
            </Badge>
          )}

          <div>
            <h2 className="text-xl font-bold text-foreground">{product.name}</h2>
            <p className="text-muted-foreground text-sm">{product.weight || product.unit}</p>
          </div>

          {product.description && (
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{product.description}</p>
          )}

          {/* Price */}
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-primary">AED {displayPrice.toFixed(2)}</span>
              {hasDiscount && (
                <span className="text-base text-muted-foreground line-through">AED {product.price.toFixed(2)}</span>
              )}
            </div>
            {hasDiscount && (
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <Check className="h-4 w-4" />
                You save AED {savings.toFixed(2)}
              </p>
            )}
          </div>

          {/* Stock Status */}
          {product.stock_quantity === 0 ? (
            <p className="text-red-500 font-medium text-sm">Out of Stock</p>
          ) : product.stock_quantity <= 5 ? (
            <p className="text-orange-500 font-medium text-sm">Only {product.stock_quantity} left in stock</p>
          ) : (
            <p className="text-green-600 font-medium text-sm flex items-center gap-1">
              <Check className="h-4 w-4" />
              In Stock
            </p>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-2">
            {quantity === 0 ? (
              <Button
                size="lg"
                className="w-full gap-2 h-12 text-base rounded-xl"
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
              >
                <ShoppingBag className="h-5 w-5" />
                Add to Cart
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 border rounded-xl p-1.5 bg-muted/30">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="h-9 w-9 rounded-lg"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center text-lg font-bold">{quantity}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    disabled={quantity >= product.stock_quantity}
                    className="h-9 w-9 rounded-lg"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 h-12 rounded-xl bg-transparent"
                  onClick={() => onOpenChange(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            )}

            <Link href={`/product/${product.id}`} onClick={() => onOpenChange(false)}>
              <Button variant="ghost" size="sm" className="w-full gap-2 text-muted-foreground">
                <ExternalLink className="h-4 w-4" />
                View Full Details
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
