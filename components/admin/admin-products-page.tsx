"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, EyeOff, X, ImagePlus } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import type { Product, Category } from "@/lib/types"

interface AdminProductsPageProps {
  products: Product[]
  categories: Category[]
}

export function AdminProductsPage({ products: initialProducts, categories }: AdminProductsPageProps) {
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    sale_price: "",
    category_id: "",
    stock_quantity: "",
    unit: "piece",
    weight: "",
    image_url: "",
    images: [] as string[],
    is_active: true,
    is_featured: false,
  })
  const [newImageUrl, setNewImageUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [operationInProgress, setOperationInProgress] = useState<string | null>(null)

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      sale_price: "",
      category_id: "",
      stock_quantity: "",
      unit: "piece",
      weight: "",
      image_url: "",
      images: [],
      is_active: true,
      is_featured: false,
    })
    setNewImageUrl("")
    setEditingProduct(null)
    setIsSubmitting(false)
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      sale_price: product.sale_price?.toString() || "",
      category_id: product.category_id || "",
      stock_quantity: product.stock_quantity.toString(),
      unit: product.unit,
      weight: product.weight || "",
      image_url: product.image_url || "",
      images: product.images || [],
      is_active: product.is_active,
      is_featured: product.is_featured,
    })
    setNewImageUrl("")
    setIsDialogOpen(true)
  }

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
        // Set as primary image if it's the first one
        image_url: prev.images.length === 0 ? newImageUrl.trim() : prev.image_url,
      }))
      setNewImageUrl("")
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index)
      return {
        ...prev,
        images: newImages,
        // Update primary image if removed
        image_url: index === 0 && newImages.length > 0 ? newImages[0] : prev.image_url,
      }
    })
  }

  const setPrimaryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      image_url: prev.images[index],
    }))
  }

  const handleSubmit = async () => {
    // Prevent multiple submissions
    if (isSubmitting) {
      return
    }
    
    if (!formData.name || !formData.price || !formData.stock_quantity) {
      toast.error("Please fill in all required fields")
      return
    }
    
    setIsSubmitting(true)
    
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setIsSubmitting(false)
      toast.error("Request timed out. Please try again.")
    }, 15000)
    
    try {
      const supabase = createClient()

      const productData = {
        name: formData.name,
        description: formData.description || null,
        price: Number.parseFloat(formData.price),
        sale_price: formData.sale_price ? Number.parseFloat(formData.sale_price) : null,
        category_id: formData.category_id || null,
        stock_quantity: Number.parseInt(formData.stock_quantity),
        unit: formData.unit,
        weight: formData.weight || null,
        image_url: formData.image_url || (formData.images.length > 0 ? formData.images[0] : null),
        images: formData.images,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
      }

      if (editingProduct) {
        const { error } = await supabase.from("products").update(productData).eq("id", editingProduct.id)
        
        clearTimeout(timeoutId)

        if (error) {
          toast.error("Failed to update product: " + error.message)
          setIsSubmitting(false)
          return
        }

        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? { ...p, ...productData, category: categories.find((c) => c.id === productData.category_id) }
              : p,
          ),
        )
        toast.success("Product updated successfully")
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert(productData)
          .select("*, category:categories(*)")
          .single()
        
        clearTimeout(timeoutId)

        if (error) {
          toast.error("Failed to create product: " + error.message)
          setIsSubmitting(false)
          return
        }

        setProducts((prev) => [data as Product, ...prev])
        toast.success("Product created successfully")
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

  const toggleProductStatus = async (productId: string, isActive: boolean) => {
    if (operationInProgress) return
    setOperationInProgress(productId)
    
    try {
      const supabase = createClient()
      const { error } = await supabase.from("products").update({ is_active: isActive }).eq("id", productId)

      if (error) {
        toast.error("Failed to update product status: " + error.message)
        return
      }

      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, is_active: isActive } : p)))
      toast.success(`Product ${isActive ? "activated" : "deactivated"}`)
    } catch (err) {
      toast.error("An error occurred")
    } finally {
      setOperationInProgress(null)
    }
  }

  const deleteProduct = async (productId: string) => {
    if (operationInProgress) return
    setOperationInProgress(productId)
    
    try {
      const supabase = createClient()
      const { error } = await supabase.from("products").delete().eq("id", productId)

      if (error) {
        toast.error("Failed to delete product: " + error.message)
        return
      }

      setProducts((prev) => prev.filter((p) => p.id !== productId))
      toast.success("Product deleted successfully")
    } catch (err) {
      toast.error("An error occurred")
    } finally {
      setOperationInProgress(null)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="flex h-16 shrink-0 items-center gap-2 bg-white border-b border-gray-200 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold text-gray-900">Products</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <Card className="bg-white shadow-sm border-gray-200">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-gray-900">All Products ({filteredProducts.length})</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <Button
                  onClick={() => {
                    resetForm()
                    setIsDialogOpen(true)
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="text-gray-600">Product</TableHead>
                  <TableHead className="text-gray-600">Category</TableHead>
                  <TableHead className="text-gray-600">Price</TableHead>
                  <TableHead className="text-gray-600">Stock</TableHead>
                  <TableHead className="text-gray-600">Images</TableHead>
                  <TableHead className="text-gray-600">Status</TableHead>
                  <TableHead className="text-right text-gray-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="border-gray-100 hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                            <Image
                              src={
                                product.image_url ||
                                `/placeholder.svg?height=48&width=48&query=${encodeURIComponent(product.name) || "/placeholder.svg"}`
                              }
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.weight || product.unit}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-gray-200 text-gray-600">
                          {product.category?.name || "Uncategorized"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">AED {product.price.toFixed(2)}</p>
                          {product.sale_price && (
                            <p className="text-xs text-emerald-600">Sale: AED {product.sale_price.toFixed(2)}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            product.stock_quantity > 5 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                          }
                        >
                          {product.stock_quantity} in stock
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-gray-200 text-gray-600">
                          {product.images?.length || (product.image_url ? 1 : 0)} images
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            product.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                          }
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                              <MoreHorizontal className="h-4 w-4 text-gray-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white border-gray-200">
                            <DropdownMenuItem onSelect={() => openEditDialog(product)} className="text-gray-700">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => toggleProductStatus(product.id, !product.is_active)}
                              className="text-gray-700"
                            >
                              {product.is_active ? (
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
                            <DropdownMenuItem className="text-red-600" onSelect={() => deleteProduct(product.id)}>
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

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription className="text-gray-500">
              {editingProduct ? "Update product details below" : "Fill in the product details below"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-gray-700">
                Product Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter product name"
                className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Enter product description"
                rows={3}
                className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price" className="text-gray-700">
                  Price (AED) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sale_price" className="text-gray-700">
                  Sale Price (AED)
                </Label>
                <Input
                  id="sale_price"
                  type="number"
                  step="0.01"
                  value={formData.sale_price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sale_price: e.target.value }))}
                  placeholder="0.00"
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category" className="text-gray-700">
                  Category
                </Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}
                >
                  <SelectTrigger className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock" className="text-gray-700">
                  Stock Quantity *
                </Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stock_quantity: e.target.value }))}
                  placeholder="0"
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="unit" className="text-gray-700">
                  Unit
                </Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, unit: value }))}
                >
                  <SelectTrigger className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="piece">Piece</SelectItem>
                    <SelectItem value="kg">Kilogram</SelectItem>
                    <SelectItem value="g">Gram</SelectItem>
                    <SelectItem value="l">Liter</SelectItem>
                    <SelectItem value="ml">Milliliter</SelectItem>
                    <SelectItem value="pack">Pack</SelectItem>
                    <SelectItem value="box">Box</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="weight" className="text-gray-700">
                  Weight/Size
                </Label>
                <Input
                  id="weight"
                  value={formData.weight}
                  onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                  placeholder="e.g., 500g, 1L"
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid gap-3">
              <Label className="text-gray-700">Product Images</Label>

              {/* Add new image input */}
              <div className="flex gap-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Paste image URL here..."
                  className="flex-1 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                />
                <Button type="button" onClick={(e) => { e.preventDefault(); addImage(); }} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              {/* Image gallery preview */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-2">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <div
                        className={`relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 ${formData.image_url === img ? "border-emerald-500" : "border-transparent"}`}
                      >
                        <Image
                          src={img || "/placeholder.svg"}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="h-8 text-xs"
                          onClick={() => setPrimaryImage(index)}
                        >
                          Primary
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {formData.image_url === img && (
                        <div className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {formData.images.length === 0 && (
                <p className="text-sm text-gray-500">No images added yet. Add image URLs above.</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active" className="text-gray-700">
                  Active
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_featured: checked }))}
                />
                <Label htmlFor="is_featured" className="text-gray-700">
                  Featured
                </Label>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  resetForm()
                }}
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData.name || !formData.price || !formData.stock_quantity || isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isSubmitting ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
