"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowRight, Truck, Shield, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Banner } from "@/lib/types"

interface BannerSliderProps {
  banners: Banner[]
}

export function BannerSlider({ banners }: BannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating || banners.length === 0) return
      setIsAnimating(true)
      setCurrentIndex(index)
      setTimeout(() => setIsAnimating(false), 600)
    },
    [isAnimating, banners.length],
  )

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % banners.length)
  }, [currentIndex, banners.length, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide((currentIndex - 1 + banners.length) % banners.length)
  }, [currentIndex, banners.length, goToSlide])

  useEffect(() => {
    if (banners.length <= 1 || isPaused) return
    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [banners.length, isPaused, nextSlide])

  if (banners.length === 0) return null

  const features = [
    { icon: Truck, text: "Free Delivery" },
    { icon: Clock, text: "30 Min Express" },
    { icon: Shield, text: "100% Fresh" },
  ]

  return (
    <section
      className="relative w-full overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #059669 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Decorative Blurs */}
      <div className="absolute top-20 left-[5%] w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-[10%] w-96 h-96 bg-teal-200/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-green-100/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="relative container mx-auto px-4 md:px-6 lg:px-8">
        <div className="min-h-[520px] md:min-h-[560px] lg:min-h-[600px] flex items-center py-8 md:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
            {/* Text Content */}
            <div className="relative z-10 text-center lg:text-left order-2 lg:order-1">
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className={cn(
                    "transition-all duration-500 ease-out",
                    index === currentIndex
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8 absolute inset-0 pointer-events-none",
                  )}
                >
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Now Delivering in Dubai
                  </div>

                  {/* Heading */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight">
                    <span className="block">{banner.title.split(" ").slice(0, 2).join(" ")}</span>
                    <span className="block text-emerald-600">
                      {banner.title.split(" ").slice(2).join(" ") || "Fresh Daily"}
                    </span>
                  </h1>

                  {/* Description */}
                  {banner.description && (
                    <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                      {banner.description}
                    </p>
                  )}

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-10">
                    <Button
                      asChild
                      size="lg"
                      className="h-14 px-8 rounded-full text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 transition-all hover:-translate-y-0.5 gap-2"
                    >
                      <Link href={banner.button_link}>
                        {banner.button_text}
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="h-14 px-8 rounded-full text-base font-semibold border-2 border-gray-200 hover:border-emerald-600 hover:text-emerald-600 transition-all bg-white/80 backdrop-blur-sm"
                    >
                      <Link href="/categories">Browse Categories</Link>
                    </Button>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                    {features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-600">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <feature.icon className="h-5 w-5 text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Image */}
            <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Decorative ring */}
                <div className="absolute -inset-4 md:-inset-8 rounded-full border-2 border-dashed border-emerald-200/50 animate-[spin_20s_linear_infinite]" />
                <div className="absolute -inset-8 md:-inset-16 rounded-full border border-emerald-100/30" />

                {/* Image container */}
                <div className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[480px] lg:h-[480px]">
                  {banners.map((banner, index) => (
                    <div
                      key={banner.id}
                      className={cn(
                        "absolute inset-0 transition-all duration-600 ease-out",
                        index === currentIndex ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-90 rotate-3",
                      )}
                    >
                      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 p-4 md:p-6 shadow-2xl shadow-emerald-900/10">
                        <div className="relative w-full h-full rounded-full overflow-hidden bg-white">
                          <Image
                            src={banner.image_url || "/placeholder.svg?height=600&width=600&query=fresh groceries"}
                            alt={banner.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                            sizes="(max-width: 768px) 280px, (max-width: 1024px) 400px, 480px"
                            quality={95}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Floating badges */}
                  <div className="absolute -left-4 top-1/4 bg-white rounded-2xl shadow-xl p-3 md:p-4 animate-bounce-slow z-10">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-xl">🥕</span>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-xs text-gray-500">Vegetables</p>
                        <p className="text-sm font-bold text-gray-900">50+ Items</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="absolute -right-4 top-1/3 bg-white rounded-2xl shadow-xl p-3 md:p-4 animate-bounce-slow z-10"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-xl">🍎</span>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-xs text-gray-500">Fruits</p>
                        <p className="text-sm font-bold text-gray-900">Fresh Daily</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="absolute -bottom-2 left-1/4 bg-white rounded-2xl shadow-xl p-3 md:p-4 animate-bounce-slow z-10"
                    style={{ animationDelay: "1s" }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <span className="text-xl">🧀</span>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-xs text-gray-500">Dairy</p>
                        <p className="text-sm font-bold text-gray-900">Premium</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:shadow-xl transition-all hover:scale-110"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:shadow-xl transition-all hover:scale-110"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "relative h-3 rounded-full transition-all duration-300 overflow-hidden",
                  index === currentIndex ? "w-10 bg-emerald-600" : "w-3 bg-gray-300 hover:bg-gray-400",
                )}
                aria-label={`Go to slide ${index + 1}`}
              >
                {index === currentIndex && (
                  <span className="absolute inset-0 bg-emerald-400 origin-left animate-progress" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
