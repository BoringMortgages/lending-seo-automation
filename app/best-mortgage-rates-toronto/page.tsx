"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import ContactForm from "../../components/ContactForm";

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

// CMHC Official Mortgage Calculation Rules (2025)
const CMHC_RULES = {
  // Official CMHC Mortgage Insurance Premium Rates (2025)
  premiumRates: {
    65.00: 0.0060,   // Up to 65% LTV
    75.00: 0.0170,   // 65.01% to 75% LTV
    80.00: 0.0240,   // 75.01% to 80% LTV
    85.00: 0.0280,   // 80.01% to 85% LTV
    90.00: 0.0310,   // 85.01% to 90% LTV
    95.00: 0.0400,   // 90.01% to 95% LTV (traditional down payment)
    95.01: 0.0450    // 90.01% to 95% LTV (non-traditional down payment)
  },
  
  // CMHC Down Payment Requirements (Official 2025 Rules)
  downPaymentRules: {
    minDownPayment5Percent: 500000,     // 5% minimum on first $500k
    minDownPayment10Percent: 1000000,   // 10% on $500k-$1M portion
    minDownPayment20Percent: 1500000,   // 20% minimum on homes over $1M
    maxInsurablePrice: 1500000          // CMHC insurance available up to $1.5M
  },
  
  
  // 2025 Amortization Surcharges
  amortizationSurcharges: {
    standard: 0.0000,                   // Up to 25 years: 0.00%
    extended: 0.0025,                   // 26-30 years: +0.25%
    firstTimeBuyerNewBuild: 0.0020,     // Additional +0.20% for FTB new builds (30yr)
  },

  // 2025 High-Ratio Surcharges ($1M-$1.5M)
  highRatioSurcharges: {
    millionToOneFiveM: 0.0025,          // +0.25% for homes $1M-$1.5M (high-ratio only)
  },

  // Additional CMHC Rules (2025 Update)
  additionalRules: {
    minCreditScore: 680,
    maxAmortization: 30,                // Max 30 years
    standardAmortization: 25,           // Standard amortization period
    firstTimeBuyerMaxAmortization: 30,  // 30 years for first-time buyers on new builds
    nonTraditionalSourcePremium: 0.0450, // 4.50% for borrowed down payments
 }
};

