export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="h-16 bg-white border-b" />

      {/* Breadcrumb skeleton */}
      <div className="bg-white border-b">
        <div className="container px-4 py-4">
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="container px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar skeleton */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl p-4 space-y-3">
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-4" />
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-11 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          </aside>

          {/* Main content skeleton */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="flex gap-2">
                <div className="h-10 w-10 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-10 w-10 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                  <div className="aspect-square bg-gray-100 rounded-xl mb-3" />
                  <div className="h-4 bg-gray-100 rounded mb-2" />
                  <div className="h-4 w-2/3 bg-gray-100 rounded mb-3" />
                  <div className="h-8 bg-gray-100 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
