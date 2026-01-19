"use client"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Package, Grid3X3, List, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { MobileNav } from "@/components/mobile-nav"
import { CartSheet } from "@/components/cart-sheet"
import type { Category, Product } from "@/lib/types"

interface CategoriesPageProps {
  categories: Category[]
  products: Product[]
}

function CategoriesContent({ categories, products }: CategoriesPageProps) {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    setSelectedCategory(categoryParam)
  }, [categoryParam])

  const filteredProducts = selectedCategory ? products.filter((p) => p.category?.slug === selectedCategory) : products
  const selectedCategoryData = categories.find((c) => c.slug === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader />
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />

      <main className="pb-20 md:pb-8">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-emerald-600">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">
                {selectedCategory ? selectedCategoryData?.name : "All Categories"}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <div className="bg-white rounded-2xl p-4 sticky top-24 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-4 px-2">Categories</h2>
                <nav className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                      !selectedCategory
                        ? "bg-emerald-50 text-emerald-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Grid3X3 className="h-5 w-5" />
                    <span>All Products</span>
                    <span className="ml-auto text-xs bg-gray-100 px-2 py-0.5 rounded-full">{products.length}</span>
                  </button>
                  {categories.map((category) => {
                    const count = products.filter((p) => p.category?.slug === category.slug).length
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.slug)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                          selectedCategory === category.slug
                            ? "bg-emerald-50 text-emerald-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {category.image_url && (
                          <div className="h-8 w-8 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            <Image
                              src={category.image_url || "/placeholder.svg"}
                              alt={category.name}
                              width={32}
                              height={32}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <span className="truncate">{category.name}</span>
                        <span className="ml-auto text-xs bg-gray-100 px-2 py-0.5 rounded-full shrink-0">{count}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedCategory ? selectedCategoryData?.name : "All Products"}
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">{filteredProducts.length} products found</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className={`rounded-lg ${viewMode === "grid" ? "bg-emerald-50 border-emerald-200" : ""}`}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`rounded-lg ${viewMode === "list" ? "bg-emerald-50 border-emerald-200" : ""}`}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 text-sm mb-4">This category is empty</p>
                  <Button variant="outline" onClick={() => setSelectedCategory(null)} className="rounded-xl">
                    View All Products
                  </Button>
                </div>
              ) : (
                <div
                  className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-4"}
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
      <MobileNav onCartOpen={() => setCartOpen(true)} />
    </div>
  )
}

export function CategoriesPage({ categories, products }: CategoriesPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <div className="h-16 bg-white border-b flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
          </div>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex gap-8">
              <div className="w-64 shrink-0 hidden lg:block">
                <div className="bg-white rounded-2xl p-4 space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                      <div className="aspect-square bg-gray-100 rounded-xl mb-3 animate-pulse" />
                      <div className="h-4 bg-gray-100 rounded mb-2 animate-pulse" />
                      <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <CategoriesContent categories={categories} products={products} />
    </Suspense>
  )
}
