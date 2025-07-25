import React from 'react';

interface TrustItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface TrustIndicatorsProps {
  title?: string;
  subtitle?: string;
  items?: TrustItem[];
  className?: string;
}

const CheckIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path 
      fillRule="evenodd" 
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
      clipRule="evenodd" 
    />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path 
      fillRule="evenodd" 
      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
      clipRule="evenodd" 
    />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path 
      fillRule="evenodd" 
      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" 
      clipRule="evenodd" 
    />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path 
      fillRule="evenodd" 
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" 
      clipRule="evenodd" 
    />
  </svg>
);

const defaultTrustItems: TrustItem[] = [
  {
    icon: <CheckIcon />,
    title: 'Boringly Transparent Process',
    description: 'No hidden fees, no surprise conditions. Every step explained in plain English with boring clarity.'
  },
  {
    icon: <ShieldIcon />,
    title: 'Predictably Better Rates',
    description: 'Access to 40+ lenders means we find rates that are consistently competitive, not just promotional.'
  },
  {
    icon: <DocumentIcon />,
    title: 'Refreshingly Honest Advice',
    description: 'We tell you what you need to hear, not what you want to hear. Sometimes boring is better.'
  },
  {
    icon: <ClockIcon />,
    title: 'Reliably Fast Approvals',
    description: 'Our proven process typically gets approvals in 24-48 hours. Boring efficiency at its finest.'
  }
];

const TrustIndicators: React.FC<TrustIndicatorsProps> = ({
  title = "Why Choose Boring?",
  subtitle = "Because predictable and reliable beats flashy and risky every time",
  items = defaultTrustItems,
  className = ''
}) => {
  return (
    <section className={`py-16 bg-white dark:bg-boring-charcoal grain-texture-fine ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-boring-charcoal dark:text-boring-light-gray mb-4 heading-serif">
            {title}
          </h2>
          <p className="text-xl text-boring-dark-gray dark:text-boring-light-gray/80 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <div 
              key={index}
              className="text-center group hover:transform hover:-translate-y-2 transition-all duration-300"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-boring-bright-green/10 dark:bg-boring-bright-green/20 rounded-2xl mb-6 group-hover:bg-boring-bright-green/20 dark:group-hover:bg-boring-bright-green/30 transition-colors">
                <div className="text-boring-bright-green">
                  {item.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-boring-charcoal dark:text-boring-light-gray mb-3">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-boring-dark-gray dark:text-boring-light-gray/80 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="mt-16 pt-16 border-t border-boring-mint/30 dark:border-boring-mint/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-boring-purple mb-2">
                500+
              </div>
              <div className="text-sm text-boring-dark-gray dark:text-boring-light-gray/80">
                Boring Clients Helped
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-boring-purple mb-2">
                40+
              </div>
              <div className="text-sm text-boring-dark-gray dark:text-boring-light-gray/80">
                Lender Partners
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-boring-purple mb-2">
                24h
              </div>
              <div className="text-sm text-boring-dark-gray dark:text-boring-light-gray/80">
                Average Approval Time
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-boring-purple mb-2">
                0
              </div>
              <div className="text-sm text-boring-dark-gray dark:text-boring-light-gray/80">
                Surprise Fees
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;