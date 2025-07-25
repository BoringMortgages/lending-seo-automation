import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Mortgage Rates in Hamilton, Ontario 2025 | Mortgage with Ford",
  description: "Compare the best mortgage rates in Hamilton with expert guidance from Andreina Ford. Get current rates, affordable housing insights, and Steel City market expertise.",
  keywords: "Hamilton mortgage rates, best mortgage rates Hamilton, Steel City mortgage broker, Hamilton home loan rates, Hamilton Ontario mortgage",
  openGraph: {
    title: "Best Mortgage Rates in Hamilton, Ontario 2025", 
    description: "Compare the best mortgage rates in Hamilton with expert guidance from Andreina Ford.",
    type: "article",
  },
};

export default function HamiltonMortgageRates() {
  const currentRates = [
    { term: "1 Year Fixed", rate: "6.34%", type: "Fixed" },
    { term: "2 Year Fixed", rate: "6.04%", type: "Fixed" },
    { term: "3 Year Fixed", rate: "5.89%", type: "Fixed" },
    { term: "5 Year Fixed", rate: "5.89%", type: "Fixed" },
    { term: "5 Year Variable", rate: "6.55%", type: "Variable" },
  ];

  const hamiltonInsights = [
    {
      title: "Average Home Price",
      value: "$778,000",
      description: "Based on RAHB data (Dec 2024)"
    },
    {
      title: "Minimum Down Payment",
      value: "$38,900",
      description: "5% on first $500K, 10% remainder"
    },
    {
      title: "Market Trend",
      value: "Growing City",
      description: "Tech and healthcare expansion"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Mortgage with Ford
              </h1>
              <span className="ml-3 text-sm text-gray-600">
                Making mortgages make sense
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="mailto:hello@mortgagewithford.ca"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Get Pre-Approved
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Best Mortgage Rates in Hamilton
            <span className="block text-3xl md:text-4xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mt-2">
              Steel City 2025
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Compare current mortgage rates in Hamilton with expert guidance from Andreina Ford. 
            Affordable housing opportunities and growing market potential in Ontario's Steel City.
          </p>
        </div>

        {/* Current Rates */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Current Hamilton Mortgage Rates
          </h2>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-orange-50">
                    <th className="p-4 text-left font-semibold text-gray-900">Term</th>
                    <th className="p-4 text-left font-semibold text-gray-900">Rate</th>
                    <th className="p-4 text-left font-semibold text-gray-900">Type</th>
                    <th className="p-4 text-left font-semibold text-gray-900">Payment (500K)</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRates.map((rate, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-orange-50">
                      <td className="p-4 font-semibold">{rate.term}</td>
                      <td className="p-4 text-2xl font-bold text-orange-600">{rate.rate}</td>
                      <td className="p-4">{rate.type}</td>
                      <td className="p-4 font-semibold">$2,895/month</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Rates updated daily • Based on $500,000 mortgage, 25-year amortization
              </p>
              <Link
                href="/mortgage-payment-calculator"
                className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Calculate Your Payment
              </Link>
            </div>
          </div>
        </section>

        {/* Hamilton Market Insights */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Hamilton Market Insights
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {hamiltonInsights.map((insight, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {insight.title}
                </h3>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {insight.value}
                </div>
                <p className="text-gray-600 text-sm">
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Hamilton Advantages */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">Why Hamilton is Hot</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">🏭 Economic Growth</h3>
                <ul className="space-y-2">
                  <li>• Tech companies relocating from Toronto</li>
                  <li>• McMaster University innovation hub</li>
                  <li>• Healthcare sector expansion</li>
                  <li>• GO Transit connectivity improvements</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">💰 Value Proposition</h3>
                <ul className="space-y-2">
                  <li>• 30% less expensive than Toronto</li>
                  <li>• Historic neighborhoods with character</li>
                  <li>• Waterfront redevelopment projects</li>
                  <li>• 1-hour commute to downtown Toronto</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Hamilton Mortgage FAQ
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Is Hamilton a good investment for real estate?
                </h3>
                <p className="text-gray-600">
                  Yes! Hamilton offers strong growth potential with tech companies moving in, 
                  McMaster University driving innovation, and continued GO Transit improvements 
                  making Toronto commutes easier.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  What's the difference in home prices between Hamilton and the GTA?
                </h3>
                <p className="text-gray-600">
                  Hamilton's average home price ($778K) is about 30% less than Toronto ($1.1M+) 
                  and 15% less than Mississauga ($924K), offering better value for families.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Are there unique mortgage programs for Hamilton buyers?
                </h3>
                <p className="text-gray-600">
                  While no city-specific programs exist, Hamilton buyers benefit from provincial 
                  first-time buyer incentives and often qualify for lower loan amounts due to 
                  affordable housing prices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gray-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Buy in Hamilton?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Get expert mortgage guidance for Steel City opportunities and growing market potential
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="mailto:hello@mortgagewithford.ca?subject=Hamilton Mortgage Inquiry"
                className="bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                Get Hamilton Rates
              </Link>
              <Link
                href="/mortgage-payment-calculator"
                className="border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                Calculate Payments
              </Link>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Other Ontario Cities
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/best-mortgage-rates-toronto" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h4 className="font-semibold text-blue-600">Toronto Mortgage Rates</h4>
              <p className="text-gray-600 text-sm">Premium GTA market rates</p>
            </Link>
            <Link href="/best-mortgage-rates-ottawa" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h4 className="font-semibold text-green-600">Ottawa Mortgage Rates</h4>
              <p className="text-gray-600 text-sm">Government employee programs</p>
            </Link>
            <Link href="/best-mortgage-rates-mississauga" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h4 className="font-semibold text-purple-600">Mississauga Mortgage Rates</h4>
              <p className="text-gray-600 text-sm">GTA West opportunities</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
} 