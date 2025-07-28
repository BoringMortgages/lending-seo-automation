import React from 'react';
import Link from 'next/link';

interface FooterProps {
  showRegulatory?: boolean;
}

const Footer: React.FC<FooterProps> = ({ showRegulatory = true }) => {
  return (
    <footer className="bg-boring-dark-gray/90 dark:bg-boring-charcoal text-boring-light-gray py-12 grain-texture-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-boring-teal to-boring-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">B</span>
              </div>
              <h3 className="text-lg font-semibold text-boring-light-gray">
                Boring Mortgages Ontario
              </h3>
            </div>
            <p className="text-boring-light-gray/70 text-sm mb-4">
              Making complex mortgages boringly simple for Ontario residents.
              <br />
              Not affiliated with any specific lender.
            </p>
            {showRegulatory && (
              <p className="text-boring-light-gray/60 text-xs">
                <strong className="text-boring-light-gray">Andreina Ford</strong><br/>
                Mortgage Agent Level 2 • M24000357<br/>
                BRX Mortgage #13463
              </p>
            )}
          </div>

          {/* Free Tools */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-boring-light-gray">
              Free Calculators
            </h3>
            <ul className="space-y-2 text-boring-light-gray/70">
              <li>
                <Link 
                  href="/mortgage-payment-calculator" 
                  className="hover:text-boring-light-gray transition-colors"
                >
                  Payment Calculator
                </Link>
              </li>
              <li>
                <Link 
                  href="/mortgage-affordability-calculator" 
                  className="hover:text-boring-light-gray transition-colors"
                >
                  Affordability Calculator
                </Link>
              </li>
              <li>
                <Link 
                  href="/heloc-payment-calculator" 
                  className="hover:text-boring-light-gray transition-colors"
                >
                  HELOC Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Ontario Cities */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-boring-light-gray">
              Ontario Cities
            </h3>
            <ul className="space-y-2 text-boring-light-gray/70">
              <li>
                <Link 
                  href="/best-mortgage-rates-toronto" 
                  className="hover:text-boring-light-gray transition-colors"
                >
                  Toronto
                </Link>
              </li>
              <li>
                <Link 
                  href="/best-mortgage-rates-ottawa" 
                  className="hover:text-boring-light-gray transition-colors"
                >
                  Ottawa
                </Link>
              </li>
              <li>
                <Link 
                  href="/best-mortgage-rates-mississauga" 
                  className="hover:text-boring-light-gray transition-colors"
                >
                  Mississauga
                </Link>
              </li>
              <li>
                <Link 
                  href="/best-mortgage-rates-hamilton" 
                  className="hover:text-boring-light-gray transition-colors"
                >
                  Hamilton
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Help */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-boring-light-gray">
              Get Help
            </h3>
            <ul className="space-y-2 text-boring-light-gray/70">
              <li>
                <Link 
                  href="https://callme.mortgagewithford.ca" 
                  className="hover:text-boring-light-gray transition-colors"
                >
                  Book Consultation
                </Link>
              </li>
              <li>
                <Link 
                  href="mailto:hello@mortgagewithford.ca" 
                  className="hover:text-boring-light-gray transition-colors"
                >
                  Email Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/" 
                  className="hover:text-boring-light-gray transition-colors"
                >
                  Home
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Regulatory Logos */}
        {showRegulatory && (
          <div className="border-t border-boring-light-gray/20 mt-8 pt-8">
            <div className="flex flex-col items-center space-y-6">
              <div className="flex items-center justify-center space-x-8 flex-wrap">
                {/* BRX Mortgage Logo */}
                <div className="flex items-center space-x-2">
                  <div className="text-boring-bright-green text-xl font-bold">
                    BRX
                  </div>
                  <div className="text-boring-light-gray/60 text-xs">
                    BRX MORTGAGE<br/>
                    #13463
                  </div>
                </div>
                
                {/* Proudly Canadian */}
                <div className="flex items-center space-x-2">
                  <div className="text-red-500 text-2xl">
                    🍁
                  </div>
                  <div className="text-boring-light-gray/60 text-xs">
                    PROUDLY<br/>
                    CANADIAN
                  </div>
                </div>
                
                {/* CMHC */}
                <div className="flex items-center space-x-2">
                  <div className="text-boring-purple font-bold text-sm">
                    CMHC
                  </div>
                  <div className="text-boring-light-gray/60 text-xs">
                    CANADA MORTGAGE<br/>
                    & HOUSING CORP
                  </div>
                </div>
                
                {/* FSRA */}
                <div className="flex items-center space-x-2">
                  <div className="text-boring-bright-green font-bold text-sm">
                    FSRA
                  </div>
                  <div className="text-boring-light-gray/60 text-xs">
                    FINANCIAL SERVICES<br/>
                    REGULATORY AUTHORITY
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-center w-full">
                <p className="text-boring-light-gray/60 text-sm">
                  © {new Date().getFullYear()} Boring Mortgages Ontario. Making mortgages boringly simple.
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <Link 
                    href="/privacy" 
                    className="text-boring-light-gray/60 hover:text-boring-light-gray text-sm transition-colors"
                  >
                    Privacy
                  </Link>
                  <Link 
                    href="/terms" 
                    className="text-boring-light-gray/60 hover:text-boring-light-gray text-sm transition-colors"
                  >
                    Terms
                  </Link>
                  <Link 
                    href="/disclaimer" 
                    className="text-boring-light-gray/60 hover:text-boring-light-gray text-sm transition-colors"
                  >
                    Disclaimer
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;