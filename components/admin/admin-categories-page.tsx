"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, MoreHorizontal } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import type { Category } from "@/lib/types"

interface AdminCategoriesPageProps {
  categories: Category[]
}

export function AdminCategoriesPage({ categories: initialCategories }: AdminCategoriesPageProps) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    name_ar: "",
    slug: "",
    image_url: "",
    display_order: "",
    is_active: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [operationInProgress, setOperationInProgress] = useState<string | null>(null)

  const resetForm = () => {
    setFormData({
      name: "",
      name_ar: "",
      slug: "",
      image_url: "",
      display_order: "",
      is_active: true,
    })
    setEditingCategory(null)
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      name_ar: category.name_ar || "",
      slug: category.slug,
      image_url: category.image_url || "",
      display_order: category.display_order.toString(),
      is_active: category.is_active,
    })
    setIsDialogOpen(true)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
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

      const categoryData = {
        name: formData.name,
        name_ar: formData.name_ar || null,
        slug: formData.slug || generateSlug(formData.name),
        image_url: formData.image_url || null,
        display_order: formData.display_order ? Number.parseInt(formData.display_order) : categories.length + 1,
        is_active: formData.is_active,
      }

      if (editingCategory) {
        const { error } = await supabase.from("categories").update(categoryData).eq("id", editingCategory.id)
        clearTimeout(timeoutId)

        if (error) {
          toast.error("Failed to update category: " + error.message)
          setIsSubmitting(false)
          return
        }

        setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? { ...c, ...categoryData } : c)))
        toast.success("Category updated successfully")
      } else {
        const { data, error } = await supabase.from("categories").insert(categoryData).select().single()
        clearTimeout(timeoutId)

        if (error) {
          toast.error("Failed to create category: " + error.message)
          setIsSubmitting(false)
          return
        }

        setCategories((prev) => [...prev, data as Category])
        toast.success("Category created successfully")
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

  const deleteCategory = async (categoryId: string) => {
    if (operationInProgress) return
    setOperationInProgress(categoryId)
    
    try {
      const supabase = createClient()
      const { error } = await supabase.from("categories").delete().eq("id", categoryId)

      if (error) {
        toast.error("Failed to delete category. It may have products associated with it.")
        return
      }

      setCategories((prev) => prev.filter((c) => c.id !== categoryId))
      toast.success("Category deleted successfully")
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
        <h1 className="text-lg font-semibold">Categories</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Categories ({categories.length})</CardTitle>
              <Button
                onClick={() => {
                  resetForm()
                  setIsDialogOpen(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No categories found
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.display_order}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          {category.name_ar && <p className="text-xs text-muted-foreground">{category.name_ar}</p>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-secondary px-2 py-1 rounded">{category.slug}</code>
                      </TableCell>
                      <TableCell>
                        <Badge variant={category.is_active ? "default" : "secondary"}>
                          {category.is_active ? "Active" : "Inactive"}
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
                            <DropdownMenuItem onSelect={() => openEditDialog(category)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onSelect={() => deleteCategory(category.id)}>
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

      {/* Add/Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            <DialogDescription>
              {editingCategory ? "Update category details below" : "Fill in the category details below"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                    slug: prev.slug || generateSlug(e.target.value),
                  }))
                }}
                placeholder="Enter category name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name_ar">Arabic Name</Label>
              <Input
                id="name_ar"
                value={formData.name_ar}
                onChange={(e) => setFormData((prev) => ({ ...prev, name_ar: e.target.value }))}
                placeholder="Enter Arabic name"
                dir="rtl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="category-slug"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData((prev) => ({ ...prev, display_order: e.target.value }))}
                  placeholder="1"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name || isSubmitting}>
              {isSubmitting ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
