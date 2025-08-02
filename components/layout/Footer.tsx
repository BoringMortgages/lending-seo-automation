import React from 'react';
import Link from 'next/link';
import { CONTACT_CONFIG } from '../../config/contact';

interface FooterProps {
  showRegulatory?: boolean;
}

const Footer: React.FC<FooterProps> = ({ showRegulatory = true }) => {
  return (
    <footer className="py-12 grain-texture" style={{backgroundColor: '#222831', color: '#F4F4F4'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(to right, #264653, #2A9D8F)'}}>
                <span className="text-white font-bold">B</span>
              </div>
              <h3 className="text-lg font-semibold">
                {CONTACT_CONFIG.business.name}
              </h3>
            </div>
            <p className="text-sm mb-4" style={{color: '#9CA3AF'}}>
              {CONTACT_CONFIG.business.tagline} for Ontario residents.
              <br />
              Not affiliated with any specific lender.
            </p>
            {showRegulatory && (
              <p className="text-xs" style={{color: '#6B7280'}}>
                <strong style={{color: '#6B7280'}}>{CONTACT_CONFIG.business.agentName}</strong><br/>
                {CONTACT_CONFIG.business.licenseTitle}<br/>
                {CONTACT_CONFIG.business.licenseNumber}
              </p>
            )}
          </div>

          {/* Free Tools */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Free Calculators
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link 
                  href="/mortgage-payment-calculator" 
                  className="hover:text-white transition-colors"
                >
                  Payment Calculator
                </Link>
              </li>
              <li>
                <Link 
                  href="/mortgage-affordability-calculator" 
                  className="hover:text-white transition-colors"
                >
                  Affordability Calculator
                </Link>
              </li>
              <li>
                <Link 
                  href="/heloc-payment-calculator" 
                  className="hover:text-white transition-colors"
                >
                  HELOC Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Ontario Cities */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Ontario Cities
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link 
                  href="/best-mortgage-rates-toronto" 
                  className="hover:text-white transition-colors"
                >
                  Toronto
                </Link>
              </li>
              <li>
                <Link 
                  href="/best-mortgage-rates-ottawa" 
                  className="hover:text-white transition-colors"
                >
                  Ottawa
                </Link>
              </li>
              <li>
                <Link 
                  href="/best-mortgage-rates-mississauga" 
                  className="hover:text-white transition-colors"
                >
                  Mississauga
                </Link>
              </li>
              <li>
                <Link 
                  href="/best-mortgage-rates-hamilton" 
                  className="hover:text-white transition-colors"
                >
                  Hamilton
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Help */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Get Help
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a 
                  href={CONTACT_CONFIG.consultationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors"
                >
                  {CONTACT_CONFIG.cta.consultation}
                </a>
              </li>
              <li>
                <a 
                  href={`mailto:${CONTACT_CONFIG.email}?subject=Mortgage questions`} 
                  className="hover:text-white transition-colors"
                >
                  {CONTACT_CONFIG.cta.email}
                </a>
              </li>
              <li>
                <a 
                  href={CONTACT_CONFIG.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <Link 
                  href="/" 
                  className="hover:text-white transition-colors"
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
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} {CONTACT_CONFIG.business.name}. Making Ontario mortgages boringly simple.
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <Link 
                    href="/privacy" 
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    Privacy
                  </Link>
                  <Link 
                    href="/terms" 
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    Terms
                  </Link>
                  <Link 
                    href="/disclaimer" 
                    className="text-gray-400 hover:text-white text-sm transition-colors"
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