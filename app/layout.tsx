import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { CartProvider } from "@/components/cart-provider"
import { AuthProvider } from "@/components/auth-provider"
import { PageLoader } from "@/components/page-loader"
import { InitialLoader } from "@/components/initial-loader"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Easy Grocery | Fresh Groceries Delivered in Dubai",
  description:
    "Order fresh groceries online and get fast delivery across Dubai. Shop fruits, vegetables, dairy, bakery, and more at Easy Grocery.",
  generator: "v0.app",
  keywords: ["grocery", "delivery", "Dubai", "UAE", "fresh", "vegetables", "fruits", "online shopping"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Easy Grocery",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.jpg", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.jpg", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-icon-180.jpg", sizes: "180x180", type: "image/png" }],
  },
}

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased`}>
        <InitialLoader />
        <PageLoader />
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster position="bottom-center" />
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
