'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import ContactForm from "../components/ContactForm";
import PreApprovalForm from "../components/PreApprovalForm";
import { CONTACT_CONFIG } from '../config/contact';

// Rate interface
interface MortgageRate {
  term: string;
  rate: string;
  type: string;
  bestFor?: string;
  lender: string;
  payment?: string;
  popular?: boolean;
}

export default function Home() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isPreApprovalFormOpen, setIsPreApprovalFormOpen] = useState(false);
  
  const [currentRates, setCurrentRates] = useState<MortgageRate[]>([]);
  const [ratesLoading, setRatesLoading] = useState(true);

  // Fetch live rates on component mount
  useEffect(() => {
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

  // Helper function to determine best for description
  const getBestFor = (term: string, type: string) => {
    if (term === "5-years-fixed") return "Most popular";
    if (term === "3-years-fixed") return "Medium-term security";
    if (term === "1-year-fixed") return "Rate speculation";
    if (type === "Variable") return "Rate optimists";
    if (term === "2-years-fixed") return "Short commitment";
    if (term === "10-years-fixed") return "Long-term security";
    return "Flexible option";
  };

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

      {/* Header */}
      <header className="backdrop-blur-md bg-white/80 shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(to right, #264653, #2A9D8F)'}}>
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <h1 className="text-3xl font-heading" style={{color: '#222831'}}>
                  Boring Mortgages Ontario
                </h1>
                <p className="text-1xl" style={{color: '#264653'}}>Making complex mortgages boringly simple</p>
              </div>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="font-medium hover:opacity-80" style={{color: '#264653'}}>Home</Link>
              <a
                href={CONTACT_CONFIG.consultationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 text-sm font-medium rounded-lg text-white hover:opacity-90 transition-opacity"
                style={{backgroundColor: '#FF914D'}}
              >
                Book Consultation &rarr;
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-4 lg:py-6 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Floating Hero Card */}
          <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-3xl p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 backdrop-blur-sm border rounded-full text-sm font-medium mb-6 shadow-sm" style={{backgroundColor: '#FAFAFA', borderColor: '#2A9D8F', color: '#264653'}}>
              🇨🇦 Licensed in Ontario
            </div>
            <h1 className="text-4xl md:text-7xl font-bold mb-8 leading-tight" style={{color: '#222831'}}>
              Ontario's Most
              <br />
              <span className="block bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent mb-4">
                Boring Mortgage Site
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto leading-relaxed" style={{color: '#264653'}}>
              No flashy gimmicks. No confusing jargon. Just the <strong>boring details</strong> that help you 
              compare rates, calculate payments, and save thousands on your Ontario mortgage.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => setIsPreApprovalFormOpen(true)}
                className="px-8 py-4 text-lg text-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-lg border-2 font-semibold hover:opacity-80"
                style={{borderColor: '#264653', color: '#264653', backgroundColor: 'transparent'}}
              >
                Apply Now
              </button>
              <Link
                href="/mortgage-payment-calculator"
                className="px-8 py-4 text-lg text-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-lg text-white font-semibold"
                style={{backgroundColor: '#2A9D8F'}}
              >
                Calculate Payments
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm" style={{color: '#264653'}}>
              <div className="flex items-center space-x-2">
                <span style={{color: '#2A9D8F'}}>✓</span>
                <span>Free Tools</span>
              </div>
              <div className="flex items-center space-x-2">
                <span style={{color: '#2A9D8F'}}>✓</span>
                <span>Rates Updated 2x Weekly</span>
              </div>
              <div className="flex items-center space-x-2">
                <span style={{color: '#2A9D8F'}}>✓</span>
                <span>Ontario Licensed</span>
              </div>
            </div>
            </div>
          </div>
          
          {/* Interactive Rate Comparison Table */}
          <div className="max-w-5xl mx-auto mt-16">
            <div className="rounded-3xl shadow-2xl backdrop-blur-lg bg-white/20 border-2 border-white/30 p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Live Ontario Mortgage Rates
                  </h3>
                  {ratesLoading && <p className="text-sm" style={{color: '#264653'}}><span className="text-orange-600">🔄 Updating...</span></p>}
                </div>
              </div>
              
              {/* Rate Table */}
              <div className="w-full">
                {ratesLoading ? (
                  <div className="text-center py-12">
                    <div className="text-2xl mb-4">🔄</div>
                    <p className="text-lg font-medium" style={{color: '#264653'}}>Loading current rates...</p>
                  </div>
                ) : currentRates.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-2xl mb-4">⚠️</div>
                    <p className="text-lg font-medium" style={{color: '#264653'}}>Rates temporarily unavailable</p>
                    <p className="text-sm mt-2" style={{color: '#264653'}}>Please contact us directly for current rates</p>
                    <button 
                      onClick={() => setIsContactFormOpen(true)}
                      className="mt-4 px-6 py-2 text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 rounded-lg text-white font-medium"
                      style={{backgroundColor: '#FF914D'}}
                    >
                      Contact Us
                    </button>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="hidden md:block">
                      <table className="w-full table-fixed">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-3 px-4 text-sm font-medium w-2/5" style={{color: '#264653'}}>Term</th>
                            <th className="text-left py-3 px-4 text-sm font-medium w-1/5" style={{color: '#264653'}}>Rate</th>
                            <th className="text-center py-3 px-4 text-sm font-medium w-2/5" style={{color: '#264653'}}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRates.filter(rate => rate.term !== "10 Year").map((rate, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50 transition-all duration-300 hover:scale-[1.01]" style={{
                              borderColor: '#2A9D8F',
                              backgroundColor: rate.popular ? '#F4F4F4' : 'transparent'
                            }}>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-lg font-bold" style={{color: '#222831'}}>{rate.term}</span>
                                  {rate.popular && (
                                    <span className="text-white px-2 py-1 rounded-full text-xs font-medium" style={{backgroundColor: '#9B5DE5'}}>
                                      POPULAR
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm font-medium" style={{color: '#264653'}}>{rate.type}</div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="space-y-1">
                                  <div className="text-xl font-bold" style={{color: '#264653'}}>{rate.rate}</div>
                                  <div className="text-sm font-bold" style={{color: '#264653'}}>{rate.lender}</div>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <button 
                                  onClick={() => setIsPreApprovalFormOpen(true)}
                                  className="px-4 py-2 text-sm inline-block shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 rounded-lg text-white font-medium"
                                  style={{backgroundColor: '#2A9D8F'}}
                                >
                                  Get This Rate
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Mobile/Tablet Layout */}
                    <div className="md:hidden space-y-4">
                      {filteredRates.filter(rate => rate.term !== "10 Year").map((rate, index) => (
                        <div key={index} className="border border-slate-200 rounded-lg p-4 hover:bg-gray-50 transition-all duration-300" style={{
                          borderColor: '#2A9D8F',
                          backgroundColor: rate.popular ? '#F4F4F4' : 'white'
                        }}>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl font-bold" style={{color: '#222831'}}>{rate.term}</span>
                                {rate.popular && (
                                  <span className="text-white px-2 py-1 rounded-full text-xs font-medium" style={{backgroundColor: '#9B5DE5'}}>
                                    POPULAR
                                  </span>
                                )}
                              </div>
                              <div className="text-sm font-medium" style={{color: '#264653'}}>{rate.type}</div>
                            </div>
                            <div className="text-right space-y-1">
                              <div className="text-2xl font-bold" style={{color: '#264653'}}>{rate.rate}</div>
                              <div className="text-sm font-bold" style={{color: '#264653'}}>{rate.lender}</div>
                            </div>
                          </div>
                          <button 
                            onClick={() => setIsPreApprovalFormOpen(true)}
                            className="w-full px-4 py-3 text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 rounded-lg text-white font-medium"
                            style={{backgroundColor: '#2A9D8F'}}
                          >
                            Get This Rate
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8">
                <div className="p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-200/30 shadow-sm text-center relative overflow-hidden" style={{boxShadow: '0 0 20px rgba(147, 51, 234, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1)'}}>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 animate-pulse"></div>
                  <div className="relative z-10">
                    <p className="text-sm mb-2" style={{color: '#264653'}}>
                      <strong>Boring but important:</strong> Rates shown are best available for insured mortgages with 25-year amortization. 
                      Your rate depends on credit score, down payment, and property location.
                    </p>
                    <button 
                      onClick={() => setIsContactFormOpen(true)}
                      className="font-medium text-sm transition-all duration-200 hover:scale-105" style={{color: '#2A9D8F'}}
                    >
                      Get your quote from a licensed mortgage agent &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Tools Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Floating Calculator Card */}
          <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-3xl p-12 shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading mb-4" style={{color: '#222831'}}>
                Boring (But Useful) Mortgage Calculators
              </h2>
              <p className="text-lg" style={{color: '#264653'}}>
                Professional tools to help you make boringly smart mortgage decisions
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Link
                href="/mortgage-payment-calculator"
                className="group backdrop-blur-md bg-white/30 p-8 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="mb-4" style={{color: '#2A9D8F'}}>
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-teal-700 group-hover:to-teal-500 transition-all duration-300">
                  Payment Calculator
                </h3>
                <p className="mb-4" style={{color: '#264653'}}>
                  Calculate monthly payments with taxes, insurance, and CMHC premiums
                </p>
                <div className="text-sm font-medium" style={{color: '#2A9D8F'}}>
                  Most comprehensive tool &rarr;
                </div>
              </Link>

              <Link
                href="/mortgage-affordability-calculator"
                className="group backdrop-blur-md bg-white/30 p-8 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="mb-4" style={{color: '#2A9D8F'}}>
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-teal-700 group-hover:to-teal-500 transition-all duration-300">
                  Affordability Calculator
                </h3>
                <p className="mb-4" style={{color: '#264653'}}>
                  Discover your maximum purchase price using GDS and TDS ratios
                </p>
                <div className="text-sm font-medium" style={{color: '#2A9D8F'}}>
                  Use Canadian guidelines &rarr;
                </div>
              </Link>

              <Link
                href="/heloc-payment-calculator"
                className="group backdrop-blur-md bg-white/30 p-8 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="mb-4" style={{color: '#2A9D8F'}}>
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-teal-700 group-hover:to-teal-500 transition-all duration-300">
                  HELOC Calculator
                </h3>
                <p className="mb-4" style={{color: '#264653'}}>
                  Calculate Home Equity Line of Credit payments and utilization
                </p>
                <div className="text-sm font-medium" style={{color: '#2A9D8F'}}>
                  Access home equity &rarr;
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 grain-texture mb-20 lg:mb-0 relative overflow-hidden" style={{background: 'linear-gradient(to bottom right, #264653, #2A9D8F)'}}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready for Expert Ontario Mortgage Help?
          </h2>
          <p className="text-xl mb-8" style={{color: '#F4F4F4'}}>
            Our tools give you the details. When you're ready for personalized Ontario guidance, 
            connect with our Licensed Mortgage Agent specializing in the Ontario market.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => setIsPreApprovalFormOpen(true)}
              className="px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105" style={{backgroundColor: '#FAFAFA', color: '#264653'}}
            >
              Apply Now
            </button>
          </div>
          <div className="mt-6 flex items-center justify-center space-x-6 text-sm" style={{color: '#F4F4F4'}}>
            <div className="flex items-center space-x-2">
              <span style={{color: '#2A9D8F'}}>✓</span>
              <span>Licensed in Ontario</span>
            </div>
            <div className="flex items-center space-x-2">
              <span style={{color: '#2A9D8F'}}>✓</span>
              <span>Ontario Market Expert</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 grain-texture" style={{backgroundColor: '#222831', color: '#F4F4F4'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(to right, #264653, #2A9D8F)'}}>
                  <span className="text-white font-bold">B</span>
                </div>
                <h3 className="text-lg font-semibold">Boring Mortgages Ontario</h3>
              </div>
              <p className="text-sm mb-4" style={{color: '#264653'}}>
                Making complex mortgages boringly simple for Ontario residents.
              </p>
              <p className="text-xs" style={{color: '#264653'}}>
                <strong>Andreina Ford</strong><br/>
                Licensed Mortgage Agent Level 2<br/>
                BRX Mortgage #13463
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
              <h3 className="text-lg font-semibold mb-4">Get Help</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href={CONTACT_CONFIG.consultationUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">Book Consultation</a></li>
                <li><a href="mailto:hello@boringmortgages.ca?subject=Mortgage questions from Ontario" className="hover:text-white">Email Us</a></li>
                <li><a href="https://mortgagewithford.ca" target="_blank" rel="noopener noreferrer" className="hover:text-white">About Us</a></li>
                <li><a href="https://boringmortgages.ca" target="_blank" rel="noopener noreferrer" className="hover:text-white">Home</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Boring Mortgages Ontario. Making Ontario mortgages boringly simple.
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
      
      <PreApprovalForm 
        isOpen={isPreApprovalFormOpen} 
        onClose={() => setIsPreApprovalFormOpen(false)} 
      />
    </div>
  );
}