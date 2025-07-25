import React from 'react';
import Header from '@/components/layout/Header';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-boring-hero">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-boring-charcoal heading-serif mb-4">
          Test Page
        </h1>
        <p className="text-boring-dark-gray">
          This is a test page to check if the components are working.
        </p>
        <div className="card-boring mt-8">
          <h2 className="text-2xl font-bold text-boring-teal mb-4">Test Card</h2>
          <p className="text-boring-muted">
            If you can see this styled card, the CSS and components are working correctly.
          </p>
        </div>
      </div>
    </div>
  );
}