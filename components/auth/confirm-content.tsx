"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ConfirmContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const error = searchParams.get("error")
    const error_description = searchParams.get("error_description")

    if (error) {
      setStatus("error")
      setMessage(error_description || error || "Email verification failed")
      return
    }

    setStatus("success")
    setMessage("Your email has been verified successfully!")

    setTimeout(() => {
      router.push("/auth/login?verified=true")
    }, 3000)
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-8">
          {status === "loading" && (
            <>
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
              <p className="text-muted-foreground">Verifying your email...</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <p className="text-center text-green-600 font-medium">{message}</p>
              <p className="text-sm text-muted-foreground">Redirecting to login...</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="rounded-full bg-red-100 p-3">
                <XCircle className="h-16 w-16 text-red-600" />
              </div>
              <p className="text-center text-red-600 font-medium">{message}</p>
              <Button asChild className="mt-4">
                <Link href="/auth/login">Go to Login</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
