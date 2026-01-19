"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bike, Plus, Search, MoreHorizontal, Phone, Trash2, UserCog, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/lib/types"

interface RiderWithCount extends Profile {
  order_count: number
}

interface AdminRidersPageProps {
  riders: RiderWithCount[]
}

export function AdminRidersPage({ riders: initialRiders }: AdminRidersPageProps) {
  const router = useRouter()
  const [riders, setRiders] = useState(initialRiders)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRider, setSelectedRider] = useState<RiderWithCount | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [newRider, setNewRider] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
  })

  const filteredRiders = riders.filter((rider) => {
    const matchesSearch =
      rider.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || rider.phone?.includes(searchQuery)
    return matchesSearch
  })

  const handleAddRider = async () => {
    if (!newRider.email || !newRider.password || !newRider.full_name) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    
    try {
      // Use server action to create rider with auto-confirm (no email verification)
      const response = await fetch("/api/admin/create-rider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newRider.email,
          password: newRider.password,
          full_name: newRider.full_name,
          phone: newRider.phone,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || "Failed to create rider")
        setIsLoading(false)
        return
      }

      // Add to local state
      setRiders((prev) => [
        {
          id: result.user.id,
          full_name: newRider.full_name,
          phone: newRider.phone,
          role: "rider" as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          order_count: 0,
        },
        ...prev,
      ])

      toast.success("Rider added successfully - they can login immediately")
      setIsAddDialogOpen(false)
      setNewRider({ email: "", password: "", full_name: "", phone: "" })
      router.refresh()
    } catch (error) {
      toast.error("An error occurred while creating rider")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteRider = async () => {
    if (!selectedRider) return

    setIsLoading(true)
    const supabase = createClient()

    // Change role to customer instead of deleting
    const { error } = await supabase.from("profiles").update({ role: "customer" }).eq("id", selectedRider.id)

    if (error) {
      toast.error("Failed to remove rider")
      setIsLoading(false)
      return
    }

    setRiders((prev) => prev.filter((r) => r.id !== selectedRider.id))
    toast.success("Rider removed successfully")
    setIsDeleteDialogOpen(false)
    setSelectedRider(null)
    setIsLoading(false)
    router.refresh()
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Riders</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bike className="h-5 w-5" />
                All Riders ({filteredRiders.length})
              </CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search riders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rider
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rider</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Total Deliveries</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRiders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No riders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRiders.map((rider) => (
                    <TableRow key={rider.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {rider.full_name?.charAt(0) || "R"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{rider.full_name || "Unnamed Rider"}</p>
                            <p className="text-xs text-muted-foreground">ID: {rider.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {rider.phone ? (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {rider.phone}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{rider.order_count} orders</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(rider.created_at).toLocaleDateString("en-AE", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <UserCog className="h-4 w-4 mr-2" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                setSelectedRider(rider)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Rider
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

      {/* Add Rider Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Rider</DialogTitle>
            <DialogDescription>Create a new rider account for deliveries.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={newRider.full_name}
                onChange={(e) => setNewRider({ ...newRider, full_name: e.target.value })}
                placeholder="Enter rider's full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newRider.email}
                onChange={(e) => setNewRider({ ...newRider, email: e.target.value })}
                placeholder="rider@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={newRider.password}
                onChange={(e) => setNewRider({ ...newRider, password: e.target.value })}
                placeholder="Min 6 characters"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={newRider.phone}
                onChange={(e) => setNewRider({ ...newRider, phone: e.target.value })}
                placeholder="+971 50 000 0000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRider} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Rider"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Rider</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedRider?.full_name} as a rider? Their account will be converted to
              a regular customer account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRider} disabled={isLoading}>
              {isLoading ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
