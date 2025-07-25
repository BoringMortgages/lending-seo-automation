interface ComparisonData {
  lender: string;
  apr: string;
  amount: string;
  term: string;
  rating: number;
  bestFor: string;
}

export default function ComparisonTable({ data }: { data: ComparisonData[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-3 text-left">Lender</th>
            <th className="border border-gray-300 p-3 text-left">APR Range</th>
            <th className="border border-gray-300 p-3 text-left">Loan Amount</th>
            <th className="border border-gray-300 p-3 text-left">Terms</th>
            <th className="border border-gray-300 p-3 text-left">Rating</th>
            <th className="border border-gray-300 p-3 text-left">Best For</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-3 font-semibold">{item.lender}</td>
              <td className="border border-gray-300 p-3">{item.apr}</td>
              <td className="border border-gray-300 p-3">{item.amount}</td>
              <td className="border border-gray-300 p-3">{item.term}</td>
              <td className="border border-gray-300 p-3">
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">
                    {'★'.repeat(Math.floor(item.rating))}
                  </span>
                  {item.rating}
                </div>
              </td>
              <td className="border border-gray-300 p-3">{item.bestFor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
  