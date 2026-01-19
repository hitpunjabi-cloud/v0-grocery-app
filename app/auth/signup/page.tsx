import Link from "next/link"
import { SignupForm } from "@/components/auth/signup-form"
import { Truck, Leaf, Star } from "lucide-react"

export default function SignupPage() {
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
            Join Our
            <br />
            <span className="text-emerald-100">Growing Family</span>
          </h2>

          <p className="text-emerald-100 text-lg mb-10 max-w-md">
            Create an account and enjoy fresh groceries delivered to your doorstep with exclusive member benefits.
          </p>

          {/* Benefits */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Exclusive Offers</p>
                <p className="text-emerald-100 text-sm">Get member-only discounts and deals</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Free Delivery</p>
                <p className="text-emerald-100 text-sm">On orders above AED 100</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">100% Fresh Guarantee</p>
                <p className="text-emerald-100 text-sm">Or your money back</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
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
            <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
            <p className="text-gray-500 mt-1">Join Easy Grocery for fresh groceries delivered fast</p>
          </div>

          <SignupForm />

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