// Toronto Mortgage Calculator Component
function TorontoMortgageCalculator({ onOpenContactForm, currentRates }: { onOpenContactForm: () => void, currentRates: MortgageRate[] }) {
  const [purchasePrice, setPurchasePrice] = React.useState(1000000);
  const [downPayment, setDownPayment] = React.useState(200000);
  const [interestRate, setInterestRate] = React.useState(4.5);

  // Update interest rate when API rates are loaded
  React.useEffect(() => {
    if (currentRates.length > 0) {
      const fiveYearFixed = currentRates.find(r => r.term === "5 Year" && r.type === "Fixed");
      if (fiveYearFixed) {
        const rateNumber = parseFloat(fiveYearFixed.rate.replace('%', ''));
        setInterestRate(rateNumber);
      }
    }
  }, [currentRates]);

  // Auto-adjust down payment when purchase price changes
  React.useEffect(() => {
    const minDown = calculateMinDownPayment(purchasePrice);
    if (downPayment < minDown) {
      setDownPayment(minDown);
    }
  }, [purchasePrice]);

  const [amortizationYears, setAmortizationYears] = React.useState(25);
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = React.useState(false);
  const [isNewBuild, setIsNewBuild] = React.useState(false);
  const [isTraditionalDownPayment, setIsTraditionalDownPayment] = React.useState(true);

  // Calculate minimum down payment based on official CMHC rules (2025)
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

  // Calculate CMHC premium based on official 2025 premium rates and surcharges
  const calculateCMHCPremium = (loanAmount: number, price: number, isTraditionalDownPayment: boolean = true, isNewBuild: boolean = false): number => {
    const ltv = (loanAmount / price) * 100;
    const rules = CMHC_RULES;
    
    // No insurance available for homes over $1.5M or LTV <= 80%
    if (ltv <= 80 || price > rules.downPaymentRules.maxInsurablePrice) {
      return 0;
    }
    
    // Determine base premium rate based on official 2025 CMHC LTV table
    let premiumRate = 0;
    if (ltv <= 65) {
      premiumRate = rules.premiumRates[65.00];       // 0.60%
    } else if (ltv <= 75) {
      premiumRate = rules.premiumRates[75.00];       // 1.70%
    } else if (ltv <= 80) {
      premiumRate = rules.premiumRates[80.00];       // 2.40%
    } else if (ltv <= 85) {
      premiumRate = rules.premiumRates[85.00];       // 2.80%
    } else if (ltv <= 90) {
      premiumRate = rules.premiumRates[90.00];       // 3.10%
    } else if (ltv <= 95) {
      // Use higher rate for non-traditional/borrowed down payment
      premiumRate = isTraditionalDownPayment ? rules.premiumRates[95.00] : rules.premiumRates[95.01]; // 4.00% or 4.50%
    }
    
    let totalPremiumRate = premiumRate;
    
    // Add 2025 amortization surcharges
    if (amortizationYears > 25) {
      totalPremiumRate += rules.amortizationSurcharges.extended; // +0.25%
      
      // Additional surcharge for first-time buyers with new builds (30-year amortization)
      if (isFirstTimeBuyer && isNewBuild && amortizationYears === 30) {
        totalPremiumRate += rules.amortizationSurcharges.firstTimeBuyerNewBuild; // +0.20%
      }
    }
    
    // Add 2025 high-ratio surcharge for homes $1M-$1.5M (high-ratio mortgages only)
    if (price >= 1000000 && price <= 1500000 && ltv > 80) {
      totalPremiumRate += rules.highRatioSurcharges.millionToOneFiveM; // +0.25%
    }
    
    return loanAmount * totalPremiumRate;
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
  const cmhcPremium = calculateCMHCPremium(loanAmount, purchasePrice, isTraditionalDownPayment, isNewBuild);
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
        <div className="rounded-2xl shadow-xl backdrop-blur-sm border-2 p-8 hover:shadow-2xl transition-all duration-300" style={{backgroundColor: '#F8F9FA', borderColor: '#2A9D8F', background: 'linear-gradient(135deg, #F8F9FA 0%, #F4F4F4 100%)'}}>
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Mortgage Details
          </h3>
          
          <div className="space-y-6">
            {/* Purchase Price Slider */}
            <div>
              <label className="block text-xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
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
                  
                  // Keep the same down payment percentage, but respect minimum requirements
                  const newDownPaymentAmount = newPrice * currentDownPaymentPercent;
                  const minRequiredDown = calculateMinDownPayment(newPrice);
                  setDownPayment(Math.max(newDownPaymentAmount, minRequiredDown));
                }}
                className="w-full h-4 bg-gradient-to-r from-teal-100 to-emerald-200 rounded-lg appearance-none cursor-pointer slider shadow-md hover:shadow-lg transition-shadow duration-200"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>$500K</span>
                <span>$2M</span>
              </div>
            </div>

            {/* Down Payment Slider */}
            <div>
              <label className="block text-xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Down Payment: <span className="font-bold" style={{color: '#264653'}}>{formatCurrency(downPayment)} ({formatPercent((downPayment/purchasePrice)*100)})</span>
              </label>
              <input
                type="range"
                min={purchasePrice * 0.05}
                max={purchasePrice * 0.50}
                step="5000"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full h-4 bg-gradient-to-r from-teal-100 to-emerald-200 rounded-lg appearance-none cursor-pointer slider shadow-md hover:shadow-lg transition-shadow duration-200"
              />
              <div className="flex justify-between text-base text-gray-600 mt-2 font-medium">
                <span>5%: {formatCurrency(purchasePrice * 0.05)}</span>
                <span>50%: {formatCurrency(purchasePrice * 0.50)}</span>
              </div>
              
              {/* Down Payment Info */}
              <div className="mt-3 space-y-2">
                
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
              <label className="block text-xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Interest Rate: <span className="font-bold" style={{color: '#264653'}}>{interestRate}%</span>
              </label>
              <input
                type="range"
                min="3"
                max="7"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-4 bg-gradient-to-r from-teal-100 to-emerald-200 rounded-lg appearance-none cursor-pointer slider shadow-md hover:shadow-lg transition-shadow duration-200"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>3%</span>
                <span>7%</span>
              </div>
            </div>
            
            {/* Amortization Period */}
            <div>
              <label className="block text-xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Amortization: <span className="font-bold" style={{color: '#264653'}}>{amortizationYears} years</span>
              </label>
              <input
                type="range"
                min="15"
                max="30"
                step="1"
                value={amortizationYears}
                onChange={(e) => setAmortizationYears(Number(e.target.value))}
                className="w-full h-4 bg-gradient-to-r from-teal-100 to-emerald-200 rounded-lg appearance-none cursor-pointer slider shadow-md hover:shadow-lg transition-shadow duration-200"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>15 years</span>
                <span>30 years</span>
              </div>
              {amortizationYears > 25 && (
                <p className="text-orange-600 text-base font-medium mt-2">
                  ⚠️ CMHC charges 0.25% surcharge for amortization over 25 years
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

            {/* New Build Toggle (for First-Time Buyers) */}
            {isFirstTimeBuyer && (
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewBuild}
                    onChange={(e) => setIsNewBuild(e.target.checked)}
                    className="w-6 h-6 text-purple focus:ring-purple border-gray-300 rounded"
                  />
                  <span className="text-xl font-bold text-gray-800">
                    New build home (First-time buyer)
                  </span>
                </label>
                {isNewBuild && amortizationYears === 30 && (
                  <p className="text-yellow-600 text-base font-medium mt-2">
                    ⚠️ Additional 0.20% CMHC surcharge for 30-year new build
                  </p>
                )}
              </div>
            )}

            {/* Down Payment Source Toggle */}
            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!isTraditionalDownPayment}
                  onChange={(e) => setIsTraditionalDownPayment(!e.target.checked)}
                  className="w-6 h-6 text-purple focus:ring-purple border-gray-300 rounded"
                />
                <span className="text-xl font-bold text-gray-800">
                  Borrowed down payment
                </span>
              </label>
              {!isTraditionalDownPayment && ltvRatio > 90 && (
                <p className="text-red-600 text-base font-medium mt-2">
                  ⚠️ Higher CMHC premium rate (4.50%) for borrowed down payment
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          {/* Main Payment Result */}
          <div className="rounded-2xl shadow-xl p-8 text-center text-white relative overflow-hidden hover:shadow-2xl transition-all duration-300" style={{background: 'linear-gradient(135deg, #264653 0%, #2A9D8F 50%, #43AA8B 100%)'}}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">Monthly Payment</h3>
            <div className="text-6xl font-bold mb-3">
              {formatCurrency(monthlyPayment)}
            </div>
            <p className="text-xl font-medium" style={{color: '#F4F4F4'}}>Principal & Interest</p>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]" style={{backgroundColor: '#F8F9FA', borderColor: '#2A9D8F', background: 'linear-gradient(135deg, #F8F9FA 0%, #F4F4F4 100%)'}}>
            <h4 className="text-xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">CMHC Calculation Breakdown</h4>
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
                      <span className="font-bold text-orange-600 text-base">0.25%</span>
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
                    CMHC Insurance Required (Official 2025 Rates)
                  </h4>
                  <p className="text-sm mt-1 text-orange-800">
                    LTV over 80% requires mortgage default insurance per CMHC rules.
                    <br />Total Premium: {formatCurrency(cmhcPremium)}
                    <br />Base Rate: {((Object.entries(CMHC_RULES.premiumRates).find(([ltv]) => ltvRatio <= parseFloat(ltv))?.[1] ?? 0) * 100).toFixed(2)}% of loan amount
                    {amortizationYears > 25 && <><br />+ 0.25% amortization surcharge (26-30 years)</>}
                    {isFirstTimeBuyer && isNewBuild && amortizationYears === 30 && <><br />+ 0.20% first-time buyer new build surcharge</>}
                    {purchasePrice >= 1000000 && purchasePrice <= 1500000 && ltvRatio > 80 && <><br />+ 0.25% high-ratio surcharge ($1M-$1.5M)</>}
                    {!isTraditionalDownPayment && ltvRatio > 90 && <><br />Higher rate (4.50%) for borrowed down payment</>}
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
            <button
              onClick={onOpenContactForm}
              className="px-8 py-3 text-lg font-semibold inline-block rounded-lg text-white hover:opacity-90 transition-opacity"
              style={{backgroundColor: '#FF914D'}}
            >
              Get Pre-Approved Now
            </button>
          </div>
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #264653 0%, #2A9D8F 100%);
          cursor: pointer;
          box-shadow: 0 6px 15px rgba(38, 70, 83, 0.4);
          transition: all 0.3s ease;
          border: 2px solid white;
        }
        .slider::-webkit-slider-thumb:hover {
          background: linear-gradient(135deg, #2A9D8F 0%, #43AA8B 100%);
          transform: scale(1.2);
          box-shadow: 0 8px 20px rgba(42, 157, 143, 0.6);
        }
        .slider::-webkit-slider-track {
          height: 16px;
          border-radius: 8px;
          background: linear-gradient(to right, #2A9D8F 0%, #2A9D8F 50%, #E2E8F0 50%, #E2E8F0 100%);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(42, 157, 143, 0.2);
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
                href="https://callme.mortgagewithford.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 text-sm font-medium rounded-lg text-white hover:opacity-90 transition-opacity"
                style={{backgroundColor: '#FF914D'}}
              >
                Book Consultation →
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
              🏙️ Toronto, Ontario
            </div>
            <div className="mb-6">
              <Image
                src="/logos/toronto-mortgages-gradient.png"
                alt="Best Mortgage Rates Toronto"
                width={500}
                height={120}
                priority
                className="mx-auto"
              />
            </div>
            <p className="text-xl mb-8 leading-relaxed max-w-3xl" style={{color: '#264653'}}>
              Access Toronto's most competitive mortgage rates, navigate GTA market dynamics, and unlock 
              exclusive Toronto homebuyer programs. <strong>Skip the bank queues, get pre-approved online.</strong>
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
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Live Toronto Mortgage Rates
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
                                  onClick={() => {
                                    setSelectedRate(`${rate.term} - ${rate.rate}`);
                                    setShowLockRate(true);
                                    setLockRateSubmitted(false);
                                  }}
                                  className="px-4 py-2 text-sm inline-block shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 rounded-lg text-white font-medium"
                                  style={{backgroundColor: '#2A9D8F'}}
                                >
                                  Lock Rate
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
                            onClick={() => {
                              setSelectedRate(`${rate.term} - ${rate.rate}`);
                              setShowLockRate(true);
                              setLockRateSubmitted(false);
                            }}
                            className="w-full px-4 py-3 text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 rounded-lg text-white font-medium"
                            style={{backgroundColor: '#2A9D8F'}}
                          >
                            Lock Rate
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
          <TorontoMortgageCalculator 
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
                Toronto Market Insights
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
            <button 
              onClick={() => setIsContactFormOpen(true)}
              className="btn-primary px-8 py-3 font-semibold inline-block"
            >
              Get Toronto Program Help
            </button>
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
                Toronto Mortgage FAQs
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
                No, mortgage rates are the same across Ontario. A 5-year fixed rate in Toronto is the same as in Ottawa or Hamilton. The difference is in qualification requirements due to varying home prices and local market conditions.
              </p>
            </div>
            
            <div className="backdrop-blur-md bg-white/30 p-8 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
              <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-teal-700 group-hover:to-teal-500 transition-all duration-300">
                How much is land transfer tax in Toronto?
              </h3>
              <p style={{color: '#264653'}}>
                Toronto has both provincial and municipal land transfer tax. For a $1M home, you'll pay approximately $32,950 total ($16,475 provincial + $16,475 municipal). First-time buyers can get up to $8,475 in rebates.
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
                  <strong>CMHC Premium:</strong> Ranges from 0.60% to 4.50% of loan amount depending on your down payment size. Premium is added to your mortgage and paid monthly.
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-gray-400">(Optional)</span></label>
                    <input 
                      name="phone"
                      type="tel" 
                      placeholder="(416) 555-0123"
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
        <div className="flex justify-center">
          <a
            href="https://andreina-ford.mtg-app.com/signup?brokerName=andreina.ford&brokerId=7208e0a3-3590-47b7-a99d-4704d9c75268"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 btn-primary py-3 text-center text-sm font-semibold"
          >
            Apply for Pre-Approval
          </a>
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
            <a
              href="https://andreina-ford.mtg-app.com/signup?brokerName=andreina.ford&brokerId=7208e0a3-3590-47b7-a99d-4704d9c75268"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105" style={{backgroundColor: '#FAFAFA', color: '#264653'}}
            >
              Apply Now for Pre-Approval!
            </a>
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
                <li><a href="https://callme.mortgagewithford.ca" target="_blank" rel="noopener noreferrer" className="hover:text-white">Book Consultation</a></li>
                <li><a href="mailto:hello@boringmortgages.ca?subject=Mortgage questions from Toronto" className="hover:text-white">Email Us</a></li>
                <li><a href="https://mortgagewithford.ca" target="_blank" rel="noopener noreferrer" className="hover:text-white">About Us</a></li>
                <li><a href="https://boringmortgages.ca" target="_blank" rel="noopener noreferrer" className="hover:text-white">Home</a></li>
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
                    BRX MORTGAGE<br/>
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
                  © {new Date().getFullYear()} Boring Mortgages Ontario. Making Toronto mortgages boringly simple.
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
      
      <ContactForm 
        isOpen={isContactFormOpen} 
        onClose={() => setIsContactFormOpen(false)} 
      />
    </div>
  );
} 