import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/sections/HeroSection';
import RateComparison from '@/components/sections/RateComparison';
import TrustIndicators from '@/components/sections/TrustIndicators';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import BackgroundTexture from '@/components/backgrounds/BackgroundTexture';

export const metadata: Metadata = {
  title: "Boring Mortgages Ontario | Predictably Better Rates",
  description: "Get boringly better mortgage rates with refreshingly honest advice.",
};

export default function SimpleLandingPage() {
  return (
    <div className="min-h-screen bg-boring-hero dark:bg-boring-charcoal transition-colors duration-300">
      {/* Header */}
      <Header currentPage="landing" />

      {/* Hero Section */}
      <BackgroundTexture variant="light-gray" intensity="normal">
        <HeroSection
          badge="🏠 Licensed in Ontario • FSRA Regulated"
          title="Predictably Better"
          subtitle="Mortgage Rates"
          description="No flashy gimmicks. No confusing jargon. Just boringly transparent mortgage advice that helps you save thousands on your Ontario home loan."
          primaryCTA={{
            text: "Calculate My Payment",
            href: "/mortgage-payment-calculator"
          }}
          secondaryCTA={{
            text: "Book Boring Consultation",
            href: "https://callme.mortgagewithford.ca"
          }}
        />
      </BackgroundTexture>

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* Rate Comparison */}
      <RateComparison 
        title="Refreshingly Honest Rate Comparison"
        subtitle="Real rates from real lenders • Updated weekly with boring consistency"
      />

      {/* CTA Section */}
      <BackgroundTexture variant="purple-accent" intensity="normal" className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-boring-charcoal dark:text-boring-light-gray mb-6 heading-serif">
            Ready for Boringly Better Service?
          </h2>
          <p className="text-xl text-boring-dark-gray dark:text-boring-light-gray/80 mb-8">
            No pressure tactics. No surprise fees. No confusing fine print. 
            Just <strong>honest mortgage guidance</strong> from <strong>Andreina Ford</strong>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              variant="primary" 
              size="lg" 
              href="https://callme.mortgagewithford.ca"
              className="shadow-lg transform hover:scale-105 transition-all"
            >
              Book Free Consultation
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              href="mailto:hello@mortgagewithford.ca"
            >
              Send Quick Email
            </Button>
          </div>
        </div>
      </BackgroundTexture>

      {/* Footer */}
      <Footer />
    </div>
  );
}