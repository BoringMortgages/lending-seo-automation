import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Mortgage Rates in Mississauga, Ontario 2025 | Boring Mortgages Ontario",
  description: "Compare Mississauga's best mortgage rates with GTA market insights. Current rates from 3.94%. Free calculators, first-time buyer programs, and expert guidance for Peel Region homebuyers.",
  keywords: "Mississauga mortgage rates, best mortgage rates Mississauga, Mississauga mortgage broker, GTA mortgage rates, Peel Region mortgage, Mississauga home loan rates",
  openGraph: {
    title: "Best Mortgage Rates in Mississauga, Ontario 2025",
    description: "Compare Mississauga's best mortgage rates with GTA market insights. Current rates from 3.94%.",
    type: "article",
  },
};

export default function MississaugaMortgageRates() {
  const lenderComparison = [
    { lender: "Big 6 Banks", rate: "4.89%", pros: "Branch access", cons: "Higher rates" },
    { lender: "Credit Unions", rate: "4.24%", pros: "Member benefits", cons: "Limited locations" },
    { lender: "Monoline Lenders", rate: "3.94%", pros: "Best rates", cons: "Online only", recommended: true },
    { lender: "Alternative Lenders", rate: "5.49%", pros: "Flexible approval", cons: "Higher cost" },
  ];

  const mississaugaInsights = [
    {
      title: "Average Home Price",
      value: "$925,000",
      description: "TRREB Dec 2024",
      icon: "🏠"
    },
    {
      title: "Down Payment Required",
      value: "$185,000",
      description: "20% for homes over $1M",
      icon: "💰"
    },
    {
      title: "Land Transfer Tax",
      value: "Provincial Only",
      description: "No municipal LTT",
      icon: "📋"
    },
    {
      title: "First-Time Buyer Rebate",
      value: "Up to $4,000",
      description: "Provincial rebate available",
      icon: "🎁"
    }
  ];

  const mississaugaPrograms = [
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
      program: "Peel Region Housing Programs",
      description: "Local down payment assistance and affordable housing options",
      eligibility: "Income and location restrictions apply"
    },
    {
      program: "CMHC Insurance",
      description: "Low down payment options (5% minimum)",
      eligibility: "Purchase price under $1M"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Boring Mortgages Ontario
                </h1>
                <p className="text-sm text-gray-600">Making complex mortgages boringly simple</p>
              </div>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">Home</Link>
              <Link
                href="https://callme.mortgagewithford.ca"
                className="bg-gradient-to-r from-slate-600 to-slate-800 text-white px-6 py-2 rounded-lg hover:from-slate-700 hover:to-slate-900 transition-all font-medium"
              >
                Book Consultation →
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-sm font-medium text-blue-700 mb-6">
                🏢 Mississauga, Ontario • Updated January 2025
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Best Mortgage Rates in
                <span className="block text-blue-600">Mississauga</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Compare current Mississauga mortgage rates with GTA market insights and first-time buyer programs. 
                <strong>Peel Region expertise without the boring bank lineups.</strong>
              </p>
              
              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-lg border">
                  <div className="text-2xl font-bold text-blue-600">3.94%</div>
                  <div className="text-sm text-gray-600">Best 5-Year Fixed</div>
                </div>
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-lg border">
                  <div className="text-2xl font-bold text-green-600">$925K</div>
                  <div className="text-sm text-gray-600">Average Home Price</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/mortgage-payment-calculator"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors text-center shadow-lg"
                >
                  Calculate Mississauga Payments
                </Link>
                <Link
                  href="https://callme.mortgagewithford.ca"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                >
                  Talk to GTA Expert
                </Link>
              </div>
            </div>
            
            {/* Rate Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Current Rates by Lender Type
              </h3>
              <div className="space-y-4">
                {lenderComparison.map((lender, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${lender.recommended ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        {lender.lender}
                        {lender.recommended && (
                          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                            BEST VALUE
                          </span>
                        )}
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {lender.rate}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 grid grid-cols-2 gap-4">
                      <div><span className="text-green-600">✓</span> {lender.pros}</div>
                      <div><span className="text-red-600">✗</span> {lender.cons}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Rates shown:</strong> 5-year fixed, insured mortgages, 25-year amortization. 
                  Your rate depends on credit score, down payment, and lender choice.
                </p>
                <Link 
                  href="https://callme.mortgagewithford.ca" 
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Get your personalized Mississauga rate quote →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mississauga Market Insights */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Mississauga Market Insights
            </h2>
            <p className="text-lg text-gray-600">
              The boring details that actually affect your Mississauga mortgage
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mississaugaInsights.map((insight, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{insight.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
                <div className="text-2xl font-bold text-blue-600 mb-1">{insight.value}</div>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mississauga Programs */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Mississauga Home Buying Programs
            </h2>
            <p className="text-lg text-gray-600">
              Boring government programs that could save you thousands
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {mississaugaPrograms.map((program, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{program.program}</h3>
                <p className="text-gray-600 mb-4">{program.description}</p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Eligibility:</strong> {program.eligibility}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Need help navigating Mississauga's programs? Our experts know the boring details.
            </p>
            <Link 
              href="https://callme.mortgagewithford.ca" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              Get Mississauga Program Help
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready for Expert Mississauga Mortgage Help?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our tools give you the boring details. When you're ready for personalized Mississauga guidance, 
            connect with <strong>Andreina Ford</strong> - Licensed Mortgage Agent Level 2, BRX Mortgage #13463, specializing in the GTA market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://callme.mortgagewithford.ca"
              className="bg-white text-blue-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Book Mississauga Consultation
            </Link>
            <Link
              href="mailto:hello@mortgagewithford.ca"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-800 transition-colors"
            >
              Email About Mississauga Rates
            </Link>
          </div>
          <div className="mt-6 flex items-center justify-center space-x-6 text-blue-200 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-blue-300">✓</span>
              <span>Licensed in Ontario</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-300">✓</span>
              <span>GTA Market Expert</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-300">✓</span>
              <span>BRX Mortgage #13463</span>
            </div>
          </div>
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
              <p className="text-gray-400 text-sm mb-4">
                Making complex mortgages boringly simple for Ontario residents.
              </p>
              <p className="text-gray-400 text-xs">
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
                <li><Link href="/best-mortgage-rates-mississauga" className="hover:text-white text-blue-300">Mississauga</Link></li>
                <li><Link href="/best-mortgage-rates-hamilton" className="hover:text-white">Hamilton</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Get Help</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="https://callme.mortgagewithford.ca" className="hover:text-white">Book Consultation</Link></li>
                <li><Link href="mailto:hello@mortgagewithford.ca" className="hover:text-white">Email Us</Link></li>
                <li><Link href="/" className="hover:text-white">Home</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Regulatory Logos */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col items-center space-y-6">
              <div className="flex items-center justify-center space-x-8 flex-wrap">
                {/* BRX Mortgage Logo */}
                <div className="flex items-center space-x-2">
                  <div className="bg-green-500 text-white px-4 py-2 rounded text-xl font-bold">
                    BRX
                  </div>
                  <div className="text-gray-400 text-xs">
                    MORTGAGE<br/>
                    #13463
                  </div>
                </div>
                
                {/* Proudly Canadian */}
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">🍁</span>
                  </div>
                  <div className="text-gray-400 text-xs">
                    PROUDLY<br/>
                    CANADIAN
                  </div>
                </div>
                
                {/* CMHC */}
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-600 text-white px-3 py-2 rounded font-bold text-sm">
                    CMHC
                  </div>
                  <div className="text-gray-400 text-xs">
                    CANADA MORTGAGE<br/>
                    & HOUSING CORP
                  </div>
                </div>
                
                {/* FSRA */}
                <div className="flex items-center space-x-2">
                  <div className="bg-teal-600 text-white px-3 py-2 rounded font-bold text-sm">
                    FSRA
                  </div>
                  <div className="text-gray-400 text-xs">
                    FINANCIAL SERVICES<br/>
                    REGULATORY AUTHORITY
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-center w-full">
                <p className="text-gray-400 text-sm">
                  © 2025 Boring Mortgages Ontario. Making Mississauga mortgages boringly simple.
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy</Link>
                  <Link href="/terms" className="text-gray-400 hover:text-white text-sm">Terms</Link>
                  <Link href="/disclaimer" className="text-gray-400 hover:text-white text-sm">Disclaimer</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 