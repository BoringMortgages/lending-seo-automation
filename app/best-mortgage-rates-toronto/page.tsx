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

export default function TorontoMortgageRates() {
  const [selectedFilter, setSelectedFilter] = React.useState('all');
  const [showRateAlert, setShowRateAlert] = React.useState(false);
  const [showLockRate, setShowLockRate] = React.useState(false);
  const [rateAlertSubmitted, setRateAlertSubmitted] = React.useState(false);
  const [lockRateSubmitted, setLockRateSubmitted] = React.useState(false);
  const [selectedRate, setSelectedRate] = React.useState('');
  const [isContactFormOpen, setIsContactFormOpen] = React.useState(false);
  
  const [currentRates, setCurrentRates] = React.useState<MortgageRate[]>([]);
  const [ratesLoading, setRatesLoading] = React.useState(true);
  const [lastUpdated, setLastUpdated] = React.useState<string | null>(null);

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
          setLastUpdated(data.lastUpdated || new Date().toLocaleString('en-CA', { 
            timeZone: 'America/Toronto',
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit'
          }));
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
  


  const lenderComparison = [
    { lender: "Big 6 Banks", rate: "4.89%", pros: "Branch access", cons: "Higher rates" },
    { lender: "Credit Unions", rate: "4.24%", pros: "Member benefits", cons: "Limited locations" },
    { lender: "Monoline Lenders", rate: "3.94%", pros: "Best rates", cons: "Online only", recommended: true },
    { lender: "Alternative Lenders", rate: "5.49%", pros: "Flexible approval", cons: "Higher cost" },
  ];

  const torontoInsights = [
    {
      title: "Average Home Price",
      value: "$1,142,000",
      description: "TRREB Dec 2024",
      icon: "🏠"
    },
    {
      title: "Down Payment Required",
      value: "$75,000",
      description: "5% on first $500K + 10% remainder",
      icon: "💰"
    },
    {
      title: "Land Transfer Tax",
      value: "Double Tax",
      description: "Provincial + Municipal LTT",
      icon: "📋"
    },
    {
      title: "First-Time Buyer Rebate",
      value: "Up to $8,475",
      description: "Provincial rebate available",
      icon: "🎁"
    }
  ];

  const handleRateAlertSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      type: 'rate_alert',
      targetRate: formData.get('targetRate'),
      email: formData.get('email'),
      mortgageType: formData.get('mortgageType'),
      timestamp: new Date().toISOString(),
      location: 'Toronto'
    };
    
    try {
      // Send email notification
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'hello@boringmortgages.ca',
          subject: `New Rate Alert Set - Toronto`,
          message: `Rate Alert Request:\n\nTarget Rate: ${data.targetRate}%\nEmail: ${data.email}\nMortgage Type: ${data.mortgageType}\nLocation: Toronto\nTimestamp: ${data.timestamp}`
        })
      });
      
      setRateAlertSubmitted(true);
    } catch (error) {
      console.error('Error submitting rate alert:', error);
    }
  };

  const handleLockRateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      type: 'lock_rate',
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || 'Not provided',
      rate: selectedRate,
      timestamp: new Date().toISOString(),
      location: 'Toronto'
    };
    
    try {
      // Send lead email notification
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'hello@boringmortgages.ca',
          subject: `🔒 New Rate Lock Lead - Toronto`,
          message: `New Rate Lock Request:\n\n👤 Name: ${data.name}\n📧 Email: ${data.email}\n📱 Phone: ${data.phone}\n💰 Rate: ${data.rate}\n📍 Location: Toronto\n⏰ Timestamp: ${data.timestamp}\n\nPlease reach out to this lead promptly!`
        })
      });
      
      setLockRateSubmitted(true);
    } catch (error) {
      console.error('Error submitting lock rate:', error);
    }
  };

  const torontoPrograms = [
    {
      program: "First-Time Home Buyer Incentive",
      description: "Shared equity loan up to 10% of home price",
      eligibility: "Household income under $120,000"
    },
    {
      program: "Ontario Down Payment Assistance",
      description: "Interest-free loan up to $40,000",
      eligibility: "First-time buyers in select areas"
    },
    {
      program: "Toronto Land Transfer Tax Rebate",
      description: "Up to $4,475 municipal LTT rebate",
      eligibility: "First-time buyers only"
    },
    {
      program: "CMHC Insurance",
      description: "Low down payment options (5% minimum)",
      eligibility: "Purchase price under $1.5M"
    }
  ];

  return (
    <div className="min-h-screen relative" style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%, #f8fafc 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite'
    }}>
      {/* Noise Overlay */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px'
      }}></div>
      
      {/* Global Animations */}
      <style jsx global>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
      <Header variant="city" currentPage="toronto" />

      {/* Hero Section */}
      <section className="py-4 lg:py-6 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Floating Hero Card */}
          <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-3xl p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 backdrop-blur-sm border rounded-full text-sm font-medium mb-6 shadow-sm" style={{backgroundColor: '#FAFAFA', borderColor: '#2A9D8F', color: '#264653'}}>
              🏙️ Toronto, Ontario
            </div>
            <div className="mb-6">
              <img
                src="/logos/toronto-mortgages-gradient.png"
                alt="Best Mortgage Rates Toronto"
                width={500}
                height={120}
                className="mx-auto"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center" style={{color: '#264653'}}>
              Best Mortgage Rates Toronto 2025 - Compare 40+ Lenders
            </h1>
            <p className="text-xl mb-8 leading-relaxed max-w-3xl" style={{color: '#264653'}}>
              Get Toronto's lowest mortgage rates from 40+ top lenders. Compare live rates, calculate payments with Toronto land transfer tax, and save thousands. Licensed Ontario mortgage brokers specializing in GTA market dynamics. <strong>Free pre-approval in 2 minutes.</strong>
            </p>
            
            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-6 mb-8 max-w-md">
              <div className="text-center p-4 backdrop-blur-sm rounded-xl border-2 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105" style={{backgroundColor: '#F8F9FA', borderColor: '#2A9D8F', background: 'linear-gradient(135deg, #F8F9FA 0%, #F4F4F4 100%)'}}>
                <div className="text-2xl font-bold" style={{color: '#264653'}}>
                  {currentRates.find(r => r.term === "5 Year" && r.type === "Fixed")?.rate || "3.74%"}
                </div>
                <div className="text-sm" style={{color: '#264653'}}>Best 5-Year Fixed</div>
              </div>
              <div className="text-center p-4 backdrop-blur-sm rounded-xl border-2 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105" style={{backgroundColor: '#F8F9FA', borderColor: '#2A9D8F', background: 'linear-gradient(135deg, #F8F9FA 0%, #F4F4F4 100%)'}}>
                <div className="text-2xl font-bold" style={{color: '#2A9D8F'}}>$1.16M</div>
                <div className="text-sm" style={{color: '#264653'}}>Average Home Price</div>
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
          <div className="max-w-5xl mx-auto mt-16">
            <div className="rounded-3xl shadow-2xl backdrop-blur-lg bg-white/20 border-2 border-white/30 p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Live Toronto Mortgage Rates - Updated Daily
                  </h2>
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
              
              <div className="mt-8">
                <div className="p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-200/30 shadow-sm text-center relative overflow-hidden" style={{boxShadow: '0 0 20px rgba(147, 51, 234, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1)'}}>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 animate-pulse"></div>
                  <div className="relative z-10">
                    <h4 className="font-semibold text-gray-900 mb-2">📈 Rate Alert</h4>
                    <p className="text-sm text-muted mb-3">
                      Get notified when Toronto rates drop below your target.
                    </p>
                    <button 
                      onClick={() => {
                        setShowRateAlert(true);
                        setRateAlertSubmitted(false);
                      }}
                      className="text-purple hover:text-purple/80 font-medium text-sm transition-all duration-200 hover:scale-105"
                    >
                      Set Rate Alert →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Toronto Mortgage Calculator */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Toronto Mortgage Calculator - CMHC Rules 2025
            </h2>
            <p className="text-xl text-gray-600">
              Calculate your monthly payments with current Toronto mortgage rates and official CMHC rules. Includes Toronto land transfer tax, down payment requirements, and CMHC insurance calculations for homes up to $1.5M.
            </p>
          </div>
          <MortgageCalculator 
            onOpenContactForm={() => setIsContactFormOpen(true)} 
            currentRates={currentRates} 
          />
        </div>
      </section>

      {/* Toronto Market Insights */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Floating Insights Card */}
          <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-3xl p-12 shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading mb-4" style={{color: '#222831'}}>
                Toronto Real Estate Market Insights 2025
              </h2>
              <p className="text-lg" style={{color: '#264653'}}>
                The details that actually affect your mortgage
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {torontoInsights.map((insight, index) => (
                <div key={index} className="backdrop-blur-md bg-white/30 p-6 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  <div className="text-3xl mb-3">{insight.icon}</div>
                  <h3 className="font-semibold mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-teal-700 group-hover:to-teal-500 transition-all duration-300">{insight.title}</h3>
                  <div className="text-2xl font-bold mb-1" style={{color: '#264653'}}>{insight.value}</div>
                  <p className="text-sm" style={{color: '#264653'}}>{insight.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Toronto Programs */}
      <section className="py-20 bg-gradient-to-br from-yellow-100/25 via-orange-100/20 via-emerald-100/15 to-violet-100/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading text-gray-900 mb-4">
              Toronto First-Time Home Buyer Programs 2025
            </h2>
            <p className="text-lg text-gray-600">
              Government programs that could save you thousands
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-10">
            {torontoPrograms.map((program, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-professional border border-slate-200/30 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{program.program}</h3>
                <p className="text-gray-600 mb-4">{program.description}</p>
                <div className="bg-slate-100 p-3 rounded-lg">
                  <p className="text-sm text-slate-700">
                    <strong>Eligibility:</strong> {program.eligibility}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="mb-4" style={{color: '#264653'}}>
              Need help navigating Toronto's programs? Our experts know the details.
            </p>
            <Button
              onClick={() => setIsContactFormOpen(true)}
              variant="primary"
              size="lg"
            >
              Get Toronto Program Help
            </Button>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Floating FAQ Card */}
          <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-3xl p-12 shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading text-gray-900 mb-4">
                Toronto Mortgage FAQs - Common Questions
              </h2>
              <p className="text-lg text-gray-600">
                The questions Toronto homebuyers actually ask
              </p>
            </div>
          
          <div className="space-y-6">
            <div className="backdrop-blur-md bg-white/30 p-8 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
              <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-teal-700 group-hover:to-teal-500 transition-all duration-300">
                Are mortgage rates different across Ontario cities?
              </h3>
              <p style={{color: '#264653'}}>
                No, mortgage rates are the same across Ontario. A 5-year fixed rate in Toronto is the same as in Ottawa or Hamilton. The difference is in qualification requirements due to varying home prices and local market conditions. However, Toronto's high average home price of $1.16M means you'll need larger down payments and higher income to qualify for the same rate.
              </p>
            </div>
            
            <div className="backdrop-blur-md bg-white/30 p-8 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
              <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-teal-700 group-hover:to-teal-500 transition-all duration-300">
                How much is land transfer tax in Toronto?
              </h3>
              <p style={{color: '#264653'}}>
                Toronto has both provincial and municipal land transfer tax, making it the most expensive in Ontario. For a $1.16M home (Toronto average), you'll pay approximately $36,400 total ($18,200 provincial + $18,200 municipal). First-time buyers can get up to $8,475 in combined rebates ($4,475 municipal + $4,000 provincial), but this still leaves significant costs compared to other GTA cities.
              </p>
            </div>
            
            <div className="backdrop-blur-md bg-white/30 p-8 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
              <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-teal-700 group-hover:to-teal-500 transition-all duration-300">
                Can I get a mortgage in Toronto with less than 20% down?
              </h3>
              <p className="text-gray-600 mb-3">
                <strong>Yes, for homes under $1.5M (updated December 2024).</strong> You can put down as little as 5% on the first $500k and 10% on the remainder up to $1.5M, but you'll need CMHC mortgage insurance.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mt-3">
                <p className="text-blue-800 text-sm">
                  <strong>CMHC Premium:</strong> Ranges from 0.60% to 4.50% of loan amount depending on your down payment size. Premium is added as a one-time fee to your mortgage amount, plus you pay PST (8% in Ontario) on the premium at closing.
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Rate Alert Modal */}
      {showRateAlert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Set Rate Alert</h3>
              <button 
                onClick={() => setShowRateAlert(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {!rateAlertSubmitted ? (
              <>
                <p className="text-gray-600 mb-4">
                  Get notified when Toronto mortgage rates drop to your target level.
                </p>
                <form onSubmit={handleRateAlertSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Rate (%)</label>
                    <input 
                      name="targetRate"
                      type="number" 
                      step="0.01" 
                      placeholder="3.50"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      name="email"
                      type="email" 
                      placeholder="your@email.com"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mortgage Type</label>
                    <select name="mortgageType" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent">
                      <option>5 Year Fixed</option>
                      <option>5 Year Variable</option>
                      <option>3 Year Fixed</option>
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
                </form>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  We'll email you when rates hit your target. Unsubscribe anytime.
                </p>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Message Received!</h4>
                <p style={{color: '#264653'}}>
                  We'll notify you when Toronto rates hit your target.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Lock Rate Modal */}
      {showLockRate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Lock Rate</h3>
              <button 
                onClick={() => setShowLockRate(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {!lockRateSubmitted ? (
              <>
                <p className="text-gray-600 mb-2">
                  Lock in this rate: <strong className="text-purple">{selectedRate}</strong>
                </p>
                <p className="text-gray-600 mb-4">
                  We'll contact you to complete the rate lock process.
                </p>
                <form onSubmit={handleLockRateSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      name="name"
                      type="text" 
                      placeholder="Your full name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      name="email"
                      type="email" 
                      placeholder="your@email.com"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-gray-400">(Optional)</span></label>
                    <input 
                      name="phone"
                      type="tel" 
                      placeholder="(416) 555-0123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
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
                </form>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Rate lock subject to qualification and approval.
                </p>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Message Received!</h4>
                <p style={{color: '#264653'}}>
                  We'll contact you shortly to complete your rate lock.
                </p>
              </div>
            )}
          </div>
        </div>
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

      {/* CTA Section */}
      <section className="py-20 grain-texture mb-20 lg:mb-0 relative overflow-hidden" style={{background: 'linear-gradient(to bottom right, #264653, #2A9D8F)'}}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready for Expert Toronto Mortgage Help?
          </h2>
          <p className="text-xl mb-8" style={{color: '#F4F4F4'}}>
            Our tools give you the details. When you're ready for personalized Toronto guidance, 
            connect with our Licensed Mortgage Agent specializing in the GTA market.
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
              <span style={{color: '#2A9D8F'}}>✓</span>
              <span>Licensed in Ontario</span>
            </div>
            <div className="flex items-center space-x-2">
              <span style={{color: '#2A9D8F'}}>✓</span>
              <span>GTA Market Expert</span>
            </div>
          </div>
        </div>
      </section>

      <Footer showRegulatory={true} />
      
      <ContactForm 
        isOpen={isContactFormOpen} 
        onClose={() => setIsContactFormOpen(false)} 
      />
    </div>
  );
} 