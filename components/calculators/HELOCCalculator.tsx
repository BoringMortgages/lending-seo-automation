'use client';

import { useState } from 'react';
import Button from "../ui/Button";

interface HELOCCalculatorProps {
  onOpenContactForm?: () => void;
}

const HELOCCalculator: React.FC<HELOCCalculatorProps> = ({ 
  onOpenContactForm 
}) => {
  const [homeValue, setHomeValue] = useState(500000);
  const [mortgageBalance, setMortgageBalance] = useState(300000);
  const [creditScore, setCreditScore] = useState(720);
  const [desiredAmount, setDesiredAmount] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Calculate equity percentage
  const currentEquity = homeValue > 0 ? ((homeValue - mortgageBalance) / homeValue) * 100 : 0;
  
  // Calculate maximum combined limit (80% LTV)
  const maxCombinedLimit = homeValue * 0.80;
  
  // Calculate maximum HELOC available using two methods, take the lower
  const maxHELOC_Method1 = (homeValue * 0.65) - mortgageBalance; // 65% LTV standalone
  const maxHELOC_Method2 = maxCombinedLimit - mortgageBalance; // 80% combined minus mortgage
  const maxHELOC = Math.max(0, Math.min(maxHELOC_Method1, maxHELOC_Method2));

  // Calculate monthly interest for desired amount or max HELOC
  const calculateMonthlyInterest = () => {
    const amountForInterest = desiredAmount > 0 ? Math.min(desiredAmount, maxHELOC) : maxHELOC;
    if (amountForInterest > 0) {
      const annualRate = 0.0545; // Prime (4.95%) + 0.5% = 5.45%
      const monthlyRate = annualRate / 12;
      return amountForInterest * monthlyRate;
    }
    return 0;
  };

  const monthlyInterest = calculateMonthlyInterest();

  const calculateHELOC = () => {
    if (homeValue <= 0 || mortgageBalance < 0) {
      alert('Please enter valid home value and mortgage balance.');
      return;
    }
    if (mortgageBalance > homeValue) {
      alert('Mortgage balance cannot exceed home value.');
      return;
    }
    setShowResults(true);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calculator Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Please enter:
          </h2>
          
          <div className="space-y-8">
            {/* Home Value */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Current Home Market Value ($): <span className="text-green-600 font-bold">${formatCurrency(homeValue)}</span>
              </label>
              <input
                type="range"
                min="200000"
                max="2000000"
                step="25000"
                value={homeValue}
                onChange={(e) => setHomeValue(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>$200K</span>
                <span>$2M</span>
              </div>
            </div>

            {/* Mortgage Balance */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Remaining Mortgage Balance ($): <span className="text-green-600 font-bold">${formatCurrency(mortgageBalance)}</span>
              </label>
              <input
                type="range"
                min="0"
                max={homeValue * 0.9}
                step="10000"
                value={mortgageBalance}
                onChange={(e) => setMortgageBalance(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>$0</span>
                <span>${formatCurrency(homeValue * 0.9)}</span>
              </div>
            </div>

            {/* Credit Score */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Credit Score (optional): <span className="text-green-600 font-bold">{creditScore}</span>
              </label>
              <input
                type="range"
                min="300"
                max="900"
                step="10"
                value={creditScore}
                onChange={(e) => setCreditScore(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>300</span>
                <span>900</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Most banks require a credit score of 680 or above
              </p>
            </div>

            {/* Desired HELOC Amount */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Desired HELOC Draw Amount ($) (optional): <span className="text-green-600 font-bold">${formatCurrency(desiredAmount)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="500000"
                step="5000"
                value={desiredAmount}
                onChange={(e) => setDesiredAmount(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>$0</span>
                <span>$500K</span>
              </div>
            </div>

            {/* Calculate Button */}
            <div className="flex gap-4">
              <button
                onClick={calculateHELOC}
                className="flex-1 px-8 py-3 text-lg font-semibold rounded-lg text-white hover:opacity-90 transition-all duration-200"
                style={{backgroundColor: '#FF914D'}}
              >
                Calculate
              </button>
              <Button
                onClick={() => {
                  setHomeValue(500000);
                  setMortgageBalance(300000);
                  setCreditScore(720);
                  setDesiredAmount(0);
                  setShowResults(false);
                }}
                variant="ghost"
                size="lg"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {showResults && (
            <>
              {/* Main Results */}
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6 text-center">Your HELOC Calculation Results</h3>
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-green-100 mb-2">Based on your inputs, your maximum combined mortgage + HELOC limit is:</p>
                    <p className="text-3xl font-bold">
                      ${formatCurrency(maxCombinedLimit)}
                      {creditScore < 680 && <span className="text-sm text-yellow-300 block mt-1">(Note: Your credit score may not meet minimum requirements)</span>}
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-green-100 mb-2">Your estimated maximum HELOC available is:</p>
                    <p className="text-3xl font-bold">${formatCurrency(maxHELOC)}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-green-100 mb-2">Current equity in your home is:</p>
                    <p className="text-3xl font-bold">{currentEquity.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              {/* Interest Estimate */}
              {monthlyInterest > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-6">
                    Estimated Monthly Interest Costs
                  </h4>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Monthly interest at prime + 0.5% (5.45%):</span>
                      <span className="text-2xl font-bold text-green-600">${formatCurrency(monthlyInterest)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      *Interest rates vary by lender and are subject to change. This is an estimate only.
                    </p>
                  </div>
                </div>
              )}

              {/* Important Notes */}
              <div className="bg-yellow-50 rounded-2xl shadow-xl p-6 border border-yellow-200">
                <h4 className="font-semibold text-yellow-900 mb-4">Important Notes:</h4>
                <ul className="space-y-2 text-yellow-800 text-sm">
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    Most banks require a credit score of 680 or above.
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    Maximum borrowing combined mortgage & HELOC typically capped at 80% LTV.
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    HELOC standalone max is usually 65% LTV.
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    Rates and terms vary by lender and individual circumstances.
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    This calculator provides estimates only and should not be considered financial advice.
                  </li>
                </ul>
              </div>
            </>
          )}

          {!showResults && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Calculate Your HELOC</h3>
              <p className="text-gray-500">
                Enter your home value and mortgage balance, then click Calculate to see your results.
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="text-center">
            <Button
              onClick={onOpenContactForm}
              variant="primary"
              size="lg"
            >
              Get HELOC Consultation →
            </Button>
            <p className="mt-3 text-sm text-gray-500">
              Maximize your home equity • Contact us directly
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #059669;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(5, 150, 105, 0.3);
          transition: all 0.3s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          background: #047857;
          transform: scale(1.1);
          box-shadow: 0 6px 12px rgba(5, 150, 105, 0.5);
        }
        .slider::-webkit-slider-track {
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(to right, #059669 0%, #059669 var(--value, 0%), #E5E7EB var(--value, 0%), #E5E7EB 100%);
        }
      `}</style>
    </div>
  );
};

export default HELOCCalculator;