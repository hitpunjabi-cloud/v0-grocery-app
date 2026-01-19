import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const demoUsers = [
  {
    email: "admin@easygrocery.ae",
    password: "Easy@12345",
    role: "admin",
    full_name: "Admin User",
    phone: "+971501234567",
  },
  {
    email: "user@easygrocery.ae",
    password: "Easy@12345",
    role: "customer",
    full_name: "Demo Customer",
    phone: "+971502345678",
  },
  {
    email: "rider@easygrocery.ae",
    password: "Easy@12345",
    role: "rider",
    full_name: "Demo Rider",
    phone: "+971503456789",
  },
]

async function createDemoUsers() {
  console.log("Creating demo users...")

  for (const user of demoUsers) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        full_name: user.full_name,
        role: user.role,
      },
    })

    if (error) {
      if (error.message.includes("already been registered")) {
        console.log(`User ${user.email} already exists, updating profile...`)

        const { data: existingUsers } = await supabase.auth.admin.listUsers()
        const existingUser = existingUsers?.users?.find((u) => u.email === user.email)

        if (existingUser) {
          await supabase.from("profiles").upsert(
            {
              id: existingUser.id,
              full_name: user.full_name,
              phone: user.phone,
              role: user.role,
            },
            { onConflict: "id" },
          )
          console.log(`Updated profile for ${user.email}`)
        }
      } else {
        console.error(`Error creating ${user.email}:`, error.message)
      }
    } else {
      console.log(`Created user: ${user.email} with role: ${user.role}`)

      await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          full_name: user.full_name,
          phone: user.phone,
          role: user.role,
        },
        { onConflict: "id" },
      )
      console.log(`Created profile for ${user.email}`)
    }
  }

  console.log("\nDemo users setup complete!")
  console.log("\nCredentials:")
  console.log("Admin: admin@easygrocery.ae / Easy@12345")
  console.log("Customer: user@easygrocery.ae / Easy@12345")
  console.log("Rider: rider@easygrocery.ae / Easy@12345")
}

createDemoUsers()
