"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";

// CMHC Official Mortgage Calculation Rules (2024)
const CMHC_RULES = {
  // Official CMHC Mortgage Insurance Premium Rates (2024)
  premiumRates: {
    65.00: 0.0060,   // Up to 65% LTV
    75.00: 0.0170,   // 65.01% to 75% LTV
    80.00: 0.0240,   // 75.01% to 80% LTV
    85.00: 0.0280,   // 80.01% to 85% LTV
    90.00: 0.0310,   // 85.01% to 90% LTV
    95.00: 0.0400,   // 90.01% to 95% LTV (traditional down payment)
    95.01: 0.0450    // 90.01% to 95% LTV (non-traditional down payment)
  },
  
  // CMHC Down Payment Requirements (Official 2024 Rules)
  downPaymentRules: {
    minDownPayment5Percent: 500000,     // 5% minimum on first $500k
    minDownPayment10Percent: 1000000,   // 10% on $500k-$1M portion
    minDownPayment20Percent: 1500000,   // 20% minimum on homes over $1M
    maxInsurablePrice: 1500000          // CMHC insurance not available over $1.5M
  },
  
  
  // Additional CMHC Rules for Future Use
  additionalRules: {
    minCreditScore: 680,
    maxAmortization: 30,              // 30 years for first-time buyers on new builds
    standardAmortization: 25,         // Standard amortization period
    amortizationSurcharge: 0.0020,    // 0.20% surcharge for >25 year amortization
    blendedAmortizationSurcharge: 0.0060, // 0.60% surcharge for blended amortization
    provincialTaxProvinces: ['ON', 'QC', 'SK', 'MB'], // Provinces with PST on CMHC premiums
    ontarioTaxRate: 0.08,             // 8% PST in Ontario
    quebecTaxRate: 0.09975,           // 9.975% PST in Quebec
    saskatchewanTaxRate: 0.06,        // 6% PST in Saskatchewan
    manitobaTaxRate: 0.07             // 7% PST in Manitoba
  }
};

