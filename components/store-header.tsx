"use client"

import Link from "next/link"
import {
  ShoppingBag,
  User,
  MapPin,
  Menu,
  LogOut,
  Package,
  Settings,
  X,
  Search,
  Phone,
  Info,
  Home,
  Tag,
  Heart,
  HelpCircle,
  Truck,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useCart } from "@/components/cart-provider"
import { GlobalSearch } from "@/components/global-search"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { useRouter, usePathname } from "next/navigation"
import type { Category } from "@/lib/types"
import Image from "next/image"
import { toast } from "sonner"

interface StoreHeaderProps {
  onCartOpen?: () => void
}

export function StoreHeader({ onCartOpen }: StoreHeaderProps) {
  const { itemCount } = useCart()
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const { user, userRole } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase.from("categories").select("*").order("name")
        if (data) setCategories(data)
      } catch (err) {
        console.error("[v0] Failed to fetch categories:", err)
      }
    }
    fetchCategories()
  }, [])

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      
      setMobileMenuOpen(false)
      toast.success("Signed out successfully")
      
      // Force full page reload to clear all state
      window.location.href = "/"
    } catch (error) {
      console.error("Sign out error:", error)
      // Even if there's an error, force logout by clearing and redirecting
      window.location.href = "/"
    }
  }

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/offers", label: "Offers", icon: Tag },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Phone },
  ]

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="hidden lg:block bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto flex h-10 items-center justify-center px-4 text-sm">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-gray-300">
                Free delivery on orders over <span className="text-white font-semibold">100 AED</span>
              </span>
            </div>
            <div className="h-4 w-px bg-gray-700" />
            <div className="flex items-center gap-2 text-gray-300">
              <Phone className="h-3.5 w-3.5" />
              <span>+971 50 123 4567</span>
            </div>
            <div className="h-4 w-px bg-gray-700" />
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="h-3.5 w-3.5" />
              <span>Dubai, UAE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex h-16 items-center justify-between gap-6 px-4">
          {/* Left - Logo + Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="shrink-0 h-10 w-10 rounded-full hover:bg-gray-100">
                  <Menu className="h-5 w-5 text-gray-700" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] p-0 overflow-y-auto bg-white">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                {/* Mobile menu header */}
                <div className="bg-gray-900 p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500">
                      <span className="text-xl font-bold">E</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Easy Grocery</h2>
                      <p className="text-xs text-gray-400">Fresh groceries delivered</p>
                    </div>
                  </div>
                  {user && (
                    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.email}</p>
                        <p className="text-xs text-gray-400 capitalize">{userRole || "Customer"}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation links */}
                <nav className="p-4">
                  <div className="space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActiveLink(link.href) ? "bg-emerald-50 text-emerald-600" : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <link.icon className="h-5 w-5" />
                        <span className="font-medium">{link.label}</span>
                        {isActiveLink(link.href) && <div className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />}
                      </Link>
                    ))}
                  </div>
                </nav>

                {/* Categories section */}
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between px-4 mb-3">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Categories</h3>
                    <Link
                      href="/categories"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs text-emerald-600 font-medium"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.slice(0, 6).map((category) => (
                      <Link
                        key={category.id}
                        href={`/categories?category=${category.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div className="h-14 w-14 rounded-full overflow-hidden bg-gray-100 ring-2 ring-transparent group-hover:ring-emerald-200 transition-all">
                          {category.image_url ? (
                            <Image
                              src={category.image_url || "/placeholder.svg"}
                              alt={category.name}
                              width={56}
                              height={56}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-emerald-100 flex items-center justify-center">
                              <Tag className="h-6 w-6 text-emerald-600" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-600 text-center line-clamp-1">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* User section */}
                <div className="border-t border-gray-100 p-4 space-y-1">
                  {user ? (
                    <>
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5" />
                          <span className="font-medium">My Profile</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Package className="h-5 w-5" />
                          <span className="font-medium">My Orders</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Link>
                      {userRole === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700"
                        >
                          <div className="flex items-center gap-3">
                            <Settings className="h-5 w-5" />
                            <span className="font-medium">Admin Panel</span>
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      )}
                      {userRole === "rider" && (
                        <Link
                          href="/rider"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700"
                        >
                          <div className="flex items-center gap-3">
                            <Truck className="h-5 w-5" />
                            <span className="font-medium">Rider Panel</span>
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleSignOut()
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span>Sign In</span>
                    </Link>
                  )}
                </div>

                {/* Help */}
                <div className="border-t border-gray-100 p-4">
                  <Link
                    href="/help"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors"
                  >
                    <HelpCircle className="h-5 w-5" />
                    <span className="text-sm">Help & Support</span>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900">
                <span className="text-lg font-bold text-white">E</span>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-lg font-bold text-gray-900 leading-tight">
                  Easy<span className="text-emerald-600">Grocery</span>
                </span>
                <div className="h-0.5 w-12 bg-emerald-500 rounded-full mt-0.5" />
              </div>
            </Link>
          </div>

          {/* Center - Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center gap-1 bg-gray-50 rounded-full p-1">
              <Link
                href="/"
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
                  isActiveLink("/") ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Home
              </Link>

              <Popover open={categoriesOpen} onOpenChange={setCategoriesOpen}>
                <PopoverTrigger asChild>
                  <button
                    className={`flex items-center gap-1 px-5 py-2 text-sm font-medium rounded-full transition-all ${
                      pathname.includes("/categories") || categoriesOpen
                        ? "bg-white shadow-sm text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Categories
                    <ChevronDown className={`h-4 w-4 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[500px] p-4 bg-white shadow-xl border border-gray-100 rounded-2xl"
                  align="start"
                  sideOffset={8}
                >
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/categories?category=${category.slug}`}
                        onClick={() => setCategoriesOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 transition-colors group"
                      >
                        {category.image_url && (
                          <div className="h-12 w-12 rounded-xl overflow-hidden bg-gray-100 group-hover:scale-105 transition-transform">
                            <Image
                              src={category.image_url || "/placeholder.svg"}
                              alt={category.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-emerald-600">{category.name}</p>
                          {category.name_ar && <p className="text-xs text-gray-500">{category.name_ar}</p>}
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 mt-3 pt-3">
                    <Link
                      href="/categories"
                      onClick={() => setCategoriesOpen(false)}
                      className="flex items-center justify-center gap-2 p-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      View All Categories
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>

              <Link
                href="/offers"
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
                  isActiveLink("/offers") ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Offers
              </Link>
              <Link
                href="/about"
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
                  isActiveLink("/about") ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
                  isActiveLink("/contact") ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Contact
              </Link>
            </div>
          </nav>

          {/* Right - Search + Actions */}
          <div className="flex items-center gap-3">
            {/* Desktop Search */}
            <div className="hidden lg:flex w-64">
              <GlobalSearch variant="header" />
            </div>

            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-10 w-10 rounded-full hover:bg-gray-100"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              {mobileSearchOpen ? (
                <X className="h-5 w-5 text-gray-700" />
              ) : (
                <Search className="h-5 w-5 text-gray-700" />
              )}
            </Button>

            {/* Divider */}
            <div className="hidden sm:block h-6 w-px bg-gray-200" />

            {/* Wishlist */}
            <Link href="/wishlist" className="hidden sm:flex">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100">
                <Heart className="h-5 w-5 text-gray-700" />
              </Button>
            </Link>

            {/* User */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden sm:flex h-10 w-10 rounded-full hover:bg-gray-100"
                  >
                    <User className="h-5 w-5 text-gray-700" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl bg-white border-gray-100 shadow-xl">
                  <DropdownMenuLabel className="font-normal px-3 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-gray-900">{user.email}</p>
                      <p className="text-xs leading-none text-gray-500 capitalize">{userRole || "Customer"}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem asChild className="px-3 py-2.5 rounded-lg">
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="px-3 py-2.5 rounded-lg">
                    <Link href="/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  {userRole === "admin" && (
                    <DropdownMenuItem asChild className="px-3 py-2.5 rounded-lg">
                      <Link href="/admin" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {userRole === "rider" && (
                    <DropdownMenuItem asChild className="px-3 py-2.5 rounded-lg">
                      <Link href="/rider" className="cursor-pointer">
                        <Truck className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">Rider Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault()
                      handleSignOut()
                    }}
                    className="text-red-600 cursor-pointer px-3 py-2.5 rounded-lg hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/login" className="hidden sm:flex">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100">
                  <User className="h-5 w-5 text-gray-700" />
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Button
              className="h-10 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
              onClick={onCartOpen}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              <span className="font-medium">Cart</span>
              {itemCount > 0 && (
                <span className="ml-2 h-5 w-5 rounded-full bg-white text-emerald-600 text-xs font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search Expanded */}
        {mobileSearchOpen && (
          <div className="border-t p-4 lg:hidden bg-white">
            <GlobalSearch variant="mobile" onClose={() => setMobileSearchOpen(false)} />
          </div>
        )}
      </div>
    </header>
  )
}
