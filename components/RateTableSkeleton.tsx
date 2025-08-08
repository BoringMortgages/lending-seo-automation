export default function RateTableSkeleton() {
  return (
    <div className="w-full rate-table-container animate-pulse">
      {/* Desktop skeleton */}
      <div className="hidden md:block">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 text-sm font-medium w-2/5">
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium w-1/5">
                <div className="h-4 bg-gray-300 rounded w-12"></div>
              </th>
              <th className="text-center py-3 px-4 text-sm font-medium w-2/5">
                <div className="h-4 bg-gray-300 rounded w-16 mx-auto"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="border-b">
                <td className="py-4 px-4">
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-300 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="h-8 bg-gray-300 rounded w-24 mx-auto"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile skeleton */}
      <div className="md:hidden space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex justify-between items-start mb-3">
              <div className="space-y-2">
                <div className="h-5 bg-gray-300 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="text-right space-y-1">
                <div className="h-6 bg-gray-300 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div className="h-8 bg-gray-300 rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}