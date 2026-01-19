"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingBag,
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"
import { MobileNav } from "@/components/mobile-nav"
import { CartSheet } from "@/components/cart-sheet"
import { ProductCard } from "@/components/product-card"
import { GlobalSearch } from "@/components/global-search"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { Product } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ProductDetailPageProps {
  productId: string
}

function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white shadow-sm h-14 flex items-center px-4">
        <div className="h-10 w-10 rounded-xl bg-gray-100" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
        </div>
      </header>
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-3xl shadow-sm flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 bg-white rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <div className="h-8 w-3/4 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-6 w-24 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-10 w-32 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-14 w-full bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const [cartOpen, setCartOpen] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const { items, addItem, updateQuantity } = useCart()

  useEffect(() => {
    let mounted = true

    async function loadProduct() {
      if (!productId) {
        setError("No product ID provided")
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      const supabase = createClient()

      try {
        const { data, error: fetchError } = await supabase
          .from("products")
          .select("*, category:categories(id, name, slug)")
          .eq("id", productId)
          .single()

        if (!mounted) return

        if (fetchError) {
          setError("Failed to load product: " + fetchError.message)
          setIsLoading(false)
          return
        }

        if (!data) {
          setError("Product not found")
          setIsLoading(false)
          return
        }

        setProduct(data)
        setIsLoading(false)

        // Load related products
        if (data?.category_id) {
          const { data: related } = await supabase
            .from("products")
            .select("id, name, price, sale_price, image_url, images, unit, stock_quantity, category_id")
            .eq("category_id", data.category_id)
            .eq("is_active", true)
            .neq("id", productId)
            .limit(6)

          if (mounted && related) {
            setRelatedProducts(related as Product[])
          }
        }
      } catch (err) {
        if (mounted) {
          setError("Failed to load product")
          setIsLoading(false)
        }
      }
    }

    loadProduct()

    return () => {
      mounted = false
    }
  }, [productId])

  const handleAddToCart = useCallback(() => {
    if (product) {
      addItem(product)
      toast.success("Added to cart")
    }
  }, [product, addItem])

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      await navigator.share({ title: product?.name, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied")
    }
  }, [product?.name])

  if (isLoading) return <ProductSkeleton />

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4 bg-white p-8 rounded-3xl shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="h-8 w-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
          <p className="text-gray-500">{error}</p>
          <Link href="/">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const cartItem = items.find((item) => item.product.id === product.id)
  const quantity = cartItem?.quantity ?? 0
  const hasDiscount = product.sale_price && product.sale_price < product.price
  const displayPrice = product.sale_price ?? product.price
  const discountPercent = hasDiscount ? Math.round(((product.price - product.sale_price!) / product.price) * 100) : 0

  const productImages: string[] =
    product.images && product.images.length > 0
      ? product.images
      : product.image_url
        ? [product.image_url]
        : [`/placeholder.svg?height=600&width=600&query=${product.name} grocery product`]

  const currentImage = productImages[selectedImageIndex] || productImages[0]

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-4 h-14 max-w-6xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-xl shrink-0 hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </Button>
          </Link>

          <div className="hidden md:block flex-1 max-w-md">
            <GlobalSearch variant="header" />
          </div>

          <h1 className="md:hidden text-base font-semibold truncate flex-1 text-gray-900">{product.name}</h1>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl md:hidden hover:bg-gray-100"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5 text-gray-700" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl hover:bg-gray-100"
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-colors",
                  isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700",
                )}
              />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-gray-100" onClick={handleShare}>
              <Share2 className="h-5 w-5 text-gray-700" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex rounded-xl relative hover:bg-gray-100"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5 text-gray-700" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t p-4 md:hidden bg-white">
            <GlobalSearch variant="mobile" onClose={() => setSearchOpen(false)} />
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
          {/* Product Images - Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-3xl shadow-sm overflow-hidden group">
              {hasDiscount && (
                <Badge className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm px-3 py-1.5 rounded-full shadow-lg">
                  {discountPercent}% OFF
                </Badge>
              )}
              {product.is_featured && (
                <Badge className="absolute top-4 right-4 z-10 bg-emerald-500 text-white text-sm px-3 py-1.5 rounded-full shadow-lg">
                  Featured
                </Badge>
              )}
              <Image
                src={currentImage || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Navigation arrows for multiple images */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-white shadow-sm transition-all",
                      selectedImageIndex === index
                        ? "ring-2 ring-emerald-500 ring-offset-2"
                        : "hover:ring-2 hover:ring-gray-300",
                    )}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-5 h-fit">
            {product.category && (
              <Link href={`/categories?category=${product.category.slug}`}>
                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full px-4 py-1.5 text-sm font-medium">
                  {product.category.name}
                </Badge>
              </Link>
            )}

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-500 mt-1">
                {product.unit} {product.weight && `• ${product.weight}`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm text-gray-500 font-medium">4.8 (128 reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 py-2">
              <span className="text-4xl font-bold text-emerald-600">AED {displayPrice.toFixed(2)}</span>
              {hasDiscount && (
                <span className="text-xl text-gray-400 line-through">AED {product.price.toFixed(2)}</span>
              )}
            </div>

            <div
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                product.stock_quantity > 5
                  ? "bg-emerald-50 text-emerald-700"
                  : product.stock_quantity > 0
                    ? "bg-orange-50 text-orange-700"
                    : "bg-red-50 text-red-700",
              )}
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  product.stock_quantity > 5
                    ? "bg-emerald-500"
                    : product.stock_quantity > 0
                      ? "bg-orange-500"
                      : "bg-red-500",
                )}
              />
              {product.stock_quantity === 0
                ? "Out of Stock"
                : product.stock_quantity <= 5
                  ? `Only ${product.stock_quantity} left in stock`
                  : "In Stock"}
            </div>

            {/* Add to Cart */}
            <div className="pt-2">
              {quantity === 0 ? (
                <Button
                  size="lg"
                  className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold shadow-lg shadow-emerald-200"
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-gray-100 rounded-2xl p-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="h-10 w-10 rounded-xl hover:bg-white"
                    >
                      <Minus className="h-5 w-5 text-gray-700" />
                    </Button>
                    <span className="w-8 text-center font-bold text-lg text-gray-900">{quantity}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="h-10 w-10 rounded-xl hover:bg-white"
                    >
                      <Plus className="h-5 w-5 text-gray-700" />
                    </Button>
                  </div>
                  <Button
                    size="lg"
                    className="flex-1 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    onClick={() => setCartOpen(true)}
                  >
                    View Cart
                  </Button>
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              {[
                { icon: Truck, title: "Free Delivery", desc: "Over AED 50" },
                { icon: Shield, title: "Quality", desc: "Guaranteed" },
                { icon: RotateCcw, title: "Easy Returns", desc: "Hassle-free" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex flex-col items-center text-center p-3 rounded-2xl bg-gray-50">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                    <Icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="text-xs font-semibold text-gray-900">{title}</span>
                  <span className="text-xs text-gray-500">{desc}</span>
                </div>
              ))}
            </div>

            {product.description && (
              <div className="pt-4 border-t border-gray-100">
                <h2 className="font-semibold mb-2 text-gray-900">Description</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-10 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-gray-900">You may also like</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:hidden scrollbar-hide">
              {relatedProducts.map((p) => (
                <div key={p.id} className="w-40 shrink-0">
                  <ProductCard product={p} compact />
                </div>
              ))}
            </div>
            <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40">
        {quantity === 0 ? (
          <Button
            size="lg"
            className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg"
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Add to Cart - AED {displayPrice.toFixed(2)}
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 rounded-2xl p-1.5">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="h-11 w-11 rounded-xl"
              >
                <Minus className="h-5 w-5" />
              </Button>
              <span className="w-8 text-center font-bold text-lg text-gray-900">{quantity}</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="h-11 w-11 rounded-xl"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <Button
              size="lg"
              className="flex-1 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              onClick={() => setCartOpen(true)}
            >
              View Cart
            </Button>
          </div>
        )}
      </div>

      <MobileNav onCartOpen={() => setCartOpen(true)} />
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  )
}
