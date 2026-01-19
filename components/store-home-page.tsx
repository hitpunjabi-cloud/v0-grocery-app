"use client"

import { useState, useMemo } from "react"
import { StoreHeader } from "@/components/store-header"
import { HeroBanner } from "@/components/hero-banner"
import { CategoryNav } from "@/components/category-nav"
import { ProductCard } from "@/components/product-card"
import { CartSheet } from "@/components/cart-sheet"
import { StoreFooter } from "@/components/store-footer"
import { ProductQuickView } from "@/components/product-quick-view"
import { MobileNav } from "@/components/mobile-nav"
import Link from "next/link"
import type { Category, Product } from "@/lib/types"

interface StoreHomePageProps {
  categories: Category[]
  products: Product[]
  featuredProducts: Product[]
}

export function StoreHomePage({ categories, products, featuredProducts }: StoreHomePageProps) {
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  const filteredProducts = useMemo(() => {
    let filtered = products

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category?.slug === selectedCategory)
    }

    return filtered
  }, [products, selectedCategory])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <StoreHeader onCartOpen={() => setCartOpen(true)} />

      <main className="flex-1 pb-20 md:pb-0">
        <HeroBanner />

        <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          {/* Categories - Centered */}
          <div className="mb-10 md:mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Shop by Category</h2>
              <Link href="/categories" className="text-sm font-medium text-[#2e7d32] hover:underline">
                View All
              </Link>
            </div>
            <CategoryNav
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Featured Products - Centered */}
          {!selectedCategory && featuredProducts.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Featured Products</h2>
                <Link href="/categories" className="text-sm font-medium text-[#2e7d32] hover:underline">
                  View All
                </Link>
              </div>
              <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* All Products - Centered */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                {selectedCategory
                  ? categories.find((c) => c.slug === selectedCategory)?.name || "Products"
                  : "All Products"}
              </h2>
              <span className="text-sm text-gray-500 font-medium">
                {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#e8f5e9] flex items-center justify-center">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or filter</p>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <StoreFooter />

      <MobileNav onCartOpen={() => setCartOpen(true)} />

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />

      <ProductQuickView
        product={quickViewProduct}
        open={!!quickViewProduct}
        onOpenChange={(open) => !open && setQuickViewProduct(null)}
      />
    </div>
  )
}
