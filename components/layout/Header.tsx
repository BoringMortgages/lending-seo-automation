import React from 'react';
import Link from 'next/link';
import { CONTACT_CONFIG } from '../../config/contact';

interface HeaderProps {
  showNavigation?: boolean;
  currentPage?: string;
  variant?: 'default' | 'city' | 'calculator';
}

const Header: React.FC<HeaderProps> = ({ 
  showNavigation = true,
  currentPage,
  variant = 'default'
}) => {
  const getHeaderStyle = () => {
    switch (variant) {
      case 'city':
      case 'default':
        return {
          headerClass: "backdrop-blur-md bg-white/80 shadow-lg border-b border-white/20 sticky top-0 z-50",
          logoGradient: "linear-gradient(to right, #264653, #2A9D8F)",
          titleClass: "text-3xl font-heading",
          titleColor: "#222831",
          subtitleColor: "#264653",
          navColor: "#264653",
          buttonColor: "#FF914D"
        };
      case 'calculator':
        return {
          headerClass: "backdrop-blur-md bg-white/80 shadow-lg border-b border-white/20 sticky top-0 z-50",
          logoGradient: "linear-gradient(to right, #475569, #1e293b)",
          titleClass: "text-2xl font-bold text-gray-900",
          titleColor: "#111827",
          subtitleColor: "#6b7280",
          navColor: "#6b7280",
          buttonColor: "#475569"
        };
      default:
        return {
          headerClass: "backdrop-blur-md bg-white/80 shadow-lg border-b border-white/20 sticky top-0 z-50",
          logoGradient: "linear-gradient(to right, #264653, #2A9D8F)",
          titleClass: "text-3xl font-heading",
          titleColor: "#222831",
          subtitleColor: "#264653",
          navColor: "#264653",
          buttonColor: "#FF914D"
        };
    }
  };

  const styles = getHeaderStyle();

  return (
    <header className={styles.headerClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center" 
              style={{background: styles.logoGradient}}
            >
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <div>
              <h1 className={styles.titleClass} style={{color: styles.titleColor}}>
                Boring Mortgages Ontario
              </h1>
              <p className="text-sm" style={{color: styles.subtitleColor}}>Making complex mortgages boringly simple</p>
            </div>
          </Link>

          {/* Navigation */}
          {showNavigation && (
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex items-center space-x-4">
                <Link 
                  href="/" 
                  className={`font-medium hover:opacity-80 transition-colors ${
                    currentPage === 'home' ? 'opacity-100' : ''
                  }`}
                  style={{color: styles.navColor}}
                >
                  Home
                </Link>
                {variant === 'calculator' && (
                  <>
                    <Link 
                      href="/blog" 
                      className="font-medium hover:opacity-80 transition-colors"
                      style={{color: styles.navColor}}
                    >
                      Blog
                    </Link>
                    <Link 
                      href="/mortgage-affordability-calculator" 
                      className="font-medium hover:opacity-80 transition-colors"
                      style={{color: styles.navColor}}
                    >
                      Affordability Calculator
                    </Link>
                  </>
                )}
              </nav>
              
              <div className="flex items-center space-x-4">
                <a
                  href={CONTACT_CONFIG.consultationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 text-sm font-medium rounded-lg text-white hover:opacity-90 transition-opacity"
                  style={{backgroundColor: styles.buttonColor}}
                >
                  Book Consultation →
                </a>
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;