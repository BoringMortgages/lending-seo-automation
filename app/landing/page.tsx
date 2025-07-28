import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/sections/HeroSection';
import MortgageCalculator from '@/components/calculators/MortgageCalculator';
import RateComparison from '@/components/sections/RateComparison';
import TrustIndicators from '@/components/sections/TrustIndicators';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import BackgroundTexture from '@/components/backgrounds/BackgroundTexture';

export const metadata: Metadata = {
  title: "Boring Mortgages Ontario | Predictably Better Rates & Boringly Transparent Process",
  description: "Get boringly better mortgage rates with refreshingly honest advice. No surprises, no hidden fees, just predictably reliable service from Ontario's most boring mortgage experts.",
  keywords: "boring mortgages, Ontario mortgage rates, transparent mortgage process, reliable mortgage broker, honest mortgage advice, predictable rates, no hidden fees",
  openGraph: {
    title: "Boring Mortgages Ontario | Predictably Better Rates",
    description: "Because predictable and reliable beats flashy and risky every time. Get boring mortgage advice that actually helps.",
    type: "website",
  },
};

export default function BoringMortgageLandingPage() {
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
          description="No flashy gimmicks. No confusing jargon. Just boringly transparent mortgage advice that helps you save thousands on your Ontario home loan. Because sometimes boring is exactly what you need."
          primaryCTA={{
            text: "Calculate My Payment",
            href: "#calculator"
          }}
          secondaryCTA={{
            text: "Book a call",
            href: "https://callme.mortgagewithford.ca"
          }}
        />
      </BackgroundTexture>

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* Calculator Section */}
      <BackgroundTexture variant="mint-gradient" intensity="subtle" className="py-16" id="calculator">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-boring-charcoal dark:text-boring-light-gray mb-4 heading-serif">
              Boringly Accurate Calculator
            </h2>
            <p className="text-xl text-boring-dark-gray dark:text-boring-light-gray/80 max-w-3xl mx-auto">
              Calculate your real monthly payment with taxes, insurance, and CMHC premiums. 
              No hidden surprises, just boring math that adds up correctly.
            </p>
          </div>
          
          <div className="card-boring bg-white dark:bg-card rounded-2xl shadow-professional max-w-4xl mx-auto">
            <MortgageCalculator />
          </div>
        </div>
      </BackgroundTexture>

      {/* Rate Comparison */}
      <RateComparison 
        title="Refreshingly Honest Rate Comparison"
        subtitle="Real rates from real lenders • Updated weekly with predictable consistency"
      />

      {/* CTA Section */}
      <BackgroundTexture variant="purple-accent" intensity="normal" className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-boring-charcoal dark:text-boring-light-gray mb-6 heading-serif">
            Ready for Boringly Better Service?
          </h2>
          <p className="text-xl text-boring-dark-gray dark:text-boring-light-gray/80 mb-8">
            No pressure tactics. No surprise fees. No confusing fine print. 
            Just <strong>honest mortgage guidance</strong> from <strong>Andreina Ford</strong> - 
            Licensed Mortgage Agent Level 2, specializing in making the complex boringly simple.
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
              href="mailto:hello@boringmortgages.ca"
            >
              Send Quick Email
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center space-x-8 text-sm text-boring-dark-gray dark:text-boring-light-gray/70">
            <div className="flex items-center space-x-2">
              <span className="text-boring-bright-green">✓</span>
              <span>Licensed in Ontario</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-boring-bright-green">✓</span>
              <span>FSRA Regulated</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-boring-bright-green">✓</span>
              <span>BRX Mortgage #13463</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-boring-bright-green">✓</span>
              <span>Boringly Reliable</span>
            </div>
          </div>
        </div>
      </BackgroundTexture>

      {/* Social Proof Section */}
      <section className="py-16 bg-white dark:bg-boring-charcoal grain-texture-fine">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-boring-charcoal dark:text-boring-light-gray mb-4 heading-serif">
              What Our Boring Clients Say
            </h2>
            <p className="text-lg text-boring-dark-gray dark:text-boring-light-gray/80">
              Real reviews from real people who appreciate boring reliability
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Finally, a mortgage broker who explains everything clearly. No surprises, no pushy sales tactics. Just honest advice that saved us $200/month.",
                name: "Sarah M.",
                location: "Toronto",
                savings: "$200/month saved"
              },
              {
                quote: "Andreina made our first-time home buying experience so much less stressful. Her 'boring' approach was exactly what we needed - straightforward and reliable.",
                name: "Mike & Jessica T.",
                location: "Ottawa",
                savings: "First-time buyers"
              },
              {
                quote: "I thought all mortgage brokers were the same until I worked with Boring Mortgages. The transparency and follow-through is refreshing.",
                name: "David L.",
                location: "Mississauga", 
                savings: "Refinance specialist"
              }
            ].map((testimonial, index) => (
              <div key={index} className="card-boring bg-white dark:bg-card text-center">
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-boring-bright-green text-lg">★</span>
                  ))}
                </div>
                <blockquote className="text-boring-dark-gray dark:text-boring-light-gray/80 mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="border-t border-boring-mint/30 pt-4">
                  <div className="font-semibold text-boring-charcoal dark:text-boring-light-gray">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-boring-dark-gray dark:text-boring-light-gray/70">
                    {testimonial.location}
                  </div>
                  <div className="text-sm text-boring-purple font-medium mt-1">
                    {testimonial.savings}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}