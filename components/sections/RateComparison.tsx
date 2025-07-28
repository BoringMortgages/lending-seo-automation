import React from 'react';

interface RateData {
  term: string;
  fixedRate: string;
  variableRate?: string;
  popular?: boolean;
}

interface RateComparisonProps {
  title?: string;
  subtitle?: string;
  rates?: RateData[];
  className?: string;
}

const defaultRates: RateData[] = [
  { term: '1 Year', fixedRate: '4.69%', popular: false },
  { term: '3 Year', fixedRate: '3.94%', popular: false },
  { term: '5 Year', fixedRate: '3.94%', variableRate: '3.95%', popular: true },
  { term: 'Variable', fixedRate: '—', variableRate: 'Prime - 1.00%', popular: false },
];

const RateComparison: React.FC<RateComparisonProps> = ({
  title = "Current Ontario Mortgage Rates",
  subtitle = "Current rates updated regularly",
  rates = defaultRates,
  className = ''
}) => {
  return (
    <section className={`py-16 bg-boring-content grain-texture-subtle ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-boring-charcoal dark:text-boring-light-gray mb-4 heading-serif">
            {title}
          </h2>
          <p className="text-lg text-boring-dark-gray dark:text-boring-light-gray/80">
            {subtitle}
          </p>
        </div>
        
        <div className="card-boring bg-white dark:bg-card rounded-2xl shadow-professional max-w-5xl mx-auto overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-boring-mint/30 dark:border-boring-mint/20">
                  <th className="text-left py-4 px-6 font-semibold text-boring-teal dark:text-boring-light-gray">
                    Term
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-boring-teal dark:text-boring-light-gray">
                    Fixed Rate
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-boring-teal dark:text-boring-light-gray">
                    Variable Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {rates.map((rate, index) => (
                  <tr 
                    key={index} 
                    className={`
                      border-b border-boring-mint/20 dark:border-boring-mint/10 transition-colors
                      ${rate.popular 
                        ? 'bg-boring-accent dark:bg-boring-accent' 
                        : index % 2 === 0 
                          ? 'bg-boring-light-gray/30 dark:bg-boring-charcoal/20' 
                          : 'bg-white dark:bg-transparent'
                      }
                      hover:bg-boring-mint/20 dark:hover:bg-boring-mint/10
                    `}
                  >
                    <td className="py-4 px-6 font-medium text-boring-charcoal dark:text-boring-light-gray">
                      <div>
                        {rate.popular && (
                          <span className="bg-boring-purple text-white text-xs font-medium px-2 py-1 rounded-full mr-2">
                            POPULAR
                          </span>
                        )}
                        <div className="font-semibold">{rate.term}</div>
                        {rate.variableRate && rate.term !== 'Variable' && (
                          <div className="text-xs text-boring-dark-gray dark:text-boring-light-gray/60 mt-1">
                            Fixed & Variable available
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="rate-display text-2xl font-bold text-boring-purple">
                        {rate.fixedRate}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {rate.variableRate ? (
                        <span className="rate-display text-2xl font-bold text-boring-bright-green">
                          {rate.variableRate}
                        </span>
                      ) : (
                        <span className="text-boring-dark-gray dark:text-boring-light-gray/60 text-2xl">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Disclaimer */}
          <div className="p-6 bg-boring-light-gray/50 dark:bg-boring-charcoal/30 border-t border-boring-mint/20">
            <p className="text-sm text-boring-dark-gray dark:text-boring-light-gray/80 mb-2">
              <strong className="text-boring-charcoal dark:text-boring-light-gray">
                Boring but important:
              </strong>{' '}
              Rates shown are best available for insured mortgages with 25-year amortization, 20% down payment, and semi-annual compounding. 
              Your rate depends on credit score, down payment, and property location.
            </p>
            <a 
              href="https://callme.mortgagewithford.ca" 
              className="text-boring-purple hover:text-boring-purple/80 font-medium text-sm transition-colors"
            >
              Get your personalized rate quote from Andreina Ford →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RateComparison;