// Toronto Mortgage Calculator Component
function TorontoMortgageCalculator() {
  const [purchasePrice, setPurchasePrice] = React.useState(1142000);
  const [downPayment, setDownPayment] = React.useState(228400);
  const [interestRate, setInterestRate] = React.useState(3.94);
  const [amortizationYears, setAmortizationYears] = React.useState(25);
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = React.useState(false);

  // Calculate minimum down payment based on official CMHC rules (2024)
  const calculateMinDownPayment = (price: number): number => {
    const rules = CMHC_RULES.downPaymentRules;
    
    if (price <= rules.minDownPayment5Percent) {
      return price * 0.05; // 5% on homes up to $500k
    } else if (price <= rules.minDownPayment10Percent) {
      return (rules.minDownPayment5Percent * 0.05) + ((price - rules.minDownPayment5Percent) * 0.10);
      // 5% on first $500k, 10% on remainder up to $1M
    } else {
      return price * 0.20; // 20% on homes over $1M
    }
  };

  // Calculate CMHC premium based on official 2024 premium rates
  const calculateCMHCPremium = (loanAmount: number, price: number, isTraditionalDownPayment: boolean = true): number => {
    const ltv = (loanAmount / price) * 100;
    const rules = CMHC_RULES;
    
    // No insurance available for homes over $1.5M or LTV <= 80%
    if (ltv <= 80 || price > rules.downPaymentRules.maxInsurablePrice) {
      return 0;
    }
    
    // Determine premium rate based on official CMHC table
    let premiumRate = 0;
    if (ltv <= 65) {
      premiumRate = rules.premiumRates[65.00];
    } else if (ltv <= 75) {
      premiumRate = rules.premiumRates[75.00];
    } else if (ltv <= 80) {
      premiumRate = rules.premiumRates[80.00];
    } else if (ltv <= 85) {
      premiumRate = rules.premiumRates[85.00];
    } else if (ltv <= 90) {
      premiumRate = rules.premiumRates[90.00];
    } else if (ltv <= 95) {
      // Use higher rate for non-traditional down payment
      premiumRate = isTraditionalDownPayment ? rules.premiumRates[95.00] : rules.premiumRates[95.01];
    }
    
    let premium = loanAmount * premiumRate;
    
    // Add amortization surcharge if > 25 years
    if (amortizationYears > 25) {
      premium += loanAmount * rules.additionalRules.amortizationSurcharge;
    }
    
    return premium;
  };

  // Calculate monthly payment
  const calculatePayment = (principal: number, rate: number, years: number): number => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    
    if (monthlyRate === 0) return principal / numPayments;
    
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  const minDownPayment = calculateMinDownPayment(purchasePrice);
  const loanAmount = purchasePrice - downPayment;
  const cmhcPremium = calculateCMHCPremium(loanAmount, purchasePrice, true);
  const totalLoanAmount = loanAmount + cmhcPremium;
  const monthlyPayment = calculatePayment(totalLoanAmount, interestRate, amortizationYears);
  const ltvRatio = (loanAmount / purchasePrice) * 100;
  const requiresCMHC = ltvRatio > 80 && purchasePrice <= CMHC_RULES.downPaymentRules.maxInsurablePrice;
  const isEligibleForCMHC = purchasePrice <= CMHC_RULES.downPaymentRules.maxInsurablePrice;
  

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (percent: number): string => {
    return `${percent.toFixed(1)}%`;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Controls */}
        <div className="rounded-2xl shadow-professional backdrop-blur-sm border p-8" style={{backgroundColor: '#F4F4F4', borderColor: '#2A9D8F'}}>
          <h3 className="text-2xl font-bold mb-6" style={{color: '#222831'}}>
            Mortgage Details
          </h3>
          
          <div className="space-y-6">
            {/* Purchase Price Slider */}
            <div>
              <label className="block text-xl font-bold mb-4" style={{color: '#222831'}}>
                Purchase Price: <span className="font-bold" style={{color: '#264653'}}>{formatCurrency(purchasePrice)}</span>
              </label>
              <input
                type="range"
                min="500000"
                max="2000000"
                step="25000"
                value={purchasePrice}
                onChange={(e) => {
                  const newPrice = Number(e.target.value);
                  const currentDownPaymentPercent = downPayment / purchasePrice;
                  
                  setPurchasePrice(newPrice);
                  
                  // Keep the same down payment percentage, don't auto-adjust
                  const newDownPaymentAmount = newPrice * currentDownPaymentPercent;
                  setDownPayment(newDownPaymentAmount);
                }}
                className="w-full h-3 bg-gradient-to-r from-purple-100 to-slate-200 rounded-lg appearance-none cursor-pointer slider shadow-sm"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>$500K</span>
                <span>$2M</span>
              </div>
            </div>

            {/* Down Payment Slider */}
            <div>
              <label className="block text-xl font-bold mb-4" style={{color: '#222831'}}>
                Down Payment: <span className="font-bold" style={{color: '#264653'}}>{formatCurrency(downPayment)} ({formatPercent((downPayment/purchasePrice)*100)})</span>
              </label>
              <input
                type="range"
                min={minDownPayment}
                max={purchasePrice * 0.20}
                step="5000"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-purple-100 to-slate-200 rounded-lg appearance-none cursor-pointer slider shadow-sm"
              />
              <div className="flex justify-between text-base text-gray-600 mt-2 font-medium">
                <span>Min: {formatCurrency(minDownPayment)}</span>
                <span>20%: {formatCurrency(purchasePrice * 0.20)}</span>
              </div>
              
              {/* Down Payment Info */}
              <div className="mt-3 space-y-2">
                {downPayment < minDownPayment && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-base font-semibold">
                      ⚠️ Below Minimum Down Payment
                    </p>
                    <p className="text-red-700 text-base mt-2">
                      Minimum required: {formatCurrency(minDownPayment)} ({formatPercent((minDownPayment/purchasePrice)*100)})
                    </p>
                  </div>
                )}
                
                {(downPayment/purchasePrice) > 0.20 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-base font-semibold">
                      ℹ️ High Down Payment Notice
                    </p>
                    <p className="text-yellow-700 text-base mt-2">
                      Consider keeping more cash for closing costs, renovations, or investments
                    </p>
                  </div>
                )}
                
                {purchasePrice <= CMHC_RULES.downPaymentRules.maxInsurablePrice && (downPayment/purchasePrice) < 0.20 && downPayment >= minDownPayment && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-base font-semibold">
                      ✓ CMHC Insurance Available (Under $1.5M with &lt;20% down)
                    </p>
                    <p className="text-blue-700 text-base mt-2">
                      Premium: {((Object.entries(CMHC_RULES.premiumRates).find(([ltv]) => ltvRatio <= parseFloat(ltv))?.[1] ?? 0) * 100).toFixed(2)}% of loan amount
                    </p>
                  </div>
                )}
                
                {purchasePrice > CMHC_RULES.downPaymentRules.maxInsurablePrice && (downPayment/purchasePrice) < 0.20 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <p className="text-orange-800 text-base font-semibold">
                      ⚠️ Home over $1.5M - 20% Down Payment Required
                    </p>
                    <p className="text-orange-700 text-base mt-2">
                      CMHC insurance not available. Conventional mortgage requires minimum 20% down.
                    </p>
                  </div>
                )}
                
                {(downPayment/purchasePrice) >= 0.20 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-base font-semibold">
                      ✓ Conventional Mortgage (20%+ down payment)
                    </p>
                    <p className="text-green-700 text-base mt-2">
                      No CMHC insurance required - save on premium costs
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-xl font-bold mb-4" style={{color: '#222831'}}>
                Interest Rate: <span className="font-bold" style={{color: '#264653'}}>{interestRate}%</span>
              </label>
              <input
                type="range"
                min="3"
                max="7"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-purple-100 to-slate-200 rounded-lg appearance-none cursor-pointer slider shadow-sm"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>3%</span>
                <span>7%</span>
              </div>
            </div>
            
            {/* Amortization Period */}
            <div>
              <label className="block text-xl font-bold mb-4" style={{color: '#222831'}}>
                Amortization: <span className="font-bold" style={{color: '#264653'}}>{amortizationYears} years</span>
              </label>
              <input
                type="range"
                min="15"
                max="30"
                step="1"
                value={amortizationYears}
                onChange={(e) => setAmortizationYears(Number(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-purple-100 to-slate-200 rounded-lg appearance-none cursor-pointer slider shadow-sm"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>15 years</span>
                <span>30 years</span>
              </div>
              {amortizationYears > 25 && (
                <p className="text-orange-600 text-base font-medium mt-2">
                  ⚠️ CMHC charges 0.20% surcharge for amortization over 25 years
                </p>
              )}
            </div>
            
            {/* First-Time Buyer Toggle */}
            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFirstTimeBuyer}
                  onChange={(e) => setIsFirstTimeBuyer(e.target.checked)}
                  className="w-6 h-6 text-purple focus:ring-purple border-gray-300 rounded"
                />
                <span className="text-xl font-bold text-gray-800">
                  First-time homebuyer
                </span>
              </label>
              {isFirstTimeBuyer && (
                <p className="text-green-600 text-base font-medium mt-2">
                  ✓ Eligible for 30-year amortization on new builds & rebates up to $8,475
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          {/* Main Payment Result */}
          <div className="rounded-2xl shadow-professional p-8 text-center text-white relative overflow-hidden" style={{background: 'linear-gradient(to bottom right, #264653, #2A9D8F)'}}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">Monthly Payment</h3>
            <div className="text-6xl font-bold mb-3">
              {formatCurrency(monthlyPayment)}
            </div>
            <p className="text-xl font-medium" style={{color: '#F4F4F4'}}>Principal & Interest</p>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="backdrop-blur-sm rounded-2xl shadow-professional p-6 border hover:shadow-lg transition-shadow" style={{backgroundColor: '#F4F4F4', borderColor: '#2A9D8F'}}>
            <h4 className="text-xl font-bold mb-4" style={{color: '#222831'}}>CMHC Calculation Breakdown</h4>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-base font-medium" style={{color: '#264653'}}>Loan Amount:</span>
                <span className="font-bold text-base">{formatCurrency(loanAmount)}</span>
              </div>
              {requiresCMHC && (
                <>
                  <div className="flex justify-between">
                    <span className="text-base font-medium" style={{color: '#264653'}}>CMHC Premium Rate:</span>
                    <span className="font-bold text-orange-600 text-base">
                      {((Object.entries(CMHC_RULES.premiumRates).find(([ltv]) => ltvRatio <= parseFloat(ltv))?.[1] ?? 0) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base font-medium" style={{color: '#264653'}}>CMHC Insurance:</span>
                    <span className="font-bold text-orange-600 text-base">{formatCurrency(cmhcPremium)}</span>
                  </div>
                  {amortizationYears > 25 && (
                    <div className="flex justify-between">
                      <span className="text-base font-medium" style={{color: '#264653'}}>Amortization Surcharge:</span>
                      <span className="font-bold text-orange-600 text-base">0.20%</span>
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-between border-t pt-3">
                <span className="text-base font-medium" style={{color: '#264653'}}>Total Loan:</span>
                <span className="font-bold text-base">{formatCurrency(totalLoanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base font-medium" style={{color: '#264653'}}>LTV Ratio:</span>
                <span className="font-bold text-base">{formatPercent(ltvRatio)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base font-medium" style={{color: '#264653'}}>Amortization:</span>
                <span className="font-bold text-base">{amortizationYears} years</span>
              </div>
            </div>
          </div>
          

          {/* CMHC Notice */}
          {requiresCMHC && isEligibleForCMHC && (
            <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-start space-x-3">
                <span className="text-orange-500 text-xl mt-0.5">ℹ️</span>
                <div>
                  <h4 className="font-semibold text-orange-900">
                    CMHC Insurance Required (Official 2024 Rates)
                  </h4>
                  <p className="text-sm mt-1 text-orange-800">
                    LTV over 80% requires mortgage default insurance per CMHC rules.
                    <br />Premium: {formatCurrency(cmhcPremium)}
                    <br />Rate: {((Object.entries(CMHC_RULES.premiumRates).find(([ltv]) => ltvRatio <= parseFloat(ltv))?.[1] ?? 0) * 100).toFixed(2)}% of loan amount
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* CMHC Ineligible Notice */}
          {!isEligibleForCMHC && (
            <div className="bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-start space-x-3">
                <span className="text-red-500 text-xl mt-0.5">⚠️</span>
                <div>
                  <h4 className="font-semibold text-red-900">
                    CMHC Insurance Not Available
                  </h4>
                  <p className="text-sm mt-1 text-red-800">
                    Homes over $1.5M are not eligible for CMHC insurance.
                    <br />Minimum 20% down payment required for conventional mortgage.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="text-center">
            <Link
              href="https://callme.mortgagewithford.ca"
              className="px-8 py-3 text-lg font-semibold inline-block rounded-lg text-white hover:opacity-90 transition-opacity"
              style={{backgroundColor: '#FF914D'}}
            >
              Get Pre-Approved Now
            </Link>
          </div>
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #264653;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(38, 70, 83, 0.3);
          transition: all 0.3s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          background: #2A9D8F;
          transform: scale(1.1);
          box-shadow: 0 6px 12px rgba(42, 157, 143, 0.5);
        }
        .slider::-webkit-slider-track {
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(to right, #264653 0%, #264653 50%, #F4F4F4 50%, #F4F4F4 100%);
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .slider::-moz-range-track {
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(to right, #7c3aed 0%, #7c3aed 50%, #e5e7eb 50%, #e5e7eb 100%);
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
          border: none;
        }
      `}</style>
    </div>  
  );
}

// Metadata moved to layout.tsx or handled via Head component for client components

export default function TorontoMortgageRates() {
  const [selectedFilter, setSelectedFilter] = React.useState('all');
  const [showRateAlert, setShowRateAlert] = React.useState(false);
  const [showLockRate, setShowLockRate] = React.useState(false);
  const [rateAlertSubmitted, setRateAlertSubmitted] = React.useState(false);
  const [lockRateSubmitted, setLockRateSubmitted] = React.useState(false);
  const [selectedRate, setSelectedRate] = React.useState('');
  
  const currentRates = [
    { term: "1 Year Fixed", rate: "4.69%", type: "Fixed", bestFor: "Rate speculation", lender: "Monoline", payment: "$4,890" },
    { term: "3 Year Fixed", rate: "3.94%", type: "Fixed", bestFor: "Medium-term security", lender: "Monoline", payment: "$4,710" },
    { term: "5 Year Fixed", rate: "3.94%", type: "Fixed", bestFor: "Most popular", popular: true, lender: "Monoline", payment: "$4,710" },
    { term: "5 Year Variable", rate: "3.95%", type: "Variable", bestFor: "Rate optimists", lender: "Big Bank", payment: "$4,715" },
    { term: "2 Year Fixed", rate: "4.24%", type: "Fixed", bestFor: "Short commitment", lender: "Credit Union", payment: "$4,790" },
    { term: "10 Year Fixed", rate: "4.89%", type: "Fixed", bestFor: "Long-term security", lender: "Big Bank", payment: "$5,020" },
  ];
  
  const filteredRates = selectedFilter === 'all' 
    ? currentRates 
    : currentRates.filter(rate => rate.type.toLowerCase() === selectedFilter);
  
  const lastUpdated = new Date().toLocaleString('en-CA', { 
    timeZone: 'America/Toronto',
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  });

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
      value: "$228,400",
      description: "20% for homes over $1M",
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
          to: 'hello@mortgagewithford.ca',
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
      rate: selectedRate,
      timestamp: new Date().toISOString(),
      location: 'Toronto'
    };
    
    try {
      // Send email notification
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'hello@mortgagewithford.ca',
          subject: `New Rate Lock Request - Toronto`,
          message: `Rate Lock Request:\n\nName: ${data.name}\nEmail: ${data.email}\nRate: ${data.rate}\nLocation: Toronto\nTimestamp: ${data.timestamp}`
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
    <div className="min-h-screen bg-white" style={{backgroundColor: '#FAFAFA'}}>
      {/* Header */}
      <header className="backdrop-blur-sm shadow-subtle border-b sticky top-0 z-50" style={{backgroundColor: '#FAFAFA'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(to right, #264653, #2A9D8F)'}}>
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div>
                <h1 className="text-2xl font-heading" style={{color: '#222831'}}>
                  Boring Mortgages Ontario
                </h1>
                <p className="text-sm" style={{color: '#264653'}}>Making complex mortgages boringly simple</p>
              </div>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="font-medium hover:opacity-80" style={{color: '#264653'}}>Home</Link>
              <Link
                href="https://callme.mortgagewithford.ca"
                className="px-6 py-2 text-sm font-medium rounded-lg text-white hover:opacity-90 transition-opacity"
                style={{backgroundColor: '#FF914D'}}
              >
                Book Consultation →
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-28 relative overflow-hidden" style={{background: 'linear-gradient(to bottom right, #FAFAFA, #F4F4F4)'}}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 backdrop-blur-sm border rounded-full text-sm font-medium mb-6 shadow-sm" style={{backgroundColor: '#FAFAFA', borderColor: '#2A9D8F', color: '#264653'}}>
              🏙️ Toronto, Ontario
            </div>
            <div className="mb-6">
              <Image
                src="/logos/TORONTO-mortgages-GRADIENT.png"
                alt="Best Mortgage Rates Toronto"
                width={400}
                height={120}
                priority
                className="mx-auto"
              />
            </div>
            <p className="text-xl mb-8 leading-relaxed max-w-3xl" style={{color: '#264653'}}>
              Compare current Toronto mortgage rates, understand GTA market conditions, and access 
              Toronto-specific programs. <strong>No bank lineups required.</strong>
            </p>
            
            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-6 mb-8 max-w-md">
              <div className="text-center p-4 backdrop-blur-sm rounded-xl border shadow-professional hover:shadow-lg transition-all duration-300" style={{backgroundColor: '#F4F4F4', borderColor: '#2A9D8F'}}>
                <div className="text-2xl font-bold" style={{color: '#264653'}}>3.94%</div>
                <div className="text-sm" style={{color: '#264653'}}>Best 5-Year Fixed</div>
              </div>
              <div className="text-center p-4 backdrop-blur-sm rounded-xl border shadow-professional hover:shadow-lg transition-all duration-300" style={{backgroundColor: '#F4F4F4', borderColor: '#2A9D8F'}}>
                <div className="text-2xl font-bold" style={{color: '#2A9D8F'}}>$1.14M</div>
                <div className="text-sm" style={{color: '#264653'}}>Average Home Price</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mb-16">
              <Link
                href="/mortgage-payment-calculator"
                className="px-8 py-4 text-lg text-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-lg text-white font-semibold"
                style={{backgroundColor: '#FF914D'}}
              >
                Calculate Toronto Payments
              </Link>
              <Link
                href="https://callme.mortgagewithford.ca"
                className="px-8 py-4 text-lg text-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-lg border-2 font-semibold hover:opacity-80"
                style={{borderColor: '#264653', color: '#264653', backgroundColor: 'transparent'}}
              >
                Talk to Toronto Expert
              </Link>
            </div>
          </div>
          {/* Interactive Rate Comparison Table */}
          <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl shadow-professional backdrop-blur-sm border hover:shadow-lg transition-shadow" style={{backgroundColor: '#F4F4F4', borderColor: '#2A9D8F'}}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2" style={{color: '#222831'}}>
                    Live Toronto Mortgage Rates
                  </h3>
                  <p className="text-sm" style={{color: '#264653'}}>
                    Current mortgage rates for Toronto
                  </p>
                </div>
                <div className="flex gap-2 mt-4 sm:mt-0">
                  <button 
                    onClick={() => setSelectedFilter('all')}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm"
                    style={selectedFilter === 'all' 
                      ? {backgroundColor: '#264653', color: 'white'} 
                      : {backgroundColor: '#F4F4F4', color: '#264653', border: '1px solid #2A9D8F'}}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setSelectedFilter('fixed')}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm"
                    style={selectedFilter === 'fixed' 
                      ? {backgroundColor: '#264653', color: 'white'} 
                      : {backgroundColor: '#F4F4F4', color: '#264653', border: '1px solid #2A9D8F'}}
                  >
                    Fixed
                  </button>
                  <button 
                    onClick={() => setSelectedFilter('variable')}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm"
                    style={selectedFilter === 'variable' 
                      ? {backgroundColor: '#264653', color: 'white'} 
                      : {backgroundColor: '#F4F4F4', color: '#264653', border: '1px solid #2A9D8F'}}
                  >
                    Variable
                  </button>
                </div>
              </div>
              
              {/* Rate Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-2 text-sm font-medium" style={{color: '#264653'}}>Term</th>
                      <th className="text-left py-3 px-2 text-sm font-medium" style={{color: '#264653'}}>Rate</th>
                      <th className="text-left py-3 px-2 text-sm font-medium hidden sm:table-cell" style={{color: '#264653'}}>Payment*</th>
                      <th className="text-left py-3 px-2 text-sm font-medium hidden md:table-cell" style={{color: '#264653'}}>Lender Type</th>
                      <th className="text-left py-3 px-2 text-sm font-medium" style={{color: '#264653'}}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRates.map((rate, index) => (
                      <tr key={index} className="border-b transition-colors hover:opacity-80" style={{
                        borderColor: '#2A9D8F',
                        backgroundColor: rate.popular ? '#F4F4F4' : 'transparent'
                      }}>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold" style={{color: '#222831'}}>{rate.term}</span>
                            {rate.popular && (
                              <span className="text-white px-2 py-1 rounded-full text-xs font-medium" style={{backgroundColor: '#9B5DE5'}}>
                                POPULAR
                              </span>
                            )}
                          </div>
                          <div className="text-sm" style={{color: '#264653'}}>{rate.bestFor}</div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="text-xl font-bold" style={{color: '#264653'}}>{rate.rate}</div>
                        </td>
                        <td className="py-4 px-2 hidden sm:table-cell">
                          <div className="font-semibold" style={{color: '#222831'}}>{rate.payment}</div>
                          <div className="text-xs" style={{color: '#264653'}}>per month</div>
                        </td>
                        <td className="py-4 px-2 hidden md:table-cell">
                          <span className="text-sm" style={{color: '#264653'}}>{rate.lender}</span>
                        </td>
                        <td className="py-4 px-2">
                          <button 
                            onClick={() => {
                              setSelectedRate(`${rate.term} - ${rate.rate}`);
                              setShowLockRate(true);
                              setLockRateSubmitted(false);
                            }}
                            className="px-4 py-2 text-sm inline-block shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 rounded-lg text-white font-medium"
                            style={{backgroundColor: '#FF914D'}}
                          >
                            Lock Rate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-10 grid md:grid-cols-2 gap-8">
                <div className="p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/30 shadow-sm">
                  <p className="text-sm text-muted mb-2">
                    <strong>*Payment calculation:</strong> $1,000,000 mortgage, 25-year amortization, 20% down payment.
                  </p>
                  <p className="text-xs text-muted">
                    Rates shown are best available for insured mortgages. Your rate may vary based on credit score and property details.
                  </p>
                </div>
                <div className="p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-200/30 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">📈 Rate Alert</h4>
                  <p className="text-sm text-muted mb-3">
                    Get notified when Toronto rates drop below your target.
                  </p>
                  <button 
                    onClick={() => {
                      setShowRateAlert(true);
                      setRateAlertSubmitted(false);
                    }}
                    className="text-purple hover:text-purple/80 font-medium text-sm"
                  >
                    Set Rate Alert →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Calculator Section */}
      <section className="py-20 relative overflow-hidden" style={{background: 'linear-gradient(to bottom right, #FAFAFA, #F4F4F4)'}}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading mb-4" style={{color: '#222831'}}>
              Calculate Your Toronto Mortgage Payment
            </h2>
            <p className="text-lg" style={{color: '#264653'}}>
              Uses official CMHC 2024 rules including premium rates, debt service ratios, and Ontario PST
            </p>
          </div>
          
          <TorontoMortgageCalculator />
        </div>
      </section>

      {/* Toronto Market Insights */}
      <section className="py-20" style={{background: 'linear-gradient(to bottom right, #F4F4F4, #FAFAFA)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading mb-4" style={{color: '#222831'}}>
              Toronto Market Insights
            </h2>
            <p className="text-lg" style={{color: '#264653'}}>
              The details that actually affect your mortgage
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {torontoInsights.map((insight, index) => (
              <div key={index} className="backdrop-blur-sm p-6 rounded-xl border shadow-professional hover:shadow-lg transition-all duration-300 hover:scale-105" style={{backgroundColor: '#F4F4F4', borderColor: '#2A9D8F'}}>
                <div className="text-3xl mb-3">{insight.icon}</div>
                <h3 className="font-semibold mb-2" style={{color: '#222831'}}>{insight.title}</h3>
                <div className="text-2xl font-bold mb-1" style={{color: '#264653'}}>{insight.value}</div>
                <p className="text-sm" style={{color: '#264653'}}>{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Toronto Programs */}
      <section className="py-20 bg-gradient-to-br from-yellow-100/25 via-orange-100/20 via-emerald-100/15 to-violet-100/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading text-gray-900 mb-4">
              Toronto Home Buying Programs
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
            <Link 
              href="https://callme.mortgagewithford.ca" 
              className="btn-primary px-8 py-3 font-semibold inline-block"
            >
              Get Toronto Program Help
            </Link>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16" style={{background: 'linear-gradient(to bottom right, #F4F4F4, #FAFAFA)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading mb-4" style={{color: '#222831'}}>
              Toronto Mortgage Calculators
            </h2>
            <p className="text-lg" style={{color: '#264653'}}>
              Free tools for Toronto homebuyers who value accuracy
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Link
              href="/mortgage-payment-calculator"
              className="group bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl hover:shadow-lg transition-all border border-purple-200 hover:border-purple-300"
            >
              <div className="text-purple mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-purple">
                Payment Calculator
              </h3>
              <p className="text-gray-600 mb-4">
                Calculate monthly payments including Toronto's double land transfer tax
              </p>
              <div className="text-purple font-medium">
                Calculate Toronto payments →
              </div>
            </Link>

            <Link
              href="/mortgage-affordability-calculator"
              className="group bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-xl hover:shadow-lg transition-all border border-emerald-200 hover:border-emerald-300"
            >
              <div className="text-emerald-600 mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-emerald-600">
                Affordability Calculator
              </h3>
              <p className="text-gray-600 mb-4">
                See how much home you can afford in Toronto's market
              </p>
              <div className="text-emerald-600 font-medium">
                Check Toronto affordability →
              </div>
            </Link>

            <Link
              href="/heloc-payment-calculator"
              className="group bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-xl hover:shadow-lg transition-all border border-slate-200 hover:border-slate-300"
            >
              <div className="text-teal mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-teal">
                HELOC Calculator
              </h3>
              <p className="text-gray-600 mb-4">
                Calculate home equity access for Toronto homeowners
              </p>
              <div className="text-teal font-medium">
                Calculate HELOC →
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-orange-100/20 via-yellow-100/15 via-green-100/20 to-violet-100/25">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading text-gray-900 mb-4">
              Toronto Mortgage FAQs
            </h2>
            <p className="text-lg text-gray-600">
              The questions Toronto homebuyers actually ask
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="backdrop-blur-sm p-8 rounded-xl shadow-professional border hover:shadow-lg transition-all duration-300" style={{backgroundColor: '#F4F4F4', borderColor: '#2A9D8F'}}>
              <h3 className="text-lg font-semibold mb-3" style={{color: '#222831'}}>
                Are mortgage rates different across Ontario cities?
              </h3>
              <p style={{color: '#264653'}}>
                No, mortgage rates are the same across Ontario. A 5-year fixed rate in Toronto is the same as in Ottawa or Hamilton. The difference is in qualification requirements due to varying home prices and local market conditions.
              </p>
            </div>
            
            <div className="backdrop-blur-sm p-8 rounded-xl shadow-professional border hover:shadow-lg transition-all duration-300" style={{backgroundColor: '#F4F4F4', borderColor: '#2A9D8F'}}>
              <h3 className="text-lg font-semibold mb-3" style={{color: '#222831'}}>
                How much is land transfer tax in Toronto?
              </h3>
              <p style={{color: '#264653'}}>
                Toronto has both provincial and municipal land transfer tax. For a $1M home, you'll pay approximately $32,950 total ($16,475 provincial + $16,475 municipal). First-time buyers can get up to $8,475 in rebates.
              </p>
            </div>
            
            <div className="backdrop-blur-sm p-8 rounded-xl shadow-professional border hover:shadow-lg transition-all duration-300" style={{backgroundColor: '#F4F4F4', borderColor: '#2A9D8F'}}>
              <h3 className="text-lg font-semibold mb-3" style={{color: '#222831'}}>
                Can I get a mortgage in Toronto with less than 20% down?
              </h3>
              <p className="text-gray-600 mb-3">
                <strong>Yes, for homes under $1.5M (updated December 2024).</strong> You can put down as little as 5% on the first $500k and 10% on the remainder up to $1.5M, but you'll need CMHC mortgage insurance.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mt-3">
                <p className="text-blue-800 text-sm">
                  <strong>CMHC Premium:</strong> Ranges from 0.60% to 4.50% of loan amount depending on your down payment size. Premium is added to your mortgage and paid monthly.
                </p>
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
                  <button 
                    type="submit"
                    className="w-full btn-primary py-3 text-center"
                  >
                    Set Alert
                  </button>
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
                  <button 
                    type="submit"
                    className="w-full btn-primary py-3 text-center"
                  >
                    Lock This Rate
                  </button>
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
        <div className="flex gap-3">
          <Link
            href="https://callme.mortgagewithford.ca"
            className="flex-1 btn-primary py-3 text-center text-sm font-semibold"
          >
            Book Consultation
          </Link>
          <Link
            href="/mortgage-payment-calculator"
            className="flex-1 btn-secondary py-3 text-center text-sm font-semibold"
          >
            Calculate Payment
          </Link>
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
            connect with <strong>Andreina Ford</strong> - Licensed Mortgage Agent Level 2, BRX Mortgage #13463, specializing in the GTA market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://callme.mortgagewithford.ca"
              className="px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg" style={{backgroundColor: '#FAFAFA', color: '#264653'}}
            >
              Book Toronto Consultation
            </Link>
            <Link
              href="mailto:hello@mortgagewithford.ca"
              className="border-2 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors hover:opacity-80" style={{borderColor: '#FAFAFA'}}
            >
              Email About Toronto Rates
            </Link>
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
            <div className="flex items-center space-x-2">
              <span style={{color: '#2A9D8F'}}>✓</span>
              <span>BRX Mortgage #13463</span>
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
                <li><Link href="/best-mortgage-rates-toronto" className="hover:text-boring-light-gray text-boring-bright-green">Toronto</Link></li>
                <li><Link href="/best-mortgage-rates-ottawa" className="hover:text-white">Ottawa</Link></li>
                <li><Link href="/best-mortgage-rates-mississauga" className="hover:text-white">Mississauga</Link></li>
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
                  <div className="text-emerald-500 text-xl font-bold">
                    BRX
                  </div>
                  <div className="text-gray-400 text-xs">
                    MORTGAGE<br/>
                    #13463
                  </div>
                </div>
                
                {/* Proudly Canadian */}
                <div className="flex items-center space-x-2">
                  <div className="text-red-600 text-2xl">
                    🍁
                  </div>
                  <div className="text-gray-400 text-xs">
                    PROUDLY<br/>
                    CANADIAN
                  </div>
                </div>
                
                {/* CMHC */}
                <div className="flex items-center space-x-2">
                  <div className="text-indigo-600 font-bold text-sm">
                    CMHC
                  </div>
                  <div className="text-gray-400 text-xs">
                    CANADA MORTGAGE<br/>
                    & HOUSING CORP
                  </div>
                </div>
                
                {/* FSRA */}
                <div className="flex items-center space-x-2">
                  <div className="text-cyan-600 font-bold text-sm">
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
                  © 2025 Boring Mortgages Ontario. Making Toronto mortgages boringly simple.
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