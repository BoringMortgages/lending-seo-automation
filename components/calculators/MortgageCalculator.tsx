'use client';

import React, { useState, useEffect } from 'react';
import { CONTACT_CONFIG } from '@/config/contact';
import { 
  CMHC_RULES, 
  calculateMinDownPayment, 
  calculateCMHCPremium, 
  calculatePayment,
  formatCurrency,
  formatPercent,
  type MortgageRate 
} from '@/lib/constants/cmhc';

interface MortgageCalculatorProps {
  onOpenContactForm?: () => void;
  currentRates?: MortgageRate[];
}

const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({ onOpenContactForm, currentRates = [] }) => {
  const [purchasePrice, setPurchasePrice] = useState(750000);
  const [downPayment, setDownPayment] = useState(150000);
  const [interestRate, setInterestRate] = useState(4.64);
  const [amortizationYears, setAmortizationYears] = useState(25);
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(false);
  const [isNewBuild, setIsNewBuild] = useState(false);
  const [isTraditionalDownPayment, setIsTraditionalDownPayment] = useState(true);

  // Update interest rate when API rates are loaded
  useEffect(() => {
    if (currentRates && currentRates.length > 0) {
      const fiveYearFixed = currentRates.find(r => r.term === "5 Year" && r.type === "Fixed");
      if (fiveYearFixed) {
        const rateNumber = parseFloat(fiveYearFixed.rate.replace('%', ''));
        if (!isNaN(rateNumber)) {
          setInterestRate(rateNumber);
        }
      }
    }
  }, [currentRates]);

  // Auto-adjust down payment when purchase price changes
  useEffect(() => {
    const minDownPayment = calculateMinDownPayment(purchasePrice);
    if (downPayment < minDownPayment) {
      setDownPayment(minDownPayment);
    }
  }, [purchasePrice]);

  const minDownPayment = calculateMinDownPayment(purchasePrice);
  const loanAmount = purchasePrice - downPayment;
  const requiresCMHC = downPayment < (purchasePrice * 0.20);
  const isEligibleForCMHC = purchasePrice <= 1500000;
  const cmhcPremium = requiresCMHC && isEligibleForCMHC ? 
    calculateCMHCPremium(loanAmount, purchasePrice, amortizationYears, isFirstTimeBuyer, isNewBuild, isTraditionalDownPayment) : 0;
  const totalLoanAmount = loanAmount + cmhcPremium;
  const monthlyPayment = calculatePayment(totalLoanAmount, interestRate, amortizationYears);
  const ltvRatio = (loanAmount / purchasePrice) * 100;

  return (
    <>
      <style jsx>{`
        .custom-slider {
          background: #ff8203;
          outline: none;
        }
        
        .custom-slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #1cbbb4;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        .custom-slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #1cbbb4;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    <div className="max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Controls */}
        <div className="rounded-2xl shadow-xl backdrop-blur-sm border-2 p-6 hover:shadow-2xl transition-all duration-300 bg-white border-boring-teal/30 shadow-lg">
          <h3 className="text-2xl font-bold mb-8 text-gray-900">
            Calculate Your Mortgage Payment
          </h3>
          
          <div className="space-y-8">
            {/* Purchase Price Slider */}
            <div>
              <label className="block text-xl font-bold mb-2 text-gray-900">
                Purchase Price: <span className="font-bold text-boring-lime-green">{formatCurrency(purchasePrice)}</span>
              </label>
              <input
                type="range"
                min="500000"
                max="2000000"
                step="25000"
                value={purchasePrice}
                onChange={(e) => {
                  const newPrice = parseInt(e.target.value);
                  setPurchasePrice(newPrice);
                  const currentDownPaymentPercent = downPayment / purchasePrice;
                  const newMinDownPayment = calculateMinDownPayment(newPrice);
                  
                  // Keep the same down payment percentage, but respect minimum requirements
                  const newDownPayment = Math.max(newMinDownPayment, newPrice * currentDownPaymentPercent);
                  setDownPayment(Math.round(newDownPayment));
                }}
                className="w-full h-4 rounded-lg appearance-none cursor-pointer custom-slider"
              />
              <div className="flex justify-between text-sm text-gray-900 mt-1 font-semibold">
                <span>$500K</span>
                <span>$2M</span>
              </div>
            </div>

            {/* Down Payment Slider */}
            <div>
              <label className="block text-xl font-bold mb-2 text-gray-900">
                Down Payment: <span className="font-bold text-boring-lime-green">{formatCurrency(downPayment)} ({formatPercent((downPayment/purchasePrice)*100)})</span>
              </label>
              <input
                type="range"
                min={minDownPayment}
                max={purchasePrice * 0.50}
                step="5000"
                value={downPayment}
                onChange={(e) => setDownPayment(parseInt(e.target.value))}
                className="w-full h-4 rounded-lg appearance-none cursor-pointer custom-slider"
              />
              <div className="flex justify-between text-base text-gray-900 mt-1 font-semibold">
                <span>Minimum: {formatCurrency(minDownPayment)}</span>
                <span>50%: {formatCurrency(purchasePrice * 0.50)}</span>
              </div>

              {/* Down Payment Info */}
              <div className="mt-3">
                {(downPayment/purchasePrice) > 0.20 && (
                  <div className="bg-boring-lime-green/10 border border-boring-lime-green/30 rounded-lg p-4">
                    <p className="text-gray-900 text-base font-semibold">
                      ✓ Conventional Mortgage (20%+ down payment)
                    </p>
                    <p className="text-gray-700 text-base mt-2">
                      No CMHC insurance required - save on premium costs
                    </p>
                  </div>
                )}
                <p className="text-boring-lime-green text-base font-medium mt-2">
                  Higher down payments = lower monthly payments & no insurance premiums
                </p>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-xl font-bold mb-2 text-gray-900">
                Interest Rate: <span className="font-bold text-boring-lime-green">{interestRate}%</span>
              </label>
              <input
                type="range"
                min="3"
                max="7"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full h-4 rounded-lg appearance-none cursor-pointer custom-slider"
              />
              <div className="flex justify-between text-sm text-gray-900 mt-2 font-semibold">
                <span>3%</span>
                <span>7%</span>
              </div>
            </div>

            {/* Amortization Period */}
            <div>
              <label className="block text-xl font-bold mb-2 text-gray-900">
                Amortization: <span className="font-bold text-boring-lime-green">{amortizationYears} years</span>
              </label>
              <input
                type="range"
                min="15"
                max="30"
                step="1"
                value={amortizationYears}
                onChange={(e) => setAmortizationYears(parseInt(e.target.value))}
                className="w-full h-4 rounded-lg appearance-none cursor-pointer custom-slider"
              />
              <div className="flex justify-between text-sm text-gray-900 mt-2 font-semibold">
                <span>15 years</span>
                <span>30 years</span>
              </div>
              {amortizationYears > 25 && (
                <p className="text-boring-teal text-sm font-medium mt-2">
                  Amortization over 25 years adds 0.25% CMHC surcharge
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Main Payment Result */}
          <div className="rounded-2xl shadow-xl p-8 text-center text-white relative overflow-hidden hover:shadow-2xl transition-all duration-300" style={{background: 'linear-gradient(to bottom right, #8ef378, #1cbbb4)'}}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            <div className="relative">
              <h3 className="text-3xl font-bold mb-4">Monthly Payment</h3>
              <div className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                {formatCurrency(monthlyPayment)}
              </div>
              <p className="text-xl font-medium text-gray-100">Principal & Interest</p>
            </div>
          </div>

          {/* CMHC Notice */}
          {requiresCMHC && isEligibleForCMHC && (
            <div className="bg-gradient-to-r from-boring-lime-green/10 to-boring-lime-green/20 border border-boring-lime-green/30 rounded-xl p-4 shadow-sm">
              <div className="flex items-start space-x-3">
                <span className="text-boring-lime-green text-xl mt-0.5">ℹ️</span>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    CMHC Insurance Required (Official 2025 Rates)
                  </h4>
                  <p className="text-sm mt-1 text-gray-700">
                    LTV over 80% requires mortgage default insurance per CMHC rules.
                    <br />Total Premium: {formatCurrency(cmhcPremium)}
                    <br />Base Rate: {((Object.entries(CMHC_RULES.premiumRates).find(([ltv]) => ltvRatio <= parseFloat(ltv))?.[1] ?? 0) * 100).toFixed(2)}% of loan amount
                    {amortizationYears > 25 && <><br />+ 0.25% amortization surcharge (26-30 years)</>}
                    {isFirstTimeBuyer && isNewBuild && amortizationYears === 30 && <><br />+ 0.20% first-time buyer new build surcharge</>}
                    {purchasePrice >= 1000000 && purchasePrice <= 1500000 && ltvRatio > 80 && <><br />+ 0.25% high-ratio surcharge (\$1M-\$1.5M)</>}
                    {!isTraditionalDownPayment && ltvRatio > 90 && <><br />Higher rate (4.50%) for borrowed down payment</>}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* CMHC Ineligible Notice */}
          {!isEligibleForCMHC && (
            <div className="bg-gradient-to-r from-boring-charcoal/10 to-boring-charcoal/20 border border-boring-charcoal/30 rounded-xl p-4 shadow-sm">
              <div className="flex items-start space-x-3">
                <span className="text-boring-teal text-xl mt-0.5">⚠️</span>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    CMHC Insurance Not Available
                  </h4>
                  <p className="text-sm mt-1 text-gray-700">
                    Homes over $1.5M are not eligible for CMHC insurance.
                    <br />Minimum 20% down payment required for conventional mortgage.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Checkbox Options Card */}
          <div className="rounded-2xl shadow-xl backdrop-blur-sm border-2 p-6 hover:shadow-2xl transition-all duration-300 bg-white border-boring-teal/30 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              Additional Options (affects CMHC rates)
            </h3>
            
            <div className="space-y-4">
              {/* First-Time Buyer Toggle */}
              <div>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFirstTimeBuyer}
                    onChange={(e) => setIsFirstTimeBuyer(e.target.checked)}
                    className="w-5 h-5 text-boring-teal focus:ring-boring-teal border-boring-charcoal/30 rounded"
                  />
                  <span className="text-gray-900 font-semibold">
                    First-Time Home Buyer
                  </span>
                </label>
                {isFirstTimeBuyer && (
                  <p className="text-boring-teal text-sm font-medium mt-1 ml-8">
                    May qualify for incentives and extended amortization periods
                  </p>
                )}
              </div>

              {/* New Build Toggle (for First-Time Buyers) */}
              {isFirstTimeBuyer && (
                <div>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNewBuild}
                      onChange={(e) => setIsNewBuild(e.target.checked)}
                      className="w-5 h-5 text-boring-teal focus:ring-boring-teal border-boring-charcoal/30 rounded"
                    />
                    <span className="text-gray-900 font-semibold">
                      New Construction/Build
                    </span>
                  </label>
                  {isNewBuild && (
                    <p className="text-boring-lime-green text-sm font-medium mt-1 ml-8">
                      Adds 0.20% surcharge for new construction (first-time buyers, 30-year amortization)
                    </p>
                  )}
                </div>
              )}

              {/* Down Payment Source Toggle */}
              <div>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!isTraditionalDownPayment}
                    onChange={(e) => setIsTraditionalDownPayment(!e.target.checked)}
                    className="w-5 h-5 text-boring-teal focus:ring-boring-teal border-boring-charcoal/30 rounded"
                  />
                  <span className="text-gray-900 font-semibold">
                    Borrowed/Non-Traditional Down Payment
                  </span>
                </label>
                {!isTraditionalDownPayment && (
                  <p className="text-gray-900 text-sm font-medium mt-1 ml-8">
                    Higher CMHC rate (4.50%) applies for borrowed down payments over 90% LTV
                  </p>
                )}
              </div>

              {/* Conventional Mortgage Notice */}
              {(downPayment/purchasePrice) >= 0.20 && (
                <div className="bg-boring-teal/10 border border-boring-teal/30 rounded-lg p-3 mt-3">
                  <p className="text-gray-900 text-sm font-semibold">
                    ✓ Conventional Mortgage (20%+ down payment)
                  </p>
                  <p className="text-gray-700 text-sm mt-1">
                    No CMHC insurance required - save on premium costs
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white border-boring-teal/30 shadow-lg">
            <h4 className="text-xl font-bold mb-4 text-gray-900">CMHC Calculation Breakdown</h4>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-base font-medium text-gray-900">Loan Amount:</span>
                <span className="font-bold text-base">{formatCurrency(loanAmount)}</span>
              </div>
              {requiresCMHC && (
                <>
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900">CMHC Premium Rate:</span>
                    <span className="font-bold text-boring-lime-green text-base">
                      {((Object.entries(CMHC_RULES.premiumRates).find(([ltv]) => ltvRatio <= parseFloat(ltv))?.[1] ?? 0) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900">CMHC Insurance:</span>
                    <span className="font-bold text-boring-lime-green text-base">{formatCurrency(cmhcPremium)}</span>
                  </div>
                  {amortizationYears > 25 && (
                    <div className="flex justify-between">
                      <span className="text-base font-medium text-gray-900">Amortization Surcharge:</span>
                      <span className="font-bold text-boring-lime-green text-base">0.25%</span>
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-between border-t pt-3">
                <span className="text-base font-medium text-gray-900">Total Loan:</span>
                <span className="font-bold text-base">{formatCurrency(totalLoanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base font-medium text-gray-900">LTV Ratio:</span>
                <span className="font-bold text-base">{formatPercent(ltvRatio)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base font-medium text-gray-900">Amortization:</span>
                <span className="font-bold text-base">{amortizationYears} years</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            {onOpenContactForm ? (
              <button
                onClick={onOpenContactForm}
                className="px-8 py-3 text-lg font-semibold inline-block rounded-lg text-white hover:text-black transition-all duration-300 hover:bg-white"
                style={{backgroundColor: '#ff8203'}}
              >
                Get Pre-Approved
              </button>
            ) : (
              <a 
                href={CONTACT_CONFIG.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 text-lg font-semibold inline-block rounded-lg text-white hover:text-black transition-all duration-300 hover:bg-white"
                style={{backgroundColor: '#ff8203'}}
              >
                {CONTACT_CONFIG.cta.primary}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
    </>  
  );
};

export default MortgageCalculator;