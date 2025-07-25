'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';

interface CalculatorInputs {
  purchasePrice: number;
  downPayment: number;
  interestRate: number;
  amortization: number;
  propertyTax: number;
  homeInsurance: number;
}

interface CalculatorResults {
  monthlyPayment: number;
  cmhcInsurance: number;
  totalMonthlyPayment: number;
  totalInterest: number;
  loanAmount: number;
}

const MortgageCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    purchasePrice: 800000,
    downPayment: 160000,
    interestRate: 3.94,
    amortization: 25,
    propertyTax: 8000,
    homeInsurance: 2400,
  });

  const [results, setResults] = useState<CalculatorResults>({
    monthlyPayment: 0,
    cmhcInsurance: 0,
    totalMonthlyPayment: 0,
    totalInterest: 0,
    loanAmount: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Official CMHC insurance premium calculation (2025 rates)
  const calculateCMHCInsurance = (purchasePrice: number, downPayment: number): number => {
    const loanAmount = purchasePrice - downPayment;
    const downPaymentPercentage = (downPayment / purchasePrice) * 100;

    if (downPaymentPercentage >= 20) return 0; // No CMHC needed
    if (purchasePrice > 1500000) return 0; // CMHC not available over $1.5M

    // Official CMHC premium rates based on down payment percentage
    let rate = 0;
    if (downPaymentPercentage >= 15) {
      rate = 0.028; // 2.80% for 15-19.99% down
    } else if (downPaymentPercentage >= 10) {
      rate = 0.031; // 3.10% for 10-14.99% down
    } else {
      rate = 0.040; // 4.00% for 5-9.99% down
    }

    return loanAmount * rate;
  };

  // Canadian mortgage payment calculation with semi-annual compounding
  const calculatePayment = (principal: number, annualRate: number, years: number): number => {
    // Canadian mortgages compound semi-annually, not monthly
    const semiAnnualRate = annualRate / 100 / 2;
    const effectiveMonthlyRate = Math.pow(1 + semiAnnualRate, 2/12) - 1;
    const numPayments = years * 12;
    
    if (effectiveMonthlyRate === 0) return principal / numPayments;
    
    return (principal * effectiveMonthlyRate * Math.pow(1 + effectiveMonthlyRate, numPayments)) / 
           (Math.pow(1 + effectiveMonthlyRate, numPayments) - 1);
  };

  // Validate inputs
  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (inputs.purchasePrice <= 0) {
      newErrors.purchasePrice = 'Purchase price must be greater than $0';
    }
    if (inputs.downPayment < 0) {
      newErrors.downPayment = 'Down payment cannot be negative';
    }
    if (inputs.downPayment >= inputs.purchasePrice) {
      newErrors.downPayment = 'Down payment must be less than purchase price';
    }
    if (inputs.interestRate <= 0 || inputs.interestRate > 20) {
      newErrors.interestRate = 'Interest rate must be between 0.1% and 20%';
    }
    if (inputs.amortization < 5 || inputs.amortization > 30) {
      newErrors.amortization = 'Amortization must be between 5 and 30 years';
    }

    // Official CMHC down payment rules (Canadian)
    const downPaymentPercentage = (inputs.downPayment / inputs.purchasePrice) * 100;
    
    if (inputs.purchasePrice <= 500000 && downPaymentPercentage < 5) {
      newErrors.downPayment = 'Minimum 5% down payment required for homes $500,000 and under';
    } else if (inputs.purchasePrice > 500000 && inputs.purchasePrice <= 1500000) {
      // 5% on first $500K + 10% on remainder (CMHC rules)
      const required = 25000 + (inputs.purchasePrice - 500000) * 0.1;
      if (inputs.downPayment < required) {
        newErrors.downPayment = `CMHC rules: 5% on first $500K + 10% on remainder. Minimum: $${required.toLocaleString()}`;
      }
    } else if (inputs.purchasePrice > 1500000 && downPaymentPercentage < 20) {
      newErrors.downPayment = 'Minimum 20% down payment required for homes over $1.5M (CMHC not available)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate results
  useEffect(() => {
    if (validateInputs()) {
      const loanAmount = inputs.purchasePrice - inputs.downPayment;
      const cmhcInsurance = calculateCMHCInsurance(inputs.purchasePrice, inputs.downPayment);
      const totalLoanAmount = loanAmount + cmhcInsurance;
      
      const monthlyPayment = calculatePayment(totalLoanAmount, inputs.interestRate, inputs.amortization);
      const totalInterest = (monthlyPayment * inputs.amortization * 12) - totalLoanAmount;
      const monthlyPropertyTax = inputs.propertyTax / 12;
      const monthlyInsurance = inputs.homeInsurance / 12;
      const totalMonthlyPayment = monthlyPayment + monthlyPropertyTax + monthlyInsurance;

      setResults({
        monthlyPayment,
        cmhcInsurance,
        totalMonthlyPayment,
        totalInterest,
        loanAmount: totalLoanAmount,
      });
    }
  }, [inputs]);

  const handleInputChange = (field: keyof CalculatorInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (rate: number): string => {
    return `${rate.toFixed(2)}%`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-boring-charcoal mb-4 heading-serif">
          Mortgage Payment Calculator
        </h1>
        <p className="text-xl text-boring-dark-gray max-w-3xl mx-auto">
          Calculate your monthly mortgage payments with taxes, insurance, and CMHC premiums. 
          Built with <strong>official CMHC rules</strong> for boring accuracy in the Canadian market.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Card */}
        <div className="card-boring bg-white border-boring-mint/40">
          <h2 className="text-2xl font-bold text-boring-teal mb-6">Loan Details</h2>
          
          <div className="space-y-6">
            {/* Purchase Price */}
            <div>
              <label className="block text-sm font-semibold text-boring-charcoal mb-2">
                Purchase Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-boring-dark-gray">$</span>
                <input
                  type="number"
                  value={inputs.purchasePrice}
                  onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-boring-mint/60 rounded-xl focus:border-boring-purple focus:ring-2 focus:ring-boring-purple/20 transition-colors bg-white text-boring-charcoal"
                  placeholder="800,000"
                />
              </div>
              {errors.purchasePrice && (
                <p className="text-sm text-boring-charcoal mt-1">{errors.purchasePrice}</p>
              )}
            </div>

            {/* Down Payment */}
            <div>
              <label className="block text-sm font-semibold text-boring-charcoal mb-2">
                Down Payment
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-boring-dark-gray">$</span>
                <input
                  type="number"
                  value={inputs.downPayment}
                  onChange={(e) => handleInputChange('downPayment', e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-boring-mint/60 rounded-xl focus:border-boring-purple focus:ring-2 focus:ring-boring-purple/20 transition-colors bg-white text-boring-charcoal"
                  placeholder="160,000"
                />
              </div>
              <p className="text-xs text-boring-dark-gray mt-1">
                {inputs.purchasePrice > 0 && `${((inputs.downPayment / inputs.purchasePrice) * 100).toFixed(1)}% of purchase price`}
              </p>
              {errors.downPayment && (
                <p className="text-sm text-boring-charcoal mt-1">{errors.downPayment}</p>
              )}
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-semibold text-boring-charcoal mb-2">
                Interest Rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={inputs.interestRate}
                  onChange={(e) => handleInputChange('interestRate', e.target.value)}
                  className="w-full pr-8 pl-4 py-3 border border-boring-mint/60 rounded-xl focus:border-boring-purple focus:ring-2 focus:ring-boring-purple/20 transition-colors bg-white text-boring-charcoal"
                  placeholder="3.94"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-boring-dark-gray">%</span>
              </div>
              {errors.interestRate && (
                <p className="text-sm text-boring-charcoal mt-1">{errors.interestRate}</p>
              )}
            </div>

            {/* Amortization */}
            <div>
              <label className="block text-sm font-semibold text-boring-charcoal mb-2">
                Amortization Period
              </label>
              <select
                value={inputs.amortization}
                onChange={(e) => handleInputChange('amortization', e.target.value)}
                className="w-full px-4 py-3 border border-boring-mint/60 rounded-xl focus:border-boring-purple focus:ring-2 focus:ring-boring-purple/20 transition-colors bg-white text-boring-charcoal"
              >
                {[15, 20, 25, 30].map(years => (
                  <option key={years} value={years}>{years} years</option>
                ))}
              </select>
              {errors.amortization && (
                <p className="text-sm text-boring-charcoal mt-1">{errors.amortization}</p>
              )}
            </div>

            {/* Additional Costs */}
            <div className="pt-4 border-t border-boring-mint/30">
              <h3 className="text-lg font-semibold text-boring-teal mb-4">Additional Monthly Costs</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-boring-charcoal mb-2">
                    Annual Property Tax
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-boring-dark-gray">$</span>
                    <input
                      type="number"
                      value={inputs.propertyTax}
                      onChange={(e) => handleInputChange('propertyTax', e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-boring-mint/60 rounded-xl focus:border-boring-purple focus:ring-2 focus:ring-boring-purple/20 transition-colors bg-white text-boring-charcoal"
                      placeholder="8,000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-boring-charcoal mb-2">
                    Annual Home Insurance
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-boring-dark-gray">$</span>
                    <input
                      type="number"
                      value={inputs.homeInsurance}
                      onChange={(e) => handleInputChange('homeInsurance', e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-boring-mint/60 rounded-xl focus:border-boring-purple focus:ring-2 focus:ring-boring-purple/20 transition-colors bg-white text-boring-charcoal"
                      placeholder="2,400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="card-boring bg-white border-l-4 border-l-boring-mint">
          <h2 className="text-2xl font-bold text-boring-teal mb-6">Payment Breakdown</h2>
          
          <div className="space-y-6">
            {/* Monthly Payment */}
            <div className="bg-boring-light-gray/30 p-6 rounded-xl">
              <div className="text-center">
                <p className="text-sm font-medium text-boring-dark-gray mb-2">Total Monthly Payment</p>
                <p className="rate-display text-4xl text-boring-purple mb-2">
                  {formatCurrency(results.totalMonthlyPayment)}
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="w-2 h-2 bg-boring-bright-green rounded-full"></span>
                  <span className="text-sm text-boring-dark-gray">Principal, Interest, Tax & Insurance</span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-boring-dark-gray">Mortgage Payment</span>
                <span className="font-semibold text-boring-charcoal">{formatCurrency(results.monthlyPayment)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-boring-dark-gray">Property Tax</span>
                <span className="font-semibold text-boring-charcoal">{formatCurrency(inputs.propertyTax / 12)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-boring-dark-gray">Home Insurance</span>
                <span className="font-semibold text-boring-charcoal">{formatCurrency(inputs.homeInsurance / 12)}</span>
              </div>

              {results.cmhcInsurance > 0 && (
                <div className="flex justify-between items-center py-2 border-t border-boring-mint/30 pt-4">
                  <span className="text-boring-dark-gray">CMHC Insurance Premium</span>
                  <span className="font-semibold text-boring-charcoal">{formatCurrency(results.cmhcInsurance)}</span>
                </div>
              )}
            </div>

            {/* Loan Summary */}
            <div className="border-t border-boring-mint/30 pt-6">
              <h3 className="text-lg font-semibold text-boring-teal mb-4">Loan Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-boring-dark-gray">Loan Amount</span>
                  <span className="font-semibold text-boring-charcoal">{formatCurrency(results.loanAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-boring-dark-gray">Total Interest</span>
                  <span className="font-semibold text-boring-charcoal">{formatCurrency(results.totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-boring-dark-gray">Down Payment</span>
                  <span className="font-semibold text-boring-charcoal">{formatCurrency(inputs.downPayment)}</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-6">
              <Button 
                variant="primary" 
                size="lg" 
                href="https://callme.mortgagewithford.ca"
                className="w-full"
              >
                Get Pre-Approved →
              </Button>
              <p className="text-xs text-boring-dark-gray text-center mt-2">
                Connect with a licensed Ontario mortgage agent
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-12 p-6 bg-boring-light-gray/50 rounded-xl border border-boring-mint/30">
        <p className="text-sm text-boring-dark-gray text-center">
          <strong>Boring but important:</strong> This calculator provides estimates for planning purposes only. 
          Actual rates and payments may vary based on your credit score, lender choice, and current market conditions. 
          CMHC insurance rates are current as of 2025 and subject to change.
        </p>
      </div>
    </div>
  );
};

export default MortgageCalculator;