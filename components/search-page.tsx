"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Search, X, SlidersHorizontal, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product-card"
import { ProductQuickView } from "@/components/product-quick-view"
import { MobileNav } from "@/components/mobile-nav"
import { CartSheet } from "@/components/cart-sheet"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { Category, Product } from "@/lib/types"

interface SearchPageProps {
  products: Product[]
  categories: Category[]
}

export function SearchPage({ products, categories }: SearchPageProps) {
  const [query, setQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)

  const filteredProducts = useMemo(() => {
    let filtered = products

    if (query) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description?.toLowerCase().includes(lowerQuery) ||
          p.category?.name.toLowerCase().includes(lowerQuery),
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category?.slug === selectedCategory)
    }

    return filtered
  }, [products, query, selectedCategory])

  const popularSearches = ["Fresh Fruits", "Milk", "Bread", "Chicken", "Rice", "Eggs"]

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b">
        <div className="flex items-center gap-3 px-4 h-14">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-xl shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for groceries..."
              className="pl-10 pr-10 h-10 rounded-xl bg-muted/50 border-0"
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl shrink-0">
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl">
              <SheetHeader>
                <SheetTitle>Filter by Category</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={selectedCategory === null ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2"
                    onClick={() => {
                      setSelectedCategory(null)
                      setFilterOpen(false)
                    }}
                  >
                    All
                  </Badge>
                  {categories.map((category) => (
                    <Badge
                      key={category.id}
                      variant={selectedCategory === category.slug ? "default" : "outline"}
                      className="cursor-pointer px-4 py-2"
                      onClick={() => {
                        setSelectedCategory(category.slug)
                        setFilterOpen(false)
                      }}
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Content */}
      <div className="p-4">
        {!query && !selectedCategory ? (
          /* Popular Searches */
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">Popular Searches</h2>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-4 py-2 rounded-full bg-muted/50 text-sm hover:bg-muted transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>

            <h2 className="text-sm font-semibold text-muted-foreground mt-8 mb-3">Browse Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className="px-4 py-2 rounded-full border text-sm hover:bg-muted transition-colors"
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Search Results */
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} {filteredProducts.length === 1 ? "result" : "results"}
                {query && ` for "${query}"`}
                {selectedCategory && ` in ${categories.find((c) => c.slug === selectedCategory)?.name}`}
              </p>
              {selectedCategory && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)}>
                  Clear filter
                </Button>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground text-sm">Try a different search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

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
