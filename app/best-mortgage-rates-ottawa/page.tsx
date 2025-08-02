"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import ContactForm from "../../components/ContactForm";
import MortgageCalculator from "../../components/calculators/MortgageCalculator";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Button from "../../components/ui/Button";
import { CMHC_RULES, getBestFor, type MortgageRate } from "../../lib/constants/cmhc";



// Metadata moved to layout.tsx or handled via Head component for client components

export default function OttawaMortgageRates() {
  const [isContactFormOpen, setIsContactFormOpen] = React.useState(false);
  const [currentRates, setCurrentRates] = React.useState<MortgageRate[]>([]);
  const [ratesLoading, setRatesLoading] = React.useState(true);

  // Ottawa Rate Alert State
  const [showRateAlert, setShowRateAlert] = React.useState(false);
  const [rateAlertSubmitted, setRateAlertSubmitted] = React.useState(false);

  // Ottawa Rate Lock State
  const [showLockRate, setShowLockRate] = React.useState(false);
  const [lockRateSubmitted, setLockRateSubmitted] = React.useState(false);
  const [selectedRate, setSelectedRate] = React.useState<string>('');

  // Fetch live rates on component mount
  React.useEffect(() => {
    const fetchLiveRates = async () => {
      setRatesLoading(true);
      try {
        const response = await fetch('/api/mortgage-rates');
        const data = await response.json();
        
        if (data.rates && data.rates.length > 0) {
          // Transform API data to match our format
          const transformedRates = data.rates.flatMap((provider: any) => 
            provider.rates?.map((rate: any) => ({
              term: rate.term,
              rate: rate.rate,
              type: rate.type,
              bestFor: getBestFor(rate.term, rate.type),
              lender: rate.lender,
              payment: rate.payment,
              popular: rate.term === "5-years-fixed" && rate.type === "Fixed"
            })) || []
          );
          
          setCurrentRates(transformedRates);
        } else {
          // If no rates from API, show error message
          console.error('No rates available from API');
        }
      } catch (error) {
        console.error('Error fetching live rates:', error);
        // Show error state if API fails
        setCurrentRates([]);
      } finally {
        setRatesLoading(false);
      }
    };

    fetchLiveRates();
    
    // Refresh rates every 4 hours
    const interval = setInterval(fetchLiveRates, 4 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  
  const filteredRates = currentRates;
  
  return (
    <div className="min-h-screen relative" style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%, #f8fafc 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite'
    }}>
      {/* Noise Overlay - Simplified */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-gray-100"></div>
      
      {/* Global Animations */}
      <style jsx global>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>

      <Header variant="city" currentPage="rates" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center mr-4" style={{background: 'linear-gradient(to right, #264653, #2A9D8F)'}}>
              <span className="text-white font-bold text-2xl">O</span>
            </div>
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-bold" style={{color: '#222831'}}>
                Best Mortgage Rates Ottawa
              </h1>
              <p className="text-lg md:text-xl" style={{color: '#264653'}}>
                Capital Region's Premier Mortgage Solutions
              </p>
            </div>
          </div>
          
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed mb-8" style={{color: '#6B7280'}}>
            Compare <strong>today's lowest mortgage rates</strong> in Ottawa. Get pre-approved with rates starting from <strong>{filteredRates.length > 0 ? filteredRates[0]?.rate : '4.99'}%</strong> from Canada's top lenders.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2" style={{color: '#2A9D8F'}}>15+</div>
              <div className="text-gray-600">Lender Partners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2" style={{color: '#2A9D8F'}}>500+</div>
              <div className="text-gray-600">Ottawa Families Helped</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2" style={{color: '#2A9D8F'}}>$50M+</div>
              <div className="text-gray-600">Mortgages Funded</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Ottawa Market Expertise
                </h3>
                <p className="text-gray-600">
                  Deep knowledge of the National Capital Region's unique real estate landscape and lending requirements.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Government Employee Specialists
                </h3>
                <p className="text-gray-600">
                  Specialized programs for federal government employees with unique income structures and benefits.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Bilingual Service
                </h3>
                <p className="text-gray-600">
                  Comprehensive mortgage services available in both English and French for Ottawa's diverse community.
                </p>
              </div>
            </div>

            <div className="flex justify-center mb-8">
              <a
                href="https://andreina-ford.mtg-app.com/signup?brokerName=andreina.ford&brokerId=7208e0a3-3590-47b7-a99d-4704d9c75268"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 text-lg text-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-lg border-2 font-semibold hover:opacity-80"
                style={{borderColor: '#264653', color: '#264653', backgroundColor: 'transparent'}}
              >
                Apply Now for Pre-Approval!
              </a>
            </div>
            </div>
          </div>
          
          {/* Interactive Rate Comparison Table */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold" style={{color: '#222831'}}>
                Live Ottawa Mortgage Rates
              </h2>
              <div className="text-sm" style={{color: '#6B7280'}}>
                Updated: {new Date().toLocaleDateString('en-CA')}
              </div>
            </div>

            {ratesLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderColor: '#2A9D8F'}}></div>
              </div>
            ) : (
              <div>
                {filteredRates.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-2xl mb-4">⚠️</div>
                    <p className="text-lg font-medium" style={{color: '#264653'}}>Rates temporarily unavailable</p>
                    <p className="text-sm mt-2" style={{color: '#264653'}}>Please contact us directly for current rates</p>
                    <Button
                      onClick={() => setIsContactFormOpen(true)}
                      variant="primary"
                      size="sm"
                      className="mt-4"
                    >
                      Contact Us
                    </Button>
                  </div>
                ) : (
                  <div className="w-full">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b" style={{borderColor: '#E5E7EB'}}>
                            <th className="text-left py-4 px-4 font-semibold" style={{color: '#374151'}}>Term</th>
                            <th className="text-left py-4 px-4 font-semibold" style={{color: '#374151'}}>Rate</th>
                            <th className="text-left py-4 px-4 font-semibold" style={{color: '#374151'}}>Type</th>
                            <th className="text-left py-4 px-4 font-semibold" style={{color: '#374151'}}>Best For</th>
                            <th className="text-left py-4 px-4 font-semibold" style={{color: '#374151'}}>Lender</th>
                            <th className="text-center py-4 px-4 font-semibold" style={{color: '#374151'}}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRates.slice(0, 8).map((rate, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50 transition-colors" style={{borderColor: '#F3F4F6'}}>
                              <td className="py-4 px-4">
                                <div className="font-semibold" style={{color: '#1F2937'}}>{rate.term}</div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="text-2xl font-bold" style={{color: '#059669'}}>{rate.rate}%</div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="text-sm font-medium" style={{color: '#6B7280'}}>{rate.type}</div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="text-sm" style={{color: '#6B7280'}}>{rate.bestFor}</div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="font-medium" style={{color: '#374151'}}>{rate.lender}</div>
                                <div className="text-xs" style={{color: '#9CA3AF'}}>
                                  Payment: {rate.payment}
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <Button
                                  onClick={() => {
                                    setSelectedRate(`${rate.term} - ${rate.rate}`);
                                    setShowLockRate(true);
                                    setLockRateSubmitted(false);
                                  }}
                                  variant="secondary"
                                  size="sm"
                                >
                                  Lock Rate
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                      {filteredRates.slice(0, 6).map((rate, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow" style={{borderColor: '#E5E7EB'}}>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="font-semibold text-lg" style={{color: '#1F2937'}}>{rate.term}</div>
                              <div className="text-2xl font-bold" style={{color: '#059669'}}>{rate.rate}%</div>
                              <div className="text-sm" style={{color: '#6B7280'}}>{rate.type} • {rate.bestFor}</div>
                              <div className="text-sm font-bold" style={{color: '#264653'}}>{rate.lender}</div>
                            </div>
                          </div>
                          <Button
                            onClick={() => {
                              setSelectedRate(`${rate.term} - ${rate.rate}`);
                              setShowLockRate(true);
                              setLockRateSubmitted(false);
                            }}
                            variant="secondary"
                            size="sm"
                            className="w-full"
                          >
                            Lock Rate
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Ottawa-Specific Insights */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[
              {
                title: "Federal Employee Benefits",
                description: "Leverage your government job security and benefits for better mortgage terms and rates.",
                icon: "🏛️"
              },
              {
                title: "Bilingual Documentation", 
                description: "Complete mortgage process available in French with bilingual documentation and support.",
                icon: "🇨🇦"
              },
              {
                title: "Capital Region Markets",
                description: "Expert knowledge of Ottawa, Gatineau, and surrounding communities' real estate trends.",
                icon: "🏘️"
              },
              {
                title: "Security Clearance Friendly",
                description: "Streamlined processes that respect security clearance requirements and timelines.",
                icon: "🔒"
              }
            ].map((insight, index) => (
              <div key={index} className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-3xl mb-4">{insight.icon}</div>
                <h3 className="font-semibold mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-teal-700 group-hover:to-teal-500 transition-all duration-300">{insight.title}</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>

      {/* Ottawa Mortgage Calculator Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-100/25 via-orange-100/20 via-emerald-100/15 to-violet-100/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{color: '#222831'}}>
              Ottawa Mortgage Payment Calculator
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{color: '#6B7280'}}>
              Calculate your mortgage payments with Ottawa-specific property values and down payment scenarios.
            </p>
          </div>
          
          <MortgageCalculator 
            onOpenContactForm={() => setIsContactFormOpen(true)}
            currentRates={filteredRates}
          />
        </div>
      </section>

      {/* Ottawa Home Buying Programs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{color: '#222831'}}>
              Ottawa First-Time Home Buyer Programs
            </h2>
            <p className="text-xl max-w-3xl mx-auto mb-8" style={{color: '#6B7280'}}>
              Special programs available for Ottawa and National Capital Region residents.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: "Federal Employee Programs",
                description: "Exclusive mortgage programs for federal government employees with flexible qualification criteria."
              },
              {
                title: "CMHC Shared Equity",
                description: "Government assistance program offering up to 10% of home purchase price in major centers like Ottawa."
              },
              {
                title: "First-Time Home Buyer Tax Credit",
                description: "Up to $750 tax credit for qualifying first-time home buyers in the Ottawa region."
              }
            ].map((program, index) => (
              <div key={index} className="group p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-teal-700 group-hover:to-teal-500 transition-all duration-300">{program.title}</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors text-sm leading-relaxed">{program.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center bg-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4" style={{color: '#264653'}}>
              Need Help with Ottawa Programs?
            </h3>
            <p className="mb-4" style={{color: '#264653'}}>
              Need help navigating Ottawa's programs? Our experts know the details.
            </p>
            <Button
              onClick={() => setIsContactFormOpen(true)}
              variant="primary"
              size="lg"
            >
              Get Ottawa Program Help
            </Button>
          </div>
        </div>
      </section>

      {/* Rate Alert Modal */}
      {showRateAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4" style={{color: '#222831'}}>
                Ottawa Rate Alert
              </h3>
              {rateAlertSubmitted ? (
                <div>
                  <div className="text-6xl mb-4">✅</div>
                  <p className="text-lg mb-6" style={{color: '#059669'}}>
                    Alert set! We'll notify you when Ottawa rates drop.
                  </p>
                  <button 
                    onClick={() => setShowRateAlert(false)}
                    className="w-full btn-primary py-3 text-center"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  setRateAlertSubmitted(true);
                }}>
                  <p className="mb-6 text-gray-600">
                    Get notified when Ottawa mortgage rates drop below your target.
                  </p>
                  <div className="space-y-4 mb-6">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Target rate (e.g. 4.5%)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option>5 Year Fixed</option>
                      <option>3 Year Fixed</option>
                      <option>Variable Rate</option>
                      <option>1 Year Fixed</option>
                    </select>
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full"
                  >
                    Set Alert
                  </Button>
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    We'll email you when rates hit your target. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>
            
            {!rateAlertSubmitted && (
              <button 
                onClick={() => setShowRateAlert(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Rate Lock Modal */}
      {showLockRate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4" style={{color: '#222831'}}>
                Lock Ottawa Rate: {selectedRate}
              </h3>
              {lockRateSubmitted ? (
                <div>
                  <div className="text-6xl mb-4">🔒</div>
                  <p className="text-lg mb-6" style={{color: '#059669'}}>
                    Rate lock request submitted! We'll contact you within 24 hours.
                  </p>
                  <button 
                    onClick={() => setShowLockRate(false)}
                    className="w-full btn-primary py-3 text-center"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  setLockRateSubmitted(true);
                }}>
                  <p className="mb-6 text-gray-600">
                    Lock in this rate for your Ottawa mortgage application.
                  </p>
                  <div className="space-y-4 mb-6">
                    <input
                      type="text"
                      placeholder="Full name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Property price (Ottawa)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full"
                  >
                    Lock This Rate
                  </Button>
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Rate lock subject to qualification and approval.
                  </p>
                </form>
              )}
            </div>
            
            {!lockRateSubmitted && (
              <button 
                onClick={() => setShowLockRate(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Contact Form Modal */}
      {isContactFormOpen && (
        <ContactForm 
          isOpen={isContactFormOpen}
          onClose={() => setIsContactFormOpen(false)}
        />
      )}

      {/* Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t shadow-lg z-40 p-4 lg:hidden">
        <div className="flex justify-center">
          <Button
            href="https://andreina-ford.mtg-app.com/signup?brokerName=andreina.ford&brokerId=7208e0a3-3590-47b7-a99d-4704d9c75268"
            variant="primary"
            size="md"
          >
            Apply for Pre-Approval
          </Button>
        </div>
      </div>

      {/* Final CTA Section */}
      <section className="py-20" style={{backgroundColor: '#264653'}}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6" style={{color: '#F4F4F4'}}>
            Ready to Secure Your Ottawa Mortgage?
          </h2>
          <p className="text-xl mb-8" style={{color: '#F4F4F4'}}>
            Take advantage of today's competitive rates and 
            connect with our Licensed Mortgage Agent specializing in the National Capital Region market.
          </p>
          <div className="flex justify-center">
            <Button
              href="https://andreina-ford.mtg-app.com/signup?brokerName=andreina.ford&brokerId=7208e0a3-3590-47b7-a99d-4704d9c75268"
              variant="secondary"
              size="lg"
              className="text-lg"
            >
              Apply Now for Pre-Approval!
            </Button>
          </div>
          <div className="mt-6 flex items-center justify-center space-x-6 text-sm" style={{color: '#F4F4F4'}}>
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>Licensed Mortgage Agent</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>Ottawa Market Expert</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>Bilingual Service</span>
            </div>
          </div>
        </div>
      </section>

      <Footer showRegulatory={true} />
    </div>
  );
}