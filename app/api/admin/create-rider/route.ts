import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password, full_name, phone } = await request.json()

    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: "Email, password, and full name are required" },
        { status: 400 }
      )
    }

    // Use Supabase Admin client with service role key to create user without email verification
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Create user with admin API - this auto-confirms the email
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email - no verification needed
      user_metadata: {
        full_name,
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Update the profile to set role as rider
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({
        full_name,
        phone: phone || null,
        role: "rider",
      })
      .eq("id", authData.user.id)

    if (profileError) {
      // User was created but profile update failed - log it but don't fail
      console.error("Profile update error:", profileError)
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
    })
  } catch (error) {
    console.error("Create rider error:", error)
    return NextResponse.json(
      { error: "An error occurred while creating rider" },
      { status: 500 }
    )
  }
}
