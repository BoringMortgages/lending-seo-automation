'use client';

import { useState } from 'react';
import Link from "next/link";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import PreApprovalForm from "../../components/PreApprovalForm";
import AffordabilityCalculator from "../../components/calculators/AffordabilityCalculator";

export default function MortgageAffordabilityCalculator() {
  const [isPreApprovalFormOpen, setIsPreApprovalFormOpen] = useState(false);

  const handleOpenPreApprovalForm = () => {
    setIsPreApprovalFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Mortgage Affordability Calculator
            <span className="block text-3xl md:text-4xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-2">
              How Much House Can You Afford?
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Calculate how much house you can afford based on your income, expenses, and debt obligations. 
            Get accurate estimates using Canadian lending guidelines and <strong>debt service ratios</strong>.
          </p>
        </div>

        <AffordabilityCalculator 
          onOpenContactForm={handleOpenPreApprovalForm}
        />

        {/* Educational Content */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Understanding Mortgage Affordability in Canada
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Debt Service Ratios Explained
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-600">GDS Ratio (≤39%)</h4>
                  <p className="text-gray-600 text-sm">
                    Gross Debt Service includes your mortgage payment, property taxes, 
                    heating costs, and 50% of condo fees. Should not exceed 39% of gross income.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600">TDS Ratio (≤44%)</h4>
                  <p className="text-gray-600 text-sm">
                    Total Debt Service includes all housing costs plus other debts like 
                    credit cards, car loans, and student loans. Should not exceed 44% of gross income.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Tips to Increase Affordability
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Pay down existing debts to improve your TDS ratio
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Save a larger down payment to reduce mortgage needed
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Consider a longer amortization to reduce monthly payments
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Shop around for the best interest rates with a broker
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Include all sources of income (bonuses, part-time work)
                </li>
              </ul>
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
                Payment Calculator
              </h3>
              <p className="text-gray-600">
                Calculate exact monthly payments for any mortgage amount and term.
              </p>
            </Link>
            
            <Link
              href="/heloc-payment-calculator"
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                HELOC Calculator
              </h3>
              <p className="text-gray-600">
                Calculate payments for your Home Equity Line of Credit.
              </p>
            </Link>
            
            <Link
              href="/mortgage-qualification-calculator"
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Qualification Calculator
              </h3>
              <p className="text-gray-600">
                Check if you meet lending requirements and stress test rules.
              </p>
            </Link>
          </div>
        </div>
      </div>

      
      <Footer showRegulatory={true} />
      
      <PreApprovalForm 
        isOpen={isPreApprovalFormOpen} 
        onClose={() => setIsPreApprovalFormOpen(false)} 
      />
    </div>
  );
} 