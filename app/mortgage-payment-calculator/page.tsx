'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MortgagePaymentCalculator() {
  // Load initial values from localStorage or use defaults
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mortgageCalc_darkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  
  const [loanAmount, setLoanAmount] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mortgageCalc_loanAmount');
      return saved ? JSON.parse(saved) : 500000;
    }
    return 500000;
  });
  
  const [downPayment, setDownPayment] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mortgageCalc_downPayment');
      return saved ? JSON.parse(saved) : 25000;
    }
    return 25000;
  });
  
  const [interestRate, setInterestRate] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mortgageCalc_interestRate');
      return saved ? JSON.parse(saved) : 5.79;
    }
    return 5.79;
  });
  
  const [loanTerm, setLoanTerm] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mortgageCalc_loanTerm');
      return saved ? JSON.parse(saved) : 25;
    }
    return 25;
  });
  
  const [paymentFrequency, setPaymentFrequency] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mortgageCalc_paymentFrequency');
      return saved ? JSON.parse(saved) : 'monthly';
    }
    return 'monthly';
  });
  
  const [extraPayment, setExtraPayment] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mortgageCalc_extraPayment');
      return saved ? JSON.parse(saved) : 0;
    }
    return 0;
  });
  
  const [propertyTax, setPropertyTax] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mortgageCalc_propertyTax');
      return saved ? JSON.parse(saved) : 4000;
    }
    return 4000;
  });
  
  const [homeInsurance, setHomeInsurance] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mortgageCalc_homeInsurance');
      return saved ? JSON.parse(saved) : 1200;
    }
    return 1200;
  });
  
  const [showAmortization, setShowAmortization] = useState(false);
  const [amortizationData, setAmortizationData] = useState<any[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonScenarios, setComparisonScenarios] = useState<any[]>([]);
  
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [principalAndInterest, setPrincipalAndInterest] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [cmhcPremium, setCmhcPremium] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Payment frequency multipliers and labels
  const paymentFrequencies = {
    weekly: { multiplier: 52, label: 'Weekly', compoundingPeriods: 52 },
    'bi-weekly': { multiplier: 26, label: 'Bi-Weekly', compoundingPeriods: 26 },
    'semi-monthly': { multiplier: 24, label: 'Semi-Monthly', compoundingPeriods: 24 },
    monthly: { multiplier: 12, label: 'Monthly', compoundingPeriods: 12 }
  };

  // Calculate minimum down payment based on CMHC rules
  const calculateMinDownPayment = (purchasePrice: number): number => {
    if (purchasePrice <= 500000) {
      return purchasePrice * 0.05; // 5%
    } else if (purchasePrice <= 1000000) {
      return (500000 * 0.05) + ((purchasePrice - 500000) * 0.10); // 5% on first 500k, 10% on remainder
    } else {
      return purchasePrice * 0.20; // 20% on homes over $1M
    }
  };

  // Calculate CMHC premium based on LTV ratio
  const calculateCMHCPremium = (loanAmount: number, purchasePrice: number): number => {
    const ltv = (loanAmount / purchasePrice) * 100;
    
    // No insurance needed if down payment >= 20% or home > $1M
    if (ltv <= 80 || purchasePrice > 1000000) {
      return 0;
    }
    
    let premiumRate = 0;
    if (ltv <= 65) premiumRate = 0.0060;
    else if (ltv <= 75) premiumRate = 0.0170;
    else if (ltv <= 80) premiumRate = 0.0240;
    else if (ltv <= 85) premiumRate = 0.0280;
    else if (ltv <= 90) premiumRate = 0.0310;
    else if (ltv <= 95) premiumRate = 0.0400;
    
    return loanAmount * premiumRate;
  };

  const purchasePrice = loanAmount + downPayment;
  const minDownPayment = calculateMinDownPayment(purchasePrice);
  const ltvRatio = (loanAmount / purchasePrice) * 100;
  const requiresCMHC = ltvRatio > 80 && purchasePrice <= 1000000;

  useEffect(() => {
    calculatePayment();
  }, [loanAmount, downPayment, interestRate, loanTerm, paymentFrequency, propertyTax, homeInsurance, extraPayment]);

  const calculatePayment = () => {
    const cmhcFee = calculateCMHCPremium(loanAmount, purchasePrice);
    const totalLoanAmount = loanAmount + cmhcFee;
    
    const frequency = paymentFrequencies[paymentFrequency as keyof typeof paymentFrequencies];
    const periodicRate = interestRate / 100 / frequency.compoundingPeriods;
    const numberOfPayments = loanTerm * frequency.multiplier;
    
    let payment = 0;
    if (periodicRate > 0) {
      payment = totalLoanAmount * (periodicRate * Math.pow(1 + periodicRate, numberOfPayments)) / 
                (Math.pow(1 + periodicRate, numberOfPayments) - 1);
    } else {
      payment = totalLoanAmount / numberOfPayments;
    }
    
    // Add extra payment
    const totalPeriodicPayment = payment + extraPayment;
    
    // Calculate taxes and insurance based on frequency
    const periodicTax = propertyTax / frequency.multiplier;
    const periodicInsuranceAmount = homeInsurance / frequency.multiplier;
    const totalPaymentWithExtras = totalPeriodicPayment + periodicTax + periodicInsuranceAmount;
    
    // Calculate total interest with extra payments
    const { totalInterestPaid, actualPayments, amortizationSchedule } = calculateAmortizationSchedule(
      totalLoanAmount, periodicRate, numberOfPayments, totalPeriodicPayment
    );
    
    const totalAmountPaid = totalPeriodicPayment * actualPayments;
    
    setMonthlyPayment(totalPaymentWithExtras);
    setPrincipalAndInterest(payment);
    setTotalInterest(totalInterestPaid);
    setTotalPayment(totalAmountPaid);
    setCmhcPremium(cmhcFee);
    setAmortizationData(amortizationSchedule);
    setShowResults(true);
  };

  const calculateAmortizationSchedule = (principal: number, rate: number, numPayments: number, payment: number) => {
    const schedule = [];
    let remainingBalance = principal;
    let totalInterest = 0;
    let paymentNumber = 0;
    
    while (remainingBalance > 0.01 && paymentNumber < numPayments) {
      paymentNumber++;
      const interestPayment = remainingBalance * rate;
      const principalPayment = Math.min(payment - interestPayment, remainingBalance);
      
      remainingBalance -= principalPayment;
      totalInterest += interestPayment;
      
      // Store every 12th payment for yearly summary, or all for detailed view
      if (paymentNumber % Math.ceil(paymentFrequencies[paymentFrequency as keyof typeof paymentFrequencies].multiplier / 12) === 0 || schedule.length < 60) {
        schedule.push({
          payment: paymentNumber,
          principalPayment: principalPayment,
          interestPayment: interestPayment,
          totalPayment: principalPayment + interestPayment,
          remainingBalance: Math.max(0, remainingBalance)
        });
      }
      
      if (remainingBalance <= 0.01) break;
    }
    
    return {
      totalInterestPaid: totalInterest,
      actualPayments: paymentNumber,
      amortizationSchedule: schedule
    };
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('mortgageCalc_darkMode', JSON.stringify(newDarkMode));
  };

  // Save values to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mortgageCalc_loanAmount', JSON.stringify(loanAmount));
    }
  }, [loanAmount]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mortgageCalc_downPayment', JSON.stringify(downPayment));
    }
  }, [downPayment]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mortgageCalc_interestRate', JSON.stringify(interestRate));
    }
  }, [interestRate]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mortgageCalc_loanTerm', JSON.stringify(loanTerm));
    }
  }, [loanTerm]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mortgageCalc_paymentFrequency', JSON.stringify(paymentFrequency));
    }
  }, [paymentFrequency]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mortgageCalc_extraPayment', JSON.stringify(extraPayment));
    }
  }, [extraPayment]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mortgageCalc_propertyTax', JSON.stringify(propertyTax));
    }
  }, [propertyTax]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mortgageCalc_homeInsurance', JSON.stringify(homeInsurance));
    }
  }, [homeInsurance]);

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatPercent = (value: number): string => {
    return value.toFixed(1);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'}`}>
      {/* Header */}
      <header className={`shadow-sm border-b transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur-md border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center group">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-800 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <h1 className={`text-2xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Boring Mortgages Ontario
                </h1>
                <span className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Making complex mortgages boringly simple
                </span>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              {/* Settings/Reset Button */}
              <button
                onClick={() => {
                  if (confirm('Reset all values to defaults? This will clear your saved data.')) {
                    // Clear localStorage
                    const keys = [
                      'mortgageCalc_loanAmount', 'mortgageCalc_downPayment', 'mortgageCalc_interestRate',
                      'mortgageCalc_loanTerm', 'mortgageCalc_paymentFrequency', 'mortgageCalc_extraPayment',
                      'mortgageCalc_propertyTax', 'mortgageCalc_homeInsurance'
                    ];
                    keys.forEach(key => localStorage.removeItem(key));
                    
                    // Reset to defaults
                    setLoanAmount(500000);
                    setDownPayment(25000);
                    setInterestRate(5.79);
                    setLoanTerm(25);
                    setPaymentFrequency('monthly');
                    setExtraPayment(0);
                    setPropertyTax(4000);
                    setHomeInsurance(1200);
                  }
                }}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-label="Reset calculator"
                title="Reset to defaults"
              >
                🔄
              </button>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                  darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <Link
                href="mailto:hello@mortgagewithford.ca"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium"
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
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Mortgage Payment Calculator
            <span className="block text-3xl md:text-4xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2">
              Canada 2025
            </span>
          </h1>
          <p className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Calculate your monthly mortgage payments with our <strong>free Canadian mortgage calculator</strong>. 
            Get accurate estimates including taxes, insurance, and <strong>CMHC mortgage default insurance</strong>.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex justify-center items-center space-x-8 mt-8">
            <div className="flex items-center space-x-2">
              <span className="text-green-500 text-2xl">🔒</span>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>CMHC Approved</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-500 text-2xl">⚡</span>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Instant Results</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-purple-500 text-2xl">🇨🇦</span>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>2025 Rates</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-500 text-2xl">💾</span>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Auto-Save</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Calculator Form */}
          <div className={`rounded-2xl shadow-2xl p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-3xl font-bold mb-8 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Calculate Your Payment
            </h2>
            
            <div className="space-y-8">
              {/* Purchase Price */}
              <div>
                <label className={`block text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Purchase Price: <span className="text-blue-600 font-bold">${formatCurrency(purchasePrice)}</span>
                </label>
                <input
                  type="range"
                  min="200000"
                  max="2000000"
                  step="10000"
                  value={purchasePrice}
                  onChange={(e) => {
                    const newPrice = Number(e.target.value);
                    const minDown = calculateMinDownPayment(newPrice);
                    setDownPayment(Math.max(minDown, (newPrice * 0.05)));
                    setLoanAmount(newPrice - Math.max(minDown, (newPrice * 0.05)));
                  }}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>$200K</span>
                  <span>$2M</span>
                </div>
              </div>

              {/* Down Payment */}
              <div>
                <label className={`block text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Down Payment: <span className="text-blue-600 font-bold">${formatCurrency(downPayment)} ({formatPercent((downPayment/purchasePrice)*100)}%)</span>
                </label>
                <input
                  type="range"
                  min={minDownPayment}
                  max={purchasePrice * 0.35}
                  step="1000"
                  value={downPayment}
                  onChange={(e) => {
                    const newDownPayment = Number(e.target.value);
                    setDownPayment(newDownPayment);
                    setLoanAmount(purchasePrice - newDownPayment);
                  }}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Min: ${formatCurrency(minDownPayment)}</span>
                  <span>35%: ${formatCurrency(purchasePrice * 0.35)}</span>
                </div>
                {downPayment < minDownPayment && (
                  <p className="text-red-500 text-sm mt-2">
                    ⚠️ Minimum down payment required: ${formatCurrency(minDownPayment)}
                  </p>
                )}
              </div>

              {/* CMHC Warning */}
              {requiresCMHC && (
                <div className={`p-4 rounded-lg border ${darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-500 text-xl mt-0.5">ℹ️</span>
                    <div>
                      <h4 className={`font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                        CMHC Insurance Required
                      </h4>
                      <p className={`text-sm mt-1 ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                        Down payment less than 20% requires CMHC mortgage default insurance.
                        <br />Premium: ${formatCurrency(cmhcPremium)} (LTV: {formatPercent(ltvRatio)}%)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Interest Rate */}
              <div>
                <label className={`block text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Interest Rate: <span className="text-blue-600 font-bold">{interestRate}%</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>1%</span>
                  <span>10%</span>
                </div>
              </div>

              {/* Payment Frequency */}
              <div>
                <label className={`block text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Payment Frequency: <span className="text-blue-600 font-bold">{paymentFrequencies[paymentFrequency as keyof typeof paymentFrequencies].label}</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(paymentFrequencies).map(([key, freq]) => (
                    <button
                      key={key}
                      onClick={() => setPaymentFrequency(key)}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                        paymentFrequency === key
                          ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                          : darkMode 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {freq.label}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Bi-weekly payments can save you thousands in interest!
                </div>
              </div>

              {/* Amortization Period */}
              <div>
                <label className={`block text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Amortization Period: <span className="text-blue-600 font-bold">{loanTerm} years</span>
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[15, 20, 25, 30].map((term) => (
                    <button
                      key={term}
                      onClick={() => setLoanTerm(term)}
                      disabled={requiresCMHC && term > 25}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                        loanTerm === term
                          ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                          : requiresCMHC && term > 25
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : darkMode 
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {term}y
                    </button>
                  ))}
                </div>
                {requiresCMHC && (
                  <p className="text-sm text-orange-600 mt-2">
                    ⚠️ CMHC insurance limits amortization to 25 years maximum
                  </p>
                )}
              </div>

              {/* Extra Payment */}
              <div>
                <label className={`block text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Extra Payment ({paymentFrequencies[paymentFrequency as keyof typeof paymentFrequencies].label}): <span className="text-blue-600 font-bold">${formatCurrency(extraPayment)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="25"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>$0</span>
                  <span>$1,000</span>
                </div>
                {extraPayment > 0 && (
                  <p className="text-green-600 text-sm mt-2">
                    💰 Extra payments can save years of payments and thousands in interest!
                  </p>
                )}
              </div>

              {/* Property Tax */}
              <div>
                <label className={`block text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Annual Property Tax: <span className="text-blue-600 font-bold">${formatCurrency(propertyTax)}</span>
                </label>
                <input
                  type="range"
                  min="1000"
                  max="20000"
                  step="100"
                  value={propertyTax}
                  onChange={(e) => setPropertyTax(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Home Insurance */}
              <div>
                <label className={`block text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Annual Home Insurance: <span className="text-blue-600 font-bold">${formatCurrency(homeInsurance)}</span>
                </label>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="50"
                  value={homeInsurance}
                  onChange={(e) => setHomeInsurance(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Main Result */}
            <div className={`rounded-2xl shadow-2xl p-8 text-center transition-all duration-500 ${
              showResults ? 'scale-100 opacity-100' : 'scale-95 opacity-80'
            } ${darkMode ? 'bg-gradient-to-br from-blue-900 to-indigo-900' : 'bg-gradient-to-br from-blue-600 to-indigo-600'}`}>
              <h3 className="text-2xl font-bold text-white mb-4">Your {paymentFrequencies[paymentFrequency as keyof typeof paymentFrequencies].label} Payment</h3>
              <div className="text-6xl font-bold text-white mb-2">
                ${formatCurrency(monthlyPayment)}
              </div>
              <p className="text-blue-100 text-lg">per {paymentFrequency === 'monthly' ? 'month' : paymentFrequency === 'weekly' ? 'week' : paymentFrequency === 'bi-weekly' ? 'bi-week' : 'semi-month'}</p>
              {extraPayment > 0 && (
                <div className="mt-4 p-3 bg-white bg-opacity-20 rounded-lg">
                  <p className="text-sm text-white">Including ${formatCurrency(extraPayment)} extra payment</p>
                </div>
              )}
            </div>

            {/* Breakdown */}
            <div className={`rounded-2xl shadow-xl p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h4 className={`text-xl font-bold mb-6 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Payment Breakdown
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Principal & Interest</span>
                  <span className={`font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${formatCurrency(principalAndInterest)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Property Tax</span>
                  <span className={`font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${formatCurrency(propertyTax / 12)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Home Insurance</span>
                  <span className={`font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${formatCurrency(homeInsurance / 12)}
                  </span>
                </div>
                <hr className={`transition-colors duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                <div className="flex justify-between items-center text-lg">
                  <span className={`font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Total {paymentFrequencies[paymentFrequency as keyof typeof paymentFrequencies].label}</span>
                  <span className="font-bold text-blue-600">${formatCurrency(monthlyPayment)}</span>
                </div>
              </div>
            </div>

            {/* CMHC Details */}
            {requiresCMHC && (
              <div className={`rounded-2xl shadow-xl p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h4 className={`text-xl font-bold mb-6 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  CMHC Insurance Details
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loan Amount</span>
                    <span className={`font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${formatCurrency(loanAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>CMHC Premium</span>
                    <span className={`font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${formatCurrency(cmhcPremium)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>LTV Ratio</span>
                    <span className={`font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatPercent(ltvRatio)}%
                    </span>
                  </div>
                  <hr className={`transition-colors duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                  <div className="flex justify-between">
                    <span className={`font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Total Loan with CMHC</span>
                    <span className="font-bold text-blue-600">${formatCurrency(loanAmount + cmhcPremium)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Stats */}
            <div className={`rounded-2xl shadow-xl p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-6">
                <h4 className={`text-xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Loan Summary
                </h4>
                <button
                  onClick={() => setShowAmortization(!showAmortization)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  {showAmortization ? 'Hide' : 'Show'} Schedule
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Interest Paid</span>
                  <span className={`font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${formatCurrency(totalInterest)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Principal + Interest</span>
                  <span className={`font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${formatCurrency(totalPayment)}
                  </span>
                </div>
                {extraPayment > 0 && amortizationData.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="text-green-600 font-semibold mb-2">Extra Payment Benefits:</div>
                    <div className="text-sm space-y-1">
                      <div>Time Saved: ~{Math.max(0, (loanTerm * paymentFrequencies[paymentFrequency as keyof typeof paymentFrequencies].multiplier) - amortizationData.length)} payments</div>
                      <div>Interest Saved: Significant savings with extra payments!</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Amortization Schedule */}
              {showAmortization && amortizationData.length > 0 && (
                <div className="mt-6 border-t pt-6">
                  <h5 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Payment Schedule Visualization
                  </h5>
                  
                  {/* Chart Visualization */}
                  <div className="mb-6">
                    <div className="h-64 relative border rounded-lg p-4" style={{ backgroundColor: darkMode ? '#374151' : '#f9fafb' }}>
                      <div className="absolute inset-4 flex items-end space-x-1">
                        {amortizationData.slice(0, Math.min(24, amortizationData.length)).map((payment, index) => {
                          const maxPayment = Math.max(...amortizationData.slice(0, 24).map(p => p.totalPayment));
                          const principalHeight = (payment.principalPayment / maxPayment) * 100;
                          const interestHeight = (payment.interestPayment / maxPayment) * 100;
                          
                          return (
                            <div key={index} className="flex flex-col items-center flex-1 h-full justify-end group relative">
                              <div className="w-full flex flex-col justify-end h-full space-y-0">
                                {/* Interest portion (top) */}
                                <div 
                                  className="bg-red-400 rounded-t-sm transition-all duration-300 group-hover:bg-red-500"
                                  style={{ height: `${interestHeight}%` }}
                                ></div>
                                {/* Principal portion (bottom) */}
                                <div 
                                  className="bg-blue-400 rounded-b-sm transition-all duration-300 group-hover:bg-blue-500"
                                  style={{ height: `${principalHeight}%` }}
                                ></div>
                              </div>
                              
                              {/* Tooltip */}
                              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                                Payment #{payment.payment}<br/>
                                Principal: ${formatCurrency(payment.principalPayment)}<br/>
                                Interest: ${formatCurrency(payment.interestPayment)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Chart Labels */}
                      <div className="absolute bottom-1 left-4 right-4 flex justify-between text-xs text-gray-500">
                        <span>Payment 1</span>
                        <span>Payment {Math.min(24, amortizationData.length)}</span>
                      </div>
                      
                      {/* Legend */}
                      <div className="absolute top-2 right-2 flex space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-blue-400 rounded"></div>
                          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Principal</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-red-400 rounded"></div>
                          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Interest</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-2">
                      Hover over bars to see payment details • Showing first {Math.min(24, amortizationData.length)} payments
                    </p>
                  </div>

                  {/* Table View */}
                  <h6 className={`text-md font-semibold mb-3 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Detailed Payment Schedule (First 12 Payments)
                  </h6>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <th className="p-2 text-left">#</th>
                          <th className="p-2 text-left">Payment</th>
                          <th className="p-2 text-left">Principal</th>
                          <th className="p-2 text-left">Interest</th>
                          <th className="p-2 text-left">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {amortizationData.slice(0, 12).map((payment, index) => (
                          <tr key={index} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:bg-opacity-50 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                            <td className="p-2 font-semibold">{payment.payment}</td>
                            <td className="p-2">${formatCurrency(payment.totalPayment)}</td>
                            <td className="p-2 text-blue-600">${formatCurrency(payment.principalPayment)}</td>
                            <td className="p-2 text-red-600">${formatCurrency(payment.interestPayment)}</td>
                            <td className="p-2 font-semibold">${formatCurrency(payment.remainingBalance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {amortizationData.length > 12 && (
                    <p className="text-center text-sm text-gray-500 mt-3">
                      ... and {amortizationData.length - 12} more payments • Total loan term: {Math.ceil(amortizationData.length / paymentFrequencies[paymentFrequency as keyof typeof paymentFrequencies].multiplier)} years
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Payment Frequency Benefits */}
            {paymentFrequency !== 'monthly' && (
              <div className={`rounded-2xl shadow-xl p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-l-4 border-green-500`}>
                <h4 className={`text-xl font-bold mb-4 text-green-600`}>
                  💰 {paymentFrequencies[paymentFrequency as keyof typeof paymentFrequencies].label} Payment Benefits
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Payments per year:</span>
                    <span className={`font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {paymentFrequencies[paymentFrequency as keyof typeof paymentFrequencies].multiplier} vs 12 (monthly)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Extra payments per year:</span>
                    <span className={`font-bold text-green-600`}>
                      {paymentFrequencies[paymentFrequency as keyof typeof paymentFrequencies].multiplier - 12}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <strong>Why this saves money:</strong> By making {paymentFrequencies[paymentFrequency as keyof typeof paymentFrequencies].label.toLowerCase()} payments, 
                      you're essentially making extra principal payments throughout the year, reducing the total interest paid.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <div className="text-center">
              <Link
                href="mailto:hello@mortgagewithford.ca?subject=Mortgage Pre-Approval Request"
                className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                Get Pre-Approved Now →
              </Link>
              <p className={`mt-3 text-sm transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No impact on credit score • Contact Andreina directly
              </p>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className={`mt-16 rounded-2xl p-8 text-center transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <h3 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Trusted by Ontario Families
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">⭐⭐⭐⭐⭐</div>
              <p className={`font-semibold transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                "Andreina made our first home purchase stress-free"
              </p>
              <p className={`text-sm mt-2 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                - Sarah & Mike, Ottawa
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <p className={`font-semibold transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Licensed Mortgage Agent Level 2
              </p>
              <p className={`text-sm mt-2 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                License #M24000357 | BRX Mortgage #13463
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">📍</div>
              <p className={`font-semibold transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Prince Edward County Based
              </p>
              <p className={`text-sm mt-2 transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Serving all of Ontario
              </p>
            </div>
          </div>
        </div>

        {/* Educational Content */}
        <div className={`mt-16 rounded-2xl shadow-xl p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-3xl font-bold mb-8 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Understanding Your Mortgage Payment in Canada
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                What's Included in Your Payment?
              </h3>
              <ul className={`space-y-3 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <strong>Principal & Interest:</strong> The core mortgage payment that pays down your loan
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <strong>Property Taxes:</strong> Municipal taxes based on your home's assessed value
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <strong>Home Insurance:</strong> Required coverage to protect your investment
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <strong>CMHC Insurance:</strong> Required if your down payment is less than 20%
                </li>
              </ul>
            </div>

            <div>
              <h3 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Tips to Lower Your Payment
              </h3>
              <ul className={`space-y-3 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Increase your down payment to 20% or more to avoid CMHC fees
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Shop around for the best interest rates with a mortgage broker
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Consider a longer amortization to reduce monthly payments
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Bundle home and auto insurance for potential discounts
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className={`mt-16 rounded-2xl shadow-xl p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-3xl font-bold mb-8 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                How accurate is this mortgage payment calculator?
              </h3>
              <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Our calculator provides estimates based on current [CMHC guidelines](https://www.cmhc-schl.gc.ca/) and the information you enter. 
                Actual payments may vary depending on your lender's specific terms, additional fees, and local tax rates. 
                For precise calculations, consult with a licensed mortgage broker for a personalized quote.
              </p>
            </div>
            
            <div>
              <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                What interest rate should I use in the calculator?
              </h3>
              <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Use current market rates as a starting point. As of 2025, Canadian mortgage rates typically 
                range from 5.5% to 6.5% for 5-year fixed terms. A mortgage broker can help you find the 
                best available rates for your situation and qualify you at today's rates.
              </p>
            </div>
            
            <div>
              <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                How much is CMHC mortgage insurance?
              </h3>
              <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                CMHC insurance premiums range from 0.60% to 4.00% of your loan amount, depending on your 
                loan-to-value (LTV) ratio. For example, with a 10% down payment (90% LTV), you'll pay 3.10% 
                of your loan amount as a one-time premium that gets added to your mortgage.
              </p>
            </div>

            <div>
              <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Should I choose a 25-year or 30-year amortization?
              </h3>
              <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                If you need CMHC insurance (down payment less than 20%), you're limited to 25 years maximum. 
                A 25-year amortization results in higher monthly payments but significantly less interest 
                paid over the life of the loan. Consider your budget and long-term financial goals.
              </p>
            </div>
          </div>
        </div>

        {/* Scenario Comparison Tool */}
        <div className="mt-16">
          <div className={`rounded-2xl shadow-xl p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-3xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Compare Scenarios
              </h2>
              <button
                onClick={() => {
                  if (!showComparison) {
                    // Add current scenario as first comparison
                    const currentScenario = {
                      id: Date.now(),
                      name: 'Current Scenario',
                      purchasePrice: purchasePrice,
                      downPayment: downPayment,
                      interestRate: interestRate,
                      loanTerm: loanTerm,
                      paymentFrequency: paymentFrequency,
                      extraPayment: extraPayment,
                      monthlyPayment: monthlyPayment,
                      totalInterest: totalInterest
                    };
                    setComparisonScenarios([currentScenario]);
                  }
                  setShowComparison(!showComparison);
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showComparison ? 'Hide' : 'Compare Scenarios'}
              </button>
            </div>

            {showComparison && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Compare different mortgage scenarios to find the best option for you.
                  </p>
                  <button
                    onClick={() => {
                      const newScenario = {
                        id: Date.now(),
                        name: `Scenario ${comparisonScenarios.length + 1}`,
                        purchasePrice: purchasePrice,
                        downPayment: downPayment,
                        interestRate: interestRate,
                        loanTerm: loanTerm,
                        paymentFrequency: paymentFrequency,
                        extraPayment: extraPayment,
                        monthlyPayment: monthlyPayment,
                        totalInterest: totalInterest
                      };
                      setComparisonScenarios([...comparisonScenarios, newScenario]);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                  >
                    + Add Current as Scenario
                  </button>
                </div>

                {comparisonScenarios.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <th className="p-3 text-left font-semibold">Scenario</th>
                          <th className="p-3 text-left font-semibold">Purchase Price</th>
                          <th className="p-3 text-left font-semibold">Down Payment</th>
                          <th className="p-3 text-left font-semibold">Interest Rate</th>
                          <th className="p-3 text-left font-semibold">Term</th>
                          <th className="p-3 text-left font-semibold">Frequency</th>
                          <th className="p-3 text-left font-semibold">Extra Payment</th>
                          <th className="p-3 text-left font-semibold">Monthly Payment</th>
                          <th className="p-3 text-left font-semibold">Total Interest</th>
                          <th className="p-3 text-left font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonScenarios.map((scenario, index) => (
                          <tr key={scenario.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:bg-opacity-50 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                            <td className="p-3 font-semibold">{scenario.name}</td>
                            <td className="p-3">${formatCurrency(scenario.purchasePrice)}</td>
                            <td className="p-3">${formatCurrency(scenario.downPayment)} ({formatPercent((scenario.downPayment/scenario.purchasePrice)*100)}%)</td>
                            <td className="p-3">{scenario.interestRate.toFixed(2)}%</td>
                            <td className="p-3">{scenario.loanTerm}y</td>
                            <td className="p-3">{paymentFrequencies[scenario.paymentFrequency as keyof typeof paymentFrequencies].label}</td>
                            <td className="p-3">${formatCurrency(scenario.extraPayment)}</td>
                            <td className="p-3 font-bold text-blue-600">${formatCurrency(scenario.monthlyPayment)}</td>
                            <td className="p-3 font-bold text-red-600">${formatCurrency(scenario.totalInterest)}</td>
                            <td className="p-3">
                              <button
                                onClick={() => {
                                  setComparisonScenarios(comparisonScenarios.filter(s => s.id !== scenario.id));
                                }}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {comparisonScenarios.length > 1 && (
                  <div className={`rounded-lg p-4 ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                    <h4 className={`font-semibold mb-3 ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                      📊 Comparison Insights
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong className="text-green-600">Lowest Monthly Payment:</strong><br/>
                        {(() => {
                          const lowest = comparisonScenarios.reduce((prev, curr) => 
                            prev.monthlyPayment < curr.monthlyPayment ? prev : curr
                          );
                          return `${lowest.name}: $${formatCurrency(lowest.monthlyPayment)}`;
                        })()}
                      </div>
                      <div>
                        <strong className="text-red-600">Lowest Total Interest:</strong><br/>
                        {(() => {
                          const lowest = comparisonScenarios.reduce((prev, curr) => 
                            prev.totalInterest < curr.totalInterest ? prev : curr
                          );
                          return `${lowest.name}: $${formatCurrency(lowest.totalInterest)}`;
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {comparisonScenarios.length === 0 && (
                  <div className="text-center py-8">
                    <p className={`text-lg transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Add your current scenario to start comparing options.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Tools */}
        <div className="mt-16">
          <h2 className={`text-3xl font-bold mb-8 text-center transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Related Mortgage Tools
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Link
              href="/mortgage-affordability-calculator"
              className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
            >
              <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Affordability Calculator
              </h3>
              <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Determine how much house you can afford based on your income and expenses.
              </p>
            </Link>
            
            <Link
              href="/cmhc-insurance-calculator"
              className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
            >
              <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                CMHC Insurance Calculator
              </h3>
              <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Calculate your CMHC mortgage default insurance premium costs.
              </p>
            </Link>
            
            <Link
              href="/best-mortgage-rates-canada"
              className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
            >
              <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Best Mortgage Rates
              </h3>
              <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Compare the best mortgage rates available across Canada.
              </p>
            </Link>
          </div>
        </div>

        {/* Contact Section */}
        <div className={`mt-16 rounded-2xl shadow-2xl p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-bold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              👋 Contact Me
            </h2>
            <p className={`text-xl transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Ready to get pre-approved? Let's discuss your mortgage options.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className={`p-6 rounded-xl transition-colors duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Andreina Ford
              </h3>
              <p className={`text-lg font-semibold mb-4 text-blue-600`}>
                Mortgage Agent Level 2
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📌</span>
                  <div>
                    <p className={`font-semibold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      License #: M24000357
                    </p>
                    <p className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Brokerage: BRX Mortgage #13463 (FSRA Ontario)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🌐</span>
                  <Link 
                    href="https://www.mortgagewithford.ca" 
                    target="_blank"
                    className={`hover:text-blue-600 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    www.mortgagewithford.ca
                  </Link>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📧</span>
                  <Link 
                    href="mailto:hello@mortgagewithford.ca"
                    className={`hover:text-blue-600 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    hello@mortgagewithford.ca
                  </Link>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📞</span>
                  <Link 
                    href="tel:613-743-7866"
                    className={`hover:text-blue-600 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    613-743-7866
                  </Link>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📍</span>
                  <p className={`transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Based in Prince Edward County, serving all of Ontario
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl transition-colors duration-300 ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
              <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                📬 Stay Informed (and in control)
              </h3>
              <p className={`mb-6 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Get a free monthly report on your home value, mortgage health, and market updates — curated just for you.
              </p>
              
              <div className="mb-4">
                <Link
                  href="mailto:hello@mortgagewithford.ca?subject=Monthly Report Signup"
                  className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                >
                  🔗 Sign up here to start receiving your personalized digest
                </Link>
              </div>
              
              <p className={`text-sm italic transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No spam. No pressure. Just smart info.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
          transition: all 0.3s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          background: #2563EB;
          transform: scale(1.1);
          box-shadow: 0 6px 12px rgba(59, 130, 246, 0.5);
        }
        .slider::-webkit-slider-track {
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(to right, #3B82F6 0%, #3B82F6 var(--value, 0%), #E5E7EB var(--value, 0%), #E5E7EB 100%);
        }
      `}</style>
    </div>
  );
} 