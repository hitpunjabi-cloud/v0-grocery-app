"use client"

import { useEffect, useState } from "react"
import { ShoppingCart } from "lucide-react"

export function InitialLoader() {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimatingOut(true)
      setTimeout(() => setIsVisible(false), 500)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-white transition-opacity duration-500 ${
        isAnimatingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Logo Animation */}
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-600/30">
            <ShoppingCart className="h-10 w-10 text-white" />
          </div>
          {/* Pulse ring */}
          <div className="absolute inset-0 animate-ping rounded-2xl bg-emerald-600/30" />
        </div>

        {/* Brand name */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Easy Grocery</h1>
          <p className="text-sm text-gray-500">Fresh groceries delivered</p>
        </div>

        {/* Loading dots - explicit emerald color */}
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-600 [animation-delay:-0.3s]" />
          <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-600 [animation-delay:-0.15s]" />
          <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-600" />
        </div>
      </div>
    </div>
  )
}
