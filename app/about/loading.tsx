export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="h-16 bg-white border-b" />
      <div className="h-64 bg-emerald-100" />
      <div className="container px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="h-8 w-48 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-100 rounded" />
            <div className="h-4 bg-gray-100 rounded" />
            <div className="h-4 w-3/4 bg-gray-100 rounded" />
          </div>
          <div className="h-80 bg-gray-200 rounded-3xl" />
        </div>
      </div>
    </div>
  )
}
