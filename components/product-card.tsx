"use client"

import Image from "next/image"
import Link from "next/link"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
  onQuickView?: (product: Product) => void
  compact?: boolean
}

export function ProductCard({ product, onQuickView, compact }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart()
  const cartItem = items.find((item) => item.product.id === product.id)
  const quantity = cartItem?.quantity ?? 0

  const hasDiscount = product.sale_price && product.sale_price < product.price
  const displayPrice = product.sale_price ?? product.price
  const discountPercent = hasDiscount ? Math.round(((product.price - product.sale_price!) / product.price) * 100) : 0

  if (compact) {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <Link href={`/product/${product.id}`} className="block relative aspect-square bg-gray-50">
          <Image
            src={product.image_url || `/placeholder.svg?height=140&width=140&query=${product.name}`}
            alt={product.name}
            fill
            className="object-cover"
          />
          {hasDiscount && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5">
              -{discountPercent}%
            </Badge>
          )}
        </Link>
        <div className="p-2">
          <Link href={`/product/${product.id}`}>
            <h3 className="text-xs font-medium line-clamp-2 mb-1 text-gray-800">{product.name}</h3>
          </Link>
          <p className="text-sm font-bold text-emerald-600">AED {displayPrice.toFixed(2)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {hasDiscount && (
          <Badge className="bg-red-500 text-white font-semibold px-2.5 py-1 shadow-sm">-{discountPercent}%</Badge>
        )}
        {product.is_featured && (
          <Badge className="bg-emerald-100 text-emerald-700 font-medium px-2.5 py-1">Featured</Badge>
        )}
      </div>

      <Link href={`/product/${product.id}`} className="relative aspect-square w-full overflow-hidden bg-gray-50 block">
        <Image
          src={
            product.image_url ||
            `/placeholder.svg?height=280&width=280&query=${encodeURIComponent(product.name + " grocery") || "/placeholder.svg"}`
          }
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-500">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        {product.category && (
          <p className="text-xs font-medium text-emerald-600 mb-1 uppercase tracking-wide">{product.category.name}</p>
        )}

        <Link href={`/product/${product.id}`} className="text-left w-full block">
          <h3 className="font-semibold text-gray-800 leading-snug line-clamp-2 mb-1 hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-gray-500 mb-3">{product.weight || product.unit}</p>

        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">AED {displayPrice.toFixed(2)}</span>
            </div>
            {hasDiscount && <span className="text-xs text-gray-400 line-through">AED {product.price.toFixed(2)}</span>}
          </div>

          {quantity === 0 ? (
            <Button
              size="icon"
              onClick={(e) => {
                e.preventDefault()
                addItem(product)
              }}
              disabled={product.stock_quantity === 0}
              className="h-10 w-10 rounded-full bg-gray-100 hover:bg-emerald-600 hover:text-white text-gray-600 shadow-none transition-colors"
            >
              <Plus className="h-5 w-5" />
            </Button>
          ) : (
            <div className="flex items-center gap-1 bg-emerald-600 rounded-full p-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault()
                  updateQuantity(product.id, quantity - 1)
                }}
                className="h-8 w-8 rounded-full text-white hover:bg-emerald-700"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-6 text-center text-sm font-bold text-white">{quantity}</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault()
                  updateQuantity(product.id, quantity + 1)
                }}
                disabled={quantity >= product.stock_quantity}
                className="h-8 w-8 rounded-full text-white hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Low Stock Warning */}
        {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
          <p className="text-xs text-orange-500 font-medium mt-2">Only {product.stock_quantity} left</p>
        )}
      </div>
    </div>
  )
}
