'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import BackgroundTexture from '../../components/backgrounds/BackgroundTexture';

// CMHC Official Rules 2024
const CMHC_RULES = {
  premiumRates: {
    95: 0.0400, // LTV > 90%
    90: 0.0310, // LTV 85.01-90%
    85: 0.0280, // LTV 80.01-85%
    80: 0.0240, // LTV 75.01-80%
    75: 0.0170, // LTV 65.01-75%
    65: 0.0060  // LTV ≤ 65%
  },
  minimumDownPayment: {
    threshold1: 500000,
    threshold2: 1000000,
    rate1: 0.05, // 5% on first $500k
    rate2: 0.10, // 10% on $500k-$1M
    rate3: 0.20  // 20% on $1M+
  }
};

function OttawaMortgageCalculator() {
  const [homePrice, setHomePrice] = useState(687000);
  const [downPayment, setDownPayment] = useState(34350);
  const [interestRate, setInterestRate] = useState(5.79);
  const [amortization, setAmortization] = useState(25);
  const [results, setResults] = useState({
    monthlyPayment: 0,
    cmhcPremium: 0,
    totalMortgage: 0,
    ltvRatio: 0,
    isEligible: true
  });

  // Calculate minimum down payment based on CMHC rules
  const calculateMinDownPayment = (price: number): number => {
    if (price <= CMHC_RULES.minimumDownPayment.threshold1) {
      return price * CMHC_RULES.minimumDownPayment.rate1;
    } else if (price <= CMHC_RULES.minimumDownPayment.threshold2) {
      return (CMHC_RULES.minimumDownPayment.threshold1 * CMHC_RULES.minimumDownPayment.rate1) + 
             ((price - CMHC_RULES.minimumDownPayment.threshold1) * CMHC_RULES.minimumDownPayment.rate2);
    } else {
      return price * CMHC_RULES.minimumDownPayment.rate3;
    }
  };

  // Calculate CMHC premium
  const calculateCMHCPremium = (mortgage: number, price: number): number => {
    const ltv = (mortgage / price) * 100;
    if (ltv <= 80) return 0; // No CMHC needed
    
    let rate = 0;
    if (ltv > 95) return 0; // Not eligible
    else if (ltv > 90) rate = CMHC_RULES.premiumRates[95];
    else if (ltv > 85) rate = CMHC_RULES.premiumRates[90];
    else if (ltv > 80) rate = CMHC_RULES.premiumRates[85];
    
    return mortgage * rate;
  };

  useEffect(() => {
    const mortgage = homePrice - downPayment;
    const ltvRatio = (mortgage / homePrice) * 100;
    const cmhcPremium = calculateCMHCPremium(mortgage, homePrice);
    const totalMortgage = mortgage + cmhcPremium;
    
    // Calculate monthly payment
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = amortization * 12;
    
    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment = totalMortgage * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else {
      monthlyPayment = totalMortgage / numPayments;
    }

    const minDownPayment = calculateMinDownPayment(homePrice);
    const isEligible = downPayment >= minDownPayment && homePrice <= 1000000 && ltvRatio <= 95;

    setResults({
      monthlyPayment,
      cmhcPremium,
      totalMortgage,
      ltvRatio,
      isEligible
    });
  }, [homePrice, downPayment, interestRate, amortization]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const minDownPayment = calculateMinDownPayment(homePrice);

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Ottawa Mortgage Calculator
        <span className="block text-lg font-normal text-gray-600 mt-2">Official CMHC 2024 Rules</span>
      </h2>
      
      <div className="space-y-8">
        {/* Home Price */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-4">
            Ottawa Home Price: <span className="text-red-600 font-bold">{formatCurrency(homePrice)}</span>
          </label>
          <input
            type="range"
            min="400000"
            max="1200000"
            step="10000"
            value={homePrice}
            onChange={(e) => setHomePrice(Number(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>$400K</span>
            <span>$1.2M</span>
          </div>
        </div>

        {/* Down Payment */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-4">
            Down Payment: <span className="text-red-600 font-bold">{formatCurrency(downPayment)} ({((downPayment/homePrice)*100).toFixed(1)}%)</span>
          </label>
          <input
            type="range"
            min={minDownPayment}
            max={homePrice * 0.35}
            step="1000"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Min: {formatCurrency(minDownPayment)}</span>
            <span>35%: {formatCurrency(homePrice * 0.35)}</span>
          </div>
          {downPayment < minDownPayment && (
            <p className="text-red-500 text-sm mt-2">
              ⚠️ Minimum down payment required: {formatCurrency(minDownPayment)}
            </p>
          )}
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-4">
            Interest Rate: <span className="text-red-600 font-bold">{interestRate}%</span>
          </label>
          <input
            type="range"
            min="3"
            max="8"
            step="0.01"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>3%</span>
            <span>8%</span>
          </div>
        </div>

        {/* Amortization */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-4">
            Amortization: <span className="text-red-600 font-bold">{amortization} years</span>
          </label>
          <div className="grid grid-cols-4 gap-3">
            {[15, 20, 25, 30].map((years) => (
              <button
                key={years}
                onClick={() => setAmortization(years)}
                disabled={results.cmhcPremium > 0 && years > 25}
                className={`py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                  amortization === years
                    ? 'bg-red-600 text-white shadow-lg transform scale-105'
                    : results.cmhcPremium > 0 && years > 25
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {years}y
              </button>
            ))}
          </div>
          {results.cmhcPremium > 0 && (
            <p className="text-sm text-orange-600 mt-2">
              ⚠️ CMHC insurance limits amortization to 25 years
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="mt-8 p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your Ottawa Mortgage</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Monthly Payment:</span>
            <span className="font-bold text-red-600">{formatCurrency(results.monthlyPayment)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">LTV Ratio:</span>
            <span className="font-bold">{results.ltvRatio.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Mortgage Amount:</span>
            <span className="font-bold">{formatCurrency(homePrice - downPayment)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">CMHC Premium:</span>
            <span className="font-bold">{formatCurrency(results.cmhcPremium)}</span>
          </div>
        </div>
        
        {results.cmhcPremium > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">CMHC Insurance Required</h4>
            <p className="text-blue-800 text-sm">
              Down payment less than 20% requires CMHC mortgage default insurance.
              <br />Premium: {((Object.entries(CMHC_RULES.premiumRates).find(([ltv]) => results.ltvRatio <= parseFloat(ltv))?.[1] ?? 0) * 100).toFixed(2)}% of loan amount
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OttawaMortgageRates() {
  const ottawaData = {
    averageHomePrice: 687000,
    averageDownPayment: 34350,
    landTransferTax: "Provincial only - no municipal LTT",
    marketTrend: "Stable government town with steady demand"
  };

  const currentRates = [
    { term: "1 Year Fixed", rate: "6.44%", type: "Best Rate" },
    { term: "2 Year Fixed", rate: "5.94%", type: "Best Rate" },
    { term: "3 Year Fixed", rate: "5.64%", type: "Best Rate" },
    { term: "5 Year Fixed", rate: "5.79%", type: "Best Rate" },
    { term: "5 Year Variable", rate: "6.20%", type: "Prime - 0.30%" },
  ];

  return (
    <BackgroundTexture className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
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
            <div className="flex items-center space-x-4">
              <Link
                href="mailto:hello@mortgagewithford.ca"
                className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 font-medium"
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
          <div className="inline-flex items-center px-4 py-2 bg-red-100 rounded-full text-sm font-medium text-red-700 mb-6">
            🏛️ Ottawa, Ontario • Updated January 2025
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Best Mortgage Rates in Ottawa
            <span className="block text-3xl md:text-4xl bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mt-2">
              Canada's Capital City
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Compare current Ottawa mortgage rates with <strong>special government employee programs</strong>. 
            Federal worker benefits and capital region mortgage expertise.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex justify-center items-center space-x-8 mt-8 flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-green-500 text-2xl">🔒</span>
              <span className="text-sm font-medium text-gray-600">CMHC Approved</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-500 text-2xl">⚡</span>
              <span className="text-sm font-medium text-gray-600">Instant Results</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-red-500 text-2xl">🏛️</span>
              <span className="text-sm font-medium text-gray-600">Federal Employee Expert</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-500 text-2xl">🇨🇦</span>
              <span className="text-sm font-medium text-gray-600">2025 Rates</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Calculator */}
          <OttawaMortgageCalculator />

          {/* Market Information */}
          <div className="space-y-8">
            {/* Current Rates */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Current Ottawa Mortgage Rates
              </h2>
              <div className="space-y-4">
                {currentRates.map((rate, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <div className="font-semibold text-gray-900">{rate.term}</div>
                      <div className="text-sm text-gray-600">{rate.type}</div>
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      {rate.rate}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-800 mb-2">
                  <strong>Special Rate Alert:</strong> Federal government employees may qualify for additional discounts up to 0.25% off posted rates.
                </p>
                <Link 
                  href="mailto:hello@mortgagewithford.ca?subject=Government Employee Rates" 
                  className="text-red-600 hover:text-red-800 font-medium text-sm"
                >
                  Get your government employee rate quote →
                </Link>
              </div>
            </div>

            {/* Ottawa Market Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Ottawa Real Estate Market
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200">
                  <div className="text-3xl font-bold text-red-600">{new Intl.NumberFormat('en-CA', {style: 'currency', currency: 'CAD', minimumFractionDigits: 0}).format(ottawaData.averageHomePrice)}</div>
                  <div className="text-sm text-gray-600 mt-1">Average Home Price</div>
                  <div className="text-xs text-gray-500 mt-1">OREA Dec 2024</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200">
                  <div className="text-3xl font-bold text-red-600">{new Intl.NumberFormat('en-CA', {style: 'currency', currency: 'CAD', minimumFractionDigits: 0}).format(ottawaData.averageDownPayment)}</div>
                  <div className="text-sm text-gray-600 mt-1">Min. Down Payment</div>
                  <div className="text-xs text-gray-500 mt-1">5% CMHC Rule</div>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Land Transfer Tax:</span>
                  <span className="font-semibold text-gray-900">{ottawaData.landTransferTax}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Market Trend:</span>
                  <span className="font-semibold text-green-600">{ottawaData.marketTrend}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Government Jobs:</span>
                  <span className="font-semibold text-blue-600">Federal employment hub</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Special Programs:</span>
                  <span className="font-semibold text-purple-600">Federal employee rates</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                href="mailto:hello@mortgagewithford.ca?subject=Ottawa Mortgage Pre-Approval"
                className="inline-block bg-gradient-to-r from-red-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                Get Pre-Approved in Ottawa →
              </Link>
              <p className="mt-3 text-sm text-gray-500">
                Federal employee specialist • Ottawa mortgage experts
              </p>
            </div>
          </div>
        </div>

        {/* Ottawa Features */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Ottawa Mortgages Are Different
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏛️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Federal Employees</h3>
              <p className="text-gray-600 text-sm">
                Special mortgage rates and programs available for government workers in Canada's capital.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Municipal Tax</h3>
              <p className="text-gray-600 text-sm">
                Ottawa has no municipal land transfer tax, saving thousands compared to Toronto.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Stable Market</h3>
              <p className="text-gray-600 text-sm">
                Government town with steady employment and consistent real estate demand.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🇨🇦</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">CMHC Expertise</h3>
              <p className="text-gray-600 text-sm">
                Deep knowledge of CMHC programs - the corporation is headquartered right here in Ottawa.
              </p>
            </div>
          </div>
        </div>

        {/* Educational Content */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Ottawa Mortgage Guide
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Federal Employee Benefits
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <strong>Preferred Rates:</strong> Up to 0.25% discount on posted rates
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <strong>Flexible Terms:</strong> Extended amortization options
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <strong>Job Security:</strong> Stable employment recognized by lenders
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <strong>Pension Income:</strong> Future pension can count toward qualification
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Ottawa Market Advantages
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  No municipal land transfer tax (save $5,000-$15,000)
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  More affordable than Toronto and Vancouver
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Stable government employment base
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Growing tech sector complementing government jobs
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Tools */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Free Ottawa Mortgage Tools
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Link
              href="/mortgage-payment-calculator"
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Payment Calculator
              </h3>
              <p className="text-gray-600">
                Calculate exact monthly payments for any Ottawa home price and down payment.
              </p>
            </Link>
            
            <Link
              href="/mortgage-affordability-calculator"
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Affordability Calculator
              </h3>
              <p className="text-gray-600">
                Determine how much house you can afford in Ottawa based on your government salary.
              </p>
            </Link>
            
            <Link
              href="/heloc-payment-calculator"
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                HELOC Calculator
              </h3>
              <p className="text-gray-600">
                Calculate Home Equity Line of Credit payments for your Ottawa property.
              </p>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #DC2626;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);
          transition: all 0.3s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          background: #B91C1C;
          transform: scale(1.1);
          box-shadow: 0 6px 12px rgba(220, 38, 38, 0.5);
        }
        .slider::-webkit-slider-track {
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(to right, #DC2626 0%, #DC2626 var(--value, 0%), #E5E7EB var(--value, 0%), #E5E7EB 100%);
        }
      `}</style>
    </BackgroundTexture>
  );
}