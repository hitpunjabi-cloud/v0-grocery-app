export interface Category {
  id: string
  name: string
  name_ar?: string
  slug: string
  image_url?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  name_ar?: string
  description?: string
  description_ar?: string
  price: number
  sale_price?: number
  image_url?: string
  images?: string[]
  category_id?: string
  category?: Category
  stock_quantity: number
  unit: string
  weight?: string
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  full_name?: string
  phone?: string
  role: "customer" | "admin" | "rider"
  created_at: string
  updated_at: string
}

export interface Address {
  id: string
  user_id: string
  label: string
  street: string
  building?: string
  apartment?: string
  area: string
  city: string
  emirate: string
  landmark?: string
  is_default: boolean
  created_at: string
}

export interface Order {
  id: string
  order_number: string
  user_id: string
  status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled"
  subtotal: number
  delivery_fee: number
  discount: number
  total: number
  delivery_address: Address
  payment_method: "cod" | "card"
  payment_status: "pending" | "paid" | "failed"
  notes?: string
  rider_id?: string
  estimated_delivery?: string
  delivered_at?: string
  created_at: string
  updated_at: string
  items?: OrderItem[]
  customer_name?: string
  customer_email?: string
  customer_phone?: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id?: string
  product_name: string
  product_image?: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Banner {
  id: string
  title: string
  subtitle?: string
  description?: string
  image_url: string
  button_text: string
  button_link: string
  text_color: string
  overlay_opacity: number
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}
