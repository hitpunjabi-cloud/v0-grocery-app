import { Suspense } from "react"
import { ConfirmContent } from "@/components/auth/confirm-content"
import { Loader2 } from "lucide-react"

export const dynamic = "force-dynamic"

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ConfirmContent />
    </Suspense>
  )
}
