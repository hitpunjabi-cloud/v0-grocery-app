import { Suspense } from "react"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { Loader2, ShoppingBag, Truck, Shield, Clock } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding & Graphics (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating circles */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-white/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <Link href="/" className="flex items-center gap-3 mb-12 hover:opacity-90 transition-opacity">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg">
              <span className="text-2xl font-bold text-emerald-600">E</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Easy Grocery</h1>
              <div className="h-1 w-16 bg-white/50 rounded-full mt-1" />
            </div>
          </Link>

          {/* Main heading */}
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Fresh Groceries
            <br />
            <span className="text-emerald-100">Delivered to Your Door</span>
          </h2>

          <p className="text-emerald-100 text-lg mb-10 max-w-md">
            Shop from thousands of products and get them delivered in as little as 30 minutes.
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Free Delivery</p>
                <p className="text-emerald-100 text-xs">Orders over AED 100</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">30 Min Express</p>
                <p className="text-emerald-100 text-xs">Lightning fast delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">5000+ Products</p>
                <p className="text-emerald-100 text-xs">Wide variety</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">100% Fresh</p>
                <p className="text-emerald-100 text-xs">Quality guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo (hidden on desktop) */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 shadow-lg">
                <span className="text-xl font-bold text-white">E</span>
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-gray-900">Easy Grocery</h1>
                <div className="h-0.5 w-12 bg-emerald-500 rounded-full" />
              </div>
            </Link>
          </div>

          {/* Welcome text */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-1">Sign in to your account to continue</p>
          </div>

          <Suspense
            fallback={
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>

          {/* Demo Credentials */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 text-sm shadow-sm">
            <p className="font-semibold text-gray-900 mb-3">Demo Credentials</p>
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <span className="font-medium text-emerald-600">Admin</span>
                <span className="text-xs">admin@easygrocery.ae / Easy@12345</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <span className="font-medium text-emerald-600">Customer</span>
                <span className="text-xs">user@easygrocery.ae / Easy@12345</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <span className="font-medium text-emerald-600">Rider</span>
                <span className="text-xs">rider@easygrocery.ae / Easy@12345</span>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don{"'"}t have an account?{" "}
            <Link href="/auth/signup" className="text-emerald-600 hover:text-emerald-700 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
