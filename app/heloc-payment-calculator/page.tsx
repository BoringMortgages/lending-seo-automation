'use client';

import { useState } from 'react';
import Link from "next/link";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import HELOCCalculator from "../../components/calculators/HELOCCalculator";

export default function HELOCPaymentCalculator() {
  const handleOpenContactForm = () => {
    window.location.href = "mailto:hello@mortgagewithford.ca?subject=HELOC Inquiry";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to the Ontario HELOC Calculator
            <span className="block text-3xl md:text-4xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-2">
              Calculate Your Available Home Equity
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Determine your maximum HELOC amount and estimated monthly interest costs for your <strong>home equity line of credit</strong>.
          </p>
        </div>

        <HELOCCalculator 
          onOpenContactForm={handleOpenContactForm}
        />

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
                  <span className="text-green-600 mr-2">•</span>
                  <strong>Revolving Credit:</strong> Like a credit card secured by your home
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <strong>Variable Rate:</strong> Interest rate changes with prime rate
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <strong>Interest-Only:</strong> Minimum payments are typically interest-only
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
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


      <Footer showRegulatory={true} />
    </div>
  );
} 