export default function RiderLoading() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header Skeleton */}
      <header className="bg-primary text-primary-foreground">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-foreground/20 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-primary-foreground/20 rounded animate-pulse" />
              <div className="h-3 w-20 bg-primary-foreground/20 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 px-4 pb-4">
          <div className="h-16 rounded-xl bg-primary-foreground/10 animate-pulse" />
          <div className="h-16 rounded-xl bg-primary-foreground/10 animate-pulse" />
        </div>
      </header>

      {/* Content Skeleton */}
      <main className="p-4">
        <div className="h-10 w-full bg-muted rounded-lg animate-pulse mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-background rounded-xl animate-pulse" />
          ))}
        </div>
      </main>
    </div>
  )
}
