'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MortgageCalculator from '../../components/calculators/MortgageCalculator';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';
import PreApprovalForm from '../../components/PreApprovalForm';
import { CONTACT_CONFIG } from '../../config/contact';

export default function MortgagePaymentCalculator() {
  const [isPreApprovalFormOpen, setIsPreApprovalFormOpen] = useState(false);

  const handleOpenPreApprovalForm = () => {
    setIsPreApprovalFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Mortgage Payment Calculator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Calculate your monthly mortgage payments with taxes, insurance, and CMHC premiums. 
              Built with <strong>official CMHC rules</strong> for accurate calculations in the Canadian market.
            </p>
          </div>
          
          <MortgageCalculator 
            onOpenContactForm={handleOpenPreApprovalForm}
            currentRates={[
              { term: "5 Year", rate: "4.5%", type: "Fixed", lender: "Current Market" }
            ]}
          />
        </div>
      </div>

      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            <strong>Important:</strong> This calculator provides estimates for planning purposes only. 
            Actual rates and payments may vary based on your credit score, lender choice, and current market conditions. 
            CMHC insurance rates are current as of 2025 and subject to change.
          </p>
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