"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import type { Banner } from "@/lib/types"

interface AdminBannersPageProps {
  banners: Banner[]
}

export function AdminBannersPage({ banners: initialBanners }: AdminBannersPageProps) {
  const router = useRouter()
  const [banners, setBanners] = useState(initialBanners)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image_url: "",
    button_text: "Shop Now",
    button_link: "/",
    text_color: "#ffffff",
    overlay_opacity: 0.4,
    is_active: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [operationInProgress, setOperationInProgress] = useState<string | null>(null)

  const filteredBanners = banners.filter(
    (banner) =>
      banner.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      banner.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      image_url: "",
      button_text: "Shop Now",
      button_link: "/",
      text_color: "#ffffff",
      overlay_opacity: 0.4,
      is_active: true,
    })
    setEditingBanner(null)
  }

  const openEditDialog = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      description: banner.description || "",
      image_url: banner.image_url,
      button_text: banner.button_text,
      button_link: banner.button_link,
      text_color: banner.text_color,
      overlay_opacity: banner.overlay_opacity,
      is_active: banner.is_active,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    
    const timeoutId = setTimeout(() => {
      setIsSubmitting(false)
      toast.error("Request timed out. Please try again.")
    }, 15000)
    
    try {
      const supabase = createClient()

      const bannerData = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        description: formData.description || null,
        image_url: formData.image_url,
        button_text: formData.button_text,
        button_link: formData.button_link,
        text_color: formData.text_color,
        overlay_opacity: formData.overlay_opacity,
        is_active: formData.is_active,
        display_order: editingBanner?.display_order ?? banners.length + 1,
      }

      if (editingBanner) {
        const { error } = await supabase.from("banners").update(bannerData).eq("id", editingBanner.id)
        clearTimeout(timeoutId)

        if (error) {
          toast.error("Failed to update banner: " + error.message)
          setIsSubmitting(false)
          return
        }

        setBanners((prev) => prev.map((b) => (b.id === editingBanner.id ? { ...b, ...bannerData } : b)))
        toast.success("Banner updated successfully")
      } else {
        const { data, error } = await supabase.from("banners").insert(bannerData).select().single()
        clearTimeout(timeoutId)

        if (error) {
          toast.error("Failed to create banner: " + error.message)
          setIsSubmitting(false)
          return
        }

        setBanners((prev) => [...prev, data as Banner])
        toast.success("Banner created successfully")
      }

      setIsSubmitting(false)
      setIsDialogOpen(false)
      resetForm()
    } catch (err) {
      clearTimeout(timeoutId)
      toast.error("An error occurred. Please try again.")
      setIsSubmitting(false)
    }
  }

  const toggleBannerStatus = async (bannerId: string, isActive: boolean) => {
    if (operationInProgress) return
    setOperationInProgress(bannerId)
    
    try {
      const supabase = createClient()
      const { error } = await supabase.from("banners").update({ is_active: isActive }).eq("id", bannerId)

      if (error) {
        toast.error("Failed to update banner status: " + error.message)
        return
      }

      setBanners((prev) => prev.map((b) => (b.id === bannerId ? { ...b, is_active: isActive } : b)))
      toast.success(`Banner ${isActive ? "activated" : "deactivated"}`)
    } catch (err) {
      toast.error("An error occurred")
    } finally {
      setOperationInProgress(null)
    }
  }

  const deleteBanner = async (bannerId: string) => {
    if (operationInProgress) return
    setOperationInProgress(bannerId)
    
    try {
      const supabase = createClient()
      const { error } = await supabase.from("banners").delete().eq("id", bannerId)

      if (error) {
        toast.error("Failed to delete banner: " + error.message)
        return
      }

      setBanners((prev) => prev.filter((b) => b.id !== bannerId))
      toast.success("Banner deleted successfully")
    } catch (err) {
      toast.error("An error occurred")
    } finally {
      setOperationInProgress(null)
    }
  }

  const moveBanner = async (bannerId: string, direction: "up" | "down") => {
    if (operationInProgress) return
    
    const currentIndex = banners.findIndex((b) => b.id === bannerId)
    if (currentIndex === -1) return

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= banners.length) return

    setOperationInProgress(bannerId)
    
    try {
      const supabase = createClient()
      const currentBanner = banners[currentIndex]
      const swapBanner = banners[newIndex]

      // Swap display orders
      await supabase.from("banners").update({ display_order: swapBanner.display_order }).eq("id", currentBanner.id)
      await supabase.from("banners").update({ display_order: currentBanner.display_order }).eq("id", swapBanner.id)

      // Update local state
      const newBanners = [...banners]
      newBanners[currentIndex] = { ...swapBanner, display_order: currentBanner.display_order }
      newBanners[newIndex] = { ...currentBanner, display_order: swapBanner.display_order }
      setBanners(newBanners.sort((a, b) => a.display_order - b.display_order))

      toast.success("Banner order updated")
    } catch (err) {
      toast.error("An error occurred")
    } finally {
      setOperationInProgress(null)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Banners</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Homepage Banners ({filteredBanners.length})</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Manage the banner slider on the homepage</p>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search banners..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button
                  onClick={() => {
                    resetForm()
                    setIsDialogOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Banner
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Order</TableHead>
                  <TableHead>Banner</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Button</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBanners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No banners found. Add your first banner to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBanners.map((banner, index) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            disabled={index === 0}
                            onClick={() => moveBanner(banner.id, "up")}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <span className="text-center text-sm font-medium">{index + 1}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            disabled={index === filteredBanners.length - 1}
                            onClick={() => moveBanner(banner.id, "down")}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="relative h-16 w-28 overflow-hidden rounded-lg bg-secondary">
                          <Image
                            src={banner.image_url || "/placeholder.svg"}
                            alt={banner.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{banner.title}</p>
                          {banner.subtitle && <p className="text-xs text-muted-foreground">{banner.subtitle}</p>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{banner.button_text}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={banner.is_active ? "default" : "secondary"}>
                          {banner.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => openEditDialog(banner)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => toggleBannerStatus(banner.id, !banner.is_active)}>
                              {banner.is_active ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onSelect={() => deleteBanner(banner.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Add/Edit Banner Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBanner ? "Edit Banner" : "Add New Banner"}</DialogTitle>
            <DialogDescription>
              {editingBanner ? "Update banner details below" : "Fill in the banner details below"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Preview */}
            {formData.image_url && (
              <div className="relative h-40 w-full overflow-hidden rounded-lg bg-secondary">
                <Image
                  src={formData.image_url || "/placeholder.svg"}
                  alt="Banner preview"
                  fill
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"
                  style={{ opacity: formData.overlay_opacity }}
                />
                <div className="absolute inset-0 flex items-center p-6">
                  <div className="space-y-2">
                    {formData.subtitle && (
                      <span
                        className="text-xs px-2 py-1 rounded-full bg-white/20"
                        style={{ color: formData.text_color }}
                      >
                        {formData.subtitle}
                      </span>
                    )}
                    <h3 className="text-xl font-bold" style={{ color: formData.text_color }}>
                      {formData.title || "Banner Title"}
                    </h3>
                    {formData.description && (
                      <p className="text-sm" style={{ color: formData.text_color, opacity: 0.9 }}>
                        {formData.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter banner title"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                placeholder="e.g., Limited Time Offer"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Enter banner description"
                rows={2}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image_url">Image URL *</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://example.com/banner.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Recommended size: 1400x600px. Use a high-quality landscape image.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="button_text">Button Text</Label>
                <Input
                  id="button_text"
                  value={formData.button_text}
                  onChange={(e) => setFormData((prev) => ({ ...prev, button_text: e.target.value }))}
                  placeholder="Shop Now"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="button_link">Button Link</Label>
                <Input
                  id="button_link"
                  value={formData.button_link}
                  onChange={(e) => setFormData((prev) => ({ ...prev, button_link: e.target.value }))}
                  placeholder="/#products"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="text_color">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="text_color"
                    type="color"
                    value={formData.text_color}
                    onChange={(e) => setFormData((prev) => ({ ...prev, text_color: e.target.value }))}
                    className="w-14 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.text_color}
                    onChange={(e) => setFormData((prev) => ({ ...prev, text_color: e.target.value }))}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Overlay Opacity: {Math.round(formData.overlay_opacity * 100)}%</Label>
                <Slider
                  value={[formData.overlay_opacity]}
                  onValueChange={([value]) => setFormData((prev) => ({ ...prev, overlay_opacity: value }))}
                  min={0}
                  max={1}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Active (visible on homepage)</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.title || !formData.image_url || isSubmitting}>
              {isSubmitting ? "Saving..." : editingBanner ? "Update Banner" : "Create Banner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
