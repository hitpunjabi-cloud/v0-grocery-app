"use client"

import { BannerSlider } from "@/components/banner-slider"
import { createClient } from "@/lib/supabase/client"
import type { Banner } from "@/lib/types"
import useSWR from "swr"

const defaultBanner: Banner = {
  id: "default",
  title: "Fresh Groceries Delivered",
  subtitle: "Same Day Delivery",
  description: "Shop premium fruits, vegetables, dairy and more",
  image_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&h=600&fit=crop",
  button_text: "Start Shopping",
  button_link: "/#products",
  text_color: "#ffffff",
  overlay_opacity: 0.5,
  display_order: 1,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const supabase = createClient()

const bannerFetcher = async () => {
  try {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Banner fetch error:", error)
      return [defaultBanner]
    }

    return data && data.length > 0 ? (data as Banner[]) : [defaultBanner]
  } catch (error) {
    console.error("Banner fetch exception:", error)
    return [defaultBanner]
  }
}

export function HeroBanner() {
  const { data: banners = [defaultBanner] } = useSWR("banners", bannerFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
    fallbackData: [defaultBanner],
  })

  return <BannerSlider banners={banners} />
}
