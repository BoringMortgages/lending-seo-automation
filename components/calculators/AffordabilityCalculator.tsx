'use client';

import { useState, useEffect } from 'react';
import Button from "../ui/Button";

interface AffordabilityCalculatorProps {
  onOpenContactForm?: () => void;
}

const AffordabilityCalculator: React.FC<AffordabilityCalculatorProps> = ({ 
  onOpenContactForm 
}) => {
  const [income, setIncome] = useState(80000);
  const [downPayment, setDownPayment] = useState(50000);
  const [interestRate, setInterestRate] = useState(5.79);
  const [propertyTax, setPropertyTax] = useState(4000);
  const [otherDebts, setOtherDebts] = useState(500);
  
  const [maxMortgage, setMaxMortgage] = useState(0);
  const [maxPurchasePrice, setMaxPurchasePrice] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [tdsRatio, setTdsRatio] = useState(0);
  const [gdsRatio, setGdsRatio] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    calculateAffordability();
  }, [income, downPayment, interestRate, propertyTax, otherDebts]);

  const calculateAffordability = () => {
    const monthlyIncome = income / 12;
    const monthlyTax = propertyTax / 12;
    
    // GDS (Gross Debt Service) - should not exceed 39%
    const maxGDSPayment = monthlyIncome * 0.39;
    const maxMortgagePayment = maxGDSPayment - monthlyTax;
    
    // TDS (Total Debt Service) - should not exceed 44%
    const maxTDSPayment = monthlyIncome * 0.44;
    const maxMortgagePaymentTDS = maxTDSPayment - monthlyTax - otherDebts;
    
    // Use the lower of the two
    const maxAllowedPayment = Math.min(maxMortgagePayment, maxMortgagePaymentTDS);
    
    // Calculate maximum mortgage amount
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = 25 * 12; // 25 year amortization
    
    let maxMortgageAmount = 0;
    if (monthlyRate > 0) {
      maxMortgageAmount = maxAllowedPayment * (Math.pow(1 + monthlyRate, numPayments) - 1) / 
                         (monthlyRate * Math.pow(1 + monthlyRate, numPayments));
    } else {
      maxMortgageAmount = maxAllowedPayment * numPayments;
    }
    
    const maxPurchase = maxMortgageAmount + downPayment;
    
    // Calculate actual payment based on max mortgage
    let actualPayment = 0;
    if (monthlyRate > 0) {
      actualPayment = maxMortgageAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                     (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else {
      actualPayment = maxMortgageAmount / numPayments;
    }
    
    // Calculate ratios
    const totalHousingCosts = actualPayment + monthlyTax;
    const calculatedGDS = (totalHousingCosts / monthlyIncome) * 100;
    const calculatedTDS = ((totalHousingCosts + otherDebts) / monthlyIncome) * 100;
    
    setMaxMortgage(maxMortgageAmount);
    setMaxPurchasePrice(maxPurchase);
    setMonthlyPayment(actualPayment);
    setGdsRatio(calculatedGDS);
    setTdsRatio(calculatedTDS);
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
            Calculate Your Affordability
          </h2>
          
          <div className="space-y-8">
            {/* Annual Income */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Annual Gross Income: <span className="text-green-600 font-bold">${formatCurrency(income)}</span>
              </label>
              <input
                type="range"
                min="30000"
                max="300000"
                step="5000"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>$30K</span>
                <span>$300K</span>
              </div>
            </div>

            {/* Down Payment */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Available Down Payment: <span className="text-green-600 font-bold">${formatCurrency(downPayment)}</span>
              </label>
              <input
                type="range"
                min="10000"
                max="500000"
                step="5000"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>$10K</span>
                <span>$500K</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Interest Rate: <span className="text-green-600 font-bold">{interestRate}%</span>
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

            {/* Property Tax */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Annual Property Tax: <span className="text-green-600 font-bold">${formatCurrency(propertyTax)}</span>
              </label>
              <input
                type="range"
                min="2000"
                max="15000"
                step="250"
                value={propertyTax}
                onChange={(e) => setPropertyTax(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Other Monthly Debts */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Other Monthly Debts: <span className="text-green-600 font-bold">${formatCurrency(otherDebts)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="3000"
                step="50"
                value={otherDebts}
                onChange={(e) => setOtherDebts(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <p className="text-sm text-gray-600 mt-2">
                Include credit cards, car loans, student loans, etc.
              </p>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Main Result */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Maximum Purchase Price</h3>
            <div className="text-6xl font-bold mb-2">
              ${formatCurrency(maxPurchasePrice)}
            </div>
            <p className="text-green-100 text-lg">Based on Canadian lending guidelines</p>
          </div>

          {/* Breakdown */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h4 className="text-xl font-bold text-gray-900 mb-6">
              Affordability Breakdown
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Maximum Mortgage</span>
                <span className="font-bold text-gray-900">
                  ${formatCurrency(maxMortgage)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Down Payment</span>
                <span className="font-bold text-gray-900">
                  ${formatCurrency(downPayment)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monthly Payment</span>
                <span className="font-bold text-gray-900">
                  ${formatCurrency(monthlyPayment)}
                </span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-gray-900">Total Purchase Price</span>
                <span className="font-bold text-green-600">${formatCurrency(maxPurchasePrice)}</span>
              </div>
            </div>
          </div>

          {/* Debt Service Ratios */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h4 className="text-xl font-bold text-gray-900 mb-6">
              Debt Service Ratios
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">GDS Ratio (Housing Costs)</span>
                  <span className={`font-bold ${gdsRatio <= 39 ? 'text-green-600' : 'text-red-600'}`}>
                    {gdsRatio.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      gdsRatio <= 39 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(gdsRatio, 50)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Maximum recommended: 39%</p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">TDS Ratio (Total Debt)</span>
                  <span className={`font-bold ${tdsRatio <= 44 ? 'text-green-600' : 'text-red-600'}`}>
                    {tdsRatio.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      tdsRatio <= 44 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(tdsRatio, 50)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Maximum recommended: 44%</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button
              onClick={onOpenContactForm}
              variant="accent"
              size="lg"
            >
              Get Pre-Approved
            </Button>
            <p className="mt-3 text-sm text-gray-500">
              Turn your affordability into approval • Licensed Mortgage Agent
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

export default AffordabilityCalculator;