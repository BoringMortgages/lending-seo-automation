import React from 'react';
import Button from '@/components/ui/Button';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  badge?: string;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  badge,
  className = ''
}) => {
  return (
    <section className={`py-16 lg:py-24 bg-boring-light-gray grain-texture relative overflow-hidden ${className}`} style={{
      backgroundImage: `url('/backgrounds/peach-gradient-bg.svg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          {/* Badge */}
          {badge && (
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-boring-purple/10 rounded-full text-sm font-medium text-boring-purple">
                {badge}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-boring-charcoal mb-6 leading-tight">
            {title}
            {subtitle && (
              <span className="block text-gradient heading-serif mt-2">
                {subtitle}
              </span>
            )}
          </h1>

          {/* Description */}
          <p className="text-xl text-boring-dark-gray max-w-4xl mx-auto mb-10 leading-relaxed">
            {description}
          </p>

          {/* CTAs */}
          {(primaryCTA || secondaryCTA) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {primaryCTA && (
                <Button 
                  variant="primary" 
                  size="lg" 
                  href={primaryCTA.href}
                  className="shadow-lg"
                >
                  {primaryCTA.text}
                </Button>
              )}
              {secondaryCTA && (
                <Button 
                  variant="secondary" 
                  size="lg" 
                  href={secondaryCTA.href}
                >
                  {secondaryCTA.text}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;