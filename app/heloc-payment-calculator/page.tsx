'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Button from "../../components/ui/Button";

export default function HELOCPaymentCalculator() {
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
      const annualRate = 0.075; // Prime + 0.5% estimate
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

  const formatPercent = (value: number) => {
    return value.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to the Ontario HELOC Calculator
            <span className="block text-3xl md:text-4xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mt-2">
              Calculate Your Available Home Equity
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Determine your maximum HELOC amount and estimated monthly interest costs for your <strong>home equity line of credit</strong>.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Calculator Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Please enter:
            </h2>
            
            <div className="space-y-8">
              {/* Home Value */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-4">
                  Current Home Market Value ($): <span className="text-purple-600 font-bold">${formatCurrency(homeValue)}</span>
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
                  Remaining Mortgage Balance ($): <span className="text-purple-600 font-bold">${formatCurrency(mortgageBalance)}</span>
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
                  Credit Score (optional): <span className="text-purple-600 font-bold">{creditScore}</span>
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
                  Desired HELOC Draw Amount ($) (optional): <span className="text-purple-600 font-bold">${formatCurrency(desiredAmount)}</span>
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
                <Button
                  onClick={calculateHELOC}
                  variant="primary"
                  size="lg"
                  className="flex-1"
                >
                  Calculate
                </Button>
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
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-6 text-center">Your HELOC Calculation Results</h3>
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-purple-100 mb-2">Based on your inputs, your maximum combined mortgage + HELOC limit is:</p>
                      <p className="text-3xl font-bold">
                        ${formatCurrency(maxCombinedLimit)}
                        {creditScore < 680 && <span className="text-sm text-yellow-300 block mt-1">(Note: Your credit score may not meet minimum requirements)</span>}
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-purple-100 mb-2">Your estimated maximum HELOC available is:</p>
                      <p className="text-3xl font-bold">${formatCurrency(maxHELOC)}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-purple-100 mb-2">Current equity in your home is:</p>
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
                        <span className="text-gray-700">Monthly interest at prime + 0.5% (~7.5%):</span>
                        <span className="text-2xl font-bold text-purple-600">${formatCurrency(monthlyInterest)}</span>
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
                href="mailto:hello@mortgagewithford.ca?subject=HELOC Inquiry"
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

        {/* Educational Content */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Understanding Home Equity Lines of Credit (HELOC)
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                How HELOCs Work
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <strong>Revolving Credit:</strong> Like a credit card secured by your home
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <strong>Variable Rate:</strong> Interest rate changes with prime rate
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <strong>Interest-Only:</strong> Minimum payments are typically interest-only
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <strong>80% LTV Limit:</strong> Maximum borrowing is 80% of home value
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                HELOC vs. Mortgage
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-2 text-left">Feature</th>
                      <th className="p-2 text-left">HELOC</th>
                      <th className="p-2 text-left">Mortgage</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b">
                      <td className="p-2 font-medium">Interest Rate</td>
                      <td className="p-2">Variable (Prime +)</td>
                      <td className="p-2">Fixed or Variable</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Payment</td>
                      <td className="p-2">Interest-only option</td>
                      <td className="p-2">Principal + Interest</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Access</td>
                      <td className="p-2">Draw as needed</td>
                      <td className="p-2">Lump sum</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Tax Deductible</td>
                      <td className="p-2">If used for investment</td>
                      <td className="p-2">No (primary residence)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Related Tools */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Related Mortgage Tools
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Link
              href="/mortgage-payment-calculator"
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Mortgage Payment Calculator
              </h3>
              <p className="text-gray-600">
                Calculate monthly payments for your primary mortgage.
              </p>
            </Link>
            
            <Link
              href="/mortgage-affordability-calculator"
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Affordability Calculator
              </h3>
              <p className="text-gray-600">
                Determine how much house you can afford to purchase.
              </p>
            </Link>
            
            <Link
              href="/refinancing-calculator"
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Refinancing Calculator
              </h3>
              <p className="text-gray-600">
                Compare refinancing vs. HELOC for accessing home equity.
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
          background: #9333EA;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(147, 51, 234, 0.3);
          transition: all 0.3s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          background: #7C3AED;
          transform: scale(1.1);
          box-shadow: 0 6px 12px rgba(147, 51, 234, 0.5);
        }
        .slider::-webkit-slider-track {
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(to right, #9333EA 0%, #9333EA var(--value, 0%), #E5E7EB var(--value, 0%), #E5E7EB 100%);
        }
      `}</style>

      <Footer showRegulatory={true} />
    </div>
  );
} 