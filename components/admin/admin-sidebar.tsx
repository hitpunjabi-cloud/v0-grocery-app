"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  LogOut,
  Store,
  ImageIcon,
  Bike,
  RefreshCw,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { createClient, resetClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { title: "Orders", icon: ShoppingCart, href: "/admin/orders" },
  { title: "Products", icon: Package, href: "/admin/products" },
  { title: "Categories", icon: Tag, href: "/admin/categories" },
  { title: "Banners", icon: ImageIcon, href: "/admin/banners" },
  { title: "Riders", icon: Bike, href: "/admin/riders" },
  { title: "Customers", icon: Users, href: "/admin/customers" },
  { title: "Settings", icon: Settings, href: "/admin/settings" },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleClearCache = async () => {
    try {
      // Reset Supabase client to fix any connection issues
      resetClient()
      
      // Clear browser caches
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map(name => caches.delete(name)))
      }
      
      // Clear sessionStorage only (keep localStorage for cart etc)
      sessionStorage.clear()
      
      toast.success("Cache cleared successfully", {
        description: "Refreshing page...",
      })
      
      // Reload the page immediately
      window.location.reload()
    } catch (error) {
      console.error("Clear cache error:", error)
      toast.error("Failed to clear cache")
    }
  }

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      
      // Reset the client to clear auth state
      resetClient()
      
      if (error) {
        toast.error("Sign out failed", {
          description: error.message,
        })
        return
      }
      
      toast.success("Signed out successfully", {
        description: "You have been logged out of admin panel.",
      })
      
      // Force full page reload to clear all state
      window.location.href = "/auth/login"
    } catch (error) {
      console.error("Sign out error:", error)
      resetClient()
      toast.error("Sign out failed. Please try again.")
    }
  }

  return (
    <Sidebar className="border-r border-gray-100">
      <SidebarHeader className="border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 shadow-sm">
            <span className="text-sm font-bold text-white">E</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Easy Grocery</p>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider px-4">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`mx-2 rounded-xl transition-colors ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <Link href={item.href}>
                        <item.icon className={`h-4 w-4 ${isActive ? "text-emerald-600" : ""}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="mx-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900">
              <Link href="/">
                <Store className="h-4 w-4" />
                <span>View Store</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleClearCache}
              className="mx-2 rounded-xl text-amber-600 hover:bg-amber-50 hover:text-amber-700"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Clear Cache</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="mx-2 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
