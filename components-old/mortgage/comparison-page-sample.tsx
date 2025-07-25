import React from 'react';
import { Phone, Mail, MapPin, Star, Shield, Clock, CheckCircle, XCircle } from 'lucide-react';

const ComparisonPageSample = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Branding */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AF</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Andreina Ford</h1>
                <p className="text-sm text-gray-600">Mortgage Agent Level 2 | BRX Mortgage FSRA #13463</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                <span>613-743-7866</span>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Free Consultation
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">TD Bank vs RBC Mortgage Comparison 2025</h1>
            <p className="text-xl text-blue-100 mb-8">Compare rates, features, and find the best mortgage for your Ontario home</p>
            
            {/* Current Rates Preview */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">TD</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">TD Bank</h3>
                <p className="text-3xl font-bold">5.79%</p>
                <p className="text-blue-100">5-Year Fixed Rate</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">RBC</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">RBC Royal Bank</h3>
                <p className="text-3xl font-bold">5.84%</p>
                <p className="text-blue-100">5-Year Fixed Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Comparison */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Quick Comparison Overview</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* TD Bank */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold">TD</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">TD Bank</h3>
                  <p className="text-gray-600">Big Six Bank</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">✓ Pros</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Extensive branch network across Canada</li>
                    <li>• Comprehensive banking services</li>
                    <li>• Established reputation and stability</li>
                    <li>• Portable mortgage options</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">✗ Cons</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• May have higher rates than monoline lenders</li>
                    <li>• Stricter qualification requirements</li>
                    <li>• Less flexibility in underwriting</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Best for: Full-service banking
                  </span>
                </div>
              </div>
            </div>

            {/* RBC */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white font-bold">RBC</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">RBC Royal Bank</h3>
                  <p className="text-gray-600">Big Six Bank</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">✓ Pros</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Largest bank in Canada</li>
                    <li>• Strong digital banking platform</li>
                    <li>• Comprehensive mortgage products</li>
                    <li>• Cashback mortgage options</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">✗ Cons</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Higher rates compared to monoline lenders</li>
                    <li>• Rigid qualification criteria</li>
                    <li>• Limited negotiation on rates</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Best for: Digital-first borrowers
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Rate Comparison */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Current Mortgage Rates Comparison</h2>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Mortgage Term</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">TD Bank</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">RBC</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Winner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">5-Year Fixed</td>
                    <td className="px-6 py-4 text-center text-lg font-bold text-green-600">5.79%</td>
                    <td className="px-6 py-4 text-center text-lg font-bold text-blue-600">5.84%</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        TD Bank
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Variable Rate</td>
                    <td className="px-6 py-4 text-center text-lg font-bold text-green-600">6.45%</td>
                    <td className="px-6 py-4 text-center text-lg font-bold text-blue-600">6.50%</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        TD Bank
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">3-Year Fixed</td>
                    <td className="px-6 py-4 text-center text-lg font-bold text-green-600">5.69%</td>
                    <td className="px-6 py-4 text-center text-lg font-bold text-blue-600">5.74%</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        TD Bank
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="bg-yellow-50 border-t border-yellow-200 px-6 py-4">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Rate Disclaimer</p>
                  <p className="text-yellow-700 mt-1">
                    Rates shown are posted rates and subject to change. Actual rates may vary based on your credit profile, 
                    down payment, and other factors. Contact Andreina Ford for personalized rate quotes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Insights */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 rounded-xl p-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">AF</span>
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Analysis from Andreina Ford</h3>
                <p className="text-gray-700 mb-4">
                  "As a licensed mortgage broker serving Ontario families, I've worked with both TD and RBC extensively. 
                  While TD currently offers slightly better rates, RBC's digital platform and cashback options can be 
                  attractive for tech-savvy borrowers. The choice often comes down to your banking relationship preferences 
                  and long-term financial goals."
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Mortgage Agent Level 2 - BRX Mortgage FSRA #13463 | License #M2400357</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Choose the Right Mortgage?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Get personalized advice and exclusive rates not available to the public
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <Phone className="w-8 h-8 text-white mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Call Direct</h3>
              <p className="text-blue-100 text-sm mb-3">Speak with Andreina directly</p>
              <a href="tel:613-743-7866" className="text-white font-medium hover:underline">
                613-743-7866
              </a>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <Mail className="w-8 h-8 text-white mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Email Consultation</h3>
              <p className="text-blue-100 text-sm mb-3">Get detailed rate comparison</p>
              <a href="mailto:andreina@mortgagewithford.ca" className="text-white font-medium hover:underline">
                andreina@mortgagewithford.ca
              </a>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <Clock className="w-8 h-8 text-white mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Free 15-Min Call</h3>
              <p className="text-blue-100 text-sm mb-3">Quick mortgage assessment</p>
              <a href="https://callme.mortgagewithford.ca" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block">
                Book Now
              </a>
            </div>
          </div>
          
          <p className="text-blue-100 text-sm">
            Licensed in Ontario | BRX Mortgage FSRA #13463 | License #M2400357
          </p>
        </div>
      </section>

      {/* Footer with Compliance */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AF</span>
                </div>
                <span className="font-bold">Andreina Ford</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Making mortgage decisions make sense for Ontario families.
              </p>
              <div className="flex items-center text-sm text-gray-400">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Serving all of Ontario, Canada</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>First-Time Buyer Programs</li>
                <li>Mortgage Renewals</li>
                <li>Refinancing</li>
                <li>Investment Properties</li>
                <li>Self-Employed Mortgages</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Mortgage Calculator</li>
                <li>Rate Comparisons</li>
                <li>First-Time Buyer Guide</li>
                <li>Mortgage Blog</li>
                <li>FAQ</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>613-743-7866</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>andreina@mortgagewithford.ca</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <div className="text-sm text-gray-400 space-y-2">
              <p>
                <strong>Andreina Ford</strong> - Mortgage Agent Level 2 | BRX Mortgage FSRA #13463
              </p>
              <p>
                License #M2400357 | Licensed under the Mortgage Brokerages, Lenders and Administrators Act, 2006
              </p>
              <p>
                This is not an offer to lend. All rates and information are subject to change without notice. 
                Terms and conditions apply. Rates shown are for comparison purposes only.
              </p>
              <p>
                Visit: <a href="https://mortgagewithford.ca" className="text-blue-400 hover:underline">mortgagewithford.ca</a> | 
                <a href="https://maincharactermortgage.ca" className="text-blue-400 hover:underline ml-1">maincharactermortgage.ca</a>
              </p>
              <p className="pt-4">
                © 2025 Andreina Ford Mortgage Services. Privacy Policy | Terms of Service | Accessibility
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ComparisonPageSample;