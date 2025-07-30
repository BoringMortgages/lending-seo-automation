'use client';

import React, { useState } from 'react';
import MortgageCalculator from '../../components/calculators/MortgageCalculator';

export default function TestCalculator() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  const handleOpenContactForm = () => {
    setIsContactFormOpen(true);
    console.log('Contact form opened');
    alert('Contact form would open here!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Updated Mortgage Calculator Test
          </h1>
          <p className="text-xl text-gray-600">
            Testing the new calculator with Toronto UI and CMHC rules
          </p>
        </div>
        
        <MortgageCalculator 
          onOpenContactForm={handleOpenContactForm}
          currentRates={[
            { term: "5 Year", rate: "4.5%", type: "Fixed", lender: "Test Bank" }
          ]}
        />
      </div>
    </div>
  );
} 