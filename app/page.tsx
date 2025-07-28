'use client';

import Link from "next/link";
import { useState } from "react";
import ContactForm from "../components/ContactForm";

export default function Home() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">B</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Boring Mortgages Ontario
                  </h1>
                  <p className="text-sm text-gray-600">Making complex mortgages boringly simple</p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/blog" className="text-gray-600 hover:text-gray-900 font-medium">Blog</Link>
              <Link href="/youtube-playbook" className="text-gray-600 hover:text-gray-900 font-medium">Mortgage Playbook</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900 font-medium">About</Link>
              <button
                onClick={() => setIsContactFormOpen(true)}
                className="bg-gradient-to-r from-slate-600 to-slate-800 text-white px-6 py-2 rounded-lg hover:from-slate-700 hover:to-slate-900 transition-all font-medium"
              >
                Get Expert Help →
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 bg-slate-100 rounded-full text-sm font-medium text-slate-700 mb-4">
              🇨🇦 Licensed in Ontario
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Ontario's Most 
            <span className="block bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">
              Boring Mortgage Site
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
            No flashy gimmicks. No confusing jargon. Just the <strong>boring details</strong> that help you 
            compare rates, calculate payments, and save thousands on your Ontario mortgage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/mortgage-payment-calculator"
              className="bg-gradient-to-r from-slate-600 to-slate-800 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-slate-700 hover:to-slate-900 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Calculate Payments
            </Link>
            <Link
              href="/mortgage-affordability-calculator"
              className="border-2 border-slate-600 text-slate-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-slate-50 transition-all"
            >
              Check Affordability
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Free Tools</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Current 2025 Rates</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Ontario Licensed</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>FSRA Regulated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Current Rates Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Current Ontario Mortgage Rates
            </h2>
            <p className="text-lg text-gray-600">
              Current rates updated regularly
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Term</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Fixed Rate</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Variable Rate</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium">1 Year</td>
                    <td className="py-4 px-4 text-2xl font-bold text-blue-600">4.69%</td>
                    <td className="py-4 px-4 text-gray-400">—</td>
                    <td className="py-4 px-4 text-sm text-gray-600">Rate speculation</td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium">3 Year</td>
                    <td className="py-4 px-4 text-2xl font-bold text-blue-600">3.94%</td>
                    <td className="py-4 px-4 text-gray-400">—</td>
                    <td className="py-4 px-4 text-sm text-gray-600">Medium-term security</td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50 bg-blue-50">
                    <td className="py-4 px-4 font-medium">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mr-2">
                        POPULAR
                      </span>
                      5 Year
                    </td>
                    <td className="py-4 px-4 text-2xl font-bold text-blue-600">3.94%</td>
                    <td className="py-4 px-4 text-2xl font-bold text-green-600">3.95%</td>
                    <td className="py-4 px-4 text-sm text-gray-600">Most Canadians</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium">Variable</td>
                    <td className="py-4 px-4 text-gray-400">—</td>
                    <td className="py-4 px-4 text-2xl font-bold text-green-600">Prime - 1.00%</td>
                    <td className="py-4 px-4 text-sm text-gray-600">Rate optimists</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Boring but important:</strong> Rates shown are best available for insured mortgages with 25-year amortization. 
                Your rate depends on credit score, down payment, and property location.
              </p>
              <button 
                onClick={() => setIsContactFormOpen(true)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Get your personalized rate quote from Andreina Ford →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Tools Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Boring (But Useful) Mortgage Calculators
            </h2>
            <p className="text-lg text-gray-600">
              Professional tools to help you make boringly smart mortgage decisions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link
              href="/mortgage-payment-calculator"
              className="group bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl hover:shadow-lg transition-all border border-blue-200 hover:border-blue-300"
            >
              <div className="text-blue-600 mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-800">
                Payment Calculator
              </h3>
              <p className="text-gray-600 mb-4">
                Calculate monthly payments with taxes, insurance, and CMHC premiums
              </p>
              <div className="text-sm text-blue-600 font-medium">
                Most comprehensive tool →
              </div>
            </Link>

            <Link
              href="/mortgage-affordability-calculator"
              className="group bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl hover:shadow-lg transition-all border border-green-200 hover:border-green-300"
            >
              <div className="text-green-600 mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-800">
                Affordability Calculator
              </h3>
              <p className="text-gray-600 mb-4">
                Discover your maximum purchase price using GDS and TDS ratios
              </p>
              <div className="text-sm text-green-600 font-medium">
                Use Canadian guidelines →
              </div>
            </Link>

            <Link
              href="/heloc-payment-calculator"
              className="group bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl hover:shadow-lg transition-all border border-purple-200 hover:border-purple-300"
            >
              <div className="text-purple-600 mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-purple-800">
                HELOC Calculator
              </h3>
              <p className="text-gray-600 mb-4">
                Calculate Home Equity Line of Credit payments and utilization
              </p>
              <div className="text-sm text-purple-600 font-medium">
                Access home equity →
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Location-Based Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ontario Mortgage Rates by City
            </h2>
            <p className="text-lg text-gray-600">
              Local market insights and current rates for major Ontario cities
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { city: "Toronto", rate: "3.94%", avgPrice: "$1.14M", description: "GTA's largest market" },
              { city: "Ottawa", rate: "3.99%", avgPrice: "$687K", description: "Government employee programs" },
              { city: "Mississauga", rate: "3.94%", avgPrice: "$924K", description: "First-time buyer friendly" },
              { city: "Hamilton", rate: "4.04%", avgPrice: "$778K", description: "Growing tech hub" }
            ].map((location) => (
              <Link
                key={location.city}
                href={`/best-mortgage-rates-${location.city.toLowerCase()}`}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all border group"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                  {location.city}
                </h3>
                <p className="text-2xl font-bold text-blue-600 mb-1">
                  {location.rate}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Best 5-year fixed rate
                </p>
                <div className="border-t pt-2 mt-2">
                  <p className="text-xs text-gray-600">Avg. home: {location.avgPrice}</p>
                  <p className="text-xs text-gray-500">{location.description}</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Need rates for your specific city? We cover all major Ontario markets.
            </p>
            <Link 
              href="/ontario-cities" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View all Ontario cities →
            </Link>
          </div>
        </div>
      </section>

      {/* Blog & Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Boring Blog + YouTube Playbook
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Deep-dive mortgage education that actually makes sense. No fluff, no sales pitches. 
                Just the boring details that help you make better decisions.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Mortgage Playbook (YouTube)</h3>
                    <p className="text-sm text-gray-600">Short audiobook-style mortgage education</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2V3a2 2 0 012-2 2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Weekly Blog Posts</h3>
                    <p className="text-sm text-gray-600">Market updates, tips, and mortgage insights</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/blog"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                >
                  Read the Blog
                </Link>
                <Link
                  href="/youtube-playbook"
                  className="border border-red-600 text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors text-center"
                >
                  📺 Watch Playbook
                </Link>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Latest from the Boring Blog
              </h3>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <Link href="/blog/2025-rate-predictions" className="block hover:text-blue-600">
                    <h4 className="font-medium text-gray-900 mb-1">
                      2025 Mortgage Rate Predictions: The Boring Truth
                    </h4>
                    <p className="text-sm text-gray-600">
                      What the experts won't tell you about where rates are heading...
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Jan 15, 2025</p>
                  </Link>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <Link href="/blog/first-time-buyer-mistakes" className="block hover:text-blue-600">
                    <h4 className="font-medium text-gray-900 mb-1">
                      5 Boring Mistakes First-Time Buyers Make
                    </h4>
                    <p className="text-sm text-gray-600">
                      Simple oversights that cost thousands...
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Jan 12, 2025</p>
                  </Link>
                </div>
                <div>
                  <Link href="/blog/heloc-vs-refinance" className="block hover:text-blue-600">
                    <h4 className="font-medium text-gray-900 mb-1">
                      HELOC vs Refinance: A Boring Comparison
                    </h4>
                    <p className="text-sm text-gray-600">
                      When each option makes sense for your situation...
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Jan 10, 2025</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-slate-600 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready for Expert (Non-Boring) Help?
          </h2>
          <p className="text-xl text-slate-200 mb-8">
            Our tools give you the boring details. When you're ready for personalized guidance, 
            connect with <strong>Andreina Ford</strong> - Licensed Mortgage Agent Level 2 in Ontario.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsContactFormOpen(true)}
              className="bg-white text-slate-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Expert Consultation
            </button>
            <Link
              href="mailto:hello@mortgagewithford.ca"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-slate-800 transition-colors"
            >
              Send a Quick Email
            </Link>
          </div>
          <p className="text-slate-300 text-sm mt-4">
            Licensed in Ontario • BRX Mortgage FSRA #13463 • M24000357
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-slate-400 to-slate-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">B</span>
                </div>
                <h3 className="text-lg font-semibold">Boring Mortgages Ontario</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Making complex mortgages boringly simple for Ontario residents.
                <br />Not affiliated with any specific lender.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Free Calculators</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/mortgage-payment-calculator" className="hover:text-white">Payment Calculator</Link></li>
                <li><Link href="/mortgage-affordability-calculator" className="hover:text-white">Affordability Calculator</Link></li>
                <li><Link href="/heloc-payment-calculator" className="hover:text-white">HELOC Calculator</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Ontario Cities</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/best-mortgage-rates-toronto" className="hover:text-white">Toronto</Link></li>
                <li><Link href="/best-mortgage-rates-ottawa" className="hover:text-white">Ottawa</Link></li>
                <li><Link href="/best-mortgage-rates-mississauga" className="hover:text-white">Mississauga</Link></li>
                <li><Link href="/best-mortgage-rates-hamilton" className="hover:text-white">Hamilton</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Content & Help</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/blog" className="hover:text-white">Boring Blog</Link></li>
                <li><Link href="/youtube-playbook" className="hover:text-white">YouTube Playbook</Link></li>
                <li><button onClick={() => setIsContactFormOpen(true)} className="hover:text-white text-left">Expert Consultation</button></li>
                <li><Link href="/about" className="hover:text-white">About</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                              <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} Boring Mortgages Ontario. Making mortgages boringly simple.
                </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy</Link>
                <Link href="/terms" className="text-gray-400 hover:text-white text-sm">Terms</Link>
                <Link href="/disclaimer" className="text-gray-400 hover:text-white text-sm">Disclaimer</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      <ContactForm 
        isOpen={isContactFormOpen} 
        onClose={() => setIsContactFormOpen(false)} 
      />
    </div>
  );
}
