"use client"

import type React from "react"
import { useState, useRef, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, X, ArrowRight, Clock, TrendingUp, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useCart } from "@/components/cart-provider"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/types"
import useSWR from "swr"

interface GlobalSearchProps {
  className?: string
  variant?: "header" | "floating" | "mobile"
  onClose?: () => void
}

const searchFetcher = async (query: string) => {
  if (!query || query.length < 2) return []
  const supabase = createClient()
  const { data } = await supabase
    .from("products")
    .select("id, name, price, sale_price, image_url, unit, stock_quantity, category_id")
    .eq("is_active", true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(5)
  return data || []
}

export function GlobalSearch({ className, variant = "header", onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()
  const router = useRouter()
  const { addItem } = useCart()

  const trendingSearches = useMemo(() => ["Fresh Fruits", "Organic Milk", "Bakery", "Chicken", "Vegetables"], [])

  const { data: results = [], isLoading } = useSWR(debouncedQuery.length >= 2 ? debouncedQuery : null, searchFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  })

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedQuery(value), 300)
  }, [])

  const getRecentSearches = useCallback((): string[] => {
    if (typeof window === "undefined") return []
    try {
      return JSON.parse(localStorage.getItem("recentSearches") || "[]")
    } catch {
      return []
    }
  }, [])

  const saveRecentSearch = useCallback(
    (search: string) => {
      const recent = getRecentSearches()
      const updated = [search, ...recent.filter((s) => s !== search)].slice(0, 5)
      localStorage.setItem("recentSearches", JSON.stringify(updated))
    },
    [getRecentSearches],
  )

  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) return
      saveRecentSearch(searchQuery)
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsOpen(false)
      setQuery("")
      setDebouncedQuery("")
      onClose?.()
    },
    [router, saveRecentSearch, onClose],
  )

  const handleProductClick = useCallback(
    (productId: string) => {
      router.push(`/product/${productId}`)
      setIsOpen(false)
      setQuery("")
      setDebouncedQuery("")
      onClose?.()
    },
    [router, onClose],
  )

  const handleQuickAdd = useCallback(
    (e: React.MouseEvent, product: Product) => {
      e.stopPropagation()
      addItem(product)
    },
    [addItem],
  )

  const recentSearches = isOpen ? getRecentSearches() : []

  if (variant === "mobile") {
    return (
      <div className="w-full" ref={containerRef}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSearch(query)
          }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search groceries..."
              className="bg-muted/50 border-0 pl-12 pr-12 h-14 rounded-2xl text-lg"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              autoFocus
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10"
                onClick={() => {
                  setQuery("")
                  setDebouncedQuery("")
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </form>

        <div className="mt-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground px-1">Products</p>
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-muted shrink-0">
                    <Image
                      src={product.image_url || `/placeholder.svg?height=56&width=56&query=${product.name}`}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-primary font-semibold">
                      AED {(product.sale_price ?? product.price).toFixed(2)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="shrink-0 rounded-lg"
                    onClick={(e) => handleQuickAdd(e, product as Product)}
                  >
                    Add
                  </Button>
                </button>
              ))}
              <Button variant="ghost" className="w-full justify-center gap-2" onClick={() => handleSearch(query)}>
                See all results <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ) : query.length >= 2 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No products found for "{query}"</p>
            </div>
          ) : (
            <>
              {recentSearches.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-2 px-1">
                    <Clock className="h-4 w-4" /> Recent
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search) => (
                      <Badge
                        key={search}
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80 px-3 py-1.5 rounded-full"
                        onClick={() => handleSearch(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-2 px-1">
                  <TrendingUp className="h-4 w-4" /> Trending
                </p>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((search) => (
                    <Badge
                      key={search}
                      variant="outline"
                      className="cursor-pointer hover:bg-muted px-3 py-1.5 rounded-full"
                      onClick={() => handleSearch(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSearch(query)
        }}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Search groceries..."
            className="bg-muted/50 border-0 pl-11 h-11 rounded-xl focus-visible:ring-primary"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          />
          {isLoading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </form>

      {isOpen && (query.length >= 2 || recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((product) => (
                <button
                  key={product.id}
                  onMouseDown={() => handleProductClick(product.id)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                    <Image
                      src={product.image_url || `/placeholder.svg?height=48&width=48&query=${product.name}`}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">{product.name}</p>
                    <p className="text-sm text-primary font-semibold">
                      AED {(product.sale_price ?? product.price).toFixed(2)}
                    </p>
                  </div>
                </button>
              ))}
              <button
                onMouseDown={() => handleSearch(query)}
                className="w-full flex items-center justify-center gap-2 p-2 text-sm text-primary hover:bg-muted/50 rounded-lg transition-colors"
              >
                See all results <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">No products found</div>
          ) : recentSearches.length > 0 ? (
            <div className="p-3 space-y-2">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> Recent searches
              </p>
              {recentSearches.map((search) => (
                <button
                  key={search}
                  onMouseDown={() => handleSearch(search)}
                  className="w-full text-left p-2 text-sm hover:bg-muted/50 rounded-lg transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
