"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Package,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  Bell,
  Heart,
  HelpCircle,
  Edit2,
  Camera,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MobileNav } from "@/components/mobile-nav"
import { CartSheet } from "@/components/cart-sheet"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { Profile, Address } from "@/lib/types"

export function ProfilePage() {
  const router = useRouter()
  const [cartOpen, setCartOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [orderCount, setOrderCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({ full_name: "", phone: "" })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const loadUserData = async () => {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profileData) {
        setProfile(profileData)
        setEditForm({
          full_name: profileData.full_name || "",
          phone: profileData.phone || "",
        })
      }

      const { data: addressesData } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })

      setAddresses(addressesData || [])

      const { count } = await supabase.from("orders").select("*", { count: "exact", head: true }).eq("user_id", user.id)

      setOrderCount(count || 0)
      setIsLoading(false)
    }

    loadUserData()
  }, [router])

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        toast.error("Sign out failed", {
          description: error.message,
        })
        return
      }
      
      toast.success("Signed out successfully", {
        description: "You have been logged out of your account.",
      })
      
      router.refresh()
      setTimeout(() => {
        window.location.href = "/"
      }, 500)
    } catch (error) {
      console.error("Sign out error:", error)
      toast.error("Sign out failed. Please try again.")
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return
    setIsSaving(true)

    const supabase = createClient()
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: editForm.full_name,
        phone: editForm.phone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      toast.error("Failed to update profile")
    } else {
      setProfile((prev) => (prev ? { ...prev, ...editForm } : null))
      toast.success("Profile updated successfully")
      setEditDialogOpen(false)
    }
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-gray-500 text-sm">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const menuItems = [
    {
      icon: Package,
      label: "My Orders",
      href: "/orders",
      badge: orderCount > 0 ? `${orderCount}` : undefined,
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: MapPin,
      label: "Saved Addresses",
      href: "/profile/addresses",
      badge: addresses.length > 0 ? `${addresses.length}` : undefined,
      color: "bg-emerald-100 text-emerald-600",
    },
    { icon: Heart, label: "Wishlist", href: "/wishlist", color: "bg-pink-100 text-pink-600" },
    { icon: CreditCard, label: "Payment Methods", href: "/profile/payments", color: "bg-purple-100 text-purple-600" },
    { icon: Bell, label: "Notifications", href: "/profile/notifications", color: "bg-orange-100 text-orange-600" },
    { icon: Settings, label: "Settings", href: "/profile/settings", color: "bg-gray-100 text-gray-600" },
  ]

  const supportItems = [
    { icon: HelpCircle, label: "Help & Support", href: "/help", color: "bg-cyan-100 text-cyan-600" },
    { icon: Shield, label: "Privacy Policy", href: "/privacy", color: "bg-indigo-100 text-indigo-600" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Header with gradient */}
      <header className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white">
        <div className="flex items-center justify-between px-4 h-14 max-w-3xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">My Account</h1>
          <div className="w-10" />
        </div>

        {/* Profile Header */}
        <div className="px-4 pb-8 pt-4 max-w-3xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-white/30 shadow-lg">
                <AvatarFallback className="bg-white text-emerald-600 text-2xl font-bold">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-1.5 bg-white text-emerald-600 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{profile?.full_name || "User"}</h2>
              <p className="text-emerald-100 text-sm">{user.email}</p>
              {profile?.phone && <p className="text-emerald-100 text-sm">{profile.phone}</p>}
            </div>
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-xl">
                  <Edit2 className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl border-gray-100">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-gray-700">
                      Full Name
                    </Label>
                    <Input
                      id="full_name"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Enter your name"
                      className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+971 XX XXX XXXX"
                      className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 -mt-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-white rounded-2xl border-gray-100 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">{orderCount}</p>
              <p className="text-xs text-gray-500">Orders</p>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-2xl border-gray-100 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">{addresses.length}</p>
              <p className="text-xs text-gray-500">Addresses</p>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-2xl border-gray-100 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">0</p>
              <p className="text-xs text-gray-500">Wishlist</p>
            </CardContent>
          </Card>
        </div>

        {/* Default Address */}
        {addresses.find((a) => a.is_default) && (
          <Card className="bg-white rounded-2xl border-gray-100 shadow-sm mb-6">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-emerald-100 rounded-xl">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm text-gray-900">Default Delivery Address</p>
                    <Badge className="rounded-full bg-emerald-100 text-emerald-700 border-0">Default</Badge>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {addresses.find((a) => a.is_default)?.address_line}, {addresses.find((a) => a.is_default)?.area}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Menu Items */}
        <Card className="bg-white rounded-2xl border-gray-100 shadow-sm mb-6">
          <CardContent className="p-2">
            {menuItems.map((item, index) => (
              <div key={item.href}>
                <Link href={item.href}>
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className={`p-2.5 rounded-xl ${item.color}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="flex-1 font-medium text-gray-900">{item.label}</span>
                    {item.badge && (
                      <Badge className="rounded-full bg-gray-100 text-gray-700 border-0">{item.badge}</Badge>
                    )}
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </Link>
                {index < menuItems.length - 1 && <Separator className="mx-3 bg-gray-100" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Support Items */}
        <Card className="bg-white rounded-2xl border-gray-100 shadow-sm mb-6">
          <CardContent className="p-2">
            {supportItems.map((item, index) => (
              <div key={item.href}>
                <Link href={item.href}>
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className={`p-2.5 rounded-xl ${item.color}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="flex-1 font-medium text-gray-900">{item.label}</span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </Link>
                {index < supportItems.length - 1 && <Separator className="mx-3 bg-gray-100" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sign Out Button */}
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="w-full h-12 rounded-2xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors bg-transparent"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sign Out
        </Button>

        <p className="text-center text-xs text-gray-400 mt-6">Easy Grocery v1.0.0</p>
      </div>

      {/* Mobile Nav */}
      <MobileNav onCartOpen={() => setCartOpen(true)} />
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  )
}
