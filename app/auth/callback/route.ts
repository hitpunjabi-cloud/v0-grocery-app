import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)

  // Get all possible parameters
  const code = searchParams.get("code")
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type")
  const next = searchParams.get("next") ?? "/"
  const error = searchParams.get("error")
  const error_description = searchParams.get("error_description")

  // Handle error from Supabase
  if (error) {
    console.error("Auth callback error:", error, error_description)
    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(error_description || error)}`)
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Server Component context
          }
        },
      },
    },
  )

  try {
    if (token_hash && type) {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        token_hash,
        type: type as "email" | "signup" | "recovery" | "invite" | "magiclink" | "email_change",
      })

      if (verifyError) {
        console.error("Token verification error:", verifyError)
        return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(verifyError.message)}`)
      }

      if (data.user) {
        // Get user profile for role-based redirect
        const profile = await getProfileWithRetry(supabase, data.user.id)
        const redirectTo = getRedirectUrl(profile?.role, next)

        const redirectUrl = new URL(redirectTo, origin)
        redirectUrl.searchParams.set("verified", "true")
        return NextResponse.redirect(redirectUrl.toString())
      }
    }

    if (code) {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error("Code exchange error:", exchangeError)
        return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(exchangeError.message)}`)
      }

      if (data.user) {
        const profile = await getProfileWithRetry(supabase, data.user.id)
        const redirectTo = getRedirectUrl(profile?.role, next)

        const redirectUrl = new URL(redirectTo, origin)
        redirectUrl.searchParams.set("verified", "true")
        return NextResponse.redirect(redirectUrl.toString())
      }
    }
  } catch (err) {
    console.error("Auth callback exception:", err)
    return NextResponse.redirect(`${origin}/auth/login?error=An unexpected error occurred`)
  }

  // No valid auth params, redirect to login
  return NextResponse.redirect(`${origin}/auth/login`)
}

// Helper function to get profile with retry logic
async function getProfileWithRetry(supabase: any, userId: string, maxRetries = 3) {
  let profile = null
  let retries = maxRetries

  while (retries > 0 && !profile) {
    const { data: profileData } = await supabase.from("profiles").select("role").eq("id", userId).single()

    profile = profileData

    if (!profile && retries > 1) {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
    retries--
  }

  return profile
}

// Helper function to determine redirect URL based on role
function getRedirectUrl(role: string | undefined, defaultNext: string) {
  if (role === "admin") return "/admin"
  if (role === "rider") return "/rider"
  return defaultNext === "/" ? "/" : defaultNext
}
