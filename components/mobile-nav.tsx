"use client"

import { Home, Grid3X3, ShoppingCart, ClipboardList, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  onCartOpen: () => void
}

export function MobileNav({ onCartOpen }: MobileNavProps) {
  const pathname = usePathname()
  const { itemCount } = useCart()
  const { user } = useAuth()

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/categories", icon: Grid3X3, label: "Categories" },
    { href: "#cart", icon: ShoppingCart, label: "Cart", isCart: true },
    { href: "/orders", icon: ClipboardList, label: "Orders" },
    { href: user ? "/profile" : "/auth/login", icon: User, label: "Account" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white backdrop-blur-xl border-t safe-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : item.href !== "#cart" && pathname.startsWith(item.href)
          const Icon = item.icon

          if (item.isCart) {
            return (
              <button
                key={item.label}
                onClick={onCartOpen}
                className="flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 relative min-w-[60px]"
              >
                <div className="relative">
                  <div
                    className={cn(
                      "p-2 rounded-full transition-all duration-200",
                      itemCount > 0 ? "bg-emerald-600 scale-110" : "bg-transparent",
                    )}
                  >
                    <Icon className={cn("h-5 w-5 transition-colors", itemCount > 0 ? "text-white" : "text-gray-500")} />
                  </div>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white text-emerald-600 border-2 border-emerald-600 text-[10px] font-bold flex items-center justify-center animate-in zoom-in duration-200">
                      {itemCount > 9 ? "9+" : itemCount}
                    </span>
                  )}
                </div>
                <span className={cn("text-[10px] font-medium", itemCount > 0 ? "text-emerald-600" : "text-gray-500")}>
                  {item.label}
                </span>
              </button>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 min-w-[60px] active:scale-95 transition-transform"
            >
              <div
                className={cn(
                  "p-2 rounded-full transition-all duration-200",
                  isActive ? "bg-emerald-50 scale-110" : "bg-transparent",
                )}
              >
                <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-emerald-600" : "text-gray-500")} />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-emerald-600" : "text-gray-500",
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
