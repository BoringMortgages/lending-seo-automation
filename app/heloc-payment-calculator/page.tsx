'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";

export default function HELOCPaymentCalculator() {
  const [homeValue, setHomeValue] = useState(800000);
  const [mortgageBalance, setMortgageBalance] = useState(400000);
  const [interestRate, setInterestRate] = useState(6.45);
  const [creditLimit, setCreditLimit] = useState(200000);
  const [currentBalance, setCurrentBalance] = useState(50000);
  const [paymentType, setPaymentType] = useState('interest-only');
  const [paymentAmount, setPaymentAmount] = useState(0);
  
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [interestPayment, setInterestPayment] = useState(0);
  const [principalPayment, setPrincipalPayment] = useState(0);
  const [payoffTime, setPayoffTime] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const availableEquity = homeValue * 0.80 - mortgageBalance;
  const maxHELOC = Math.min(availableEquity, creditLimit);
  const utilizationRate = currentBalance > 0 ? (currentBalance / maxHELOC) * 100 : 0;

  useEffect(() => {
    calculatePayment();
  }, [homeValue, mortgageBalance, interestRate, creditLimit, currentBalance, paymentType, paymentAmount]);

  const calculatePayment = () => {
    if (currentBalance <= 0) {
      setMonthlyPayment(0);
      setInterestPayment(0);
      setPrincipalPayment(0);
      setPayoffTime(0);
      setTotalInterest(0);
      setShowResults(true);
      return;
    }

    const monthlyRate = interestRate / 100 / 12;
    const monthlyInterest = currentBalance * monthlyRate;

    if (paymentType === 'interest-only') {
      setMonthlyPayment(monthlyInterest);
      setInterestPayment(monthlyInterest);
      setPrincipalPayment(0);
      setPayoffTime(0);
      setTotalInterest(0);
    } else if (paymentType === 'fixed-payment') {
      const payment = paymentAmount || monthlyInterest * 1.5; // Default to 150% of interest
      const principal = Math.max(0, payment - monthlyInterest);
      
      setMonthlyPayment(payment);
      setInterestPayment(monthlyInterest);
      setPrincipalPayment(principal);
      
      // Calculate payoff time if principal is being paid
      if (principal > 0) {
        const months = Math.log(1 + (currentBalance * monthlyRate) / principal) / Math.log(1 + monthlyRate);
        const totalInterestPaid = (payment * months) - currentBalance;
        
        setPayoffTime(months);
        setTotalInterest(totalInterestPaid);
      } else {
        setPayoffTime(0);
        setTotalInterest(0);
      }
    }
    
    setShowResults(true);
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const formatPercent = (value) => {
    return value.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center group">
              <h1 className="text-2xl font-bold text-gray-900">
                Mortgage with Ford
              </h1>
              <span className="ml-3 text-sm text-gray-600">
                Andreina Ford - Licensed Mortgage Agent Level 2
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="mailto:hello@mortgagewithford.ca"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 font-medium"
              >
                Get HELOC Quote
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            HELOC Payment Calculator
            <span className="block text-3xl md:text-4xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mt-2">
              Home Equity Line of Credit
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Calculate payments for your Home Equity Line of Credit (HELOC). 
            Compare interest-only vs. principal + interest payments and plan your <strong>home equity strategy</strong>.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Calculator Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Calculate HELOC Payments
            </h2>
            
            <div className="space-y-8">
              {/* Home Value */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-4">
                  Current Home Value: <span className="text-purple-600 font-bold">${formatCurrency(homeValue)}</span>
                </label>
                <input
                  type="range"
                  min="300000"
                  max="2000000"
                  step="25000"
                  value={homeValue}
                  onChange={(e) => setHomeValue(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>$300K</span>
                  <span>$2M</span>
                </div>
              </div>

              {/* Mortgage Balance */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-4">
                  Remaining Mortgage Balance: <span className="text-purple-600 font-bold">${formatCurrency(mortgageBalance)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max={homeValue * 0.8}
                  step="10000"
                  value={mortgageBalance}
                  onChange={(e) => setMortgageBalance(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>$0</span>
                  <span>${formatCurrency(homeValue * 0.8)}</span>
                </div>
              </div>

              {/* Available Equity Display */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Available Home Equity (80% LTV):</span>
                  <span className="text-purple-600 font-bold text-lg">${formatCurrency(availableEquity)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-700 font-medium">Maximum HELOC Available:</span>
                  <span className="text-purple-600 font-bold text-lg">${formatCurrency(maxHELOC)}</span>
                </div>
              </div>

              {/* HELOC Interest Rate */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-4">
                  HELOC Interest Rate: <span className="text-purple-600 font-bold">{interestRate}%</span>
                </label>
                <input
                  type="range"
                  min="4"
                  max="10"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>4%</span>
                  <span>10%</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  HELOC rates are typically Prime + 0.5% to Prime + 1.5%
                </p>
              </div>

              {/* Current HELOC Balance */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-4">
                  Current HELOC Balance: <span className="text-purple-600 font-bold">${formatCurrency(currentBalance)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max={maxHELOC}
                  step="5000"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>$0</span>
                  <span>${formatCurrency(maxHELOC)}</span>
                </div>
                {utilizationRate > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    Utilization: {formatPercent(utilizationRate)}% of available credit
                  </p>
                )}
              </div>

              {/* Payment Type */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-4">
                  Payment Type
                </label>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => setPaymentType('interest-only')}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                      paymentType === 'interest-only'
                        ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Interest-Only Payments
                  </button>
                  <button
                    onClick={() => setPaymentType('fixed-payment')}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                      paymentType === 'fixed-payment'
                        ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Fixed Monthly Payment
                  </button>
                </div>
              </div>

              {/* Fixed Payment Amount */}
              {paymentType === 'fixed-payment' && (
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-4">
                    Monthly Payment Amount: <span className="text-purple-600 font-bold">${formatCurrency(paymentAmount)}</span>
                  </label>
                  <input
                    type="range"
                    min={currentBalance * (interestRate / 100 / 12)}
                    max={currentBalance * (interestRate / 100 / 12) * 5}
                    step="25"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>Interest Only</span>
                    <span>5x Interest</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-2xl p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-4">Monthly HELOC Payment</h3>
              <div className="text-6xl font-bold mb-2">
                ${formatCurrency(monthlyPayment)}
              </div>
              <p className="text-purple-100 text-lg">
                {paymentType === 'interest-only' ? 'Interest-only payment' : 'Principal + Interest'}
              </p>
            </div>

            {/* Payment Breakdown */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-6">
                Payment Breakdown
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Interest Payment</span>
                  <span className="font-bold text-red-600">
                    ${formatCurrency(interestPayment)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Principal Payment</span>
                  <span className="font-bold text-blue-600">
                    ${formatCurrency(principalPayment)}
                  </span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-gray-900">Total Monthly Payment</span>
                  <span className="font-bold text-purple-600">${formatCurrency(monthlyPayment)}</span>
                </div>
              </div>
            </div>

            {/* HELOC Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-6">
                HELOC Summary
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Balance</span>
                  <span className="font-bold text-gray-900">
                    ${formatCurrency(currentBalance)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Available Credit</span>
                  <span className="font-bold text-green-600">
                    ${formatCurrency(maxHELOC - currentBalance)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Credit Utilization</span>
                  <span className={`font-bold ${utilizationRate > 80 ? 'text-red-600' : utilizationRate > 50 ? 'text-orange-600' : 'text-green-600'}`}>
                    {formatPercent(utilizationRate)}%
                  </span>
                </div>
                {payoffTime > 0 && (
                  <>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payoff Time</span>
                      <span className="font-bold text-blue-600">
                        {Math.floor(payoffTime / 12)} years {Math.floor(payoffTime % 12)} months
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Interest</span>
                      <span className="font-bold text-red-600">
                        ${formatCurrency(totalInterest)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Interest-Only Warning */}
            {paymentType === 'interest-only' && currentBalance > 0 && (
              <div className="bg-orange-50 rounded-2xl shadow-xl p-6 border border-orange-200">
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 text-xl mt-0.5">⚠️</span>
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-2">
                      Interest-Only Payment Notice
                    </h4>
                    <p className="text-orange-800 text-sm">
                      With interest-only payments, your balance never decreases. Consider making 
                      additional principal payments to reduce your debt over time.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="text-center">
              <Link
                href="mailto:hello@mortgagewithford.ca?subject=HELOC Inquiry"
                className="inline-block bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                Get HELOC Consultation →
              </Link>
              <p className="mt-3 text-sm text-gray-500">
                Maximize your home equity • Contact Andreina directly
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
    </div>
  );
} 