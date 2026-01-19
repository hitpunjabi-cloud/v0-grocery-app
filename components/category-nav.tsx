"use client"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { Category } from "@/lib/types"
import { ChevronLeft, ChevronRight, Sparkles, Check } from "lucide-react"

interface CategoryNavProps {
  categories: Category[]
  selectedCategory: string | null
  onSelectCategory: (slug: string | null) => void
}

// Category images mapping
const categoryImages: Record<string, string> = {
  "fruits-vegetables": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&h=200&fit=crop",
  "dairy-eggs": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&h=200&fit=crop",
  bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop",
  "meat-poultry": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&h=200&fit=crop",
  pantry: "https://images.unsplash.com/photo-1584473457406-6240486418e9?w=200&h=200&fit=crop",
  beverages: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=200&h=200&fit=crop",
}

export function CategoryNav({ categories, selectedCategory, onSelectCategory }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const ref = scrollRef.current
    if (ref) {
      ref.addEventListener("scroll", checkScrollButtons)
      return () => ref.removeEventListener("scroll", checkScrollButtons)
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="relative pt-2">
      {/* Left gradient fade */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-4 w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none transition-opacity duration-300",
          showLeftArrow ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Right gradient fade */}
      <div
        className={cn(
          "absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none transition-opacity duration-300",
          showRightArrow ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Scroll buttons */}
      <button
        onClick={() => scroll("left")}
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-lg transition-all duration-300",
          showLeftArrow ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none",
        )}
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => scroll("right")}
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-lg transition-all duration-300",
          showRightArrow ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none",
        )}
        aria-label="Scroll right"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-6 md:gap-8 lg:gap-10 overflow-x-auto py-3 pb-4 scrollbar-hide scroll-smooth px-6 justify-center"
      >
        {/* All category - Professional design */}
        <button
          onClick={() => onSelectCategory(null)}
          className="flex flex-col items-center gap-2.5 flex-shrink-0 group/item"
        >
          <div
            className={cn(
              "relative w-20 h-20 md:w-24 md:h-24 rounded-full transition-all duration-300 ease-out",
              "bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100",
              "border-2",
              selectedCategory === null
                ? "border-emerald-500 shadow-lg shadow-emerald-200/50 scale-105"
                : "border-emerald-200 hover:border-emerald-400 hover:scale-105 hover:shadow-lg hover:shadow-emerald-100/50",
            )}
          >
            {/* Inner decorative ring */}
            <div className="absolute inset-2 rounded-full border border-dashed border-emerald-300/50" />

            {/* Center icon container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={cn(
                  "w-11 h-11 md:w-13 md:h-13 rounded-full flex items-center justify-center transition-all duration-300",
                  "bg-white shadow-sm",
                  selectedCategory === null ? "shadow-md" : "group-hover/item:shadow-md",
                )}
              >
                <Sparkles
                  className={cn(
                    "h-5 w-5 md:h-6 md:w-6 transition-colors duration-300",
                    selectedCategory === null
                      ? "text-emerald-600"
                      : "text-emerald-500 group-hover/item:text-emerald-600",
                  )}
                />
              </div>
            </div>

            {/* Selected indicator */}
            {selectedCategory === null && (
              <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </div>
            )}
          </div>
          <span
            className={cn(
              "text-xs md:text-sm font-medium text-center transition-all duration-200",
              selectedCategory === null
                ? "text-emerald-700 font-semibold"
                : "text-gray-600 group-hover/item:text-emerald-600",
            )}
          >
            All
          </span>
        </button>

        {/* Category items */}
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.slug)}
            className="flex flex-col items-center gap-2.5 flex-shrink-0 group/item"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="relative">
              <div
                className={cn(
                  "relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden transition-all duration-300 ease-out",
                  "border-2 bg-gray-100",
                  selectedCategory === category.slug
                    ? "border-emerald-500 shadow-lg shadow-emerald-200/50 scale-105"
                    : "border-gray-200 hover:border-emerald-400 hover:scale-105 hover:shadow-lg hover:shadow-gray-200/50",
                )}
              >
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/30 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 z-10" />

                <Image
                  src={
                    category.image_url ||
                    categoryImages[category.slug] ||
                    `/placeholder.svg?height=200&width=200&query=${category.name || "/placeholder.svg"} food`
                  }
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/item:scale-110"
                  sizes="96px"
                />
              </div>

              {selectedCategory === category.slug && (
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center z-20 shadow-md border-2 border-white">
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </div>
              )}
            </div>
            <span
              className={cn(
                "text-xs md:text-sm font-medium text-center max-w-[80px] md:max-w-[96px] truncate transition-all duration-200",
                selectedCategory === category.slug
                  ? "text-emerald-700 font-semibold"
                  : "text-gray-600 group-hover/item:text-emerald-600",
              )}
            >
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
