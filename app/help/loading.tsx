export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="h-16 bg-white border-b" />
      <div className="h-48 bg-blue-100" />
      <div className="container px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl">
              <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4" />
              <div className="h-5 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
